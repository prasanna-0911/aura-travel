import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Compass, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Experience Weaver', path: '/weaver' },
  { name: 'Live Trip', path: '/live-trip' },
  { name: 'Explore', path: '/explore' },
  { name: 'Bookings', path: '/bookings' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const accountLink = isAuthenticated
    ? { name: isAdmin ? 'Admin' : 'Profile', path: isAdmin ? '/admin' : '/profile' }
    : { name: 'Sign In', path: '/login' };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-midnight/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-eucalyptus flex items-center justify-center transition-transform group-hover:scale-105">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.path
                    ? "text-eucalyptus bg-eucalyptus/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to={accountLink.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === accountLink.path
                  ? "text-eucalyptus bg-eucalyptus/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              <User className="w-4 h-4" />
              {accountLink.name}
            </Link>
            <Link
              to="/weaver"
              className="px-5 py-2.5 bg-eucalyptus hover:bg-eucalyptus-dark text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-eucalyptus/20"
            >
              Plan Your Journey
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-midnight/98 backdrop-blur-md border-b border-white/10 transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === link.path
                  ? "text-eucalyptus bg-eucalyptus/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to={accountLink.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
              location.pathname === accountLink.path
                ? "text-eucalyptus bg-eucalyptus/10"
                : "text-white/70 hover:text-white hover:bg-white/5"
            )}
          >
            {accountLink.name}
          </Link>
          <div className="pt-4 px-4">
            <Link
              to="/weaver"
              onClick={() => setIsOpen(false)}
              className="block w-full px-5 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white text-sm font-medium rounded-lg text-center transition-all duration-200"
            >
              Plan Your Journey
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
