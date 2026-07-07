// src/components/TryOnModal.jsx
// ─────────────────────────────────────────────────────────────────────────────
//  Virtual Matrix Try-On — Female / Male Croquis Toggle Edition
//  This version adds a toggle to switch between female and male croquis models.
//  The selected croquis serves as a static background layer inside the preview.
//  Garment overlays, leader lines, and annotation markers align correctly.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { getProductColorImage } from './CatalogData';

// ─── CSS INJECTION ─────────────────────────────────────────────────────────────
;(function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('tryon-sys-styles')) return;
  const s = document.createElement('style');
  s.id = 'tryon-sys-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    @keyframes marchingAnts { to { stroke-dashoffset: -24; } }
    .tryon-marching { stroke-dasharray: 4 8; animation: marchingAnts 1.2s linear infinite; }
    @media (max-width: 768px) {
      .tryon-modal-grid { grid-template-columns: 1fr !important; }
      .tryon-right-panel { display: none !important; }
    }
  `;
  document.head.appendChild(s);
})();

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const MONO = "'IBM Plex Mono', 'Courier New', monospace";
const C = {
  orange:       '#B87333',
  orangeDim:    'rgba(184,115,51,0.42)',
  orangeGhost:  'rgba(184,115,51,0.10)',
  orangeBorder: 'rgba(184,115,51,0.18)',
  surface:      '#0E0E0E',
  surfacePanel: '#111111',
  textBright:   '#FAF7F2',
  textDim:      'rgba(250,247,242,0.35)',
  textGhost:    'rgba(250,247,242,0.10)',
  gridLine:     'rgba(184,115,51,0.035)',
  gridMajor:    'rgba(184,115,51,0.07)',
};

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const BUILD_PROFILES = [
  { key: 'slim',    label: 'SLIM'    },
  { key: 'regular', label: 'REGULAR' },
  { key: 'relaxed', label: 'RELAXED' },
];

const SIZE_CHARTS = {
  APPAREL: {
    XS: {chest:34,height:66}, S: {chest:37,height:68}, M: {chest:40,height:70},
    L: {chest:43,height:71},  XL: {chest:46,height:72}, '2XL': {chest:49,height:72}, '3XL': {chest:52,height:72},
  },
  UNIFORM_WORKWEAR: {
    XS: {chest:36,height:66}, S: {chest:39,height:68}, M: {chest:42,height:70},
    L: {chest:45,height:71},  XL: {chest:48,height:72}, '2XL': {chest:51,height:72}, '3XL': {chest:54,height:73},
  },
  SPORTSWEAR: {
    XS: {chest:33,height:66}, S: {chest:36,height:68}, M: {chest:39,height:70},
    L: {chest:42,height:71},  XL: {chest:45,height:72}, '2XL': {chest:48,height:72}, '3XL': {chest:51,height:72},
  },
};

function getSizeChart(category = '') {
  const c = category.toLowerCase();
  if (c.includes('uniform') || c.includes('workwear')) return SIZE_CHARTS.UNIFORM_WORKWEAR;
  if (c.includes('sport'))                              return SIZE_CHARTS.SPORTSWEAR;
  return SIZE_CHARTS.APPAREL;
}

const COLOR_MAP = {
  'Navy Blue':'#1B2A4A',Black:'#0A0A0A',Charcoal:'#3B3B3B','Forest Green':'#2D4A2D',
  Burgundy:'#5C1A2E',White:'#F5F5F5','Grey Melange':'#8A8A8A','Sky Blue':'#5BACD1',
  'Royal Blue':'#2244A8','Bottle Green':'#1A4030','Heather Grey':'#9A9A9A','Olive Green':'#4A4A20',
  Olive:'#4A4A20','Cream White':'#FAF5E4','Slate Blue':'#4F6B8A','Dark Red':'#7A1A1A',
  'Stone Grey':'#8A8070','Light Blue':'#A8C8E0','Pale Pink':'#F0C8C8','Sage Green':'#7A9A78',
  'Mustard Yellow':'#C8A020','Dusty Rose':'#C09090','Dark Olive':'#3A3A18',Oatmeal:'#D4C8B0',
  Stone:'#9A9080',Lavender:'#B8A8C8',Camel:'#C8963C','Dusty Blue':'#7A9AAA',
  'Safety Orange':'#E85820','Denim Blue':'#3B5F8A',Khaki:'#B8A060',Grey:'#7A7A7A',
  'Dark Grey':'#4A4A4A','Dark Navy':'#0A1428','Safety Yellow':'#E8D820','Lime Green':'#7AC820',
  Red:'#C82020','Pink Hi-Vis':'#E870A0','Midnight Blue':'#1A2040',Blue:'#2060C0',
  'Pale Blue':'#B0D0E8',Teal:'#2A7A7A','Off-White':'#F0EDE0','Ivory White':'#FAF5E4',
  'Light Grey':'#C8C8C8','Ceil Blue':'#5A8AB0','Hunter Green':'#2A5A2A',Beige:'#D4C090',
  Sand:'#D4B870','Mid Grey':'#888888','Dark Burgundy':'#4A0A1A','Striped Navy':'#1B2A4A',
  'Dark Green':'#1A4A1A','Vibrant Yellow':'#F0D000','Vibrant Green':'#20A020',Purple:'#702080',
  Gold:'#C8A020',Maroon:'#6A1020','Pinstripe White':'#F0F0F0','Neon Yellow':'#E0F000',
  'Neon Orange':'#F06000','Neon Green':'#40E040','Electric Blue':'#2060F0','Blush Pink':'#F0B0B0',
  'Soft Pink':'#F0C0C0','Pale Lilac':'#C8B8D8','Brown Leather':'#7A4A28','Classic White':'#F5F5F5',
  'Vibrant Red':'#C82020','Pure White':'#F5F5F5','Jet Black':'#0A0A0A',
};
const getSwatchColor = (n) => COLOR_MAP[n] || '#555555';

// ─── UTILITIES ─────────────────────────────────────────────────────────────────
function getSizeRec(chest, profile) {
  const offset = profile==='slim' ? -1 : profile==='relaxed' ? 1 : 0;
  const adj = chest + offset;
  if (adj <= 35) return 'XS'; if (adj <= 37) return 'S';
  if (adj <= 40) return 'M';  if (adj <= 43) return 'L';
  if (adj <= 47) return 'XL'; if (adj <= 50) return '2XL';
  return '3XL';
}
const fmtHeight = (h) => `${Math.floor(h/12)}′${h%12}″`;
function getCategoryBucket(cat='') {
  const c = cat.toLowerCase();
  if (c.includes('sport')) return 'sportswear';
  if (c.includes('uniform') || c.includes('workwear')) return 'workwear';
  return 'apparel';
}

// ─── PARAMETERIZED COORDINATE SYSTEM ──────────────────────────────────────────
function computePts(chest, height) {
  const BASE_CHEST = 40, BASE_HEIGHT = 70;
  const sx = chest / BASE_CHEST;
  const sy = height / BASE_HEIGHT;
  const CX = 100, CT = 80;

  const neckL = CX - 13 * sx;
  const neckR = CX + 13 * sx;
  const collarDeepY = CT + 19 * sy;

  const shldL = CX - 56 * sx;
  const shldR = CX + 56 * sx;
  const shldY = CT + 32 * sy;

  const hemL = CX - 45 * sx;
  const hemR = CX + 45 * sx;
  const hemY = CT + 164 * sy;

  const chestY = CT + 75 * sy;
  const waistL = CX - 36 * sx;
  const waistR = CX + 36 * sx;
  const waistY = CT + 92 * sy;

  return {
    sx, sy, CX, CT,
    neckL, neckR, collarDeepY,
    shldL, shldR, shldY,
    hemL, hemR, hemY,
    chestY, waistL, waistR, waistY
  };
}

// Replaced sleeves with natural tech-pack curves mapping croquis proportions
function buildApparelClipPath(pts) {
  const f = n => n.toFixed(1);
  const mx = x => (200 - x).toFixed(1);
  const {sx,sy,CX,CT,
    neckL,neckR,collarDeepY,shldL,shldR,shldY,hemL,hemR,hemY,chestY
  } = pts;

  // Real sleeve shape (straight taper, no balloon bulge)
  const bicepX = CX + 72 * sx;
  const bicepY = CT + 78 * sy;
  const cuffX  = CX + 66 * sx;
  const cuffY  = CT + 120 * sy;
  const wristX = CX + 56 * sx;
  const wristY = CT + 120 * sy;
  const pitX   = CX + 38 * sx;
  const pitY   = CT + 74 * sy;

  return [
    `M ${f(neckL)} ${f(CT)}`,
    `C ${f(CX-10*sx)} ${f(CT+6*sy)} ${f(CX-4*sx)} ${f(CT+16*sy)} ${f(CX)} ${f(collarDeepY)}`,
    `C ${f(CX+4*sx)} ${f(CT+16*sy)} ${f(CX+10*sx)} ${f(CT+6*sy)} ${f(neckR)} ${f(CT)}`,
    `L ${f(shldR)} ${f(shldY)}`,
    // Straight sleeve outer
    `L ${f(bicepX)} ${f(bicepY)}`,
    `L ${f(cuffX)} ${f(cuffY)}`,
    // Cuff line
    `L ${f(wristX)} ${f(wristY)}`,
    // Underarm sleeve seam
    `L ${f(pitX)} ${f(pitY)}`,
    // Right side body to hem
    `L ${f(hemR)} ${f(hemY)}`,
    // Hem line
    `L ${f(hemL)} ${f(hemY)}`,
    // Left side body to armpit
    `L ${mx(pitX)} ${f(pitY)}`,
    // Left sleeve inner
    `L ${mx(wristX)} ${f(wristY)}`,
    // Left cuff
    `L ${mx(cuffX)} ${f(cuffY)}`,
    // Left sleeve outer
    `L ${mx(bicepX)} ${f(bicepY)}`,
    // Left shoulder seam
    `L ${f(shldL)} ${f(shldY)}`,
    `L ${f(neckL)} ${f(CT)}`, 'Z',
  ].join(' ');
}

function buildScaledClipPath(bucket, chest, height) {
  const sw = chest / 40, sh = height / 70;
  const sp = (x, y) => `${(100+(x-100)*sw).toFixed(1)} ${(80+(y-80)*sh).toFixed(1)}`;
  if (bucket === 'sportswear') {
    return `M ${sp(110,78)} L ${sp(156,112)} Q ${sp(162,122)} ${sp(158,140)} L ${sp(144,185)} L ${sp(138,200)} L ${sp(132,265)} Q ${sp(116,270)} ${sp(100,265)} Q ${sp(84,270)} ${sp(68,265)} L ${sp(62,200)} L ${sp(56,185)} Q ${sp(38,122)} ${sp(44,112)} L ${sp(90,78)} Q ${sp(100,96)} ${sp(110,78)} Z`;
  }
  if (bucket === 'workwear') {
    return `M ${sp(112,74)} L ${sp(160,114)} C ${sp(168,135)} ${sp(176,155)} ${sp(178,180)} Q ${sp(170,188)} ${sp(162,182)} L ${sp(152,185)} L ${sp(140,280)} Q ${sp(112,290)} ${sp(60,280)} L ${sp(52,185)} L ${sp(48,182)} Q ${sp(30,188)} ${sp(22,180)} C ${sp(24,155)} ${sp(32,135)} ${sp(40,114)} L ${sp(88,74)} Q ${sp(100,88)} ${sp(112,74)} Z`;
  }
  return '';
}

function buildZones(bucket, chest, height, profile) {
  const pts = computePts(chest, height);
  const f = n => n.toFixed(1);
  const ease = profile==='slim' ? 0.92 : profile==='relaxed' ? 1.08 : 1.0;

  const shoulderW = +(chest * 0.42 * ease).toFixed(1);
  const waistCirc = +(chest * 0.86).toFixed(1);
  const sleeveLen = +(height/12 * 3.8 + chest * 0.015).toFixed(1);
  const bodyLen   = +(height/12 * 3.85).toFixed(1);
  const neckW     = +(chest * 0.375).toFixed(1);

  if (bucket === 'apparel') {
    const { sx, CT, neckL, neckR, shldL, shldR, shldY,
      waistL, waistR, waistY, hemL, hemR, hemY, chestY } = pts;

    const bodyRatChest = shldR + (hemR - shldR) * (chestY - shldY) / (hemY - shldY);

    return [
      {
        id: 'neck', label: 'NECK WIDTH', value: `${neckW}"`,
        anchor: [neckL, CT],
        hotspot: [neckL-2, CT-12, neckR-neckL+4, 24],
        leaderPaths: [
          { d: `M ${f(neckL)},${f(CT)} L -60,${f(CT)}`, main:true },
          { d: `M ${f(neckL)},${f(CT)} L ${f(neckL)},${f(CT+16)}`, tick:true },
          { d: `M ${f(neckR)},${f(CT)} L ${f(neckR)},${f(CT+16)}`, tick:true },
          { d: `M ${f(neckL)},${f(CT)} L ${f(neckR)},${f(CT)}` },
        ],
        labelPos: [-64, CT+3], labelAnchor: 'end',
      },
      {
        id: 'shoulder', label: 'SHOULDER WIDTH', value: `${shoulderW}"`,
        anchor: [100, shldY],
        hotspot: [shldL-4, shldY-14, shldR-shldL+8, 28],
        leaderPaths: [
          { d: `M ${f(shldL)},${f(shldY)} L ${f(shldR)},${f(shldY)}`, main:true },
          { d: `M ${f(shldR)},${f(shldY)} L 228,${f(shldY)}` },
          { d: `M ${f(shldL)},${f(shldY)} L ${f(shldL)},${f(shldY-9)}`, tick:true },
          { d: `M ${f(shldR)},${f(shldY)} L ${f(shldR)},${f(shldY-9)}`, tick:true },
        ],
        labelPos: [232, shldY+3], labelAnchor: 'start',
      },
      {
        id: 'chest', label: 'CHEST CIRC.', value: `${chest}.0"`,
        anchor: [bodyRatChest, chestY],
        hotspot: [100-46*sx, chestY-16, 92*sx, 32],
        leaderPaths: [
          { d: `M ${f(bodyRatChest)},${f(chestY)} L 228,${f(chestY)}`, main:true },
          { d: `M ${f(100-46*sx)},${f(chestY-8)} L ${f(bodyRatChest)},${f(chestY-8)}`, dashed:true },
          { d: `M ${f(100-46*sx)},${f(chestY-8)} L ${f(100-46*sx)},${f(chestY+8)}`, tick:true },
          { d: `M ${f(bodyRatChest)},${f(chestY-8)} L ${f(bodyRatChest)},${f(chestY+8)}`, tick:true },
        ],
        labelPos: [232, chestY+3], labelAnchor: 'start',
      },
      {
        id: 'waist', label: 'WAIST CIRC.', value: `${waistCirc}"`,
        anchor: [waistL, waistY],
        hotspot: [waistL-4, waistY-12, waistR-waistL+8, 26],
        leaderPaths: [
          { d: `M ${f(waistL)},${f(waistY)} L -60,${f(waistY)}`, main:true },
          { d: `M ${f(waistL)},${f(waistY-8)} L ${f(waistR)},${f(waistY-8)}`, dashed:true },
          { d: `M ${f(waistL)},${f(waistY-8)} L ${f(waistL)},${f(waistY+8)}`, tick:true },
          { d: `M ${f(waistR)},${f(waistY-8)} L ${f(waistR)},${f(waistY+8)}`, tick:true },
        ],
        labelPos: [-64, waistY+3], labelAnchor: 'end',
      },
      {
        id: 'body-length', label: 'BODY LENGTH', value: `${bodyLen}"`,
        anchor: [248, (shldY+hemY)/2],
        hotspot: [100-28*sx, shldY-8, 56*sx, hemY-shldY+16],
        leaderPaths: [
          { d: `M 248,${f(shldY)} L 248,${f(hemY)}`, main:true },
          { d: `M ${f(shldR)},${f(shldY)} L 248,${f(shldY)}`, dashed:true },
          { d: `M ${f(hemR)},${f(hemY)} L 248,${f(hemY)}`, dashed:true },
          { d: `M 242,${f(shldY)} L 254,${f(shldY)}`, tick:true },
          { d: `M 242,${f(hemY)} L 254,${f(hemY)}`, tick:true },
        ],
        labelPos: [252, (shldY+hemY)/2], labelAnchor: 'start', rotate: -90,
      },
    ];
  }

  return [
    {
      id: 'chest', label: 'CHEST CIRC.', value: `${chest}.0"`,
      anchor: [148,155], hotspot: [50,130,100,32],
      leaderPaths: [
        { d:'M 148,155 L 228,155', main:true },
        { d:'M 52,148 L 148,148', dashed:true },
        { d:'M 52,148 L 52,162', tick:true },
        { d:'M 148,148 L 148,162', tick:true },
      ],
      labelPos: [232,158], labelAnchor: 'start',
    },
    {
      id: 'body-length', label: 'BODY LENGTH', value: `${bodyLen}"`,
      anchor: [248,172], hotspot: [100,110,56,134],
      leaderPaths: [
        { d:'M 248,80 L 248,264', main:true },
        { d:'M 242,80 L 254,80', tick:true },
        { d:'M 242,264 L 254,264', tick:true },
      ],
      labelPos: [252,175], labelAnchor: 'start', rotate: -90,
    },
  ];
}

function CrossSection({ chest }) {
  const rings = [34,36,38,40,42,44,46,48,50,52];
  const getRx = c => 14 + ((c-34)/18) * 38;
  return (
    <svg viewBox="0 0 160 128" width="100%" style={{overflow:'visible'}}>
      <text x="80" y="10" textAnchor="middle" fontSize="5" fontFamily={MONO} fill={C.textDim} letterSpacing="0.4">DORSAL PLANE · Y=155</text>
      {rings.map(c => (
        <ellipse key={c} cx="80" cy="72" rx={getRx(c)} ry={getRx(c)*0.52} fill="none"
          stroke={Math.abs(c-chest)<1.5 ? C.orange : C.orangeGhost}
          strokeWidth={Math.abs(c-chest)<1.5 ? 1.5 : 0.5}
          opacity={Math.abs(c-chest)<1.5 ? 1 : 0.55} />
      ))}
      <line x1="80" y1="28" x2="80" y2="116" stroke={C.orangeGhost} strokeWidth="0.5" strokeDasharray="2 5" />
      <line x1="32" y1="72" x2="128" y2="72" stroke={C.orangeGhost} strokeWidth="0.5" strokeDasharray="2 5" />
      <circle cx="80" cy="72" r="2" fill={C.orange} opacity="0.7" />
      <text x="80" y="120" textAnchor="middle" fontSize="6.5" fontFamily={MONO} fill={C.orange} fontWeight="600" letterSpacing="0.3">{chest}.0" CHEST</text>
    </svg>
  );
}

