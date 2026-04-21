import drill from "@/assets/prod-drill.jpg";
import gloves from "@/assets/prod-gloves.jpg";
import helmet from "@/assets/prod-helmet.jpg";
import goggles from "@/assets/prod-goggles.jpg";
import bolts from "@/assets/prod-bolts.jpg";
import cord from "@/assets/prod-cord.jpg";
import multimeter from "@/assets/prod-multimeter.jpg";
import cleaner from "@/assets/prod-cleaner.jpg";
import toolbox from "@/assets/prod-toolbox.jpg";
import light from "@/assets/prod-light.jpg";
import tape from "@/assets/prod-tape.jpg";

export type Category = {
  slug: string;
  name: string;
  description: string;
  count: number;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  categoryName: string;
  price: number;
  listPrice?: number;
  bulkPrice?: { qty: number; price: number };
  image: string;
  rating: number;
  reviews: number;
  stock: "in" | "low" | "out";
  stockCount: number;
  shipsIn: string;
  badges?: string[];
  specs: { label: string; value: string }[];
  description: string;
  features: string[];
  uom: string; // unit of measure
  minOrder: number;
};

export const categories: Category[] = [
  { slug: "power-tools", name: "Power Tools", description: "Drills, drivers, saws & accessories", count: 1248 },
  { slug: "safety-ppe", name: "Safety & PPE", description: "Gloves, helmets, eye & ear protection", count: 942 },
  { slug: "fasteners", name: "Fasteners & Hardware", description: "Bolts, nuts, screws, anchors", count: 3104 },
  { slug: "electrical", name: "Electrical", description: "Cords, meters, wiring, lighting", count: 1820 },
  { slug: "cleaning", name: "Cleaning & Janitorial", description: "Chemicals, supplies, equipment", count: 612 },
  { slug: "hand-tools", name: "Hand Tools & Storage", description: "Wrenches, sockets, tool boxes", count: 1456 },
];

