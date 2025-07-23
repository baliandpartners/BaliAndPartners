import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bali & Partners</h3>
            <p className="text-gray-300 leading-relaxed">
              Legal Content & Digital Strategy Agency empowering legal professionals 
              with compelling digital narratives.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Legal Content Creation</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">Professional Ghostwriting</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">SEO for Law Firms</li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">LinkedIn Branding</li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="mr-2" size={16} />
                <span>Shashwat@baliandpartners.in</span>
              </div>
              <div className="flex items-center space-x-4 pt-2">
                <a 
                  href="https://www.linkedin.com/company/balipartners/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200 
                           transform hover:scale-110"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Bali & Partners. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                Legal Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;