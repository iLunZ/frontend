import { useState, FormEvent, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Grid,
  Divider
} from '@mui/material';

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($id: ID!, $name: String!, $email: String!) {
    updateUser(id: $id, name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

export default function Profile() {
  const { user, loading: userLoading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION);

  useEffect(() => {
    if (user && user.id) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    validateForm();
  }, [name, email]);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      valid = false;
    } else {
      setNameError('');
    }
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    
    setIsFormValid(valid);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    validateForm();
    if (!isFormValid) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data } = await updateProfile({
        variables: {
          id: user.id,
          name,
          email,
        },
      });
      if (!data?.updateUser) {
        setError('Failed to update profile');
      } else {
        setSuccess('Profile updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // if (!user) {
  //   return null;
  // }

  return (
    <Layout title="Profile">
      {userLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      ) : (
        <>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                Your Profile
              </Typography>
              
              <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Edit Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    error={!!nameError}
                    helperText={nameError}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    error={!!emailError}
                    helperText={emailError}
                  />
                  
                  <Box sx={{ mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || !isFormValid}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Layout>
  );
}