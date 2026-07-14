import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOBAL_MOQ } from './CatalogData';

const FAQS = [
  {
    question: "What is your Minimum Order Quantity (MOQ)?",
    answer: `Our standard manufacturing MOQ is ${GLOBAL_MOQ} units per design/color finish. This allows us to calibrate our high-efficiency technical stitching lines, source bespoke fabric runs, and manage quality-control thresholds for elite commercial-grade outputs.`
  },
  {
    question: "How does the B2B sampling process work?",
    answer: "Before starting bulk production, we manufacture a physical pre-production sample. First, our patternmakers digitize your blueprint specifications. We then cut and assemble a physical prototype and dispatch it to your procurement team. Mass fabrication begins only after your written approval."
  },
  {
    question: "What are your standard manufacturing lead times?",
    answer: "Our operational pipeline is optimized for speed and safety: physical sample execution takes 7 to 10 working days; bulk mass production ranges between 15 and 25 days depending on order size and contract specifications."
  },
  {
    question: "What are your payment and logistics terms?",
    answer: "We operate under a standard B2B 50% deposit model to activate fabric sourcing and production line setup. The remaining 50% balance is settled upon quality clearance reports before dispatch. We ship worldwide via FOB Karachi or local South Asian transit hubs."
  }
];

const SourcingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="py-28 bg-[#1A1A1A] px-6 border-t border-[#B87333]/5 relative overflow-hidden">
      {/* Background Accent glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #B87333 0%, transparent 70%)' }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-20">
          <span className="text-[#B87333] text-[10px] font-semibold tracking-[0.35em] uppercase mb-4 block">
            Procurement FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF7F2] tracking-wide mb-4">
            B2B Sourcing Guide
          </h2>
          <div className="w-12 h-[1px] bg-[#B87333] mx-auto mt-6" />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className="border border-[#B87333]/10 bg-white/[0.01] rounded-sm transition-all duration-300 hover:border-[#B87333]/25"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer group"
                >
                  <span className="text-sm font-medium tracking-wide text-[#FAF7F2] group-hover:text-[#B87333] transition-colors duration-200">
                    {faq.question}
                  </span>
                  <span 
                    className="text-xs transition-transform duration-300 font-light"
                    style={{ 
                      color: isOpen ? '#B87333' : 'rgba(250,247,242,0.4)',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                    }}
                  >
                    ＋
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="px-6 pb-6 text-xs leading-relaxed text-[#FAF7F2]/50 font-light tracking-wide border-t border-[#B87333]/5 pt-4"
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SourcingFAQ;
