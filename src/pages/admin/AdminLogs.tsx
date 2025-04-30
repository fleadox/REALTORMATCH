import React, { useState } from 'react';
import { AlertCircle, Search, Filter, Download, RefreshCw } from 'lucide-react';

const AdminLogs: React.FC = () => {
  const [logType, setLogType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">System Logs</h2>
        <div className="flex space-x-3">
          <button className="btn-ghost">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
          <button className="btn-ghost">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              logType === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setLogType('all')}
          >
            All Logs
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              logType === 'error' 
                ? 'bg-error-100 text-error-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setLogType('error')}
          >
            Errors
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              logType === 'security' 
                ? 'bg-warning-100 text-warning-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setLogType('security')}
          >
            Security
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search logs..."
            className="input pl-10 w-full md:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Message
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  2025-04-20 20:15:32
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-error-100 text-error-800">
                    ERROR
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Authentication
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  Failed login attempt: Invalid credentials
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  192.168.1.100
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  2025-04-20 20:14:55
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                    WARN
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  Security
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  Rate limit exceeded for IP: 192.168.1.101
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  192.168.1.101
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  2025-04-20 20:13:22
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                    INFO
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  System
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  Database backup completed successfully
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  127.0.0.1
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">1</span> to{' '}
            <span className="font-medium text-white">10</span> of{' '}
            <span className="font-medium text-white">20</span> results
          </div>
          <div className="flex space-x-2">
            <button className="btn-ghost py-2 px-4" disabled>
              Previous
            </button>
            <button className="btn-ghost py-2 px-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;