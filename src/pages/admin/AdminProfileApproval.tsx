import React, { useState } from 'react';
import { Check, X, ChevronRight, ChevronDown, Search, AlertCircle } from 'lucide-react';
import { profiles, users } from '../../utils/mockData';

const AdminProfileApproval: React.FC = () => {
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProfileId, setExpandedProfileId] = useState<string | null>(null);
  
  // Filter profiles based on verification status and search query
  const filteredProfiles = profiles.filter(profile => {
    const matchesFilter = 
      (filter === 'pending' && !profile.verificationStatus) ||
      (filter === 'approved' && profile.verificationStatus) ||
      (filter === 'all');
    
    const matchesSearch = 
      !searchQuery || 
      profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.agencyAffiliation.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  const toggleExpand = (profileId: string) => {
    if (expandedProfileId === profileId) {
      setExpandedProfileId(null);
    } else {
      setExpandedProfileId(profileId);
    }
  };
  
  const handleApprove = (profileId: string) => {
    // In a real app, this would send an API request to approve the profile
    alert(`Profile ${profileId} approved`);
  };
  
  const handleReject = (profileId: string) => {
    // In a real app, this would send an API request to reject the profile
    alert(`Profile ${profileId} rejected`);
  };
  
  return (
    <div>
      <h2 className="text-2xl mb-6">Profile Approvals</h2>
      
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'approved' 
                ? 'bg-success-100 text-success-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or agency"
            className="input pl-10 w-full md:w-auto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-xl mb-2">No Profiles Found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {filter === 'pending' 
              ? 'There are no pending profiles awaiting approval at this time.'
              : filter === 'approved'
              ? 'No approved profiles match your search criteria.'
              : 'No profiles match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProfiles.map(profile => {
            const isExpanded = expandedProfileId === profile.id;
            const userEmail = users.find(u => u.id === profile.userId)?.email;
            
            return (
              <div key={profile.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="p-4 bg-white flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpand(profile.id)}
                >
                  <div className="flex items-center">
                    <img 
                      src={profile.photoUrl} 
                      alt={profile.fullName}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{profile.fullName}</h3>
                      <p className="text-sm text-gray-600">{profile.agencyAffiliation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {profile.verificationStatus ? (
                      <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm mr-4">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mr-4">
                        Pending
                      </span>
                    )}
                    
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <img 
                          src={profile.photoUrl} 
                          alt={profile.fullName}
                          className="w-full h-auto rounded-lg mb-4"
                        />
                        
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-medium mb-2">Contact Information</h4>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Email:</strong> {userEmail}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Phone:</strong> {profile.phoneNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Regions:</strong> {profile.regionsServed.join(', ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                          <h4 className="font-medium mb-2">Profile Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Experience:</strong> {profile.experienceLevel} years
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Languages:</strong> {profile.languages.join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Featured Status:</strong> {profile.featuredStatus ? 'Yes' : 'No'}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                <strong>Verification Status:</strong> {profile.verificationStatus ? 'Verified' : 'Pending'}
                              </p>
                            </div>
                          </div>
                          
                          <h4 className="font-medium mb-2">Bio</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            {profile.bio}
                          </p>
                          
                          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                            <>
                              <h4 className="font-medium mb-2">Social Links</h4>
                              <div className="text-sm text-gray-600">
                                {Object.entries(profile.socialLinks).map(([platform, url]) => (
                                  url && (
                                    <div key={platform} className="mb-1">
                                      <strong className="capitalize">{platform}:</strong>{' '}
                                      <a href={url} target="_blank" rel="noreferrer" className="text-primary-700">
                                        {url}
                                      </a>
                                    </div>
                                  )
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        
                        {!profile.verificationStatus && (
                          <div className="flex space-x-4">
                            <button 
                              className="btn-success flex-1"
                              onClick={() => handleApprove(profile.id)}
                            >
                              <Check className="w-5 h-5 mr-2" />
                              Approve Profile
                            </button>
                            <button 
                              className="btn-error flex-1"
                              onClick={() => handleReject(profile.id)}
                            >
                              <X className="w-5 h-5 mr-2" />
                              Reject Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminProfileApproval;