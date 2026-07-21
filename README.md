# friendly-broccoli

An interactive 3D website playground. Everything is a single HTML file — no build step, no downloads. Open it in any browser, on a phone or a computer.

## Pages

- **`index.html` — "the scroll"**: a scroll-driven 3D ride. As you scroll (touch on phones, wheel/trackpad on computers), the camera flies through six scenes — floating crystals, a neon ring tunnel, a color-shifting morphing blob, a 30,000-particle spiral galaxy, a ringed planet with moons, and a confetti finale. Trendy reel-style captions pop in as each scene arrives. Move your mouse (or tilt your phone) to tilt the camera. Automatically switches to a lighter "phone mode" on small touch devices.
- **`3d-playground.html` — "Shape Playground"**: a 3D toy. Drag to spin the world, tap shapes to pop them, tap empty space to spawn new ones. Make-it-rain and party-mode buttons included.

## Running it

Just open `index.html` in a browser, or serve the folder with any static server:

```
python3 -m http.server
```

then visit http://localhost:8000 — works great on GitHub Pages too.
