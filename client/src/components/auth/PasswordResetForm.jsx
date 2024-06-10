import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import BaseLayout from '../BaseLayout';
import { TextField, Button, Typography, Box, Container, CircularProgress, Alert } from '@mui/material';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const response = await axios.post('https://video-platform-production.up.railway.app/api/v1/rest-auth/password/reset/', { email });
            setMessage(response.data.detail);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (error) {
            setMessage('Error resetting password. Please try again later.');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseLayout>
            <Container maxWidth="sm">
                <Box mt={4} p={3} bgcolor="white" borderRadius={2} boxShadow={3}>
                    <Typography variant="h4" gutterBottom>
                        Password Reset
                    </Typography>
                    {loading && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <CircularProgress />
                        </Box>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)}>
                            {message} Redirecting to login...
                        </Alert>
                    )}
                    {!success && message && (
                        <Alert severity="error" onClose={() => setMessage('')}>
                            {message}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            Reset Password
                        </Button>
                    </form>
                </Box>
            </Container>
        </BaseLayout>
    );
};

export default PasswordResetForm;
