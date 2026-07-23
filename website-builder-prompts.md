# 5 Cold-Call Website-Builder Prompts

Ready-to-paste prompts for an AI website builder (Claude, Lovable, v0, Bolt, Replit, etc.).
Each one produces a **~10-page, first-class website** for a local business you can cold-call,
close quickly, and that comfortably affords **$600 upfront + $200/month × 8 (~$2,200/client)**.

---

## How to use these

1. **Pick the vertical** that matches the business you're calling.
2. **Copy the whole prompt** in the code block (it's self-contained).
3. **Fill in every `[BRACKETED]` placeholder** with the real business info (name, city, phone,
   services, etc.). The more real detail you paste, the better the output.
4. **Paste into your AI builder** and let it generate. Then swap in the client's real photos,
   reviews, and copy tweaks.
5. **Deploy** (Netlify / Vercel / the builder's host) and show it on the second call to close.

**Pro tip for closing:** Generate the site *before* the follow-up call using the business's public
info (Google Business Profile, Yelp, their old site). Walking into "here's your new website, live
right now" turns a pitch into a formality.

### Why these 5 verticals
- **Reachable:** owner-operated or small teams that answer their own phones.
- **Closeable:** the owner is the decision-maker; the value (more booked jobs/patients/clients) is obvious.
- **Can afford it:** each closed job/patient/case is worth multiples of the $2,200 contract, so the
  ROI conversation is easy.

---

## Shared quality bar (already baked into every prompt below)

Every prompt asks the builder for:
- **10 real pages**, not a one-pager with anchor links.
- **Mobile-first, fully responsive**, fast-loading, accessible (WCAG AA), semantic HTML.
- **Conversion-first design:** sticky click-to-call, prominent booking/quote CTA on every page,
  short lead forms, trust badges.
- **Local SEO:** unique title tags + meta descriptions per page, LocalBusiness schema (JSON-LD),
  city/service keywords, an embedded map, NAP (Name/Address/Phone) consistency.
- **Trust signals:** reviews/testimonials, credentials, guarantees, real-looking placeholder imagery.
- **A cohesive, premium visual system:** defined color palette, type scale, spacing, and imagery
  direction so it looks designed, not templated.

---

# 1) Home Services — HVAC / Plumbing / Electrical

> **Best for:** contractors with a service area, emergency jobs, and a phone that rings all day.
> High average ticket, so one extra booked job pays for months of your service.

```
You are an expert web designer and conversion copywriter. Build a complete, production-ready,
10-page website for a local home-services company. The finished site must look like it was made
by a top-tier agency and be optimized to turn visitors into booked service calls.

BUSINESS DETAILS (fill these in):
- Company name: [BUSINESS NAME]
- Trade(s): [e.g., HVAC, plumbing, electrical — list all]
- City / service area: [CITY, STATE + surrounding towns]
- Phone (click-to-call): [PHONE]
- Email: [EMAIL]
- Hours + emergency availability: [e.g., Mon–Fri 8–6, 24/7 emergency]
- Years in business / license #: [e.g., 15 years, Lic. #123456]
- Key differentiators: [e.g., family-owned, upfront pricing, same-day service, financing]

BRAND & DESIGN DIRECTION:
- Trustworthy, clean, and professional — think "the pro you'd let in your house."
- Color palette: a strong primary (deep blue or bold red), a bright accent for CTAs, and neutral
  grays. High contrast, WCAG AA.
- Typography: a sturdy geometric sans for headings, a highly readable sans for body.
- Imagery: technicians in branded uniforms, clean trucks, before/after repairs, smiling homeowners.
  Use tasteful placeholder images with alt text describing the intended shot.
- Include trust badges: licensed/insured, warranty, financing available, review-site logos.

CONVERSION REQUIREMENTS (critical):
- Sticky header with click-to-call phone number and a "Book Service" button on every page.
- A sticky mobile call bar at the bottom on phones.
- A short "Request Service" form (name, phone, service needed, preferred time) on every key page.
- An "Emergency? Call Now" banner.
- Display average response time, star rating, and number of reviews prominently.

BUILD THESE 10 PAGES (each with unique title tag + meta description):
1. Home — hero with headline + subhead + primary CTA, trust bar, services grid, "why choose us,"
   service-area map, reviews carousel, financing callout, final CTA.
2. About — company story, owner bio + photo, values, licenses/certifications, team.
3. Services (overview) — cards linking to each individual service.
4. Service Detail: Heating & Cooling (or primary trade) — problems solved, process, pricing signals, FAQ, CTA.
5. Service Detail: Repairs & Maintenance — maintenance plans, membership offer, CTA.
6. Service Detail: Installations / Replacements — brands, financing, warranty, CTA.
7. Service Areas — list of towns/neighborhoods with local content for SEO, map.
8. Reviews & Testimonials — pulled-quote testimonials, star ratings, review-platform badges.
9. Financing & Offers — payment plans, current coupons/specials, membership plan pricing table.
10. Contact — form, click-to-call, hours, map, service-area note, emergency line.

TECHNICAL REQUIREMENTS:
- Mobile-first, responsive, fast (optimize images, lazy-load).
- Semantic HTML, accessible (labels, focus states, alt text, AA contrast).
- LocalBusiness + Service JSON-LD schema with NAP.
- Unique per-page <title> and meta description targeting "[service] in [city]" keywords.
- Consistent NAP in header/footer; embedded Google Map placeholder.
- Clean, commented code; organized files; ready to deploy.

Output the full site with all pages, styles, and assets. Use realistic placeholder copy and images
I can swap later. Make it genuinely impressive.
```

---

# 2) Med Spa / Aesthetics Clinic

> **Best for:** med spas, laser clinics, injectable/Botox studios. High margins, image-conscious
> owners who *want* a beautiful site, and booking is the whole game.

```
You are an expert web designer and conversion copywriter specializing in luxury wellness and beauty
brands. Build a complete, production-ready, 10-page website for a local med spa / aesthetics clinic.
It must feel elegant, premium, and calming — and be engineered to drive online consultation bookings.

BUSINESS DETAILS (fill these in):
- Clinic name: [BUSINESS NAME]
- Location: [CITY, STATE + address]
- Phone / booking line: [PHONE]
- Medical director / provider(s): [NAME(S), CREDENTIALS — e.g., MD, RN, NP]
- Signature treatments: [e.g., Botox, dermal fillers, laser hair removal, HydraFacial, microneedling,
  body contouring, IV therapy]
- Booking system link (if any): [BOOKING URL or "use a form"]
- Differentiators: [e.g., physician-led, natural results, memberships, financing]

BRAND & DESIGN DIRECTION:
- Aesthetic: luxurious, serene, editorial — think high-end spa meets modern clinic.
- Color palette: soft neutrals (warm beige, ivory, blush) with an elegant deep accent (muted gold,
  sage, or charcoal). Lots of whitespace.
- Typography: an elegant serif for headings paired with a clean, light sans for body.
- Imagery: glowing skin close-ups, calm treatment rooms, natural-light portraits, subtle textures.
  Use tasteful placeholder images with descriptive alt text.
- Micro-interactions and smooth, gentle animations. Refined, never flashy.

CONVERSION REQUIREMENTS (critical):
- Prominent "Book a Consultation" CTA in the header and on every page (sticky).
- Free consultation offer highlighted; short booking form (name, phone, treatment of interest, date).
- Financing/membership callout (e.g., Cherry/Afterpay-style messaging placeholder).
- Before/after gallery with tasteful, consent-style framing.
- Star rating + review count + provider credentials shown as trust signals.

BUILD THESE 10 PAGES (each with unique title tag + meta description):
1. Home — serene hero, signature treatments, "why choose us," provider intro, before/after teaser,
   reviews, membership callout, booking CTA.
2. About — clinic philosophy, medical director bio + photo, credentials, safety/standards.
3. Treatments (overview) — elegant grid of categories linking to detail pages.
4. Injectables (Botox & Fillers) — benefits, what to expect, downtime, pricing signals, FAQ, CTA.
5. Skin & Laser (Facials/Laser/Microneedling) — treatment menu, results timeline, CTA.
6. Body & Wellness (Contouring/IV/Weight) — offerings, expectations, CTA.
7. Before & After Gallery — categorized results with captions.
8. Memberships & Financing — membership tiers table, financing options, current specials.
9. Reviews & Testimonials — quotes, star ratings, video-testimonial placeholders, platform badges.
10. Contact & Book — booking form, phone, address, hours, map, parking/arrival note.

TECHNICAL REQUIREMENTS:
- Mobile-first, responsive, fast, accessible (AA contrast, labels, alt text, focus states).
- MedicalBusiness/LocalBusiness JSON-LD with NAP; per-treatment schema where sensible.
- Unique per-page <title> and meta description targeting "[treatment] in [city]".
- Consistent NAP; embedded map; social links.
- Clean, commented, deploy-ready code.

Output the full site — all pages, styles, assets — with realistic placeholder copy and imagery I can
swap. Make it look like a $10k luxury brand site.
```

---

# 3) Dental Practice

> **Best for:** general, cosmetic, or family dentists. Steady demand, high patient value, and they
> already spend on marketing — an easy ROI conversation.

```
You are an expert web designer and healthcare marketing copywriter. Build a complete,
production-ready, 10-page website for a local dental practice. It must feel warm, modern, and
trustworthy, and be engineered to convert visitors into booked appointments (especially new patients).

BUSINESS DETAILS (fill these in):
- Practice name: [BUSINESS NAME]
- Dentist(s): [DR. NAME(S), DDS/DMD]
- Location: [CITY, STATE + address]
- Phone / appointment line: [PHONE]
- Services: [e.g., general/family dentistry, cleanings, cosmetic (veneers, whitening), Invisalign,
  implants, emergency dental, pediatric]
- Insurance / payment: [insurances accepted, in-house plan, financing]
- New-patient offer: [e.g., $99 exam + X-rays + cleaning]
- Differentiators: [e.g., same-day crowns, sedation options, evening hours, family-friendly]

BRAND & DESIGN DIRECTION:
- Aesthetic: clean, bright, friendly, and reassuring — reduces dental anxiety.
- Color palette: fresh blues/teals or soft greens with white and warm accents. Airy and clean.
- Typography: a friendly, rounded sans for headings; highly readable body text.
- Imagery: genuine smiling patients (all ages), modern clean office, friendly team, gentle care shots.
  Use tasteful placeholder images with descriptive alt text.
- Warm, welcoming tone; emphasize comfort, gentleness, and modern technology.

CONVERSION REQUIREMENTS (critical):
- "Book Appointment" CTA and click-to-call in a sticky header on every page.
- New-patient special highlighted prominently with a clear CTA.
- Short appointment-request form (name, phone, reason for visit, new/existing, preferred time).
- Insurance logos + "we accept your insurance" reassurance; financing callout.
- Star rating, review count, and years-in-practice as trust signals.

BUILD THESE 10 PAGES (each with unique title tag + meta description):
1. Home — welcoming hero + new-patient offer, services grid, "why patients choose us," doctor intro,
   reviews, insurance/financing bar, booking CTA.
2. About — practice story, dentist bio(s) + photos, team, technology, office tour.
3. Services (overview) — categorized cards linking to detail pages.
4. General & Family Dentistry — cleanings, exams, kids, preventive care, FAQ, CTA.
5. Cosmetic Dentistry — whitening, veneers, smile makeovers, before/after teaser, CTA.
6. Orthodontics / Invisalign — process, benefits, cost/financing signals, CTA.
7. Implants & Restorative — implants, crowns, bridges, dentures, CTA.
8. New Patients — what to expect, forms, insurance/financing, the special offer, first-visit FAQ.
9. Reviews & Testimonials — patient quotes, star ratings, before/after smiles, platform badges.
10. Contact & Appointments — booking form, phone, address, hours, map, emergency-dental note.

TECHNICAL REQUIREMENTS:
- Mobile-first, responsive, fast, accessible (AA contrast, labels, alt text, focus states).
- Dentist/MedicalBusiness LocalBusiness JSON-LD with NAP.
- Unique per-page <title> and meta description targeting "dentist in [city]" and service keywords.
- Consistent NAP; embedded map; insurance logos section.
- Clean, commented, deploy-ready code.

Output the full site — all pages, styles, assets — with realistic placeholder copy and imagery I can
swap. Make it look like a premium, patient-focused practice.
```

---

# 4) Law Firm (Personal Injury / Family / Estate)

> **Best for:** solo attorneys and small firms. A single case is worth far more than $2,200, so the
> ROI is a no-brainer — and legal is competitive on Google, so they value web presence.

```
You are an expert web designer and legal-marketing copywriter. Build a complete, production-ready,
10-page website for a local law firm. It must convey authority, trust, and results, and be engineered
to convert visitors into free-consultation leads. Keep all copy ethically compliant (no guarantees of
outcomes; use "results may vary" style disclaimers where appropriate).

BUSINESS DETAILS (fill these in):
- Firm name: [BUSINESS NAME]
- Attorney(s): [NAME(S), J.D., bar admissions]
- Practice areas: [e.g., personal injury, car accidents, family law/divorce, estate planning,
  criminal defense — list all]
- Location: [CITY, STATE + address]
- Phone: [PHONE]
- Consultation offer: [e.g., free case evaluation, no fee unless we win]
- Differentiators: [e.g., 20+ years, $X million recovered, former prosecutor, bilingual, 24/7]

BRAND & DESIGN DIRECTION:
- Aesthetic: authoritative, polished, and trustworthy — established and credible, not stuffy.
- Color palette: deep navy or charcoal with a refined accent (gold, burgundy, or deep green) and clean
  neutrals. Strong, confident contrast.
- Typography: a classic serif for headings (authority) with a clean sans for body (readability).
- Imagery: professional attorney portraits, courthouse/office settings, handshake/consultation shots,
  city landmarks. Use tasteful placeholder images with descriptive alt text.
- Tone: confident, empathetic, and clear. Emphasize experience, results, and client care.

CONVERSION REQUIREMENTS (critical):
- "Free Consultation" CTA + click-to-call in a sticky header on every page.
- 24/7 availability messaging; short case-evaluation form (name, phone, case type, brief description).
- Trust signals: years of experience, case results / amounts recovered (with disclaimers), awards
  (Super Lawyers/Avvo-style placeholders), bar memberships, star ratings.
- "No fee unless we win" badge where applicable.

BUILD THESE 10 PAGES (each with unique title tag + meta description):
1. Home — strong hero (headline + free-consult CTA), practice-area grid, results/awards bar, attorney
   intro, testimonials, "why choose us," final CTA.
2. About the Firm — firm story, values, community, results overview.
3. Attorney Profile(s) — bio, education, bar admissions, notable cases, awards, photo.
4. Practice Areas (overview) — cards linking to each practice-area detail page.
5. Practice Area Detail: [Primary — e.g., Personal Injury] — how we help, process, what to do next,
   results, FAQ, CTA.
6. Practice Area Detail: [Secondary — e.g., Family Law] — process, empathy-forward copy, FAQ, CTA.
7. Practice Area Detail: [Third — e.g., Estate Planning] — offerings, process, CTA.
8. Case Results & Testimonials — results table (with disclaimers), client quotes, star ratings, awards.
9. FAQ / Resources — common legal questions, "what to do after an accident," blog teaser for SEO.
10. Contact & Free Consultation — form, phone, address, hours, map, 24/7 note.

TECHNICAL REQUIREMENTS:
- Mobile-first, responsive, fast, accessible (AA contrast, labels, alt text, focus states).
- LegalService/Attorney LocalBusiness JSON-LD with NAP.
- Unique per-page <title> and meta description targeting "[practice area] lawyer in [city]".
- Consistent NAP; embedded map; ethics-compliant disclaimers in the footer.
- Clean, commented, deploy-ready code.

Output the full site — all pages, styles, assets — with realistic placeholder copy and imagery I can
swap. Make it look like a well-established, credible firm.
```

---

# 5) Landscaping & Hardscaping

> **Best for:** landscapers, lawn-care pros, and hardscape/outdoor-living builders. High-ticket
> projects, intensely visual (the portfolio does the selling), and the owner decides fast.

```
You are an expert web designer and conversion copywriter. Build a complete, production-ready,
10-page website for a local landscaping and hardscaping company. It must feel fresh, premium, and
visual — the portfolio should sell the work — and be engineered to generate qualified quote requests.

BUSINESS DETAILS (fill these in):
- Company name: [BUSINESS NAME]
- Services: [e.g., lawn care/maintenance, landscape design, hardscaping (patios, walkways, retaining
  walls), outdoor living (kitchens, fire pits), irrigation, lighting, tree/shrub, snow removal]
- Service area: [CITY, STATE + surrounding towns]
- Phone: [PHONE]
- Email: [EMAIL]
- Differentiators: [e.g., family-owned, licensed/insured, free design consults, financing, X years]
- Seasonal offers: [e.g., spring cleanup special, fall aeration]

BRAND & DESIGN DIRECTION:
- Aesthetic: natural, fresh, and upscale — "premium outdoor living," not "guy with a mower."
- Color palette: rich greens and earthy tones (stone, wood, slate) with a clean bright accent for CTAs.
- Typography: a confident modern sans for headings; clean, readable body.
- Imagery: lush lawns, stunning patios/hardscapes, before/after transformations, outdoor living at
  golden hour, crew at work. Big, beautiful photography. Use tasteful placeholder images with
  descriptive alt text.
- Let large project photos and before/after sliders carry the design.

CONVERSION REQUIREMENTS (critical):
- "Get a Free Quote" CTA + click-to-call in a sticky header on every page.
- Short quote-request form (name, phone, project type, property type, timeline, brief description).
- Portfolio/gallery front and center; before/after sliders.
- Trust signals: licensed & insured, star rating, review count, years in business, financing badge.
- Seasonal-offer banner.

BUILD THESE 10 PAGES (each with unique title tag + meta description):
1. Home — big visual hero + "Get a Free Quote" CTA, services grid, featured projects, before/after,
   "why choose us," reviews, service-area map, seasonal offer, final CTA.
2. About — company story, owner/crew, values, licenses/insurance, process.
3. Services (overview) — cards linking to each service detail page.
4. Landscape Design & Installation — process (design → build → maintain), gallery, CTA.
5. Hardscaping (Patios, Walkways, Walls) — materials, project examples, financing, CTA.
6. Outdoor Living (Kitchens, Fire Pits, Lighting) — premium showcase, CTA.
7. Lawn Care & Maintenance — plans/packages table, seasonal services, CTA.
8. Portfolio / Gallery — filterable project grid with before/after and captions.
9. Reviews & Testimonials — quotes, star ratings, project photos, platform badges.
10. Contact & Free Quote — quote form, phone, address, service area, hours, map.

TECHNICAL REQUIREMENTS:
- Mobile-first, responsive, fast (optimize large images, lazy-load), accessible (AA contrast, labels,
  alt text, focus states).
- LocalBusiness/Service JSON-LD with NAP.
- Unique per-page <title> and meta description targeting "[service] in [city]".
- Consistent NAP; embedded map; social links.
- Clean, commented, deploy-ready code.

Output the full site — all pages, styles, assets — with realistic placeholder copy and imagery I can
swap. Make it look like a premium outdoor-living brand.
```

---

## Bonus: the sales math (so the price feels easy)

Your offer is **$600 upfront + $200/mo × 8 = ~$2,200 over 8 months.** Frame it against one job:

| Vertical | Value of ONE new customer the site brings in | Your whole contract |
|---|---|---|
| Home services | $300–$8,000+ per job (a single AC install pays for years of you) | ~$2,200 |
| Med spa | $1,000s in treatment packages + repeat visits | ~$2,200 |
| Dental | New patient LTV often $2,000–$10,000+ | ~$2,200 |
| Law firm | One case = $5,000–$100,000+ in fees | ~$2,200 |
| Landscaping | $5,000–$50,000+ per hardscape/design project | ~$2,200 |

**The close:** "If this site brings you *one* extra [job/patient/client] over the next 8 months, it's
already paid for itself several times over. Everything after that is profit."

### What the $200/month covers (so it's not just "rent")
Hosting + SSL, monthly content/photo updates, keeping the site fast and secure, small design tweaks,
seasonal offer swaps, and basic local-SEO upkeep. Bundle it so monthly feels like *maintenance +
peace of mind*, not a fee for nothing.
