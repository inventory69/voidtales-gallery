# 🎨 VoidTales Gallery

A sleek, high-performance photo gallery built with [Astro](https://astro.build/), TypeScript, and vanilla CSS/JS.  
Showcase your photos with modern design, automatic sorting, and seamless dark mode – no heavy frameworks, just pure speed.

---

## ✨ Features

- 🚀 **Blazing-fast static generation** with Astro for instant loading
- 🖼️ **Markdown-driven photo management** – Add metadata like dates for automatic sorting
- 📅 **Smart sorting** – Photos sorted by `date` (newest first, precise to the millisecond)
- 🎯 **Modern hero section** – Eye-catching intro between header and gallery with responsive sizing and min-height protection
- 🛠️ **Minimal stack** – Astro for static sites, Preact only for client interactions (no React/Vue bloat)
- ♿ **Accessible lightbox** – Powered by @fancyapps/ui (Fancybox v6) for smooth image viewing, lazy loading, and screen reader support
- 🌗 **Instant dark mode** – Flicker-free theme switching with local storage and CSS variables
- 📱 **Fully responsive** – Optimized for desktop, tablet, and mobile with CSS Grid and media queries
- ⚡ **Performance-first** – Lazy loading images, efficient CSS, WebP thumbnails via Sharp, and no unnecessary JS
- 🎨 **Refined UI** – Transparent sticky header with blur, centered logo, mobile menu, and dynamic positioning
- 🖼️ **Automatic thumbnail generation** – Node script using Sharp for optimized WebP images

---

## 🚀 Getting Started

### 📦 1. Install Dependencies
```bash
pnpm install
```
Key dependencies: Astro, Preact, @fancyapps/ui (for lightbox), Sharp (for thumbnails), and TypeScript.

### 🖼️ 2. Add Your Images
Place original images in:
```
public/images/original/
```
Example: `public/images/original/photo.jpg`

### 🛠️ 3. Generate Thumbnails (Recommended)
Run the script to create optimized WebP thumbnails:
```bash
pnpm run gen:thumbs
```
Thumbnails will be saved in `public/images/thumbs/` (sizes: 200px and 400px).

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
date: "2023-10-01T12:34:56"  # ISO format for sorting (precise to seconds)
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
│   │   └── thumbs/       # Auto-generated WebP thumbnails (200px, 400px)
├── src/
│   ├── components/
│   │   ├── Header.astro          # Sticky header with nav, centered logo, mobile menu, and theme toggle
│   │   ├── PhotoGrid.astro       # Server-rendered wrapper for PhotoGridClient
│   │   ├── PhotoGridClient.tsx   # Client-side grid with Fancybox lightbox and lazy loading
│   │   └── ThemeToggle.jsx       # Modern theme switcher with CSS animations
│   ├── content/
│   │   └── photos/               # Markdown files with photo metadata (date, paths, etc.)
│   ├── pages/
│   │   └── index.astro           # Main page with hero, sorting, and gallery
│   └── styles/
│       └── global.css            # Unified styles with CSS variables, dark mode, and responsive design
├── scripts/
│   └── generate-thumbs.js        # Sharp-based thumbnail generator for WebP
├── package.json                  # Dependencies: Astro, Preact, @fancyapps/ui, Sharp
└── README.md
```

---

## 📝 Notes

- **Sorting**: Photos are automatically sorted by `date` (newest first, precise to milliseconds). Ensure all Markdown files have a `date` field in ISO format.
- **Hero Section**: Customizable intro area in `index.astro` – responsive with min-height to prevent button clipping.
- **Lightbox**: Uses @fancyapps/ui (Fancybox) for accessibility (ARIA labels, keyboard navigation) and performance (lazy loading).
- **Thumbnails**: Generated via Sharp in WebP format for better compression – run `pnpm run gen:thumbs` after adding images.
- **Dark Mode**: Applied on load to avoid flashes; stored in localStorage with CSS variables for seamless switching.
- **Performance**: Images lazy-load; CSS is optimized with variables and utilities; no heavy frameworks.
- **Header**: Transparent with backdrop-filter blur, centered logo, mobile-friendly menu with vanilla JS.
- **Minimal Frameworks**: Pure Astro + TypeScript + CSS/JS for server-side, Preact only for lightweight client interactions (no React/Vue bloat).
- **Build**: Includes thumbnail generation in `build` script for production.

---

## 📜 License

MIT License

Copyright (c) 2025 inventory69

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.