import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // 🎯 Imported React Router Link to navigate pages seamlessly
import heroFabricImage from '../assets/hero.png';

const Hero = () => {
  return (
    // 🎯 CHANGED: Replaced h-screen with min-h-screen and responsive vertical padding to prevent component overlapping
    <section id="home" className="relative min-h-screen py-24 md:py-0 flex items-center justify-between overflow-hidden bg-[#1A1A1A]">
      
      {/* 🎯 CHANGED: Responsive grid parameters - grid-cols-1 stacking up vertically on mobile, switching to grid-cols-2 on medium desktop layouts */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mt-6 text-left">
        
        {/* Left Typography Column */}
        <div className="flex flex-col items-start z-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#B87333] text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4 sm:mb-5"
          >
            Premium Textiles & Merchandise
          </motion.span>

          {/* 🎯 CHANGED: Fluid responsive title sizing text-3xl scaling cleanly up to text-6xl */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-serif text-[#FFFFFF] leading-[1.2] mb-5 sm:mb-6 tracking-wide"
          >
            Quality You Can Wear,<br />
            <span className="italic font-normal text-[#FAF7F2]/90">Service You Can Trust</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs sm:text-sm md:text-base text-[#FAF7F2]/70 mb-8 sm:mb-10 max-w-md font-light tracking-wide leading-relaxed"
          >
            Fabrics and merchandise that blend comfort, durability, and modern style crafted perfectly for elite industry compliance requirements.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/collection"
              className="inline-block w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-[#B87333] hover:bg-[#A05A22] text-[#1A1A1A] text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-all text-center shadow-lg transform hover:-translate-y-0.5"
            >
              Explore Collection
            </Link>
            <motion.a
              href="/assets/grey_textile_workwear_catalog.pdf"
              download
              className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 border border-[#B87333]/30 text-[#FAF7F2] text-xs font-bold tracking-[0.2em] uppercase rounded-sm transition-all duration-355 text-center bg-white/[0.02] backdrop-blur-md relative overflow-hidden"
              whileHover={{ 
                scale: 1.03, 
                borderColor: '#B87333', 
                boxShadow: "0 0 20px rgba(184, 115, 51, 0.28)",
                backgroundColor: "rgba(184, 115, 51, 0.06)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Download Catalog</span>
              <svg 
                className="w-3.5 h-3.5 stroke-[#B87333] transition-transform duration-300 group-hover:translate-y-0.5" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* Right Framing Image Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          // 🎯 CHANGED: h-[45vh] on mobile layout so it sits cleanly below the button loop without pushing past screen bounds
          className="h-[40vh] sm:h-[50vh] md:h-[72vh] w-full overflow-hidden rounded-sm relative shadow-2xl border border-[#B87333]/10 mt-6 md:mt-0"
        >
          <img
            src={heroFabricImage}
            alt="Bespoke Garments Apparel Production"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/20 via-transparent to-[#1A1A1A]/20 pointer-events-none" />
        </motion.div>
      </div>

      {/* Vertical floating scroll tracker - Safe hidden layout on touch tablets and screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        className="absolute bottom-10 left-8 hidden xl:flex flex-col items-center gap-4"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#FAF7F2]/30 [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-[1px] h-12 bg-[#FAF7F2]/10 overflow-hidden relative">
          <motion.div
            initial={{ y: -48 }}
            animate={{ y: 48 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute left-0 top-0 w-full h-1/2 bg-[#B87333]"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
