# friendly-broccoli

An interactive 3D website playground. Everything is a single HTML file — no build step, no downloads. Open it in any browser, on a phone or a computer.

## Pages

- **`index.html` — "her walk: neon dreams"**: a 3D girl who walks when you scroll and stops when you stop, rendered with a cinematic pipeline — ACES filmic tone mapping and real bloom, so every neon light actually glows. She strides through a neon city with flickering signs, into a synthwave sunset over an endless grid, through a glowing crystal forest, under aurora ribbons among the stars, and finally through a pulsing portal with confetti. Jointed knees and elbows, glowing sneakers, ponytail physics, blinking eyes. Trendy reel-style captions pop in per scene. Move your mouse (or tilt your phone) to move the camera. Automatically switches to a lighter "phone mode" on small touch devices.
- **`ride.html` — "the scroll"**: a scroll-driven 3D space ride. The camera flies through floating crystals, a neon ring tunnel, a color-shifting morphing blob, a 30,000-particle spiral galaxy, and a ringed planet with moons.
- **`3d-playground.html` — "Shape Playground"**: a 3D toy. Drag to spin the world, tap shapes to pop them, tap empty space to spawn new ones. Make-it-rain and party-mode buttons included.

## Running it

Just open `index.html` in a browser, or serve the folder with any static server:

```
python3 -m http.server
```

then visit http://localhost:8000 — works great on GitHub Pages too.