function BiometricSlider({ label, value, min, max, display, onChange }) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div style={{marginBottom:18}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
        <span style={{fontFamily:MONO,fontSize:7.5,letterSpacing:'0.26em',color:C.textDim,textTransform:'uppercase'}}>{label}</span>
        <span style={{fontFamily:MONO,fontSize:11,color:C.orange,fontWeight:600}}>{display}</span>
      </div>
      <div style={{position:'relative',height:2,background:C.orangeGhost}}>
        <div style={{position:'absolute',left:0,top:0,height:'100%',width:`${pct}%`,background:C.orange,transition:'width 0.12s ease'}}/>
      </div>
      <input type="range" min={min} max={max} step={1} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{width:'100%',marginTop:-2,height:2,opacity:0,cursor:'pointer',position:'relative',zIndex:10}}/>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:3}}>
        <span style={{fontFamily:MONO,fontSize:7,color:C.textGhost}}>{min}</span>
        <span style={{fontFamily:MONO,fontSize:7,color:C.textGhost}}>{max}</span>
      </div>
    </div>
  );
}

function ManifestRow({ label, value, isActive, onHover, onLeave }) {
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} style={{
      display:'flex',justifyContent:'space-between',alignItems:'center',
      padding:'5px 8px',
      borderLeft:`2px solid ${isActive ? C.orange : 'transparent'}`,
      background: isActive ? 'rgba(184,115,51,0.07)' : 'transparent',
      cursor: onHover ? 'crosshair' : 'default',
      transition:'all 0.18s ease',marginBottom:2,
    }}>
      <span style={{fontFamily:MONO,fontSize:7.5,color:C.textDim,letterSpacing:'0.18em',textTransform:'uppercase'}}>{label}</span>
      <span style={{fontFamily:MONO,fontSize:9,color:isActive?C.orange:C.textBright,fontWeight:isActive?600:400,transition:'color 0.18s ease'}}>{value}</span>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{margin:'14px 0 10px'}}>
      {label && <p style={{fontFamily:MONO,fontSize:6.5,color:C.textGhost,letterSpacing:'0.42em',textTransform:'uppercase',marginBottom:8,paddingLeft:8}}>{label}</p>}
      <div style={{height:1,background:C.orangeBorder}}/>
    </div>
  );
}

