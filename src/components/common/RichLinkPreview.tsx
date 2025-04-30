import React from 'react';

interface RichLinkPreviewProps {
  url: string;
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
}

const RichLinkPreview: React.FC<RichLinkPreviewProps> = ({
  url,
  title,
  description,
  imageUrl,
  className = ''
}) => {
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block glass-panel border border-white/10 hover:border-accent-500/50 transition-colors overflow-hidden ${className}`}
    >
      <div className="flex items-center">
        {imageUrl && (
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1">
          <h3 className="text-lg font-medium text-white mb-2 line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {description}
          </p>
          <div className="mt-2 flex items-center text-sm text-accent-300">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-4 h-4 mr-2"
            />
            <span>{new URL(url).hostname}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default RichLinkPreview;