import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import UpgradeModal from './UpgradeModal';

const UpgradeBanner: React.FC = () => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradeSuccess = () => {
    // In a real app, this would refresh the subscription data
    window.location.reload();
  };

  return (
    <>
      <div className="bg-gradient-to-r from-accent-500/20 to-accent-500/10 border border-accent-500/30 rounded-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent-300" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Unlock Premium Features
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <div className="p-1 bg-accent-500/20 rounded-full mr-3">
                  <Check className="w-4 h-4 text-accent-300" />
                </div>
                <span className="text-gray-300">Featured profile badge & enhanced visibility</span>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-accent-500/20 rounded-full mr-3">
                  <Check className="w-4 h-4 text-accent-300" />
                </div>
                <span className="text-gray-300">Priority placement in search results</span>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-accent-500/20 rounded-full mr-3">
                  <Check className="w-4 h-4 text-accent-300" />
                </div>
                <span className="text-gray-300">List up to 30 property links</span>
              </div>
              <div className="flex items-start">
                <div className="p-1 bg-accent-500/20 rounded-full mr-3">
                  <Check className="w-4 h-4 text-accent-300" />
                </div>
                <span className="text-gray-300">Featured on homepage rotation</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-auto flex flex-col items-start lg:items-end gap-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                9.99 <span className="text-lg font-normal text-gray-400">GEL/month</span>
              </div>
              <div className="text-accent-300">30-day free trial</div>
            </div>
            <button 
              onClick={() => setShowUpgradeModal(true)}
              className="btn-accent w-full lg:w-auto min-w-[200px] justify-center"
            >
              <Star className="w-5 h-5 mr-2" />
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onSuccess={handleUpgradeSuccess}
        />
      )}
    </>
  );
};

export default UpgradeBanner;