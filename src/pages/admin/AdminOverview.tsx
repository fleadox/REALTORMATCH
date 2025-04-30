import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 400, revenue: 2400, activity: 1800 },
  { name: 'Feb', users: 300, revenue: 1398, activity: 2210 },
  { name: 'Mar', users: 200, revenue: 9800, activity: 2290 },
  { name: 'Apr', users: 278, revenue: 3908, activity: 2000 },
  { name: 'May', users: 189, revenue: 4800, activity: 2181 },
  { name: 'Jun', users: 239, revenue: 3800, activity: 2500 },
  { name: 'Jul', users: 349, revenue: 4300, activity: 2100 },
];

const AdminOverview: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Last updated: 5 minutes ago</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
            <span className="text-sm text-accent-300">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">2,847</h3>
          <p className="text-gray-400 text-sm">Total Users</p>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-300 mr-1" />
            <span className="text-accent-300">147 new this week</span>
          </div>
        </div>

        <div className="glass-panel-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-accent-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-accent-500" />
            </div>
            <span className="text-sm text-error-400">-3.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">1,438</h3>
          <p className="text-gray-400 text-sm">Active Listings</p>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownRight className="w-4 h-4 text-error-400 mr-1" />
            <span className="text-error-400">24 less than last week</span>
          </div>
        </div>

        <div className="glass-panel-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-success-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-success-500" />
            </div>
            <span className="text-sm text-accent-300">+28.4%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">$24,389</h3>
          <p className="text-gray-400 text-sm">Monthly Revenue</p>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-300 mr-1" />
            <span className="text-accent-300">$5,400 increase</span>
          </div>
        </div>

        <div className="glass-panel-dark p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-warning-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-warning-500" />
            </div>
            <span className="text-sm text-accent-300">+8.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">94.2%</h3>
          <p className="text-gray-400 text-sm">System Uptime</p>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-accent-300 mr-1" />
            <span className="text-accent-300">2.3% improvement</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-6">User Growth</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2ECC71" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#2ECC71"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-6">Revenue Analytics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A8E6CF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#A8E6CF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A8E6CF"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel-dark p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
          <Link to="/admin/logs" className="text-sm text-accent-300 hover:text-accent-400">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-4">
              <Users className="w-4 h-4 text-primary-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">New user registration: <span className="text-accent-300">john.doe@example.com</span></p>
              <p className="text-sm text-gray-400">2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-warning-500/20 flex items-center justify-center mr-4">
              <AlertCircle className="w-4 h-4 text-warning-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">System alert: High CPU usage detected</p>
              <p className="text-sm text-gray-400">15 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center mr-4">
              <FileText className="w-4 h-4 text-accent-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">New property listing approved: <span className="text-accent-300">Luxury Condo in Midtown</span></p>
              <p className="text-sm text-gray-400">1 hour ago</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-success-500/20 flex items-center justify-center mr-4">
              <DollarSign className="w-4 h-4 text-success-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">Payment received: <span className="text-accent-300">$299.00</span> for Premium Listing</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;