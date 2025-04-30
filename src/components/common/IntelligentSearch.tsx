import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, User, Home } from 'lucide-react';
import { profiles, georgianRegions } from '../../utils/mockData';

interface SearchSuggestion {
  type: 'agent' | 'property' | 'location';
  value: string;
  subtitle?: string;
}

const IntelligentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fullPlaceholder = "Search by agent name, property type, or location...";
  const typingSpeed = 50; // milliseconds per character
  const deleteSpeed = 30; // milliseconds per character
  const pauseDuration = 2000; // pause when text is complete

  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const animatePlaceholder = () => {
      if (isDeleting) {
        if (currentIndex > 0) {
          currentIndex--;
          setPlaceholderText(fullPlaceholder.slice(0, currentIndex));
          timeoutId = setTimeout(animatePlaceholder, deleteSpeed);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(animatePlaceholder, typingSpeed);
        }
      } else {
        if (currentIndex < fullPlaceholder.length) {
          currentIndex++;
          setPlaceholderText(fullPlaceholder.slice(0, currentIndex));
          timeoutId = setTimeout(animatePlaceholder, typingSpeed);
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            animatePlaceholder();
          }, pauseDuration);
        }
      }
    };

    timeoutId = setTimeout(animatePlaceholder, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Search agents
    const matchingAgents = profiles
      .filter(agent => 
        agent.fullName.toLowerCase().includes(term) ||
        agent.agencyAffiliation.toLowerCase().includes(term)
      )
      .slice(0, 3)
      .map(agent => ({
        type: 'agent' as const,
        value: agent.fullName,
        subtitle: agent.agencyAffiliation
      }));
    newSuggestions.push(...matchingAgents);

    // Search property types
    const propertyTypes = ['Apartment', 'House', 'Villa', 'Commercial', 'Land'];
    const matchingProperties = propertyTypes
      .filter(type => type.toLowerCase().includes(term))
      .map(type => ({
        type: 'property' as const,
        value: type
      }));
    newSuggestions.push(...matchingProperties);

    // Search locations
    const matchingLocations = georgianRegions
      .filter(region => region.toLowerCase().includes(term))
      .map(region => ({
        type: 'location' as const,
        value: region
      }));
    newSuggestions.push(...matchingLocations);

    setSuggestions(newSuggestions.slice(0, 6));
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      window.location.href = `/agents?q=${encodeURIComponent(searchTerm)}`;
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <User className="w-4 h-4 text-gray-400" />;
      case 'property':
        return <Home className="w-4 h-4 text-gray-400" />;
      case 'location':
        return <MapPin className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            className="input pl-12 pr-[120px] py-4 w-full text-lg rounded-[100px] border-2 border-white/20 focus:border-accent-500 hover:border-white/30 transition-colors"
            placeholder={placeholderText}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            aria-label="Search agents, properties, or locations"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-accent h-10 px-4 flex items-center justify-center hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-dark transition-all duration-200 rounded-[100px]"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
            <span className="ml-2 hidden md:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 glass-panel border-2 border-white/20 rounded-[24px] overflow-hidden shadow-glass">
          <div className="divide-y divide-white/10">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${index}`}
                className="w-full px-4 py-3 flex items-center hover:bg-white/5 transition-colors"
                onClick={() => {
                  setSearchTerm(suggestion.value);
                  setShowSuggestions(false);
                }}
              >
                <span className="mr-3">
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <div className="text-left">
                  <div className="text-white">{suggestion.value}</div>
                  {suggestion.subtitle && (
                    <div className="text-sm text-gray-400">{suggestion.subtitle}</div>
                  )}
                </div>
                <span className="ml-auto text-xs text-gray-400 capitalize">
                  {suggestion.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntelligentSearch;