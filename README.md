# 🎨 VoidTales Gallery

![VoidTales Gallery Banner](./public/images/githeader.webp)

> **⚠️ IMPORTANT NOTE FOR SELF-HOSTERS**  
> This is a **static site generator** - it does NOT include:
> - Automatic image upload functionality
> - Image management UI or admin panel  
> - Database or backend services
> 
> **You must manually:**
> - Add images to `public/images/original/`
> - Create markdown metadata files in `src/content/photos/`
> - Run the thumbnail generation script
> - Rebuild the site
> 
> If you need automated workflows, you'll need to build your own scripts or CI/CD pipelines. See [Automation Ideas](#-automation-ideas) for inspiration.

A sleek, high-performance photo gallery built with [Astro](https://astro.build/), TypeScript, and vanilla CSS/JS.  
Showcase your photos with modern design, automatic sorting, and seamless dark mode – no heavy frameworks, just pure speed.

---

## ✨ Features

- 🚀 **Blazing-fast static generation** with Astro for instant loading
- ⚡ **Performance-first** – Lazy loading images, efficient CSS, and WebP thumbnails
- 🖼️ **Markdown-driven photo management** – Add metadata like dates for automatic sorting
- 📅 **Smart sorting** – Photos sorted by `date` (newest first, precise to the millisecond), name, or random
- 🔄 **Infinite Scroll** – Loads more images as you scroll, with animated transitions and loader
- 🌗 **Instant dark mode** – Flicker-free theme switching with local storage and CSS variables
- 📱 **Fully responsive** – Optimized for desktop, tablet, and mobile with CSS Grid
- ♿ **Accessible lightbox** – Powered by GLightbox for smooth image viewing and screen reader support
- 🆔 **Unique IDs for Images** – Each image uses a unique ID for reliable sharing and direct linking
- 📤 **GLightbox Share & View Original Buttons** – Share direct links or open originals in a new tab
- 🖼️ **Automatic thumbnail generation** – Node script using Sharp for optimized WebP images
- 🔧 **Config-driven site** – Control navigation, meta-tags, hero text, and more via `src/config/`
- 📥 **Optional external downloads** – Automatically fetch markdown files and images from internal/external URLs during build (configurable via environment variables)
- 🔄 **Refresh Button** – Instantly reloads all thumbnails and resources without cache, so you always see the latest images after updates.
- 👨‍💼 **Staff Badges** – Highlight staff member images in the grid
- 🗂️ **Custom Sorting Selector** – Sort by newest, oldest, name, or random order
- 🖼️ **Animated grid transitions** – Each batch of images animates in with a smooth fade and slide
- 🧩 **Minimal dependencies** – No heavy frameworks, just Astro, Preact, and vanilla CSS/JS

---

## 🚀 Getting Started

### 📦 1. Install Dependencies
```bash
pnpm install
```
Key dependencies: Astro, Preact, GLightbox (for lightbox), Sharp (for thumbnails), dotenv (for environment variables), and TypeScript.

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
id: "unique-image-id"           # Unique ID for the image (used for sharing and GLightbox features)
title: "My Photo"
slug: "my-photo"
date: "2023-10-01T12:34:56"     # ISO format for sorting (precise to seconds)
fullsizePath: "/images/original/photo.webp"
thumbPath: "/images/thumbs/photo-400.webp"
width: 1600
height: 900
caption: "A beautiful moment"
---
```

### 📥 5. Optional: Set Up External Downloads
If you want to automatically download markdown files and images from external sources during the build process:

- Set environment variables in your `.env` file or build environment:
  ```
  EXT_DL_URL_MARKDOWN=http://your-internal-server/markdown/
  EXT_DL_URL_ORIGINAL=http://your-internal-server/original/
  EXT_DL_URL_MARKDOWN_EXTERNAL=http://your-external-server/markdown/  # Fallback
  EXT_DL_URL_ORIGINAL_EXTERNAL=http://your-external-server/original/  # Fallback
  ```

- Configure the download behavior in `src/config/externaldownload.cjs`:
  ```javascript
  require('dotenv').config();

  module.exports = {
    enableCopyMdFiles: true,
    enableCopyOriginalImages: true,
    mdSourceUrlInternal: process.env.EXT_DL_URL_MARKDOWN,
    mdSourceUrlExternal: process.env.EXT_DL_URL_MARKDOWN_EXTERNAL,
    originalSourceUrlInternal: process.env.EXT_DL_URL_ORIGINAL,
    originalSourceUrlExternal: process.env.EXT_DL_URL_ORIGINAL_EXTERNAL,
  };
  ```

- The build scripts will attempt to download from internal URLs first, falling back to external URLs if needed. If no URLs are set, the build proceeds without downloads.

### ▶️ 6. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:4321](http://localhost:4321) to see your gallery.

---

## 📁 Project Structure

```
├── public/
│   ├── images/
│   │   ├── original/     # Your full-size images (or downloaded from external sources)
│   │   └── thumbs/       # Auto-generated WebP thumbnails (200px, 400px, 800px)
├── src/
│   ├── components/
│   │   ├── Header.astro          # Sticky header with nav, centered logo, mobile menu, theme toggle, and refresh button
│   │   ├── PhotoGrid.astro       # Server-rendered wrapper for PhotoGridClient
│   │   ├── PhotoGridClient.tsx   # Client-side grid with GLightbox, infinite scroll, and custom buttons
│   │   ├── ThemeToggle.jsx       # Modern theme switcher with CSS animations
│   │   └── RefreshButton.astro   # Button to reload thumbnails/resources without cache
│   ├── config/
│   │   ├── externaldownload.cjs  # Config for external downloads (enable/disable, URLs via env vars)
│   │   ├── navigation.js         # Config for nav links (Portal, Wiki, Blog, Forum, Discord, Map)
│   │   └── site.js               # Config for site metadata (name, description, URLs, hero text, fonts, etc.)
│   ├── content/
│   │   └── photos/               # Markdown files with photo metadata (date, paths, etc.)
│   ├── pages/
│   │   └── index.astro           # Main page with hero, sorting, and gallery
│   └── styles/
│       ├── variables.css         # CSS variables and dark mode
│       ├── base.css              # Reset, typography, links
│       ├── layout.css            # Container, grid, background effects, Flexbox for footer
│       ├── components.css        # Photo, header, footer, theme toggle, header buttons, GLightbox fixes
│       ├── hero.css              # Hero section styles with min-height for Flexbox compatibility
│       ├── responsive.css        # Media queries
│       └── accessibility.css     # Focus and accessibility
├── scripts/
│   ├── copy-md-files.cjs         # Script to download markdown files from internal/external URLs
│   ├── copy-original-images.cjs  # Script to download images from internal/external URLs
│   ├── generate-thumbs.js        # Sharp-based thumbnail generator for WebP
│   ├── generate-images.js        # Generates images.json from originals and markdown
│   ├── refresh-resources.cjs     # Script to reload thumbnails/resources without cache
├── package.json                  # Dependencies: Astro, Preact, GLightbox, Sharp, dotenv
└── README.md
```

---

## 🔧 Customize Site and Navigation

Edit the config files in `src/config/` to customize the site:

### Navigation Links
Edit `src/config/navigation.js` to add or remove nav links. Current links:

```javascript
export const navigationLinks = [
  { label: 'Portal', href: 'https://portal.voidtales.win' },
  { label: 'Wiki', href: 'https://wiki.voidtales.win' },
  { label: 'Blog', href: 'https://blog.voidtales.win' },
  { label: 'Forum', href: 'https://forum.voidtales.win' },
  { label: 'Discord', href: 'https://discord.gg/QEMQsFect6' },
  { label: 'Map', href: 'https://dynmap.voidtales.win' },
];
```

### Site Metadata and Hero
Edit `src/config/site.js` for site-wide settings like meta-tags, hero text, fonts, and URLs:

```javascript
export const siteConfig = {
  name: 'Void Tales Gallery',
  description: 'A sleek, high-performance photo gallery built with Astro, TypeScript, and vanilla CSS/JS. Showcase your photos with modern design, automatic sorting, and seamless dark mode.',
  url: 'https://gallery.voidtales.win',
  ogImage: '/images/og-image.webp',
  author: 'inventory69',
  keywords: ['photo gallery', 'Astro', 'VoidTales', 'images', 'modern web'],
  fonts: [
    'https://fonts.googleapis.com/css2?family=Macondo&family=Macondo+Swash+Caps&display=swap',
    'https://fonts.googleapis.com/css2?family=Asul:wght@400;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&display=swap'
  ],
  fontFamilyHead: "'Cinzel Decorative', serif",
  fontFamily: "'Asul', sans-serif",
  manifest: '/manifest.json',
  favicon: '/favicon.ico',
  hero: {
    title: 'Void Tales Gallery',
    subtitle: 'The latest images from the world of VoidTales – sorted by date.',
    cta: 'To the images',
  },
  footer: {
    copyright: 'VoidTales',
  },
  defaultSort: 'date-desc',
  staffAuthors: [
    "shinsnowly",
    "Shin Snowly",
  ],
};
```

---

## 🆕 Recent Improvements

- **Infinite Scroll:** Loads more images as you scroll, with animated transitions and loader.
- **Refresh Button:** Instantly reloads all thumbnails and resources without cache.
- **Unique IDs for Images:** Each image uses a unique ID for reliable sharing in GLightbox.
- **GLightbox Share & View Original Buttons:** The lightbox now includes a share button and a "view original" button.
- **Staff Badges:** Highlight staff member images in the grid.
- **Animated grid transitions:** Each batch of images animates in with a smooth fade and slide.
- **Header Buttons:** Improved styling and consistency for header action buttons.
- **Project-wide TypeScript compatibility:** Config imports are now type-safe via `.d.ts` files.

---

## 🤝 Contributing

We welcome contributions to improve VoidTales Gallery! Whether you're fixing bugs, adding features, or enhancing documentation, your help is appreciated.

### 🛠️ 1. Fork and Clone the Repository
- Visit [https://github.com/inventory69/voidtales-gallery](https://github.com/inventory69/voidtales-gallery) and click "Fork".
- Clone your fork locally: `git clone https://github.com/your-username/voidtales-gallery.git`.

### 🌿 2. Set Up Your Development Environment
- Install dependencies: `pnpm install`.
- Generate thumbnails if adding images: `pnpm run gen:thumbs`.
- Start the dev server: `pnpm run dev` and visit [http://localhost:4321](http://localhost:4321).

### 📝 3. Make and Test Your Changes
- Create a feature branch: `git checkout -b feature/your-feature-name`.
- Edit code, add images, or update docs.
- Test thoroughly: Ensure thumbnails are generated, run `pnpm run dev`, and check responsiveness.
- Commit changes: `git add . && git commit -m 'feat: Add your feature description'`.

### 📤 4. Submit a Pull Request (PR)
- Push your branch: `git push origin feature/your-feature-name`.
- Open a PR on GitHub with a clear title and description (e.g., "Add Discord link to navigation").
- Reference any related issues.

### 🚀 Preview and Review
- Automated preview deployments are available for PRs with collaboration rights – test your changes live via the provided link.
- Address reviewer feedback promptly to expedite merging.

### 📋 Guidelines
- Follow TypeScript and Astro best practices.
- Keep commits descriptive and atomic.
- Update README/docs for new features.
- Ensure accessibility and performance are maintained.
- No heavy frameworks; stick to vanilla CSS/JS where possible.

For questions, join our [Discord](https://discord.gg/QEMQsFect6) or open an issue. Thanks for contributing! 🚀

---

## 🤖 Automation Ideas

Since this is a static site, here are some ways to automate image management if you're self-hosting:

### 📸 GitHub Actions Workflow
- Upload images via GitHub web interface or git push
- Automatically generate thumbnails on push
- Auto-commit generated files and metadata
- Trigger rebuild and deployment

**Example workflow:**
```yaml
name: Process New Images
on:
  push:
    paths:
      - 'public/images/original/**'
jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate thumbnails
        run: pnpm run gen:thumbs
      - name: Commit generated files
        run: |
          git config user.name github-actions
          git add public/images/thumbs
          git commit -m "chore: generate thumbnails"
          git push
```

### 🔧 Custom Upload Script
- Build a simple Node.js/Python script
- Extract metadata from EXIF data automatically
- Create markdown files with proper frontmatter
- Commit and push changes programmatically

**Example concept:**
```javascript
// upload.js - Run locally to add images
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processImage(imagePath) {
  const metadata = await sharp(imagePath).metadata();
  const id = path.basename(imagePath, path.extname(imagePath));
  
  // Generate thumbnails
  await generateThumbnails(imagePath, id);
  
  // Create markdown file
  const mdContent = `---
id: "${id}"
title: "${id}"
slug: "${id}"
date: "${new Date().toISOString()}"
fullsizePath: "/images/original/${path.basename(imagePath)}"
thumbPath: "/images/thumbs/${id}-400.webp"
width: ${metadata.width}
height: ${metadata.height}
---`;
  
  fs.writeFileSync(`src/content/photos/${id}.md`, mdContent);
}
```

### 🌐 External CMS Integration
- Use a headless CMS (Strapi, Directus, Sanity)
- Fetch images and metadata during Astro build process
- Keep the static site benefits with dynamic content source
- Use the existing external download feature as a starting point

### 🐳 Docker + Watchtower Setup
- Mount a volume for images
- Add images via SFTP/FTP
- Use inotify to watch for new files
- Automatically trigger rebuild

**This gallery does NOT provide these features out of the box.** You need to implement them yourself based on your infrastructure and requirements.

---

## 📝 Notes

- **Sorting**: Photos are automatically sorted by `date` (newest first, precise to milliseconds), name, or random.
- **Hero Section**: Customizable intro area in `index.astro`.
- **Lightbox**: Uses GLightbox for accessibility and performance.
- **Thumbnails**: Generated via Sharp in WebP format.
- **Dark Mode**: Flicker-free, stored in localStorage, uses CSS variables.
- **Performance**: Images lazy-load; CSS is optimized.
- **Header**: Transparent, sticky, with blur and mobile menu.
- **Background Effects**: Blurred images with overlay for Light/Dark Mode to create an elegant look.
- **Minimal Frameworks**: Pure Astro + TypeScript + CSS/JS, Preact only for lightweight client interactions.
- **Build**: Includes thumbnail generation in `build` script for production.
- **External Downloads**: Optional feature for fetching content from internal/external servers. Configure via environment variables and `src/config/externaldownload.cjs`. If disabled or no URLs set, the build runs normally without downloads.

---

## 📜 License

MIT License

Copyright (c) 2025 inventory69 & Hyphonical

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.