import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Languages, Building, Star, ArrowRight, Globe } from 'lucide-react';
import { profiles, propertyLinks } from '../utils/mockData';
import ShareProfile from '../components/profile/ShareProfile';
import SocialIcons from '../components/common/SocialIcons';
import ConstructionAdPlaceholder from '../components/ads/ConstructionAdPlaceholder';
import PropertyCard from '../components/properties/PropertyCard';

const AgentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const agent = profiles.find(agent => agent.id === id);
  const agentProperties = propertyLinks.filter(property => property.profileId === id);
  
  const formatPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9+]/g, '');
  };
  
  if (!agent) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
        <div className="container-custom">
          <div className="glass-panel p-8 md:p-16 text-center">
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
    <div id="agent-profile-top" className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-primary-900 to-background-dark">
      <div className="container-custom">
        {/* Agent Header */}
        <div className="bg-background-light rounded-2xl overflow-hidden border border-white/5 mb-8">
          {/* Background Image Container */}
          <div className="relative h-32 sm:h-48 md:h-64">
            {/* Background Image */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/90 to-transparent" />
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8 -mt-16 sm:-mt-20 md:-mt-24">
            <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left">
              {/* Profile Photo */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-background-light shrink-0 mb-4 md:mb-0 md:mr-6">
                <img 
                  src={agent.photoUrl} 
                  alt={agent.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col items-center md:items-start gap-2 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{agent.fullName}</h1>
                  {agent.featuredStatus && (
                    <div className="inline-flex items-center bg-accent-500/90 backdrop-blur-sm py-1 px-3 rounded-full">
                      <Star className="w-3.5 h-3.5 text-white" />
                      <span className="text-white text-xs font-medium ml-1.5">Featured Agent</span>
                    </div>
                  )}
                  <p className="text-base sm:text-lg text-gray-300">{agent.agencyAffiliation}</p>
                </div>

                {/* Mobile Contact Buttons */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:hidden mb-6">
                  <ShareProfile 
                    profileId={agent.id} 
                    agentName={agent.fullName}
                    className="w-full sm:w-auto"
                  />
                  <a 
                    href={`https://wa.me/${formatPhoneForWhatsApp(agent.phoneNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark bg-[#25D366] hover:bg-[#22c55e] text-white"
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

                {/* Desktop Share Button */}
                <div className="hidden md:block">
                  <ShareProfile 
                    profileId={agent.id} 
                    agentName={agent.fullName}
                  />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              <div>
                <div className="flex items-center text-gray-400 mb-2">
                  <Building className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">Coverage</span>
                </div>
                <p className="text-white">
                  {agent.regionsServed.join(', ')}
                </p>
              </div>

              <div>
                <div className="flex items-center text-gray-400 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">Contact</span>
                </div>
                <p className="text-white">
                  {agent.phoneNumber}
                </p>
              </div>

              <div>
                <div className="flex items-center text-gray-400 mb-2">
                  <Languages className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.languages.map(language => (
                    <span 
                      key={language}
                      className="bg-accent-500/10 text-accent-300 text-xs py-1 px-2.5 rounded-full border border-accent-500/20"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center text-gray-400 mb-2">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-xs font-medium uppercase tracking-wider">Social</span>
                </div>
                <SocialIcons 
                  links={agent.socialLinks} 
                  iconClassName="w-6 h-6"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="px-4 sm:px-6 md:px-8 py-8">
            <p className="text-gray-300 whitespace-pre-line">
              {agent.bio}
            </p>
          </div>
        </div>

        {/* Featured Properties */}
        <div className="bg-background-light rounded-2xl p-6 sm:p-8 mb-8 border border-white/5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Featured Properties</h2>
              <p className="text-gray-400">
                {agentProperties.length} properties listed
              </p>
            </div>
            {agentProperties.length > 0 && (
              <Link 
                to={`/agents/${id}/properties`} 
                className="btn-accent group whitespace-nowrap"
              >
                View All Properties
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {agentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentProperties.slice(0, 6).map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-300">
                This agent has no listed properties at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="bg-background-light rounded-2xl p-6 sm:p-8 border border-white/5 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Work with {agent.fullName}
              </h3>
              <p className="text-gray-300">
                Get in touch to discuss your real estate needs
              </p>
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

        {/* Advertisement */}
        <ConstructionAdPlaceholder className="w-full" />
      </div>
    </div>
  );
};

export default AgentProfilePage;