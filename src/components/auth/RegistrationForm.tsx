import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegistrationFormData {
  email: string;
  password: string;
  fullName: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    password: '',
    fullName: '',
  });
  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Registration failed');
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
          },
        ]);

      if (profileError) {
        throw new Error('Failed to create profile');
      }

      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof RegistrationFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
          Full Name
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.fullName ? 'border-red-500' : 'border-gray-600'
            } rounded-md bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent`}
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          Email
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            } rounded-md bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent`}
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={`block w-full pl-10 pr-3 py-2 border ${
              errors.password ? 'border-red-500' : 'border-gray-600'
            } rounded-md bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Registering...
          </>
        ) : (
          'Register'
        )}
      </button>
    </form>
  );
};

export default RegistrationForm; 