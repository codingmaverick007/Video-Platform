import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Changed from 'react-router' to 'react-router-dom'
import { AuthContext } from '../../AuthContext';
import BaseLayout from '../BaseLayout';
import { TextField, Button, Typography, Box, Container, CircularProgress, Alert } from '@mui/material';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const { setLoggedIn, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);
        try {
            const response = await axios.post('https://video-platform-production.up.railway.app/api/v1/rest-auth/login/', {
                email: email,
                password: password,
            });
            const token = response.data.key;
            localStorage.setItem('token', token);
            setLoggedIn(true);
            login(token);
            setSuccess(true);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError({ non_field_errors: ['An unexpected error occurred. Please try again later.'] });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseLayout>
            <Container maxWidth="sm">
                <Box mt={4} p={3} bgcolor="white" borderRadius={2} boxShadow={3}>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    {loading && (
                        <Box display="flex" justifyContent="center" mb={2}>
                            <CircularProgress />
                        </Box>
                    )}
                    {success && (
                        <Alert severity="success" onClose={() => setSuccess(false)}>
                            Login successful! Redirecting...
                        </Alert>
                    )}
                    {error && (
                        <Box mb={2}>
                            {Object.keys(error).map((key) => (
                                <Alert severity="error" key={key}>
                                    {error[key]}
                                </Alert>
                            ))}
                        </Box>
                    )}
                    <form onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            error={!!error?.email}
                            helperText={error?.email}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            error={!!error?.password}
                            helperText={error?.password}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            Login
                        </Button>
                    </form>
                    <Box mt={2}>
                        <Link to="/password-reset" variant="body2">
                            Forgot Password?
                        </Link>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="body2">
                            Don't have an account? <Link to="/register">Register</Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </BaseLayout>
    );
}

export default LoginForm;
