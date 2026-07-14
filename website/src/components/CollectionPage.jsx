// src/components/CollectionPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { catalogData, getProductColorImage } from './CatalogData';
import { useCart } from './CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// DB enum → human-readable category (mirrors CatalogData.js values)
const DB_CATEGORY_MAP = {
  APPAREL:          'Apparel',
  UNIFORM_WORKWEAR: 'Uniform & Workwear',
  SPORTSWEAR:       'Sportswear',
};

// Merge a single DB product with its CatalogData.js twin.
// Key: name + subCategory — handles the 6 names that repeat across categories.
function normalizeProduct(dbProduct) {
  const humanCategory = DB_CATEGORY_MAP[dbProduct.category] || dbProduct.category;
  const catalog = catalogData.find(
    (c) => c.name === dbProduct.name && c.subCategory === dbProduct.subCategory,
  );
  const standardColors = dbProduct.colors.map((c) => c.colorName);
  return {
    dbId:           dbProduct.id,    // real DB integer — stored in cart for checkout
    id:             dbProduct.id,
    name:           dbProduct.name,
    category:       humanCategory,
    subCategory:    dbProduct.subCategory,
    price:          `$${Number(dbProduct.priceUsd).toFixed(2)}`,
    priceUsd:       Number(dbProduct.priceUsd),
    standardColors: standardColors.length > 0
      ? standardColors
      : ['Navy Blue', 'Black', 'Burgundy', 'White', 'Grey'],
    colorImages:    catalog?.colorImages  || {},
    image:          catalog?.image        || `https://picsum.photos/seed/${encodeURIComponent(dbProduct.localImageName || dbProduct.name)}/400/300`,
    description:    catalog?.description  || '',
  };
}
// ─── URL param ↔ Category label lookup tables ─────────────────────────────────
// param value (URL)  →  data category string
const PARAM_TO_CATEGORY = {
  apparel:      'Apparel',
  uniforms:     'Uniform & Workwear',
  sportswear:   'Sportswear',
};
// data category string  →  param value (URL)
const CATEGORY_TO_PARAM = {
  'Apparel':            'apparel',
  'Uniform & Workwear': 'uniforms',
  'Sportswear':         'sportswear',
};

// ─── Sub-nav tab manifest ─────────────────────────────────────────────────────
const TABS = [
  { label: 'All Products',       param: null         },
  { label: 'Apparel',            param: 'apparel'    },
  { label: 'Uniform & Workwear', param: 'uniforms'   },
  { label: 'Sportswear',         param: 'sportswear' },
];

// ─── Color swatch hex map ─────────────────────────────────────────────────────
const COLOR_MAP = {
  'Navy Blue': '#1B2A4A', Black: '#0A0A0A', Charcoal: '#3B3B3B',
  'Forest Green': '#2D4A2D', Burgundy: '#5C1A2E', White: '#F5F5F5',
  'Grey Melange': '#8A8A8A', 'Sky Blue': '#5BACD1', 'Royal Blue': '#2244A8',
  'Bottle Green': '#1A4030', 'Heather Grey': '#9A9A9A', 'Olive Green': '#4A4A20',
  Olive: '#4A4A20', 'Cream White': '#FAF5E4', 'Slate Blue': '#4F6B8A',
  'Dark Red': '#7A1A1A', 'Stone Grey': '#8A8070', 'Light Blue': '#A8C8E0',
  'Pale Pink': '#F0C8C8', 'Sage Green': '#7A9A78', 'Mustard Yellow': '#C8A020',
  'Dusty Rose': '#C09090', 'Dark Olive': '#3A3A18', Oatmeal: '#D4C8B0',
  Stone: '#9A9080', Lavender: '#B8A8C8', Camel: '#C8963C',
  'Dusty Blue': '#7A9AAA', 'Safety Orange': '#E85820', 'Denim Blue': '#3B5F8A',
  Khaki: '#B8A060', Grey: '#7A7A7A', 'Dark Grey': '#4A4A4A',
  'Dark Navy': '#0A1428', Brown: '#7A4A28', 'Safety Yellow': '#E8D820',
  'Lime Green': '#7AC820', Red: '#C82020', 'Pink Hi-Vis': '#E870A0',
  'Midnight Blue': '#1A2040', Blue: '#2060C0', 'Pale Blue': '#B0D0E8',
  Teal: '#2A7A7A', 'Off-White': '#F0EDE0', 'Ivory White': '#FAF5E4',
  'Light Grey': '#C8C8C8', 'Ceil Blue': '#5A8AB0', 'Hunter Green': '#2A5A2A',
  Beige: '#D4C090', Sand: '#D4B870', 'Mid Grey': '#888888',
  'Dark Burgundy': '#4A0A1A', 'Striped Navy': '#1B2A4A', 'Dark Green': '#1A4A1A',
  'Vibrant Yellow': '#F0D000', 'Vibrant Green': '#20A020', Purple: '#702080',
  Gold: '#C8A020', Maroon: '#6A1020', 'Pinstripe White': '#F0F0F0',
  'Neon Yellow': '#E0F000', 'Neon Orange': '#F06000', 'Neon Green': '#40E040',
  'Electric Blue': '#2060F0', 'Blush Pink': '#F0B0B0', 'Soft Pink': '#F0C0C0',
  'Pale Lilac': '#C8B8D8',
};
const getSwatchColor = (name) => COLOR_MAP[name] || '#555555';

