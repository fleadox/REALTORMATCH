import React, { useState } from 'react';
import { format } from 'date-fns';
import { CreditCard, Star, Check, AlertTriangle, Shield, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
}

interface SubscriptionUpgradeModalProps {
  onClose: () => void;
  onSuccess: () => void;
  existingPaymentMethods?: PaymentMethod[];
}

const SubscriptionUpgradeModal: React.FC<SubscriptionUpgradeModalProps> = ({
  onClose,
  onSuccess,
  existingPaymentMethods = [],
}) => {
  const [step, setStep] = useState<'plan' | 'payment' | 'confirm'>('plan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('new');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // New payment method form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  const handleSubmit = async () => {
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Subscription upgraded successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel max-w-2xl w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-6 h-6 text-accent-300 mr-3" />
              <h2 className="text-2xl font-bold text-white">Upgrade to Featured Agent</h2>
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

        {/* Content */}
        <div className="p-6">
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Featured Agent Plan</h3>
                  <p className="text-gray-300">Enhance your visibility and reach more clients</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">9.99 GEL</div>
                  <div className="text-gray-400">per month</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
                  <span className="text-gray-300">Featured badge on profile</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
                  <span className="text-gray-300">Priority in search results</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
                  <span className="text-gray-300">Up to 30 property links</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
                  <span className="text-gray-300">Featured on homepage rotation</span>
                </div>
              </div>

              <div className="glass-panel-dark p-4 flex items-start">
                <Shield className="w-5 h-5 text-accent-300 mr-3 mt-0.5" />
                <div>
                  <p className="text-white font-medium mb-1">30-Day Free Trial</p>
                  <p className="text-gray-400 text-sm">
                    Try all Featured Agent benefits free for 30 days. Cancel anytime during the trial period.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {existingPaymentMethods.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Saved Payment Methods</h3>
                  <div className="space-y-3">
                    {existingPaymentMethods.map(method => (
                      <label
                        key={method.id}
                        className="flex items-center p-4 glass-panel-dark rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-white">
                              {method.brand} •••• {method.last4}
                            </div>
                            <div className="text-sm text-gray-400">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}

                    <label className="flex items-center p-4 glass-panel-dark rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="new"
                        checked={selectedPaymentMethod === 'new'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="text-white">Add new payment method</div>
                    </label>
                  </div>
                </div>
              )}

              {(selectedPaymentMethod === 'new' || existingPaymentMethods.length === 0) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Payment Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="input"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/YY"
                        className="input"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        className="input"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Smith"
                      className="input"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Order Summary</h3>
                <div className="glass-panel-dark p-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Featured Agent Plan</span>
                    <span className="text-white">9.99 GEL/month</span>
                  </div>
                  <div className="flex justify-between text-accent-300">
                    <span>Free Trial Period</span>
                    <span>30 days</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between font-medium">
                    <span className="text-white">First Payment Due</span>
                    <span className="text-white">
                      {format(addMonths(new Date(), 1), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel-dark p-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the Terms of Service and authorize REALTOR MATCH to charge my payment method
                    on a recurring monthly basis after the trial period. I understand I can cancel anytime
                    during the trial with no charge.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (step === 'payment') setStep('plan');
                if (step === 'confirm') setStep('payment');
              }}
              className="btn-ghost"
              disabled={step === 'plan' || isSubmitting}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step === 'plan') setStep('payment');
                else if (step === 'payment') setStep('confirm');
                else handleSubmit();
              }}
              className="btn-accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : step === 'confirm' ? (
                'Confirm Upgrade'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgradeModal;