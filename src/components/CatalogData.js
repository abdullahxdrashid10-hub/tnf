// ============================================================
// CatalogData.js  ·  B2B Merchandising Catalog — 65 Products
// Categories: Apparel | Uniform & Workwear | Sportswear
// ============================================================

// ─────────────────────────────────────────────────────────────
// § 1  DYNAMIC IMAGE RESOLVER  (Vite-native, zero manual imports)
// ─────────────────────────────────────────────────────────────
//
// Vite's `import.meta.url` pattern resolves local assets at
// build time without static import statements.  Assets MUST
// live in `src/assets/` and follow the naming convention:
//   prod-1.jpg  ·  prod-2.jpg  ·  …  ·  prod-65.jpg
//
// Usage anywhere in this file:
//   image: getProductImage(1)   →  resolved URL for prod-1.jpg
//
// If an image file is missing Vite will still compile; the URL
// simply won't resolve at runtime — swap the fallback string
// below to any placeholder you prefer.
// ─────────────────────────────────────────────────────────────

/**
 * Dynamically resolves a sequential product image from src/assets/.
 * @param {number} id  - The product's sequential id (1 – 65).
 * @returns {string}   - Absolute URL for use in <img src={...} />.
 */
export function getProductImage(id) {
  try {
    return new URL(`../assets/prod-${id}.jpg`, import.meta.url).href;
  } catch {
    // Fallback: a neutral placeholder while local assets are being added.
    return `https://picsum.photos/seed/prod${id}/400/300`;
  }
}


// ─────────────────────────────────────────────────────────────
// § 2  CATALOG_PRODUCTS  —  Master Inventory Array
// ─────────────────────────────────────────────────────────────
//
// Schema per item:
//  id          {number}   Unique sequential identifier (1 – 65)
//  name        {string}   Elegant product title
//  price       {string}   Sizing / MOQ / quote tier label
//  category    {string}   Top-level filter token (exact match required)
//  subCategory {string}   Secondary filter token
//  description {string}   Premium B2B product overview
//  standardColors {string[]} Available stock colour finishes
//  image       {string}   Dynamically resolved asset URL via getProductImage()
// ─────────────────────────────────────────────────────────────

export const CATALOG_PRODUCTS = [

  // ── Sample 1  ·  Apparel › Casual Wear ─────────────────────
  {
    id: 1,
    name: "Signature Pullover Hoodie",
    price: "From $24.99 / unit",
    category: "apparel",
    subCategory: "Casual Wear",
    description:
      "Crafted from a premium 320 gsm cotton-polyester blend, this mid-weight pullover hoodie delivers an elevated street-ready silhouette for retail and corporate gifting alike. Features a kangaroo pocket, ribbed cuffs, and a double-layered hood — all customisable with embroidered or screen-printed branding. MOQ 24 units.",
    standardColors: ["Navy Blue", "Jet Black", "Charcoal", "Forest Green", "Burgundy"],
    image: getProductImage(1),
  },

  // ── Sample 2  ·  Apparel › Loungewear ──────────────────────
  {
    id: 8,
    name: "Urban Comfort Sweatshirt",
    price: "From $22.99 / unit",
    category: "apparel",
    subCategory: "Loungewear",
    description:
      "A relaxed-fit crewneck sweatshirt engineered for all-day comfort. The 300 gsm fleece-backed fabric offers superior warmth without bulk, making it ideal for branded corporate loungewear sets or retail collections. Available in gender-neutral sizing XS – 5XL with heat-transfer or embroidery customisation options.",
    standardColors: ["Heather Grey", "Jet Black", "Dusty Rose", "Navy Blue", "Sage Green"],
    image: getProductImage(8),
  },

  // ── Sample 3  ·  Uniform & Workwear › Industrial ───────────
  {
    id: 19,
    name: "Pro-Shield Industrial Coverall",
    price: "From $49.99 / unit",
    category: "uniforms",
    subCategory: "Industrial Workwear",
    description:
      "Heavy-duty 280 gsm polycotton coverall built for demanding site environments. Reinforced double-stitched seams, multiple zipped tool pockets, and pre-shrunk fabric ensure lasting performance across washes. Fully compliant with EN 340 general workwear standards. Available with hi-vis reflective tape upgrade. MOQ 12 units.",
    standardColors: ["Navy Blue", "Royal Blue", "Khaki", "Charcoal", "Safety Orange"],
    image: getProductImage(19),
  },

  // ── Sample 4  ·  Uniform & Workwear › Hospitality ──────────
  {
    id: 30,
    name: "Executive Chef Coat",
    price: "From $34.99 / unit",
    category: "uniforms",
    subCategory: "Hospitality Uniforms",
    description:
      "A classic double-breasted chef coat tailored from a breathable 200 gsm poly-cotton twill. Knotted cloth buttons, mandarin collar, and vented back panel maintain a sharp culinary aesthetic under kitchen pressure. Embroidery-ready breast pocket for restaurant logo or chef name. Sizes XS – 4XL. MOQ 6 units.",
    standardColors: ["Classic White", "Jet Black", "Charcoal", "Royal Blue", "Burgundy"],
    image: getProductImage(30),
  },

  // ── Sample 5  ·  Sportswear › Teamwear ─────────────────────
  {
    id: 43,
    name: "Elite Football Jersey",
    price: "From $29.99 / unit",
    category: "sportswear",
    subCategory: "Teamwear",
    description:
      "Performance sublimation-print football jersey produced from 140 gsm moisture-wicking polyester interlock. Seamless underarm panels maximise range of motion while laser-perforated mesh zones promote airflow. Full-custom sublimation allows unlimited colourways, team numbers, and sponsor logos with zero MOQ restriction on artwork. MOQ 14 units per design.",
    standardColors: ["Royal Blue", "Vibrant Red", "Pure White", "Jet Black", "Vibrant Yellow"],
    image: getProductImage(43),
  },

];


// ─────────────────────────────────────────────────────────────
// § 3  SCAFFOLD LOOP  —  Generating Remaining Items (ids 2-7,
//      9-18, 20-29, 31-42, 44-65)
// ─────────────────────────────────────────────────────────────
//
// When you are ready to fill the rest of the array, un-comment
// and adapt the pattern below.  It lets you copy-paste product
// data incrementally without touching the structure above.
//
// OPTION A — Minimal loop scaffold (fill `rawData` yourself):
// ─────────────────────────────────────────────────────────────
//
// const rawData = [
//   // Paste rows here — one object per product, in order.
//   // Each row needs only the fields that differ; shared defaults
//   // are merged in the map() below.
//   { id: 2,  name: "Classic T-Shirt",          price: "From $12.99 / unit", category: "apparel",    subCategory: "Casual Wear",         description: "...", standardColors: ["White","Black","Navy Blue","Grey Melange","Sky Blue"]   },
//   { id: 3,  name: "Premium Polo Shirt",        price: "From $19.99 / unit", category: "apparel",    subCategory: "Casual Wear",         description: "...", standardColors: ["White","Navy Blue","Royal Blue","Black","Bottle Green"] },
//   { id: 9,  name: "Fleece Joggers",            price: "From $19.99 / unit", category: "apparel",    subCategory: "Loungewear",          description: "...", standardColors: ["Charcoal","Black","Heather Grey","Navy Blue","Oatmeal"] },
//   { id: 44, name: "Pro Basketball Jersey",     price: "From $27.99 / unit", category: "sportswear", subCategory: "Teamwear",            description: "...", standardColors: ["Red","Black","Royal Blue","Purple","Gold"]              },
//   // … continue for all remaining ids …
// ];
//
// const generatedProducts = rawData.map((item) => ({
//   ...item,
//   image: getProductImage(item.id),   // ← auto-resolves the asset
// }));
//
// // Merge into the master array:
// export const ALL_CATALOG_PRODUCTS = [...CATALOG_PRODUCTS, ...generatedProducts];
//
// ─────────────────────────────────────────────────────────────
// OPTION B — Quick sequential placeholder generator
//            (useful for UI layout testing before real data):
// ─────────────────────────────────────────────────────────────
//
// const placeholderIds = [2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,
//   20,21,22,23,24,25,26,27,28,29,31,32,33,34,35,36,37,38,39,40,
//   41,42,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,
//   62,63,64,65];
//
// const placeholders = placeholderIds.map((id) => ({
//   id,
//   name:        `Product ${id}`,
//   price:       "Quote on Request",
//   category:    "apparel",
//   subCategory: "Casual Wear",
//   description: `Placeholder description for product ${id}. Replace with final copy.`,
//   standardColors: ["Black", "White", "Navy Blue"],
//   image:       getProductImage(id),
// }));