// ─── Card entrance animation ──────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Spring config for the sliding underline
const UNDERLINE_SPRING = { type: 'spring', stiffness: 380, damping: 34 };

// ─────────────────────────────────────────────────────────────────────────────
export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery]   = useState('');

  // ── Live products from DB ───────────────────────────────────────────────
  const [products,  setProducts]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch(`${API_BASE}/api/public/products`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const normalized = (json.data || []).map(normalizeProduct);
        setProducts(normalized.length > 0 ? normalized : catalogData);
      })
      .catch(() => {
        if (!cancelled) setProducts(catalogData); // graceful fallback
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Active category — derived purely from URL, never from local state
  const categoryParam   = searchParams.get('category'); // e.g. "apparel" | null
  const activeCategory  = categoryParam ? PARAM_TO_CATEGORY[categoryParam] : null;
  const activeTab       = categoryParam ?? null; // matches TABS[n].param

  // ── Set URL param on tab click ────────────────────────────────────────────
  function handleTabClick(param) {
    if (param === null) {
      setSearchParams({});
    } else {
      setSearchParams({ category: param });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Filtered product list ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let results = products; // ← live from DB (falls back to catalogData if API is down)

    // Category filter from URL
    if (activeCategory) {
      results = results.filter((p) => p.category === activeCategory);
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }
    return results;
  }, [activeCategory, searchQuery, products]);

  // ── Page title derived from active param ─────────────────────────────────
  const pageTitle = activeCategory ?? 'Full Collection Directory';
  const eyebrow   = activeCategory
    ? `${activeCategory.toUpperCase()} · MASTER SHOWROOM`
    : 'MASTER SHOWROOM';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="w-full" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh' }}>

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[9px] tracking-[0.38em] font-semibold mb-3"
             style={{ color: '#B87333' }}>
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-5xl font-extralight leading-tight"
              style={{ color: '#FAF7F2', letterSpacing: '0.02em' }}>
            {pageTitle}
          </h1>
          <div className="mt-4 w-10 h-px" style={{ backgroundColor: '#B87333', opacity: 0.65 }} />
          <p className="mt-4 text-xs font-light"
             style={{ color: '#FAF7F2', opacity: 0.38 }}>
            {filtered.length} items · bulk procurement &amp; corporate customization available
          </p>
        </motion.div>
      </section>

      {/* ── Sub-Navigation Filter Bar ─────────────────────────────────────── */}
      <div
        className="sticky top-[65px] z-20 w-full"
        style={{
          backgroundColor: 'rgba(20,20,20,0.96)',
          borderTop:    '1px solid rgba(184,115,51,0.08)',
          borderBottom: '1px solid rgba(184,115,51,0.13)',
          backdropFilter: 'blur(14px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center gap-0 sm:gap-0">

          {/* Category tabs */}
          <nav className="flex items-end gap-0 flex-wrap" aria-label="Collection categories">
            {TABS.map((tab) => {
              const isActive = tab.param === activeTab;
              return (
                <button
                  key={tab.param ?? '__all__'}
                  onClick={() => handleTabClick(tab.param)}
                  className="relative px-5 py-4 text-[10px] font-semibold tracking-[0.22em] uppercase transition-colors duration-200 shrink-0"
                  style={{
                    color:      isActive ? '#B87333' : 'rgba(250,247,242,0.5)',
                    background: 'transparent',
                    border:     'none',
                    cursor:     'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(250,247,242,0.9)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(250,247,242,0.5)';
                  }}
                >
                  {tab.label}

                  {/* Framer Motion sliding underline — shared layoutId slides between tabs */}
                  {isActive && (
                    <motion.span
                      layoutId="subnav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: '#B87333' }}
                      transition={UNDERLINE_SPRING}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search — right-aligned */}
          <div className="relative sm:ml-auto py-2 sm:py-0">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none select-none"
              style={{ color: '#B87333', opacity: 0.65, fontSize: '15px' }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 text-[11px] font-light outline-none w-52 transition-all duration-300"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border:          '1px solid rgba(184,115,51,0.2)',
                color:           '#FAF7F2',
                letterSpacing:   '0.05em',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor       = 'rgba(184,115,51,0.65)';
                e.currentTarget.style.backgroundColor   = 'rgba(255,255,255,0.06)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor       = 'rgba(184,115,51,0.2)';
                e.currentTarget.style.backgroundColor   = 'rgba(255,255,255,0.03)';
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState key="empty" query={searchQuery} />
          ) : (
            <motion.div
              key={activeTab ?? 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={`${product.id}-${product.category}`}
                  product={product}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Bottom Note ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-20">
        <div className="pt-8" style={{ borderTop: '1px solid rgba(184,115,51,0.1)' }}>
          <p className="text-[9px] tracking-[0.22em] font-light"
             style={{ color: '#FAF7F2', opacity: 0.2 }}>
            ALL PRICING IS PER UNIT AT MINIMUM ORDER QUANTITY &nbsp;·&nbsp; CUSTOM BRANDING AVAILABLE ACROSS ALL LINES
          </p>
        </div>
      </section>



    </main>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, index }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.standardColors[0]);
  const [addedFlash,    setAddedFlash]    = useState(false);
  const [showDesc,      setShowDesc]      = useState(false);

  function handleAddToCart() {
    addToCart(product, selectedColor);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  }

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative flex flex-col"
      style={{
        backgroundColor: '#111111',
        border: '1px solid rgba(184,115,51,0.1)',
      }}
    >
      {/* ── Aspect-ratio portrait image box ─────────────────────────────── */}
      <div
        className="aspect-[3/4] bg-[#1E1E1E] overflow-hidden relative flex items-center justify-center"
        style={{ border: '1px solid rgba(184,115,51,0.05)' }}
      >
        {/* Product thumbnail or placeholder */}
        {getProductColorImage(product, selectedColor) || product.image ? (
          <img
            src={getProductColorImage(product, selectedColor) || product.image}
            alt={`${product.name} - ${selectedColor}`}
            className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#121212]">
            <span className="text-[20px] mb-1.5 text-[#B87333]/40 font-mono">▧</span>
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#FAF7F2]/70 uppercase">
              {selectedColor}
            </span>
            <span className="text-[7.5px] tracking-[0.18em] font-light text-[#B87333]/80 uppercase mt-1">
              IMAGE COMING SOON
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(17,17,17,0.05) 50%, rgba(17,17,17,0.72) 100%)',
          }}
        />

        {/* Sub-category pill — bottom-left inside image */}
        <span
          className="absolute bottom-3 left-3 text-[8px] tracking-[0.22em] font-light px-2 py-0.5"
          style={{
            color:           '#FAF7F2',
            backgroundColor: 'rgba(17,17,17,0.82)',
            border:          '1px solid rgba(184,115,51,0.22)',
          }}
        >
          {product.subCategory.toUpperCase()}
        </span>

        {/* Premium badge — top-right */}
        <span
          className="absolute top-3 right-3 text-[7px] tracking-[0.2em] font-bold px-2 py-0.5"
          style={{
            color:           '#B87333',
            backgroundColor: 'rgba(17,17,17,0.78)',
            border:          '1px solid rgba(184,115,51,0.25)',
          }}
        >
          PREMIUM
        </span>
      </div>

      {/* ── Card body ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">

        {/* Product name */}
        <h2
          className="text-sm font-light leading-snug mb-1 tracking-wide"
          style={{ color: '#FAF7F2' }}
        >
          {product.name}
        </h2>

        {/* Price + unit */}
        <p className="text-sm font-light mb-3" style={{ color: '#B87333' }}>
          {product.price}
          <span className="text-[10px] ml-1 font-light" style={{ color: '#FAF7F2', opacity: 0.3 }}>
            / unit
          </span>
        </p>

        {/* ── Color finish selector ─────────────────────────────────────── */}
        <div className="mb-3">
          <p
            className="text-[8px] tracking-[0.25em] font-bold uppercase mb-2"
            style={{ color: '#FAF7F2', opacity: 0.38 }}
          >
            Color Finish
          </p>

          {/* Swatch circles */}
          <div className="flex flex-wrap gap-1.5">
            {product.standardColors.map((color) => {
              const isSel = selectedColor === color;
              return (
                <button
                  key={color}
                  title={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width:           '18px',
                    height:          '18px',
                    borderRadius:    '50%',
                    backgroundColor: getSwatchColor(color),
                    border:          isSel
                      ? '2px solid #B87333'
                      : '2px solid rgba(255,255,255,0.1)',
                    cursor:          'pointer',
                    transform:       isSel ? 'scale(1.3)' : 'scale(1)',
                    boxShadow:       isSel ? '0 0 0 2px rgba(184,115,51,0.3)' : 'none',
                    outline:         'none',
                    transition:      'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Selected color label */}
          <p
            className="mt-2 text-[9px] font-light tracking-wider"
            style={{ color: '#B87333', opacity: 0.8 }}
          >
            {selectedColor}
          </p>
        </div>

        {/* ── Add to Manifest CTA ───────────────────────────────────────── */}
        <div
          className="mt-auto pt-3"
          style={{ borderTop: '1px solid rgba(184,115,51,0.08)' }}
        >
          {/* Description toggle button — copper sweep + rotating + */}
          <motion.button
            onClick={() => setShowDesc((v) => !v)}
            whileTap={{ scale: 0.96 }}
            className="relative w-full text-[9px] uppercase tracking-[0.2em] font-semibold py-2 px-3 mb-2 flex items-center justify-between overflow-hidden"
            style={{
              color:  showDesc ? '#B87333' : 'rgba(250,247,242,0.5)',
              border: showDesc ? '1px solid rgba(184,115,51,0.35)' : '1px solid rgba(250,247,242,0.1)',
              cursor: 'pointer',
              background: 'transparent',
              transition: 'color 0.25s ease, border-color 0.25s ease',
            }}
          >
            {/* Sweeping copper fill — animates from left on open */}
            <motion.span
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(184,115,51,0.10)', transformOrigin: 'left center' }}
              initial={false}
              animate={{ scaleX: showDesc ? 1 : 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="relative z-10 tracking-widest">View Product Description</span>
            {/* + rotates to × */}
            <motion.span
              className="relative z-10 text-base leading-none font-thin"
              animate={{ rotate: showDesc ? 45 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: showDesc ? '#B87333' : 'rgba(250,247,242,0.4)', display: 'inline-block' }}
            >
              +
            </motion.span>
          </motion.button>

          {/* Animated description panel — height + blur reveal */}
          <AnimatePresence initial={false}>
            {showDesc && (
              <motion.div
                key="desc-panel"
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-2 px-3 py-2.5 text-[9px] leading-relaxed tracking-wide"
                  style={{
                    color:           'rgba(237,224,212,0.75)',
                    backgroundColor: 'rgba(10,8,6,0.82)',
                    border:          '1px solid rgba(184,115,51,0.14)',
                    borderTop:       'none',
                  }}
                >
                  {product.description || 'No description available.'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={handleAddToCart}
            whileHover={!addedFlash ? { backgroundColor: 'rgba(184,115,51,0.14)', borderColor: '#B87333' } : {}}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="w-full py-2.5 text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{
              backgroundColor: addedFlash ? '#B87333'              : 'transparent',
              color:           addedFlash ? '#1A1A1A'              : '#B87333',
              border:          addedFlash
                ? '1px solid #B87333'
                : '1px solid rgba(184,115,51,0.4)',
              cursor:          'pointer',
              transition:      'background-color 0.28s ease, color 0.28s ease, border-color 0.28s ease',
            }}
          >
            {addedFlash ? '✓ Added to Manifest' : 'Add to Manifest'}
          </motion.button>
        </div>
      </div>

      {/* ── Full-card gold border glow on hover ──────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: '1px solid rgba(184,115,51,0.38)' }}
      />
    </motion.article>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ query }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-40 text-center"
    >
      <div className="text-5xl font-extralight mb-6" style={{ color: '#B87333', opacity: 0.35 }}>
        ⊘
      </div>
      <p className="text-lg font-extralight mb-2" style={{ color: '#FAF7F2', opacity: 0.45 }}>
        No products matched
        {query ? (
          <span style={{ color: '#B87333' }}> "{query}"</span>
        ) : (
          ' this collection'
        )}
      </p>
      <p className="text-[9px] tracking-[0.25em] font-light" style={{ color: '#FAF7F2', opacity: 0.22 }}>
        ADJUST YOUR FILTER OR SEARCH TERM
      </p>
    </motion.div>
  );
}