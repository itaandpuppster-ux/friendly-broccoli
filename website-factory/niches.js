// niches.js — the 5 brand kits that match the cold-call playbook.
// Each niche is a self-contained kit: colors, fonts, copy, service cards with
// custom SVG icons, real photo URLs (Unsplash CDN), and trust badges.
//
// Photos load in a real browser. If a photo ever fails, the template falls back
// to a hand-built SVG "mesh" scene so the page never shows a broken image.

// A few reusable inline SVG icons (stroke-based, inherit color).
const I = {
  sparkle: 'M12 2l1.8 5.5L19 9l-5.2 1.5L12 16l-1.8-5.5L5 9l5.2-1.5z',
  leaf: 'M5 21c0-9 5-14 14-14 0 9-5 14-14 14zM5 21c3-3 6-5 9-6',
  shield: 'M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z',
  plate: 'M12 3v9m0 0a3 3 0 100-.01M4 3c0 4 1 6 3 6M20 3c0 4-1 6-3 6M4 3v18M20 3v18',
  tooth: 'M7 3c-2 0-3 2-3 5 0 5 1 6 2 10 .6 2.4 2.4 2.4 3-.5.4-2 .6-3 1-3s.6 1 1 3c.6 2.9 2.4 2.9 3 .5 1-4 2-5 2-10 0-3-1-5-3-5-2 0-2 1-4 1s-2-1-4-1z',
  drop: 'M12 3c3 4 6 7 6 11a6 6 0 11-12 0c0-4 3-7 6-11z',
  scissors: 'M6 6l12 12M6 18L18 6M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0z',
  home: 'M3 11l9-7 9 7M5 10v10h14V10',
  wrench: 'M14 6a4 4 0 01-5 5L4 16l4 4 5-5a4 4 0 005-5l-2 2-3-1-1-3z',
  wine: 'M8 3h8l-1 6a3 3 0 01-6 0zM12 12v6m-3 3h6',
  star: 'M12 3l2.6 6.3L21 10l-5 4 1.5 7L12 17l-5.5 4L8 14 3 10l6.4-.7z',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z',
};

