import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0B1F3B] to-[#0E7C66] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-4">Contact Us</h1>
          <p className="text-white/90 text-xl">
            We'd love to discuss your next project!
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-[#0B1F3B] mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#0E7C66] focus:ring-2 focus:ring-[#D4AF37]/30"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#0E7C66] focus:ring-2 focus:ring-[#D4AF37]/30"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#0E7C66] focus:ring-2 focus:ring-[#D4AF37]/30"
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#0E7C66] focus:ring-2 focus:ring-[#D4AF37]/30 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-[#0E7C66] text-white rounded-lg hover:bg-[#0A6A58] transition-colors flex items-center justify-center gap-2 font-semibold shadow-sm"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-[#0B1F3B] mb-6">Get In Touch</h2>
            <p className="text-gray-600 mb-8">
              Have questions about our services or want to discuss your project? 
              We're here to help! Reach out to us through any of the following channels.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0E7C66] rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[#0B1F3B] mb-1">Office Location</h4>
                  <p className="text-gray-600">
                    Jl. Beji Pdam, Pakal<br />
                    Kec. Pakal, Surabaya<br />
                    Jawa Timur 60196
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0E7C66] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[#0B1F3B] mb-1">Phone</h4>
                  <p className="text-gray-600">+62 817 0317 7030</p>
                  <p className="text-gray-600">+62 811 3011 224</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0E7C66] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-[#0B1F3B] mb-1">Email</h4>
                  <p className="text-gray-600">hda.interiordesign@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-[#0B1F3B] mb-2">Office Hours</h4>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            const mapQuery =
              'QJ46+G7 Pakal, Surabaya, Jawa Timur, Jl. Beji Pdam, Pakal, Kec. Pakal, Surabaya, Jawa Timur 60196';

            const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
              mapQuery
            )}&output=embed`;

            const openMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              mapQuery
            )}`;

            return (
              <div className="overflow-hidden rounded-lg shadow-sm bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-semibold text-[#0B1F3B]">Map Location</p>
                    <p className="text-xs text-gray-600">QJ46+G7 Pakal, Surabaya</p>
                  </div>

                  <a
                    href={openMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#0E7C66] hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>

                <div className="h-[400px] w-full">
                  <iframe
                    title="Office Location Map"
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </section>

    </div>
  );
}
