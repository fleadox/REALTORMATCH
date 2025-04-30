import React from 'react';
import { Settings, ChevronRight } from 'lucide-react';
import Popup from './Popup';

const PopupExample: React.FC = () => {
  const trigger = (
    <button className="btn-ghost">
      <Settings className="w-5 h-5 mr-2" />
      Settings
    </button>
  );

  const content = (
    <div className="w-48 py-2">
      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 flex items-center justify-between">
        Profile Settings
        <ChevronRight className="w-4 h-4" />
      </button>
      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 flex items-center justify-between">
        Notifications
        <ChevronRight className="w-4 h-4" />
      </button>
      <button className="w-full px-4 py-2 text-left text-gray-300 hover:bg-white/5 flex items-center justify-between">
        Security
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <Popup
      trigger={trigger}
      content={content}
      placement="bottom"
      offset={8}
    />
  );
};

export default PopupExample;