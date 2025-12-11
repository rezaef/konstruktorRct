import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import hdaLogo from 'figma:asset/6079b6e47b4180656d7238eb51827e949fc7d47c.png';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: 'home' },
    { name: 'About', path: 'about' },
    { name: 'Services', path: 'services' },
    { name: 'Portfolio', path: 'portfolio' },
    { name: 'Contact', path: 'contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => onNavigate('home')}
          >
            <img src={hdaLogo} alt="HDA Logo" className="h-12 w-12" />
            <h1 className="text-[#5BA8A8]">HDA Interior</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`transition-colors ${
                  currentPage === link.path
                    ? 'text-[#5BA8A8]'
                    : 'text-[#2D3748] hover:text-[#5BA8A8]'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 bg-[#E89B7C] text-white rounded-md hover:bg-[#D8845F] transition-colors"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 ${
                  currentPage === link.path
                    ? 'text-[#5BA8A8]'
                    : 'text-[#2D3748]'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-[#E89B7C] text-white rounded-md hover:bg-[#D8845F] transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
