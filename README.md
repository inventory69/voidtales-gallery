# 🎨 VoidTales Gallery
A fast, modern, and minimal photo gallery built with [Astro](https://astro.build/), TypeScript, and vanilla CSS/JS.  
No frameworks, no client-side bloat—just your photos, beautifully presented.

---

## ✨ Features
- 🚀 **Lightning-fast** static site generation with Astro  
- 🖼️ **Markdown-based photo metadata** (`src/content/photos/*.md`)  
- 🗂️ **Automatic thumbnail generation** (optional, via Node script)  
- ♿ **Accessible lightbox** and responsive CSS Grid layout with subtle hover effects  
- 🌗 **Dark mode** with instant, flicker-free theme switching  
- 🛠️ **No frameworks**: No React, Preact, or Tailwind required  
- 📱 **Responsive design**: Optimized for all devices with modern CSS Grid  
- ⚡ **Performance optimized**: Lazy loading for images and efficient theme toggle  
- 🎨 **Modern UI**: Transparent header, dynamic positioning, and refined interactions  

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
├── src/
│   ├── components/
│   │   ├── Header.astro          # Optimized header component
│   │   ├── PhotoGrid.astro       # Server-side photo grid
│   │   ├── PhotoGridClient.tsx   # Client-side grid with lightbox
│   │   └── ThemeToggle.jsx       # Refined theme toggle button
│   ├── content/
│   │   └── photos/               # Markdown files for photo metadata
│   ├── pages/
│   │   └── index.astro           # Main gallery page
│   └── styles/
│       └── global.css            # Global styles with modern optimizations
├── scripts/
│   └── generate-thumbs.js        # Thumbnail generator script
├── package.json
└── README.md
```

---

## 📝 Notes
- The grid and lightbox are handled by `PhotoGridClient.tsx` with Fancybox for accessibility.  
- Dark mode is applied instantly on page load to prevent flashes.  
- Images use lazy loading for better performance.  
- Header is transparent and dynamically positioned for a modern feel.  
- No Tailwind, React, or Preact—just Astro, TypeScript, and vanilla CSS/JS.

---

## 📜 License
MIT License

Copyright (c) 2025 inventory69

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

---
