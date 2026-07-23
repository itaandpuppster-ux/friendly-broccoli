// niches.js — the 5 design systems + copy that match the cold-call playbook.
// Each niche is a self-contained "brand kit": colors, fonts, hero copy, and the
// service cards / trust badges that make the demo feel custom-built.

const NICHES = {
  medspa: {
    label: "Med Spa / Aesthetics",
    fonts: { heading: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600",
    colors: { bg: "#fbf7f2", surface: "#ffffff", text: "#2c2420", muted: "#7a6f66", accent: "#b08d57", accent2: "#c9a882", hero: "#efe4d7" },
    tagline: "Look Refreshed. Feel Radiant.",
    sub: "Physician-led aesthetic treatments in a calm, luxurious setting.",
    cta: "Book a Free Consultation",
    badges: ["Physician-Led", "Board-Certified", "5-Star Rated", "Financing Available"],
    services: [
      ["Injectables & Fillers", "Botox, dermal fillers and lip enhancement by licensed injectors."],
      ["Skin Treatments", "Medical facials, chemical peels, microneedling and laser resurfacing."],
      ["Body Contouring", "Non-invasive fat reduction, skin tightening and IV wellness therapy."],
      ["Memberships", "Monthly member pricing on the treatments you love most."],
    ],
    heroWords: "spa",
  },
  landscaping: {
    label: "Landscaping / Lawn Care",
    fonts: { heading: "'Poppins', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600",
    colors: { bg: "#f4f6f1", surface: "#ffffff", text: "#1f2a1c", muted: "#5c6b56", accent: "#2f7d3a", accent2: "#c9a227", hero: "#e4ecdd" },
    tagline: "The Best-Looking Yard on the Block.",
    sub: "Design, installation and year-round care from your local pros.",
    cta: "Get a Free Estimate",
    badges: ["Licensed & Insured", "15+ Years", "Free Estimates", "Locally Owned"],
    services: [
      ["Lawn Care & Maintenance", "Mowing, fertilization and seasonal plans that keep your lawn thriving."],
      ["Landscape Design", "Hardscaping, patios, walkways and custom plantings built to last."],
      ["Irrigation & Drainage", "Smart sprinkler systems, repairs and drainage solutions."],
      ["Seasonal Cleanup", "Spring & fall cleanup, leaf removal and snow services."],
    ],
    heroWords: "landscape,garden",
  },
  roofing: {
    label: "Roofing / Exterior Contractor",
    fonts: { heading: "'Oswald', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Oswald:wght@500;600;700&family=Inter:wght@400;500;600",
    colors: { bg: "#f3f5f7", surface: "#ffffff", text: "#16202b", muted: "#5a6672", accent: "#e8531f", accent2: "#1f3b57", hero: "#dfe6ec" },
    tagline: "Storm-Ready Roofing You Can Trust.",
    sub: "Fast, honest roof replacement and repair backed by a real warranty.",
    cta: "Get a Free Inspection",
    badges: ["Licensed & Insured", "Certified Installers", "Financing", "24/7 Emergency"],
    services: [
      ["Roof Replacement", "Premium materials, clean installs and warranties that hold up."],
      ["Roof Repair", "Leaks, missing shingles and fast emergency response."],
      ["Storm & Insurance Claims", "We help you file and win your insurance claim, start to finish."],
      ["Siding & Gutters", "Complete exterior protection for your whole home."],
    ],
    heroWords: "house,roof",
  },
  restaurant: {
    label: "Family Italian Restaurant",
    fonts: { heading: "'Cormorant Garamond', Georgia, serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600",
    colors: { bg: "#fbf4ea", surface: "#fffaf3", text: "#3a241b", muted: "#7c5c48", accent: "#a5321f", accent2: "#6b7a3a", hero: "#f0dfc8" },
    tagline: "A Taste of Italy, Made With Love.",
    sub: "Family recipes, fresh pasta and a warm table waiting for you.",
    cta: "Reserve a Table",
    badges: ["Family Owned", "Fresh Daily", "Full Bar", "Catering Available"],
    services: [
      ["Handmade Pasta", "Fresh pasta and classic sauces made from scratch every morning."],
      ["Wood-Fired Favorites", "Signature mains, wood-fired pizza and hearty Italian classics."],
      ["Wine & Aperitivo", "A curated Italian wine list and cocktails to start the night."],
      ["Private Events", "Rehearsal dinners, parties and catering for any occasion."],
    ],
    heroWords: "pasta,italian-food",
  },
  dental: {
    label: "Dental Practice",
    fonts: { heading: "'Nunito', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
    googleFonts: "Nunito:wght@600;700;800&family=Inter:wght@400;500;600",
    colors: { bg: "#f2f8f9", surface: "#ffffff", text: "#173038", muted: "#557079", accent: "#1f9aa8", accent2: "#7fd1c4", hero: "#dceff1" },
    tagline: "Healthy Smiles, Gentle Care.",
    sub: "Modern, comfortable dentistry for your whole family.",
    cta: "Book an Appointment",
    badges: ["Most Insurance Accepted", "New Patient Special", "Gentle Care", "Same-Day Emergencies"],
    services: [
      ["General & Family", "Cleanings, checkups and fillings for every age."],
      ["Cosmetic Dentistry", "Whitening, veneers and complete smile makeovers."],
      ["Invisalign & Ortho", "Clear aligners and braces with a free consultation."],
      ["Emergency Care", "Same-day relief for pain, chips and dental emergencies."],
    ],
    heroWords: "dentist,smile",
  },
};

module.exports = { NICHES };
