import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import { Card, CardMedia, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import video_placeholder from '../video_placeholder.jpg';

function Dashboard() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Token:', token);

        if (!token) {
            navigate('/login');
        }

        const fetchVideos = async () => {
            try {
                const response = await axios.get('https://video-platform-production.up.railway.app//', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                });
                setVideos(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchVideos();
    }, [token, navigate]);

    return (
        <BaseLayout>
            <Typography variant="h4" gutterBottom>
                Video List
            </Typography>
            <Box display="flex" justifyContent="center">
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Grid container spacing={3}>
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.id}>
                                <Card>
                                    <Link to={`/post-detail/${video.id}`} style={{ textDecoration: 'none' }}>
                                        <CardMedia
                                            component="img"
                                            alt={video.title}
                                            height="140"
                                            image={video.thumbnail ? video.thumbnail : video_placeholder}
                                        />
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {video.title}
                                            </Typography>
                                        </CardContent>
                                    </Link>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </BaseLayout>
    );
}

export default Dashboard;
