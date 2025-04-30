import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Languages, Building } from 'lucide-react';
import { profiles, georgianRegions } from '../utils/mockData';
import AgentCard from '../components/agents/AgentCard';

const AgentDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchLocation, setSearchLocation] = useState(initialLocation);
  const [filterExperience, setFilterExperience] = useState<string>('');
  const [filterLanguage, setFilterLanguage] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  
  const [filteredAgents, setFilteredAgents] = useState(profiles);

  // Get cities with agent counts
  const cities = georgianRegions.map(region => ({
    name: region,
    count: profiles.filter(agent => agent.regionsServed.includes(region)).length
  })).sort((a, b) => b.count - a.count);

  useEffect(() => {
    // Apply filters
    let results = [...profiles];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(agent => 
        agent.fullName.toLowerCase().includes(query) || 
        agent.bio.toLowerCase().includes(query) ||
        agent.agencyAffiliation.toLowerCase().includes(query)
      );
    }
    
    if (searchLocation) {
      const location = searchLocation.toLowerCase();
      results = results.filter(agent => 
        agent.regionsServed.some(region => region.toLowerCase().includes(location))
      );
    }
    
    if (selectedCities.length > 0) {
      results = results.filter(agent =>
        agent.regionsServed.some(region => selectedCities.includes(region))
      );
    }
    
    if (filterExperience) {
      results = results.filter(agent => 
        agent.experienceLevel === filterExperience
      );
    }
    
    if (filterLanguage) {
      results = results.filter(agent => 
        agent.languages.includes(filterLanguage)
      );
    }
    
    // Sort featured agents first
    results.sort((a, b) => {
      if (a.featuredStatus && !b.featuredStatus) return -1;
      if (!a.featuredStatus && b.featuredStatus) return 1;
      return 0;
    });
    
    setFilteredAgents(results);
  }, [searchQuery, searchLocation, selectedCities, filterExperience, filterLanguage]);

  const handleClearFilters = () => {
    setFilterExperience('');
    setFilterLanguage('');
    setSelectedCities([]);
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const activeFiltersCount = [
    ...selectedCities,
    filterExperience,
    filterLanguage
  ].filter(Boolean).length;

  // Extract all unique languages
  const allLanguages = Array.from(new Set(profiles.flatMap(agent => agent.languages)));
  const experienceLevels = ['0-1', '1-3', '3-5', '5-10', '10+'];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Agent</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse our directory of real estate professionals across Georgia
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-panel mb-8">
          <div className="p-6 space-y-6">
            {/* Search Form */}
            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label htmlFor="search" className="block text-white text-sm font-medium mb-2">
                  Agent Name or Specialty
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    placeholder="e.g., 'Luxury Homes' or 'John Smith'"
                    className="input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search by agent name or specialty"
                  />
                </div>
              </div>
              
              <div className="md:col-span-5">
                <label htmlFor="location" className="block text-white text-sm font-medium mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="location"
                    placeholder="Region or City"
                    className="input pl-10"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    aria-label="Search by location"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex items-end">
                <button 
                  type="button" 
                  className={`btn-ghost w-full relative ${showFilters ? 'bg-white/20' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span 
                      className="absolute -top-2 -right-2 w-5 h-5 bg-accent-500 text-white rounded-full text-xs flex items-center justify-center"
                      aria-label={`${activeFiltersCount} active filters`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* City Fast Links */}
            <div role="region" aria-label="City filters">
              <div className="relative">
                <div className="city-links-container" role="tablist">
                  {cities.map(city => (
                    <button
                      key={city.name}
                      onClick={() => toggleCity(city.name)}
                      className={`city-link ${
                        selectedCities.includes(city.name)
                          ? 'city-link-active'
                          : 'city-link-inactive'
                      }`}
                      role="tab"
                      aria-selected={selectedCities.includes(city.name)}
                      aria-controls={`city-panel-${city.name}`}
                    >
                      <span>{city.name}</span>
                      <span className="city-link-count" aria-label={`${city.count} agents`}>
                        ({city.count})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div 
              id="filter-panel"
              className="border-t border-white/10 p-6"
              role="region"
              aria-label="Advanced filters"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="block text-white text-sm font-medium mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experience"
                    className="input"
                    value={filterExperience}
                    onChange={(e) => setFilterExperience(e.target.value)}
                  >
                    <option value="">All Experience Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level} years</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="language" className="block text-white text-sm font-medium mb-2">
                    Language
                  </label>
                  <select
                    id="language"
                    className="input"
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                  >
                    <option value="">All Languages</option>
                    {allLanguages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {activeFiltersCount > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                {filteredAgents.length} {filteredAgents.length === 1 ? 'Agent' : 'Agents'} Found
              </h2>
              {activeFiltersCount > 0 && (
                <span className="text-gray-400 text-sm">
                  with selected filters
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Sort by:</span>
              <select className="input py-1 px-2 text-sm min-w-[120px]">
                <option value="featured">Featured</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          </div>
          
          {filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No agents found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or clearing some filters.
              </p>
              <button
                className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <div className="text-gray-400">
            Showing <span className="text-white font-medium">{filteredAgents.length}</span> of{' '}
            <span className="text-white font-medium">{profiles.length}</span> agents
          </div>
          <div className="flex space-x-2">
            <button className="text-[#2563EB] hover:text-[#1E40AF] px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Previous
            </button>
            <button className="text-[#2563EB] hover:text-[#1E40AF] px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDirectoryPage;