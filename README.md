# VoidTales Gallery (vanilla)

Usage:
1. Install dependencies: `pnpm install`
2. Add your original images to `public/images/original/` (e.g. example.jpg).
3. Generate thumbnails (optional): `node scripts/generate-thumbs.js`
4. Dev: `pnpm run dev`

Notes:
- Markdown photo metadata lives in `src/content/photos/*.md`.
- Client-side grid & lightbox script is at `public/scripts/photo-grid-client.js`.
- This setup intentionally avoids Tailwind/Preact and uses the exact package.json you provided.
