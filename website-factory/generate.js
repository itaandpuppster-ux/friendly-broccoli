#!/usr/bin/env node
// generate.js — the Website Factory.
// Feed it a list of local businesses; it produces a complete, premium demo
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
// Zero dependencies. Photos load from a real browser; if any photo fails, the
// page falls back to a hand-built mesh scene so it never looks broken.

const fs = require("fs");
const path = require("path");
const { NICHES } = require("./niches.js");

const here = __dirname;
const outRoot = path.join(here, "sites");

// ---- tiny helpers ----------------------------------------------------------
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const telHref = (p) => "tel:" + String(p).replace(/[^0-9+]/g, "");
const monogram = (s) => s.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const NOISE = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='140'%20height='140'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.85'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E";

// A photo frame: real image on top, mesh-gradient scene underneath. If the
// image fails to load it removes itself and the premium mesh shows through.
const frame = (url, cls = "") =>
  `<div class="frame ${cls}"><img src="${esc(url)}" alt="" loading="lazy" onerror="this.remove()"><span class="frame-mark"></span></div>`;

const icon = (d) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

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
  const rawTagline = biz.tagline || n.tagline;
  const year = 1998 + (name.length % 22);
  const px = n.photos;

  // Headline: keep line breaks, highlight the key word.
  let heroTitle = esc(rawTagline);
  if (n.highlight) heroTitle = heroTitle.replace(esc(n.highlight), `<em class="hl">${esc(n.highlight)}</em>`);
  heroTitle = heroTitle.replace(/\n/g, "<br>");

  const badges = n.badges.map((b) => `<span class="badge">${icon(NICHES.medspa.services[3][2])}${esc(b)}</span>`).join("");

  const services = n.services.map(([t, d, ic], i) => `
      <article class="svc reveal" style="--d:${i * 60}ms">
        <div class="svc-ic">${icon(ic)}</div>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
        <span class="svc-more">Learn more ${icon("M5 12h14M13 6l6 6-6 6")}</span>
      </article>`).join("");

  const spotlights = n.spotlight.map(([h, p], i) => `
    <div class="spot ${i % 2 ? "flip" : ""}">
      ${frame(px[i + 1], "spot-img reveal")}
      <div class="spot-txt reveal">
        <span class="kicker">${i % 2 ? "Why us" : "Our promise"}</span>
        <h3>${esc(h)}</h3>
        <p>${esc(p)}</p>
        <ul class="ticks">
          <li>${icon("M5 12l4 4 10-11")}${esc(n.badges[0])}</li>
          <li>${icon("M5 12l4 4 10-11")}${esc(n.badges[2] || n.badges[1])}</li>
          <li>${icon("M5 12l4 4 10-11")}Free, no-pressure consultation</li>
        </ul>
        <a class="btn sm" href="#contact">${esc(n.cta)}</a>
      </div>
    </div>`).join("");

  const reviews = [
    [`Absolutely the best in ${city}. Professional, friendly, and worth every penny.`, "Jamie R."],
    [`From the first call to the finished result, ${name} was fantastic. Highly recommend.`, "Morgan T."],
    [`Honest, on time, and the quality speaks for itself. We won't go anywhere else.`, "Alex P."],
  ].map(([q, who]) => `
      <figure class="review reveal">
        <div class="stars">${"★".repeat(5)}</div>
        <blockquote>${esc(q)}</blockquote>
        <figcaption><span class="ava">${esc(monogram(who))}</span>${esc(who)}</figcaption>
      </figure>`).join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(name)} — ${esc(n.label)} in ${esc(city)}</title>
