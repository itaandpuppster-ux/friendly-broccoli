# 🏭 Website Factory

Automated demo-site generator for the cold-call web-design hustle in
[`../website-cold-call-prompts.md`](../website-cold-call-prompts.md).

It turns the slowest, most manual step of that plan — hand-building a demo site
for every lead — into **one command**. Feed it a list of local businesses; it
outputs a complete, polished, mobile-ready demo site for each one, plus a gallery
page to click through them. Then you make the calls.

## What it does

- Reads a CSV of leads (`name, niche, city, phone, tagline`).
- For each lead, generates a premium single-page site tailored to its **niche**
  — its own colors, fonts, hero copy, services, trust badges, reviews, and a
  working contact form + click-to-call.
- Writes each site to `sites/<business-name>/index.html`.
- Builds `sites/index.html` — a gallery linking every generated site.
- **Zero dependencies.** Pure Node.js. Every output file is self-contained and
  hosts anywhere (Netlify drop, GitHub Pages, or just open the file).

Supported niches: `medspa`, `landscaping`, `roofing`, `restaurant`, `dental`
(the same five as the playbook).

## Use it

```bash
cd website-factory
cp leads.example.csv leads.csv   # then edit leads.csv with real businesses
node generate.js                 # builds every site + the gallery
```

Open `sites/index.html` to preview. Use a custom file with
`node generate.js my-leads.csv`.

### CSV format

```csv
name,niche,city,phone,tagline
Radiant Glow Med Spa,medspa,Austin TX,(512) 555-0142,
Summit Peak Roofing,roofing,Kansas City MO,(816) 555-0113,Storm damage? We handle the claim.
```

- `niche` must be one of the supported niches above.
- `tagline` is optional — leave it blank to use the niche's default headline.

## The honest part

This automates the **build** step. It does not — and no tool can — automate the
calling, closing, and delivering that actually earns the money. The plan is real
and the math in the playbook is reachable, but the revenue comes from you
working the leads. This just makes each demo take seconds instead of 15 minutes,
so you can show up to every call with a custom site already built.

## Make each demo feel custom

Before a call, tweak the lead's `tagline` to reference something hyper-local
(their neighborhood, a landmark, "serving [City] since 1998"). One personal
touch is what turns a *maybe* into a *yes*.

## Extend it

- Add a niche: drop a new entry in `niches.js` (copy an existing one, change the
  colors/copy/services). It's instantly available in the CSV.
- Tweak the design: everything is in the `renderSite()` template in
  `generate.js` — one file, inline CSS, easy to edit.