const NICHES = {
  medspa: {
    label: "Med Spa / Aesthetics",
    fonts: { heading: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Playfair+Display:wght@500;600;700;800&family=Inter:wght@300;400;500;600",
    colors: { bg: "#faf6f1", surface: "#ffffff", text: "#26201c", muted: "#867a70", accent: "#b0895a", accent2: "#d8b98f", deep: "#3a2f28", hero: "#f0e6d9" },
    tagline: "Look Refreshed.\nFeel Radiant.",
    highlight: "Radiant",
    sub: "Physician-led aesthetic treatments in a calm, luxurious setting — results you can see, care you can trust.",
    cta: "Book a Free Consultation",
    badges: ["Physician-Led", "Board-Certified", "5-Star Rated", "Financing"],
    services: [
      ["Injectables & Fillers", "Botox, dermal fillers and lip enhancement by licensed injectors.", I.sparkle],
      ["Skin Treatments", "Medical facials, chemical peels, microneedling and laser resurfacing.", I.drop],
      ["Body Contouring", "Non-invasive fat reduction, skin tightening and IV wellness therapy.", I.heart],
      ["Memberships", "Monthly member pricing on the treatments you love most.", I.star],
    ],
    photos: [
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=700&q=80",
    ],
    spotlight: [
      ["Where medical expertise meets a spa you never want to leave", "Every treatment is overseen by licensed medical professionals in a space designed to feel like a five-star retreat, not a clinic."],
      ["Natural results, personalized to you", "No cookie-cutter packages. We start with a free consultation and build a plan around your goals, your skin, and your budget."],
    ],
  },
  landscaping: {
    label: "Landscaping / Lawn Care",
    fonts: { heading: "'Poppins', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600",
    colors: { bg: "#f4f7f0", surface: "#ffffff", text: "#1c2a18", muted: "#5b6b53", accent: "#2f8a3e", accent2: "#79c257", deep: "#1a3316", hero: "#e6efdd" },
    tagline: "The Best-Looking\nYard on the Block.",
    highlight: "Yard",
    sub: "Design, installation and year-round care from your local pros — licensed, insured, and obsessed with the details.",
    cta: "Get a Free Estimate",
    badges: ["Licensed & Insured", "15+ Years", "Free Estimates", "Locally Owned"],
    services: [
      ["Lawn Care & Maintenance", "Mowing, fertilization and seasonal plans that keep your lawn thriving.", I.leaf],
      ["Landscape Design", "Hardscaping, patios, walkways and custom plantings built to last.", I.home],
      ["Irrigation & Drainage", "Smart sprinkler systems, repairs and drainage solutions.", I.drop],
      ["Seasonal Cleanup", "Spring & fall cleanup, leaf removal and snow services.", I.wrench],
    ],
    photos: [
      "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1595351298020-038700609878?auto=format&fit=crop&w=700&q=80",
    ],
    spotlight: [
      ["From overgrown to outdoor living, done right", "Patios, retaining walls, garden beds and lush lawns — we build outdoor spaces you'll actually want to spend time in."],
      ["One crew, every season", "Spring cleanups, summer mowing, fall leaves, winter snow. One trusted local team keeps your property sharp all year."],
    ],
  },
  roofing: {
    label: "Roofing / Exterior Contractor",
    fonts: { heading: "'Oswald', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Oswald:wght@500;600;700&family=Inter:wght@400;500;600",
    colors: { bg: "#f2f5f7", surface: "#ffffff", text: "#141d27", muted: "#576573", accent: "#e8531f", accent2: "#ff8a5b", deep: "#16283b", hero: "#dde6ec" },
    tagline: "Storm-Ready Roofing\nYou Can Trust.",
    highlight: "Trust",
    sub: "Fast, honest roof replacement and repair backed by a real warranty — and a crew your neighbors already recommend.",
    cta: "Get a Free Inspection",
    badges: ["Licensed & Insured", "Certified Installers", "Financing", "24/7 Emergency"],
    services: [
      ["Roof Replacement", "Premium materials, clean installs and warranties that hold up.", I.home],
      ["Roof Repair", "Leaks, missing shingles and fast emergency response.", I.wrench],
      ["Storm & Insurance Claims", "We help you file and win your insurance claim, start to finish.", I.shield],
      ["Siding & Gutters", "Complete exterior protection for your whole home.", I.drop],
    ],
    photos: [
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=80",
    ],
    spotlight: [
      ["When the storm hits, we're the call you're glad you made", "Fast inspections, honest assessments, and we deal with your insurance company so you don't have to fight it alone."],
      ["Built to last, backed in writing", "Certified installers, premium materials, and a warranty you can actually hold in your hand. No shortcuts, no surprises."],
    ],
  },
  restaurant: {
    label: "Family Italian Restaurant",
    fonts: { heading: "'Cormorant Garamond', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600",
    colors: { bg: "#faf3e9", surface: "#fffaf2", text: "#38221a", muted: "#7d5c47", accent: "#a5321f", accent2: "#d98c4a", deep: "#2a140e", hero: "#f1ddc4" },
    tagline: "A Taste of Italy,\nMade With Love.",
    highlight: "Love",
    sub: "Family recipes, fresh pasta and a warm table waiting for you — the way Nonna always intended.",
    cta: "Reserve a Table",
    badges: ["Family Owned", "Fresh Daily", "Full Bar", "Catering"],
    services: [
      ["Handmade Pasta", "Fresh pasta and classic sauces made from scratch every morning.", I.plate],
      ["Wood-Fired Favorites", "Signature mains, wood-fired pizza and hearty Italian classics.", I.heart],
      ["Wine & Aperitivo", "A curated Italian wine list and cocktails to start the night.", I.wine],
      ["Private Events", "Rehearsal dinners, parties and catering for any occasion.", I.star],
    ],
    photos: [
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
    ],
    spotlight: [
      ["Three generations. One recipe box. Zero shortcuts.", "Every sauce simmered, every noodle rolled, every plate sent out like we're feeding our own family — because to us, you are."],
      ["The table everyone remembers", "Date nights, big celebrations, or a quiet Tuesday plate of cacio e pepe — there's always a warm seat and a full glass waiting."],
    ],
  },
  dental: {
    label: "Dental Practice",
    fonts: { heading: "'Nunito', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Nunito:wght@600;700;800;900&family=Inter:wght@400;500;600",
    colors: { bg: "#f1f8f9", surface: "#ffffff", text: "#15303a", muted: "#527079", accent: "#1f9aa8", accent2: "#5fd0c4", deep: "#123842", hero: "#daeff1" },
    tagline: "Healthy Smiles,\nGentle Care.",
    highlight: "Gentle",
    sub: "Modern, comfortable dentistry for your whole family — with the kind of team that actually makes you want to come back.",
    cta: "Book an Appointment",
    badges: ["Most Insurance Accepted", "New Patient Special", "Gentle Care", "Same-Day Emergencies"],
    services: [
      ["General & Family", "Cleanings, checkups and fillings for every age.", I.tooth],
      ["Cosmetic Dentistry", "Whitening, veneers and complete smile makeovers.", I.sparkle],
      ["Invisalign & Ortho", "Clear aligners and braces with a free consultation.", I.star],
      ["Emergency Care", "Same-day relief for pain, chips and dental emergencies.", I.shield],
    ],
    photos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=700&q=80",
    ],
    spotlight: [
      ["Dentistry that doesn't feel like the dentist", "Warm blankets, gentle hands, and a team that explains everything — comfortable care for nervous patients and busy families alike."],
      ["Modern tech, friendly faces", "Digital scans, same-day answers, and treatment plans that respect your time and your budget. Most insurance welcome."],
    ],
  },
};

module.exports = { NICHES };
