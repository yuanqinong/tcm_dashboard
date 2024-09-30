import React, { useState, useEffect } from "react";
import {
  getUploadedFiles,
  deleteFiles,
  downloadFiles,
  syncKnowledgeBase,
  deleteSelectedEmbedding,
} from "../../Redux/actions/ContentManagerAction";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "../AlertComponent/alert";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DownloadIcon from "@mui/icons-material/Download";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Confirmation from "../Confirmation/Confirmation";
import "./FileListTable.css";

function FileList({ refreshTrigger }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncStatus, setSyncStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [filesToDelete, setFilesToDelete] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    fetchUploadedFiles();
  }, [refreshTrigger]);

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  useEffect(() => {
    const processedData = preprocessData(uploadedFiles);
    setProcessedData(processedData);
  }, [uploadedFiles]);

  const showAlert = (message, severity) => {
    setAlert({ message, severity });
  };

  const closeAlert = () => {
    setAlert(null);
  };
  
  const handleDeleteClick = (fileId) => {
    setFilesToDelete([fileId]);
    setConfirmationMessage("Are you sure you want to delete this file? This action will delete the file from the knowledge base.");
    setConfirmationOpen(true);
  };

  const handleDeleteSelectedClick = () => {
    setFilesToDelete(selectedFiles);
    setConfirmationMessage(`Are you sure you want to delete ${selectedFiles.length} selected file(s)? This action will delete the file from the knowledge base.`);
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (filesToDelete) {
      handleDelete(filesToDelete);
    }
    setConfirmationOpen(false);
    setFilesToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmationOpen(false);
    setFilesToDelete(null);
  };

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
      uploadDate: new Date(
        new Date(item.upload_date).getTime() + 8 * 60 * 60 * 1000
      ).toLocaleString("en-US", { timeZone: "Asia/Singapore" }),
      sync: item.Synced,
    }));
  };

  const handleDelete = async (fileIds) => {
    try {
      setDeleteStatus(true);
      const fileIdsArray = Array.isArray(fileIds) ? fileIds : [fileIds];
      const delete_file_result = await deleteFiles(fileIdsArray);
      await deleteSelectedEmbedding(fileIdsArray);
      showAlert(delete_file_result.message, "success");
      fetchUploadedFiles(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete files:", error);
      showAlert("Failed to delete files", "error");
    }
    setDeleteStatus(false);
  };

  const handleDownload = async (fileIds) => {
    try {
      setDownloadStatus(true);
      const fileIdsArray = Array.isArray(fileIds) ? fileIds : [fileIds];
      console.log(fileIdsArray);
      const { blob, contentDisposition } = await downloadFiles(fileIdsArray);
      console.log(contentDisposition);
      // Get the filename from the Content-Disposition header
      let filename = 'downloaded_file';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.*?)(;|$)/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

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
    setDownloadStatus(false);
  };

  const columns = [
    { field: "filename", headerName: "File Name", width: 500 },
    { field: "uploadDate", headerName: "Upload Date", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" marginTop={1}>
          <IconButton
            onClick={() => handleDownload(params.row.id, params.row.filename)}
          >
            <DownloadIcon color="action" />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) =>
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
        ),
    },
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
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", marginLeft: 2 }}
      >
        <div className="file-list-download-delete-button-container">
          {selectedFiles.length > 0 && (
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={() => handleDownload(selectedFiles)}
                loading={downloadStatus}
                loadingIndicator="Processing..."
              >
                Download Selected Files
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                color="error"
                onClick={handleDeleteSelectedClick}
                loading={deleteStatus}
                loadingIndicator="Deleting..."
              >
                Delete Selected Files
              </LoadingButton>
            </Stack>
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
            <Button variant="outlined" onClick={() => {}} disabled>
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
      <Confirmation
        handleOpen={confirmationOpen}
        handleClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description={confirmationMessage}
        confirmText="Delete"
        rejectText="Cancel"
      />
      {alert && (
        <div className="alert-container">
          <Alert
            message={alert.message}
            severity={alert.severity}
            duration={3000}
            onClose={closeAlert}
          />
        </div>
      )}
    </div>
  );
}

export default FileList;
