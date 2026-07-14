import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WHATSAPP_LINK } from './CatalogData';

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
                <p className="text-[#FAF7F2]/45 font-mono text-xs leading-relaxed tracking-widest mb-4">
                  +92 336 666643
                  <br />
                  +92 315 2262430
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#25D366]/40 hover:border-[#25D366] rounded-md text-[10px] text-[#25D366] tracking-widest font-bold uppercase transition-all duration-300 bg-[#25D366]/5 hover:bg-[#25D366]/10"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.022-.014-.507-.25-.586-.278c-.079-.029-.137-.042-.194.041c-.057.085-.222.278-.272.336c-.05.059-.101.066-.179.027c-.079-.039-.333-.122-.635-.39c-.235-.21-.393-.469-.439-.55c-.046-.079-.005-.122.035-.161c.036-.035.079-.092.119-.138c.04-.046.053-.078.08-.129c.027-.052.014-.097-.007-.138c-.02-.041-.194-.469-.266-.64c-.07-.17-.142-.147-.195-.149c-.051-.002-.108-.002-.165-.002c-.058 0-.151.022-.23.107c-.079.085-.302.296-.302.721c0 .424.309.835.352.89c.044.055.607.928 1.47 1.301c.205.088.366.14.493.181c.206.066.393.056.541.034c.165-.024.507-.207.578-.407c.071-.2.071-.371.05-.407c-.021-.035-.078-.057-.157-.097m-5.467 5.163h-.005c-1.22 0-2.42-.328-3.477-.948l-.25-.148l-2.585.678l.69-2.523l-.162-.258c-.68-1.082-1.04-2.334-1.04-3.623c0-3.824 3.113-6.937 6.937-6.937c1.852 0 3.593.721 4.903 2.034a6.892 6.892 0 0 1 2.031 4.899c0 3.828-3.113 6.937-6.937 6.937m7.934-14.88a8.85 8.85 0 0 0-6.275-2.597c-4.887 0-8.865 3.979-8.865 8.868c0 1.556.406 3.076 1.18 4.417l-1.253 4.58l4.685-1.229c1.293.706 2.748 1.077 4.225 1.079h.004c4.886 0 8.867-3.979 8.867-8.868c0-2.368-.921-4.597-2.597-6.273" />
                  </svg>
                  Chat on WhatsApp
                </a>
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
