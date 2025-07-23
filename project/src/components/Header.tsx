import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="/PRIMARY LOGO B&P 1..001.png" 
              alt="Bali & Partners Logo" 
              className="h-40 w-auto max-h-405 "
            />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Contact
            </button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              <button 
                onClick={() => scrollToSection('hero')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                Contact
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
