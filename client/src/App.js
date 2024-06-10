import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegistrationForm';
import PasswordResetForm from './components/auth/PasswordResetForm';
import UploadVideo from './components/UploadForm';
import PostDetail from './components/PostDetail'; 

// import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/post-detail/:id" element={<PostDetail />} />
      <Route path="/upload" element={<UploadVideo />} />
      <Route path="/password-reset" element={<PasswordResetForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;

