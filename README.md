# 🎨 VoidTales Gallery

A sleek, high-performance photo gallery built with [Astro](https://astro.build/), TypeScript, and vanilla CSS/JS.  
Showcase your photos with modern design, automatic sorting, and seamless dark mode – no heavy frameworks, just pure speed.

---

## ✨ Features

- 🚀 **Blazing-fast static generation** with Astro for instant loading
- 🖼️ **Markdown-driven photo management** – Add metadata like dates for automatic sorting
- 📅 **Smart sorting** – Photos sorted by date (newest first, precise to the second)
- 🎯 **Modern hero section** – Eye-catching intro between header and gallery
- 🛠️ **Minimal stack** – Astro for static sites, Preact only for client interactions (no React/Vue bloat)
- ♿ **Accessible lightbox** with responsive CSS Grid and smooth hover effects
- 🌗 **Instant dark mode** – Flicker-free theme switching with local storage
- 📱 **Fully responsive** – Optimized for desktop, tablet, and mobile
- ⚡ **Performance-first** – Lazy loading, efficient CSS, and no unnecessary JS
- 🎨 **Refined UI** – Transparent sticky header, centered logo, mobile menu, and dynamic positioning

---

## 🚀 Getting Started

### 📦 1. Install Dependencies
```bash
pnpm install
```

### 🖼️ 2. Add Your Images
Place original images in:
```
public/images/original/
```
Example: `public/images/original/photo.jpg`

### 🛠️ 3. Generate Thumbnails (Optional, Recommended)
Run the script to create optimized thumbnails:
```bash
node scripts/generate-thumbs.js
```
Thumbnails will be saved in `public/images/thumbs/`.

### 🗂️ 4. Add Photo Metadata
Create Markdown files in:
```
src/content/photos/
```
Example: `src/content/photos/photo.md`

Each file needs frontmatter like this:
```markdown
---
title: "My Photo"
slug: "my-photo"
date: "2023-10-01T12:34:56"  # ISO format for sorting
fullsizePath: "/images/original/photo.webp"
thumbPath: "/images/thumbs/photo-400.webp"
width: 1600
height: 900
caption: "A beautiful moment"
---
```

### ▶️ 5. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:4321](http://localhost:4321) to see your gallery.

---

## 📁 Project Structure

```
├── public/
│   ├── images/
│   │   ├── original/     # Your full-size images
│   │   └── thumbs/       # Auto-generated thumbnails
├── src/
│   ├── components/
│   │   ├── Header.astro          # Sticky header with logo, nav, and theme toggle
│   │   ├── PhotoGrid.astro       # Server-rendered photo grid
│   │   ├── PhotoGridClient.tsx   # Client-side grid with lightbox (Preact)
│   │   └── ThemeToggle.jsx       # Modern theme switcher
│   ├── content/
│   │   └── photos/               # Markdown files with photo metadata
│   ├── pages/
│   │   └── index.astro           # Main page with hero and sorted gallery
│   └── styles/
│       └── global.css            # Unified, responsive styles
├── scripts/
│   └── generate-thumbs.js        # Thumbnail generator
├── package.json
└── README.md
```

---

## 📝 Notes

- **Sorting**: Photos are automatically sorted by `date` (newest first). Ensure all Markdown files have a `date` field.
- **Hero Section**: Customizable intro area – edit texts in `index.astro`.
- **Lightbox**: Powered by Fancybox for accessibility and smooth UX.
- **Dark Mode**: Applied on load to avoid flashes; stored in localStorage.
- **Performance**: Images lazy-load; CSS is optimized for speed.
- **Header**: Transparent with blur, centered logo, mobile-friendly menu.
- **No Frameworks**: Pure Astro + TypeScript + CSS/JS – lightweight and fast.

---

## 📜 License

MIT License

Copyright (c) 2025 inventory69

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.