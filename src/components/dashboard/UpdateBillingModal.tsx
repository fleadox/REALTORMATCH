import React, { useState } from 'react';
import { X, CreditCard, MapPin, Mail, Phone, Loader2, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BillingFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  email: string;
  phone: string;
}

interface UpdateBillingModalProps {
  onClose: () => void;
  onSuccess: () => void;
  currentBillingInfo?: Partial<BillingFormData>;
}

const UpdateBillingModal: React.FC<UpdateBillingModalProps> = ({
  onClose,
  onSuccess,
  currentBillingInfo
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BillingFormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    address: {
      line1: currentBillingInfo?.address?.line1 || '',
      line2: currentBillingInfo?.address?.line2 || '',
      city: currentBillingInfo?.address?.city || '',
      state: currentBillingInfo?.address?.state || '',
      postalCode: currentBillingInfo?.address?.postalCode || '',
      country: currentBillingInfo?.address?.country || 'Georgia'
    },
    email: currentBillingInfo?.email || '',
    phone: currentBillingInfo?.phone || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BillingFormData | string, string>>>({});

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card number validation
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Expiry date validation
    const [month, year] = formData.expiryDate.split('/');
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (!month || !year || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else if (
      parseInt(year) < currentYear || 
      (parseInt(year) === currentYear && parseInt(month) < currentMonth) ||
      parseInt(month) > 12 ||
      parseInt(month) < 1
    ) {
      newErrors.expiryDate = 'Card has expired';
    }

    // CVC validation
    if (!formData.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    // Address validation
    if (!formData.address.line1.trim()) {
      newErrors['address.line1'] = 'Street address is required';
    }
    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }
    if (!formData.address.postalCode.trim()) {
      newErrors['address.postalCode'] = 'Postal code is required';
    }

    // Email validation
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.match(/^\+995\s\d{3}\s\d{2}\s\d{2}\s\d{2}$/)) {
      newErrors.phone = 'Please enter a valid Georgian phone number (+995 XXX XX XX XX)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, this would:
      // 1. Tokenize card details with payment processor
      // 2. Send token to backend
      // 3. Update subscription with new payment method
      // 4. Update billing contact information

      // Update local storage for demo
      const subscription = localStorage.getItem('subscription');
      if (subscription) {
        const data = JSON.parse(subscription);
        data.paymentMethod = {
          brand: 'Visa', // This would come from the payment processor
          last4: formData.cardNumber.slice(-4),
          expiryMonth: formData.expiryDate.split('/')[0],
          expiryYear: `20${formData.expiryDate.split('/')[1]}`,
        };
        localStorage.setItem('subscription', JSON.stringify(data));
      }

      toast.success('Billing information updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating billing information:', error);
      toast.error('Failed to update billing information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    formatter?: (value: string) => string
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: formatter ? formatter(value) : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-background-dark w-full max-w-2xl mx-4 rounded-xl border border-white/10 shadow-xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background-dark p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Update Billing Information</h3>
              <p className="text-sm text-gray-400 mt-1">
                Update your payment method and billing details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Payment Method */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Payment Method</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="cardNumber"
                      className={`input pl-10 ${errors.cardNumber ? 'border-error-500' : ''}`}
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange(e, formatCardNumber)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-error-400">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      className={`input ${errors.expiryDate ? 'border-error-500' : ''}`}
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange(e, formatExpiryDate)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-sm text-error-400">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      name="cvc"
                      className={`input ${errors.cvc ? 'border-error-500' : ''}`}
                      value={formData.cvc}
                      onChange={(e) => handleInputChange(e, value => value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-sm text-error-400">{errors.cvc}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    className={`input ${errors.cardholderName ? 'border-error-500' : ''}`}
                    value={formData.cardholderName}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Name as it appears on card"
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-sm text-error-400">{errors.cardholderName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Billing Address</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address.line1"
                      className={`input pl-10 ${errors['address.line1'] ? 'border-error-500' : ''}`}
                      value={formData.address.line1}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="Street address"
                    />
                  </div>
                  {errors['address.line1'] && (
                    <p className="mt-1 text-sm text-error-400">{errors['address.line1']}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Apartment, suite, etc. (optional)
                  </label>
                  <input
                    type="text"
                    name="address.line2"
                    className="input"
                    value={formData.address.line2}
                    onChange={(e) => handleInputChange(e)}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      className={`input ${errors['address.city'] ? 'border-error-500' : ''}`}
                      value={formData.address.city}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="City"
                    />
                    {errors['address.city'] && (
                      <p className="mt-1 text-sm text-error-400">{errors['address.city']}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      className={`input ${errors['address.postalCode'] ? 'border-error-500' : ''}`}
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="Postal code"
                    />
                    {errors['address.postalCode'] && (
                      <p className="mt-1 text-sm text-error-400">{errors['address.postalCode']}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      className={`input pl-10 ${errors.email ? 'border-error-500' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-error-400">{errors.email}</p>
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
                      name="phone"
                      className={`input pl-10 ${errors.phone ? 'border-error-500' : ''}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange(e)}
                      placeholder="+995 XXX XX XX XX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-400">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 sm:p-6 border-t border-white/10 bg-background-dark">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn-ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-accent"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Update Billing
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBillingModal;