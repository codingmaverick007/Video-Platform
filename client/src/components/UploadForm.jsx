import React, { useState } from 'react';
import BaseLayout from './BaseLayout';
import { TextField, Button, Typography, Box, Container, CircularProgress, Alert } from '@mui/material';

function UploadVideo() {
    const [videoFile, setVideoFile] = useState(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleTitleChange = (e) => {
        setVideoTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setVideoDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUploadStatus(null);

        if (!videoFile) {
            setUploadStatus('error');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('title', videoTitle);
        formData.append('description', videoDescription);

        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No auth token found');
            setUploadStatus('error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('https://video-platform-production.up.railway.app/post-upload/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful:', data);
                setUploadStatus('success');
                setVideoFile(null);
                setVideoTitle('');
                setVideoDescription('');
            } else {
                const errorData = await response.json();
                console.error('Upload failed:', errorData);
                setUploadStatus('error');
            }
        } catch (error) {
            console.error('Error during upload:', error);
            setUploadStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BaseLayout>
            <Container maxWidth="sm">
                <Box mt={4} p={3} bgcolor="white" borderRadius={2} boxShadow={3}>
                    <Typography variant="h4" gutterBottom>
                        Upload Video
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            type="file"
                            id="videoFile"
                            inputProps={{ accept: 'video/*' }}
                            onChange={handleFileChange}
                            required
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Video Title"
                            variant="outlined"
                            margin="normal"
                            value={videoTitle}
                            onChange={handleTitleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Video Description"
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            value={videoDescription}
                            onChange={handleDescriptionChange}
                            required
                        />
                        {loading ? (
                            <Box display="flex" justifyContent="center" my={2}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Upload Video
                            </Button>
                        )}
                    </form>
                    {uploadStatus === 'success' && (
                        <Alert severity="success" mt={2}>
                            Video uploaded successfully!
                        </Alert>
                    )}
                    {uploadStatus === 'error' && (
                        <Alert severity="error" mt={2}>
                            Video upload failed. Please try again.
                        </Alert>
                    )}
                </Box>
            </Container>
        </BaseLayout>
    );
}

export default UploadVideo;
