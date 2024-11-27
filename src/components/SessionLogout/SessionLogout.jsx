import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import { logout } from '../../Redux/actions/LoginAction';

export default function SessionLogout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const handleSessionExpired = () => {
      setOpen(true);
    };

    // Listen for the custom sessionExpired event
    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, []);

  const handleClose = async () => {
    try {
      // Call logout endpoint to clear the cookie
      const response = await logout();
        if (response.status === 200) {  
        setOpen(false);
        navigate('/login');
      }
      } catch (error) {
      console.error('Logout failed:', error);
      // Navigate to login anyway since we want to exit the session
      navigate('/login');
    }
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Session Expired"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your session has expired. Please log in again to continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
  )
}