import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Material Selection & Consultation',
      description: 'We align with your corporate brand guidelines to source specific textile weaves, evaluating fabric weights, breathability metrics, and durability ratings.'
    },
    {
      num: '02',
      title: 'Precision Blueprinting & Prototyping',
      description: 'Our expert patternmakers digitally render the architectural fitments, creating precise samples to solidify material styling and structural seams.'
    },
    {
      num: '03',
      title: 'Mass Batch Assembly & Customization',
      description: 'Using high-efficiency technical stitching lines, your apparel or uniform contract is fabricated under rigorous institutional compliance oversight.'
    },
    {
      num: '04',
      title: 'Quality Assurance & Global Logistics',
      description: 'Every single garment undergoes an intensive manual stress-test inspection protocol before being sealed, boxed, and dispatched to your distribution hub.'
    }
  ];

  return (
    <section id="process" className="relative min-h-screen py-28 bg-[#1A1A1A] px-6 overflow-hidden">
      
      {/* Background Line Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex justify-around max-w-7xl mx-auto px-8">
        <div className="w-[1px] h-full bg-[#FAF7F2]" />
        <div className="w-[1px] h-full bg-[#FAF7F2]" />
        <div className="w-[1px] h-full bg-[#FAF7F2]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <span className="text-[#B87333] text-[10px] font-semibold tracking-[0.35em] uppercase mb-4 block">
            The Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF7F2] tracking-wide mb-4">
            Our Manufacturing Process
          </h2>
          <div className="w-12 h-[1px] bg-[#B87333] mx-auto mt-6" />
        </div>

        {/* Staggered Timeline Framework */}
        <div className="flex flex-col gap-16 relative">
          
          {/* Central Vertical Connector Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1px] bg-[#B87333]/15 hidden md:block" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
                className={`flex flex-col md:flex-row w-full items-center justify-between ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* 🎯 UPDATED: Interactive Text Block with hover state rules */}
                <motion.div 
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="w-full md:w-[44%] flex flex-col text-left mb-6 md:mb-0 group cursor-default p-4 rounded-sm border border-transparent hover:border-[#B87333]/5 hover:bg-[#FAF7F2]/[0.02] transition-colors duration-300"
                >
                  <div className="text-[#B87333] font-mono text-xs font-bold tracking-widest mb-2 transition-colors duration-300">
                    PHASE // {step.num}
                  </div>
                  <h3 className="text-[#FAF7F2] group-hover:text-[#B87333] font-serif text-xl tracking-wide mb-4 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#FAF7F2]/50 group-hover:text-[#FAF7F2]/70 font-light leading-relaxed tracking-wide antialiased transition-colors duration-300">
                    {step.description}
                  </p>
                </motion.div>

                {/* Center Circle Indicator Badge with matching inner scale-up hover feedback */}
                <motion.div 
                  whileInView={{ scale: [0.5, 1] }}
                  viewport={{ once: true }}
                  className="relative z-20 flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#B87333] shadow-xl text-[#B87333] font-serif text-sm font-bold my-4 md:my-0"
                >
                  {step.num}
                </motion.div>

                {/* Balance Spacer Block */}
                <div className="w-full md:w-[44%] hidden md:block" />
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
