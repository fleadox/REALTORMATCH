import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, Building2, Star, ArrowRight, Check, AlertTriangle,
  Download, Share2, QrCode, Loader2, Copy, Mail, Send
} from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';
import { propertyLinks, profiles } from '../../utils/mockData';
import { useAuth } from '../../hooks/useAuth';

interface ProfileCompletion {
  item: string;
  completed: boolean;
  priority: number;
  link: string;
}

interface QRModalProps {
  propertyId: string;
  propertyUrl: string;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ propertyId, propertyUrl, onClose }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQR();
  }, [propertyUrl]);

  const generateQR = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(propertyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#00000000'
        }
      });
      setQrCode(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
      toast.error('Failed to generate QR code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (format: 'png' | 'svg') => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `property-${propertyId}-qr.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  const handleShare = async (method: 'whatsapp' | 'telegram' | 'email' | 'copy') => {
    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(propertyUrl)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}`);
        break;
      case 'email':
        window.location.href = `mailto:?subject=Property Listing&body=${encodeURIComponent(propertyUrl)}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(propertyUrl);
        toast.success('Link copied to clipboard');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-panel max-w-md w-full mx-4 p-6 animate-scale-in">
        <h3 className="text-xl font-bold text-white mb-4">Property QR Code</h3>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          {isLoading ? (
            <div className="w-full aspect-square bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
            </div>
          ) : (
            <img 
              src={qrCode} 
              alt="Property QR Code"
              className="w-full h-auto"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handleDownload('png')}
              className="btn-ghost flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              className="btn-ghost flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              SVG
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleShare('whatsapp')}
              className="btn-ghost py-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={() => handleShare('telegram')}
              className="btn-ghost py-2"
            >
              <Send className="w-4 h-4 mr-2" />
              Telegram
            </button>
            <button
              onClick={() => handleShare('email')}
              className="btn-ghost py-2"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="btn-ghost py-2"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-ghost w-full mt-6"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  useEffect(() => {
    const storedSubscription = localStorage.getItem('subscription');
    if (storedSubscription) {
      setSubscription(JSON.parse(storedSubscription));
    }
  }, []);

  const userProfile = profiles.find(profile => profile.userId === user?.id);
  const userProperties = propertyLinks.filter(property => property.profileId === userProfile?.id);
  const propertyLimit = subscription?.status === 'active' ? 30 : 5;

  // Profile completion items
  const completionItems: ProfileCompletion[] = [
    {
      item: 'Add profile photo',
      completed: !!userProfile?.photoUrl,
      priority: 1,
      link: '/dashboard/profile'
    },
    {
      item: 'Complete contact information',
      completed: !!(userProfile?.phoneNumber && userProfile?.email),
      priority: 1,
      link: '/dashboard/profile'
    },
    {
      item: 'Add professional bio',
      completed: !!(userProfile?.bio && userProfile.bio.length >= 100),
      priority: 2,
      link: '/dashboard/profile'
    },
    {
      item: 'Select regions served',
      completed: !!(userProfile?.regionsServed && userProfile.regionsServed.length > 0),
      priority: 2,
      link: '/dashboard/profile'
    },
    {
      item: 'Add property listings',
      completed: userProperties.length > 0,
      priority: 1,
      link: '/dashboard/properties'
    },
    {
      item: 'Verify contact details',
      completed: !!userProfile?.verificationStatus,
      priority: 3,
      link: '/dashboard/profile'
    }
  ];

  const incompleteItems = completionItems
    .filter(item => !item.completed)
    .sort((a, b) => a.priority - b.priority);

  const profileProgress = Math.round(
    (completionItems.filter(item => item.completed).length / completionItems.length) * 100
  );

  const handleBatchQRGenerate = async () => {
    setIsGeneratingBatch(true);
    try {
      const zip = new JSZip();
      const qrFolder = zip.folder('property-qr-codes');

      for (const property of userProperties) {
        const qrDataUrl = await QRCode.toDataURL(property.externalUrl, {
          width: 1000,
          margin: 4,
          color: {
            dark: '#ffffff',
            light: '#00000000'
          }
        });

        // Convert base64 to blob
        const data = qrDataUrl.split(',')[1];
        qrFolder?.file(`property-${property.id}-qr.png`, data, { base64: true });
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'property-qr-codes.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('QR codes downloaded successfully');
    } catch (error) {
      console.error('Error generating batch QR codes:', error);
      toast.error('Failed to generate QR codes');
    } finally {
      setIsGeneratingBatch(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Status */}
      {profileProgress < 100 && (
        <div className="glass-panel-dark p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-white">Complete Your Profile</h3>
              <p className="text-gray-400 mt-1">
                {profileProgress}% complete
              </p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-white/5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={175.93}
                  strokeDashoffset={175.93 - (profileProgress / 100) * 175.93}
                  className="text-accent-300 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {profileProgress}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {incompleteItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center mr-3">
                    <span className="text-accent-300 text-sm font-medium">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-gray-300">{item.item}</span>
                </div>
                <Link 
                  to={item.link}
                  className="text-accent-300 hover:text-accent-400 flex items-center"
                >
                  Complete
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <Link 
              to="/dashboard/profile"
              className="btn-accent w-full justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Complete Your Profile
            </Link>
          </div>
        </div>
      )}

      {/* Property Management */}
      <div className="glass-panel-dark p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-white">Property Management</h3>
            <p className="text-gray-400 mt-1">
              {userProperties.length} of {propertyLimit} properties listed
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {userProperties.length > 0 && (
              <button
                onClick={handleBatchQRGenerate}
                className="btn-ghost"
                disabled={isGeneratingBatch}
              >
                {isGeneratingBatch ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5 mr-2" />
                    Download All QR Codes
                  </>
                )}
              </button>
            )}
            <Link 
              to="/dashboard/properties"
              className="btn-accent"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Manage Properties
            </Link>
          </div>
        </div>

        {userProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userProperties.map(property => (
              <div key={property.id} className="glass-panel p-4">
                <div className="relative h-32 mb-4">
                  <img 
                    src={property.imageUrl}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-lg" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h4 className="text-white font-medium truncate">{property.title}</h4>
                    <p className="text-sm text-gray-300 truncate">{property.location}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedProperty(property.id)}
                    className="btn-ghost py-1 px-3"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShare('copy', property.externalUrl)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={property.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                      title="View listing"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No Properties Listed</h4>
            <p className="text-gray-400 mb-6">
              Start showcasing your properties by adding external listing links
            </p>
            <Link 
              to="/dashboard/properties"
              className="btn-accent"
            >
              Add Your First Property
            </Link>
          </div>
        )}
      </div>

      {/* Next Steps */}
      {!subscription?.status && (
        <div className="glass-panel-dark p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-accent-300" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Upgrade to Featured Agent</h3>
              <p className="text-gray-400">
                Boost your visibility and unlock premium features
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center mr-3 mt-1">
                <Check className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Featured Badge</h4>
                <p className="text-sm text-gray-400">
                  Stand out with a featured agent badge
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center mr-3 mt-1">
                <Check className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Priority Listing</h4>
                <p className="text-sm text-gray-400">
                  Appear at the top of search results
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center mr-3 mt-1">
                <Check className="w-5 h-5 text-accent-300" />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">More Properties</h4>
                <p className="text-sm text-gray-400">
                  List up to 30 property links
                </p>
              </div>
            </div>
          </div>

          <Link 
            to="/dashboard/subscription"
            className="btn-accent w-full justify-center"
          >
            <Star className="w-5 h-5 mr-2" />
            Upgrade Now
          </Link>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedProperty && (
        <QRModal
          propertyId={selectedProperty}
          propertyUrl={userProperties.find(p => p.id === selectedProperty)?.externalUrl || ''}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default DashboardOverview;