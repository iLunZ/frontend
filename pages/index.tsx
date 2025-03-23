import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { 
  Typography, 
  Button, 
  Paper,
  Grid,
  Box} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useRouter } from 'next/router';

export default function Home() {
  const { isAuthenticated } = useAuth();
  console.log('isAuthenticated:', isAuthenticated);
  const router = useRouter();

  return (
    <Layout>
      <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the Authentication System
          </Typography>
          <Typography variant="body1">
            A complete authentication solution built with Next.js, GraphQL, and Material UI.
          </Typography>
          
          {isAuthenticated ? (
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => router.push('/dashboard')}
              sx={{ mt: 2 }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => router.push('/login')}
                sx={{ mr: 2 }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                onClick={() => router.push('/register')}
              >
                Register
              </Button>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 5, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'primary.light',
              color: 'white',
              borderRadius: 4
            }}
          >
            <LockIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" align="center" gutterBottom>
              Secure Authentication
            </Typography>
            <Typography variant="body1" align="center">
              Login, register, and manage your account with this secure authentication system.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