// ─── PUBLIC EXPORT ─────────────────────────────────────────────────────────────
export default function TryOnModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;
  return <TryOnModalInner onClose={onClose} product={product} />;
}

// ─── INNER COMPONENT ──────────────────────────────────────────────────────────
function TryOnModalInner({ onClose, product }) {
  const { addToCart } = useCart();

  const bucket    = getCategoryBucket(product.category);
  const sizeChart = getSizeChart(product.category);

  const [chest,        setChest]        = useState(sizeChart['M'].chest);
  const [height,       setHeight]       = useState(sizeChart['M'].height);
  const [buildProfile, setBuildProfile] = useState('regular');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(product.standardColors?.[0] ?? 'Standard');
  const [activeZone,   setActiveZone]   = useState(null);
  const [appended,     setAppended]     = useState(false);
  const [scanY,        setScanY]        = useState(0);

  // Toggle for croquis background image layers
  const [genderModel,  setGenderModel]  = useState('male');

  const displayImage = getProductColorImage(product, selectedColor) ?? product.image;
  const hasColorImage = !!getProductColorImage(product, selectedColor);

  const sizeRec = getSizeRec(chest, buildProfile);
  const zones   = buildZones(bucket, chest, height, buildProfile);

  const clipPathData = bucket === 'apparel'
    ? buildApparelClipPath(computePts(chest, height))
    : buildScaledClipPath(bucket, chest, height);

  function handleSizeSelect(size) {
    const { chest: c, height: h } = sizeChart[size];
    setChest(c); setHeight(h); setSelectedSize(size);
  }

  useEffect(() => {
    let frame; let y = 0;
    const tick = () => { y = (y+0.45) % 310; setScanY(y); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const h = e => { if (e.key==='Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  function handleAppend() {
    addToCart({...product, specs:{chest,height:fmtHeight(height),buildProfile,sizeRec,selectedColor}}, selectedColor);
    setAppended(true);
    setTimeout(() => { setAppended(false); onClose(); }, 1600);
  }

  const backdropV = {
    hidden:{opacity:0}, visible:{opacity:1,transition:{duration:0.22,ease:'linear'}},
    exit:{opacity:0,transition:{duration:0.18}},
  };
  const modalV = {
    hidden:{opacity:0,scale:0.97,y:14},
    visible:{opacity:1,scale:1,y:0,transition:{delay:0.18,duration:0.38,ease:[0.16,1,0.3,1]}},
    exit:{opacity:0,scale:0.97,y:14,transition:{duration:0.18}},
  };

  // Convert absolute image local path references to standard relative paths.
  // Female template path: /croquis-female.png  (relative to Vite's local dev build server)
  const getCroquisSrc = () => {
    // If local files are blocked, we use direct hosted reference URLs inside Vite to prevent local load exceptions
    return genderModel === 'female' ? '/croquis-female.png' : '/croquis-male.png';
  };

  return (
    <AnimatePresence>
      <motion.div key="tryon-backdrop" variants={backdropV} initial="hidden" animate="visible" exit="exit"
        onClick={onClose}
        style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,backgroundColor:'rgba(6,6,6,0.92)',backdropFilter:'blur(14px)'}}>

        <motion.div key="tryon-modal" className="tryon-modal-grid"
          variants={modalV} initial="hidden" animate="visible" exit="exit"
          onClick={e => e.stopPropagation()}
          style={{width:'100%',maxWidth:980,display:'grid',gridTemplateColumns:'minmax(0,244px) 1fr minmax(0,192px)',backgroundColor:C.surface,border:`1px solid ${C.orangeBorder}`,maxHeight:'94vh',overflow:'hidden',position:'relative'}}>

          <motion.button onClick={onClose} whileHover={{color:C.orange}}
            style={{position:'absolute',top:14,right:18,zIndex:30,fontFamily:MONO,fontSize:8,letterSpacing:'0.3em',color:C.textDim,background:'none',border:'none',cursor:'pointer',textTransform:'uppercase',transition:'color 0.15s'}}>
            [✕] CLOSE
          </motion.button>

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:0.86,duration:0.3,ease:'easeOut'}}
            style={{borderRight:`1px solid ${C.orangeBorder}`,backgroundColor:C.surfacePanel,padding:'28px 18px 24px',display:'flex',flexDirection:'column',overflowY:'auto',maxHeight:'94vh'}}>

            <p style={{fontFamily:MONO,fontSize:6.5,color:C.orange,letterSpacing:'0.38em',textTransform:'uppercase',marginBottom:7,opacity:0.75}}>GTN // BODY MATRIX</p>
            <h2 style={{fontFamily:MONO,fontSize:11,color:C.textBright,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:4,fontWeight:500}}>{product.name}</h2>
            <p style={{fontFamily:MONO,fontSize:7.5,color:C.textDim,letterSpacing:'0.08em',marginBottom:0}}>{product.category}&nbsp;·&nbsp;{product.subCategory}</p>

            <Divider label="MODEL GENDER" />
            <div style={{display:'flex',gap:4,marginBottom:4}}>
              {['male', 'female'].map(gender => {
                const active = genderModel === gender;
                return (
                  <motion.button key={gender} onClick={() => setGenderModel(gender)}
                    whileHover={!active?{borderColor:C.orange,color:C.textBright}:{}} whileTap={{scale:0.95}}
                    style={{
                      flex:1, padding:'6px 0',
                      fontFamily:MONO, fontSize:7.5, letterSpacing:'0.14em',
                      textTransform:'uppercase', cursor:'pointer',
                      backgroundColor: active ? C.orange : 'transparent',
                      color: active ? C.surface : C.textDim,
                      border: `1px solid ${active ? C.orange : C.orangeBorder}`,
                      transition:'all 0.15s ease'
                    }}>
                    {gender}
                  </motion.button>
                );
              })}
            </div>

            <Divider label="SIZE SELECTION" />
            <p style={{fontFamily:MONO,fontSize:7,color:C.textDim,letterSpacing:'0.12em',marginBottom:8,paddingLeft:8}}>{product.category.toUpperCase()} FIT CHART</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:6}}>
              {Object.keys(sizeChart).map(size => {
                const active = selectedSize === size;
                return (
                  <motion.button key={size} onClick={() => handleSizeSelect(size)}
                    whileHover={!active?{borderColor:C.orange,color:C.textBright}:{}} whileTap={{scale:0.93}}
                    style={{padding:'4px 9px',fontFamily:MONO,fontSize:8,letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',backgroundColor:active?C.orange:'transparent',color:active?C.surface:C.textDim,border:`1px solid ${active?C.orange:C.orangeBorder}`,fontWeight:active?600:400,transition:'all 0.15s ease'}}>
                    {size}
                  </motion.button>
                );
              })}
            </div>
            {selectedSize === null && (
              <p style={{fontFamily:MONO,fontSize:6.5,color:C.textDim,letterSpacing:'0.12em',paddingLeft:8,marginBottom:4,fontStyle:'italic'}}>fine-tuning · computed {sizeRec}</p>
            )}

            <Divider label="BIOMETRIC CALIBRATION" />
            <BiometricSlider label="CHEST CIRCUMFERENCE" value={chest} min={30} max={58} display={`${chest}"`}
              onChange={v => { setChest(v); setSelectedSize(null); }} />
            <BiometricSlider label="BODY HEIGHT" value={height} min={60} max={82} display={fmtHeight(height)}
              onChange={v => { setHeight(v); setSelectedSize(null); }} />

            <Divider label="SILHOUETTE PROFILE" />
            <div style={{display:'flex',gap:4,marginBottom:4}}>
              {BUILD_PROFILES.map(({key,label}) => {
                const active = buildProfile===key;
                return (
                  <motion.button key={key} onClick={() => setBuildProfile(key)}
                    whileHover={!active?{borderColor:C.orange,color:C.textBright}:{}} whileTap={{scale:0.95}}
                    style={{flex:1,padding:'6px 0',fontFamily:MONO,fontSize:7,letterSpacing:'0.14em',textTransform:'uppercase',cursor:'pointer',backgroundColor:active?C.orange:'transparent',color:active?C.surface:C.textDim,border:`1px solid ${active?C.orange:C.orangeBorder}`,transition:'all 0.15s ease'}}>
                    {label}
                  </motion.button>
                );
              })}
            </div>

            <Divider label="SPECIFICATION MANIFEST" />
            <ManifestRow label="PRODUCT"    value={product.name}              isActive={false}/>
            <ManifestRow label="CATEGORY"   value={product.category}          isActive={false}/>
            <ManifestRow label="SIZE"       value={selectedSize ?? sizeRec}   isActive={false}/>
            <ManifestRow label="BASE PRICE" value={`${product.price} / unit`} isActive={false}/>
            <ManifestRow label="MOQ"        value="100 pcs"                   isActive={false}/>
            {zones.map(z => (
              <ManifestRow key={z.id} label={z.label} value={z.value}
                isActive={activeZone===z.id}
                onHover={() => setActiveZone(z.id)}
                onLeave={() => setActiveZone(null)}/>
            ))}

            <Divider label="COLOUR FINISH" />
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:8}}>
              {product.standardColors?.map(cn => {
                const sel = selectedColor===cn;
                return (
                  <motion.button key={cn} title={cn} onClick={() => setSelectedColor(cn)}
                    whileHover={{scale:1.18}} whileTap={{scale:0.9}}
                    style={{width:18,height:18,backgroundColor:getSwatchColor(cn),border:`2px solid ${sel?C.orange:'rgba(250,247,242,0.14)'}`,cursor:'pointer',transition:'border-color 0.15s ease'}}/>
                );
              })}
            </div>
            {selectedColor!=='Standard' && (
              <p style={{fontFamily:MONO,fontSize:7,color:C.orange,letterSpacing:'0.1em',marginBottom:16}}>{selectedColor}</p>
            )}

            <div style={{marginTop:'auto',paddingTop:16}}>
              <motion.button onClick={handleAppend}
                whileHover={!appended?{backgroundColor:C.orange,color:C.surface}:{}} whileTap={{scale:0.97}}
                style={{width:'100%',padding:'11px 0',fontFamily:MONO,fontSize:7.5,letterSpacing:'0.22em',textTransform:'uppercase',fontWeight:600,cursor:'pointer',backgroundColor:appended?C.orange:'transparent',color:appended?C.surface:C.orange,border:`1px solid ${C.orange}`,transition:'all 0.2s ease'}}>
                {appended ? '[ ✓ APPENDED ]' : '[ APPEND TO PROCUREMENT ]'}
              </motion.button>
            </div>
          </motion.div>

          {/* ═══ CENTER CANVAS ═══ */}
          <div style={{position:'relative',backgroundColor:C.surface,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',padding:'36px 4px 28px',minHeight:520}}>
            <div style={{position:'absolute',top:14,left:16}}>
              <p style={{fontFamily:MONO,fontSize:6.5,color:C.orange,letterSpacing:'0.34em',opacity:0.65,textTransform:'uppercase'}}>BODY MATRIX — LIVE PREVIEW</p>
            </div>
            {[{top:8,left:8,borderTop:`1px solid ${C.orangeDim}`,borderLeft:`1px solid ${C.orangeDim}`},{top:8,right:8,borderTop:`1px solid ${C.orangeDim}`,borderRight:`1px solid ${C.orangeDim}`},{bottom:8,left:8,borderBottom:`1px solid ${C.orangeDim}`,borderLeft:`1px solid ${C.orangeDim}`},{bottom:8,right:8,borderBottom:`1px solid ${C.orangeDim}`,borderRight:`1px solid ${C.orangeDim}`}].map((st,i)=>(
              <div key={i} style={{position:'absolute',width:12,height:12,...st}}/>
            ))}
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.36,duration:0.3}}
              style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`linear-gradient(${C.gridLine} 1px,transparent 1px),linear-gradient(90deg,${C.gridLine} 1px,transparent 1px),linear-gradient(${C.gridMajor} 1px,transparent 1px),linear-gradient(90deg,${C.gridMajor} 1px,transparent 1px)`,backgroundSize:'24px 24px,24px 24px,96px 96px,96px 96px'}}/>

            <motion.svg viewBox="-80 -30 380 370"
              style={{width:'100%',maxWidth:480,height:'auto',overflow:'visible'}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.44,duration:0.45}}>
              <defs>
                <linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.orange} stopOpacity="0"/>
                  <stop offset="50%" stopColor={C.orange} stopOpacity="0.15"/>
                  <stop offset="100%" stopColor={C.orange} stopOpacity="0"/>
                </linearGradient>
                <filter id="blueprintF">
                  <feColorMatrix type="saturate" values="0.48"/>
                  <feComponentTransfer>
                    <feFuncR type="linear" slope="0.62"/>
                    <feFuncG type="linear" slope="0.62"/>
                    <feFuncB type="linear" slope="0.62"/>
                  </feComponentTransfer>
                </filter>
                <filter id="glowF" x="-25%" y="-25%" width="150%" height="150%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.8" floodColor={C.orange} floodOpacity="0.40"/>
                </filter>
                <clipPath id="garmentClip">
                  <path d={clipPathData}/>
                </clipPath>
                <pattern id="cadPlaceholderPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 0 16 L 16 0 M 0 0 L 16 16" stroke="rgba(184,115,51,0.12)" strokeWidth="0.5"/>
                </pattern>
              </defs>

              {/* ── Croquis Background Layer — Rendered via web server paths ── */}
              <image href={getCroquisSrc()}
                x="0" y="32" width="200" height="235"
                preserveAspectRatio="xMidYMin meet"
                style={{ opacity: 0.38, filter: 'invert(1) brightness(0.9) contrast(1.1)' }}
              />

              {/* Product image or CAD blueprint placeholder */}
              {hasColorImage ? (
                <image href={displayImage}
                  x="0" y="78" width="200" height="230"
                  preserveAspectRatio="xMidYMin slice"
                  clipPath="url(#garmentClip)"
                  filter="url(#blueprintF)"
                  style={{opacity:0.86}}/>
              ) : (
                <g>
                  {/* Fill the garment outline with the cross-hatch pattern */}
                  <rect x="0" y="78" width="200" height="230"
                    fill="url(#cadPlaceholderPattern)"
                    clipPath="url(#garmentClip)"/>
                  
                  {/* Draw the technical dashed border of the garment */}
                  <path d={clipPathData} fill="none" stroke={C.orangeDim} strokeWidth="1" strokeDasharray="3 4"/>
                  
                  {/* Technical annotation labels */}
                  <g style={{pointerEvents:'none'}}>
                    <text x="100" y="160" textAnchor="middle" fill={C.orange} fontSize="7" fontFamily="monospace" fontWeight="600" letterSpacing="0.2em">
                      DRAFT SPECIFICATION MODEL
                    </text>
                    <text x="100" y="174" textAnchor="middle" fill={C.textDim} fontSize="5.5" fontFamily="monospace" letterSpacing="0.15em">
                      {selectedColor.toUpperCase()} DETAIL PENDING
                    </text>
                  </g>
                </g>
              )}

              {/* Vertical symmetry axis */}
              <line x1="100" y1="-28" x2="100" y2="302"
                stroke="rgba(184,115,51,0.12)" strokeWidth="0.5"
                strokeDasharray="2 10" style={{pointerEvents:'none'}}/>

              {/* CAD tick marks */}
              <g stroke={C.orangeDim} strokeWidth="0.8" fill="none">
                {[80,120,160,200,240,280].map(y=>(
                  <g key={y}>
                    <line x1="4" y1={y} x2="11" y2={y}/>
                    <line x1="189" y1={y} x2="196" y2={y}/>
                  </g>
                ))}
                <line x1="100" y1="0" x2="100" y2="15" strokeDasharray="3 2" opacity="0.5"/>
                <line x1="100" y1="295" x2="100" y2="310" strokeDasharray="3 2" opacity="0.5"/>
              </g>
              {[80,120,160,200,240,280].map(y=>(
                <text key={y} x="1" y={y+2} fontSize="4.5" fill={C.orangeDim} fontFamily="monospace" letterSpacing="0.5">
                  {String(y).padStart(3,'0')}
                </text>
              ))}

              {/* Zone hotspots */}
              {zones.map(zone => (
                <rect key={zone.id} x={zone.hotspot[0]} y={zone.hotspot[1]}
                  width={zone.hotspot[2]} height={zone.hotspot[3]}
                  fill="transparent" style={{cursor:'crosshair'}}
                  onMouseEnter={() => setActiveZone(zone.id)}
                  onMouseLeave={() => setActiveZone(null)}/>
              ))}

              {/* Leader lines (zone hover) */}
              {zones.map(zone => {
                const active = activeZone===zone.id;
                return (
                  <g key={`leader-${zone.id}`} style={{opacity:active?1:0,transition:'opacity 0.2s ease',pointerEvents:'none'}}>
                    {zone.leaderPaths.map((lp,idx) => (
                      <path key={idx} d={lp.d} stroke={C.orange}
                        strokeWidth={lp.tick?1:1.5} strokeDasharray={lp.dashed?'3 6':undefined}
                        fill="none" opacity={lp.tick?0.65:1}
                        className={lp.main?'tryon-marching':undefined}/>
                    ))}
                    <text x={zone.labelPos[0]} y={zone.labelPos[1]}
                      textAnchor={zone.labelAnchor??'start'} fontSize="8"
                      fontFamily={MONO} fill={C.orange} fontWeight="600" letterSpacing="0.5"
                      transform={zone.rotate?`rotate(${zone.rotate},${zone.labelPos[0]},${zone.labelPos[1]})`:undefined}>
                      {zone.value}
                    </text>
                    <circle cx={zone.anchor[0]} cy={zone.anchor[1]} r="2.4" fill={C.orange} opacity="0.9"/>
                  </g>
                );
              })}

              {/* Scan pulse */}
              <rect x="-80" y={scanY-22} width="380" height="44" fill="url(#scanG)" style={{pointerEvents:'none'}}/>
              <line x1="-80" y1={scanY} x2="300" y2={scanY} stroke="#F0D080" strokeWidth="0.5" opacity="0.36" style={{pointerEvents:'none'}}/>

              {/* Size badge */}
              <text x="100" y="308" textAnchor="middle" fontSize="7" fill={C.orangeDim} fontFamily={MONO} letterSpacing="2">
                SZ {selectedSize ?? sizeRec} · {buildProfile.toUpperCase()}
              </text>
            </motion.svg>
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <motion.div className="tryon-right-panel"
            initial={{opacity:0,x:14}} animate={{opacity:1,x:0}} transition={{delay:0.98,duration:0.32,ease:'easeOut'}}
            style={{borderLeft:`1px solid ${C.orangeBorder}`,backgroundColor:C.surfacePanel,padding:'28px 16px 24px',display:'flex',flexDirection:'column',gap:18,overflowY:'auto',maxHeight:'94vh'}}>

            <div>
              <p style={{fontFamily:MONO,fontSize:6.5,color:C.orange,letterSpacing:'0.38em',textTransform:'uppercase',lineHeight:1.7,opacity:0.75}}>CROSS-SECTION<br/>ANALYSIS</p>
              <div style={{height:1,background:C.orangeBorder,marginTop:10}}/>
            </div>

            <CrossSection chest={chest}/>
            <div style={{height:1,background:C.orangeBorder}}/>

            <div style={{textAlign:'center'}}>
              <p style={{fontFamily:MONO,fontSize:6,color:C.textGhost,letterSpacing:'0.42em',textTransform:'uppercase',marginBottom:10}}>COMPUTED SIZE</p>
              <div style={{fontFamily:MONO,fontSize:40,fontWeight:700,color:C.orange,letterSpacing:'0.04em',lineHeight:1}}>{selectedSize ?? sizeRec}</div>
              <p style={{fontFamily:MONO,fontSize:6.5,color:C.textDim,marginTop:7,letterSpacing:'0.18em'}}>{buildProfile.toUpperCase()} FIT</p>
            </div>

            <div style={{height:1,background:C.orangeBorder}}/>

            <div>
              <p style={{fontFamily:MONO,fontSize:6,color:C.textGhost,letterSpacing:'0.42em',textTransform:'uppercase',marginBottom:10}}>FIT NOTES</p>
              {[
                {k:'EASE',  v:buildProfile==='slim'?'−1"':buildProfile==='relaxed'?'+1"':'0"'},
                {k:'CHEST', v:`${chest}"`},
                {k:'HEIGHT',v:fmtHeight(height)},
                {k:'PRICE', v:product.price},
                {k:'MOQ',   v:'100 pcs'},
              ].map(({k,v}) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:`1px solid ${C.textGhost}`,marginBottom:4}}>
                  <span style={{fontFamily:MONO,fontSize:7,color:C.textDim,letterSpacing:'0.15em',textTransform:'uppercase'}}>{k}</span>
                  <span style={{fontFamily:MONO,fontSize:7.5,color:C.textBright,fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
