import React from 'react';
import { Loader2, CheckCircle, AlertCircle, WifiOff } from 'lucide-react';
import type { SyncStatus } from '../../lib/propertySync';

interface PropertySyncIndicatorProps {
  status: SyncStatus;
  className?: string;
}

const PropertySyncIndicator: React.FC<PropertySyncIndicatorProps> = ({ status, className = '' }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Syncing...',
          className: 'text-accent-300'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Synced',
          className: 'text-accent-300'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Sync Error',
          className: 'text-error-400'
        };
      case 'idle':
      default:
        return {
          icon: <WifiOff className="w-4 h-4" />,
          text: 'Offline',
          className: 'text-gray-400'
        };
    }
  };

  const { icon, text, className: statusClassName } = getStatusDisplay();

  return (
    <div className={`flex items-center space-x-2 ${className} ${statusClassName}`}>
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

export default PropertySyncIndicator;