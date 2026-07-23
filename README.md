# friendly-broccoli — hero showcase

A React + TypeScript + Vite + Tailwind CSS site where each page is a standalone,
full-viewport hero section.

## Pages

| Route        | Hero       | Description                                                                                   |
| ------------ | ---------- | --------------------------------------------------------------------------------------------- |
| `/`          | Home       | Index that links to each hero page.                                                            |
| `/securify`  | `securify` | Data-security SaaS hero: looping fullscreen background video, floating pill navbar, staggered giant typography, stat blocks. |
| `/toonhub`   | `TOONHUB`  | Character-figurine carousel: rotating center/left/right/back roles, giant "3D SHAPE" ghost text, grain overlay, animated 650ms crossfades. |

## Tech

- **React 18** + **TypeScript** (strict)
- **Vite 6**
- **Tailwind CSS 3**
- **react-router-dom** for page routing
- **lucide-react** for icons (TOONHUB arrows)

Fonts loaded via Google Fonts: **Readex Pro** (securify), **Anton** + **Inter** (TOONHUB).

## Getting started

```bash
npm install
npm run dev      # start the dev server at http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the production build
```
