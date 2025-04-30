import React, { useState } from 'react';
import { Search, Filter, Edit, Trash2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { users, profiles } from '../../utils/mockData';

const AdminUserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'registrationDate' | 'lastLogin' | 'email'>('registrationDate');
  
  // Filter and sort users
  const filteredUsers = users.filter(user => {
    const matchesStatus = 
      statusFilter === 'all' || 
      user.accountStatus === statusFilter;
    
    const matchesSearch = 
      !searchQuery || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortField === 'email') {
      return sortOrder === 'asc' 
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });
  
  const handleSort = (field: 'registrationDate' | 'lastLogin' | 'email') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortOrder === 'asc' 
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };
  
  const getUserStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const hasProfile = (userId: string) => {
    return profiles.some(profile => profile.userId === userId);
  };
  
  return (
    <div>
      <h2 className="text-2xl mb-6">User Management</h2>
      
      <div className="mb-6 flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'active' 
                ? 'bg-success-100 text-success-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              statusFilter === 'suspended' 
                ? 'bg-error-100 text-error-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setStatusFilter('suspended')}
          >
            Suspended
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by email"
            className="input pl-10 w-full md:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('email')}>
                    Email
                    {getSortIcon('email')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('registrationDate')}>
                    Registration Date
                    {getSortIcon('registrationDate')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center cursor-pointer" onClick={() => handleSort('lastLogin')}>
                    Last Login
                    {getSortIcon('lastLogin')}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        {user.isAdmin && (
                          <div className="text-xs text-primary-700">Administrator</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserStatusClass(user.accountStatus)}`}>
                      {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {hasProfile(user.id) ? (
                      <span className="text-success-700">Created</span>
                    ) : (
                      <span className="text-gray-500">Not Created</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="p-1 text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-gray-600 hover:text-error-700 hover:bg-error-50 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
          <span className="font-medium">{users.length}</span> users
        </div>
        
        <div className="flex space-x-2">
          <button className="btn-outline py-1 px-3">
            Previous
          </button>
          <button className="btn-outline py-1 px-3">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;