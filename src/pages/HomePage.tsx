import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, Building, Globe, ArrowRight, Star, Check } from 'lucide-react';
import { profiles } from '../utils/mockData';
import FeaturedAgentsCarousel from '../components/agents/FeaturedAgentsCarousel';
import ConstructionAdPlaceholder from '../components/ads/ConstructionAdPlaceholder';
import IntelligentSearch from '../components/common/IntelligentSearch';
import CityFilters from '../components/common/CityFilters';

const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const selectedCity = searchParams.get('location') || '';
  const [activeCity, setActiveCity] = useState(selectedCity);

  // Get cities with agent counts
  const cities = useMemo(() => {
    const cityMap = new Map<string, number>();
    profiles.forEach(profile => {
      profile.regionsServed.forEach(region => {
        cityMap.set(region, (cityMap.get(region) || 0) + 1);
      });
    });
    return Array.from(cityMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  // Get featured agents filtered by city
  const featuredAgents = useMemo(() => {
    let filtered = profiles.filter(profile => profile.featuredStatus);
    if (activeCity) {
      filtered = filtered.filter(profile => 
        profile.regionsServed.includes(activeCity)
      );
    }
    return filtered.slice(0, 8);
  }, [activeCity]);

  return (
    <div>
      {/* Main Search Section */}
      <section className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
        <div className="container-custom pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Georgia
              <span className="block text-accent-500">Real Estate Agent</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Connect with verified professionals who know the local market and will guide you through every step.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-panel p-6">
              <IntelligentSearch />

              {/* Advertisement Placeholder */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <ConstructionAdPlaceholder />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-16 bg-background-dark">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Agents</h2>
              <p className="text-gray-400">
                Top-rated real estate professionals in Georgia
              </p>
            </div>
            <Link 
              to={`/agents${activeCity ? `?location=${encodeURIComponent(activeCity)}` : ''}`}
              className="btn-ghost group"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* City Filters */}
          <div className="mb-8 -mx-6 px-6 overflow-x-auto">
            <CityFilters
              cities={cities}
              selectedCity={activeCity}
              onSelect={setActiveCity}
            />
          </div>

          <FeaturedAgentsCarousel agents={featuredAgents} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-background-dark via-background-dark to-[#13552F] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#2ECC71]/[0.02] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#A8E6CF]/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="glass-panel px-4 py-2 rounded-full text-sm font-medium text-[#2ECC71] flex items-center">
                <Star className="w-4 h-4 mr-2" />
                The Smart Way to Find Your Agent
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Your Gateway to Georgia's
              <span className="block text-[#2ECC71]">Best Real Estate Agents</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We connect you with the best real estate professionals across Georgia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Global Access */}
            <div className="glass-panel p-8 hover:border-[#2ECC71]/50 transition-all duration-300 group">
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-[#2ECC71]/10 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300">
                  <Globe className="w-8 h-8 text-[#2ECC71]" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="glass-panel px-2 py-1 text-xs font-medium text-[#2ECC71]">
                    International
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2ECC71] transition-colors">
                Global Access
              </h3>
              <p className="text-gray-300">
                Connect with Georgian real estate agents from anywhere in the world. Perfect for international buyers and investors.
              </p>
            </div>

            {/* Card 2: Verified Professionals */}
            <div className="glass-panel p-8 hover:border-[#2ECC71]/50 transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#2ECC71]/10 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300">
                  <Shield className="w-8 h-8 text-[#2ECC71]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2ECC71] transition-colors">
                Verified Professionals
              </h3>
              <p className="text-gray-300">
                Every agent profile is thoroughly reviewed and verified. Work with confidence knowing you're in good hands.
              </p>
            </div>

            {/* Card 3: Local Expertise */}
            <div className="glass-panel p-8 hover:border-[#2ECC71]/50 transition-all duration-300 group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#2ECC71]/10 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110 duration-300">
                  <Building className="w-8 h-8 text-[#2ECC71]" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#2ECC71] transition-colors">
                Local Expertise
              </h3>
              <p className="text-gray-300">
                Our agents have deep knowledge of their local markets, helping you make informed decisions about your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-br from-primary-900 to-background-dark relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 right-0 w-[800px] h-[800px] bg-accent-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 left-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="glass-panel p-8 border-accent-500/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center">
                  <span className="glass-panel px-4 py-2 rounded-full text-sm font-medium text-accent-300 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    For Real Estate Agents
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Dreaming of <span className="text-accent-300">Global Clients?</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center">
                      <div className="p-1 bg-accent-500/20 rounded-full mr-2">
                        <Check className="w-3 h-3 text-accent-300" />
                      </div>
                      <p className="text-sm text-gray-300">Showcase your expertise</p>
                    </div>
                    <div className="flex items-center">
                      <div className="p-1 bg-accent-500/20 rounded-full mr-2">
                        <Check className="w-3 h-3 text-accent-300" />
                      </div>
                      <p className="text-sm text-gray-300">Connect with verified buyers</p>
                    </div>
                    <div className="flex items-center">
                      <div className="p-1 bg-accent-500/20 rounded-full mr-2">
                        <Check className="w-3 h-3 text-accent-300" />
                      </div>
                      <p className="text-sm text-gray-300">Build global network</p>
                    </div>
                    <div className="flex items-center">
                      <div className="p-1 bg-accent-500/20 rounded-full mr-2">
                        <Check className="w-3 h-3 text-accent-300" />
                      </div>
                      <p className="text-sm text-gray-300">Expand your reach</p>
                    </div>
                  </div>
                  <Link to="/register" className="btn-accent">
                    Join as an Agent
                  </Link>
                </div>
              </div>
              <div>
                <ConstructionAdPlaceholder />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;