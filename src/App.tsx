import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AgentDirectoryPage from './pages/AgentDirectoryPage';
import AgentProfilePage from './pages/AgentProfilePage';
import AgentPropertiesPage from './pages/AgentPropertiesPage';
import LoginPage from './pages/auth/LoginPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import { checkEnvVariables } from './lib/test-env';
import { testSupabaseConnection } from './lib/test-connection';

function App() {
  useEffect(() => {
    const checkConnections = async () => {
      // Check environment variables
      const envCheck = checkEnvVariables();
      if (!envCheck.supabaseUrl || !envCheck.supabaseAnonKey) {
        console.error('Missing required environment variables. Please check your .env.local file.');
      } else {
        console.log('✅ Environment variables loaded successfully');
      }

      // Test Supabase connection
      await testSupabaseConnection();
    };

    checkConnections();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background-dark">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/agents" element={<AgentDirectoryPage />} />
              <Route path="/agents/:id" element={<AgentProfilePage />} />
              <Route path="/agents/:id/properties" element={<AgentPropertiesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;