import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-300">
              Sign in to access your REALTOR MATCH account
            </p>
          </div>
          
          <div className="glass-panel p-8">
            {error && (
              <div className="glass-panel-dark text-error-400 p-4 rounded-md flex items-start mb-6">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-white text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="input pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-white text-sm font-medium">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    className="input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-accent w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-[45%] border-t border-white/10"></div>
                <div className="w-[10%]"></div>
                <div className="w-[45%] border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-400">or</span>
              </div>
            </div>

            <GoogleAuthButton />
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent-400 hover:text-accent-300 font-medium">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;