export const products: Product[] = [
  {
    id: "p1", sku: "PMR-PD-2401", slug: "20v-cordless-hammer-drill",
    name: "20V Max Cordless Hammer Drill Kit", brand: "ForgeWorks",
    category: "power-tools", categoryName: "Power Tools",
    price: 189.5, listPrice: 229.0, bulkPrice: { qty: 6, price: 169.0 },
    image: drill, rating: 4.7, reviews: 1284,
    stock: "in", stockCount: 84, shipsIn: "Ships today",
    badges: ["Best Seller"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Voltage", value: "20V Max" }, { label: "Chuck", value: "1/2 in" },
      { label: "Torque", value: "650 in-lb" }, { label: "Battery", value: "2 × 4.0Ah Li-Ion" },
    ],
    description: "Professional 20V cordless hammer drill with brushless motor, 2-speed transmission and integrated LED. Ships with two batteries, charger and contractor bag.",
    features: ["Brushless motor — 57% longer runtime", "2-speed transmission (0–550 / 0–2,000 RPM)", "LED work light", "Belt hook & magnetic tray included"],
  },
  {
    id: "p2", sku: "PMR-SF-1102", slug: "cut-resistant-nitrile-gloves-12pk",
    name: "Cut-Resistant Nitrile-Coated Work Gloves (12 pk)", brand: "GuardLine",
    category: "safety-ppe", categoryName: "Safety & PPE",
    price: 32.4, bulkPrice: { qty: 12, price: 27.9 },
    image: gloves, rating: 4.8, reviews: 612,
    stock: "in", stockCount: 320, shipsIn: "Ships today",
    badges: ["ANSI A4"], uom: "PK", minOrder: 1,
    specs: [
      { label: "Cut level", value: "ANSI A4" }, { label: "Coating", value: "Nitrile foam" },
      { label: "Sizes", value: "S–XXL" }, { label: "Color", value: "Hi-vis orange" },
    ],
    description: "Pack of 12 pairs. ANSI A4 cut protection with breathable nitrile-coated palm. Touchscreen compatible fingertips.",
    features: ["ANSI/ISEA 105 A4 cut", "Touchscreen index & thumb", "Breathable HPPE liner", "Reinforced thumb saddle"],
  },
  {
    id: "p3", sku: "PMR-SF-2210", slug: "type-i-class-e-hard-hat-white",
    name: "Type I Class E Hard Hat — White", brand: "GuardLine",
    category: "safety-ppe", categoryName: "Safety & PPE",
    price: 24.95,
    image: helmet, rating: 4.6, reviews: 421,
    stock: "in", stockCount: 156, shipsIn: "Ships today",
    badges: ["ANSI Z89.1"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Type", value: "Type I" }, { label: "Class", value: "E (Electrical)" },
      { label: "Suspension", value: "4-point ratchet" }, { label: "Weight", value: "12 oz" },
    ],
    description: "Lightweight ANSI-rated hard hat with 4-point ratchet suspension and chin strap. Compatible with face shields & ear muffs.",
    features: ["ANSI Z89.1 Type I Class E", "4-point ratchet suspension", "Accessory slots", "Replaceable sweat band"],
  },
  {
    id: "p4", sku: "PMR-SF-3055", slug: "anti-fog-safety-goggles",
    name: "Anti-Fog Sealed Safety Goggles", brand: "GuardLine",
    category: "safety-ppe", categoryName: "Safety & PPE",
    price: 14.8, bulkPrice: { qty: 25, price: 11.5 },
    image: goggles, rating: 4.5, reviews: 298,
    stock: "in", stockCount: 540, shipsIn: "Ships today",
    uom: "EA", minOrder: 1,
    specs: [
      { label: "Lens", value: "Polycarbonate" }, { label: "Coating", value: "Anti-fog / scratch" },
      { label: "Standard", value: "ANSI Z87.1+" }, { label: "Fit", value: "Over-spec" },
    ],
    description: "Indirect-vent sealed goggles with anti-fog coating. Fits over most prescription glasses.",
    features: ["ANSI Z87.1+ impact rated", "Anti-fog & anti-scratch lens", "Indirect ventilation", "Adjustable strap"],
  },
  {
    id: "p5", sku: "PMR-FH-9012", slug: "stainless-hex-bolt-assortment",
    name: "Stainless Hex Bolt & Nut Assortment (500 pc)", brand: "Boltworks",
    category: "fasteners", categoryName: "Fasteners & Hardware",
    price: 78.0, bulkPrice: { qty: 4, price: 69.0 },
    image: bolts, rating: 4.7, reviews: 184,
    stock: "in", stockCount: 64, shipsIn: "Ships today",
    badges: ["Pro Pack"], uom: "KIT", minOrder: 1,
    specs: [
      { label: "Material", value: "304 Stainless" }, { label: "Sizes", value: "1/4″–1/2″" },
      { label: "Pieces", value: "500" }, { label: "Case", value: "Stackable bin" },
    ],
    description: "Comprehensive 500-piece stainless steel hex bolt and nut assortment in a stackable organizer.",
    features: ["304 grade stainless", "Sizes 1/4″ to 1/2″", "Reusable bin organizer", "Sorted by size & length"],
  },
  {
    id: "p6", sku: "PMR-EL-4408", slug: "heavy-duty-extension-cord-50ft",
    name: "Heavy-Duty Extension Cord — 50 ft, 12 AWG", brand: "VoltCore",
    category: "electrical", categoryName: "Electrical",
    price: 89.0, listPrice: 109.0,
    image: cord, rating: 4.8, reviews: 504,
    stock: "low", stockCount: 9, shipsIn: "Ships in 2 days",
    badges: ["UL Listed"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Length", value: "50 ft" }, { label: "Gauge", value: "12 AWG" },
      { label: "Amps", value: "15 A" }, { label: "Jacket", value: "SJTW outdoor" },
    ],
    description: "All-weather 50 ft contractor cord with lighted ends and reinforced strain relief.",
    features: ["12/3 SJTW rated −40°F", "Lighted plug ends", "UL listed", "Hi-vis orange jacket"],
  },
  {
    id: "p7", sku: "PMR-EL-7720", slug: "true-rms-digital-multimeter",
    name: "True-RMS Digital Multimeter — CAT III 600V", brand: "VoltCore",
    category: "electrical", categoryName: "Electrical",
    price: 142.5, bulkPrice: { qty: 5, price: 128.0 },
    image: multimeter, rating: 4.9, reviews: 372,
    stock: "in", stockCount: 41, shipsIn: "Ships today",
    badges: ["Pro Choice"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Display", value: "6000 count" }, { label: "Safety", value: "CAT III 600V" },
      { label: "True-RMS", value: "Yes" }, { label: "Warranty", value: "3 years" },
    ],
    description: "Auto-ranging True-RMS multimeter for AC/DC, capacitance, frequency, continuity and temperature.",
    features: ["True-RMS AC measurement", "Backlit display", "Includes silicone test leads", "3-year limited warranty"],
  },
  {
    id: "p8", sku: "PMR-CL-2014", slug: "industrial-cleaner-degreaser-kit",
    name: "Industrial Cleaner & Degreaser Kit", brand: "PureLine",
    category: "cleaning", categoryName: "Cleaning & Janitorial",
    price: 64.0,
    image: cleaner, rating: 4.4, reviews: 96,
    stock: "in", stockCount: 112, shipsIn: "Ships today",
    uom: "KIT", minOrder: 1,
    specs: [
      { label: "Volume", value: "1 gal + 32 oz" }, { label: "pH", value: "Neutral 7.0" },
      { label: "Type", value: "Concentrate" }, { label: "Use", value: "Floors / surfaces" },
    ],
    description: "Concentrated cleaner-degreaser bundle with reusable spray bottle for everyday facility maintenance.",
    features: ["Biodegradable formula", "1 gal makes 16 gal solution", "Safe on most surfaces", "Pleasant citrus scent"],
  },
  {
    id: "p9", sku: "PMR-HT-5501", slug: "27in-rolling-tool-cabinet",
    name: '27" 7-Drawer Rolling Tool Cabinet', brand: "ForgeWorks",
    category: "hand-tools", categoryName: "Hand Tools & Storage",
    price: 449.0, listPrice: 549.0,
    image: toolbox, rating: 4.7, reviews: 217,
    stock: "in", stockCount: 22, shipsIn: "Ships in 2 days",
    badges: ["Save $100"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Width", value: "27 in" }, { label: "Drawers", value: "7" },
      { label: "Capacity", value: "1,200 lb" }, { label: "Casters", value: "5″ swivel" },
    ],
    description: "Heavy-gauge steel rolling cabinet with ball-bearing slides, integral lock and 5″ industrial casters.",
    features: ["18-gauge steel construction", "Ball-bearing drawer slides", "Keyed central lock", "1,200 lb load capacity"],
  },
  {
    id: "p10", sku: "PMR-EL-9991", slug: "led-portable-work-light",
    name: "8000-Lumen LED Portable Work Light w/ Tripod", brand: "VoltCore",
    category: "electrical", categoryName: "Electrical",
    price: 159.0,
    image: light, rating: 4.6, reviews: 143,
    stock: "in", stockCount: 38, shipsIn: "Ships today",
    badges: ["New"], uom: "EA", minOrder: 1,
    specs: [
      { label: "Lumens", value: "8,000 lm" }, { label: "Power", value: "AC / 20V battery" },
      { label: "Height", value: "Up to 6 ft" }, { label: "IP", value: "IP54" },
    ],
    description: "Dual-power site light with adjustable tripod and 360° rotating heads.",
    features: ["8,000 lm output", "Dual AC / battery operation", "Foldable tripod", "IP54 weather resistant"],
  },
  {
    id: "p11", sku: "PMR-HT-1010", slug: "25ft-magnetic-tape-measure",
    name: "25 ft Magnetic Tape Measure", brand: "ForgeWorks",
    category: "hand-tools", categoryName: "Hand Tools & Storage",
    price: 22.0, bulkPrice: { qty: 10, price: 18.5 },
    image: tape, rating: 4.5, reviews: 318,
    stock: "in", stockCount: 210, shipsIn: "Ships today",
    uom: "EA", minOrder: 1,
    specs: [
      { label: "Length", value: "25 ft" }, { label: "Blade", value: "1-1/4 in nylon" },
      { label: "Hook", value: "Magnetic" }, { label: "Standout", value: "11 ft" },
    ],
    description: "Contractor-grade 25 ft tape measure with magnetic hook and rubber-overmold case.",
    features: ["Magnetic dual hook", "11 ft standout", "Nylon-coated blade", "Belt clip"],
  },
  {
    id: "p12", sku: "PMR-FH-9020", slug: "concrete-anchor-kit",
    name: "Concrete Wedge Anchor Kit (100 pc)", brand: "Boltworks",
    category: "fasteners", categoryName: "Fasteners & Hardware",
    price: 54.0,
    image: bolts, rating: 4.6, reviews: 87,
    stock: "in", stockCount: 76, shipsIn: "Ships today",
    uom: "KIT", minOrder: 1,
    specs: [
      { label: "Material", value: "Zinc-plated steel" }, { label: "Sizes", value: "3/8″ × 3″" },
      { label: "Pieces", value: "100" }, { label: "Use", value: "Concrete / masonry" },
    ],
    description: "100-piece zinc-plated wedge anchor kit for medium-duty concrete fastening.",
    features: ["Zinc plating for corrosion resistance", "Includes nuts & washers", "Ideal for concrete & masonry", "Reusable case"],
  },
];

export const brands = ["ForgeWorks", "GuardLine", "VoltCore", "Boltworks", "PureLine"];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const getRelated = (p: Product, n = 4) =>
  products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, n);