<meta name="description" content="${esc(name)}: ${esc(n.sub)} Serving ${esc(city)}. Call ${esc(phone)}.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${n.googleFonts}&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:${c.bg}; --surface:${c.surface}; --text:${c.text}; --muted:${c.muted};
    --accent:${c.accent}; --accent2:${c.accent2}; --deep:${c.deep}; --hero:${c.hero};
    --fh:${n.fonts.heading}; --fb:${n.fonts.body};
    --shadow:0 30px 60px -30px color-mix(in srgb,var(--deep) 55%,transparent);
    --line:color-mix(in srgb,var(--text) 10%,transparent);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:var(--fb);color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  h1,h2,h3{font-family:var(--fh);line-height:1.08;font-weight:700;letter-spacing:-.01em}
  a{color:inherit;text-decoration:none}
  img{max-width:100%;display:block}
  .wrap{max-width:1160px;margin:0 auto;padding:0 24px}
  .kicker{display:inline-block;color:var(--accent);font-weight:700;letter-spacing:.18em;text-transform:uppercase;font-size:.72rem;font-family:var(--fb)}

  .btn{display:inline-flex;align-items:center;gap:8px;background:var(--accent);color:#fff;padding:15px 30px;border-radius:999px;
    font-weight:600;font-family:var(--fb);cursor:pointer;border:none;font-size:1rem;
    box-shadow:0 12px 24px -10px color-mix(in srgb,var(--accent) 80%,transparent);
    transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}
  .btn:hover{transform:translateY(-2px);filter:brightness(1.06);box-shadow:0 18px 30px -12px color-mix(in srgb,var(--accent) 85%,transparent)}
  .btn.ghost{background:transparent;color:var(--text);border:1.5px solid var(--line);box-shadow:none}
  .btn.ghost:hover{border-color:var(--text);background:transparent}
  .btn.sm{padding:12px 24px;font-size:.95rem}
  .btn svg{width:18px;height:18px}

  /* photo frame + mesh fallback */
  .frame{position:relative;overflow:hidden;border-radius:22px;box-shadow:var(--shadow);
    background:
      radial-gradient(90% 90% at 15% 10%, var(--accent2), transparent 60%),
      radial-gradient(80% 80% at 95% 20%, var(--accent), transparent 55%),
      radial-gradient(120% 120% at 60% 110%, var(--deep), transparent 62%),
      var(--accent);}
  .frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .frame-mark{position:absolute;inset:0;background:url("${NOISE}");opacity:.14;mix-blend-mode:overlay;pointer-events:none}

  /* nav */
  header.nav{position:sticky;top:0;z-index:60;background:color-mix(in srgb,var(--bg) 78%,transparent);
    backdrop-filter:saturate(160%) blur(14px);border-bottom:1px solid var(--line)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:74px}
  .brand{font-family:var(--fh);font-weight:800;font-size:1.4rem;display:flex;align-items:center;gap:10px}
  .brand .dot{width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 22%,transparent)}
  nav.links{display:flex;gap:30px;align-items:center}
  nav.links a:not(.btn){color:var(--muted);font-size:.95rem;font-weight:500}
  nav.links a:not(.btn):hover{color:var(--text)}
  @media(max-width:880px){nav.links a:not(.btn){display:none}}

  /* hero */
  .hero{position:relative;padding:70px 0 90px;overflow:hidden}
  .hero::before{content:"";position:absolute;inset:0;z-index:-2;background:
    radial-gradient(60% 55% at 85% 8%, color-mix(in srgb,var(--accent) 26%,transparent), transparent 60%),
    radial-gradient(55% 50% at 5% 20%, color-mix(in srgb,var(--accent2) 34%,transparent), transparent 60%),
    linear-gradient(180deg, var(--hero), var(--bg) 70%)}
  .hero::after{content:"";position:absolute;inset:0;z-index:-1;background:url("${NOISE}");opacity:.05}
  .hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:56px;align-items:center}
  @media(max-width:920px){.hero-grid{grid-template-columns:1fr;gap:40px}}
  .hero-copy{display:grid;gap:24px;max-width:600px}
  .pill{display:inline-flex;align-items:center;gap:9px;background:var(--surface);border:1px solid var(--line);
    padding:7px 15px 7px 9px;border-radius:999px;font-size:.82rem;font-weight:600;color:var(--muted);width:max-content;box-shadow:var(--shadow)}
  .pill b{display:inline-flex;background:color-mix(in srgb,var(--accent) 15%,transparent);color:var(--accent);
    padding:2px 9px;border-radius:999px;font-size:.72rem;letter-spacing:.06em}
  h1{font-size:clamp(2.7rem,6.4vw,4.7rem)}
  h1 .hl{font-style:normal;color:var(--accent);position:relative;white-space:nowrap}
  h1 .hl::after{content:"";position:absolute;left:0;right:0;bottom:.06em;height:.16em;border-radius:4px;
    background:color-mix(in srgb,var(--accent) 30%,transparent)}
  .hero p.sub{font-size:1.18rem;color:var(--muted);max-width:520px}
  .hero .actions{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
  .rating{display:flex;align-items:center;gap:10px;color:var(--muted);font-size:.9rem;font-weight:500}
  .rating .stars{color:var(--accent);letter-spacing:1px}

  /* hero visual */
  .hero-art{position:relative}
  .hero-art .frame{aspect-ratio:4/5}
  .glass{position:absolute;background:color-mix(in srgb,#fff 72%,transparent);backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.6);border-radius:16px;box-shadow:var(--shadow);padding:14px 16px;display:flex;align-items:center;gap:12px}
  .glass .g-ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--accent);color:#fff}
  .glass .g-ic svg{width:20px;height:20px}
  .glass b{display:block;font-family:var(--fh);font-size:1.05rem;line-height:1}
  .glass span{font-size:.78rem;color:var(--muted)}
  .glass.g1{top:24px;left:-22px;animation:float 5s ease-in-out infinite}
  .glass.g2{bottom:26px;right:-18px;animation:float 6s ease-in-out infinite .8s}
  @media(max-width:520px){.glass.g1{left:6px}.glass.g2{right:6px}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

  /* marquee trust bar */
  .trust{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--surface)}
  .trust-in{display:flex;flex-wrap:wrap;gap:14px 26px;justify-content:center;padding:22px 24px}
  .badge{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-size:.88rem;color:var(--muted)}
  .badge svg{width:17px;height:17px;color:var(--accent)}

  /* sections */
  section{padding:92px 0}
  .head{max-width:640px;margin:0 auto 56px;text-align:center;display:grid;gap:14px}
  .head h2{font-size:clamp(2.1rem,4.4vw,3.1rem)}
  .head p{color:var(--muted);font-size:1.1rem}

  /* services */
  .svcs{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:22px}
  .svc{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:32px 28px;position:relative;
    transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
  .svc:hover{transform:translateY(-6px);box-shadow:var(--shadow);border-color:transparent}
  .svc-ic{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;margin-bottom:18px;
    background:color-mix(in srgb,var(--accent) 13%,transparent);color:var(--accent)}
  .svc-ic svg{width:26px;height:26px}
  .svc h3{font-size:1.28rem;margin-bottom:9px}
  .svc p{color:var(--muted);font-size:.98rem}
  .svc-more{display:inline-flex;align-items:center;gap:6px;color:var(--accent);font-weight:600;font-size:.9rem;margin-top:16px;font-family:var(--fb)}
  .svc-more svg{width:16px;height:16px;transition:transform .2s ease}
  .svc:hover .svc-more svg{transform:translateX(4px)}

  /* spotlight */
  .spots{display:grid;gap:64px}
  .spot{display:grid;grid-template-columns:1fr 1fr;gap:52px;align-items:center}
  .spot.flip .spot-img{order:2}
  .spot-img{aspect-ratio:5/4}
  .spot-txt{display:grid;gap:16px;align-content:center}
  .spot-txt h3{font-size:clamp(1.7rem,3.2vw,2.4rem)}
  .spot-txt p{color:var(--muted);font-size:1.06rem}
  .ticks{display:grid;gap:10px;margin:6px 0 8px}
  .ticks li{list-style:none;display:flex;align-items:center;gap:10px;font-weight:500}
  .ticks svg{width:20px;height:20px;color:var(--accent);flex:none}
  .spot-txt .btn{width:max-content}
  @media(max-width:860px){.spot{grid-template-columns:1fr;gap:30px}.spot.flip .spot-img{order:0}}

  /* stats band */
  .stats{background:linear-gradient(135deg,var(--deep),color-mix(in srgb,var(--accent) 60%,var(--deep)));color:#fff;border-radius:28px;
    display:grid;grid-template-columns:repeat(4,1fr);gap:20px;padding:46px 40px;box-shadow:var(--shadow)}
  .stats .st{text-align:center}
  .stats b{display:block;font-family:var(--fh);font-size:clamp(2rem,4vw,2.9rem);line-height:1}
  .stats span{font-size:.86rem;opacity:.82;margin-top:6px;display:block}
  @media(max-width:680px){.stats{grid-template-columns:repeat(2,1fr);gap:30px 20px;padding:38px 24px}}

  /* gallery */
  .gal{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:150px;gap:16px}
  .gal .frame{width:100%;height:100%}
  .gal .g-a{grid-column:span 2;grid-row:span 2}
  .gal .g-d{grid-column:span 2}
  @media(max-width:720px){.gal{grid-template-columns:repeat(2,1fr)}.gal .g-a{grid-column:span 2}}

  /* reviews */
  .reviews-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:22px}
  .review{background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:30px 28px;display:grid;gap:14px}
  .review .stars{color:var(--accent);letter-spacing:2px;font-size:1.05rem}
  .review blockquote{font-size:1.05rem;line-height:1.5}
  .review figcaption{display:flex;align-items:center;gap:12px;font-weight:600;font-size:.92rem;margin-top:4px}
  .ava{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-family:var(--fh);font-weight:700;
    color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent2));font-size:.9rem}

  /* CTA band */
  .cta-band{position:relative;overflow:hidden;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;
    border-radius:32px;text-align:center;padding:70px 28px}
  .cta-band::after{content:"";position:absolute;inset:0;background:url("${NOISE}");opacity:.12}
  .cta-band>*{position:relative}
  .cta-band h2{font-size:clamp(2.1rem,4.6vw,3.3rem);color:#fff}
  .cta-band p{opacity:.94;margin:14px auto 28px;font-size:1.15rem;max-width:520px}
  .cta-band .btn{background:#fff;color:var(--text)}

  /* contact */
  .contact-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:48px}
  @media(max-width:860px){.contact-grid{grid-template-columns:1fr}}
  form{display:grid;gap:14px}
  .f2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  input,textarea{font-family:var(--fb);font-size:1rem;padding:15px 16px;border-radius:13px;width:100%;
    border:1px solid var(--line);background:var(--surface);color:var(--text);transition:border-color .15s ease,box-shadow .15s ease}
  input:focus,textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 15%,transparent)}
  textarea{min-height:120px;resize:vertical}
  .info{display:grid;gap:8px;align-content:start;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:30px}
  .info .row{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--line)}
  .info .row:last-child{border-bottom:none}
  .info .ri{width:42px;height:42px;border-radius:12px;flex:none;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 13%,transparent);color:var(--accent)}
  .info .ri svg{width:20px;height:20px}
  .info b{font-family:var(--fh);display:block;font-size:1.02rem}
  .info span{color:var(--muted);font-size:.92rem}

  footer{background:var(--deep);color:color-mix(in srgb,#fff 74%,var(--deep));padding:56px 0 30px;margin-top:10px}
  .foot-top{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap;align-items:center;padding-bottom:26px;border-bottom:1px solid rgba(255,255,255,.12)}
  footer .brand{color:#fff}
  .foot-bot{padding-top:22px;font-size:.84rem;opacity:.7;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}

  .float-call{position:fixed;right:18px;bottom:18px;z-index:70;background:var(--accent);color:#fff;
    width:60px;height:60px;border-radius:50%;display:grid;place-items:center;
    box-shadow:0 14px 34px -8px color-mix(in srgb,var(--accent) 90%,transparent)}
  .float-call svg{width:26px;height:26px}
  @media(min-width:881px){.float-call{display:none}}

  .reveal{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease;transition-delay:var(--d,0ms)}
  .reveal.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;transition:none}.glass{animation:none}}
</style>
</head>
<body>
<header class="nav">
  <div class="wrap nav-in">
    <div class="brand"><span class="dot"></span>${esc(name)}</div>
    <nav class="links">
      <a href="#services">Services</a>
      <a href="#story">About</a>
      <a href="#work">Gallery</a>
      <a href="#reviews">Reviews</a>
      <a class="btn sm" href="#contact">${esc(n.cta)}</a>
    </nav>
  </div>
</header>

<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <span class="pill"><b>OPEN</b> ${esc(n.label)} · ${esc(city)}</span>
      <h1>${heroTitle}</h1>
      <p class="sub">${esc(n.sub)}</p>
      <div class="actions">
        <a class="btn" href="#contact">${esc(n.cta)} ${icon("M5 12h14M13 6l6 6-6 6")}</a>
        <a class="btn ghost" href="${telHref(phone)}">${icon("M4 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 011-2z")} ${esc(phone)}</a>
      </div>
      <div class="rating"><span class="stars">★★★★★</span> Rated 4.9/5 by 1,200+ happy ${esc(city)} customers</div>
    </div>
    <div class="hero-art">
      ${frame(px[0])}
      <div class="glass g1"><span class="g-ic">${icon(n.services[0][2])}</span><div><b>${esc(n.badges[0])}</b><span>You're in good hands</span></div></div>
      <div class="glass g2"><span class="g-ic">${icon("M12 3l2.6 6.3L21 10l-5 4 1.5 7L12 17l-5.5 4L8 14 3 10l6.4-.7z")}</span><div><b>4.9 ★ Rating</b><span>1,200+ reviews</span></div></div>
    </div>
  </div>
</section>

<div class="trust"><div class="trust-in">${badges}</div></div>

<section id="services">
  <div class="wrap">
    <div class="head reveal">
      <span class="kicker">What we do</span>
      <h2>Everything you need, done right</h2>
      <p>Trusted by neighbors across ${esc(city)} — one call and it's handled.</p>
    </div>
    <div class="svcs">${services}</div>
  </div>
</section>

<section id="story" style="padding-top:0">
  <div class="wrap spots">${spotlights}</div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="stats reveal">
      <div class="st"><b>${2026 - year}+</b><span>Years serving ${esc(city)}</span></div>
      <div class="st"><b>1,200+</b><span>Happy customers</span></div>
      <div class="st"><b>4.9★</b><span>Average rating</span></div>
      <div class="st"><b>100%</b><span>Satisfaction focus</span></div>
    </div>
  </div>
</section>

<section id="work">
  <div class="wrap">
    <div class="head reveal">
      <span class="kicker">Our work</span>
      <h2>See the difference for yourself</h2>
      <p>A look at recent projects and happy results around ${esc(city)}.</p>
    </div>
    <div class="gal reveal">
      ${frame(px[0], "g-a")}
      ${frame(px[1], "g-b")}
      ${frame(px[2], "g-c")}
      ${frame(px[3], "g-d")}
      ${frame(px[4], "g-e")}
    </div>
  </div>
</section>

<section id="reviews" style="padding-top:0">
  <div class="wrap">
    <div class="head reveal">
      <span class="kicker">Reviews</span>
      <h2>What ${esc(city)} is saying</h2>
    </div>
    <div class="reviews-grid">${reviews}</div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta-band reveal">
      <h2>Ready to get started?</h2>
      <p>Book in under a minute — or call us right now and talk to a real person.</p>
      <a class="btn" href="${telHref(phone)}">${icon("M4 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 011-2z")} Call ${esc(phone)}</a>
    </div>
  </div>
</section>

<section id="contact" style="padding-top:0">
  <div class="wrap contact-grid">
    <div class="reveal">
      <span class="kicker">Get in touch</span>
      <h2 style="font-size:clamp(1.9rem,4vw,2.7rem);margin:12px 0 20px">${esc(n.cta)}</h2>
      <form onsubmit="event.preventDefault();this.querySelector('.done').style.display='flex';this.reset();">
        <div class="f2"><input required placeholder="Your name"><input required type="tel" placeholder="Phone number"></div>
        <input type="email" placeholder="Email (optional)">
        <textarea placeholder="How can we help?"></textarea>
        <button class="btn" type="submit">Send Request ${icon("M5 12h14M13 6l6 6-6 6")}</button>
        <p class="done" style="display:none;align-items:center;gap:8px;color:var(--accent);font-weight:600">${icon("M5 12l4 4 10-11")} Thanks! We'll be in touch shortly.</p>
      </form>
    </div>
    <div class="info reveal">
      <div class="row"><span class="ri">${icon("M4 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 011-2z")}</span><div><b>Call or Text</b><span><a href="${telHref(phone)}">${esc(phone)}</a></span></div></div>
      <div class="row"><span class="ri">${icon("M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 10a2 2 0 100-.01")}</span><div><b>Service Area</b><span>${esc(city)} & surrounding areas</span></div></div>
      <div class="row"><span class="ri">${icon("M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z")}</span><div><b>Hours</b><span>Mon–Sat, 8am–6pm</span></div></div>
      <div class="row"><span class="ri">${icon("M5 12l4 4 10-11")}</span><div><b>Free Estimates</b><span>No obligation, no pressure.</span></div></div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap">
    <div class="foot-top">
      <div class="brand" style="font-size:1.5rem"><span class="dot"></span>${esc(name)}</div>
      <a class="btn sm" href="${telHref(phone)}">${esc(phone)}</a>
    </div>
    <div class="foot-bot">
      <span>${esc(n.label)} · Proudly serving ${esc(city)} since ${year}</span>
      <span>© ${year}–2026 ${esc(name)}. All rights reserved.</span>
    </div>
  </div>
</footer>

<a class="float-call" href="${telHref(phone)}" aria-label="Call ${esc(name)}">${icon("M4 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 011-2z")}</a>

<script>
  const io=new IntersectionObserver((es)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>
</body>
</html>`;
}

// ---- gallery index ---------------------------------------------------------
function renderGallery(items) {
  const cards = items.map((b) => {
    const n = NICHES[b.niche];
    return `
    <a class="g-card" href="./${slugify(b.name)}/index.html">
      <div class="g-top" style="background:linear-gradient(135deg, ${n.colors.accent}, ${n.colors.accent2})">
        <span>${esc(monogram(b.name))}</span>
      </div>
      <div class="g-body">
        <strong>${esc(b.name)}</strong>
        <span class="g-meta">${esc(n.label)}${b.city ? " · " + esc(b.city) : ""}</span>
      </div>
    </a>`;
  }).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website Factory — Demo Gallery</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:system-ui,-apple-system,sans-serif;background:#0d0f13;color:#e8eaed;padding:52px 24px;min-height:100vh}
  .wrap{max-width:1040px;margin:0 auto}
  h1{font-size:2.3rem;margin-bottom:6px;letter-spacing:-.02em}
  p.lead{color:#9aa0a8;margin-bottom:36px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
  .g-card{color:inherit;background:#171a20;border:1px solid #262a33;border-radius:18px;overflow:hidden;
    transition:transform .16s ease,border-color .16s ease}
  .g-card:hover{transform:translateY(-5px);border-color:#3a4150}
  .g-top{height:128px;display:grid;place-items:center}
  .g-top span{font-size:2.6rem;font-weight:800;color:rgba(255,255,255,.9)}
  .g-body{padding:18px}
  .g-body strong{display:block;margin-bottom:4px;font-size:1.05rem}
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
