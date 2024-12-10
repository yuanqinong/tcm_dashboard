import React, { useState, useEffect } from "react";
import {
  getUploadedFiles,
  deleteFiles,
  downloadFiles,
  getUploadedLinks,
  syncKnowledgeBase,
  deleteSelectedEmbedding,
  deleteLinks,
  checkActiveSyncSession,
} from "../../Redux/actions/ContentManagerAction";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Stack, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "../AlertComponent/alert";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import Typography from "@mui/material/Typography";
import Confirmation from "../Confirmation/Confirmation";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import "./FileListTable.css";
import SyncStatusDialog from '../SyncStatusDialog/SyncStatusDialog';

function FileList({ refreshTrigger }) {
  const [uploadedData, setUploaded] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [syncStatus, setSyncStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [previewStatus, setPreviewStatus] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState({ files: [], links: [] });
  const [enableOCR, setEnableOCR] = useState(false);
  const [syncStatusOpen, setSyncStatusOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUploaded();
      } catch (error) {
        if (error.response?.status === 401) {
          showAlert("Please login to continue", "error");
          navigate('/login');
        } else {
          showAlert("Error fetching files", "error");
        }
      }
    };

    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const checkInitialSyncStatus = async () => {
      try {
        const activeSyncSession = await checkActiveSyncSession();
        if (Array.isArray(activeSyncSession) && activeSyncSession.length > 0) {
          setSyncStatus(true);
        }
      } catch (error) {
        console.error("Failed to check initial sync status:", error);
      }
    };

    checkInitialSyncStatus();
  }, []);

  useEffect(() => {
    const processedData = preprocessData(uploadedData);
    setProcessedData(processedData);
  }, [uploadedData]);

  const showAlert = (message, severity) => {
    setAlert({ message, severity });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleDeleteClick = (id) => {
    setConfirmationMessage(
      "Are you sure you want to delete selected item(s)? This action will delete the selected item(s) from the knowledge base."
    );
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteStatus(true);
    setConfirmationOpen(false);
    try {
      const deletePromises = [];

      if (selectedItems.files.length > 0) {
        deletePromises.push(handleDeleteFiles(selectedItems.files));
      }
      if (selectedItems.links.length > 0) {
        deletePromises.push(handleDeleteLinks(selectedItems.links.map(link => link.id)));
      }

      await Promise.all(deletePromises);
      showAlert("Items deleted successfully", "success");
    } catch (error) {
      console.error("Error during deletion:", error);
      showAlert("An error occurred during deletion", "error");
    } finally {
      setDeleteStatus(false);
      fetchUploaded(); // Refresh the list after deletion
    }
  };

  const handleCancelDelete = () => {
    setConfirmationOpen(false);
  };

  const fetchUploaded = async () => {
    try {
      const files = await getUploadedFiles();
      const links = await getUploadedLinks(); // You'll need to implement this function
      const combinedData = [...files, ...links];
      setUploaded(combinedData);
    } catch (error) {
      console.error("Failed to fetch uploaded files and links:", error);
      showAlert("Failed to fetch uploaded files and links", "error");
    }
  };

  const preprocessData = (data) => {
    return data.map((item) => {
      const processedItem = {
        id: item.id,
        uploadDate: new Date(item.upload_date).toLocaleString("en-US"),
        Synced: item.Synced,
      };
  
      if (item.filename) {
        processedItem.filename = item.filename;
      }
  
      if (item.url) {
        processedItem.url = item.url;
      }
  
      return processedItem;
    });
  };

  const handleDeleteFiles = async (fileIds) => {
    try {
      const fileIdsArray = Array.isArray(fileIds) ? fileIds : [fileIds];
      const delete_file_result = await deleteFiles(fileIdsArray);
      await deleteSelectedEmbedding(fileIdsArray);
      showAlert(delete_file_result.message, "success");
    } catch (error) {
      console.error("Failed to delete files:", error);
      showAlert("Failed to delete files", "error");
    }
  };

  const handleDeleteLinks = async (linkIds) => {
    try {
      const linkIdsArray = Array.isArray(linkIds) ? linkIds : [linkIds];
      const delete_link_result = await deleteLinks(linkIdsArray);
      await deleteSelectedEmbedding(linkIdsArray);
      showAlert(delete_link_result.message, "success");
    }
    catch (error) {
      console.error("Failed to delete links:", error);
      showAlert("Failed to delete links", "error");
    }
  };

  const handleDownload = async (fileIds) => {
    try {
      const fileIdsArray = Array.isArray(fileIds) ? fileIds : [fileIds];
      const { blob, contentDisposition } = await downloadFiles(fileIdsArray);
      // Get the filename from the Content-Disposition header
      let filename = "downloaded_file";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=(.*?)(;|$)/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
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
  };

  const handleViewClick = (urls) => {
    if (typeof urls === 'string') {
      // If it's a single URL
      window.open(urls, "_blank");
    } else if (Array.isArray(urls)) {
      // If it's an array of URLs
      urls.forEach(url => {
        window.open(url, "_blank");
      });
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 500,
      renderCell: (params) => params.row.filename || params.row.url,
    },
    { field: "uploadDate", headerName: "Upload Date", width: 200 },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (params.row.filename ? "File" : "Website"),
    },
    /*
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" marginTop={1}>
          {params.row.filename && (
            <IconButton
              onClick={() => handleDownload(params.row.id, params.row.filename)}
            >
              <DownloadIcon color="action" />
            </IconButton>
          )}
          {params.row.url && (
            <IconButton onClick={() => handleViewClick(params.row.url)}>
              <PageviewIcon color="action" />
            </IconButton>
          )}
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Stack>
      ),
    },
    */
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) =>
        params.row.Synced ? (
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
      const activeSyncSession = await checkActiveSyncSession();
      console.log(activeSyncSession);
      // Check if the response is an empty array or has no active sessions
      if (Array.isArray(activeSyncSession) && activeSyncSession.length === 0) {
        setSyncStatus(true);
        const response = await syncKnowledgeBase({ enableOCR });
        if (response.data.message) {
          showAlert(response.data.message, "success");
        } else {
          showAlert(response.data.error, "error");
        }
      } else {
        showAlert("An active sync session is already running. Please wait for it to complete before starting a new sync.", "error");
        return;
      }
    } catch (error) {
      console.error("Sync error:", error);
      showAlert("Failed to sync knowledge base", "error");
    } finally {
      setSyncStatus(false);
      fetchUploaded();
    }
  };

  const handleBatchPreview = async () => {
    try {
      setPreviewStatus(true);
      if (selectedItems.files.length > 0) {
        await handleDownload(selectedItems.files);
      }
      if (selectedItems.links.length > 0) {
        handleViewClick(selectedItems.links.map(link => link.url));
      }
    }
    catch (error) {
      console.error("Failed to download file:", error);
      showAlert("Failed to preview selected items. Please try again later.", "error");
    }
    setPreviewStatus(false);
  }

  return (
    <div className="file-list-container">
      <h2>Knowledge Base</h2>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", marginLeft: 2 }}
      >
        <div className="file-list-download-delete-button-container">
          {(selectedItems.files.length > 0 || selectedItems.links.length > 0) && (
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleBatchPreview}
                loading={previewStatus}
                loadingIndicator="Processing..."
              >
                Preview Selected
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                loading={deleteStatus}
                loadingIndicator="Deleting..."
              >
                Delete Selected
              </LoadingButton>
            </Stack>
          )}
        </div>
        <div className="file-list-button-container">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="When enabled, the system will analyze images within documents for text content. This may increase processing time. Now only supports PDF and DOCX files." placement="top">
                  <InfoIcon color="action" sx={{ fontSize: 20 }} />
                </Tooltip>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableOCR}
                    onChange={(e) => setEnableOCR(e.target.checked)}
                    name="enableOCR"
                  />
                }
                label="Image OCR"
              />
            </Box>
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
              onClick={() => setSyncStatusOpen(true)}
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
              const selectedFiles = [];
              const selectedLinks = [];

              newRowSelectionModel.forEach((id) => {
                const item = processedData.find((row) => row.id === id);
                if (item.filename) {
                  selectedFiles.push(id);
                } else if (item.url) {
                  selectedLinks.push({ id: id, url: item.url });
                }
              });

              setSelectedItems({ files: selectedFiles, links: selectedLinks });
            }}
            rowSelectionModel={[
              ...selectedItems.files,
              ...selectedItems.links.map(link => link.id)
            ]}
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
      <SyncStatusDialog
        open={syncStatusOpen}
        onClose={() => setSyncStatusOpen(false)}
        showAlert={showAlert}
      />
    </div>
  );
}

export default FileList;
