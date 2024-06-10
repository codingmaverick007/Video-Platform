import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [token, setToken] = useState(localStorage.getItem('token'));

    const navigate = useNavigate();

    const setLoggedIn = (status) => {
        setIsLoggedIn(status);
        localStorage.setItem('isLoggedIn', status);
    };

    const setAdminStatus = (status) => {
        setIsAdmin(status);
        localStorage.setItem('isAdmin', status);
    };

    const checkAdminStatus = useCallback(async () => {
        try {
            const response = await axios.get('https://video-platform-production.up.railway.app/api/v1/check-admin-status/', {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                maxRedirects: 0
            });

            if (response.status === 301 || response.status === 302) {
                const redirectUrl = response.headers.location;
                const finalResponse = await axios.get(redirectUrl, {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                setAdminStatus(finalResponse.data.is_admin);
            } else {
                setAdminStatus(response.data.is_admin);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setAdminStatus(false);
        }
    }, [token]);

    useEffect(() => {
        if (isLoggedIn && token) {
            checkAdminStatus();
        }
    }, [isLoggedIn, token, checkAdminStatus]);

    const login = (tokenValue) => {
        setToken(tokenValue);
        localStorage.setItem('token', tokenValue);
        setLoggedIn(true);
    };

    const logout = async () => {
        try {
            await axios.post('https://video-platform-production.up.railway.app/api/v1/rest-auth/logout/', null, {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (error) {
            console.error('Error logging out:', error);
        }

        setToken(null);
        localStorage.removeItem('token');
        setLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        setAdminStatus(false);
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoggedIn, setLoggedIn, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
