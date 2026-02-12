import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { cart, theme, toggleTheme } = useShop();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-champagne/95 dark:bg-obsidian/95 backdrop-blur-md py-4 border-b border-gold/10 shadow-sm'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl tracking-[0.3em] transition-all uppercase font-black hover:text-gold text-obsidian dark:text-champagne"
        >
          Chronos
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-12 uppercase text-[10px] tracking-[0.3em] font-bold">
          <Link
            to="/"
            className={`${
              isActive('/') ? 'text-gold' : 'text-obsidian dark:text-champagne opacity-60 hover:opacity-100 hover:text-gold'
            } transition-all`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`${
              isActive('/shop')
                ? 'text-gold'
                : 'text-obsidian dark:text-champagne opacity-60 hover:opacity-100 hover:text-gold'
            } transition-all`}
          >
            Collection
          </Link>
          <Link
            to="/admin"
            className={`${
              isActive('/admin') ? 'text-gold' : 'text-obsidian dark:text-champagne opacity-40 hover:opacity-100'
            } border-l border-gold/20 pl-12 transition-all`}
          >
            Atelier
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          {/* User Portal Link */}
          {user ? (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/profile"
                className={`${
                  isActive('/profile')
                    ? 'text-gold'
                    : 'text-obsidian dark:text-champagne opacity-60 hover:opacity-100 hover:text-gold'
                } transition-all text-[9px] uppercase font-black tracking-widest`}
              >
                My Archive
              </Link>
              <button
                onClick={handleSignOut}
                className="text-[9px] uppercase font-black tracking-widest opacity-40 hover:opacity-100 transition-all text-red-500/80"
              >
                Exit
              </button>
              <Link
                to="/profile"
                className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center border border-gold/10 hover:border-gold transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:block text-[9px] uppercase font-black tracking-widest text-obsidian dark:text-champagne opacity-60 hover:opacity-100 hover:text-gold transition-all"
            >
              Client Portal
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="text-obsidian dark:text-champagne opacity-60 hover:opacity-100 transition-opacity p-2"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l.707.707M6.343 6.343l.707-.707" />
                <circle cx="12" cy="12" r="5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <Link to="/cart" className="relative group p-1 transition-transform hover:scale-110 text-obsidian dark:text-champagne">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden text-obsidian dark:text-champagne opacity-80"
            aria-label="Open Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (slides from RIGHT) */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ${
          mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          aria-label="Close Menu Backdrop"
        />

        {/* Drawer Panel (2/5 width) + height = content (max height 90dvh) */}
        <div
          className={`absolute right-0 top-0 w-[40vw] max-w-[320px] min-w-[220px] 
          max-h-[90dvh] h-auto bg-champagne dark:bg-obsidian border-l border-gold/10 shadow-2xl 
          transition-transform duration-500 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-5 pt-6 pb-5 border-b border-gold/10 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm tracking-[0.3em] uppercase font-black text-obsidian dark:text-champagne hover:text-gold transition-all"
            >
              Chronos
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 opacity-60 hover:opacity-100 transition-all"
              aria-label="Close Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-5 py-6">
            <div className="flex flex-col gap-5 uppercase tracking-[0.25em] text-[10px] font-black text-obsidian dark:text-champagne">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`${isActive('/') ? 'text-gold' : 'opacity-70 hover:opacity-100'} transition-all`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className={`${isActive('/shop') ? 'text-gold' : 'opacity-70 hover:opacity-100'} transition-all`}
              >
                Collection
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${isActive('/profile') ? 'text-gold' : 'opacity-70 hover:opacity-100'} transition-all`}
                >
                  My Archive
                </Link>
              )}
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`${isActive('/admin') ? 'text-gold' : 'opacity-70 hover:opacity-100'} transition-all`}
              >
                Atelier
              </Link>

              <div className="pt-5 border-t border-gold/10">
                {!user ? (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="text-gold">
                    Client Portal
                  </Link>
                ) : (
                  <button onClick={handleSignOut} className="text-red-500 uppercase tracking-[0.25em] text-[10px] font-black">
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* small footer inside drawer */}
          <div className="px-5 pb-6 pt-2 border-t border-gold/10 text-[8px] uppercase tracking-[0.25em] font-black opacity-30">
            &copy; 2024 Chronos
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-obsidian text-champagne px-6 lg:px-12 border-t border-gold/10">
    <div className="max-w-7xl mx-auto py-8 md:py-12">
      
      {/* Mobile: Only Brand Block */}
      <div className="md:hidden text-center space-y-6">
        <h2 className="text-2xl tracking-[0.3em] uppercase font-black text-gold">
          Chronos
        </h2>
        <p className="opacity-60 text-sm leading-relaxed font-medium max-w-xs mx-auto">
          Time is a masterpiece, meant to be worn with distinction.
        </p>
        <p className="opacity-40 text-[8px] tracking-[0.2em] uppercase leading-loose font-bold">
          GENEVA • PARIS • LONDON • TOKYO
        </p>
      </div>

      {/* Desktop / Tablet: Full Footer */}
      <div className="hidden md:flex items-start justify-between gap-12">
        
        {/* Brand */}
        <div className="space-y-6 max-w-sm">
          <h2 className="text-2xl tracking-[0.3em] uppercase font-black text-gold">
            Chronos
          </h2>
          <p className="opacity-60 text-base leading-relaxed font-medium">
            Time is a masterpiece, meant to be worn with distinction.
          </p>
          <p className="opacity-40 text-[8px] tracking-[0.2em] uppercase leading-loose font-bold">
            GENEVA • PARIS • LONDON • TOKYO
          </p>
        </div>

        {/* The House */}
        <div className="space-y-6">
          <h4 className="uppercase text-[10px] tracking-[0.3em] font-black text-gold">
            The House
          </h4>
          <ul className="space-y-3 opacity-40 text-[9px] tracking-[0.2em] uppercase font-bold">
            <li><Link to="/shop" className="hover:opacity-100 transition-opacity">Our Heritage</Link></li>
            <li><Link to="/shop" className="hover:opacity-100 transition-opacity">Savior-Faire</Link></li>
            <li><Link to="/shop" className="hover:opacity-100 transition-opacity">Archives</Link></li>
          </ul>
        </div>

        {/* Clientele */}
        <div className="space-y-6">
          <h4 className="uppercase text-[10px] tracking-[0.3em] font-black text-gold">
            Clientele
          </h4>
          <ul className="space-y-3 opacity-40 text-[9px] tracking-[0.2em] uppercase font-bold">
            <li><Link to="/concierge" className="hover:opacity-100 transition-opacity">Concierge</Link></li>
            <li><Link to="/viewing" className="hover:opacity-100 transition-opacity">Private Viewings</Link></li>
            <li><Link to="/assurance" className="hover:opacity-100 transition-opacity">Assurance</Link></li>
          </ul>
        </div>

      </div>
    </div>
  </footer>
);


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-champagne text-obsidian dark:bg-obsidian dark:text-champagne transition-colors duration-500">
      <Navbar />
      <main className="flex-grow pt-24 animate-reveal">{children}</main>
      <Footer />
    </div>
  );
};
