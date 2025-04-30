import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CreditCard, Star, Check, AlertTriangle, Shield, X, Calendar, Receipt, History } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpgradeModal from '../../components/dashboard/UpgradeModal';
import UpdateBillingModal from '../../components/dashboard/UpdateBillingModal';

const SubscriptionPage: React.FC = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateBillingModal, setShowUpdateBillingModal] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'history'>('overview');

  useEffect(() => {
    // Get subscription data from localStorage
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  }, []);

  const handleCancelSubscription = () => {
    // In a real app, this would call your API
    localStorage.removeItem('subscription');
    setSubscription(null);
    setShowCancelModal(false);
    toast.success('Subscription cancelled successfully');
  };

  const handleUpgradeSuccess = () => {
    // Refresh subscription data
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  };

  const handleBillingUpdateSuccess = () => {
    // Refresh subscription data
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  };

  if (!subscription?.status) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Subscription Management</h2>
          <p className="text-gray-300">
            Manage your subscription, payment methods, and billing information
          </p>
        </div>

        <div className="glass-panel-dark p-8 text-center">
          <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-accent-300" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Upgrade to Featured Agent
          </h3>
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Get priority placement, enhanced visibility, and access to premium features
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="btn-accent"
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
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Subscription Management</h2>
          <div className="glass-panel px-3 py-1 text-sm text-accent-300">
            Featured Agent
          </div>
        </div>
        <p className="text-gray-300 mt-2">
          Manage your subscription, payment methods, and billing information
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-accent-300 text-accent-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'billing'
              ? 'border-accent-300 text-accent-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-accent-300 text-accent-300'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="glass-panel-dark p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Current Plan</h3>
                <p className="text-gray-400">Featured Agent</p>
              </div>
              <div className="glass-panel px-3 py-1 text-sm text-accent-300">
                Active
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

            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="text-sm">
                <span className="text-gray-400">Next billing date: </span>
                <span className="text-white">
                  {format(new Date(subscription.nextBillingDate), 'MMMM d, yyyy')}
                </span>
              </div>
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-error-400 hover:text-error-300 font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Trial Status */}
          {new Date(subscription.trialEndDate) > new Date() && (
            <div className="glass-panel-dark p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-accent-300 mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Free Trial Active</h3>
                  <p className="text-gray-300">
                    Your free trial ends on {format(new Date(subscription.trialEndDate), 'MMMM d, yyyy')}.
                    You won't be charged until after this date.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-white">
                    {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                  </div>
                  <div className="text-sm text-gray-400">
                    Expires {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                  </div>
                </div>
              </div>
              <button 
                className="text-accent-300 hover:text-accent-400 font-medium transition-colors"
                onClick={() => setShowUpdateBillingModal(true)}
              >
                Update
              </button>
            </div>
          </div>

          {/* Billing Information */}
          <div className="glass-panel-dark p-6">
            <h3 className="text-lg font-medium text-white mb-4">Billing Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan</span>
                <span className="text-white">Featured Agent</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price</span>
                <span className="text-white">9.99 GEL/month</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Next billing date</span>
                <span className="text-white">
                  {format(new Date(subscription.nextBillingDate), 'MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Trial end date</span>
                <span className="text-white">
                  {format(new Date(subscription.trialEndDate), 'MMMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-panel-dark p-6">
          <h3 className="text-lg font-medium text-white mb-4">Billing History</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-white/10">
              <div className="flex items-center">
                <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="text-white">Featured Agent Subscription</div>
                  <div className="text-sm text-gray-400">
                    {format(new Date(subscription.startDate), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white">9.99 GEL</div>
                <div className="text-sm text-accent-300">Free Trial</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
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
                  Are you sure you want to cancel your Featured Agent subscription? You'll lose access to:
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
            
            <div className="flex justify-end space-x-4">
              <button
                className="btn-ghost"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button
                className="btn-error"
                onClick={handleCancelSubscription}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Billing Modal */}
      {showUpdateBillingModal && (
        <UpdateBillingModal
          onClose={() => setShowUpdateBillingModal(false)}
          onSuccess={handleBillingUpdateSuccess}
          currentBillingInfo={{
            email: subscription.email,
            phone: subscription.phone,
            address: subscription.address
          }}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;