import React from 'react';
import { Building, Hammer, HardHat } from 'lucide-react';

interface ConstructionAdPlaceholderProps {
  className?: string;
}

const ConstructionAdPlaceholder: React.FC<ConstructionAdPlaceholderProps> = ({ className = '' }) => {
  return (
    <div 
      className={`relative w-full h-[150px] glass-panel-dark border-2 border-white/10 overflow-hidden group ${className}`}
      style={{ minHeight: '150px' }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />

      {/* Small "Advertisement" Label */}
      <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-300">
        Advertisement
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center p-8 text-center">
        <div className="flex items-center gap-8">
          {/* Icon Grid */}
          <div className="flex gap-4">
            <Building className="w-8 h-8 text-gray-400" />
            <HardHat className="w-8 h-8 text-gray-400" />
            <Hammer className="w-8 h-8 text-gray-400" />
          </div>

          {/* Main Text */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              Your Construction Company Ad Here
            </h3>
            <p className="text-gray-400 text-sm">
              Contact us to advertise in this premium space
            </p>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default ConstructionAdPlaceholder;