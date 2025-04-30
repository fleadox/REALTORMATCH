import React, { useState } from 'react';
import { format } from 'date-fns';
import { CreditCard, Star, Check, AlertTriangle, X, Shield, Clock, Download, Receipt } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UpdateBillingModal from './UpdateBillingModal';

interface BillingPanelProps {
  subscription: any;
}

const BillingPanel: React.FC<BillingPanelProps> = ({ subscription }) => {
  const [showUpdateBillingModal, setShowUpdateBillingModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadInvoice = async (invoiceId: string) => {
    setIsDownloading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscription cancelled successfully');
      setShowCancelConfirm(false);
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleBillingUpdateSuccess = () => {
    toast.success('Billing information updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="glass-panel-dark p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Current Plan</h3>
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
              Next billing: {format(subscription?.nextBillingDate || new Date(), 'MMM d, yyyy')}
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
            onClick={() => setShowCancelConfirm(true)}
            className="text-error-400 hover:text-error-300 font-medium transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <div className="text-white">
                {subscription?.paymentMethod?.brand} •••• {subscription?.paymentMethod?.last4}
              </div>
              <div className="text-sm text-gray-400">
                Expires {subscription?.paymentMethod?.expiryMonth}/{subscription?.paymentMethod?.expiryYear}
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

      {/* Billing History */}
      <div className="glass-panel-dark p-6">
        <h3 className="text-lg font-medium text-white mb-4">Billing History</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-white/10">
            <div className="flex items-center">
              <Receipt className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-white">Featured Agent Subscription</div>
                <div className="text-sm text-gray-400">
                  {format(new Date(subscription?.startDate), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white">9.99 GEL</div>
                <div className="text-sm text-accent-300">Free Trial</div>
              </div>
              <button
                onClick={() => handleDownloadInvoice('1')}
                className="btn-ghost py-2 px-3"
                disabled={isDownloading}
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Billing Modal */}
      {showUpdateBillingModal && (
        <UpdateBillingModal
          onClose={() => setShowUpdateBillingModal(false)}
          onSuccess={handleBillingUpdateSuccess}
          currentBillingInfo={{
            email: subscription?.email,
            phone: subscription?.phone,
            address: subscription?.address
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
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
                onClick={() => setShowCancelConfirm(false)}
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
    </div>
  );
};

export default BillingPanel;