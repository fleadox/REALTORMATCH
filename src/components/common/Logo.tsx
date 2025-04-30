import React from 'react';
import { Home } from 'lucide-react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = 'h-10', variant = 'default' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/logo.svg" 
        alt="GeorgiaRealty.Pro" 
        className={`h-8 mr-2 ${variant === 'light' ? 'brightness-100' : 'brightness-90'}`}
      />
    </div>
  );
};

export default Logo;