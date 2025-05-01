import React from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Forgot Password</h1>
            <p className="text-gray-300">
              Enter your email address and we'll send you instructions to reset your password
            </p>
          </div>

          <div className="glass-panel p-8">
            <ForgotPasswordForm />

            <div className="mt-6 text-center">
              <Link to="/login" className="text-accent-400 hover:text-accent-300">
                Back to login
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;