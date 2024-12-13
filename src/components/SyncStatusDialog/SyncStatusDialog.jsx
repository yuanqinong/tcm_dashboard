import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { getSyncStatus } from '../../Redux/actions/ContentManagerAction';

const SyncStatusDialog = ({ open, onClose, showAlert }) => {
  const [syncStatusData, setSyncStatusData] = useState({
    totalFiles: 0,
    processedFiles: 0,
    files: [],
    startedBy: null,
    startTime: null,
    status: null
  });

  const fetchSyncStatus = async () => {
    try {
      const response = await getSyncStatus();
      console.log("data", response);
      
      if (response) {
        setSyncStatusData({
          totalFiles: response.total_files,
          processedFiles: response.files.filter(file => file.status === 'completed').length,
          files: response.files.map(file => ({
            filename: file.filename,
            status: file.status,
            start_time: file.start_time,
            end_time: file.end_time,
            processing_duration_seconds: file.processing_duration_seconds,
            error: file.error
          })),
          startedBy: response.username,
          startTime: response.start_time,
          status: response.status
        });
      } else {
        setSyncStatusData({
          totalFiles: 0,
          processedFiles: 0,
          files: [],
          startedBy: null,
          startTime: null,
          status: null
        });
      }
    } catch (error) {
      console.error("Sync status error:", error);
      showAlert?.("Failed to fetch sync status", "error");
    }
  };

  useEffect(() => {
    let interval;
    if (open) {
      fetchSyncStatus();
      interval = setInterval(fetchSyncStatus, 5000); // Update every 5 seconds
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open]);

  const progress = (syncStatusData.processedFiles / syncStatusData.totalFiles) * 100;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Sync Status
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            {syncStatusData?.status === 'completed' 
              ? "All Completed"
              : syncStatusData?.status === 'failed'
                ? "Sync failed. Please try again."
                : `Currently Processing ${syncStatusData.processedFiles} of ${syncStatusData.totalFiles} files`
            }
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: syncStatusData?.status === 'failed' ? 'error.light' : undefined,
              '& .MuiLinearProgress-bar': {
                backgroundColor: syncStatusData?.status === 'failed' ? 'error.main' : undefined
              }
            }}
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {syncStatusData.files.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.filename || 'N/A'}</TableCell>
                  <TableCell>
                    <Typography
                      color={
                        file.status?.toLowerCase() === 'completed' ? 'success.main' :
                        file.status?.toLowerCase() === 'processing' ? 'primary.main' :
                        file.status?.toLowerCase() === 'pending' ? 'text.secondary' : 
                        'error.main'
                      }
                    >
                      {file.status || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>{new Date(file.start_time).toLocaleString() || 'N/A'}</TableCell>
                  <TableCell>{file.end_time ? new Date(file.end_time).toLocaleString() : 'N/A'}</TableCell>
                  <TableCell>{file.processing_duration_seconds ? `${file.processing_duration_seconds.toFixed(2)}s` : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          Sync started by: {syncStatusData.startedBy || 'N/A'}
          <br />
          Start time: {syncStatusData.startTime ? new Date(syncStatusData.startTime).toLocaleString() : 'N/A'}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SyncStatusDialog;
