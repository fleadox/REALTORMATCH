import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { BarChart2, Users, FileText, Settings, Bell, LogOut, ChevronRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminOverview from './AdminOverview';
import AdminUserManagement from './AdminUserManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminLogs from './AdminLogs';

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalAgents: number;
  recentNotifications: Notification[];
}

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  type: 'info' | 'warning' | 'error';
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  const handleLogout = async () => {
    // Implement logout logic
    navigate('/admin/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stats) {
    return <div>No data available</div>;
  }

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