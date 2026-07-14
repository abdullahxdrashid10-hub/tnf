import React, { useState } from 'react';
import { motion } from 'framer-motion';

// ─── Inquiry type options (replaces single-purpose product slider) ─────────────
const INQUIRY_TYPES = [
  { value: 'general',      label: 'General Sourcing'         },
  { value: 'custom',       label: 'Custom Apparel'           },
  { value: 'bulk',         label: 'Bulk Order Request'       },
  { value: 'corporate',    label: 'Corporate Consultation'   },
  { value: 'sportswear',   label: 'Sportswear & Performance' },
  { value: 'workwear',     label: 'Uniform & Workwear'       },
];

// ─── Volume tier logic — preserved exactly from original ──────────────────────
// ─── Shared premium field class string ────────────────────────────────────────
const fieldBase =
  'w-full bg-[#1E1A18]/50 border border-[#B87333]/15 rounded-lg px-4 py-3.5 text-[#FAF7F2] ' +
  'text-sm font-light placeholder-[#FAF7F2]/20 outline-none ' +
  'transition-all duration-300 focus:border-[#B87333]/60 focus:bg-[#1E1A18]/80 ' +
  'focus:ring-1 focus:ring-[#B87333]/30';

const labelBase =
  'block text-[9px] uppercase tracking-[0.25em] font-bold text-[#FAF7F2]/45 mb-2 font-mono';

