import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface CityFiltersProps {
  cities: Array<{
    name: string;
    count: number;
  }>;
  selectedCity?: string;
  onSelect: (city: string) => void;
  className?: string;
}

const CityFilters: React.FC<CityFiltersProps> = ({
  cities,
  selectedCity,
  onSelect,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleCityClick = (city: string) => {
    onSelect(city);
    navigate(`/agents?location=${encodeURIComponent(city)}`);
  };

  return (
    <div className={`city-links-container ${className}`}>
      {cities.map(city => (
        <button
          key={city.name}
          onClick={() => handleCityClick(city.name)}
          className={`city-link ${
            selectedCity === city.name
              ? 'city-link-active'
              : 'city-link-inactive'
          }`}
        >
          <MapPin className="w-4 h-4 mr-2" />
          <span>{city.name}</span>
          <span className="city-link-count">
            ({city.count})
          </span>
        </button>
      ))}
    </div>
  );
};

export default CityFilters;