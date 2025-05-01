import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const DeleteAccount: React.FC = () => {
  const { deleteAccount } = useAuth();
  const [password, setPassword] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      setIsLoading(true);
      const success = await deleteAccount(password);
      
      if (success) {
        // Redirect to home page after successful deletion
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfirmOpen) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Delete Account</h2>
        <p className="text-gray-600 mb-6">
          Warning: This action is permanent and cannot be undone. All your data will be permanently deleted.
        </p>
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
        >
          Delete Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-red-600 mb-6">Delete Account</h2>
      
      <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Warning</h3>
        <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
          <li>This action is permanent and cannot be undone</li>
          <li>All your data will be permanently deleted</li>
          <li>You will lose access to all your content</li>
          <li>Connected accounts will be unlinked</li>
          <li>Active sessions will be terminated</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
            Type DELETE to confirm
          </label>
          <input
            type="text"
            id="confirm"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsConfirmOpen(false);
              setPassword('');
              setConfirmText('');
            }}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || confirmText !== 'DELETE'}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteAccount; 