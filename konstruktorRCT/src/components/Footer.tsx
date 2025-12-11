import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import hdaLogo from 'figma:asset/6079b6e47b4180656d7238eb51827e949fc7d47c.png';

export function Footer() {
  return (
    <footer className="bg-[#2D3748] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={hdaLogo} alt="HDA Logo" className="h-10 w-10" />
              <h3 className="text-[#5BA8A8]">HDA Interior</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Creating beautiful, functional spaces that inspire and delight. Your vision, our expertise.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[#5BA8A8] mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#E89B7C]" />
                <span className="text-gray-300">Pakal, Surabaya</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#E89B7C]" />
                <span className="text-gray-300">+62 817 0317 7030</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#E89B7C]" />
                <span className="text-gray-300">hda.interiordesign@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-[#5BA8A8] mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-[#5BA8A8] rounded-full flex items-center justify-center hover:bg-[#4A9090] transition-colors">
                <Facebook size={20} />
              </button>
              <button className="w-10 h-10 bg-[#E89B7C] rounded-full flex items-center justify-center hover:bg-[#D8845F] transition-colors">
                <Instagram size={20} />
              </button>
              <button className="w-10 h-10 bg-[#9B7CB5] rounded-full flex items-center justify-center hover:bg-[#8B6CA5] transition-colors">
                <Linkedin size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 HDA Interior. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
