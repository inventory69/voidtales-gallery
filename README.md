# 🎨 VoidTales Gallery
A fast, modern, and minimal photo gallery built with [Astro](https://astro.build/), TypeScript, and vanilla CSS/JS.  
No frameworks, no client-side bloat—just your photos, beautifully presented.

---

## ✨ Features
- 🚀 **Lightning-fast** static site generation with Astro  
- 🖼️ **Markdown-based photo metadata** (`src/content/photos/*.md`)  
- 🗂️ **Automatic thumbnail generation** (optional, via Node script)  
- ♿ **Accessible lightbox** and responsive grid layout  
- 🌗 **Dark mode** with instant, flicker-free theme switching  
- 🛠️ **No frameworks**: No React, Preact, or Tailwind required

---

## 🚀 Getting Started

### 📦 1. Install dependencies
```bash
pnpm install
```

### 🖼️ 2. Add your images
Place your original images in:
```
public/images/original/
```
Example: `public/images/original/example.jpg`

### 🛠️ 3. Generate thumbnails (optional, recommended)
Run the thumbnail generator script:
```bash
node scripts/generate-thumbs.js
```
This will create optimized thumbnails in `public/images/thumbs/`.

### 🗂️ 4. Add photo metadata
Create a Markdown file for each photo in:
```
src/content/photos/
```
Example: `src/content/photos/example.md`  
Each file should contain frontmatter with metadata (title, date, etc.).

### ▶️ 5. Start the development server
```bash
pnpm run dev
```
Visit [http://localhost:4321](http://localhost:4321) to view your gallery.

---

## 📁 Project Structure
```
├── public/
│   ├── images/
│   │   ├── original/   # Your original images
│   │   └── thumbs/     # Thumbnails (generated)
│   └── scripts/
│       └── photo-grid-client.js  # Client-side grid & lightbox logic
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └── PhotoGrid.astro
│   ├── content/
│   │   └── photos/     # Markdown files for photo metadata
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── scripts/
│   └── generate-thumbs.js  # Thumbnail generator script
├── package.json
└── README.md
```

---

## 📝 Notes
- The grid and lightbox are handled by `public/scripts/photo-grid-client.js`.  
- Dark mode is applied instantly on page load to prevent flashes.  
- No Tailwind, React, or Preact—just Astro, TypeScript, and vanilla CSS/JS.

---

## 📜 License
MIT

--- 
