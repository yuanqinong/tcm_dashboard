import React, { useState, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert, Button } from '@mui/material';

const Alert = ({ message, severity, duration = 3000, onClose }) => {

  return (
    <Snackbar 
      open={true}
      onClose={onClose}
      autoHideDuration={duration} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        maxWidth: '80%', // Adjust this value as needed
        width: 'fit-content',
      }}
    >
      <MuiAlert 
        severity={severity} 
        sx={{ width: '100%', marginTop: '50px' }} 
        elevation={6} 
        variant="filled"
        onClose={onClose}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;