import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { catalogData, getProductColorImage, getFallbackApparelImage, GLOBAL_MOQ } from './CatalogData';
import { useCart } from './CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const DB_CATEGORY_MAP = {
  APPAREL:          'Apparel',
  UNIFORM_WORKWEAR: 'Uniform & Workwear',
  SPORTSWEAR:       'Sportswear',
};

function normalizeProduct(dbProduct) {
  const humanCategory = DB_CATEGORY_MAP[dbProduct.category] || dbProduct.category;
  const catalog = catalogData.find(
    (c) => c.name === dbProduct.name && c.subCategory === dbProduct.subCategory,
  );
  const standardColors = dbProduct.colors.map((c) => c.colorName);

  let finalImage = catalog?.image || dbProduct.image;
  if (!finalImage || finalImage.includes('picsum.photos')) {
    finalImage = getFallbackApparelImage(dbProduct.name);
  }

  return {
    dbId:           dbProduct.id,
    id:             dbProduct.id,
    name:           dbProduct.name,
    category:       humanCategory,
    subCategory:    dbProduct.subCategory,
    price:          `$${Number(dbProduct.priceUsd).toFixed(2)}`,
    priceUsd:       Number(dbProduct.priceUsd),
    standardColors: standardColors.length > 0
      ? standardColors
      : ['Navy Blue', 'Black', 'Burgundy', 'White', 'Grey'],
    colorImages:    catalog?.colorImages || {},
    image:          finalImage,
    description:    catalog?.description || '',
  };
}


// ─── Color swatch hex map (mirrors CollectionPage palette) ────────────────────
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
  'Dark Navy': '#0A1428', 'Safety Yellow': '#E8D820', 'Lime Green': '#7AC820',
  Red: '#C82020', 'Pink Hi-Vis': '#E870A0', 'Midnight Blue': '#1A2040',
  Blue: '#2060C0', 'Pale Blue': '#B0D0E8', Teal: '#2A7A7A',
  'Off-White': '#F0EDE0', 'Ivory White': '#FAF5E4', 'Light Grey': '#C8C8C8',
  'Ceil Blue': '#5A8AB0', 'Hunter Green': '#2A5A2A', Beige: '#D4C090',
  Sand: '#D4B870', 'Mid Grey': '#888888', 'Dark Burgundy': '#4A0A1A',
  'Striped Navy': '#1B2A4A', 'Dark Green': '#1A4A1A', 'Vibrant Yellow': '#F0D000',
  'Vibrant Green': '#20A020', Purple: '#702080', Gold: '#C8A020',
  Maroon: '#6A1020', 'Pinstripe White': '#F0F0F0', 'Neon Yellow': '#E0F000',
  'Neon Orange': '#F06000', 'Neon Green': '#40E040', 'Electric Blue': '#2060F0',
  'Blush Pink': '#F0B0B0', 'Soft Pink': '#F0C0C0', 'Pale Lilac': '#C8B8D8',
  'Brown Leather': '#7A4A28',
};
const getSwatchColor = (name) => COLOR_MAP[name] || '#555555';

