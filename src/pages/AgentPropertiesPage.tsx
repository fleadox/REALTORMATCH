import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Phone, Filter, ArrowUpDown, Calendar, X } from 'lucide-react';
import { propertyLinks, profiles } from '../utils/mockData';
import PropertyCard from '../components/properties/PropertyCard';

interface Filters {
  city: string;
  propertyType: string;
  sortBy: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | '';
}

const AgentPropertiesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    city: '',
    propertyType: '',
    sortBy: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const agent = profiles.find(agent => agent.id === id);
  const agentProperties = propertyLinks.filter(property => property.profileId === id);

  // Get unique cities and property types with counts
  const filterOptions = useMemo(() => {
    const cities = new Map<string, number>();
    const propertyTypes = new Map<string, number>();

    agentProperties.forEach(property => {
      // Extract city from location (assuming format "City, Region")
      const city = property.location.split(',')[0].trim();
      cities.set(city, (cities.get(city) || 0) + 1);
      propertyTypes.set(property.propertyType, (propertyTypes.get(property.propertyType) || 0) + 1);
    });

    return {
      cities: Array.from(cities.entries()).map(([name, count]) => ({ name, count })),
      propertyTypes: Array.from(propertyTypes.entries()).map(([name, count]) => ({ name, count })),
    };
  }, [agentProperties]);
  
  // Apply filters and search
  const filteredProperties = useMemo(() => {
    let results = [...agentProperties];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.propertyType.toLowerCase().includes(query)
      );
    }
    
    // Apply city filter
    if (filters.city) {
      results = results.filter(property => 
        property.location.split(',')[0].trim() === filters.city
      );
    }
    
    // Apply property type filter
    if (filters.propertyType) {
      results = results.filter(property => 
        property.propertyType === filters.propertyType
      );
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'date_asc':
        results.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        break;
      case 'date_desc':
        results.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        break;
    }

    return results;
  }, [agentProperties, searchQuery, filters]);

  // Handle loading state with useEffect
  useEffect(() => {
    setIsLoading(true);
    // Simulate async operation with a small delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters]);

  const formatPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9+]/g, '');
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      propertyType: '',
      sortBy: '',
    });
  };
  
  if (!agent) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
        <div className="container-custom">
          <div className="glass-panel p-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Agent Not Found</h2>
            <p className="text-gray-300 mb-8">
              We couldn't find an agent with that profile ID.
            </p>
            <Link to="/agents" className="btn-accent">
              Browse All Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        {/* Header */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <img 
                src={agent.photoUrl} 
                alt={agent.fullName}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{agent.fullName}'s Properties</h1>
                <p className="text-gray-300">{agent.agencyAffiliation}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a 
                href={`tel:${agent.phoneNumber.replace(/\D/g, '')}`} 
                className="btn-accent w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Agent
              </a>
              
              <a 
                href={`https://wa.me/${formatPhoneForWhatsApp(agent.phoneNumber)}`}
                target="_blank"
                rel="noreferrer"
                className="btn flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark bg-[#25D366] hover:bg-[#22c55e] text-white w-full sm:w-auto"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 mr-2 fill-current"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="input pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Link 
              to={`/agents/${id}`}
              className="btn-ghost whitespace-nowrap"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Profile
            </Link>
          </div>

          {/* Filters Section */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-4">
              {/* City Filter */}
              <div className="flex-1 min-w-[200px]">
                <select
                  className="input w-full"
                  value={filters.city}
                  onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                >
                  <option value="">All Cities</option>
                  {filterOptions.cities.map(({ name, count }) => (
                    <option key={name} value={name}>
                      {name} ({count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="flex-1 min-w-[200px]">
                <select
                  className="input w-full"
                  value={filters.propertyType}
                  onChange={(e) => setFilters(prev => ({ ...prev, propertyType: e.target.value }))}
                >
                  <option value="">All Property Types</option>
                  {filterOptions.propertyTypes.map(({ name, count }) => (
                    <option key={name} value={name}>
                      {name} ({count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div className="flex-1 min-w-[200px]">
                <select
                  className="input w-full"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as Filters['sortBy']
                  }))}
                >
                  <option value="">Sort By</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(filters.city || filters.propertyType || filters.sortBy) && (
                <button
                  onClick={handleClearFilters}
                  className="btn-ghost py-2 px-3"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredProperties.length} of {agentProperties.length} properties
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background-dark/50 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="glass-panel p-16 text-center">
              <h3 className="text-xl font-bold text-white mb-2">No Properties Found</h3>
              <p className="text-gray-300">
                {searchQuery || filters.city || filters.propertyType
                  ? 'Try adjusting your search criteria or filters'
                  : 'This agent has not listed any properties yet'}
              </p>
              {(searchQuery || filters.city || filters.propertyType) && (
                <button
                  onClick={handleClearFilters}
                  className="btn-accent mt-4"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentPropertiesPage;