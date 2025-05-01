import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import TokenVerification from './components/auth/TokenVerification';
import Profile from './pages/Profile';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/auth/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/auth/verify-token" element={<TokenVerification />} />
          <Route path="/auth/reset-password" element={<ResetPasswordForm />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;