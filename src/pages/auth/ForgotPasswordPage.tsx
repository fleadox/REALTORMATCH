import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [attempts, setAttempts] = useState(0);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Check rate limiting
    if (attempts >= 3) {
      setError('Too many attempts. Please try again in 15 minutes.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would call your password reset API
      // For demo, we'll simulate success
      setIsSuccess(true);
      toast.success('Password reset instructions sent');
    } catch (error) {
      setError('Failed to send reset instructions. Please try again.');
      setAttempts(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="container-custom">
          <div className="max-w-md mx-auto">
            <div className="glass-panel p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-300" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-300">
                  We've sent password reset instructions to:
                </p>
                <p className="text-white font-medium mt-2">{email}</p>
              </div>

              <div className="glass-panel-dark p-4 mb-6">
                <h3 className="text-sm font-medium text-white mb-2">Next steps:</h3>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li>1. Check your email inbox</li>
                  <li>2. Click the reset link in the email</li>
                  <li>3. Create your new password</li>
                </ol>
              </div>

              <div className="text-center text-sm text-gray-400">
                <p className="mb-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail('');
                    }}
                    className="text-accent-400 hover:text-accent-300"
                  >
                    try again
                  </button>
                </p>
                <Link 
                  to="/login" 
                  className="text-accent-400 hover:text-accent-300 font-medium"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-gray-300">
              Enter your email address and we'll send you instructions to reset your password
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
              <div className="mb-6">
                <label htmlFor="email" className="block text-white text-sm font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="input pl-10"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link 
                  to="/login"
                  className="btn-ghost order-2 sm:order-1 w-full sm:w-auto"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Sign In
                </Link>
                <button
                  type="submit"
                  className="btn-accent order-1 sm:order-2 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending Instructions...
                    </>
                  ) : (
                    'Send Instructions'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400">
                <p className="mb-2">After submitting, you will receive an email with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>A password reset link (valid for 1 hour)</li>
                  <li>Instructions to create a new password</li>
                  <li>Security tips for your account</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;