// ─── Framer variants ──────────────────────────────────────────────────────────
const panelVariants = {
  hidden:  { opacity: 0, x: 30  },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

const leftVariants = {
  hidden:  { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
const Contact = () => {

  // ── State hooks ──
  const [selectedCollection,  setSelectedCollection]  = useState('apparel');
  const [inquiryType,         setInquiryType]         = useState('general');
  const [name,                setName]                = useState('');
  const [email,               setEmail]               = useState('');
  const [message,             setMessage]             = useState('');
  const [submitted,           setSubmitted]           = useState(false);

  // ── Submit handler ──
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="contact"
      className="py-32 bg-[#100D0B] relative selection:bg-[#B87333]/30 overflow-hidden"
    >
      {/* ── Ambient structural lines ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="w-full h-full opacity-[0.02] flex justify-around max-w-7xl mx-auto px-8">
          <div className="w-[1px] h-full bg-[#FAF7F2]" />
          <div className="w-[1px] h-full bg-[#FAF7F2]" />
          <div className="w-[1px] h-full bg-[#FAF7F2]" />
        </div>
      </div>

      {/* ── Subtle radial glow behind the form panel ────────────────────────── */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(184,115,51,0.03) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* ── LEFT — Brand editorial copy + contact info ─────────────────── */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            {/* Section eyebrow */}
            <span className="text-[#B87333] font-semibold tracking-[0.35em] uppercase text-[9px] mb-5 block">
              Global Inquiry Concierge
            </span>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-serif text-[#FAF7F2] mb-8 leading-[1.2] tracking-wide">
              Your Brand, Your Designs,{' '}
              <br />
              <span className="italic font-light text-[#FAF7F2]/70">
                Our Manufacturing.
              </span>
            </h2>

            <p className="text-[#FAF7F2]/50 font-light text-sm mb-14 max-w-md leading-relaxed tracking-wide">
              Step into a framework where industrial capacity meets premium textile
              art. We build scalable contracts with precise quality controls for
              operations demanding absolute elite standards.
            </p>

            {/* Contact info blocks */}
            <div className="space-y-8">
              <div
                className="pb-6 group cursor-default"
                style={{ borderBottom: '1px solid rgba(184,115,51,0.1)' }}
              >
                <h3 className="text-[#FAF7F2] group-hover:text-[#B87333] font-serif font-medium text-base mb-2 tracking-wide transition-colors duration-300">
                  Global Logistics Desks
                </h3>
                <p className="text-[#FAF7F2]/45 font-mono text-xs leading-relaxed tracking-widest">
                  +92 336 666643
                  <br />
                  +92 315 2262430
                </p>
              </div>

              <div
                className="pb-6 group cursor-default"
                style={{ borderBottom: '1px solid rgba(184,115,51,0.1)' }}
              >
                <h3 className="text-[#FAF7F2] group-hover:text-[#B87333] font-serif font-medium text-base mb-2 tracking-wide transition-colors duration-300">
                  Headquarter Coordinates
                </h3>
                <p className="text-[#FAF7F2]/45 font-light text-xs leading-relaxed max-w-xs tracking-wide">
                  Office C1/R3 1st Floor Al Burhan Circle
                  <br />
                  Block E North Nazimabad, Karachi
                </p>
              </div>

              {/* Inquiry type legend — visual cue of what portal handles */}
              <div className="pt-2">
                <p className="text-[9px] uppercase tracking-[0.28em] text-[#FAF7F2]/30 mb-4 font-bold">
                  We Handle
                </p>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TYPES.map((t) => (
                    <span
                      key={t.value}
                      className="text-[9px] tracking-[0.14em] font-light px-3 py-1"
                      style={{
                        color: '#FAF7F2',
                        opacity: 0.45,
                        border: '1px solid rgba(184,115,51,0.18)',
                      }}
                    >
                      {t.label.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Concierge Inquiry Form Panel ─────────────────────── */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#161311] border border-[#B87333]/15 rounded-2xl p-8 sm:p-12 text-left shadow-2xl shadow-black/60 relative"
          >
            {/* Panel header */}
            <div className="mb-10">
              <span className="text-[#B87333] text-[9px] font-bold tracking-[0.3em] uppercase block mb-1">
                SECURE CONCIERGE GATEWAY
              </span>
              <h3 className="text-2xl font-serif text-[#FAF7F2] mb-2 tracking-wide">
                Initiate an Inquiry
              </h3>
              <p className="text-[11px] text-[#FAF7F2]/40 font-light tracking-wide leading-relaxed">
                Complete the configuration below. Our corporate desks will initialize contact within 24 business hours.
              </p>
              {/* Gold rule */}
              <div className="mt-5 w-12 h-[1px]" style={{ backgroundColor: '#B87333', opacity: 0.5 }} />
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>

              {/* ── Row 1: Name + Email ─────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelBase}>Corporate Contact</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldBase}
                    placeholder="Representative Name"
                    required
                  />
                </div>
                <div>
                  <label className={labelBase}>Secure Gateway Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldBase}
                    placeholder="corporate@domain.com"
                    required
                  />
                </div>
              </div>

              {/* ── Row 2: Inquiry Type + Collection Line ───────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Inquiry Type dropdown */}
                <div className="relative">
                  <label className={labelBase}>Inquiry Type</label>
                  <div className="relative">
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className={`${fieldBase} appearance-none cursor-pointer pr-10`}
                      style={{ color: inquiryType ? '#FAF7F2' : 'rgba(250,247,242,0.25)' }}
                    >
                      {INQUIRY_TYPES.map((t) => (
                        <option
                          key={t.value}
                          value={t.value}
                          className="bg-[#161311] text-[#FAF7F2]"
                        >
                          {t.label}
                        </option>
                      ))}
                    </select>
                    {/* Dropdown chevron */}
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B87333] opacity-60 text-xs">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Target Line Selection */}
                <div className="relative">
                  <label className={labelBase}>Target Line Selection</label>
                  <div className="relative">
                    <select
                      value={selectedCollection}
                      onChange={(e) => setSelectedCollection(e.target.value)}
                      className={`${fieldBase} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="apparel"      className="bg-[#161311] text-[#FAF7F2]">Apparel Collection Range</option>
                      <option value="uniforms"     className="bg-[#161311] text-[#FAF7F2]">Uniform &amp; Workwear Division</option>
                      <option value="sportswear"   className="bg-[#161311] text-[#FAF7F2]">Sportswear &amp; Performance Line</option>
                      <option value="hometextiles" className="bg-[#161311] text-[#FAF7F2]">Home Textiles (Sheets &amp; Towels)</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#B87333] opacity-60 text-xs">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Row 3: Inquiry Details textarea ────────────────────────── */}
              <div>
                <label className={labelBase}>Inquiry Details</label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${fieldBase} resize-none`}
                  placeholder="Describe your requirements — size ratios, weaving densities, branding specifications, delivery timelines, or any other details…"
                />
              </div>

              {/* ── CTA Button with Framer Motion ────────────────────────────── */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(184,115,51,0.2)' }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="w-full py-4 rounded-lg font-serif text-[10px] font-bold tracking-[0.25em] uppercase mt-4 transition-colors duration-200"
                style={{
                  backgroundColor: '#B87333',
                  color: '#1A1A1A',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {submitted ? '✓ Inquiry Dispatched' : 'Dispatch Inquiry'}
              </motion.button>

              {/* Submission confirmation micro-copy */}
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[10px] tracking-widest font-light mt-4"
                  style={{ color: '#B87333', opacity: 0.8 }}
                >
                  Our concierge team will contact you within 24 business hours.
                </motion.p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
