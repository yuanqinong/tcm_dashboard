import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/actions/LoginAction';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const pages = [''];
const settings = ['Logout'];

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear the cookie
      const response = await logout();
      if (response.status === 200) {  
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Navigate to login anyway since we want to exit the session
      navigate('/login');
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TCM
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Logout">
              <IconButton
                onClick={handleLogout}
                sx={{ color: 'white' }}
                size="large"
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;
