import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// ─── Bulk tier presets ────────────────────────────────────────────────────────
const BULK_TIERS = [
  { label: '250 Units',   qty: 250,  discount: false },
  { label: '500 Units',   qty: 500,  discount: false },
  { label: '1,000+ Units', qty: 1000, discount: true  },
];

// ─── CartItemRow — owns per-item bulk state ───────────────────────────────────
function CartItemRow({ item, onUpdate, onRemove }) {
  const isStitched =
    item.category?.toLowerCase() === 'uniforms' ||
    item.collection?.toLowerCase() === 'uniforms';

  const [volumeDiscount, setVolumeDiscount] = useState(false);
  const [bulkInput,      setBulkInput]      = useState('');

  // Integer +1 / -1 controls
  const handleIncrement = () => onUpdate(item.id, item.selectedColor, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) onUpdate(item.id, item.selectedColor, item.quantity - 1);
  };

  // Preset chip handler
  function applyTier(qty, triggersDiscount) {
    onUpdate(item.id, item.selectedColor, qty);
    setVolumeDiscount(triggersDiscount);
    setBulkInput(String(qty));
  }

  // Manual numeric input handler
  function handleBulkInputChange(e) {
    const raw = e.target.value.replace(/\D/g, '');
    setBulkInput(raw);
  }
  function commitBulkInput() {
    const parsed = parseInt(bulkInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdate(item.id, item.selectedColor, parsed);
      setVolumeDiscount(parsed >= 1000);
    } else {
      setBulkInput(String(item.quantity));
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#151515',
        border: '1px solid rgba(184,115,51,0.12)',
      }}
    >
      {/* Gold left-edge accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ backgroundColor: '#B87333', opacity: 0.6 }} />

      <div className="p-7 pl-8">

        {/* ── Header row ────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-[9px] tracking-[0.22em] uppercase font-bold" style={{ color: 'rgba(184,115,51,0.7)' }}>
            {isStitched ? 'STITCHED ASSEMBLY' : 'UNSTITCHED MATERIAL'}
          </span>
          <button
            onClick={() => onRemove(item.id, item.selectedColor)}
            className="text-[9px] font-mono uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer"
            style={{ color: 'rgba(250,247,242,0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(250,247,242,0.3)'; }}
          >
            REMOVE
          </button>
        </div>

        {/* ── Product name ──────────────────────────────────────────────────── */}
        <h3 className="font-serif text-lg tracking-wide mb-1" style={{ color: '#FAF7F2' }}>
          {item.name}
        </h3>

        {/* ── Finish + type tags ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-[9px] uppercase tracking-widest font-semibold font-mono" style={{ color: '#B87333' }}>
            Finish: {item.selectedColor || 'Default'}
          </span>
        </div>

        {/* ── Quantity divider ──────────────────────────────────────────────── */}
        <div className="pt-5" style={{ borderTop: '1px solid rgba(184,115,51,0.08)' }}>

          {/* Label */}
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold block mb-4"
            style={{ color: 'rgba(250,247,242,0.35)' }}>
            {isStitched ? 'Tailored Piece Count' : 'Bulk Volume Sizing (Units)'}
          </span>

          {/* Standard ± stepper */}
          <div className="flex items-center gap-0 mb-5">
            <button
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center font-bold text-base transition-all duration-150"
              style={{
                backgroundColor: 'rgba(184,115,51,0.08)',
                border: '1px solid rgba(184,115,51,0.2)',
                color: '#B87333',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.08)'; }}
            >
              −
            </button>
            <div
              className="w-20 h-10 flex items-center justify-center font-mono font-bold text-sm"
              style={{
                borderTop: '1px solid rgba(184,115,51,0.2)',
                borderBottom: '1px solid rgba(184,115,51,0.2)',
                color: '#FAF7F2',
                backgroundColor: 'rgba(250,247,242,0.03)',
                letterSpacing: '0.05em',
              }}
            >
              {item.quantity.toLocaleString()}
            </div>
            <button
              onClick={handleIncrement}
              className="w-10 h-10 flex items-center justify-center font-bold text-base transition-all duration-150"
              style={{
                backgroundColor: 'rgba(184,115,51,0.08)',
                border: '1px solid rgba(184,115,51,0.2)',
                color: '#B87333',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.08)'; }}
            >
              +
            </button>
          </div>

          {/* ── Bulk Quantity Modifier Block ──────────────────────────────── */}
          <div
            className="p-4 rounded-xs"
            style={{
              backgroundColor: 'rgba(184,115,51,0.03)',
              border: '1px solid rgba(184,115,51,0.1)',
            }}
          >
            <p className="text-[8px] tracking-[0.28em] font-bold uppercase mb-3"
              style={{ color: 'rgba(184,115,51,0.6)' }}>
              Bulk Quantity Modifier
            </p>

            {/* Manual numeric input */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                inputMode="numeric"
                value={bulkInput}
                onChange={handleBulkInputChange}
                onBlur={commitBulkInput}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitBulkInput(); } }}
                placeholder={item.quantity.toLocaleString()}
                className="flex-1 py-2 px-3 font-mono text-xs tracking-wider outline-none transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(250,247,242,0.04)',
                  border: '1px solid rgba(184,115,51,0.22)',
                  color: '#FAF7F2',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(184,115,51,0.65)'; }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = 'rgba(184,115,51,0.22)'; }}
              />
              <button
                onClick={commitBulkInput}
                className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(184,115,51,0.12)',
                  border: '1px solid rgba(184,115,51,0.3)',
                  color: '#B87333',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#B87333'; e.currentTarget.style.color = '#1A1A1A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(184,115,51,0.12)'; e.currentTarget.style.color = '#B87333'; }}
              >
                SET
              </button>
            </div>

            {/* Preset tier chips */}
            <div className="flex flex-wrap gap-2">
              {BULK_TIERS.map((tier) => {
                const isActive = item.quantity === tier.qty;
                return (
                  <motion.button
                    key={tier.qty}
                    onClick={() => applyTier(tier.qty, tier.discount)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? '#B87333'                      : 'rgba(184,115,51,0.06)',
                      color:           isActive ? '#1A1A1A'                      : 'rgba(184,115,51,0.85)',
                      border:          isActive ? '1px solid #B87333'            : '1px solid rgba(184,115,51,0.22)',
                      cursor: 'pointer',
                    }}
                  >
                    {tier.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Volume discount notice banner */}
            <AnimatePresence>
              {volumeDiscount && (
                <motion.div
                  key="vd-banner"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div
                    className="flex items-center gap-2 px-3 py-2"
                    style={{
                      backgroundColor: 'rgba(184,115,51,0.08)',
                      borderLeft: '2px solid #B87333',
                    }}
                  >
                    <span style={{ color: '#B87333', fontSize: '10px' }}>◆</span>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: '#B87333' }}>
                      Large Scale Production Tier Applied
                    </p>
                    <span className="ml-auto text-[8px] font-mono" style={{ color: 'rgba(184,115,51,0.55)' }}>
                      1,000+ units
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* end Bulk Quantity Modifier Block */}

        </div>
        {/* end quantity divider */}

      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // State for controlling the quotation receipt workflow
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedManifest, setGeneratedManifest] = useState(null);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const [submitError,      setSubmitError]      = useState('');

  // Form submission — posts to real backend, creates a live PENDING order
  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    const form = e.target.elements;
    const companyName    = form.companyName.value.trim();
    const repName        = form.repName.value.trim();
    const email          = form.email.value.trim();
    const deliveryWindow = form.deliveryWindow.value.trim();

    if (!companyName || !repName || !email) {
      setSubmitError('Please fill in all required fields before dispatching.');
      return;
    }

    // Build items array — uses dbId (real DB product ID) stored on each cart item
    const items = cart.map((item) => ({
      productId: item.dbId ?? item.id,          // dbId from live fetch; id as fallback
      colorName: item.selectedColor || 'Black',
      qty:       item.quantity,
    }));

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch(`${API_BASE}/api/public/quote`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, fullName: repName, email, deliveryWindow, items }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      const confirmationDetails = {
        orderId:        data.orderId,
        trackingNumber: data.trackingNumber,
        company:        companyName,
        email,
        deliveryWindow,
        items: [...cart],
      };

      setGeneratedManifest(confirmationDetails);
      setShowSuccessModal(true);
      clearCart();
    } catch (err) {
      setSubmitError(err.message || 'Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#1A1A1A] py-32 px-6 text-left selection:bg-[#B87333]/30 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-6">
          <Link to="/" className="text-[10px] uppercase tracking-[0.25em] text-[#B87333] hover:text-[#FAF7F2] transition-colors font-bold">
            ← Return to Main Showroom
          </Link>
        </div>

        <div className="pb-6 mb-16 border-b border-[#B87333]/15">
          <span className="text-[#B87333] text-[10px] font-semibold tracking-[0.35em] uppercase mb-2 block">
            Procurement Desk
          </span>
          <h1 className="text-4xl font-serif text-[#FFFFFF] tracking-wide">
            Request Production Quotation
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Manifest List */}
          <div className="lg:col-span-2 space-y-6">
            {!cart || cart.length === 0 ? (
              <div className="border border-[#B87333]/15 p-12 text-center rounded-sm bg-[#1e1e1e]">
                <p className="text-[#FAF7F2]/40 text-xs tracking-widest uppercase">Your quote request is currently empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <CartItemRow
                  key={`${item.id}-${item.selectedColor}`}
                  item={item}
                  onUpdate={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Right Dispatch Card Panel */}
          <div className="bg-[#222222] p-8 border border-[#B87333]/10 rounded-sm shadow-xl">
            <h2 className="text-xl font-serif text-[#FFFFFF] tracking-wide mb-8">
              Procurement Routing
            </h2>

            <form className="space-y-6" onSubmit={handleQuotationSubmit}>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-[#B87333] font-bold mb-2">
                  Corporate Identity *
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name Ltd."
                  className="w-full bg-transparent border-b border-[#FAF7F2]/15 py-2 text-sm text-[#FAF7F2] tracking-wide placeholder-[#FAF7F2]/20 focus:outline-none focus:border-[#B87333] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-[#B87333] font-bold mb-2">
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  name="repName"
                  placeholder="Your Full Name"
                  className="w-full bg-transparent border-b border-[#FAF7F2]/15 py-2 text-sm text-[#FAF7F2] tracking-wide placeholder-[#FAF7F2]/20 focus:outline-none focus:border-[#B87333] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-[#B87333] font-bold mb-2">
                  Representative Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="procurement@company.com"
                  className="w-full bg-transparent border-b border-[#FAF7F2]/15 py-2 text-sm text-[#FAF7F2] tracking-wide placeholder-[#FAF7F2]/20 focus:outline-none focus:border-[#B87333] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-[#B87333] font-bold mb-2">
                  Target Delivery Window
                </label>
                <input
                  type="text"
                  name="deliveryWindow"
                  placeholder="Q3 Production Slot / Flexible"
                  className="w-full bg-transparent border-b border-[#FAF7F2]/15 py-2 text-sm text-[#FAF7F2] tracking-wide placeholder-[#FAF7F2]/20 focus:outline-none focus:border-[#B87333] transition-colors"
                />
              </div>

              {/* Error feedback */}
              <AnimatePresence>
                {submitError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] tracking-wide"
                    style={{ color: '#ef4444' }}
                  >
                    {submitError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!cart || cart.length === 0 || isSubmitting}
                  className="w-full bg-[#B87333] hover:bg-[#A05A22] disabled:bg-neutral-700 disabled:text-neutral-500 text-[#1A1A1A] font-bold uppercase text-[10px] tracking-[0.25em] py-4 transition-colors duration-300 rounded-xs cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching...' : 'Proceed to Get Quotation'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* OVERLAY POPUP MODAL: Production Status & Order Tracking Timeline Screen */}
      <AnimatePresence>
        {showSuccessModal && generatedManifest && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="bg-[#1A1A1A] border border-[#B87333]/30 max-w-2xl w-full p-8 md:p-12 text-left rounded-sm relative shadow-2xl"
            >
              <div className="mb-6 flex justify-between items-start border-b border-[#B87333]/15 pb-4">
                <div>
                  <span className="text-xs font-mono tracking-widest text-[#B87333] font-bold uppercase">
                    Quotation Request Logged
                  </span>
                  <h2 className="text-2xl font-serif text-white mt-1">
                    Manifest {generatedManifest.orderId}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] uppercase tracking-widest text-white/40">Tracking Reference</span>
                  <span className="font-mono text-xs text-[#FAF7F2] bg-white/5 px-2 py-1 rounded-xs block mt-1 font-bold">
                    {generatedManifest.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Disclaimer Note */}
              <p className="text-[11px] text-[#FAF7F2]/70 leading-relaxed font-light mb-8 antialiased bg-[#FAF7F2]/5 p-4 border-l border-[#B87333]">
                <strong className="text-[#B87333] uppercase font-bold text-[9px] tracking-wider block mb-1">Corporate Notice:</strong>
                Your batch file request has been dispatched to our operations line managers. An automated digital verification manifest is routing to <span className="text-white font-medium">{generatedManifest.email}</span> within the hour. No upfront payment processing is required at this gate.
              </p>

              {/* LIVE PRODUCTION TIMELINE TRACKER COMPONENT */}
              <div className="mb-10">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#B87333] mb-6">
                  Live Operations Status & Timeline
                </h4>
                
                <div className="relative border-l border-white/10 pl-6 space-y-6 ml-2">
                  {/* Step 1: Active */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#B87333] ring-4 ring-[#B87333]/20 flex items-center justify-center text-[7px] text-[#1A1A1A] font-bold">✓</div>
                    <p className="text-xs text-white font-medium tracking-wide">Quotation File Received</p>
                    <p className="text-[10px] text-white/40 font-mono mt-0.5">Processed Just Now // Queue Alpha</p>
                  </div>

                  {/* Step 2: Pending */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] border-2 border-white/20 flex items-center justify-center" />
                    <p className="text-xs text-white/50 font-light tracking-wide">Manager Technical Spec Audit</p>
                    <p className="text-[10px] text-white/20 font-mono mt-0.5">Estimated Duration: 12-24 Hours</p>
                  </div>

                  {/* Step 3: Pending */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] border-2 border-white/20 flex items-center justify-center" />
                    <p className="text-xs text-white/50 font-light tracking-wide">Cost Evaluation & Pricing Delivery</p>
                    <p className="text-[10px] text-white/20 font-mono mt-0.5">Direct Proforma Invoice Generation</p>
                  </div>

                  {/* Step 4: Pending */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1A1A1A] border-2 border-white/20 flex items-center justify-center" />
                    <p className="text-xs text-white/50 font-light tracking-wide">Production Allocation Dispatch</p>
                    <p className="text-[10px] text-white/20 font-mono mt-0.5">Estimated Fulfillment Window: 7-14 Manufacturing Days</p>
                  </div>
                </div>
              </div>

              {/* Close controls wrapper */}
              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="bg-[#B87333] hover:bg-[#A05A22] text-[#1A1A1A] font-bold uppercase text-[10px] tracking-widest py-3 px-8 transition-colors rounded-xs cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default CheckoutPage;
