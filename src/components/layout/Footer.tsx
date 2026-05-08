import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const footerLinks = {
  explore: [
    { name: 'Destinations', path: '/explore' },
    { name: 'Experience Weaver', path: '/weaver' },
    { name: 'Live Trip', path: '/live-trip' },
    { name: 'Bookings', path: '/bookings' },
  ],
  destinations: [
    { name: 'Goa', path: '/explore?destination=goa' },
    { name: 'Manali', path: '/explore?destination=manali' },
    { name: 'Pune', path: '/explore?destination=pune' },
  ],
  support: [
    { name: 'Help Center', path: '/help' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-midnight text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-eucalyptus flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg tracking-tight leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                  AURA
                </span>
                <span className="text-eucalyptus text-[10px] tracking-[0.2em] font-medium leading-none">
                  TRAVEL
                </span>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Your story. Your pace. Your journey. AI-crafted travel experiences that understand you.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-eucalyptus flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-eucalyptus flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-eucalyptus flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-eucalyptus text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Destinations
            </h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/60 hover:text-eucalyptus text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-eucalyptus" />
                hello@auratravel.com
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-eucalyptus" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-eucalyptus mt-0.5" />
                <span>Pune, Maharashtra<br />India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Aura Travel. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.support.slice(2).map((link) => (
                <Link key={link.path} to={link.path} className="text-white/40 hover:text-white/60 text-sm transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