// ─── Card entrance variant ────────────────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 22 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// MaterialPage — main component
// ─────────────────────────────────────────────────────────────────────────────
const MaterialPage = () => {
  const { materialType } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [materialType]);

  // ── Live products fetched from DB ────────────────────────────────────
  const [allProducts, setAllProducts] = useState(catalogData);
  const [isLoading, setIsLoading]     = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/public/products`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const normalized = (json.data || []).map(normalizeProduct);
        if (normalized.length > 0) setAllProducts(normalized);
      })
      .catch(() => { /* keep catalogData fallback */ })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── URL param → dataset category label ──────────────────────────────
  const getMappedCategory = (type) => {
    const lower = type.toLowerCase();
    if (lower === 'apparel') return 'Apparel';
    if (lower === 'uniforms' || lower === 'uniform-workwear') return 'Uniform & Workwear';
    if (lower === 'sportswear') return 'Sportswear';
    return type;
  };

  const targetCategory = getMappedCategory(materialType);

  const activeItems = allProducts.filter(
    (item) => item.category.toLowerCase() === targetCategory.toLowerCase()
  );

  const subCategoriesInCollection = [...new Set(activeItems.map((item) => item.subCategory))];

  return (
    <section className="min-h-screen py-32 px-6 text-left selection:bg-[#B87333]/30"
             style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Back link ─────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-[0.25em] font-bold transition-colors duration-200"
            style={{ color: '#B87333' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FAF7F2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#B87333'; }}
          >
            ← Return to Showroom
          </Link>
        </div>

        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div className="pb-6 mb-16" style={{ borderBottom: '1px solid rgba(184,115,51,0.15)' }}>
          <span
            className="text-[10px] font-semibold tracking-[0.35em] uppercase mb-2 block"
            style={{ color: '#B87333' }}
          >
            Manufacturing Line Index
          </span>
          <h1
            className="text-4xl font-serif tracking-wide capitalize"
            style={{ color: '#FAF7F2' }}
          >
            {targetCategory} Collection
          </h1>
          <div className="mt-4 w-10 h-px" style={{ backgroundColor: '#B87333', opacity: 0.5 }} />
          <p className="mt-3 text-xs font-light" style={{ color: '#FAF7F2', opacity: 0.35 }}>
            {activeItems.length} items &nbsp;·&nbsp; bulk procurement &amp; custom branding available
          </p>
        </div>

        {/* ── Sub-category sections ─────────────────────────────────────────── */}
        {subCategoriesInCollection.map((subCatName) => (
          <div key={subCatName} className="mb-20">
            {/* Sub-category label */}
            <h2
              className="text-xs tracking-[0.25em] uppercase font-bold mb-8 pl-4"
              style={{
                color: '#B87333',
                borderLeft: '2px solid #B87333',
              }}
            >
              {subCatName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeItems
                .filter((item) => item.subCategory === subCatName)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
            </div>
          </div>
        ))}

      </div>

    </section>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ProductCard — dark charcoal theme, aligned to CollectionPage
// ─────────────────────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const [selectedColor, setSelectedColor] = useState(
    product.standardColors?.length > 0 ? product.standardColors[0] : 'Standard'
  );
  const [addedFlash, setAddedFlash] = useState(false);

  function handleAddToCart() {
    addToCart(product, selectedColor);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1600);
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22 }}
      className="group relative flex flex-col min-h-[420px]"
      style={{
        backgroundColor: '#151515',
        border: '1px solid rgba(184,115,51,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(184,115,51,0.38)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(184,115,51,0.1)';
      }}
    >
      {/* ── Product image ───────────────────────────────────────────────────── */}
      {product.image && (
        <div
          className="relative overflow-hidden flex items-center justify-center"
          style={{ aspectRatio: '4/3', backgroundColor: '#1E1E1E', borderBottom: '1px solid rgba(184,115,51,0.06)' }}
        >
          {(() => {
            const colorImg = getProductColorImage(product, selectedColor);
            const hasColorImg = colorImg && !colorImg.includes('picsum.photos') && !colorImg.includes('unsplash.com');
            const hasDefaultImg = product.image && !product.image.includes('picsum.photos') && !product.image.includes('unsplash.com');
            
            if (hasColorImg || hasDefaultImg) {
              return (
                <img
                  src={hasColorImg ? colorImg : product.image}
                  alt={`${product.name} - ${selectedColor}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-90"
                  loading="lazy"
                />
              );
            }
            
            return (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#121212]">
                <span className="text-[20px] mb-1.5 text-[#B87333]/40 font-mono">▧</span>
                <span className="text-[10px] tracking-[0.25em] font-semibold text-[#FAF7F2]/70 uppercase">
                  {selectedColor}
                </span>
                <span className="text-[7.5px] tracking-[0.18em] font-light text-[#B87333]/80 uppercase mt-1">
                  IMAGE COMING SOON
                </span>
              </div>
            );
          })()}
          {/* Gradient vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(21,21,21,0.04) 50%, rgba(21,21,21,0.65) 100%)' }}
          />
          {/* Sub-category pill */}
          <span
            className="absolute bottom-3 left-3 text-[8px] tracking-[0.22em] font-light px-2 py-0.5"
            style={{
              color: '#FAF7F2',
              backgroundColor: 'rgba(17,17,17,0.82)',
              border: '1px solid rgba(184,115,51,0.22)',
            }}
          >
            {product.subCategory.toUpperCase()}
          </span>
          {/* Premium badge */}
          <span
            className="absolute top-3 right-3 text-[7px] tracking-[0.2em] font-bold px-2 py-0.5"
            style={{
              color: '#B87333',
              backgroundColor: 'rgba(17,17,17,0.78)',
              border: '1px solid rgba(184,115,51,0.25)',
            }}
          >
            PREMIUM
          </span>
        </div>
      )}

      {/* ── Card body ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">

        {/* Top meta bar */}
        <div className="flex justify-between items-baseline mb-2">
          <span
            className="text-[8px] tracking-[0.28em] font-bold uppercase"
            style={{ color: 'rgba(184,115,51,0.6)' }}
          >
            Premium Selection
          </span>
          <span
            className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5"
            style={{
              color: 'rgba(250,247,242,0.38)',
              backgroundColor: 'rgba(250,247,242,0.04)',
              border: '1px solid rgba(250,247,242,0.08)',
            }}
          >
            {selectedColor}
          </span>
        </div>

        {/* Product name */}
        <h3
          className="font-serif text-base tracking-wide mb-1 transition-colors duration-300"
          style={{ color: '#FAF7F2' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#B87333'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#FAF7F2'; }}
        >
          {product.name}
        </h3>

        {/* MOQ Tag */}
        <p className="text-[10px] font-mono tracking-wider mb-3" style={{ color: '#B87333' }}>
          MOQ: <span style={{ color: '#FAF7F2', opacity: 0.85 }}>{GLOBAL_MOQ} units</span>
        </p>

        {/* Description */}
        <p
          className="text-[11px] font-light leading-relaxed tracking-wide antialiased mb-4"
          style={{ color: 'rgba(250,247,242,0.45)' }}
        >
          Premium wholesale customizable {product.name.toLowerCase()} production layout
          tailored for commercial batch deployments.
        </p>

        {/* ── Color finish selector ──────────────────────────────────────────── */}
        <div className="mb-4">
          <span
            className="text-[8px] uppercase tracking-widest font-bold block mb-2"
            style={{ color: 'rgba(250,247,242,0.28)' }}
          >
            Configure Color Finish
          </span>

          {/* Swatch circles — match CollectionPage exactly */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.standardColors?.map((colorName) => {
              const isSel = selectedColor === colorName;
              return (
                <button
                  key={colorName}
                  type="button"
                  title={colorName}
                  onClick={() => setSelectedColor(colorName)}
                  style={{
                    width:           '18px',
                    height:          '18px',
                    borderRadius:    '50%',
                    backgroundColor: getSwatchColor(colorName),
                    border:          isSel
                      ? '2px solid #B87333'
                      : '2px solid rgba(255,255,255,0.1)',
                    cursor:    'pointer',
                    outline:   'none',
                    transform: isSel ? 'scale(1.3)' : 'scale(1)',
                    boxShadow: isSel ? '0 0 0 2px rgba(184,115,51,0.3)' : 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Selected color label */}
          <p className="text-[9px] font-light tracking-wider" style={{ color: '#B87333', opacity: 0.8 }}>
            {selectedColor}
          </p>
        </div>

        {/* ── CTA buttons ───────────────────────────────────────────────────── */}
        <div
          className="mt-auto pt-4 flex flex-col gap-2"
          style={{ borderTop: '1px solid rgba(184,115,51,0.08)' }}
        >


          {/* Add to Batch Order */}
          <motion.button
            type="button"
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
              cursor:     'pointer',
              transition: 'background-color 0.28s ease, color 0.28s ease, border-color 0.28s ease',
            }}
          >
            {addedFlash ? '✓ Added to Manifest' : 'Add to Batch Order'}
          </motion.button>
        </div>
      </div>

      {/* Gold border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: '1px solid rgba(184,115,51,0.38)' }}
      />
    </motion.div>
  );
};

export default MaterialPage;
