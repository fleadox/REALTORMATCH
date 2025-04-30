import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Search, User, LogIn, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';
import LanguageSelector from '../common/LanguageSelector';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background-dark/80 backdrop-blur-md shadow-glass py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={handleNavClick}>
          <Logo className={isScrolled ? 'h-9' : 'h-11'} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center text-sm font-medium hover:text-accent-300 transition-colors ${
              location.pathname === '/' ? 'text-accent-300' : 'text-gray-300'
            }`}
            onClick={handleNavClick}
          >
            <Home className="w-4 h-4 mr-1.5" />
            <span>{t('nav.home')}</span>
          </Link>
          
          <Link 
            to="/agents" 
            className={`flex items-center text-sm font-medium hover:text-accent-300 transition-colors ${
              location.pathname.includes('/agents') ? 'text-accent-300' : 'text-gray-300'
            }`}
            onClick={handleNavClick}
          >
            <Search className="w-4 h-4 mr-1.5" />
            <span>{t('nav.findAgents')}</span>
          </Link>

          <LanguageSelector />
          
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className={`flex items-center text-sm font-medium hover:text-accent-300 transition-colors ${
                location.pathname.includes('/dashboard') ? 'text-accent-300' : 'text-gray-300'
              }`}
              onClick={handleNavClick}
            >
              <User className="w-4 h-4 mr-1.5" />
              <span>{t('nav.myAccount')}</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="btn-accent text-sm py-2 px-4"
              onClick={handleNavClick}
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              <span>{t('nav.signIn')}</span>
            </Link>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSelector />
          <button 
            className="flex items-center text-gray-300 hover:text-white transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 animate-slide-down">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`flex items-center text-base font-medium p-2 rounded-md ${
                location.pathname === '/' 
                  ? 'bg-accent-500/20 text-accent-300' 
                  : 'text-gray-300 hover:bg-white/5'
              }`}
              onClick={handleNavClick}
            >
              <Home className="w-5 h-5 mr-2" />
              <span>{t('nav.home')}</span>
            </Link>
            
            <Link 
              to="/agents" 
              className={`flex items-center text-base font-medium p-2 rounded-md ${
                location.pathname.includes('/agents') 
                  ? 'bg-accent-500/20 text-accent-300' 
                  : 'text-gray-300 hover:bg-white/5'
              }`}
              onClick={handleNavClick}
            >
              <Search className="w-5 h-5 mr-2" />
              <span>{t('nav.findAgents')}</span>
            </Link>
            
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className={`flex items-center text-base font-medium p-2 rounded-md ${
                  location.pathname.includes('/dashboard') 
                    ? 'bg-accent-500/20 text-accent-300' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
                onClick={handleNavClick}
              >
                <User className="w-5 h-5 mr-2" />
                <span>{t('nav.myAccount')}</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="btn-accent w-full justify-center"
                onClick={handleNavClick}
              >
                <LogIn className="w-5 h-5 mr-2" />
                <span>{t('nav.signIn')}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;