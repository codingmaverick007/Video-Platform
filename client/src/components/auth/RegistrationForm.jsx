import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from '../BaseLayout';
import { TextField, Button, Typography, Box, Container, CircularProgress, Alert } from '@mui/material';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post('https://video-platform-production.up.railway.app/api/v1/rest-auth/registration/', {
                username,
                email,
                password1,
                password2,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseLayout>
            <Container maxWidth="sm">
                <Box mt={4} p={3} bgcolor="white" borderRadius={2} boxShadow={3}>
                    <Typography variant="h4" gutterBottom>
                        Sign Up
                    </Typography>
                    {loading && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <CircularProgress />
                        </Box>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)}>
                            Registration successful! Redirecting to login...
                        </Alert>
                    )}
                    <form onSubmit={handleSignup}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                            disabled={loading}
                        />
                        {error && <Typography variant="body2" color="error" mt={2}>{error}</Typography>}
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            Sign Up
                        </Button>
                    </form>
                    <Typography variant="body1" mt={2}>
                        Already have an account? <Link to="/login">Log in</Link>
                    </Typography>
                </Box>
            </Container>
        </BaseLayout>
    );
}

export default RegisterForm;
