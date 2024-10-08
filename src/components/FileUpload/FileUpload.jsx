import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFiles } from "../../Redux/actions/ContentManagerAction";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Stack
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Alert from '../AlertComponent/alert';
import "./FileUpload.css";

function FileUpload({ onUploadComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/csv": [".csv"],
      "text/plain": [".txt"],
    },
  });

  const showAlert = (message, severity) => {
    setAlert({ message, severity});
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const result = await uploadFiles(files);
      if (result) {
        showAlert(`${result.message}. Please index the files in the knowledge base.`, "success");
        setFiles([]);
        onUploadComplete(); // Call this after successful upload
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showAlert("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFiles([]);
  };


  return (
    <div className="file-upload">
      <div className="file-upload-container">
        <h2>Upload</h2>
        <div className="dropzone-container">
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <div className="upload-icon">
              <span className="file-icon pdf-icon">PDF</span>
            </div>
            <p>
              Drag & drop files or <span className="browse-text">Browse</span>
            </p>
            <p className="file-types">Supported formats: PDF, Word (DOCX), CSV, TXT</p>
          </div>
        </div>
        
        {files.length > 0 && (
          <div className="file-list-container">
            <h3>Selected files - {files.length} files</h3>
            <div className="file-list">
              {files.map((file, index) => (
                <List
                  sx={{
                    width: "100%",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <ListItem
                    key={file.name}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFile(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </ListItem>
                </List>
              ))}
            </div>
          </div>
        )}
        <div className="button-container"> 
          <Stack
            direction="row"
            spacing={2}
            sx={{
              marginTop: "2rem",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <LoadingButton
              variant="contained"
              size="medium"
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              loading={uploading}
              loadingIndicator="Uploading..."
              sx={{ width: "100%" }}
            >
              Upload Files
            </LoadingButton>
            <Button
              variant="text"
              onClick={handleCancel}
              disabled={uploading || files.length === 0}
            >
              Cancel
            </Button>
          </Stack>
        </div>
      </div>
      {alert && (
      <div className="alert-container">
        <Alert
          message={alert.message}
          severity={alert.severity}
          onClose={() => {closeAlert()}}
        />
        </div>
      )}
    </div>
  );
}

export default FileUpload;
