// src/components/Catalog.jsx
import React from "react";
import { Link } from "react-router-dom";
// ─── Collection Dataset ────────────────────────────────────────────────────────
const collections = [
  {
    id: "apparel",
    label: "APPAREL",
    accent: "01",
    headline: "Apparel Collection",
    subtitle:
      "Premium fabrications engineered for brand identity. From corporate gifting programs to bespoke bulk orders — curated with precision for the discerning enterprise.",
    cta: "Explore Collection Index",
    href: "/material/apparel",
    // Luxury folded premium garments — dark ambient textile
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Luxury folded premium garments — dark textile editorial",
  },
  {
    id: "uniforms",
    label: "WORKWEAR",
    accent: "02",
    headline: "Uniform & Workwear",
    subtitle:
      "Functional excellence meets institutional authority. Designed for durability, compliance, and the unmistakable visual language of professional-grade operations.",
    cta: "Explore Collection Index",
    href: "/material/uniforms",
    // Heavy-duty technical workwear / industrial uniform textures
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Heavy-duty technical workwear and industrial uniform textures",
  },
  {
    id: "sportswear",
    label: "SPORTSWEAR",
    accent: "03",
    headline: "Sportswear Collection",
    subtitle:
      "High-performance athletic wear built for team identity and training environments. Technical textiles with scalable customization for teams and enterprises alike.",
    cta: "Explore Collection Index",
    href: "/material/sportswear",
    // Athletic training performance gear — dark studio
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Athletic training performance gear in a dark studio setting",
  },
];
// ─── Page Component ────────────────────────────────────────────────────────────
export default function Catalog() {
  return (
    <main
      style={{ backgroundColor: "#1A1A1A", minHeight: "100vh" }}
      className="w-full"
    >
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pt-20 pb-10">
        <p
          className="text-xs tracking-[0.35em] font-light mb-3"
          style={{ color: "#B87333" }}
        >
          PRODUCT DIRECTORY
        </p>
        <h1
          className="text-4xl md:text-5xl font-extralight leading-tight"
          style={{ color: "#FAF7F2", letterSpacing: "0.02em" }}
        >
          Collection Index
        </h1>
        <div
          className="mt-5 w-12 h-px"
          style={{ backgroundColor: "#B87333", opacity: 0.7 }}
        />
        <p
          className="mt-5 max-w-xl text-sm font-light leading-relaxed"
          style={{ color: "#FAF7F2", opacity: 0.5 }}
        >
          Select a business vector below to access the full product index for
          that category. All collections support bulk procurement and corporate
          customization.
        </p>
      </section>
      {/* ── Divider ─────────────────────────────────────────────────────────── */}
      <div
        className="max-w-screen-xl mx-auto px-6"
        style={{ borderTop: "1px solid rgba(184,115,51,0.15)" }}
      />
      {/* ── 3-Column Grid ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>
      {/* ── Footer Note ─────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-6 pb-20">
        <p
          className="text-xs tracking-widest font-light"
          style={{ color: "#FAF7F2", opacity: 0.2 }}
        >
          ALL COLLECTIONS AVAILABLE FOR WHOLESALE &amp; CUSTOM ORDER INQUIRIES
        </p>
      </section>
    </main>
  );
}
// ─── CollectionCard ────────────────────────────────────────────────────────────
function CollectionCard({ collection }) {
  const { label, headline, subtitle, cta, href, accent, image, imageAlt } =
    collection;
  return (
    <article
      className="group relative flex flex-col transition-all duration-500"
      style={{
        backgroundColor: "#111111",
        border: "1px solid rgba(184,115,51,0.13)",
      }}
    >
      {/* ── IMAGE BLOCK ─────────────────────────────────────────────────────── */}
      {/*
        overflow-hidden on the wrapper clips the scale(1.1) transform so the
        image never bleeds outside the card boundary.
      */}
      <div
        className="relative overflow-hidden"
        style={{ height: "220px" }}
      >
        {/* The image — scales up on group hover for the luxury showroom feel */}
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Dark ambient gradient overlay — keeps the image moody */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(17,17,17,0.25) 0%, rgba(17,17,17,0.65) 100%)",
          }}
        />
        {/* Ghost index number — floats top-right inside the image */}
        <span
          className="absolute top-4 right-4 text-5xl font-extralight leading-none select-none pointer-events-none"
          style={{ color: "#FAF7F2", opacity: 0.12 }}
        >
          {accent}
        </span>
        {/* Category pill — bottom-left of image */}
        <span
          className="absolute bottom-4 left-5 text-[10px] tracking-[0.3em] font-light px-2 py-1"
          style={{
            color: "#B87333",
            backgroundColor: "rgba(17,17,17,0.75)",
            border: "1px solid rgba(184,115,51,0.3)",
            letterSpacing: "0.28em",
          }}
        >
          {label}
        </span>
      </div>
      {/* ── TYPOGRAPHY BLOCK ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-7">
        {/* Editorial Headline */}
        <h2
          className="text-2xl font-extralight leading-snug mb-3"
          style={{ color: "#FAF7F2", letterSpacing: "0.02em" }}
        >
          {headline}
        </h2>
        {/* Gold separator — expands on hover */}
        <div
          className="w-8 h-px mb-5 transition-all duration-500 group-hover:w-14"
          style={{ backgroundColor: "#B87333" }}
        />
        {/* Corporate subtitle */}
        <p
          className="text-sm font-light leading-relaxed flex-1"
          style={{ color: "#FAF7F2", opacity: 0.48 }}
        >
          {subtitle}
        </p>
        {/* ── CTA Link ────────────────────────────────────────────────────── */}
        <div
          className="mt-6 pt-5"
          style={{ borderTop: "1px solid rgba(184,115,51,0.1)" }}
        >
          <Link
            to={href}
            className="inline-flex items-center gap-3 text-[11px] font-light uppercase"
            style={{ color: "#B87333", textDecoration: "none" }}
          >
            <span
              className="pb-px transition-all duration-400"
              style={{
                letterSpacing: "0.22em",
                borderBottom: "1px solid rgba(184,115,51,0.35)",
                transition:
                  "letter-spacing 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.letterSpacing = "0.30em";
                e.currentTarget.style.borderColor = "rgba(184,115,51,0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.letterSpacing = "0.22em";
                e.currentTarget.style.borderColor = "rgba(184,115,51,0.35)";
              }}
            >
              {cta}
            </span>
            <span style={{ color: "#B87333", opacity: 0.65, fontSize: "1rem" }}>
              →
            </span>
          </Link>
        </div>
      </div>
      {/* ── Hover border glow overlay ────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: "1px solid rgba(184,115,51,0.4)" }}
      />
    </article>
  );
}