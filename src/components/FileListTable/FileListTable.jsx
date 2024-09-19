import React, { useState, useEffect } from "react";
import {
  getUploadedFiles,
  deleteFiles,
  downloadFiles,
} from "../../Redux/actions/ContentManagerAction";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Stack } from "@mui/material";
import useAlert from "../AlertComponent/useAlert";
import Alert from "../AlertComponent/alert";
import "./FileListTable.css";

function FileList({ refreshTrigger }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { alertState, showAlert, clearAlert } = useAlert();

  useEffect(() => {
    fetchUploadedFiles();
  }, [refreshTrigger]);

  useEffect(() => {
    const processedData = preprocessData(uploadedFiles);
    setProcessedData(processedData);
  }, [uploadedFiles]);

  const fetchUploadedFiles = async () => {
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error("Failed to fetch uploaded files:", error);
      showAlert("Failed to fetch uploaded files", "error");
    }
  };

  const preprocessData = (data) => {
    return data.map((item) => ({
      id: item.file_id,
      filename: item.filename,
      uploadDate: new Date(item.upload_date).toLocaleString(),
    }));
  };

  const handleDelete = async (fileIds) => {
    try {
      const result = await deleteFiles(fileIds);
      showAlert(result.message, "success");
      fetchUploadedFiles(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete files:", error);
      showAlert("Failed to delete files", "error");
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await downloadFiles(fileId);

      // The response.data should already be a Blob
      const blob = response.data;

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);

      // Append to the document body and click programmatically
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      showAlert("File downloaded successfully", "success");
    } catch (error) {
      console.error("Failed to download file:", error);
      showAlert("Failed to download file", "error");
    }
  };

  const columns = [
    { field: "filename", headerName: "File Name", width: 500 },
    { field: "uploadDate", headerName: "Upload Date", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="text"
            onClick={() => handleDownload(params.row.id, params.row.filename)}
          >
            Download
          </Button>
          <Button
            variant="text"
            onClick={() => handleDelete([params.row.id])}
            sx={{ color: "red" }}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedFiles(newSelection);
  };

  return (
    <div className="file-list-container">
      <h2>Knowledge Base</h2>
      <div className="file-list-button-container">
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
          onClick={() => {}}
          sx={{ marginBottom: 2 }}
        >
            Sync Database
          </Button>
          <Button
            variant="outlined"
          onClick={() => {}}
          sx={{ marginBottom: 2 }}
        >
            Check Sync Status
          </Button>
        </Stack>
      </div>
      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={processedData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          onSelectionModelChange={handleSelectionChange}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
      <Alert
        message={alertState.message}
        severity={alertState.severity}
        duration={5000}
        onClose={clearAlert}
      />
    </div>
  );
}

export default FileList;
