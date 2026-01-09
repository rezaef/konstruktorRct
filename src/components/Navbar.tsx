import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import hdaLogo from "../assets/login-bg.png";

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
    <nav className="bg-white/90 backdrop-blur border-b border-[#E2E8F0] shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => onNavigate('home')}
          >
            <img src={hdaLogo} alt="HDA Logo" className="h-10 w-10 rounded-lg ring-1 ring-[#E2E8F0] bg-white" />
            <h1 className="text-[#0B1F3B] font-semibold text-lg tracking-tight">HDA Interior</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative text-sm font-medium tracking-wide transition-colors ${
                  currentPage === link.path
                    ? 'text-[#0E7C66]'
                    : 'text-[#0B1F3B] hover:text-[#0E7C66]'
                }`}
              >
                {link.name}
                {currentPage === link.path && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full" />
                )}
              </button>
            ))}
            <button
              onClick={() => onNavigate('contact')}
              className="ml-2 px-4 py-2 rounded-md bg-[#0E7C66] text-white text-sm font-semibold shadow-sm hover:bg-[#0A6A58] transition-colors"
            >
              Free Consultation
            </button>
            {/* <button
              onClick={() => onNavigate('login')}
              className="px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2B] transition-colors"
            >
              Admin Login
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-[#0B1F3B] hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t border-[#E2E8F0]">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`relative block w-full text-left py-2 text-sm font-medium tracking-wide ${
                  currentPage === link.path
                    ? 'text-[#0E7C66]'
                    : 'text-[#0B1F3B]'
                }`}
              >
                {link.name}
              </button>
            ))}
            {/* <button
              onClick={() => {
                onNavigate('login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C19B2B] transition-colors"
            >
              Admin Login
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
}
