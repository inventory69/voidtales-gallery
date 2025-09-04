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
- 🔧 **Config-driven navigation** – Control and extend nav links via `src/config/navigation.js` (e.g., Portal, Wiki, Blog, Forum, Discord, Map)
- 📐 **High-resolution thumbnail support** – Optimized for Retina displays with srcset (1x/2x)
- 🌫️ **Background effects** – Blurred images with overlay for Light/Dark Mode

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
Thumbnails will be saved in `public/images/thumbs/` (sizes: 200px, 400px, and 800px for high-resolution).

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
│   │   └── thumbs/       # Auto-generated WebP thumbnails (200px, 400px, 800px)
├── src/
│   ├── components/
│   │   ├── Header.astro          # Sticky header with nav, centered logo, mobile menu, and theme toggle
│   │   ├── PhotoGrid.astro       # Server-rendered wrapper for PhotoGridClient
│   │   ├── PhotoGridClient.tsx   # Client-side grid with Fancybox lightbox, lazy loading, and srcset for high-res
│   │   └── ThemeToggle.jsx       # Modern theme switcher with CSS animations
│   ├── config/
│   │   └── navigation.js         # Config for nav links (Portal, Wiki, Blog, Forum, Discord, Map)
│   ├── content/
│   │   └── photos/               # Markdown files with photo metadata (date, paths, etc.)
│   ├── pages/
│   │   └── index.astro           # Main page with hero, sorting, and gallery
│   └── styles/
│       └── global.css            # Unified styles with CSS variables, dark mode, background blur/overlay
├── scripts/
│   └── generate-thumbs.js        # Sharp-based thumbnail generator for WebP (now includes 800px for 2x)
├── package.json                  # Dependencies: Astro, Preact, @fancyapps/ui, Sharp
└── README.md
```

---

## 🔧 Customize Navigation

Edit `src/config/navigation.js` to add or remove nav links. Current links:

```javascript
export const navigationLinks = [
  { label: 'Portal', href: 'https://portal.voidtales.win' },
  { label: 'Wiki', href: 'https://wiki.voidtales.win' },
  { label: 'Blog', href: 'https://blog.voidtales.win' },
  { label: 'Forum', href: 'https://forum.voidtales.win' },
  { label: 'Discord', href: 'https://discord.voidtales.win' },
  { label: 'Map', href: 'https://dynmap.voidtales.win' },
];
```

---

## 🤝 Contributing

We welcome contributions! Here’s how you can make changes to the repo:

### 🛠️ 1. Fork the Repository
Go to [https://github.com/inventory69/voidtales-gallery](https://github.com/inventory69/voidtales-gallery) and click "Fork".

### 🌿 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 📝 3. Make Your Changes
- Edit code, add images, or update documentation.
- Ensure thumbnails are generated: `pnpm run gen:thumbs`.
- Test your changes: `pnpm run dev`.

### 📤 4. Submit a Pull Request
- Push your branch: `git push origin feature/your-feature-name`.
- Go to your fork and click "New Pull Request".
- Describe your changes in detail (e.g., "Added new navigation link for Discord").

**Preview Deployments:**  
When you open a Pull Request, our Dokploy Server will automatically create a preview deployment for your changes.  
A link to the preview deployment will appear in the Pull Request, so you and reviewers can test your changes live before merging.

- Wait for review and merge.

### 📋 Guidelines
- Follow the code style (TypeScript).
- Add tests if possible.
- Update the README if you add new features.
- Commits should be descriptive (e.g., "feat: Add Discord link to navigation").

---

## 📝 Notes

- **Sorting**: Photos are automatically sorted by `date` (newest first, precise to milliseconds). Ensure all Markdown files have a `date` field in ISO format.
- **Hero Section**: Customizable intro area in `index.astro` – responsive with min-height to prevent button clipping.
- **Lightbox**: Uses @fancyapps/ui (Fancybox) for accessibility (ARIA labels, keyboard navigation) and performance (lazy loading).
- **Thumbnails**: Generated via Sharp in WebP format for better compression – run `pnpm run gen:thumbs` after adding images. Now includes 800px for high-resolution displays.
- **Dark Mode**: Applied on load to avoid flashes; stored in localStorage with CSS variables for seamless switching.
- **Performance**: Images lazy-load; CSS is optimized with variables and utilities; no heavy frameworks.
- **Header**: Transparent with backdrop-filter blur, centered logo, mobile-friendly menu with vanilla JS.
- **Background Effects**: Blurred images with overlay for Light/Dark Mode to create an elegant look.
- **Minimal Frameworks**: Pure Astro + TypeScript + CSS/JS for server-side, Preact only for lightweight client interactions (no React/Vue bloat).
- **Build**: Includes thumbnail generation in `build` script for production.

---

## 📜 License

MIT License

Copyright (c) 2025 inventory69 & Hyphonical

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
