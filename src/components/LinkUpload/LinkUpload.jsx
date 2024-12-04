import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from '../AlertComponent/alert';
import { uploadLinks } from "../../Redux/actions/ContentManagerAction";

const LinkUpload = ({onUploadComplete}) => {
  const [inputUrl, setInputUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [linkErrorMessage, setLinkErrorMessage] = useState("");
  const [alert, setAlert] = useState(null);

  const showAlert = (message, severity) => {
    setAlert({ message, severity});
  };

  const closeAlert = () => {
    setAlert(null);
  };
  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleUploadLink = async () => {
    setUploading(true);
    try {
      const result = await uploadLinks(links);
      if (result) {
        showAlert(`${result.message}. Please index the links in the knowledge base.`, "success");
        setLinks([]);
        onUploadComplete(); // Call this after successful upload
      }
    } catch (error) {
      console.error("Upload failed:", error);
      showAlert("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call your function to handle the link submission
      handleLinkSubmit();
    }
  };

  const handleLinkSubmit = () => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const trimmedUrl = inputUrl.trim();
    
    if (trimmedUrl !== "" && urlPattern.test(trimmedUrl)) {
      if (links.includes(trimmedUrl)) {
        setLinkErrorMessage("*This link has already been added");
        setLinkError(true);
      } else {
        setLinkError(false);
        setLinkErrorMessage("");
        setLinks([...links, trimmedUrl]);
        setInputUrl(""); // Clear the input field after adding
      }
    } else {
      setLinkErrorMessage("*Please enter a valid URL");
      setLinkError(true);
    }
  };

  const handleCancel = () => {
    setLinks([]);
    setInputUrl("");
  };

  return (
    <Box sx={{marginLeft: 3, marginBottom: 5, marginRight: 3}}>
      <Box >
        <Typography variant="body1" gutterBottom>
          Or add Website URL
        </Typography>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            mb: 2,
            width: "100%",
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <TextField
            fullWidth
            variant="standard"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="http://"
            slotProps={{ input: { disableUnderline: true } }}
            sx={{ ml: 1, flex: 1 }}
            onKeyDown={handleKeyPress}
          />
          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="add"
            onClick={handleLinkSubmit}
          >
            <AddIcon />
          </IconButton>
        </Paper>
        {linkError && (
          <Typography variant="caption" sx={{ color: "red" }}>
            {linkErrorMessage}
          </Typography>
        )}
        {links.length > 0 && (
          <Paper
            sx={{ mt: 2, maxHeight: 300, overflow: "auto", width: "100%" }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                p: 2,
                fontWeight: "bold",
                position: "sticky",
                top: 0,
                backgroundColor: "background.paper",
                zIndex: 1,
              }}
            >
              Added links - {links.length}{" "}
              {links.length === 1 ? "link" : "links"}
            </Typography>
            <List>
              {links.map((link, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteLink(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={link}
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                  {index < links.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Box>
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
          onClick={handleUploadLink}
          disabled={uploading || links.length === 0}
          loading={uploading}
          loadingIndicator="Uploading..."
        >
          Upload Links
        </LoadingButton>
        <Button
          variant="text"
          onClick={handleCancel}
          disabled={uploading || links.length === 0}
        >
          Cancel
        </Button>
      </Stack>
      {alert && (
      <div className="alert-container">
        <Alert
          message={alert.message}
          severity={alert.severity}
          onClose={() => {closeAlert()}}
        />
        </div>
      )}
    </Box>
  );
};

export default LinkUpload;
