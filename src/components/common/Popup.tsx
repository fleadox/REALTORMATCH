import React, { useState, useEffect, useRef } from 'react';

interface PopupProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  className?: string;
}

const Popup: React.FC<PopupProps> = ({
  trigger,
  content,
  placement = 'bottom',
  offset = 8,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        triggerRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getPopupStyles = (): React.CSSProperties => {
    if (!triggerRef.current) return {};

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      zIndex: 50,
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyles,
          bottom: `calc(100% + ${offset}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: `calc(100% + ${offset}px)`,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          ...baseStyles,
          right: `calc(100% + ${offset}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: `calc(100% + ${offset}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className="relative" ref={triggerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={popupRef}
          style={getPopupStyles()}
          className={`
            animate-fade-in bg-background-dark border border-white/10 rounded-lg shadow-lg
            ${className}
          `}
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popup;