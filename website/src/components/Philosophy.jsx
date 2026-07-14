import React from 'react';
import { motion } from 'framer-motion';

const Philosophy = () => {
  const concepts = [
    { 
      title: 'Premium Sourcing', 
      text: 'Curating world-class textiles from heritage mills and certified sustainable growers to ensure every roll meets elite commercial grade expectations.' 
    },
    { 
      title: 'Ethical Production', 
      text: 'Enforcing zero-waste cutting frameworks alongside fair, transparent labor practices to engineer merchandise you can truly be proud to distribute.' 
    },
    { 
      title: 'Tailored Fitting', 
      text: 'Precision modeling and anatomical silhouette adjustments designed specifically to match the structural requirements and aesthetic of your corporate identity.' 
    }
  ];

  return (
    // 🎯 RESPONSIVE TWEAK: Swapped py-28 for py-20 on mobile to avoid excessive negative space gaps
    <section id="Philosophy" className="relative min-h-screen py-20 sm:py-28 bg-[#1A1A1A] flex items-center justify-center overflow-hidden px-4 sm:px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto text-center"
      >
        <span className="text-[#B87333] text-[10px] font-semibold tracking-[0.35em] uppercase mb-4 sm:mb-5 block">
          Our Core Intent
        </span>
        
        {/* 🎯 RESPONSIVE TWEAK: text-2xl on phone monitors scaling cleanly up to text-5xl on main computers */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#FAF7F2] tracking-wide leading-snug mb-6 sm:mb-8 max-w-4xl mx-auto">
          The Philosophy Behind Grey Textiles
        </h2>
        
        {/* 🎯 RESPONSIVE TWEAK: Reduced mb-24 margin down to mb-12 on mobile to pull content closer */}
        <p className="text-xs sm:text-sm text-[#FAF7F2]/60 max-w-2xl mx-auto font-light tracking-widest leading-relaxed mb-12 sm:mb-24 px-2">
          We treat apparel manufacturing as an art form. Every stitch, canvas cut, and fabric allocation is precision engineered to represent premium craftsmanship.
        </p>
        
        {/* 🎯 RESPONSIVE TWEAK: grid-cols-1 on small monitors stacking up vertically, switching to grid-cols-3 on medium layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
              whileHover={{ y: -8, borderColor: '#B87333' }}
              // min-h dropped to 220px on mobile so small screens aren't unnecessarily elongated
              className="p-6 sm:p-8 bg-[#FAF7F2] border border-transparent rounded-sm shadow-xl shadow-black/50 transition-all duration-300 flex flex-col justify-between min-h-[220px] sm:min-h-[260px]"
            >
              <div>
                <h3 className="text-[#1A1A1A] font-serif text-lg sm:text-xl tracking-wide mb-2 sm:mb-3">
                  {concept.title}
                </h3>
                <div className="w-10 sm:w-12 h-[2px] bg-[#B87333] mb-4 sm:mb-5" />
                
                <p className="text-xs text-[#1A1A1A]/75 font-light tracking-wide leading-relaxed antialiased">
                  {concept.text}
                </p>
              </div>
              
              <div className="text-[9px] tracking-[0.25em] text-[#B87333] uppercase font-bold mt-6 sm:mt-8 self-end opacity-80">
                0{index + 1}
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
};

export default Philosophy;
