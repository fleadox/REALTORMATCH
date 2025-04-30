import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Save, 
  AlertTriangle, 
  Globe,
  Check,
  X,
  ChevronRight
} from 'lucide-react';
import BillingPanel from '../../components/dashboard/BillingPanel';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { t, i18n } = useTranslation();
  const [subscription, setSubscription] = useState<any>(null);
  
  useEffect(() => {
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  }, []);
  
  if (!user) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="glass-panel-dark p-8 text-center">
          <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-accent-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Session Expired</h3>
          <p className="text-gray-300">
            Please sign in again to access your settings
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
      
      {/* Tabs Navigation */}
      <div className="glass-panel-dark mb-6">
        <nav className="flex flex-col md:flex-row">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center px-6 py-4 border-l-4 ${
              activeTab === 'account'
                ? 'border-accent-300 bg-white/5 text-accent-300'
                : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            <Mail className="w-5 h-5 mr-3" />
            <span>Account</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center px-6 py-4 border-l-4 ${
              activeTab === 'security'
                ? 'border-accent-300 bg-white/5 text-accent-300'
                : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            <Lock className="w-5 h-5 mr-3" />
            <span>Security</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>
          
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center px-6 py-4 border-l-4 ${
              activeTab === 'notifications'
                ? 'border-accent-300 bg-white/5 text-accent-300'
                : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            <Bell className="w-5 h-5 mr-3" />
            <span>Notifications</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>
          
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center px-6 py-4 border-l-4 ${
              activeTab === 'billing'
                ? 'border-accent-300 bg-white/5 text-accent-300'
                : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            <CreditCard className="w-5 h-5 mr-3" />
            <span>Billing</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>
        </nav>
      </div>
      
      {/* Account Settings */}
      {activeTab === 'account' && (
        <div className="animate-fade-in space-y-6">
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Email Address</h3>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className="input pl-10"
                defaultValue={user.email}
                disabled
              />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Your email address is used for login and notifications
            </p>
          </div>

          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Language Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Interface Language</h4>
                  <p className="text-sm text-gray-400">Select your preferred language</p>
                </div>
                <select
                  value={i18n.language}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                  className="input py-2 pl-10 pr-4 w-48"
                >
                  <option value="en">English</option>
                  <option value="ka">ქართული</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Account Status</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Current Status</p>
                <p className="text-sm text-gray-400">Your account is active and in good standing</p>
              </div>
              <div className="glass-panel px-3 py-1 text-sm text-accent-300 border border-accent-500/20">
                Active
              </div>
            </div>
          </div>

          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Delete Account</h3>
            <p className="text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="glass-panel-dark bg-error-500/10 hover:bg-error-500/20 text-error-500 border-error-500/20 py-2 px-4 rounded-lg flex items-center transition-colors"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      )}
      
      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="animate-fade-in">
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Enter your current password"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white text-sm font-medium mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn-accent">
                <Save className="w-5 h-5 mr-2" />
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="animate-fade-in">
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-6">Email Notifications</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <h4 className="font-medium text-white">New Client Inquiries</h4>
                  <p className="text-sm text-gray-400">
                    Receive notifications when someone contacts you
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div>
                  <h4 className="font-medium text-white">Profile Updates</h4>
                  <p className="text-sm text-gray-400">
                    Get notified about profile verification status
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-medium text-white">Marketing Emails</h4>
                  <p className="text-sm text-gray-400">
                    Receive news, offers, and platform updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-accent-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="btn-accent">
                <Save className="w-5 h-5 mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Billing Settings */}
      {activeTab === 'billing' && (
        <div className="animate-fade-in">
          <BillingPanel subscription={subscription} />
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-panel max-w-md mx-4 p-6 animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Remove your profile from search results</li>
              <li>Delete all your property listings</li>
              <li>Cancel any active subscriptions</li>
            </ul>
            <div className="flex justify-end space-x-4">
              <button
                className="btn-ghost"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </button>
              <button
                className="btn-error"
                onClick={() => {
                  // Handle account deletion
                  setShowDeleteConfirm(false);
                }}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;