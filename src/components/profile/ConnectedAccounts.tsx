import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ConnectedAccount } from '../../types/user';
import { toast } from 'react-hot-toast';

const ConnectedAccounts: React.FC = () => {
  const { getConnectedAccounts, unlinkProvider } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await getConnectedAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
      toast.error('Failed to load connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlink = async (provider: string) => {
    if (!window.confirm(`Are you sure you want to unlink your ${provider} account?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const success = await unlinkProvider(provider);
      
      if (success) {
        await loadConnectedAccounts();
        toast.success(`Successfully unlinked ${provider} account`);
      }
    } catch (error) {
      console.error('Failed to unlink account:', error);
      toast.error('Failed to unlink account');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Connected Accounts</h2>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : accounts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No connected accounts found
        </p>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {account.provider}
                </h3>
                <p className="text-sm text-gray-500">
                  Connected on {formatDate(account.created_at)}
                </p>
                {account.last_sign_in && (
                  <p className="text-sm text-gray-500">
                    Last used: {formatDate(account.last_sign_in)}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleUnlink(account.provider)}
                disabled={isLoading}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Unlink
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Add New Connection
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = '/auth/connect/google'}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Connect Google
          </button>
          <button
            onClick={() => window.location.href = '/auth/connect/github'}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              src="/github-icon.svg"
              alt="GitHub"
              className="h-5 w-5 mr-2"
            />
            Connect GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts; 