import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { BarChart2, Users, FileText, Settings, Bell, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import AdminOverview from './AdminOverview';
import AdminUserManagement from './AdminUserManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminLogs from './AdminLogs';

const AdminDashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total user count
        const { count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        setUserCount(count || 0);

        // Get unread notifications count
        const { data: notifications } = await supabase
          .from('admin_audit_log')
          .select('*')
          .eq('read', false)
          .limit(1);

        setUnreadNotifications(notifications?.length || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-background-dark">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/10">
        <div className="container-custom h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-accent-500 mr-3" />
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-300 hover:text-white">
              <Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="btn-ghost"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <div className="glass-panel overflow-hidden">
                <nav className="flex flex-col">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 border-l-4 ${
                        isActive
                          ? 'border-accent-300 bg-white/5 text-accent-300'
                          : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    <BarChart2 className="w-5 h-5 mr-3" />
                    <span>Overview</span>
                    <ChevronRight className="w-5 h-5 ml-auto" />
                  </NavLink>

                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 border-l-4 ${
                        isActive
                          ? 'border-accent-300 bg-white/5 text-accent-300'
                          : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Users</span>
                    <span className="ml-auto flex items-center">
                      <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full mr-2">
                        {userCount}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </NavLink>

                  <NavLink
                    to="/admin/content"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 border-l-4 ${
                        isActive
                          ? 'border-accent-300 bg-white/5 text-accent-300'
                          : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Content</span>
                    <ChevronRight className="w-5 h-5 ml-auto" />
                  </NavLink>

                  <NavLink
                    to="/admin/logs"
                    className={({ isActive }) =>
                      `flex items-center px-6 py-4 border-l-4 ${
                        isActive
                          ? 'border-accent-300 bg-white/5 text-accent-300'
                          : 'border-transparent hover:bg-white/5 text-gray-300 hover:text-white'
                      }`
                    }
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>System Logs</span>
                    <ChevronRight className="w-5 h-5 ml-auto" />
                  </NavLink>

                  <NavLink
                    to="/admin/settings"
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

              {/* Quick Stats */}
              <div className="glass-panel mt-6 p-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">System Load</span>
                      <span className="text-accent-300">28%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-accent-300">64%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Database</span>
                      <span className="text-accent-300">42%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <div className="glass-panel">
                <Routes>
                  <Route path="/" element={<AdminOverview />} />
                  <Route path="/users/*" element={<AdminUserManagement />} />
                  <Route path="/content/*" element={<AdminAnalytics />} />
                  <Route path="/logs/*" element={<AdminLogs />} />
                  <Route path="/settings/*" element={<AdminSettings />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;