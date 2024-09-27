import React, { useState, useEffect } from "react";
import {
  getUploadedFiles,
  deleteFiles,
  downloadFiles,
  syncKnowledgeBase,
  deleteSelectedEmbedding
} from "../../Redux/actions/ContentManagerAction";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Stack } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import useAlert from "../AlertComponent/useAlert";
import Alert from "../AlertComponent/alert";
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import "./FileListTable.css";

function FileList({ refreshTrigger }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const { alertState, showAlert} = useAlert();

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
      uploadDate: new Date(new Date(item.upload_date).getTime() + 8 * 60 * 60 * 1000).toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
      sync: item.Synced,
    }));
  };

  const handleDelete = async (fileIds) => {
    try {
      setDeleteStatus(true);
      const delete_file_result = await deleteFiles(fileIds);
      const delete_embedding_result = await deleteSelectedEmbedding(fileIds);
      showAlert(delete_file_result.message, "success");
      fetchUploadedFiles(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete files:", error);
      showAlert("Failed to delete files", "error");
    }
    setDeleteStatus(false);
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
        <Stack direction="row" spacing={1} marginTop={1}>
          <IconButton color="action" onClick={() => handleDownload(params.row.id, params.row.filename)}>
            <DownloadIcon color="action"/>
          </IconButton>
        </Stack>
      ),
    },
    { field: "status", headerName: "Status", width: 200, renderCell: (params) => (
      params.row.sync ? (
        <Stack direction="row" spacing={1} marginTop={1.5}>
          <CloudDoneIcon color="success" />
          <Typography>Synced</Typography>
        </Stack>
        
      ) : (
        <Stack direction="row" spacing={1} marginTop={1.5}>
          <CloudOffIcon color="disabled" />
          <Typography>Not Synced</Typography>
        </Stack>
      )
    )},
  ];

  const handleSync = async () => {
    try {
      setSyncStatus(true);
      const response = await syncKnowledgeBase();
      if (response.status === 200) {

        showAlert(response.data.message, "success");
      } else {
        showAlert(response.data.error, "error");
      }
    } catch (error) {
      showAlert("Failed to sync knowledge base", "error");
    }
    setSyncStatus(false);
    fetchUploadedFiles();
  };

  return (
    <div className="file-list-container">
      <h2>Knowledge Base</h2>
      <Stack direction="row" sx={{justifyContent: "space-between", marginLeft: 2}}>
        <div className="file-list-delete-button-container">
            {selectedFiles.length > 0 && (
              <LoadingButton
                variant="outlined"
                color="error"
                onClick={() => handleDelete(selectedFiles)}
                loading={deleteStatus}
                loadingIndicator="Deleting..."
              >
                Delete Selected Files
              </LoadingButton>
            )}
        </div>
        <div className="file-list-button-container">
          <Stack direction="row" spacing={2}>
            <LoadingButton
              variant="contained"
              onClick={handleSync}
              loading={syncStatus}
              loadingIndicator="Syncing..."
            >
              Sync Knowledge Base
            </LoadingButton>
            <Button
              variant="outlined"
            onClick={() => {}}
            disabled
          >
              Check Sync Status
            </Button>
          </Stack>
        </div>
      </Stack>
      <div className="file-list-table-container">
        <Paper sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={processedData}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setSelectedFiles(newRowSelectionModel);
            }}
            rowSelectionModel={selectedFiles}
            sx={{ border: 0 }}
          />
        </Paper>
      </div>
      <Alert
        message={alertState.message}
        severity={alertState.severity}
        duration={5000}
      />
    </div>
  );
}

export default FileList;
