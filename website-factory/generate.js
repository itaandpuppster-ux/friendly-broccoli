#!/usr/bin/env node
// generate.js — the Website Factory.
// Feed it a list of local businesses; it produces a complete, polished demo
// site for each one that you can show on a cold call.
//
//   node generate.js                 # uses leads.csv in this folder
//   node generate.js my-leads.csv    # uses a custom CSV
//
// CSV columns (header row required): name,niche,city,phone,tagline
//   - niche must be one of: medspa, landscaping, roofing, restaurant, dental
//   - tagline is optional (falls back to the niche default)
//
// Output: sites/<slug>/index.html  +  sites/index.html (a gallery of them all).
// Zero dependencies. Every file is self-contained and hosts anywhere.

const fs = require("fs");
const path = require("path");
const { NICHES } = require("./niches.js");

const here = __dirname;
const outRoot = path.join(here, "sites");

// ---- tiny helpers ----------------------------------------------------------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const telHref = (p) => "tel:" + String(p).replace(/[^0-9+]/g, "");

// Minimal CSV parser (handles quoted fields and commas inside quotes).
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((h) => h.trim().toLowerCase());
  return rows
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])));
}

// ---- the site template -----------------------------------------------------
function renderSite(biz) {
  const n = NICHES[biz.niche];
  if (!n) throw new Error(`Unknown niche "${biz.niche}" for "${biz.name}" (use: ${Object.keys(NICHES).join(", ")})`);
  const c = n.colors;
  const name = biz.name;
  const city = biz.city || "Your City";
  const phone = biz.phone || "(555) 123-4567";
  const tagline = biz.tagline || n.tagline;
  const year = 1998 + (name.length % 22); // stable "since" year, feels custom

  const badges = n.badges.map((b) => `<span class="badge">${esc(b)}</span>`).join("");
  const services = n.services
    .map(([t, d], i) => `
      <article class="card" style="--i:${i}">
        <div class="card-num">0${i + 1}</div>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </article>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — ${esc(n.label)} in ${esc(city)}</title>
<meta name="description" content="${esc(name)}: ${esc(tagline)} Serving ${esc(city)}. Call ${esc(phone)}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${n.googleFonts}&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:${c.bg}; --surface:${c.surface}; --text:${c.text}; --muted:${c.muted};
    --accent:${c.accent}; --accent2:${c.accent2}; --hero:${c.hero};
    --fh:${n.fonts.heading}; --fb:${n.fonts.body};
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:var(--fb);color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased}
  h1,h2,h3{font-family:var(--fh);line-height:1.15;font-weight:700}
  a{color:inherit}
  .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
  .btn{display:inline-block;background:var(--accent);color:#fff;padding:14px 28px;border-radius:999px;
    font-weight:600;text-decoration:none;transition:transform .15s ease,filter .15s ease;font-family:var(--fb)}
  .btn:hover{transform:translateY(-2px);filter:brightness(1.05)}
  .btn.ghost{background:transparent;color:var(--text);border:1.5px solid var(--text)}

  /* nav */
  header.nav{position:sticky;top:0;z-index:50;background:color-mix(in srgb,var(--bg) 85%,transparent);
    backdrop-filter:blur(10px);border-bottom:1px solid color-mix(in srgb,var(--text) 8%,transparent)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:70px}
  .brand{font-family:var(--fh);font-weight:700;font-size:1.35rem;letter-spacing:.2px}
  .brand span{color:var(--accent)}
  nav.links{display:flex;gap:26px;align-items:center}
  nav.links a{text-decoration:none;color:var(--muted);font-size:.95rem;font-weight:500}
  nav.links a:hover{color:var(--text)}
  @media(max-width:820px){nav.links a:not(.btn){display:none}}

  /* hero */
  .hero{padding:96px 0 88px;background:
    radial-gradient(120% 120% at 100% 0%, color-mix(in srgb,var(--accent) 22%,transparent) 0%, transparent 55%),
    linear-gradient(160deg, var(--hero), var(--bg));}
  .hero .wrap{display:grid;gap:34px;max-width:820px}
  .eyebrow{display:inline-block;color:var(--accent);font-weight:600;letter-spacing:.14em;text-transform:uppercase;font-size:.78rem}
  h1{font-size:clamp(2.5rem,6vw,4.3rem)}
  .hero p.sub{font-size:1.2rem;color:var(--muted);max-width:560px}
  .hero .actions{display:flex;gap:14px;flex-wrap:wrap}
  .badges{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
  .badge{background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 10%,transparent);
    padding:7px 14px;border-radius:999px;font-size:.82rem;font-weight:600;color:var(--muted)}

  /* sections */
  section{padding:82px 0}
  .sec-head{text-align:center;max-width:640px;margin:0 auto 52px}
  .sec-head .eyebrow{margin-bottom:12px}
  .sec-head h2{font-size:clamp(2rem,4vw,2.9rem)}
  .sec-head p{color:var(--muted);margin-top:12px;font-size:1.08rem}

  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px}
  .card{background:var(--surface);border:1px solid color-mix(in srgb,var(--text) 8%,transparent);
    border-radius:18px;padding:30px 26px;transition:transform .2s ease,box-shadow .2s ease}
  .card:hover{transform:translateY(-4px);box-shadow:0 18px 40px -20px color-mix(in srgb,var(--text) 40%,transparent)}
  .card-num{font-family:var(--fh);color:var(--accent);font-size:1.1rem;font-weight:700;opacity:.7;margin-bottom:10px}
  .card h3{font-size:1.25rem;margin-bottom:8px}
  .card p{color:var(--muted);font-size:.98rem}

  /* about strip */
  .about{background:var(--surface)}
  .about .wrap{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
  .about .art{aspect-ratio:4/3;border-radius:22px;background:
    linear-gradient(135deg,var(--accent),var(--accent2));position:relative;overflow:hidden}
  .about .art::after{content:"${esc(name.slice(0,1))}";position:absolute;inset:0;display:grid;place-items:center;
    font-family:var(--fh);font-size:9rem;color:rgba(255,255,255,.28);font-weight:700}
  @media(max-width:820px){.about .wrap{grid-template-columns:1fr}}
  .about h2{font-size:clamp(1.9rem,4vw,2.6rem);margin-bottom:16px}
  .about p{color:var(--muted);margin-bottom:14px}
  .stats{display:flex;gap:30px;margin-top:22px}
  .stat b{display:block;font-family:var(--fh);font-size:2rem;color:var(--accent)}
  .stat span{font-size:.85rem;color:var(--muted)}

  /* reviews */
  .reviews .cards .card{background:var(--bg)}
  .stars{color:var(--accent);letter-spacing:2px;margin-bottom:10px}
  .who{margin-top:14px;font-weight:600;font-size:.92rem}

  /* CTA band */
  .cta-band{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;text-align:center}
  .cta-band h2{font-size:clamp(2rem,4vw,3rem);color:#fff}
  .cta-band p{opacity:.92;margin:14px 0 26px;font-size:1.1rem}
  .cta-band .btn{background:#fff;color:var(--text)}

  /* contact */
  .contact .wrap{display:grid;grid-template-columns:1fr 1fr;gap:44px}
  @media(max-width:820px){.contact .wrap{grid-template-columns:1fr}}
  form{display:grid;gap:14px}
  input,textarea{font-family:var(--fb);font-size:1rem;padding:14px 16px;border-radius:12px;
    border:1px solid color-mix(in srgb,var(--text) 15%,transparent);background:var(--surface);color:var(--text)}
  textarea{min-height:120px;resize:vertical}
  .info li{list-style:none;margin-bottom:16px;color:var(--muted)}
  .info b{color:var(--text);display:block;font-family:var(--fh)}

  footer{background:var(--text);color:color-mix(in srgb,#fff 78%,var(--text));padding:40px 0;text-align:center;font-size:.9rem}
  footer .brand{color:#fff;margin-bottom:8px}

  /* floating call button (mobile) */
  .float-call{position:fixed;right:18px;bottom:18px;z-index:60;background:var(--accent);color:#fff;
    width:58px;height:58px;border-radius:50%;display:grid;place-items:center;text-decoration:none;
    box-shadow:0 10px 30px -6px rgba(0,0,0,.4);font-size:1.5rem}
  @media(min-width:821px){.float-call{display:none}}

  /* scroll reveal */
  .reveal{opacity:0;transform:translateY(18px);transition:opacity .6s ease,transform .6s ease}
  .reveal.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}}
</style>
</head>
<body>
<header class="nav">
  <div class="wrap nav-in">
    <div class="brand">${esc(name)}<span>.</span></div>
    <nav class="links">
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#reviews">Reviews</a>
      <a href="#contact">Contact</a>
      <a class="btn" href="${telHref(phone)}">${esc(phone)}</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <span class="eyebrow">${esc(n.label)} · ${esc(city)}</span>
    <h1>${esc(tagline)}</h1>
    <p class="sub">${esc(n.sub)}</p>
    <div class="actions">
      <a class="btn" href="#contact">${esc(n.cta)}</a>
      <a class="btn ghost" href="${telHref(phone)}">Call ${esc(phone)}</a>
    </div>
    <div class="badges">${badges}</div>
  </div>
</section>

<section id="services">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">What We Do</span>
      <h2>Everything you need, done right</h2>
      <p>Trusted by neighbors across ${esc(city)} and beyond.</p>
    </div>
    <div class="cards">${services}</div>
  </div>
</section>

<section id="about" class="about">
  <div class="wrap">
    <div class="art reveal"></div>
    <div class="reveal">
      <span class="eyebrow">Our Story</span>
      <h2>Proudly serving ${esc(city)} since ${year}</h2>
      <p>${esc(name)} was built on a simple idea: treat every customer like family and do
         work we're proud to put our name on. That's why folks in ${esc(city)} keep coming back.</p>
      <p>Licensed, insured, and genuinely local — we're your neighbors, not a faceless chain.</p>
      <div class="stats">
        <div class="stat"><b>${2026 - year}+</b><span>Years serving ${esc(city)}</span></div>
        <div class="stat"><b>1,200+</b><span>Happy customers</span></div>
        <div class="stat"><b>4.9★</b><span>Average rating</span></div>
      </div>
    </div>
  </div>
</section>

<section id="reviews" class="reviews">
  <div class="wrap">
    <div class="sec-head reveal">
      <span class="eyebrow">Reviews</span>
      <h2>What ${esc(city)} is saying</h2>
    </div>
    <div class="cards">
      <article class="card reveal"><div class="stars">★★★★★</div><p>"Absolutely the best in ${esc(city)}. Professional, friendly, and worth every penny."</p><div class="who">— Jamie R.</div></article>
      <article class="card reveal"><div class="stars">★★★★★</div><p>"From the first call to the finished result, ${esc(name)} was fantastic. Highly recommend."</p><div class="who">— Morgan T.</div></article>
      <article class="card reveal"><div class="stars">★★★★★</div><p>"Honest, on time, and the quality speaks for itself. We won't go anywhere else."</p><div class="who">— Alex P.</div></article>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap reveal">
    <h2>Ready to get started?</h2>
    <p>Book in under a minute — or call us right now.</p>
    <a class="btn" href="${telHref(phone)}">Call ${esc(phone)}</a>
  </div>
</section>

<section id="contact" class="contact">
  <div class="wrap">
    <div class="reveal">
      <span class="eyebrow">Get In Touch</span>
      <h2 style="font-size:clamp(1.9rem,4vw,2.6rem);margin:12px 0 20px">${esc(n.cta)}</h2>
      <form onsubmit="event.preventDefault();this.querySelector('.done').style.display='block';this.reset();">
        <input required placeholder="Your name">
        <input required type="tel" placeholder="Phone number">
        <input type="email" placeholder="Email (optional)">
        <textarea placeholder="How can we help?"></textarea>
        <button class="btn" type="submit">Send Request</button>
        <p class="done" style="display:none;color:var(--accent);font-weight:600">Thanks! We'll be in touch shortly.</p>
      </form>
    </div>
    <div class="reveal">
      <ul class="info">
        <li><b>Call or Text</b><a href="${telHref(phone)}">${esc(phone)}</a></li>
        <li><b>Service Area</b>${esc(city)} & surrounding areas</li>
        <li><b>Hours</b>Mon–Sat, 8am–6pm</li>
        <li><b>Free Estimates</b>No obligation, no pressure.</li>
      </ul>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="brand">${esc(name)}</div>
    <p>${esc(n.label)} · ${esc(city)} · ${esc(phone)}</p>
    <p style="margin-top:10px;opacity:.6;font-size:.82rem">© ${year}–2026 ${esc(name)}. All rights reserved.</p>
  </div>
</footer>

<a class="float-call" href="${telHref(phone)}" aria-label="Call ${esc(name)}">📞</a>

<script>
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>
</body>
</html>`;
}

// ---- gallery index ---------------------------------------------------------
function renderGallery(items) {
  const cards = items.map((b) => `
    <a class="g-card" href="./${slugify(b.name)}/index.html">
      <div class="g-top" style="background:linear-gradient(135deg, ${NICHES[b.niche].colors.accent}, ${NICHES[b.niche].colors.accent2})">
        <span>${esc(b.name.slice(0, 1))}</span>
      </div>
      <div class="g-body">
        <strong>${esc(b.name)}</strong>
        <span class="g-meta">${esc(NICHES[b.niche].label)} · ${esc(b.city || "")}</span>
      </div>
    </a>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website Factory — Demo Gallery</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,sans-serif;background:#0f1115;color:#e8eaed;padding:48px 24px}
  .wrap{max-width:1000px;margin:0 auto}
  h1{font-size:2.2rem;margin-bottom:6px}
  p.lead{color:#9aa0a8;margin-bottom:34px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
  .g-card{text-decoration:none;color:inherit;background:#1a1d24;border:1px solid #262a33;border-radius:16px;
    overflow:hidden;transition:transform .15s ease,border-color .15s ease}
  .g-card:hover{transform:translateY(-4px);border-color:#3a4150}
  .g-top{height:120px;display:grid;place-items:center}
  .g-top span{font-size:3rem;font-weight:800;color:rgba(255,255,255,.85)}
  .g-body{padding:16px}
  .g-body strong{display:block;margin-bottom:4px}
  .g-meta{color:#9aa0a8;font-size:.85rem}
</style></head><body><div class="wrap">
  <h1>🏭 Website Factory — Demo Gallery</h1>
  <p class="lead">${items.length} demo site${items.length === 1 ? "" : "s"} generated. Click any to preview, then show it on your call.</p>
  <div class="grid">${cards}</div>
</div></body></html>`;
}

// ---- run -------------------------------------------------------------------
function main() {
  const csvArg = process.argv[2] || path.join(here, "leads.csv");
  if (!fs.existsSync(csvArg)) {
    console.error(`No leads file found at: ${csvArg}\nCreate one (see leads.example.csv) or pass a path: node generate.js my-leads.csv`);
    process.exit(1);
  }
  const leads = parseCSV(fs.readFileSync(csvArg, "utf8"));
  if (!leads.length) { console.error("No leads in CSV."); process.exit(1); }

  fs.mkdirSync(outRoot, { recursive: true });
  const built = [];
  for (const biz of leads) {
    if (!biz.name || !biz.niche) { console.warn(`  ⚠ skipping row (needs name + niche): ${JSON.stringify(biz)}`); continue; }
    try {
      const html = renderSite(biz);
      const dir = path.join(outRoot, slugify(biz.name));
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), html);
      built.push(biz);
      console.log(`  ✓ ${biz.name.padEnd(28)} → sites/${slugify(biz.name)}/index.html`);
    } catch (e) {
      console.error(`  ✗ ${biz.name}: ${e.message}`);
    }
  }
  if (built.length) {
    fs.writeFileSync(path.join(outRoot, "index.html"), renderGallery(built));
    console.log(`\n🏭 Built ${built.length} demo site${built.length === 1 ? "" : "s"}.`);
    console.log(`   Open the gallery:  website-factory/sites/index.html`);
  }
}

if (require.main === module) main();
module.exports = { renderSite, renderGallery, slugify, parseCSV };
