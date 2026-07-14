import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// ─── Smooth navigate + scroll-to-top helper ────────────────────────────────────
// Encapsulated here so every link uses identical behaviour
function useFooterNav() {
  const navigate = useNavigate();
  return (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// ─── Shared link class ─────────────────────────────────────────────────────────
const linkCls =
  'text-[#FAF7F2]/60 hover:text-[#B87333] transition-colors duration-200 ' +
  'cursor-pointer text-xs font-light tracking-wide leading-relaxed';

// ─── Column data ───────────────────────────────────────────────────────────────
// route: null → external href, otherwise internal SPA path
const COLLECTIONS = [
  { label: 'Custom Apparel',           route: '/collection?category=apparel'    },
  { label: 'Uniform & Workwear',       route: '/collection?category=uniforms'   },
  { label: 'Sportswear & Activewear',  route: '/collection?category=sportswear' },
];

const PLATFORM = [
  { label: 'Master Showroom',  route: '/collection' },
  { label: 'Inquiry Cart',     route: '/checkout'   },
  { label: 'Download Catalog', href: '/assets/grey_textile_workwear_catalog.pdf', isDownload: true },
  { label: 'Home',             route: '/'           },
];

const CONNECT = [
  { label: 'WhatsApp Chat', href: 'https://wa.me/923152262430?text=Hi!%20I\'m%20interested%20in%20initiating%20a%20B2B%20apparel%20inquiry.' },
  { label: 'Email', href: 'mailto:info@greytextileandmerchendise.com' },
  { label: 'Instagram',    href: 'https://www.instagram.com/grey_textile?utm_source=qr&igsh=dWF4NmdyeGN1NXV2' },
  { label: 'LinkedIn',     href: 'https://www.linkedin.com/company/grey-textile-merchandise-pvt-ltd' }, 
];

// ─── Footer Component ────────────────────────────────────────────────────────
const Footer = () => {
  const go = useFooterNav();

  return (
    <footer
      style={{
        backgroundColor: '#1A1A1A',
        borderTop: '1px solid rgba(184,115,51,0.14)',
      }}
      className="pt-20 pb-10 text-[#FAF7F2]/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Trust Row: Factory Compliance & Certifications ────────────────── */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-16"
          style={{ borderBottom: '1px solid rgba(184,115,51,0.1)' }}
        >
          {[
            { name: 'WRAP COMPLIANT', desc: 'Social & Ethical Compliance' },
            { name: 'OEKO-TEX STANDARD 100', desc: 'Tested for Harmful Chemicals' },
            { name: 'ISO 9001:2015', desc: 'Quality Management Certified' },
            { name: 'SEDEX AUDITED', desc: 'Ethical Supply Chain standards' }
          ].map((cert) => (
            <div 
              key={cert.name} 
              className="flex flex-col items-start text-left p-4 rounded-sm border border-[#B87333]/10 bg-white/[0.01]"
              style={{ borderLeft: '2px solid #B87333' }}
            >
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FAF7F2]">
                {cert.name}
              </span>
              <span className="text-[8px] font-light tracking-wide text-[#FAF7F2]/40 mt-1 uppercase">
                {cert.desc}
              </span>
            </div>
          ))}
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">

          {/* ── Brand column (left, spans 4/12) ────────────────────────────── */}
          <div className="md:col-span-4">

            {/* Logo image */}
            <div className="mb-6">
              <img
                src={logo}
                alt="Gray Textile & Merchandising Logo"
                className="h-20 sm:h-24 w-auto object-contain mix-blend-lighten contrast-125 brightness-110 mb-6 block text-left"
              />
            </div>

            {/* Sub-description — updated copy */}
            <p className="text-xs font-light leading-relaxed max-w-xs tracking-wide"
               style={{ color: 'rgba(250,247,242,0.5)' }}>
              A company of Trade &amp; Freight Transit. Crafting premium apparel
              and bespoke merchandise that defines your brand.
            </p>

            {/* Gold rule */}
            <div
              className="mt-8 w-8 h-px"
              style={{ backgroundColor: '#B87333', opacity: 0.5 }}
            />

            {/* Contact micro-block */}
            <div className="mt-6 space-y-1">
              <p className="text-[9px] tracking-[0.25em] uppercase font-bold"
                 style={{ color: 'rgba(250,247,242,0.3)' }}>
                Global Logistics
              </p>
              <p className="font-mono text-[11px]" style={{ color: 'rgba(250,247,242,0.45)' }}>
                +92 336 666643  &nbsp;·&nbsp; +92 315 2262430
              </p>
            </div>
          </div>

          {/* ── Collections column (spans 2/12) ────────────────────────────── */}
          <div className="md:col-span-2">
            <h4 
              className="font-serif text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FAF7F2' }}
            >
              Collections
            </h4>
            <ul className="space-y-3">
              {COLLECTIONS.map(({ label, route }) => (
                <li key={label}>
                  <span
                    className={linkCls}
                    onClick={() => go(route)}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && go(route)}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Platform column (spans 2/12) ───────────────────────────────── */}
          <div className="md:col-span-2">
            <h4
              className="font-serif text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FAF7F2' }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM.map(({ label, route, href, isDownload }) => (
                <li key={label}>
                  {route ? (
                    <span
                      className={linkCls}
                      onClick={() => go(route)}
                      role="link"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && go(route)}
                    >
                      {label}
                    </span>
                  ) : (
                    <a
                      href={href}
                      download={isDownload ? true : undefined}
                      className={linkCls}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect column (spans 2/12) ────────────────────────────────── */}
          <div className="md:col-span-2">
            <h4
              className="font-serif text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FAF7F2' }}
            >
              Connect
            </h4>
            <ul className="space-y-3">
              {CONNECT.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={linkCls}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Location Map column (spans 2/12) ───────────────────────────── */}
          <div className="md:col-span-2 text-left">
            <h4
              className="font-serif text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FAF7F2' }}
            >
              Headquarters
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Office+C1/R3+1st+Floor+Al+Burhan+Circle+Block+E+North+Nazimabad+Karachi"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[11px] font-light leading-relaxed hover:text-[#B87333] transition-colors duration-200"
                style={{ color: 'rgba(250,247,242,0.5)' }}
              >
                Office C1/R3 1st Floor Al Burhan Circle Block E North Nazimabad, Karachi
              </a>
              <div className="rounded-lg overflow-hidden border border-[#B87333]/15 shadow-xl h-24 relative group cursor-pointer bg-[#161311]">
                <iframe
                  title="Google Maps Location"
                  src="https://maps.google.com/maps?q=Al%20Burhan%20Circle%20Block%20E%20North%20Nazimabad,%20Karachi&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Office+C1/R3+1st+Floor+Al+Burhan+Circle+Block+E+North+Nazimabad+Karachi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-[#1A1A1A]/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] font-bold text-[#B87333] tracking-widest"
                >
                  OPEN MAPS
                </a>
              </div>
            </div>
          </div>

        </div>


        {/* ── Bottom bar ─────────────────────────────────────────────────────── */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(184,115,51,0.1)' }}
        >
          {/* Copyright — updated copy */}
          <p
            className="text-[9px] tracking-[0.2em] uppercase font-light"
            style={{ color: 'rgba(250,247,242,0.3)' }}
          >
            &copy; 2026 GRAY TEXTILE &amp; MERCHANDISING. ALL RIGHTS RESERVED.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-[9px] tracking-[0.2em] uppercase font-light text-[#FAF7F2]/30 hover:text-[#B87333] transition-colors duration-200"
            >
              Privacy
            </a>
            <span style={{ color: 'rgba(184,115,51,0.3)', fontSize: '8px' }}>·</span>
            <a
              href="#"
              className="text-[9px] tracking-[0.2em] uppercase font-light text-[#FAF7F2]/30 hover:text-[#B87333] transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
