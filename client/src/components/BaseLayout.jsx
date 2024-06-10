import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { AppBar, Toolbar, IconButton, Container, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './styles.css';
import companyLogo from '../logo.png';

function BaseLayout({ children, handleDeletePost, handleSharePost, id }) {
    const { isLoggedIn, logout, isAdmin } = useContext(AuthContext);
    const location = useLocation();
    const isPostDetailPage = location.pathname.startsWith('/post-detail');
    const [menuAnchor, setMenuAnchor] = useState(null);

    const handleMenuOpen = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Box display="flex" justifyContent="center" flexGrow={1}>
                        <Link to="/">
                            <img src={companyLogo} alt="Company Logo" style={{ width: '150px', height: 'auto' }} />
                        </Link>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {isLoggedIn ? (
                            <>
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={menuAnchor}
                                    open={Boolean(menuAnchor)}
                                    onClose={handleMenuClose}
                                >
                                    {isAdmin && (
                                        <MenuItem component={Link} to="/upload" onClick={handleMenuClose}>
                                            Upload
                                        </MenuItem>
                                    )}
                                    {isAdmin && isPostDetailPage && (
                                        <MenuItem onClick={handleDeletePost}>
                                            Delete
                                        </MenuItem>
                                    )}
                                    {isPostDetailPage && (
                                        <MenuItem onClick={handleSharePost}>
                                            Share
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={logout}>
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : null }
                    </Box>
                </Toolbar>
            </AppBar>
            <Container>
                {children}
            </Container>
        </div>
    );
}

export default BaseLayout;
