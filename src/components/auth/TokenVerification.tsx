import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const TokenVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyResetToken } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          toast.error('Invalid reset token');
          navigate('/auth/forgot-password');
          return;
        }

        const isValid = await verifyResetToken(token);
        if (!isValid) {
          toast.error('Invalid or expired reset token');
          navigate('/auth/forgot-password');
          return;
        }

        // If token is valid, redirect to reset password form
        navigate(`/auth/reset-password?token=${token}`);
      } catch (error) {
        console.error('Token verification error:', error);
        toast.error('Failed to verify reset token');
        navigate('/auth/forgot-password');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, navigate, verifyResetToken]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verifying your reset token
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please wait while we verify your reset token...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TokenVerification; 