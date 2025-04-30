import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Share2, Copy, Check, Send, Download, Mail, QrCode, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';

interface ShareProfileProps {
  profileId: string;
  agentName: string;
  className?: string;
}

const ShareProfile: React.FC<ShareProfileProps> = ({ profileId, agentName, className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const location = useLocation();
  const profileUrl = `${window.location.origin}/agents/${profileId}`;

  // Generate QR code on mount
  useEffect(() => {
    generateQrCode();
  }, [profileUrl]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowQrModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal || showQrModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal, showQrModal]);

  const generateQrCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(profileUrl, {
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
    }
  };

  const handleShare = async () => {
    if (isSharing) return;

    if (navigator.share) {
      try {
        setIsSharing(true);
        await navigator.share({
          title: `${agentName} - Real Estate Agent Profile`,
          text: `Check out ${agentName}'s real estate agent profile on REALTOR MATCH`,
          url: profileUrl,
        });
        toast.success('Thanks for sharing!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setShowModal(true);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareToWhatsApp = () => {
    const text = `Check out ${agentName}'s real estate profile: ${profileUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareToTelegram = () => {
    const text = `Check out ${agentName}'s real estate profile: ${profileUrl}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareByEmail = () => {
    const subject = `${agentName}'s Real Estate Profile`;
    const body = `Check out ${agentName}'s real estate profile on REALTOR MATCH:\n\n${profileUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDownloadQR = () => {
    if (!qrCode) {
      toast.error('QR code not ready. Please try again.');
      return;
    }

    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `${agentName.toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR code downloaded');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`btn-ghost flex items-center justify-center ${isSharing ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        aria-label="Share profile"
      >
        <Share2 className="w-5 h-5 mr-2" />
        <span>Share Profile</span>
      </button>

      <button
        onClick={() => setShowQrModal(true)}
        className="btn-ghost"
        aria-label="Show QR code"
      >
        <QrCode className="w-5 h-5" />
      </button>

      {/* Share Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="share-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative glass-panel max-w-md w-full mx-auto animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="share-modal-title" className="text-xl font-bold text-white">
                  Share Profile
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Profile Link */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={profileUrl}
                      readOnly
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-300 hover:text-accent-200 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors"
                      aria-label={copied ? 'Link copied' : 'Copy link'}
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Share via</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleShareToWhatsApp}
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#22c55e] text-white focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      onClick={handleShareToTelegram}
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#0088cc] hover:bg-[#0077b5] text-white focus:outline-none focus:ring-2 focus:ring-[#0088cc] focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Telegram
                    </button>
                    <button
                      onClick={handleShareByEmail}
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#EA4335] hover:bg-[#D93025] text-white focus:outline-none focus:ring-2 focus:ring-[#EA4335] focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      Email
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setShowQrModal(true);
                      }}
                      className="flex items-center justify-center px-4 py-2 rounded-lg bg-accent-500 hover:bg-accent-600 text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-dark transition-colors"
                    >
                      <QrCode className="w-5 h-5 mr-2" />
                      QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="qr-modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={() => setShowQrModal(false)}
          />

          {/* Modal */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="relative glass-panel max-w-sm w-full mx-auto animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 id="qr-modal-title" className="text-xl font-bold text-white">
                  Profile QR Code
                </h2>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-6 mb-6">
                  {qrCode ? (
                    <img 
                      src={qrCode} 
                      alt="Profile QR Code"
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    className="btn-ghost"
                    onClick={() => setShowQrModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn-accent"
                    onClick={handleDownloadQR}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareProfile;