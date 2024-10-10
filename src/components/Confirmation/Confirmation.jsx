import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Confirmation({ handleOpen, handleClose, onConfirm, title, description, confirmText, rejectText }) {
  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="error">{confirmText}</Button>
        <Button onClick={handleClose} autoFocus>
          {rejectText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Confirmation;
