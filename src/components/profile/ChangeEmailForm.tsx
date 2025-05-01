import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ChangeEmailForm: React.FC = () => {
  const { user, changeEmail } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newEmail === user?.email) {
      toast.error('New email must be different from current email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const success = await changeEmail(newEmail, password);
      
      if (success) {
        setNewEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Email change error:', error);
      toast.error('Failed to change email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Email</h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Current email: <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="new-email" className="block text-sm font-medium text-gray-700">
            New Email Address
          </label>
          <input
            type="email"
            id="new-email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Changing Email...' : 'Change Email'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Note: You will receive a verification email at your new address. 
          The change will not take effect until you verify the new email.
        </p>
      </div>
    </div>
  );
};

export default ChangeEmailForm; 