import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { languages } from '../../i18n';
import { ChevronDown } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage = languages[i18n.language as keyof typeof languages];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={dropdownRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img 
          src={currentLanguage?.flag} 
          alt={currentLanguage?.name}
          className="w-5 h-5 rounded-sm object-cover"
        />
        <span className="text-sm font-medium">{currentLanguage?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div 
        className={`
          absolute right-0 mt-1 w-48 py-2 bg-background-dark border border-white/10 rounded-lg shadow-glass
          transform origin-top-right transition-all duration-200 ease-out
          ${isOpen 
            ? 'opacity-100 translate-y-0 visible' 
            : 'opacity-0 -translate-y-2 invisible'
          }
        `}
      >
        {Object.values(languages).map((lang) => (
          <button
            key={lang.code}
            className={`
              w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center space-x-3
              ${i18n.language === lang.code ? 'text-accent-300' : 'text-gray-300'}
            `}
            onClick={() => {
              i18n.changeLanguage(lang.code);
              setIsOpen(false);
            }}
          >
            <img 
              src={lang.flag} 
              alt={lang.name}
              className="w-5 h-5 rounded-sm object-cover"
            />
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;