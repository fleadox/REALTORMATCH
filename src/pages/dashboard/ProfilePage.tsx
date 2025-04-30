import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, CheckCircle, AlertCircle, Save, X, Camera, MapPin, Globe, Building, Phone } from 'lucide-react';
import { profiles, users } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import SocialMediaLinks from '../../components/profile/SocialMediaLinks';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Find profile for the current user
  const userProfile = profiles.find(profile => 
    users.find(u => u.id === profile.userId)?.email === user?.email
  );

  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    phoneNumber: userProfile?.phoneNumber || '',
    agencyAffiliation: userProfile?.agencyAffiliation || '',
    bio: userProfile?.bio || '',
    regionsServed: userProfile?.regionsServed || [],
    languages: userProfile?.languages || [],
    socialLinks: userProfile?.socialLinks ? Object.entries(userProfile.socialLinks).map(([platform, url]) => ({
      id: crypto.randomUUID(),
      platform,
      url: url || ''
    })) : []
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          id: crypto.randomUUID(),
          platform: 'website',
          url: ''
        }
      ]
    }));
  };

  const handleRemoveSocialLink = (id: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id)
    }));
  };

  const handleUpdateSocialLink = (id: string, updates: Partial<{ platform: string; url: string }>) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      )
    }));
  };

  const handleReorderSocialLinks = (newLinks: typeof formData.socialLinks) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: newLinks
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    // Show success message
    alert('Profile updated successfully!');
  };
  
  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <div className="glass-panel-dark p-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-error-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-300 mb-6">
            You haven't created your agent profile yet. Create one now to get started.
          </p>
          <Link to="/dashboard/profile/create" className="btn-accent">
            Create Profile
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
        {isEditing ? (
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsEditing(false)} 
              className="btn-ghost"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="btn-accent"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="btn-accent"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Profile
          </button>
        )}
      </div>
      
      {/* Profile Status */}
      <div className="glass-panel-dark p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${userProfile.verificationStatus ? 'bg-accent-500' : 'bg-yellow-500'} mr-3`}></div>
            <span className="text-white font-medium">
              {userProfile.verificationStatus ? 'Verified Agent' : 'Pending Verification'}
            </span>
          </div>
          {userProfile.featuredStatus && (
            <div className="glass-panel px-3 py-1 text-sm text-accent-300 border border-accent-500/20">
              Featured Agent
            </div>
          )}
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <div className="glass-panel-dark p-6">
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img 
                  src={photoPreview || userProfile.photoUrl} 
                  alt={formData.fullName || userProfile.fullName} 
                  className="w-full h-full rounded-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 p-2 bg-accent-500 rounded-full cursor-pointer hover:bg-accent-600 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input text-center text-xl font-bold mb-1"
                />
              ) : (
                <h3 className="text-xl font-bold text-white mb-1">{userProfile.fullName}</h3>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="agencyAffiliation"
                  value={formData.agencyAffiliation}
                  onChange={handleChange}
                  className="input text-center"
                />
              ) : (
                <p className="text-gray-400">{userProfile.agencyAffiliation}</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Contact</h4>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="input pl-10"
                    />
                  </div>
                ) : (
                  <p className="text-white">{userProfile.phoneNumber}</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Languages</h4>
                {isEditing ? (
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      multiple
                      name="languages"
                      value={formData.languages}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData(prev => ({ ...prev, languages: values }));
                      }}
                      className="input pl-10 h-32"
                    >
                      <option value="Georgian">Georgian</option>
                      <option value="English">English</option>
                      <option value="Russian">Russian</option>
                      <option value="Turkish">Turkish</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.languages.map(language => (
                      <span 
                        key={language}
                        className="glass-panel-dark text-sm py-1 px-2 text-gray-300"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <SocialMediaLinks
                links={formData.socialLinks}
                onAdd={handleAddSocialLink}
                onRemove={handleRemoveSocialLink}
                onUpdate={(id, url) => handleUpdateSocialLink(id, { url })}
                onReorder={handleReorderSocialLinks}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="lg:col-span-2">
          {/* Bio Section */}
          <div className="glass-panel-dark p-6 mb-6">
            <h3 className="text-lg font-medium text-white mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="input w-full h-32"
                placeholder="Tell potential clients about your experience and expertise..."
              />
            ) : (
              <p className="text-gray-300 whitespace-pre-line">{userProfile.bio}</p>
            )}
          </div>
          
          {/* Regions Section */}
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Regions Served</h3>
            {isEditing ? (
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  multiple
                  name="regionsServed"
                  value={formData.regionsServed}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, regionsServed: values }));
                  }}
                  className="input pl-10 h-32"
                >
                  <option value="Tbilisi">Tbilisi</option>
                  <option value="Batumi">Batumi</option>
                  <option value="Kutaisi">Kutaisi</option>
                  <option value="Rustavi">Rustavi</option>
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.regionsServed.map(region => (
                  <div 
                    key={region}
                    className="glass-panel-dark p-4 text-gray-300"
                  >
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;