import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import ChangeEmailForm from '../components/profile/ChangeEmailForm';
import ConnectedAccounts from '../components/profile/ConnectedAccounts';
import SessionManagement from '../components/profile/SessionManagement';
import DeleteAccount from '../components/profile/DeleteAccount';
import { toast } from 'react-hot-toast';

type TabType = 'profile' | 'password' | 'email' | 'connected' | 'sessions' | 'delete';

const Profile: React.FC = () => {
  const { user, exportUserData } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const blob = await exportUserData();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Your data has been exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'email', label: 'Email' },
    { id: 'connected', label: 'Connected Accounts' },
    { id: 'sessions', label: 'Active Sessions' },
    { id: 'delete', label: 'Delete Account' },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm />;
      case 'password':
        return <ChangePasswordForm />;
      case 'email':
        return <ChangeEmailForm />;
      case 'connected':
        return <ConnectedAccounts />;
      case 'sessions':
        return <SessionManagement />;
      case 'delete':
        return <DeleteAccount />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Please log in to access your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-64 flex-shrink-0">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white shadow rounded-lg">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile; 