import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Building2, Globe, Languages, 
  BriefcaseBusiness, Award, Clock, Save, X, Camera, Check,
  AlertTriangle, Link as LinkIcon
} from 'lucide-react';
import { profileSchema, type ProfileFormData } from '../../lib/validation';
import { georgianRegions } from '../../utils/mockData';
import SocialMediaLinks from './SocialMediaLinks';

interface EditProfileFormProps {
  initialData: Partial<ProfileFormData>;
  onCancel: () => void;
  onSave: (data: ProfileFormData) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onCancel,
  onSave
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(initialData.photoUrl);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, dirtyFields },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...initialData,
      availability: initialData.availability || {
        status: 'available',
        message: ''
      },
      contactPreferences: initialData.contactPreferences || {
        email: true,
        phone: true,
        whatsapp: true
      },
      expertise: initialData.expertise || [],
      credentials: initialData.credentials || []
    }
  });

  // Watch form changes for auto-save
  const formValues = watch();
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return;

    const timer = setTimeout(() => {
      handleAutoSave();
    }, 3000);

    return () => clearTimeout(timer);
  }, [formValues, autoSaveEnabled]);

  const handleAutoSave = async () => {
    try {
      const isValid = await profileSchema.parseAsync(formValues);
      if (isValid) {
        await onSave(formValues);
        setLastSaved(new Date());
      }
    } catch (error) {
      // Silent fail for auto-save
      console.error('Auto-save validation failed:', error);
    }
  };

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotoPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast.success('Profile updated successfully');
      setLastSaved(new Date());
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
            <label className="absolute bottom-2 right-2 p-2 bg-accent-500 rounded-full cursor-pointer hover:bg-accent-600 transition-colors">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <div>
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
            <label className="block text-white text-sm font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className={`input pl-10 ${errors.fullName ? 'border-error-500' : ''}`}
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-error-400">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                className={`input pl-10 ${errors.email ? 'border-error-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                className={`input pl-10 ${errors.phoneNumber ? 'border-error-500' : ''}`}
                placeholder="+995 XXX XX XX XX"
                {...register('phoneNumber')}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-error-400">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Agency Affiliation
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className={`input pl-10 ${errors.agencyAffiliation ? 'border-error-500' : ''}`}
                {...register('agencyAffiliation')}
              />
            </div>
            {errors.agencyAffiliation && (
              <p className="mt-1 text-sm text-error-400">{errors.agencyAffiliation.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Professional Information</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Experience Level
            </label>
            <div className="relative">
              <BriefcaseBusiness className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className={`input pl-10 ${errors.experienceLevel ? 'border-error-500' : ''}`}
                {...register('experienceLevel')}
              >
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            {errors.experienceLevel && (
              <p className="mt-1 text-sm text-error-400">{errors.experienceLevel.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Areas of Expertise
            </label>
            <div className="space-y-2">
              {[
                'Residential Sales',
                'Commercial Properties',
                'Luxury Real Estate',
                'Investment Properties',
                'New Developments',
                'Property Management',
                'International Buyers',
                'Land Development'
              ].map((area) => (
                <label key={area} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={area}
                    {...register('expertise')}
                    className="form-checkbox h-4 w-4 text-accent-500"
                  />
                  <span className="text-gray-300">{area}</span>
                </label>
              ))}
            </div>
            {errors.expertise && (
              <p className="mt-1 text-sm text-error-400">{errors.expertise.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Professional Bio
            </label>
            <textarea
              className={`input min-h-[120px] ${errors.bio ? 'border-error-500' : ''}`}
              {...register('bio')}
            />
            <div className="mt-1 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {watch('bio')?.length || 0}/500 characters
              </div>
              {errors.bio && (
                <p className="text-sm text-error-400">{errors.bio.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Credentials & Certifications
            </label>
            <Controller
              name="credentials"
              control={control}
              render={({ field }) => (
                <div className="space-y-4">
                  {field.value.map((credential, index) => (
                    <div key={credential.id} className="glass-panel p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Award className="w-5 h-5 text-accent-300 mr-2" />
                          <input
                            type="text"
                            className="input"
                            placeholder="Credential Type"
                            value={credential.type}
                            onChange={(e) => {
                              const newCredentials = [...field.value];
                              newCredentials[index].type = e.target.value;
                              field.onChange(newCredentials);
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          className="text-error-400 hover:text-error-300"
                          onClick={() => {
                            field.onChange(field.value.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          className="input"
                          placeholder="License/Certificate Number"
                          value={credential.number}
                          onChange={(e) => {
                            const newCredentials = [...field.value];
                            newCredentials[index].number = e.target.value;
                            field.onChange(newCredentials);
                          }}
                        />
                        <input
                          type="date"
                          className="input"
                          value={credential.issueDate}
                          onChange={(e) => {
                            const newCredentials = [...field.value];
                            newCredentials[index].issueDate = e.target.value;
                            field.onChange(newCredentials);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn-ghost w-full"
                    onClick={() => {
                      field.onChange([
                        ...field.value,
                        {
                          id: crypto.randomUUID(),
                          type: '',
                          number: '',
                          issueDate: new Date().toISOString().split('T')[0]
                        }
                      ]);
                    }}
                  >
                    Add Credential
                  </button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Regions & Languages */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Coverage & Languages</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Regions Served
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                multiple
                className={`input pl-10 h-32 ${errors.regionsServed ? 'border-error-500' : ''}`}
                {...register('regionsServed')}
              >
                {georgianRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            {errors.regionsServed && (
              <p className="mt-1 text-sm text-error-400">{errors.regionsServed.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Languages
            </label>
            <div className="relative">
              <Languages className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                multiple
                className={`input pl-10 h-32 ${errors.languages ? 'border-error-500' : ''}`}
                {...register('languages')}
              >
                <option value="Georgian">Georgian</option>
                <option value="English">English</option>
                <option value="Russian">Russian</option>
                <option value="Turkish">Turkish</option>
                <option value="Armenian">Armenian</option>
                <option value="Azerbaijani">Azerbaijani</option>
              </select>
            </div>
            {errors.languages && (
              <p className="mt-1 text-sm text-error-400">{errors.languages.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Availability & Contact Preferences */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Availability & Contact</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Availability Status
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="input pl-10"
                {...register('availability.status')}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="away">Away</option>
              </select>
            </div>
            <input
              type="text"
              className="input mt-2"
              placeholder="Custom availability message (optional)"
              {...register('availability.message')}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Contact Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('contactPreferences.email')}
                  className="form-checkbox h-4 w-4 text-accent-500"
                />
                <span className="text-gray-300">Email</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('contactPreferences.phone')}
                  className="form-checkbox h-4 w-4 text-accent-500"
                />
                <span className="text-gray-300">Phone</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('contactPreferences.whatsapp')}
                  className="form-checkbox h-4 w-4 text-accent-500"
                />
                <span className="text-gray-300">WhatsApp</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Social Media Links</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Facebook
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                className={`input pl-10 ${errors.socialLinks?.facebook ? 'border-error-500' : ''}`}
                placeholder="https://facebook.com/your-profile"
                {...register('socialLinks.facebook')}
              />
            </div>
            {errors.socialLinks?.facebook && (
              <p className="mt-1 text-sm text-error-400">{errors.socialLinks.facebook.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              Instagram
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                className={`input pl-10 ${errors.socialLinks?.instagram ? 'border-error-500' : ''}`}
                placeholder="https://instagram.com/your-profile"
                {...register('socialLinks.instagram')}
              />
            </div>
            {errors.socialLinks?.instagram && (
              <p className="mt-1 text-sm text-error-400">{errors.socialLinks.instagram.message}</p>
            )}
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-1">
              LinkedIn
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="url"
                className={`input pl-10 ${errors.socialLinks?.linkedin ? 'border-error-500' : ''}`}
                placeholder="https://linkedin.com/in/your-profile"
                {...register('socialLinks.linkedin')}
              />
            </div>
            {errors.socialLinks?.linkedin && (
              <p className="mt-1 text-sm text-error-400">{errors.socialLinks.linkedin.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Auto-save Toggle */}
      <div className="glass-panel-dark p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoSave"
            checked={autoSaveEnabled}
            onChange={(e) => setAutoSaveEnabled(e.target.checked)}
            className="form-checkbox h-4 w-4 text-accent-500"
          />
          <label htmlFor="autoSave" className="text-sm text-gray-300">
            Enable auto-save
          </label>
        </div>
        {lastSaved && (
          <p className="text-sm text-gray-400">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="w-5 h-5 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-accent"
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? (
            <>
              <AlertTriangle className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;