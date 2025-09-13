/**
 * Refreshes various resources on the page by appending a cache-busting query parameter.
 * This forces the browser and CDN to reload images, stylesheets, scripts, etc.
 * Debug output is provided for each resource type.
 * Filters out internal Astro files and ES modules to avoid syntax errors.
 */

async function loadNewPhotos() {
  console.debug('[RefreshResources] loadNewPhotos() called.');
  try {
    console.debug('[RefreshResources] Fetching /api/photos.json...');
    const response = await fetch('/api/photos.json');
    console.debug('[RefreshResources] Response status:', response.status);
    if (!response.ok) {
      console.error('[RefreshResources] Fetch failed:', response.statusText);
      return;
    }
    const photos = await response.json();
    console.debug('[RefreshResources] Fetched photos:', photos.length);

    // Get existing photo IDs
    const existingIds = new Set();
    document.querySelectorAll('.photo').forEach(photo => {
      const id = photo.getAttribute('data-id');
      if (id) existingIds.add(id);
    });
    console.debug('[RefreshResources] Existing IDs:', [...existingIds]);

    // Filter new photos
    const newPhotos = photos.filter(photo => !existingIds.has(photo.data.id));
    console.debug('[RefreshResources] New photos found:', newPhotos.length);

    if (newPhotos.length === 0) {
      console.debug('[RefreshResources] No new photos to add.');
      return;
    }

    console.debug(`[RefreshResources] Loading ${newPhotos.length} new photos.`);

    // Get the photo grid
    const grid = document.getElementById('photo-grid');
    if (!grid) {
      console.error('[RefreshResources] Photo grid not found.');
      return;
    }

    // Add new photos to the grid
    newPhotos.forEach(photo => {
      const photoElement = document.createElement('a');
      photoElement.className = 'photo';
      photoElement.href = photo.data.fullsizePath;
      photoElement.setAttribute('data-gallery', 'gallery');
      photoElement.setAttribute('data-id', photo.data.id);
      photoElement.setAttribute('data-title', photo.data.title);
      photoElement.setAttribute('data-description', `Author: ${photo.data.author || 'Unknown'}`);
      photoElement.setAttribute('aria-label', `Open fullscreen of ${photo.data.title}`);

      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = `${photo.data.thumbPath.replace('.webp', '-800.webp')} 2x`;
      source.type = 'image/webp';

      const img = document.createElement('img');
      img.src = photo.data.thumbPath;
      img.srcset = `${photo.data.thumbPath} 1x, ${photo.data.thumbPath.replace('.webp', '-800.webp')} 2x`;
      img.alt = photo.data.title;
      img.loading = 'lazy';

      picture.appendChild(source);
      picture.appendChild(img);
      photoElement.appendChild(picture);
      grid.appendChild(photoElement);

      console.debug(`[RefreshResources] Added new photo: ${photo.data.title}`);
    });

    // Re-initialize GLightbox for new photos (using global instance)
    if (window.GLightbox) {
      // Destroy existing instance
      window.GLightbox.destroy();
      // Create new instance with updated selector
      window.GLightbox = GLightbox({
        selector: ".photo",
        touchNavigation: true,
        zoomable: false,
        openEffect: "fade",
        closeEffect: "fade",
        slideEffect: "fade",
      });
      console.debug('[RefreshResources] GLightbox re-initialized for new photos.');
    }

  } catch (error) {
    console.error('[RefreshResources] Error in loadNewPhotos:', error);
  }
}

function refreshResources() {
  console.debug("[RefreshResources] Refresh triggered!");

  // Reload all <img> elements (safe, no import issues)
  document.querySelectorAll('img').forEach(img => {
    const src = img.src.split('?')[0];
    const newSrc = `${src}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading image: ${img.src} -> ${newSrc}`);
    img.src = newSrc;
  });

  // Reload all <source> elements inside <picture> (safe)
  document.querySelectorAll('picture source').forEach(source => {
    const srcset = source.srcset.split('?')[0];
    const newSrcset = `${srcset}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading picture source: ${source.srcset} -> ${newSrcset}`);
    source.srcset = newSrcset;
  });

  // Reload all elements with inline CSS background-image (safe)
  document.querySelectorAll('[style*="background-image"]').forEach(el => {
    const style = el.style.backgroundImage;
    const urlMatch = style.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) {
      const url = urlMatch[1].split('?')[0];
      const newUrl = `${url}?nocache=${Date.now()}`;
      el.style.backgroundImage = `url("${newUrl}")`;
      console.debug(`[RefreshResources] Reloading background-image: ${url} -> ${newUrl}`);
    }
  });

  // Uncomment to reload video posters if needed (safe)
  /*
  document.querySelectorAll('video[poster]').forEach(video => {
    const poster = video.poster.split('?')[0];
    const newPoster = `${poster}?nocache=${Date.now()}`;
    video.poster = newPoster;
    console.debug(`[RefreshResources] Reloading video poster: ${poster} -> ${newPoster}`);
  });
  */

  // Reload only external stylesheets (skip internal Astro/CSS files)
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.href.split('?')[0];
    // Skip internal files (e.g., Astro-generated or local CSS)
    if (!href.includes(window.location.origin) || href.includes('.astro') || href.includes('variables.css') || href.includes('base.css') || href.includes('layout.css') || href.includes('components.css') || href.includes('hero.css') || href.includes('responsive.css') || href.includes('accessibility.css')) {
      console.debug(`[RefreshResources] Skipping internal stylesheet: ${href}`);
      return;
    }
    const newHref = `${href}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading external stylesheet: ${link.href} -> ${newHref}`);
    link.href = newHref;
  });

  // Reload only external scripts (skip internal Astro/JS files)
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.src.split('?')[0];
    // Skip internal files (e.g., Astro-generated or ES modules)
    if (!src.includes(window.location.origin) || src.includes('.astro') || src.includes('client') || src.includes('entrypoint.js') || src.includes('RefreshButton.astro') || src.includes('index.astro')) {
      console.debug(`[RefreshResources] Skipping internal script: ${src}`);
      return;
    }
    const newSrc = `${src}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading external script: ${script.src} -> ${newSrc}`);
    const newScript = document.createElement('script');
    newScript.src = newSrc;
    newScript.async = script.async;
    newScript.defer = script.defer;
    script.parentNode.replaceChild(newScript, script);
  });

  // Load new photos
  loadNewPhotos();
}

// Export as ES module
export default refreshResources;