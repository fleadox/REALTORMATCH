import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onSuccess, className = '' }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleUserInfo = async (accessToken: string) => {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const userInfo = await userInfoResponse.json();

      sessionStorage.setItem('googleAuthData', JSON.stringify({
        email: userInfo.email,
        fullName: `${userInfo.given_name} ${userInfo.family_name}`,
        picture: userInfo.picture,
        accessToken: accessToken,
      }));

      navigate('/register');
      onSuccess?.();
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (response) => {
      setIsLoading(true);
      await handleGoogleUserInfo(response.access_token);
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Google login failed');
      setIsLoading(false);
    },
    onNonOAuthError: (error) => {
      // Handle popup blocked error
      if (error.type === 'popup_failed_to_open') {
        toast((t) => (
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Popup was blocked</p>
              <p className="text-sm text-gray-600">Please allow popups for this site to use Google Sign-In</p>
            </div>
          </div>
        ), {
          duration: 6000,
        });
      }
      setIsLoading(false);
    }
  });

  return (
    <button
      onClick={() => {
        if (!isLoading) {
          setIsLoading(true);
          login();
        }
      }}
      disabled={isLoading}
      className={`w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
      ) : (
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleAuthButton;