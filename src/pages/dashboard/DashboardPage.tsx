import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import { User, Home, ListChecks, Settings, LogOut, ChevronRight, Star, UserPlus, Plus, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { profiles } from '../../utils/mockData';
import ProfilePage from './ProfilePage';
import PropertyLinksPage from './PropertyLinksPage';
import SettingsPage from './SettingsPage';
import CreateProfilePage from './CreateProfilePage';
import ShareProfile from '../../components/profile/ShareProfile';
import SubscriptionPage from './SubscriptionPage';
import UpgradeBanner from '../../components/dashboard/UpgradeBanner';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  
  const userProfile = profiles.find(profile => profile.userId === user?.id);

  useEffect(() => {
    // Get subscription data from localStorage
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Agent Dashboard</h1>
          <div className="flex items-center space-x-4">
            {userProfile && (
              <ShareProfile 
                profileId={userProfile.id} 
                agentName={userProfile.fullName} 
              />
            )}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="btn-ghost"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex items-center">
            <div className="mr-4">
              {userProfile?.photoUrl ? (
                <img 
                  src={userProfile.photoUrl} 
                  alt={userProfile.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 glass-panel-dark rounded-full flex items-center justify-center text-accent-300">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back!</h2>
              <p className="text-gray-300">
                {userProfile?.fullName || user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Show Upgrade Banner only if not subscribed */}
        {!subscription?.status && <UpgradeBanner />}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-panel overflow-hidden">
              <nav className="flex flex-col">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) => 
                    `flex items-center px-6 py-4 border-l-4 ${
                      isActive 
                        ? 'border-accent-300 bg-white/5 text-accent-300' 
                        : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </NavLink>
                
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) => 
                    `flex items-center px-6 py-4 border-l-4 ${
                      isActive 
                        ? 'border-accent-300 bg-white/5 text-accent-300' 
                        : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <User className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </NavLink>
                
                <NavLink
                  to="/dashboard/properties"
                  className={({ isActive }) => 
                    `flex items-center px-6 py-4 border-l-4 ${
                      isActive 
                        ? 'border-accent-300 bg-white/5 text-accent-300' 
                        : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <ListChecks className="w-5 h-5 mr-3" />
                  <span>Property Links</span>
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </NavLink>

                <NavLink
                  to="/dashboard/subscription"
                  className={({ isActive }) => 
                    `flex items-center px-6 py-4 border-l-4 ${
                      isActive 
                        ? 'border-accent-300 bg-white/5 text-accent-300' 
                        : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <Star className="w-5 h-5 mr-3" />
                  <div className="flex-1 flex items-center justify-between">
                    <span>Subscription</span>
                    {subscription?.status === 'active' && (
                      <span className="glass-panel px-2 py-0.5 text-xs text-accent-300">
                        Featured
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </NavLink>
                
                <NavLink
                  to="/dashboard/settings"
                  className={({ isActive }) => 
                    `flex items-center px-6 py-4 border-l-4 ${
                      isActive 
                        ? 'border-accent-300 bg-white/5 text-accent-300' 
                        : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                    }`
                  }
                >
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </NavLink>
              </nav>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass-panel">
              <Routes>
                <Route path="/" element={
                  <DashboardHome subscription={subscription} />
                } />
                <Route path="/profile" element={
                  <ProfilePage />
                } />
                <Route path="/profile/create" element={
                  <CreateProfilePage />
                } />
                <Route path="/properties" element={
                  <PropertyLinksPage />
                } />
                <Route path="/subscription" element={
                  <SubscriptionPage />
                } />
                <Route path="/settings" element={
                  <SettingsPage />
                } />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel max-w-md mx-4 p-6 animate-scale-in">
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-error-500/10 flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-error-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
                <p className="text-gray-300">
                  Are you sure you want to sign out? You'll need to sign in again to access your dashboard.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="btn-ghost"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn-error"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardHome: React.FC<{ subscription: any }> = ({ subscription }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel-dark p-5">
          <h3 className="text-lg font-medium text-white mb-2">Profile Status</h3>
          <div className="flex items-center text-accent-300">
            <span className="inline-block w-3 h-3 bg-accent-500 rounded-full mr-2"></span>
            {subscription?.status === 'active' ? 'Featured Agent' : 'Pending Approval'}
          </div>
          <p className="text-gray-300 mt-2 text-sm">
            {subscription?.status === 'active'
              ? 'Your profile is featured and receiving priority visibility.'
              : 'Your profile is under review. This usually takes 1-2 business days.'}
          </p>
          <Link 
            to="/dashboard/profile"
            className="btn-accent w-full mt-4 flex items-center justify-center"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Complete Your Profile
          </Link>
        </div>
        
        <div className="glass-panel-dark p-5">
          <h3 className="text-lg font-medium text-white mb-2">Property Links</h3>
          <div className="text-3xl font-bold text-accent-300">
            0/{subscription?.status === 'active' ? '30' : '5'}
          </div>
          <p className="text-gray-300 mt-2 text-sm">
            {subscription?.status === 'active'
              ? 'You can add up to 30 property links as a Featured Agent.'
              : 'You can add up to 5 property links with a basic account.'}
          </p>
          <Link 
            to="/dashboard/properties"
            className="btn-accent w-full mt-4 flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property Links
          </Link>
        </div>
      </div>
      
      {subscription?.status === 'active' ? (
        <div className="glass-panel-dark p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-accent-300" />
            <h3 className="text-lg font-medium text-white">Featured Agent Benefits</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Enhanced Visibility</h4>
                <p className="text-gray-300 text-sm">
                  Your profile appears at the top of search results
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Featured Badge</h4>
                <p className="text-gray-300 text-sm">
                  Stand out with a featured agent badge on your profile
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-white">Extended Property Listings</h4>
                <p className="text-gray-300 text-sm">
                  List up to 30 properties on your profile
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <Link 
              to="/dashboard/subscription"
              className="text-accent-300 hover:text-accent-400 flex items-center text-sm font-medium"
            >
              Manage Subscription <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-4">Next Steps</h3>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-sm mr-3 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-medium text-white">Complete your profile</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Add your professional details, photo, and service areas.
                </p>
                <Link 
                  to="/dashboard/profile"
                  className="text-accent-300 hover:text-accent-400 flex items-center text-sm font-medium"
                >
                  Go to Profile <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-sm mr-3 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-medium text-white">Add property links</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Showcase your listings by adding external property links.
                </p>
                <Link 
                  to="/dashboard/properties"
                  className="text-accent-300 hover:text-accent-400 flex items-center text-sm font-medium"
                >
                  Add Properties <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-300 flex items-center justify-center text-sm mr-3 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-medium text-white">Upgrade to Featured Agent</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Get priority placement and enhanced visibility.
                </p>
                <Link 
                  to="/dashboard/subscription"
                  className="text-accent-300 hover:text-accent-400 flex items-center text-sm font-medium"
                >
                  View Plans <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;