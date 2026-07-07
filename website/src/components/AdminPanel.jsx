// src/components/AdminPanel.jsx
// ─────────────────────────────────────────────────────────────────────────────
//  GTM Back-Office Command Dashboard  v3.0
//  Industrial terminal aesthetic — strict mono grid layout.
//  API Integrations → Product Registry (CRUD) + Retail Log + Contracts
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── API CONFIGURATION & CREDENTIALS INTERCEPTOR ─────────────────────────────
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

let refreshPromise = null;

function getRefreshedToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Session refresh failed');
        return res.json();
      })
      .then((data) => data.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  green:  { base: '#4AFF91', dim: 'rgba(74,255,145,0.10)',  glow: '0 0 14px rgba(74,255,145,0.45)'  },
  amber:  { base: '#FFB800', dim: 'rgba(255,184,0,0.10)',   glow: '0 0 14px rgba(255,184,0,0.45)'   },
  blue:   { base: '#6BA0FF', dim: 'rgba(107,160,255,0.10)', glow: '0 0 14px rgba(107,160,255,0.45)' },
  red:    { base: '#FF4444', dim: 'rgba(255,68,68,0.10)',   glow: '0 0 14px rgba(255,68,68,0.45)'   },
  bg0:    '#080808',
  bg1:    '#0E0E0E',
  bg2:    '#161616',
  border: '#1E1E1E',
  muted:  '#3A3A3A',
  bright: '#E8E8E8',
};

// ─── NAVIGATION TABS ─────────────────────────────────────────────────────────
const NAV_TABS = [
  { id: 'registry',  icon: '📦', label: 'Product Registry',   title: 'PRODUCT CATALOG REGISTRY'   },
  { id: 'retail',    icon: '🛒', label: 'Retail Sales Log',    title: 'RETAIL SALES ORDER LOG'      },
  { id: 'contracts', icon: '🏢', label: 'Corporate Contracts', title: 'CORPORATE CONTRACT DATABASE' },
];

// ─── BOOT LOG SEED ────────────────────────────────────────────────────────────
const mkTs = () => {
  const n = new Date();
  return [n.getHours(), n.getMinutes(), n.getSeconds()]
    .map((v) => String(v).padStart(2, '0'))
    .join(':');
};

const BOOT_LOGS = [
  { ts: mkTs(), level: 'INFO', msg: 'GTM Admin Shell v3.0.0 initialised'         },
  { ts: mkTs(), level: 'INFO', msg: 'Connecting to database node...' },
];

const PERIODIC_EVENTS = [
  { level: 'INFO', msg: 'Heartbeat ping: DB connection active' },
  { level: 'INFO', msg: 'Internal session health check — OK' },
  { level: 'WARN', msg: 'Audit log scan completed' },
  { level: 'INFO', msg: 'Pruned inactive DB sessions' },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const VIEW_VARIANTS = {
  initial:    { opacity: 0, y: 10, filter: 'blur(5px)' },
  animate:    { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:       { opacity: 0, y: -6, filter: 'blur(3px)' },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

const rowVariant = (i) => ({
  initial:    { opacity: 0, x: -8 },
  animate:    { opacity: 1, x: 0,  transition: { delay: i * 0.02, duration: 0.22 } },
});

const glowPulse = {
  animate: {
    boxShadow: [T.green.glow.replace('0.45', '0.3'), T.green.glow, T.green.glow.replace('0.45', '0.3')],
    transition: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const LOG_COLOR = {
  INFO:  T.blue.base,
  WARN:  T.amber.base,
  OK:    T.green.base,
  ERROR: T.red.base,
};

const STATUS_PALETTE = {
  DISPATCHED: { color: T.green.base, bg: T.green.dim  },
  PROCESSING: { color: T.amber.base, bg: T.amber.dim  },
  PENDING:    { color: T.blue.base,  bg: T.blue.dim   },
  CANCELLED:  { color: T.red.base,   bg: T.red.dim    },
};

function StatusBadge({ status }) {
  const s = STATUS_PALETTE[status] ?? { color: T.bright, bg: 'rgba(224,224,224,0.06)' };
  return (
    <span
      className="inline-block text-[8px] font-bold tracking-[0.2em] uppercase px-2 py-0.5"
      style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.color}40` }}
    >
      {status}
    </span>
  );
}

const inputCls =
  'w-full bg-[#080808] border border-[#1E1E1E] focus:border-[#4AFF91] ' +
  'text-[#E8E8E8] text-xs font-mono px-3 py-2 outline-none transition-colors duration-200 tracking-wide';
const labelCls = 'block text-[9px] tracking-[0.25em] uppercase text-[#444] mb-1';

// ─────────────────────────────────────────────────────────────────────────────
// § ADD / EDIT PRODUCT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AddProductModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    name:        initial?.name        ?? '',
    priceUsd:    initial?.priceUsd    ?? '',
    category:    initial?.category    ?? 'APPAREL',
    subCategory: initial?.subCategory ?? '',
    imageUrl:    initial?.imageUrl    ?? '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !String(form.priceUsd).trim()) return;
    onSave({ ...form, id: initial?.id });
    onClose();
  }

  return (
    <motion.div
      key="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.90)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        key="modal-panel"
        initial={{ scale: 0.95, y: 20, filter: 'blur(4px)' }}
        animate={{ scale: 1,    y: 0,  filter: 'blur(0px)' }}
        exit={{   scale: 0.95, y: 20,  filter: 'blur(4px)' }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md font-mono"
        style={{ backgroundColor: T.bg1, border: `1px solid ${T.border}` }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid #181818` }}
        >
          <div>
            <p className="text-[8px] tracking-[0.3em] uppercase font-bold" style={{ color: T.green.base }}>
              PRODUCT REGISTRY MUTATION
            </p>
            <h3 className="text-sm font-bold mt-0.5 tracking-wide" style={{ color: T.bright }}>
              {initial ? 'AMEND SPECIFICATIONS' : 'REGISTER NEW INDUSTRIAL PRODUCT SKU'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[10px] tracking-wider font-mono bg-transparent border-none cursor-pointer transition-colors duration-150"
            style={{ color: T.muted }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.bright)}
            onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
          >
            [×] CLOSE
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { key: 'name',        label: 'Product Name',            placeholder: 'e.g. Industrial Utility Jacket', type: 'text'   },
            { key: 'priceUsd',    label: 'Base Price (USD)',        placeholder: 'e.g. 24.50',                    type: 'number', step: '0.01' },
            { key: 'subCategory', label: 'Sub-Category',            placeholder: 'e.g. Safety Outerwear',         type: 'text'   },
            { key: 'imageUrl',    label: 'Image URL Reference',     placeholder: 'https://example.com/image.jpg', type: 'text'   },
          ].map(({ key, label, placeholder, type, step }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                className={inputCls}
                type={type}
                step={step}
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                required={key === 'name' || key === 'priceUsd'}
              />
            </div>
          ))}

          <div>
            <label className={labelCls}>Category Code</label>
            <select className={inputCls} value={form.category} onChange={set('category')}>
              <option value="APPAREL">Apparel</option>
              <option value="UNIFORM_WORKWEAR">Uniform &amp; Workwear</option>
              <option value="SPORTSWEAR">Sportswear</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button
              type="submit"
              whileHover={{ opacity: 0.86 }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer border-none"
              style={{ backgroundColor: T.green.base, color: T.bg0 }}
            >
              {initial ? '[ COMMIT AMENDMENT ]' : '[ REGISTER SKU ]'}
            </motion.button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-[9px] font-bold tracking-[0.2em] uppercase cursor-pointer transition-colors duration-150 bg-transparent"
              style={{ border: `1px solid ${T.border}`, color: T.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = T.bright;
                e.currentTarget.style.borderColor = '#444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = T.muted;
                e.currentTarget.style.borderColor = T.border;
              }}
            >
              ABORT
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// § PRODUCT REGISTRY VIEW — CRUD table
// ─────────────────────────────────────────────────────────────────────────────
function ProductRegistryView({ products, onAdd, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.subCategory?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <motion.button
          onClick={onAdd}
          whileHover={{ opacity: 0.88, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 text-[10px] font-bold tracking-[0.14em] uppercase cursor-pointer border-none shrink-0"
          style={{ backgroundColor: T.green.base, color: T.bg0 }}
        >
          [+ REGISTER NEW INDUSTRIAL PRODUCT SKU ]
        </motion.button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="FILTER BY NAME / CATEGORY / SUB-CATEGORY…"
          className="flex-1 min-w-[240px] text-xs font-mono px-4 py-2.5 outline-none transition-colors duration-200 tracking-wide"
          style={{
            backgroundColor: T.bg1,
            border: `1px solid #1A1A1A`,
            color: T.bright,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = T.green.base)}
          onBlur={(e)  => (e.currentTarget.style.borderColor = '#1A1A1A')}
        />
        <span className="text-[10px] tracking-widest shrink-0" style={{ color: '#2A2A2A' }}>
          {filtered.length} / {products.length} RECORDS
        </span>
      </div>

      <div
        className="w-full overflow-x-auto rounded-sm p-4"
        style={{ border: `1px solid ${T.border}`, backgroundColor: T.bg1 }}
      >
        <div className="min-w-[760px]">
          <div
            className="grid text-[8px] tracking-[0.25em] uppercase px-4 py-3"
            style={{
              gridTemplateColumns: '2fr 1.2fr 1.4fr 1fr 1.4fr',
              color: '#333',
              backgroundColor: T.bg0,
              borderBottom: '1px solid #191919',
            }}
          >
            {['PRODUCT NAME', 'CATEGORY', 'SUB-CATEGORY', 'BASE PRICE', 'OPERATIONS'].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div
              className="px-4 py-12 text-center text-[10px] tracking-widest uppercase"
              style={{ color: '#242424' }}
            >
              NO RECORDS MATCH FILTER CRITERIA
            </div>
          )}

          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              {...rowVariant(i)}
              className="grid items-center px-4 py-3 transition-colors duration-100 group"
              style={{
                gridTemplateColumns: '2fr 1.2fr 1.4fr 1fr 1.4fr',
                borderBottom: '1px solid #111',
                backgroundColor: i % 2 ? 'rgba(255,255,255,0.010)' : 'transparent',
              }}
              whileHover={{ backgroundColor: 'rgba(74,255,145,0.025)' }}
            >
              <span className="text-[10px] tracking-wide truncate pr-2" style={{ color: '#D0D0D0' }}>
                {product.name}
              </span>
              <span className="text-[9px] tracking-wide truncate" style={{ color: T.muted }}>
                {product.category}
              </span>
              <span className="text-[9px] tracking-wide truncate" style={{ color: T.muted }}>
                {product.subCategory || '—'}
              </span>
              <span className="text-[9px] font-bold" style={{ color: T.green.base }}>
                ${Number(product.priceUsd).toFixed(2)}
              </span>
              <div className="flex gap-1.5">
                <ActionButton
                  accent={T.blue}
                  onClick={() => onEdit(product)}
                  label="[ AMEND SPECIFICATIONS ]"
                />
                <ActionButton
                  accent={T.red}
                  onClick={() => onDelete(product.id, product.name)}
                  label="[ DE-REGISTER SKU ]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ accent, onClick, label }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className="text-[7px] tracking-[0.1em] uppercase cursor-pointer font-bold px-2 py-1.5 transition-colors duration-150"
      style={{
        color: accent.base,
        backgroundColor: accent.dim,
        border: `1px solid ${accent.base}30`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accent.base + '28')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accent.dim)}
    >
      {label}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// § RETAIL SALES LOG VIEW
// ─────────────────────────────────────────────────────────────────────────────
function RetailSalesView({ orders }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[9px] tracking-widest uppercase" style={{ color: T.muted }}>
          {orders.length} RETAIL ORDER RECORDS — READ ONLY
        </p>
        <span
          className="text-[9px] font-bold tracking-widest flex items-center gap-1.5"
          style={{ color: T.green.base }}
        >
          <motion.span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: T.green.base }}
            {...glowPulse}
          />
          LIVE FEED
        </span>
      </div>

      <div
        className="w-full overflow-x-auto rounded-sm p-4"
        style={{ border: `1px solid ${T.border}`, backgroundColor: T.bg1 }}
      >
        <div className="min-w-[900px]">
          <div
            className="grid text-[8px] tracking-[0.25em] uppercase px-4 py-3"
            style={{
              gridTemplateColumns: '1fr 1.6fr 1.9fr 1.5fr 0.6fr 1.1fr',
              color: '#333',
              backgroundColor: T.bg0,
              borderBottom: '1px solid #191919',
            }}
          >
            {['ORDER ID', 'CLIENT FULL NAME', 'EMAIL CONTACT', 'TELEPHONE NUMBER', 'QTY', 'DISPATCH STATUS'].map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>

          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              {...rowVariant(i)}
              className="grid items-center px-4 py-3 transition-colors duration-100"
              style={{
                gridTemplateColumns: '1fr 1.6fr 1.9fr 1.5fr 0.6fr 1.1fr',
                borderBottom: '1px solid #111',
                backgroundColor: i % 2 ? 'rgba(255,255,255,0.010)' : 'transparent',
              }}
              whileHover={{ backgroundColor: 'rgba(107,160,255,0.03)' }}
            >
              <span className="text-[8px] font-bold tracking-wider" style={{ color: '#383838' }}>
                {order.displayId}
              </span>
              <span className="text-[10px]" style={{ color: '#D0D0D0' }}>
                {order.client?.name || '—'}
              </span>
              <span className="text-[9px]" style={{ color: '#4A4A4A' }}>
                {order.client?.email || '—'}
              </span>
              <span className="text-[9px]" style={{ color: '#4A4A4A' }}>
                {order.client?.phone || '—'}
              </span>
              <span className="text-[10px] font-bold text-center" style={{ color: T.bright }}>
                {order.items?.reduce((acc, it) => acc + it.qty, 0) || 0}
              </span>
              <StatusBadge status={order.status} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// § CORPORATE CONTRACTS VIEW
// ─────────────────────────────────────────────────────────────────────────────
function CorporateContractsView({ contracts }) {
  const totalUnits = contracts.reduce((a, c) => a + c.unitCount, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[9px] tracking-widest uppercase" style={{ color: T.muted }}>
          {contracts.length} ACTIVE MANUFACTURING CONTRACTS — RFQ QUEUE
        </p>
        <span className="text-[9px] font-bold tracking-widest" style={{ color: T.amber.base }}>
          ⚡ {totalUnits.toLocaleString()} TOTAL UNITS IN PIPELINE
        </span>
      </div>

      <div className="space-y-3">
        {contracts.map((c, i) => (
          <motion.div
            key={c.id}
            {...rowVariant(i)}
            className="p-5 transition-colors duration-150 cursor-default"
            style={{ border: `1px solid #1A1A1A` }}
            whileHover={{
              borderColor: '#2E2E2E',
              backgroundColor: 'rgba(255,184,0,0.022)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[8px] tracking-[0.25em] uppercase font-bold" style={{ color: '#383838' }}>
                  {c.displayId}
                </span>
                <h3 className="text-sm font-bold mt-0.5 tracking-wide" style={{ color: T.bright }}>
                  {c.companyName}
                </h3>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-xs font-bold tracking-widest" style={{ color: T.amber.base }}>
                  {c.unitCount.toLocaleString()} UNITS
                </span>
                <p className="text-[8px] tracking-widest mt-0.5" style={{ color: '#2E2E2E' }}>
                  MANIFEST PC COUNT
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { heading: 'REPRESENTATIVE EMAIL',         value: c.repEmail,    color: T.blue.base  },
                { heading: 'TARGET DELIVERY WINDOW SPEC',  value: c.deliveryWindow, color: T.bright     },
                { heading: 'SELECTION SPECS / BODY MATRIX',value: c.specsRaw,  color: T.green.base },
              ].map(({ heading, value, color }) => (
                <div key={heading}>
                  <p className="text-[8px] tracking-[0.22em] uppercase mb-1.5" style={{ color: '#383838' }}>
                    {heading}
                  </p>
                  <p className="text-[9px] tracking-wide leading-relaxed" style={{ color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// § SIDEBAR NAV — Framer indicator
// ─────────────────────────────────────────────────────────────────────────────
function SidebarNav({ activeTab, onTabChange }) {
  return (
    <div className="space-y-1 relative">
      {NAV_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative w-full text-left px-4 py-3 flex items-center gap-3
                       text-[10px] tracking-[0.18em] uppercase font-bold
                       transition-colors duration-150 cursor-pointer border-none bg-transparent"
            style={{ color: isActive ? T.green.base : T.muted }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#888'; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = T.muted; }}
          >
            {isActive && (
              <motion.span
                layoutId="active-nav-pill"
                className="absolute inset-0"
                style={{
                  backgroundColor: T.green.dim,
                  borderLeft: `2px solid ${T.green.base}`,
                  boxShadow: `inset 0 0 24px rgba(74,255,145,0.05), ${T.green.glow.replace('14px', '8px')}`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              />
            )}
            <span className="relative z-10 text-base leading-none">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// § MAIN EXPORT — AdminPanel
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput,       setEmailInput]       = useState('');
  const [passInput,       setPassInput]       = useState('');
  const [authError,       setAuthError]       = useState('');
  const [isBooting,       setIsBooting]       = useState(true);
  const [token,           setToken]           = useState(null);

  const [activeTab,      setActiveTab]      = useState('registry');
  const [products,       setProducts]       = useState([]);
  const [orders,         setOrders]         = useState([]);
  const [contracts,      setContracts]      = useState([]);
  const [stats,          setStats]          = useState({
    skus: { total: 0, byCategory: { apparel: 0, uniformWorkwear: 0, sportswear: 0 } },
    orders: { active: 0, pending: 0 },
    contracts: { active: 0, pipelineUnits: 0 }
  });
  const [showModal,      setShowModal]      = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [logs, setLogs] = useState(BOOT_LOGS);
  const [tick, setTick] = useState(new Date());
  const logContainerRef  = useRef(null);

  const appendLog = useCallback((level, msg) => {
    setLogs((prev) => [...prev.slice(-30), { ts: mkTs(), level, msg }]);
  }, []);

  const authenticatedFetch = useCallback(async (url, options = {}) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    let res = await fetch(url, { ...options, headers });

    if (res.status === 401) {
      appendLog('WARN', 'Access token expired. Retrying session refresh...');
      try {
        const refreshedToken = await getRefreshedToken();
        setToken(refreshedToken);

        const retryHeaders = {
          ...options.headers,
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshedToken}`,
        };
        res = await fetch(url, { ...options, headers: retryHeaders });
      } catch (err) {
        appendLog('ERROR', 'Session invalid/expired. Terminating secure session link.');
        setIsAuthenticated(false);
        setToken(null);
        throw err;
      }
    }

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ message: 'HTTP request failed' }));
      throw new Error(errBody.message || 'API request failed');
    }

    return res.json();
  }, [token, appendLog]);

  useEffect(() => {
    const t = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = logContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => {
      const evt = PERIODIC_EVENTS[Math.floor(Math.random() * PERIODIC_EVENTS.length)];
      setLogs((prev) => [...prev.slice(-30), { ts: mkTs(), ...evt }]);
    }, 12000);
    return () => clearInterval(id);
  }, [isAuthenticated]);

  useEffect(() => {
    appendLog('INFO', 'Performing startup authentication check...');
    getRefreshedToken()
      .then((accessToken) => {
        setToken(accessToken);
        setIsAuthenticated(true);
        appendLog('OK', 'Secure session link re-established silently.');
      })
      .catch(() => {
        appendLog('WARN', 'No active session token located. Redirecting to terminal gate.');
      })
      .finally(() => {
        setIsBooting(false);
      });
  }, [appendLog]);

  const fetchOverviewStats = useCallback(async () => {
    try {
      const data = await authenticatedFetch(`${API_BASE}/api/stats/overview`);
      setStats(data);
    } catch (err) {
      appendLog('ERROR', 'Failed to retrieve overview stats: ' + err.message);
    }
  }, [authenticatedFetch, appendLog]);

  const fetchTabDetails = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      if (activeTab === 'registry') {
        const result = await authenticatedFetch(`${API_BASE}/api/products?limit=100`);
        setProducts(result.data);
      } else if (activeTab === 'retail') {
        const result = await authenticatedFetch(`${API_BASE}/api/orders?limit=100`);
        setOrders(result.data);
      } else if (activeTab === 'contracts') {
        const result = await authenticatedFetch(`${API_BASE}/api/contracts?limit=100`);
        setContracts(result.data);
      }
    } catch (err) {
      appendLog('ERROR', `Failed loading ${activeTab} data: ` + err.message);
    }
  }, [activeTab, isAuthenticated, authenticatedFetch, appendLog]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOverviewStats();
      fetchTabDetails();
    }
  }, [isAuthenticated, activeTab, fetchOverviewStats, fetchTabDetails]);

  const fmtTime = (d) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((v) => String(v).padStart(2, '0'))
      .join(':');

  async function handleAuth(e) {
    e.preventDefault();
    if (!emailInput || !passInput) return;
    setAuthError('');
    appendLog('INFO', `Requesting authentication for operator: ${emailInput}`);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Access denied — Invalid credentials');
      }

      const data = await response.json();
      setToken(data.accessToken);
      setIsAuthenticated(true);
      appendLog('OK', `Operator ${emailInput} verified. Welcome.`);
    } catch (err) {
      setAuthError(`[ ACCESS DENIED ] — ${err.message.toUpperCase()}`);
      appendLog('ERROR', `Authentication rejected: ${err.message}`);
      setPassInput('');
    }
  }

  const handleSaveProduct = useCallback(async (formData) => {
    try {
      const payload = {
        name: formData.name,
        priceUsd: parseFloat(formData.priceUsd),
        category: formData.category,
        subCategory: formData.subCategory,
        imageUrl: formData.imageUrl || undefined,
        colors: [],
      };

      if (formData.id) {
        const result = await authenticatedFetch(`${API_BASE}/api/products/${formData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setProducts((prev) => prev.map((p) => (p.id === formData.id ? result : p)));
        appendLog('INFO', `SKU amended successfully — ${payload.name}`);
      } else {
        const result = await authenticatedFetch(`${API_BASE}/api/products`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setProducts((prev) => [...prev, result]);
        appendLog('OK', `New SKU registered successfully — ${payload.name}`);
      }
      fetchOverviewStats();
    } catch (err) {
      appendLog('ERROR', `Product save transaction rejected: ${err.message}`);
    }
  }, [authenticatedFetch, appendLog, fetchOverviewStats]);

  const handleDeleteProduct = useCallback(async (id, name) => {
    if (window.confirm(`De-register SKU:\n"${name}"\n\nConfirming moves this item to de-registered state.`)) {
      try {
        await authenticatedFetch(`${API_BASE}/api/products/${id}`, {
          method: 'DELETE',
        });
        setProducts((prev) => prev.filter((p) => p.id !== id));
        appendLog('WARN', `SKU de-registered — ${name}`);
        fetchOverviewStats();
      } catch (err) {
        appendLog('ERROR', `Product de-registration failed: ${err.message}`);
      }
    }
  }, [authenticatedFetch, appendLog, fetchOverviewStats]);

  const openAddModal  = useCallback(() => { setEditingProduct(null); setShowModal(true); }, []);
  const openEditModal = useCallback((p) => { setEditingProduct(p);   setShowModal(true); }, []);
  const closeModal    = useCallback(() => { setShowModal(false); setEditingProduct(null); }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
    } catch (err) {
      // Best-effort logout
    }
    setToken(null);
    setIsAuthenticated(false);
    appendLog('WARN', 'Session terminated by operator.');
  }, [token, appendLog]);

  const activeTabMeta = NAV_TABS.find((t) => t.id === activeTab);

  const VIEW_MAP = {
    registry: (
      <ProductRegistryView
        products={products}
        onAdd={openAddModal}
        onEdit={openEditModal}
        onDelete={handleDeleteProduct}
      />
    ),
    retail:    <RetailSalesView    orders={orders}     />,
    contracts: <CorporateContractsView contracts={contracts} />,
  };

  if (isBooting) {
    return (
      <div
        className="min-h-screen w-full font-mono flex flex-col items-center justify-center p-6 text-xs uppercase"
        style={{ backgroundColor: T.bg0, color: T.green.base }}
      >
        <div className="w-full max-w-sm p-8 rounded-sm text-center" style={{ border: `1px solid ${T.border}`, backgroundColor: T.bg1 }}>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="tracking-[0.25em] font-bold"
          >
            [ SECURE SYSCOMM INITIATION ]
          </motion.div>
          <div className="mt-4 text-[9px] text-[#444] tracking-widest leading-relaxed">
            establishing secure shell link...<br />
            verifying active console session token...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen w-full font-mono flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: T.bg0 }}
      >
        <div className="mb-8 text-center">
          <pre
            className="select-none leading-[1.3]"
            style={{ fontSize: '9px', letterSpacing: '2px', color: '#1C1C1C' }}
          >{`
 ██████╗████████╗███╗   ███╗
 ██╔════╝╚══██╔══╝████╗ ████║
 ██║  ███╗  ██║   ██╔████╔██║
 ██║   ██║  ██║   ██║╚██╔╝██║
 ╚██████╔╝  ██║   ██║ ╚═╝ ██║
  ╚═════╝   ╚═╝   ╚═╝     ╚═╝`}</pre>
          <p className="text-[8px] tracking-[0.45em] mt-3 uppercase" style={{ color: '#282828' }}>
            Gray Textile &amp; Merchandising — Admin Shell v3.0.0
          </p>
        </div>

        <motion.form
          onSubmit={handleAuth}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm p-8 rounded-sm text-center"
          style={{ border: `1px solid ${T.border}`, backgroundColor: T.bg1 }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase font-bold mb-1"
            style={{ color: T.green.base }}
          >
            SECURITY AUTHENTICATION REQUIRED
          </p>
          <p className="text-[9px] mb-8 tracking-wider leading-relaxed" style={{ color: '#383838' }}>
            Enter operator credentials to unlock<br />the command dashboard.
          </p>

          <div className="text-left mb-4">
            <label className={labelCls}>Operator Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => { setEmailInput(e.target.value); setAuthError(''); }}
              placeholder="operator@gtm-admin.com"
              className={inputCls}
              required
            />
          </div>

          <div className="text-left mb-4">
            <label className={labelCls}>Access Password</label>
            <input
              type="password"
              value={passInput}
              onChange={(e) => { setPassInput(e.target.value); setAuthError(''); }}
              placeholder="••••••••••••••••"
              className={inputCls}
              required
            />
          </div>

          <AnimatePresence>
            {authError && (
              <motion.p
                key="auth-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[8px] tracking-widest mb-4 text-left"
                style={{ color: T.red.base }}
              >
                {authError}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            whileHover={{ opacity: 0.88, boxShadow: T.green.glow }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 text-[9px] font-bold tracking-[0.25em] uppercase cursor-pointer border-none transition-shadow duration-200"
            style={{ backgroundColor: T.green.base, color: T.bg0 }}
          >
            [ AUTHENTICATE OPERATOR ]
          </motion.button>

          <p className="text-[8px] mt-6 tracking-widest" style={{ color: '#1E1E1E' }}>
            UNAUTHORIZED ACCESS IS PROHIBITED AND MONITORED
          </p>
        </motion.form>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full min-h-screen font-mono flex flex-row items-stretch overflow-hidden"
        style={{ backgroundColor: T.bg0, color: T.bright }}
      >
        <aside
          className="w-[280px] flex-shrink-0 p-6 flex flex-col justify-between overflow-y-auto self-stretch"
          style={{ backgroundColor: T.bg1, borderRight: `1px solid #181818` }}
        >
          <div>
            <div className="mb-8">
              <p
                className="text-[9px] tracking-[0.3em] uppercase font-bold"
                style={{ color: T.green.base }}
              >
                GTM // ADMIN SHELL
              </p>
              <p className="text-[8px] mt-1.5 tracking-widest" style={{ color: '#282828' }}>
                {fmtTime(tick)}&nbsp;·&nbsp; OPERATOR ACTIVE
              </p>
              <div className="mt-4 w-full h-px" style={{ backgroundColor: '#181818' }} />
            </div>

            <div
              className="mb-8 p-4"
              style={{ backgroundColor: T.bg0, border: `1px solid #181818` }}
            >
              <p className="text-[8px] tracking-[0.25em] uppercase mb-4" style={{ color: '#2E2E2E' }}>
                SKU INVENTORY DEPTH
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Apparel',            val: stats.skus.byCategory.apparel            },
                  { label: 'Uniform / Workwear', val: stats.skus.byCategory.uniformWorkwear },
                  { label: 'Sportswear',         val: stats.skus.byCategory.sportswear          },
                  { label: 'Total Active SKUs',  val: stats.skus.total                          },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[9px] tracking-wide" style={{ color: '#383838' }}>
                      {label}
                    </span>
                    <span
                      className="text-[10px] font-bold tabular-nums"
                      style={{ color: label === 'Total Active SKUs' ? T.green.base : T.bright }}
                    >
                      {String(val).padStart(3, '0')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[8px] tracking-[0.25em] uppercase mb-4" style={{ color: '#2E2E2E' }}>
                OPERATIONS MODULES
              </p>
              <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[8px] tracking-[0.25em] uppercase mb-2" style={{ color: '#2E2E2E' }}>
              LIVE SYSTEM LOG
            </p>
            <div
              ref={logContainerRef}
              className="p-2.5 h-36 overflow-y-auto space-y-1"
              style={{ backgroundColor: T.bg0, border: `1px solid #181818` }}
            >
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start text-[7.5px] leading-relaxed">
                  <span className="shrink-0 tracking-wider tabular-nums" style={{ color: '#282828' }}>
                    {log.ts}
                  </span>
                  <span className="shrink-0 font-bold" style={{ color: LOG_COLOR[log.level] ?? T.bright }}>
                    {log.level}
                  </span>
                  <span className="break-all" style={{ color: '#444' }}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ backgroundColor: 'rgba(255,68,68,0.16)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-3 py-2 text-[8px] tracking-[0.2em] uppercase font-bold cursor-pointer transition-colors duration-150"
              style={{
                backgroundColor: T.red.dim,
                color: T.red.base,
                border: `1px solid ${T.red.base}30`,
              }}
            >
              [ TERMINATE SESSION ]
            </motion.button>
          </div>
        </aside>

        <main
          className="flex-1 min-w-0 p-6 sm:p-10 flex flex-col items-stretch h-screen overflow-y-auto"
          style={{ backgroundColor: T.bg0 }}
        >
          <div
            className="flex items-start justify-between mb-12 pb-8"
            style={{ borderBottom: `1px solid #141414` }}
          >
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#282828' }}>
                GTM ADMIN // {activeTabMeta?.label}
              </p>
              <h1
                className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.25em] uppercase font-semibold
                           whitespace-nowrap mb-0 block pb-4"
                style={{ color: '#FAF7F2', borderBottom: `1px solid #222` }}
              >
                {activeTabMeta?.title}
              </h1>
            </div>
            <div className="text-right shrink-0 ml-8">
              <p className="text-[9px] tracking-widest" style={{ color: '#282828' }}>
                {new Date().toDateString().toUpperCase()}
              </p>
              <p
                className="text-sm font-bold mt-1.5 tracking-wider font-mono tabular-nums"
                style={{ color: T.green.base }}
              >
                {fmtTime(tick)}
              </p>
              <p className="text-[9px] mt-1 tracking-widest" style={{ color: '#282828' }}>
                SESSION LIVE
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              {...VIEW_VARIANTS}
            >
              {VIEW_MAP[activeTab] ?? (
                <div className="text-[10px] tracking-widest" style={{ color: T.muted }}>
                  UNKNOWN MODULE
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddProductModal
            key="product-modal"
            initial={editingProduct}
            onClose={closeModal}
            onSave={handleSaveProduct}
          />
        )}
      </AnimatePresence>
    </>
  );
}
