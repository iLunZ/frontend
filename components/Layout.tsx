'use client'

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Authentication System' }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    router.push('/profile');
  };

  const handleDashboard = () => {
    handleClose();
    router.push('/dashboard');
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const AuthButtons = () => (
    <>
      <Button color="inherit" onClick={() => router.push('/login')}>
        Login
      </Button>
      <Button color="inherit" onClick={() => router.push('/register')}>
        Register
      </Button>
    </>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            {title}
          </Typography>
          
          {mounted && isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ) : mounted && !isAuthenticated ? (
            <AuthButtons />
          ) : null}
        </Toolbar>
      </AppBar>
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
      
    </Box>
  );
}