// ─────────────────────────────────────────────────────────────
// § 4  LEGACY EXPORT  (keeps CollectionPage.jsx unchanged)
// ─────────────────────────────────────────────────────────────
//
// The full 65-item `catalogData` array is preserved below so
// that any existing import { catalogData } or import catalogData
// statements continue to work without modification.
// ─────────────────────────────────────────────────────────────

export const catalogData = [

  // ============================================================
  // APPAREL COLLECTION
  // ============================================================

  // ── Casual Wear ─────────────────────────────────────────────

  {
    id: 1,
    name: "Hoodies",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$24.99",
    image: getProductImage(1),
    localImageName: "prod-1.jpg",
    standardColors: ["Navy Blue", "Black", "Charcoal", "Forest Green", "Burgundy"],
  },
  {
    id: 2,
    name: "T-Shirts",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$12.99",
    image: getProductImage(2),
    localImageName: "prod-2.jpg",
    standardColors: ["White", "Black", "Navy Blue", "Grey Melange", "Sky Blue"],
  },
  {
    id: 3,
    name: "Polo Shirts",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$19.99",
    image: getProductImage(3),
    localImageName: "prod-3.jpg",
    standardColors: ["White", "Navy Blue", "Royal Blue", "Black", "Bottle Green"],
  },
  {
    id: 4,
    name: "Long Sleeve T-Shirts",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$16.99",
    image: getProductImage(4),
    localImageName: "prod-4.jpg",
    standardColors: ["Black", "White", "Heather Grey", "Navy Blue", "Olive Green"],
  },
  {
    id: 5,
    name: "Henley Shirts",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$18.99",
    image: getProductImage(5),
    localImageName: "prod-5.jpg",
    standardColors: ["Cream White", "Charcoal", "Slate Blue", "Burgundy", "Olive"],
  },
  {
    id: 6,
    name: "Zip-Up Hoodies",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$29.99",
    image: getProductImage(6),
    localImageName: "prod-6.jpg",
    standardColors: ["Black", "Charcoal", "Navy Blue", "Dark Red", "Stone Grey"],
  },
  {
    id: 7,
    name: "Casual Shirts",
    category: "Apparel",
    subCategory: "Casual Wear",
    price: "$21.99",
    image: getProductImage(7),
    localImageName: "prod-7.jpg",
    standardColors: ["Light Blue", "White", "Pale Pink", "Sage Green", "Mustard Yellow"],
  },

  // ── Loungewear ──────────────────────────────────────────────

  {
    id: 8,
    name: "Sweatshirts",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$22.99",
    image: getProductImage(8),
    localImageName: "prod-8.jpg",
    standardColors: ["Heather Grey", "Black", "Dusty Rose", "Navy Blue", "Sage Green"],
  },
  {
    id: 9,
    name: "Fleece Trousers / Joggers",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$19.99",
    image: getProductImage(9),
    localImageName: "prod-9.jpg",
    standardColors: ["Charcoal", "Black", "Heather Grey", "Navy Blue", "Oatmeal"],
  },
  {
    id: 10,
    name: "Sweatpants",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$17.99",
    image: getProductImage(10),
    localImageName: "prod-10.jpg",
    standardColors: ["Black", "Heather Grey", "Navy Blue", "Dark Olive", "Stone"],
  },
  {
    id: 11,
    name: "Shorts",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$14.99",
    image: getProductImage(11),
    localImageName: "prod-11.jpg",
    standardColors: ["Navy Blue", "Khaki", "Black", "Heather Grey", "Forest Green"],
  },
  {
    id: 12,
    name: "Tank Tops",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$11.99",
    image: getProductImage(12),
    localImageName: "prod-12.jpg",
    standardColors: ["White", "Black", "Heather Grey", "Navy Blue", "Blush Pink"],
  },
  {
    id: 13,
    name: "Pyjamas and Loungewear",
    category: "Apparel",
    subCategory: "Loungewear",
    price: "$26.99",
    image: getProductImage(13),
    localImageName: "prod-13.jpg",
    standardColors: ["Light Blue", "Cream White", "Soft Pink", "Sage Green", "Lavender"],
  },

  // ── Knitwear ────────────────────────────────────────────────

  {
    id: 14,
    name: "Jackets",
    category: "Apparel",
    subCategory: "Knitwear",
    price: "$39.99",
    image: getProductImage(14),
    localImageName: "prod-14.jpg",
    standardColors: ["Black", "Camel", "Navy Blue", "Olive Green", "Burgundy"],
  },
  {
    id: 15,
    name: "Vests",
    category: "Apparel",
    subCategory: "Knitwear",
    price: "$27.99",
    image: getProductImage(15),
    localImageName: "prod-15.jpg",
    standardColors: ["Camel", "Charcoal", "Navy Blue", "Burgundy", "Forest Green"],
  },
  {
    id: 16,
    name: "Chinos and Casual Trousers",
    category: "Apparel",
    subCategory: "Knitwear",
    price: "$29.99",
    image: getProductImage(16),
    localImageName: "prod-16.jpg",
    standardColors: ["Khaki", "Navy Blue", "Olive Green", "Stone", "Black"],
  },
  {
    id: 17,
    name: "Cargo Pants",
    category: "Apparel",
    subCategory: "Knitwear",
    price: "$31.99",
    image: getProductImage(17),
    localImageName: "prod-17.jpg",
    standardColors: ["Olive Green", "Black", "Khaki", "Charcoal", "Dark Navy"],
  },
  {
    id: 18,
    name: "Knitwear and Cardigans",
    category: "Apparel",
    subCategory: "Knitwear",
    price: "$34.99",
    image: getProductImage(18),
    localImageName: "prod-18.jpg",
    standardColors: ["Oatmeal", "Charcoal", "Camel", "Dusty Blue", "Burgundy"],
  },

  // ============================================================
  // UNIFORM & WORKWEAR COLLECTION
  // ============================================================

  // ── Industrial Workwear ─────────────────────────────────────

  {
    id: 19,
    name: "Coveralls",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$49.99",
    image: getProductImage(19),
    localImageName: "prod-19.jpg",
    standardColors: ["Navy Blue", "Royal Blue", "Khaki", "Charcoal", "Safety Orange"],
  },
  {
    id: 20,
    name: "Overalls",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$44.99",
    image: getProductImage(20),
    localImageName: "prod-20.jpg",
    standardColors: ["Denim Blue", "Black", "Khaki", "Olive Green", "Navy Blue"],
  },
  {
    id: 21,
    name: "Industrial Work Shirts",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$27.99",
    image: getProductImage(21),
    localImageName: "prod-21.jpg",
    standardColors: ["Navy Blue", "Royal Blue", "Khaki", "Grey", "Safety Orange"],
  },
  {
    id: 22,
    name: "Work Trousers",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$34.99",
    image: getProductImage(22),
    localImageName: "prod-22.jpg",
    standardColors: ["Navy Blue", "Black", "Khaki", "Charcoal", "Dark Grey"],
  },
  {
    id: 23,
    name: "Cargo Pants",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$36.99",
    image: getProductImage(23),
    localImageName: "prod-23.jpg",
    standardColors: ["Black", "Navy Blue", "Khaki", "Olive Green", "Charcoal"],
  },
  {
    id: 24,
    name: "Bib Overalls",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$42.99",
    image: getProductImage(24),
    localImageName: "prod-24.jpg",
    standardColors: ["Denim Blue", "Navy Blue", "Black", "Khaki", "Safety Orange"],
  },
  {
    id: 25,
    name: "Mechanic Uniforms",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$54.99",
    image: getProductImage(25),
    localImageName: "prod-25.jpg",
    standardColors: ["Dark Navy", "Black", "Grey", "Royal Blue", "Charcoal"],
  },
  {
    id: 26,
    name: "Fire-Retardant (FR) Coveralls",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$89.99",
    image: getProductImage(26),
    localImageName: "prod-26.jpg",
    standardColors: ["Navy Blue", "Khaki", "Safety Orange", "Royal Blue", "Charcoal"],
  },
  {
    id: 27,
    name: "Welding Jackets",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$64.99",
    image: getProductImage(27),
    localImageName: "prod-27.jpg",
    standardColors: ["Black", "Dark Navy", "Brown Leather", "Charcoal", "Dark Grey"],
  },
  {
    id: 28,
    name: "Welding Trousers",
    category: "Uniform & Workwear",
    subCategory: "Industrial Workwear",
    price: "$54.99",
    image: getProductImage(28),
    localImageName: "prod-28.jpg",
    standardColors: ["Black", "Dark Navy", "Charcoal", "Dark Grey", "Khaki"],
  },

  // ── Hospitality Uniforms ────────────────────────────────────

  {
    id: 29,
    name: "Hotel Staff Suiting",
    category: "Uniform & Workwear",
    subCategory: "Hospitality Uniforms",
    price: "$79.99",
    image: getProductImage(29),
    localImageName: "prod-29.jpg",
    standardColors: ["Black", "Charcoal", "Navy Blue", "Dark Burgundy", "Ivory White"],
  },
  {
    id: 30,
    name: "Chef Coats and Jackets",
    category: "Uniform & Workwear",
    subCategory: "Hospitality Uniforms",
    price: "$34.99",
    image: getProductImage(30),
    localImageName: "prod-30.jpg",
    standardColors: ["White", "Black", "Charcoal", "Royal Blue", "Burgundy"],
  },
  {
    id: 31,
    name: "Chef Aprons",
    category: "Uniform & Workwear",
    subCategory: "Hospitality Uniforms",
    price: "$18.99",
    image: getProductImage(31),
    localImageName: "prod-31.jpg",
    standardColors: ["Black", "White", "Striped Navy", "Dark Green", "Burgundy"],
  },
  {
    id: 32,
    name: "Housekeeping Uniforms",
    category: "Uniform & Workwear",
    subCategory: "Hospitality Uniforms",
    price: "$39.99",
    image: getProductImage(32),
    localImageName: "prod-32.jpg",
    standardColors: ["Pale Blue", "White", "Black", "Teal", "Lavender"],
  },
  {
    id: 33,
    name: "Waiter and Restaurant Uniforms",
    category: "Uniform & Workwear",
    subCategory: "Hospitality Uniforms",
    price: "$44.99",
    image: getProductImage(33),
    localImageName: "prod-33.jpg",
    standardColors: ["Black", "White", "Navy Blue", "Burgundy", "Forest Green"],
  },

  // ── Medical Uniforms ────────────────────────────────────────

  {
    id: 34,
    name: "Lab Coats",
    category: "Uniform & Workwear",
    subCategory: "Medical Uniforms",
    price: "$29.99",
    image: getProductImage(34),
    localImageName: "prod-34.jpg",
    standardColors: ["White", "Off-White", "Pale Blue", "Pale Pink", "Light Grey"],
  },
  {
    id: 35,
    name: "Medical Scrubs",
    category: "Uniform & Workwear",
    subCategory: "Medical Uniforms",
    price: "$27.99",
    image: getProductImage(35),
    localImageName: "prod-35.jpg",
    standardColors: ["Ceil Blue", "Navy Blue", "Hunter Green", "Charcoal", "Burgundy"],
  },

  // ── Corporate Uniforms ──────────────────────────────────────

  {
    id: 36,
    name: "Safari Suits",
    category: "Uniform & Workwear",
    subCategory: "Corporate Uniforms",
    price: "$69.99",
    image: getProductImage(36),
    localImageName: "prod-36.jpg",
    standardColors: ["Khaki", "Beige", "Olive Green", "Stone", "Sand"],
  },
  {
    id: 37,
    name: "Corporate Uniforms and Blazers",
    category: "Uniform & Workwear",
    subCategory: "Corporate Uniforms",
    price: "$89.99",
    image: getProductImage(37),
    localImageName: "prod-37.jpg",
    standardColors: ["Navy Blue", "Charcoal", "Black", "Royal Blue", "Mid Grey"],
  },

  // ── Safety Wear ─────────────────────────────────────────────

  {
    id: 38,
    name: "High Visibility (Hi-Vis) Jackets",
    category: "Uniform & Workwear",
    subCategory: "Safety Wear",
    price: "$34.99",
    image: getProductImage(38),
    localImageName: "prod-38.jpg",
    standardColors: ["Safety Yellow", "Safety Orange", "Lime Green", "Red", "Pink Hi-Vis"],
  },
  {
    id: 39,
    name: "Security Uniforms",
    category: "Uniform & Workwear",
    subCategory: "Safety Wear",
    price: "$59.99",
    image: getProductImage(39),
    localImageName: "prod-39.jpg",
    standardColors: ["Black", "Dark Navy", "Charcoal", "Midnight Blue", "Dark Olive"],
  },
  {
    id: 40,
    name: "Reflective Safety Vests",
    category: "Uniform & Workwear",
    subCategory: "Safety Wear",
    price: "$14.99",
    image: getProductImage(40),
    localImageName: "prod-40.jpg",
    standardColors: ["Safety Yellow", "Safety Orange", "Lime Green", "Red", "Blue"],
  },
  {
    id: 41,
    name: "Rain Suits and Waterproof Jackets",
    category: "Uniform & Workwear",
    subCategory: "Safety Wear",
    price: "$49.99",
    image: getProductImage(41),
    localImageName: "prod-41.jpg",
    standardColors: ["Safety Yellow", "Safety Orange", "Navy Blue", "Black", "Red"],
  },
  {
    id: 42,
    name: "Caps and Headwear",
    category: "Uniform & Workwear",
    subCategory: "Safety Wear",
    price: "$12.99",
    image: getProductImage(42),
    localImageName: "prod-42.jpg",
    standardColors: ["Black", "Navy Blue", "Safety Yellow", "White", "Royal Blue"],
  },

  // ============================================================
  // SPORTSWEAR COLLECTION
  // ============================================================

  // ── Teamwear ────────────────────────────────────────────────

  {
    id: 43,
    name: "Football Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$29.99",
    image: getProductImage(43),
    localImageName: "prod-43.jpg",
    standardColors: ["Royal Blue", "Red", "White", "Black", "Vibrant Yellow"],
  },
  {
    id: 44,
    name: "Basketball Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$27.99",
    image: getProductImage(44),
    localImageName: "prod-44.jpg",
    standardColors: ["Red", "Black", "Royal Blue", "Purple", "Gold"],
  },
  {
    id: 45,
    name: "Baseball Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$31.99",
    image: getProductImage(45),
    localImageName: "prod-45.jpg",
    standardColors: ["White", "Pinstripe White", "Grey", "Red", "Navy Blue"],
  },
  {
    id: 46,
    name: "Soccer Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$29.99",
    image: getProductImage(46),
    localImageName: "prod-46.jpg",
    standardColors: ["Royal Blue", "Red", "White", "Vibrant Green", "Black"],
  },
  {
    id: 47,
    name: "Cricket Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$26.99",
    image: getProductImage(47),
    localImageName: "prod-47.jpg",
    standardColors: ["White", "Sky Blue", "Vibrant Yellow", "Vibrant Green", "Navy Blue"],
  },
  {
    id: 48,
    name: "Rugby Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$34.99",
    image: getProductImage(48),
    localImageName: "prod-48.jpg",
    standardColors: ["Maroon", "Black", "Royal Blue", "Red", "Vibrant Green"],
  },
  {
    id: 49,
    name: "Volleyball Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$24.99",
    image: getProductImage(49),
    localImageName: "prod-49.jpg",
    standardColors: ["Royal Blue", "Red", "Vibrant Yellow", "White", "Black"],
  },
  {
    id: 50,
    name: "Cycling Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$39.99",
    image: getProductImage(50),
    localImageName: "prod-50.jpg",
    standardColors: ["Neon Yellow", "Neon Orange", "Royal Blue", "Red", "Black"],
  },
  {
    id: 51,
    name: "Sleeveless Jerseys",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$19.99",
    image: getProductImage(51),
    localImageName: "prod-51.jpg",
    standardColors: ["Royal Blue", "Red", "Black", "White", "Gold"],
  },
  {
    id: 52,
    name: "Teamwear Sets",
    category: "Sportswear",
    subCategory: "Teamwear",
    price: "$54.99",
    image: getProductImage(52),
    localImageName: "prod-52.jpg",
    standardColors: ["Royal Blue", "Red", "Black", "White", "Forest Green"],
  },

  // ── Training Wear ───────────────────────────────────────────

  {
    id: 53,
    name: "Compression Shirts",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$22.99",
    image: getProductImage(53),
    localImageName: "prod-53.jpg",
    standardColors: ["Black", "Navy Blue", "Royal Blue", "Charcoal", "White"],
  },
  {
    id: 54,
    name: "Compression Tights and Leggings",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$24.99",
    image: getProductImage(54),
    localImageName: "prod-54.jpg",
    standardColors: ["Black", "Navy Blue", "Charcoal", "Electric Blue", "Burgundy"],
  },
  {
    id: 55,
    name: "Training T-Shirts",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$17.99",
    image: getProductImage(55),
    localImageName: "prod-55.jpg",
    standardColors: ["Royal Blue", "Black", "Neon Green", "Red", "White"],
  },
  {
    id: 56,
    name: "Tank Tops",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$14.99",
    image: getProductImage(56),
    localImageName: "prod-56.jpg",
    standardColors: ["Black", "Royal Blue", "Red", "Neon Yellow", "White"],
  },
  {
    id: 57,
    name: "Warm-Up Suits",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$49.99",
    image: getProductImage(57),
    localImageName: "prod-57.jpg",
    standardColors: ["Navy Blue", "Black", "Royal Blue", "Red", "Forest Green"],
  },
  {
    id: 58,
    name: "Running Shorts",
    category: "Sportswear",
    subCategory: "Training Wear",
    price: "$16.99",
    image: getProductImage(58),
    localImageName: "prod-58.jpg",
    standardColors: ["Black", "Royal Blue", "Neon Orange", "Red", "White"],
  },

  // ── Performance Wear ────────────────────────────────────────

  {
    id: 59,
    name: "Performance Polo Shirts",
    category: "Sportswear",
    subCategory: "Performance Wear",
    price: "$26.99",
    image: getProductImage(59),
    localImageName: "prod-59.jpg",
    standardColors: ["Royal Blue", "White", "Black", "Red", "Navy Blue"],
  },

  // ── Athleisure Wear ─────────────────────────────────────────

  {
    id: 60,
    name: "Hoodies",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$34.99",
    image: getProductImage(60),
    localImageName: "prod-60.jpg",
    standardColors: ["Black", "Grey Melange", "Navy Blue", "Neon Green", "Burgundy"],
  },
  {
    id: 61,
    name: "Sweatshirts",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$28.99",
    image: getProductImage(61),
    localImageName: "prod-61.jpg",
    standardColors: ["Grey Melange", "Black", "Navy Blue", "Pale Lilac", "Forest Green"],
  },
  {
    id: 62,
    name: "Jackets",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$44.99",
    image: getProductImage(62),
    localImageName: "prod-62.jpg",
    standardColors: ["Black", "Navy Blue", "Neon Yellow", "Royal Blue", "Charcoal"],
  },
  {
    id: 63,
    name: "Tracksuits",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$59.99",
    image: getProductImage(63),
    localImageName: "prod-63.jpg",
    standardColors: ["Black", "Navy Blue", "Royal Blue", "Red", "Grey Melange"],
  },
  {
    id: 64,
    name: "Shorts",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$18.99",
    image: getProductImage(64),
    localImageName: "prod-64.jpg",
    standardColors: ["Black", "Navy Blue", "Grey Melange", "Neon Orange", "Forest Green"],
  },
  {
    id: 65,
    name: "Track Pants",
    category: "Sportswear",
    subCategory: "Athleisure Wear",
    price: "$29.99",
    image: getProductImage(65),
    localImageName: "prod-65.jpg",
    standardColors: ["Black", "Navy Blue", "Grey Melange", "Royal Blue", "Forest Green"],
  },
];

export default catalogData;
