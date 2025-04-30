import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from '../common/Logo';
import LanguageSelector from '../common/LanguageSelector';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background-dark/95 backdrop-blur-sm text-white pt-16 pb-8 border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <Logo className="h-12 mb-4" variant="light" />
            <p className="text-gray-300 mb-4">
              {t('meta.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/realtormatch.pro/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/realtormatch.pro/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/realtor-match" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-400 hover:text-white transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-sans font-semibold mb-4 text-white">{t('footer.quickLinks')}</h5>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={handleNavClick}
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/agents" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={handleNavClick}
                >
                  {t('nav.findAgents')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={handleNavClick}
                >
                  Join as Agent
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                  onClick={handleNavClick}
                >
                  {t('nav.signIn')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About Us */}
          <div>
            <h5 className="text-xl font-sans font-semibold mb-4 text-white">About Us</h5>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:info@realtormatch.pro" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@realtormatch.pro"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Advertise with Us
                </a>
              </li>
              <li>
                <LanguageSelector />
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
            <div className="flex-1 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0">
              <p className="text-gray-400 text-sm inline-block">
                © {currentYear} REALTOR MATCH. {t('footer.rights')}
              </p>
              <div className="md:ml-6 flex items-center space-x-6">
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                  onClick={handleNavClick}
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-of-service" 
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                  onClick={handleNavClick}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 inline-flex items-center gap-2 self-start md:self-auto">
              <img 
                src="https://flagcdn.com/w40/ge.png"
                alt="Georgian flag"
                className="w-6 h-4"
              />
              <span className="text-sm text-gray-300">Georgia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;