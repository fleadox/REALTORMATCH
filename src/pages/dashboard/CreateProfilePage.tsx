import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Phone, User, Building, Languages, AlertCircle } from 'lucide-react';
import { georgianRegions } from '../../utils/mockData';

const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    regions: [] as string[],
    languages: ['Georgian'],
    bio: '',
    agencyAffiliation: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Georgian cities for suggestions
  const cities = ['Tbilisi', 'Batumi', 'Kutaisi', 'Rustavi', 'Gori', 'Poti', 'Zugdidi', 'Telavi'];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotoPreview(reader.result as string);
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, regions: value }));
    setErrors(prev => ({ ...prev, regions: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+995\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be in format: +995 XXX XX XX XX';
    }

    if (!photoPreview) {
      newErrors.photo = 'Profile photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // In a real app, this would submit to the backend
    navigate('/dashboard');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Agent Profile</h2>
        <p className="text-gray-400">
          Complete your profile to start connecting with potential clients
        </p>
      </div>

      {Object.values(errors).some(error => error) && (
        <div className="glass-panel-dark mb-6 p-4 text-error-400 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Please fix the following errors:</p>
            <ul className="mt-2 list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                error && <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-4">Profile Photo</h3>
          
          <div className="flex items-center space-x-6">
            <div className="relative w-32 h-32">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label className="absolute bottom-2 right-2 p-2 bg-accent-500 rounded-full cursor-pointer hover:bg-accent-600 transition-colors">
                <Upload className="w-4 h-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white mb-2">Upload a Professional Photo</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Professional headshot recommended</li>
                <li>• Clear, high-quality image</li>
                <li>• Maximum size: 5MB</li>
                <li>• Formats: JPG, PNG</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-white text-sm font-medium mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`input pl-10 ${errors.fullName ? 'border-error-500' : ''}`}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-white text-sm font-medium mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  className={`input pl-10 ${errors.phoneNumber ? 'border-error-500' : ''}`}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+995 XXX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-white text-sm font-medium mb-1">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="input pl-10"
                  value={formData.city}
                  onChange={handleChange}
                  list="cities"
                  placeholder="Select or type your city"
                />
                <datalist id="cities">
                  {cities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label htmlFor="agencyAffiliation" className="block text-white text-sm font-medium mb-1">
                Agency Affiliation
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="agencyAffiliation"
                  name="agencyAffiliation"
                  className="input pl-10"
                  value={formData.agencyAffiliation}
                  onChange={handleChange}
                  placeholder="Your real estate agency"
                />
              </div>
            </div>

            <div>
              <label htmlFor="regions" className="block text-white text-sm font-medium mb-1">
                Regions Served
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="regions"
                  name="regions"
                  multiple
                  className="input pl-10 h-32"
                  value={formData.regions}
                  onChange={handleRegionChange}
                >
                  {georgianRegions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-400">Hold Ctrl/Cmd to select multiple regions</p>
            </div>

            <div>
              <label htmlFor="languages" className="block text-white text-sm font-medium mb-1">
                Languages
              </label>
              <div className="relative">
                <Languages className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  id="languages"
                  name="languages"
                  multiple
                  className="input pl-10 h-32"
                  value={formData.languages}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    languages: Array.from(e.target.selectedOptions, option => option.value)
                  }))}
                >
                  <option value="Georgian">Georgian</option>
                  <option value="English">English</option>
                  <option value="Russian">Russian</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Armenian">Armenian</option>
                  <option value="Azerbaijani">Azerbaijani</option>
                </select>
              </div>
              <p className="mt-1 text-sm text-gray-400">Hold Ctrl/Cmd to select multiple languages</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-4">Professional Bio</h3>
          
          <div>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              className="input"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell potential clients about your experience and expertise..."
            ></textarea>
            <p className="mt-1 text-sm text-gray-400">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-ghost"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-accent"
          >
            Create Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfilePage;