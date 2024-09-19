import React, { useState, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

const Alert = ({ message, severity, duration = 3000, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={duration} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        maxWidth: '80%', // Adjust this value as needed
        width: 'fit-content',
      }}
    >
      <MuiAlert 
        onClose={handleClose} 
        severity={severity} 
        sx={{ width: '100%', marginTop: '50px' }} 
        elevation={6} 
        variant="filled"
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;