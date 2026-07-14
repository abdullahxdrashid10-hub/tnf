import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [activeId, setActiveId] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartTotalItems } = useCart();
  const badgeControls = useAnimation();

  const liveCount = getCartTotalItems();
  const displayCount = liveCount > 99 ? '99+' : liveCount;

  const NAV_LINKS = [
    { name: 'Home', id: 'home', isRoute: false, path: '#home' },
    { name: 'Collection', id: 'collection', isRoute: true, path: '/collection' },
    { name: 'Philosophy', id: 'Philosophy', isRoute: false, path: '#Philosophy' },
    { name: 'Process', id: 'process', isRoute: false, path: '#process' },
    { name: 'Catalog (PDF)', id: 'catalog', isRoute: false, path: '/assets/grey_textile_workwear_catalog.pdf', isExternal: true },
    { name: 'Contact', id: 'contact', isRoute: false, path: '#contact' },
  ];

  useEffect(() => {
    if (liveCount > 0) {
      badgeControls.start({
        scale: [1, 1.3, 0.95, 1.05, 1],
        transition: { duration: 0.4, ease: 'easeInOut' }
      });
    }
  }, [liveCount, badgeControls]);

  useEffect(() => {
    if (location.pathname.startsWith('/collection')) {
      setActiveId('collection');
      return;
    }
    if (location.pathname !== '/') {
      setActiveId('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const link of NAV_LINKS) {
        if (link.isRoute || link.isExternal) continue;
        const el = document.getElementById(link.id);
        if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
          setActiveId(link.id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, link) => {
    if (link.isExternal) {
      setIsMobileMenuOpen(false);
      return; // allow browser default download
    }
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (link.isRoute) {
      navigate(link.path);
    } else {
      if (location.pathname === '/') {
        document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleQuote = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1, transition: { height: { duration: 0.35, ease: 'easeOut' }, opacity: { duration: 0.25 } } },
    exit: { height: 0, opacity: 0, transition: { height: { duration: 0.3, ease: 'easeIn' }, opacity: { duration: 0.2 } } }
  };

  const mobileLinkVariants = {
    hidden: { x: -15, opacity: 0 },
    visible: i => ({ x: 0, opacity: 1, transition: { delay: i * 0.05, duration: 0.25, ease: 'easeOut' } })
  };
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#B87333]/10 px-4 sm:px-6 py-5 sm:py-6"
    >
      {/* PINS ITEMS TO FAR EDGES VIA JUSTIFY-BETWEEN */}
      <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
        
        {/* Far Left Brand Logo + Name */}
        <div
          onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
          className="flex items-center gap-4 cursor-pointer select-none group"
        >
          <img
            src={logo}
            alt="Grey Textile & Merchandising Logo"
            className="h-16 sm:h-20 w-auto object-contain mix-blend-screen contrast-125 brightness-110 block shrink-0"
          />
          <span className="text-[#FAF7F2] font-serif text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold border-l border-[#B87333]/30 pl-4 h-5 flex items-center transition-colors duration-300 group-hover:text-[#B87333]">
            Grey Textile &amp; Merchandising
          </span>
        </div>
        
        {/* Far Right Navigation Controls Alignment Group */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">
          {NAV_LINKS.map((link) => {
            const isActive = activeId === link.id;
            if (link.isExternal) {
              return (
                <div key={link.id} className="relative py-1">
                  <a
                    href={link.path}
                    download
                    className="text-[10px] uppercase tracking-[0.2em] hover:text-[#B87333] transition-colors block font-semibold"
                    style={{ color: 'rgba(250, 247, 242, 0.7)' }}
                  >
                    {link.name}
                  </a>
                </div>
              );
            }
            return (
              <div key={link.id} className="relative py-1">
                <a
                  href={link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-[10px] uppercase tracking-[0.2em] transition-colors block font-semibold"
                  style={{ color: isActive ? '#B87333' : 'rgba(250, 247, 242, 0.7)' }}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B87333]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </div>
            );
          })}

          {/* Checkout Panel CTA Item */}
          <motion.button 
            onClick={handleQuote}
            className="relative p-2 text-[#FAF7F2]/70 hover:text-[#B87333] transition-colors cursor-pointer flex items-center gap-1.5 ml-2 bg-transparent border-none outline-none"
            title="View Inquiry Cart"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-widest">Inquiry Cart</span>
            
            <AnimatePresence>
              {liveCount > 0 && (
                <motion.span 
                  key="badge-desktop"
                  animate={badgeControls}
                  initial={{ scale: 0, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-2 bg-[#B87333] text-[#1A1A1A] font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-black/40"
                >
                  {displayCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Header Action Button */}
          <motion.a 
            onClick={() => navigate('/checkout')}
            className="ml-2 px-5 py-2.5 bg-[#B87333] text-[#1A1A1A] text-[10px] font-bold tracking-[0.15em] uppercase rounded-sm shadow-lg cursor-pointer select-none"
            whileHover={{ backgroundColor: '#A06228', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            Get A Quote
          </motion.a>
        </div>

        {/* Mobile View Row Control Layer */}
        <div className="flex lg:hidden items-center gap-4">
          <div onClick={handleQuote} className="text-[#FAF7F2]/80 relative p-1 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {liveCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#B87333] text-[#1A1A1A] font-mono text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {displayCount}
              </span>
            )}
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#FAF7F2] p-1 focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Mobile Drawer Layout Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden mt-4 bg-[#1A1A1A] border-t border-[#B87333]/10 py-4 px-2 space-y-1 overflow-hidden"
          >
            {NAV_LINKS.map((link, i) => {
              const isActive = activeId === link.id;
              if (link.isExternal) {
                return (
                  <motion.div key={link.id} custom={i} variants={mobileLinkVariants}>
                    <a
                      href={link.path}
                      download
                      onClick={(e) => handleNavClick(e, link)}
                      className="flex items-center justify-between px-3 py-3 text-[11px] uppercase tracking-widest font-semibold transition-colors duration-200 rounded-sm"
                      style={{
                        color: 'rgba(250, 247, 242, 0.8)',
                        backgroundColor: 'transparent',
                        borderLeft: '2px solid transparent'
                      }}
                    >
                      {link.name}
                    </a>
                  </motion.div>
                );
              }
              return (
                <motion.div key={link.id} custom={i} variants={mobileLinkVariants}>
                  <a
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link)}
                    className="flex items-center justify-between px-3 py-3 text-[11px] uppercase tracking-widest font-semibold transition-colors duration-200 rounded-sm"
                    style={{
                      color: isActive ? '#B87333' : 'rgba(250, 247, 242, 0.8)',
                      backgroundColor: isActive ? 'rgba(184,115,51,0.07)' : 'transparent',
                      borderLeft: isActive ? '2px solid #B87333' : '2px solid transparent'
                    }}
                  >
                    {link.name}
                  </a>
                </motion.div>
              );
            })}
            <motion.button 
              custom={NAV_LINKS.length}
              variants={mobileLinkVariants}
              onClick={() => { setIsMobileMenuOpen(false); navigate('/checkout'); }}
              className="w-full block text-center mt-4 px-4 py-2.5 bg-[#B87333] text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase rounded-sm font-semibold border-none cursor-pointer"
            >
              Get A Quote
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
