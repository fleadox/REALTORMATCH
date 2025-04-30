import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { type RegisterFormData } from '../../lib/validation';
import { useAuth } from '../../hooks/useAuth';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register: registerUser } = useAuth();

  useEffect(() => {
    const googleData = sessionStorage.getItem('googleAuthData');
    if (googleData) {
      const parsedData = JSON.parse(googleData);
      setFormData(prev => ({
        ...prev,
        email: parsedData.email,
        fullName: parsedData.fullName,
      }));
      setStep(2);
    }
  }, []);
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
    setErrors({});
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const googleData = sessionStorage.getItem('googleAuthData');
      await registerUser({
        ...formData,
        googleAuth: googleData ? JSON.parse(googleData) : undefined
      });
      sessionStorage.removeItem('googleAuthData');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Registration failed'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Join REALTOR MATCH</h1>
            <p className="text-gray-300">
              Create your account to start showcasing your real estate expertise
            </p>
          </div>
          
          <div className="glass-panel p-8">
            <div className="flex mb-8">
              <div className="flex-1">
                <div className={`h-1 rounded-l-full ${
                  step >= 1 ? 'bg-accent-500' : 'bg-white/10'
                }`}></div>
                <div className="flex justify-between items-center mt-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-accent-500 text-white' : 'glass-panel-dark text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className="text-sm text-gray-300">Account</span>
                </div>
              </div>
              
              <div className="flex-1">
                <div className={`h-1 rounded-r-full ${
                  step >= 2 ? 'bg-accent-500' : 'bg-white/10'
                }`}></div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-300">Profile</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-accent-500 text-white' : 'glass-panel-dark text-gray-400'
                  }`}>
                    2
                  </div>
                </div>
              </div>
            </div>
            
            {errors.submit && (
              <div className="glass-panel-dark text-error-400 p-4 rounded-md flex items-start mb-6">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            {step === 1 ? (
              <>
                <form onSubmit={handleNextStep}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`input pl-10 ${
                          errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-error-400">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-white text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className={`input pl-10 ${
                          errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-error-400">{errors.password}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`input pl-10 ${
                          errors.confirmPassword ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-error-400">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <Link to="/login" className="btn-ghost">
                      Back to Login
                    </Link>
                    <button type="submit" className="btn-accent">
                      Continue
                    </button>
                  </div>
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
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="fullName" className="block text-white text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className={`input pl-10 ${
                          errors.fullName ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''
                        }`}
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-error-400">{errors.fullName}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          id="agreeTerms"
                          name="agreeTerms"
                          className={`w-4 h-4 ${
                            errors.agreeTerms ? 'border-error-500' : ''
                          }`}
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                        />
                      </div>
                      <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-300">
                        I agree to the{' '}
                        <a
                          href="/terms-of-service"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-400 hover:text-accent-300 transition-colors"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-sm text-error-400">{errors.agreeTerms}</p>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={handlePrevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn-accent"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span>Creating Account...</span>
                      ) : (
                        <>
                          <UserPlus className="w-5 h-5 mr-2" />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;