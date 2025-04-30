import React from 'react';
import { MapPin, ExternalLink, Building2, Home, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { PropertyLink } from '../../utils/mockData';

interface PropertyCardProps {
  property: PropertyLink;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="glass-panel border border-white/10 hover:border-accent-500/50 transition-colors overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
            <div className="glass-panel px-3 py-1 text-sm text-accent-300 whitespace-nowrap">
              {property.propertyType}
            </div>
          </div>

          {/* Location Details */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-gray-400">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>

            {/* Listing Date */}
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-sm">
                Listed on: {format(new Date(property.creationDate), 'MM/dd/yyyy')}
              </span>
            </div>

            {/* Additional Property Details */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {/* Number of Rooms */}
              <div className="glass-panel-dark p-2 text-center">
                <span className="text-sm text-gray-400 block">Rooms</span>
                <span className="text-white">
                  {property.numRooms || '-'}
                </span>
              </div>

              {/* Space */}
              <div className="glass-panel-dark p-2 text-center">
                <span className="text-sm text-gray-400 block">Space</span>
                <span className="text-white">
                  {property.space ? `${property.space} m²` : '-'}
                </span>
              </div>

              {/* Floor */}
              <div className="glass-panel-dark p-2 text-center">
                <span className="text-sm text-gray-400 block">Floor</span>
                <span className="text-white">
                  {property.floor || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-300 line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-2xl font-bold text-accent-300">
            {formatPrice(property.price)}
          </div>
          <a 
            href={property.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-accent"
          >
            View Listing
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;