import React, { useState } from 'react';
import { format, addMonths } from 'date-fns';
import { CreditCard, Star, Check, AlertTriangle, X, Shield, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpgradeModal from './UpgradeModal';

interface SubscriptionPanelProps {
  currentPlan: 'featured' | 'basic';
  nextBillingDate?: Date;
  paymentMethod?: {
    brand: string;
    last4: string;
    expiryMonth: string;
    expiryYear: string;
  };
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({
  currentPlan,
  nextBillingDate,
  paymentMethod,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancellation = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscription cancelled successfully');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpgradeSuccess = () => {
    window.location.reload();
  };

  if (currentPlan === 'basic') {
    return (
      <div className="space-y-6">
        <div className="glass-panel p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Current Plan</h3>
              <p className="text-gray-300">Basic (Free)</p>
            </div>
            <div className="glass-panel px-3 py-1 text-sm text-accent-300">
              Active
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <span className="text-gray-300">Standard profile listing</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <span className="text-gray-300">Up to 5 property links</span>
            </div>
            <div className="flex items-start">
              <Check className="w-5 h-5 text-accent-300 mr-2 mt-0.5" />
              <span className="text-gray-300">Basic search visibility</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Featured Agent</h3>
              <p className="text-gray-300">Boost your visibility</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">9.99 GEL</div>
              <div className="text-gray-400">per month</div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
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

          <div className="glass-panel-dark p-4 mb-6 flex items-start">
            <Shield className="w-5 h-5 text-accent-300 mr-3 mt-0.5" />
            <div>
              <p className="text-white font-medium mb-1">30-Day Free Trial</p>
              <p className="text-gray-400 text-sm">
                Try all Featured Agent benefits free for 30 days. Cancel anytime during the trial period.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUpgradeModal(true)}
            className="btn-accent w-full"
          >
            <Star className="w-5 h-5 mr-2" />
            Upgrade Now
          </button>
        </div>

        {showUpgradeModal && (
          <UpgradeModal
            onClose={() => setShowUpgradeModal(false)}
            onSuccess={handleUpgradeSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Summary */}
      <div className="glass-panel p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Current Plan</h3>
            <div className="flex items-center">
              <Star className="w-5 h-5 text-accent-300 mr-2" />
              <span className="text-white font-medium">Featured Agent</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="glass-panel px-3 py-1 text-sm text-accent-300 mb-2">
              Active
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              Next billing: {format(nextBillingDate || new Date(), 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
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

        <div className="pt-6 border-t border-white/10">
          <button
            onClick={() => setShowCancelModal(true)}
            className="text-error-400 hover:text-error-300 font-medium transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Details */}
      {paymentMethod && (
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold text-white mb-4">Payment Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-white">
                    {paymentMethod.brand} •••• {paymentMethod.last4}
                  </div>
                  <div className="text-sm text-gray-400">
                    Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                  </div>
                </div>
              </div>
              <button className="text-accent-300 hover:text-accent-400 font-medium transition-colors">
                Update
              </button>
            </div>

            {nextBillingDate && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Next billing date</span>
                  <span className="text-white">
                    {format(nextBillingDate, 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-panel max-w-lg w-full mx-4 p-6 animate-scale-in">
            <div className="flex items-start mb-6">
              <div className="w-10 h-10 rounded-full bg-error-500/10 flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-error-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Cancel Subscription</h3>
                <p className="text-gray-300">
                  Your subscription will remain active until {nextBillingDate && format(nextBillingDate, 'MMMM d, yyyy')}.
                  After this date, you'll lose access to:
                </p>
                <ul className="mt-2 space-y-1 text-gray-300">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-error-500 rounded-full mr-2" />
                    Featured agent status
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-error-500 rounded-full mr-2" />
                    Priority in search results
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-error-500 rounded-full mr-2" />
                    Extended property listings (max 30)
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Reason for cancellation
                </label>
                <select
                  className="input w-full"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="too_expensive">Too expensive</option>
                  <option value="not_using">Not using the features</option>
                  <option value="missing_features">Missing features</option>
                  <option value="switching">Switching to another platform</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {cancellationReason === 'other' && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Please specify
                  </label>
                  <textarea
                    className="input w-full"
                    rows={3}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Tell us more about why you're cancelling..."
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="btn-ghost"
                onClick={() => setShowCancelModal(false)}
                disabled={isSubmitting}
              >
                Keep Subscription
              </button>
              <button
                className="btn-error"
                onClick={handleCancellation}
                disabled={isSubmitting || !cancellationReason}
              >
                {isSubmitting ? (
                  <span>Cancelling...</span>
                ) : (
                  <span>Confirm Cancellation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPanel;