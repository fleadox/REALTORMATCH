import React from 'react';
import { Calendar, Users, Home, DollarSign } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-600">Total Users</h3>
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <p className="text-3xl font-bold">42</p>
          <p className="text-sm text-success-600 flex items-center mt-2">
            <span className="text-success-600 mr-1">↑</span> 12% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-600">New Registrations</h3>
            <Calendar className="h-6 w-6 text-accent-600" />
          </div>
          <p className="text-3xl font-bold">7</p>
          <p className="text-sm text-success-600 flex items-center mt-2">
            <span className="text-success-600 mr-1">↑</span> 5% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-600">Active Listings</h3>
            <Home className="h-6 w-6 text-secondary-600" />
          </div>
          <p className="text-3xl font-bold">89</p>
          <p className="text-sm text-success-600 flex items-center mt-2">
            <span className="text-success-600 mr-1">↑</span> 18% from last month
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-600">Monthly Revenue</h3>
            <DollarSign className="h-6 w-6 text-success-600" />
          </div>
          <p className="text-3xl font-bold">$1,245</p>
          <p className="text-sm text-success-600 flex items-center mt-2">
            <span className="text-success-600 mr-1">↑</span> 23% from last month
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">User Growth</h3>
          
          <div className="h-60 flex items-end justify-between">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.floor(Math.random() * 80) + 20;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="bg-primary-500 w-8 rounded-t-sm transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(2023, i).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Featured Agents</span>
                <span className="text-sm font-bold">$745</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Premium Agents</span>
                <span className="text-sm font-bold">$350</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-accent-500 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Advertisements</span>
                <span className="text-sm font-bold">$150</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-secondary-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4">Region Distribution</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Atlanta Metro</span>
                <span className="text-sm font-bold">48%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Savannah & Coastal</span>
                <span className="text-sm font-bold">23%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Athens & Northeast</span>
                <span className="text-sm font-bold">15%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Macon & Central</span>
                <span className="text-sm font-bold">8%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Augusta & East</span>
                <span className="text-sm font-bold">4%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '4%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Other Regions</span>
                <span className="text-sm font-bold">2%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '2%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <button className="btn-primary">
          Download Full Report
        </button>
      </div>
    </div>
  );
};

export default AdminAnalytics;