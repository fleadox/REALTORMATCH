import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Search, Copy, Check, AlertTriangle, X, Loader2, DollarSign, Link as LinkIcon, ImageIcon, Building2, MapPin, Home } from 'lucide-react';
import { propertyLinks, profiles, georgianRegions } from '../../utils/mockData';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface PropertyFormData {
  title: string;
  description: string;
  propertyType: string;
  price: string;
  city: string;
  streetAddress: string;
  externalUrl: string;
  imageUrl: string;
  imageFile: File | null;
  imagePreview: string;
  numRooms?: string;
  space?: string;
  floor?: string;
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  propertyType: '',
  price: '',
  city: '',
  streetAddress: '',
  externalUrl: '',
  imageUrl: '',
  imageFile: null,
  imagePreview: '',
  numRooms: '',
  space: '',
  floor: '',
};

interface EditFormData {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  location: string;
  price: number;
  externalUrl: string;
  imageUrl: string;
}

interface EditableProperty {
  id: string;
  field: keyof typeof propertyLinks[0];
  value: string | number;
}

const PropertyLinksPage: React.FC = () => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProperty, setEditingProperty] = useState<EditFormData | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingField, setEditingField] = useState<EditableProperty | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const userProfileId = profiles.find(
    profile => profile.userId === user?.id
  )?.id;
  
  const userProperties = userProfileId
    ? propertyLinks.filter(property => property.profileId === userProfileId)
    : [];

  const filteredProperties = userProperties.filter(property =>
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleEdit = (property: typeof propertyLinks[0]) => {
    setEditingProperty({
      id: property.id,
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      location: property.location,
      price: property.price,
      externalUrl: property.externalUrl,
      imageUrl: property.imageUrl,
    });
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    toast.success('Property link deleted');
    setShowDeleteConfirm(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Property link updated');
    setShowEditModal(false);
    setEditingProperty(null);
  };

  const startEditing = (property: typeof propertyLinks[0], field: keyof typeof propertyLinks[0]) => {
    if (editingField) return;
    
    setEditingField({
      id: property.id,
      field,
      value: property[field]
    });
    setEditValue(String(property[field]));

    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 0);
  };

  const handleEditSave = async () => {
    if (!editingField) return;

    try {
      let isValid = true;
      let validatedValue: string | number = editValue;

      switch (editingField.field) {
        case 'price':
          const price = Number(editValue);
          if (isNaN(price) || price <= 0) {
            isValid = false;
            toast.error('Please enter a valid price');
          }
          validatedValue = price;
          break;
        case 'title':
          if (editValue.length === 0 || editValue.length > 100) {
            isValid = false;
            toast.error('Title must be between 1 and 100 characters');
          }
          break;
        case 'description':
          if (editValue.length > 500) {
            isValid = false;
            toast.error('Description must be less than 500 characters');
          }
          break;
      }

      if (!isValid) return;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Property updated successfully');
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (!formData.propertyType) {
      errors.propertyType = 'Property type is required';
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Valid price is required';
    }

    if (!formData.city) {
      errors.city = 'City is required';
    }

    if (!formData.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }

    if (!formData.externalUrl.trim()) {
      errors.externalUrl = 'External URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.externalUrl)) {
      errors.externalUrl = 'URL must start with http:// or https://';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    if (formData.numRooms && (isNaN(Number(formData.numRooms)) || Number(formData.numRooms) < 0)) {
      errors.numRooms = 'Must be a valid number';
    }

    if (formData.space && (isNaN(Number(formData.space)) || Number(formData.space) <= 0)) {
      errors.space = 'Must be a valid number';
    }

    if (formData.floor && (isNaN(Number(formData.floor)) || Number(formData.floor) < 0)) {
      errors.floor = 'Must be a valid number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors(prev => ({
        ...prev,
        imageFile: 'Image must be less than 5MB'
      }));
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setFormErrors(prev => ({
        ...prev,
        imageFile: 'Only JPG and PNG images are allowed'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result as string
      }));
      setFormErrors(prev => ({ ...prev, imageFile: undefined }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      imagePreview: '',
      imageUrl: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Property added successfully');
      setShowAddModal(false);
      setFormData(initialFormData);
    } catch (error) {
      toast.error('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel-dark">
      {/* Header Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">My Property Links</h2>
            <p className="text-gray-400 mt-1">
              {userProperties.length}/30 properties listed
            </p>
          </div>
          <button 
            className="btn-accent flex items-center whitespace-nowrap"
            onClick={() => setShowAddModal(true)}
            disabled={userProperties.length >= 30}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property Link
          </button>
        </div>

        {/* Search Bar */}
        {userProperties.length > 0 && (
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {userProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Properties Added</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start showcasing your property listings by adding external links. You can add up to 30 property links to your profile.
            </p>
            <button 
              className="btn-accent"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Property Link
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProperties.map(property => (
              <div 
                key={property.id} 
                className="glass-panel border border-white/10 hover:border-accent-500/50 transition-colors overflow-hidden"
              >
                {/* Property Image */}
                <div className="relative h-48">
                  <img 
                    src={property.imageUrl} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Quick Actions - Always visible */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      className="p-2 bg-background-dark/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => handleEdit(property)}
                      aria-label="Edit property"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 bg-background-dark/80 backdrop-blur-sm rounded-lg text-gray-300 hover:text-error-400 hover:bg-error-400/10 transition-colors"
                      onClick={() => setShowDeleteConfirm(property.id)}
                      aria-label="Delete property"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-4">
                      {editingField?.id === property.id && editingField.field === 'title' ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          className="input flex-1 text-xl font-bold"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          onBlur={handleEditSave}
                        />
                      ) : (
                        <h3 
                          className="text-xl font-bold text-white hover:text-accent-300 transition-colors cursor-pointer"
                          onClick={() => startEditing(property, 'title')}
                        >
                          {property.title}
                        </h3>
                      )}
                      <div className="glass-panel px-3 py-1 text-sm text-accent-300 whitespace-nowrap">
                        {editingField?.id === property.id && editingField.field === 'propertyType' ? (
                          <select
                            ref={editInputRef}
                            className="input py-0 px-2 text-sm min-w-[100px]"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleEditSave}
                          >
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Villa">Villa</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Land">Land</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <span 
                            className="cursor-pointer"
                            onClick={() => startEditing(property, 'propertyType')}
                          >
                            {property.propertyType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location Details */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        {editingField?.id === property.id && editingField.field === 'location' ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            className="input flex-1"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            onBlur={handleEditSave}
                          />
                        ) : (
                          <span 
                            className="truncate cursor-pointer"
                            onClick={() => startEditing(property, 'location')}
                          >
                            {property.location}
                          </span>
                        )}
                      </div>

                      {/* Additional Property Details */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* Number of Rooms */}
                        <div className="glass-panel-dark p-2 text-center">
                          <span className="text-sm text-gray-400 block">Rooms</span>
                          {editingField?.id === property.id && editingField.field === 'numRooms' ? (
                            <input
                              ref={editInputRef}
                              type="number"
                              className="input w-full text-center py-1"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              onBlur={handleEditSave}
                              min="0"
                            />
                          ) : (
                            <span 
                              className="text-white cursor-pointer"
                              onClick={() => startEditing(property, 'numRooms')}
                            >
                              {property.numRooms || '-'}
                            </span>
                          )}
                        </div>

                        {/* Space */}
                        <div className="glass-panel-dark p-2 text-center">
                          <span className="text-sm text-gray-400 block">Space</span>
                          {editingField?.id === property.id && editingField.field === 'space' ? (
                            <input
                              ref={editInputRef}
                              type="number"
                              className="input w-full text-center py-1"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              onBlur={handleEditSave}
                              min="0"
                            />
                          ) : (
                            <span 
                              className="text-white cursor-pointer"
                              onClick={() => startEditing(property, 'space')}
                            >
                              {property.space ? `${property.space} m²` : '-'}
                            </span>
                          )}
                        </div>

                        {/* Floor */}
                        <div className="glass-panel-dark p-2 text-center">
                          <span className="text-sm text-gray-400 block">Floor</span>
                          {editingField?.id === property.id && editingField.field === 'floor' ? (
                            <input
                              ref={editInputRef}
                              type="number"
                              className="input w-full text-center py-1"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyDown}
                              onBlur={handleEditSave}
                              min="0"
                            />
                          ) : (
                            <span 
                              className="text-white cursor-pointer"
                              onClick={() => startEditing(property, 'floor')}
                            >
                              {property.floor || '-'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {editingField?.id === property.id && editingField.field === 'description' ? (
                    <textarea
                      ref={editInputRef}
                      className="input w-full mb-4"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={handleEditSave}
                      rows={3}
                    />
                  ) : (
                    <p 
                      className="text-gray-300 line-clamp-2 mb-4 cursor-pointer"
                      onClick={() => startEditing(property, 'description')}
                    >
                      {property.description}
                    </p>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    {editingField?.id === property.id && editingField.field === 'price' ? (
                      <input
                        ref={editInputRef}
                        type="number"
                        className="input w-32 text-2xl font-bold"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={handleEditSave}
                        min="0"
                      />
                    ) : (
                      <div 
                        className="text-2xl font-bold text-accent-300 cursor-pointer"
                        onClick={() => startEditing(property, 'price')}
                      >
                        {formatPrice(property.price)}
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopyLink(property.externalUrl, property.id)}
                        className="btn-ghost py-2"
                        aria-label={copiedId === property.id ? 'Link copied' : 'Copy link'}
                      >
                        {copiedId === property.id ? (
                          <Check className="w-5 h-5 text-accent-300" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <a 
                        href={property.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-accent"
                      >
                        View Listing
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative bg-background-dark w-full max-w-2xl mx-4 rounded-xl border border-white/10 shadow-xl animate-scale-in overflow-hidden">
            <div className="sticky top-0 z-10 bg-background-dark p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Add Property Link</h3>
                  <p className="text-sm text-gray-400 mt-1">Add an external property listing to your profile</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Property Photo */}
                <div className="space-y-4">
                  <label className="block text-white text-sm font-medium">
                    Property Photo
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      {formData.imagePreview ? (
                        <>
                          <img 
                            src={formData.imagePreview} 
                            alt="Property Preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 p-1 bg-error-500 rounded-full text-white hover:bg-error-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-ghost mb-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {formData.imageFile ? 'Replace Photo' : 'Upload Photo'}
                      </button>
                      <p className="text-sm text-gray-400">
                        Maximum file size: 5MB<br />
                        Accepted formats: JPG, PNG
                      </p>
                      {formErrors.imageFile && (
                        <p className="mt-1 text-sm text-error-400">{formErrors.imageFile}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Property Title <span className="text-error-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      className={`input ${formErrors.title ? 'border-error-500' : ''}`}
                      value={formData.title}
                      onChange={handleInputChange}
                      maxLength={100}
                      placeholder="e.g., Modern Apartment in City Center"
                      required
                    />
                    {formErrors.title && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.title}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-400">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Property Type <span className="text-error-400">*</span>
                    </label>
                    <select
                      name="propertyType"
                      className={`input ${formErrors.propertyType ? 'border-error-500' : ''}`}
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Property Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.propertyType && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.propertyType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Price <span className="text-error-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        className={`input pl-10 ${formErrors.price ? 'border-error-500' : ''}`}
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="Enter price"
                        required
                      />
                    </div>
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.price}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      City <span className="text-error-400">*</span>
                    </label>
                    <select
                      name="city"
                      className={`input ${formErrors.city ? 'border-error-500' : ''}`}
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select City</option>
                      {georgianRegions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Street Address <span className="text-error-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="streetAddress"
                        className={`input pl-10 ${formErrors.streetAddress ? 'border-error-500' : ''}`}
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                    {formErrors.streetAddress && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.streetAddress}</p>
                    )}
                  </div>
                </div>

                {/* External URL */}
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    External URL <span className="text-error-400">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="externalUrl"
                      className={`input pl-10 ${formErrors.externalUrl ? 'border-error-500' : ''}`}
                      value={formData.externalUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/property"
                      required
                    />
                  </div>
                  {formErrors.externalUrl && (
                    <p className="mt-1 text-sm text-error-400">{formErrors.externalUrl}</p>
                  )}
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Additional Details</h4>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className={`input min-h-[100px] ${formErrors.description ? 'border-error-500' : ''}`}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe the property..."
                      maxLength={500}
                    />
                    <p className="mt-1 text-sm text-gray-400">
                      {formData.description.length}/500 characters
                    </p>
                    {formErrors.description && (
                      <p className="mt-1 text-sm text-error-400">{formErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Number of Rooms
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="numRooms"
                          className={`input pl-10 ${formErrors.numRooms ? 'border-error-500' : ''}`}
                          value={formData.numRooms}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 3"
                        />
                      </div>
                      {formErrors.numRooms && (
                        <p className="mt-1 text-sm text-error-400">{formErrors.numRooms}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Space (m²)
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="space"
                          className={`input pl-10 ${formErrors.space ? 'border-error-500' : ''}`}
                          value={formData.space}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 120"
                        />
                      </div>
                      {formErrors.space && (
                        <p className="mt-1 text-sm text-error-400">{formErrors.space}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-1">
                        Floor
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="floor"
                          className={`input pl-10 ${formErrors.floor ? 'border-error-500' : ''}`}
                          value={formData.floor}
                          onChange={handleInputChange}
                          min="0"
                          placeholder="e.g., 5"
                        />
                      </div>
                      {formErrors.floor && (
                        <p className="mt-1 text-sm text-error-400">{formErrors.floor}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 p-4 sm:p-6 border-t border-white/10 bg-background-dark">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                  <p className="text-sm text-gray-400 text-center sm:text-left">
                    <span className="text-error-400">*</span> Required fields
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                      type="button"
                      className="btn-ghost w-full sm:w-auto"
                      onClick={() => setShowAddModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-accent w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding Property...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Add Property
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          
          <div className="relative bg-background-dark w-full max-w-2xl mx-4 rounded-xl border border-white/10 shadow-xl animate-scale-in overflow-hidden">
            <div className="sticky top-0 z-10 bg-background-dark p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Edit Property</h3>
                  <p className="text-sm text-gray-400 mt-1">Update your property listing information</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Property Photo */}
                <div className="space-y-4">
                  <label className="block text-white text-sm font-medium">
                    Property Photo
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img 
                        src={editingProperty.imageUrl} 
                        alt="Property Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-ghost mb-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Replace Photo
                      </button>
                      <p className="text-sm text-gray-400">
                        Maximum file size: 5MB<br />
                        Accepted formats: JPG, PNG
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Property Title <span className="text-error-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingProperty.title}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        title: e.target.value
                      })}
                      className="input"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Property Type <span className="text-error-400">*</span>
                    </label>
                    <select
                      value={editingProperty.propertyType}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        propertyType: e.target.value
                      })}
                      className="input"
                      required
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land">Land</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Price <span className="text-error-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={editingProperty.price}
                        onChange={(e) => setEditingProperty({
                          ...editingProperty,
                          price: Number(e.target.value)
                        })}
                        className="input pl-10"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Location <span className="text-error-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={editingProperty.location}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        location: e.target.value
                      })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingProperty.description}
                    onChange={(e) => setEditingProperty({
                      ...editingProperty,
                      description: e.target.value
                    })}
                    className="input min-h-[100px]"
                    maxLength={500}
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    {editingProperty.description.length}/500 characters
                  </p>
                </div>

                {/* External URL */}
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    External URL <span className="text-error-400">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={editingProperty.externalUrl}
                      onChange={(e) => setEditingProperty({
                        ...editingProperty,
                        externalUrl: e.target.value
                      })}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 p-4 sm:p-6 border-t border-white/10 bg-background-dark">
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-accent"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
            
            <div className="glass-panel relative max-w-md w-full p-6 animate-scale-in">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-error-500/10 flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-error-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Delete Property Link</h3>
                  <p className="text-gray-300">
                    Are you sure you want to delete this property link? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  className="btn-ghost"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-error"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyLinksPage;