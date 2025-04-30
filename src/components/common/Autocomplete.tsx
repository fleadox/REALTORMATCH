import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export interface AutocompleteOption {
  id: string;
  label: string;
  value: string;
}

interface AutocompleteProps {
  options?: AutocompleteOption[];
  onSearch: (query: string) => Promise<void>;
  onSelect: (option: AutocompleteOption) => void;
  value?: string;
  placeholder?: string;
  isLoading?: boolean;
  label: string;
  error?: string;
  className?: string;
  minChars?: number;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options = [],
  onSearch,
  onSelect,
  value = '',
  placeholder = 'Search...',
  isLoading = false,
  label,
  error,
  className = '',
  minChars = 2,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedSearch] = useDebounce(inputValue, 300);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  
  const listboxId = `${label.toLowerCase().replace(/\s+/g, '-')}-listbox`;
  
  useEffect(() => {
    if (debouncedSearch.length >= minChars) {
      onSearch(debouncedSearch);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [debouncedSearch, minChars, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        event.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          handleSelect(options[activeIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    onSelect(option);
    setInputValue(option.label);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setInputValue('');
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      <label 
        htmlFor={`${label}-input`}
        className="block text-sm font-medium text-gray-200 mb-2"
      >
        {label}
      </label>
      
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
          aria-hidden="true"
        />
        
        <input
          ref={inputRef}
          type="text"
          id={`${label}-input`}
          className={`
            w-full h-12 pl-12 pr-12 text-white placeholder-gray-400
            bg-gray-800 border ${error ? 'border-error-500' : 'border-gray-700'}
            rounded-lg outline-none transition-colors duration-200
            focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
            hover:border-gray-600
          `}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-invalid={!!error}
          aria-describedby={error ? `${label}-error` : undefined}
        />

        {(inputValue || isLoading) && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-accent-400 animate-spin" />
            ) : (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p 
          id={`${label}-error`} 
          className="mt-2 text-sm text-error-400"
          role="alert"
        >
          {error}
        </p>
      )}

      {isOpen && (
        <div 
          className="
            absolute z-50 w-full mt-2 bg-gray-800 rounded-lg 
            shadow-lg border border-gray-700
          "
        >
          <ul
            ref={listboxRef}
            id={listboxId}
            className="max-h-[320px] overflow-auto py-2"
            role="listbox"
          >
            {options.length === 0 ? (
              <li 
                className="px-4 py-3 text-gray-400 text-center"
                role="status"
              >
                {isLoading ? 'Loading...' : 'No results found'}
              </li>
            ) : (
              options.map((option, index) => (
                <li
                  key={option.id}
                  id={`${listboxId}-option-${index}`}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors
                    ${index === activeIndex 
                      ? 'bg-accent-500 text-white' 
                      : 'text-gray-200 hover:bg-gray-700'
                    }
                  `}
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;