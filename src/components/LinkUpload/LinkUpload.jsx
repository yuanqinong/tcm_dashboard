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

const LinkUpload = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
  };

  const handleAddLink = () => {
    if (inputUrl.trim() !== "") {
      setLinks([...links, inputUrl]);
      setInputUrl("");
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
    // Implement the logic for handling the link submission
    // For now, just call handleAddLink
    handleAddLink();
  };

  useEffect(() => {
    console.log(links);
  }, [links]);

  return (
    <Box>
      <Box sx={{ width: "98%", marginLeft: 3, marginBottom: 5 }}>
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
            onClick={handleAddLink}
          >
            <AddIcon />
          </IconButton>
        </Paper>
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
              {links.length === 1 ? "file" : "files"}
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
          marginRight: 4,
        }}
      >
        <LoadingButton
          variant="contained"
          size="medium"
          onClick={() => {}}
          disabled={uploading || links.length === 0}
          loading={uploading}
          loadingIndicator="Uploading..."
        >
          Upload Links
        </LoadingButton>
        <Button
          variant="text"
          onClick={() => {}}
          disabled={uploading || links.length === 0}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default LinkUpload;
