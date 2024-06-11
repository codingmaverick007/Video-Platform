import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import {
    Alert, Button, CircularProgress, TextField, Typography,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid
} from '@mui/material';
import {
    Check as CheckIcon, ArrowBackIos as ArrowBackIosIcon,
    ArrowForwardIos as ArrowForwardIosIcon, Share as ShareIcon,
    Facebook, Twitter, LinkedIn, Email, WhatsApp
} from '@mui/icons-material';
import './styles.css';
import PropTypes from 'prop-types';

const PostDetail = ({ handleSharePost }) => {
    const [postData, setPostData] = useState(null);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [copySuccess, setCopySuccess] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);
    const [openShareModal, setOpenShareModal] = useState(false);

    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        setPostData(null);
        setComments([]);
        setLoadingPost(true);
        setLoadingComments(true);
        setError(null);
        fetchPostDetails();
        fetchComments();
    }, [id]);

    const fetchPostDetails = async () => {
        try {
            const response = await axios.get(`https://video-platform-production.up.railway.app/post-detail/${id}/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Accept': 'application/json',
                },
            });
            setPostData(response.data);
        } catch (error) {
            setError('Failed to fetch post details');
        } finally {
            setLoadingPost(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`https://video-platform-production.up.railway.app/view-comments/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: 'application/json, text/plain, */*',
                },
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleNext = () => {
        if (postData?.next_post_url) {
            const nextPostId = postData.next_post_url.split('/').reverse()[1];
            navigate(`/post-detail/${nextPostId}`);
        }
    };

    const handlePrevious = () => {
        if (postData?.previous_post_url) {
            const previousPostId = postData.previous_post_url.split('/').reverse()[1];
            navigate(`/post-detail/${previousPostId}`);
        }
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleSubmitComment = async (event) => {
        event.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await axios.post(
                `https://video-platform-production.up.railway.app/add-comment/${id}/`,
                { post: id, comment: newComment },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                        Accept: 'application/json, text/plain, */*',
                    },
                }
            );
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`https://video-platform-production.up.railway.app/post-delete/${id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                    Accept: 'application/json, text/plain, */*',
                },
            });
            setDeleteSuccess('success');
            setTimeout(() => {
                setDeleteSuccess(null);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error deleting post:', error);
            setDeleteSuccess('error');
            setTimeout(() => setDeleteSuccess(null), 3000);
        }
    };

    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setCopySuccess('success');
                setTimeout(() => setCopySuccess(null), 3000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                setCopySuccess('error');
                setTimeout(() => setCopySuccess(null), 3000);
            });
    };

    const handleOpenShareModal = () => {
        setOpenShareModal(true);
    };

    const handleCloseShareModal = () => {
        setOpenShareModal(false);
    };

    if (error) return <Alert severity="error">{error}</Alert>;

    if (loadingPost) {
        return (
            <BaseLayout>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            </BaseLayout>
        );
    }

    const sharePlatforms = [
        { platform: 'whatsapp', icon: <WhatsApp />, label: 'Share on WhatsApp' },
        { platform: 'twitter', icon: <Twitter />, label: 'Share on Twitter' },
        { platform: 'facebook', icon: <Facebook />, label: 'Share on Facebook' },
        { platform: 'linkedin', icon: <LinkedIn />, label: 'Share on LinkedIn' },
        { platform: 'email', icon: <Email />, label: 'Share via Email' },
    ];

    return (
        <BaseLayout handleDeletePost={() => setShowConfirmDelete(true)} handleSharePost={handleOpenShareModal} id={id}>
            <div className='post-detail-container'>
                <div className='copy-link'> 
                {deleteSuccess === 'success' && (
                    <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>
                        Post deleted successfully
                    </Alert>
                )}
                {deleteSuccess === 'error' && (
                    <Alert icon={<CheckIcon fontSize='inherit' />} severity='error'>
                        Failed to delete post
                    </Alert>
                )}
                </div>
                <div className='post-content'>
                    <Typography variant="h4" className='title'>{postData.title}</Typography>
                    <div className='video-container'>
                        <div className='navigation-button'>
                            {postData.previous_post_url && <ArrowBackIosIcon onClick={handlePrevious} fontSize='large' />}
                        </div>
                        <video controls key={postData.video} className='video-container'>
                            <source src={postData.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className='navigation-button'>
                            {postData.next_post_url && <ArrowForwardIosIcon onClick={handleNext} fontSize='large' />}
                        </div>
                    </div>
                    <Typography variant="body1">{postData.description}</Typography>
                    <div>
                        <Dialog open={openShareModal} onClose={handleCloseShareModal} className="custom-dialog">
                            <DialogTitle className="dialog-title">Share this post</DialogTitle>
                            <DialogContent className="dialog-content">
                                {sharePlatforms.map(({ platform, icon, label }, idx) => (
                                    <Button
                                        key={idx}
                                        onClick={() => {
                                            window.open(postData[`share_${platform}`], '_blank');
                                            handleCloseShareModal();
                                        }}
                                        startIcon={icon}
                                        variant="contained"
                                        className="share-button"
                                    >
                                        {label}
                                    </Button>
                                ))}
                                <Button onClick={handleCopyLink} variant="contained" className="copy-link-button">
                                    Copy link
                                </Button>
                            </DialogContent>
                            <DialogActions className="dialog-actions">
                                <Button onClick={handleCloseShareModal} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                        <div className='copy-link'>
                            {copySuccess === 'success' && (
                                <Alert icon={<CheckIcon fontSize='inherit' />} severity='success'>
                                    Link copied
                                </Alert>
                            )}
                            {copySuccess === 'error' && (
                                <Alert icon={<CheckIcon fontSize='inherit' />} severity='error'>
                                    Link not copied
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
                <div className='comments-section'>
                    <Typography variant="h6">Comments</Typography>
                    {loadingComments ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </div>
                    ) : (
                        <ul>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <React.Fragment key={index}>
                                        <li>
                                            <strong>{comment.username}</strong>
                                            <p>{comment.comment}</p>
                                            <p>Posted At: {comment.posted_at}</p>
                                        </li>
                                        <hr />
                                    </React.Fragment>
                                ))
                            ) : (
                                <p>No comments posted yet</p>
                            )}
                        </ul>
                    )}
                    <form onSubmit={handleSubmitComment}>
                        <TextField
                            multiline
                            rows={4}
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Add your comment..."
                        />
                        <Button type="submit" variant="contained">Add Comment</Button>
                    </form>
                </div>
            </div>
            {showConfirmDelete && (
                <div className="dialog">
                    <div className="dialog-content">
                        <Typography>Are you sure you want to delete this post?</Typography>
                        <Button onClick={handleDeletePost}>Yes, delete</Button>
                        <Button onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
                    </div>
                </div>
            )}
        </BaseLayout>
    );
};

PostDetail.propTypes = {
    handleSharePost: PropTypes.func.isRequired,
};

export default PostDetail;
