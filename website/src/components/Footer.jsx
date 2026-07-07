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
  { label: 'Corporate Uniforms',       route: '/collection?category=uniforms'   },
  { label: 'Custom Hoodies & Apparel', route: '/collection?category=apparel'    },
  { label: 'Healthcare Scrubs',        route: '/collection?category=uniforms'   },
  { label: 'Bespoke Accessories',      route: '/collection?category=accessories'},
];

const PLATFORM = [
  { label: 'Master Showroom',  route: '/collection' },
  { label: 'Batch Checkout',   route: '/checkout'   },
  { label: 'Home',             route: '/'           },
];

const CONNECT = [
  { label: 'Email', href: 'mailto:info@greytextileandmerchendise.com' },
  { label: 'Website',      href: 'greytextileandmerchendise.com'  },
  { label: 'Instagram',                       href: '#'                                        },
  { label: 'LinkedIn',                        href: '#'                                        },
];

// ─────────────────────────────────────────────────────────────────────────────
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

        {/* ── Main grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* ── Brand column (left, spans 5/12) ────────────────────────────── */}
          <div className="md:col-span-5">

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

          {/* ── Collections column ──────────────────────────────────────────── */}
          <div className="md:col-span-3">
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

          {/* ── Platform column ────────────────────────────────────────────── */}
          <div className="md:col-span-2">
            <h4
              className="font-serif text-[9px] tracking-[0.3em] uppercase mb-6"
              style={{ color: '#FAF7F2' }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {PLATFORM.map(({ label, route }) => (
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

          {/* ── Connect column ─────────────────────────────────────────────── */}
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
