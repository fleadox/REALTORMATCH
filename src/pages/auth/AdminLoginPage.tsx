import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Shield, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { type AdminLoginFormData } from '../../lib/validation';
import { supabase, supabaseAdmin } from '../../lib/supabase';

const AdminLoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') === 'on';

    try {
      setIsLoading(true);

      // First authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('Authentication failed');
      }

      // Use admin client for privileged operations
      if (!supabaseAdmin) {
        throw new Error('Admin client not available');
      }

      // Verify admin status using admin client
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single();

      if (adminError || !adminData || adminData.role !== 'admin') {
        throw new Error('Not authorized as admin');
      }

      // Store admin session
      if (rememberMe) {
        localStorage.setItem('adminSession', JSON.stringify(authData.session));
      } else {
        sessionStorage.setItem('adminSession', JSON.stringify(authData.session));
      }

      toast.success('Welcome back, Admin!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid admin credentials');
      
      // Sign out if auth succeeded but admin verification failed
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500/20 text-accent-300 rounded-full mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-300">
              Access the administrative dashboard
            </p>
          </div>

          <div className="glass-panel p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-1">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="form-checkbox h-4 w-4 text-accent-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="btn-accent w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In as Admin
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-primary-900/50 rounded-lg border border-primary-800">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-primary-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-primary-300">
                  This area is restricted to authorized administrators only. All login attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;