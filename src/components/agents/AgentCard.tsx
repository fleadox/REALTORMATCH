import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Building, Star, Clock, ArrowRight } from 'lucide-react';
import { Profile } from '../../utils/mockData';

interface AgentCardProps {
  agent: Profile;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/agents/${agent.id}`);
    // Add small delay to ensure navigation happens before scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div 
      onClick={handleClick}
      className="group block h-full cursor-pointer"
    >
      <div className="bg-background-light rounded-2xl overflow-hidden transition-all duration-300 group-hover:translate-y-[-4px] border border-white/5 group-hover:border-accent-500/30 group-hover:shadow-lg h-full flex flex-col">
        {/* Header Section */}
        <div className="relative p-4 sm:p-5 flex items-start gap-4">
          {/* Profile Image */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
            <img 
              src={agent.photoUrl} 
              alt={agent.fullName} 
              className="w-full h-full object-cover rounded-xl"
            />
            {agent.verificationStatus && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-accent-500 rounded-full"></div>
              </div>
            )}
          </div>

          {/* Agent Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1 group-hover:text-accent-300 transition-colors break-words">
                {agent.fullName}
              </h3>
              {/* Featured Badge */}
              {agent.featuredStatus && (
                <div className="bg-accent-500/90 backdrop-blur-sm py-1 px-2 sm:px-3 rounded-full flex items-center flex-shrink-0">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  <span className="text-white text-xs font-medium ml-1.5">Featured</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 break-words line-clamp-2">
              {agent.agencyAffiliation}
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex-1 flex flex-col">
          {/* Quick Stats */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex items-center text-gray-400 mb-1">
                <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs font-medium uppercase tracking-wider">Coverage</span>
              </div>
              <p className="text-sm text-white line-clamp-1 pl-6">
                {agent.regionsServed.join(', ')}
              </p>
            </div>

            <div>
              <div className="flex items-center text-gray-400 mb-1">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs font-medium uppercase tracking-wider">Contact</span>
              </div>
              <p className="text-sm text-white break-words pl-6">
                {agent.phoneNumber}
              </p>
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.languages.map(language => (
              <span 
                key={language}
                className="bg-accent-500/10 text-accent-300 text-xs py-1 px-2 rounded-full border border-accent-500/20"
              >
                {language}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto">
            {/* Experience Badge */}
            <div className="glass-panel-dark p-2 mb-3 inline-flex items-center rounded-lg">
              <Clock className="w-4 h-4 text-accent-300 mr-2" />
              <span className="text-white text-sm">
                <span className="font-semibold text-accent-300">{agent.experienceLevel}</span> years experience
              </span>
            </div>

            {/* View Profile Button */}
            <button className="w-full glass-panel group-hover:bg-accent-500/10 border border-white/5 group-hover:border-accent-500/30 rounded-xl p-3 flex items-center justify-between transition-all duration-300">
              <span className="text-white text-sm font-medium group-hover:text-accent-300 transition-colors">
                View Full Profile
              </span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-accent-300 transform group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;