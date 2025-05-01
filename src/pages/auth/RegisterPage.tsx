import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../../components/auth/RegistrationForm';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-400 hover:text-accent-300">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="glass-panel p-8">
            <RegistrationForm />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>
            
              <div className="mt-6">
                <GoogleAuthButton className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;