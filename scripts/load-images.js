/**
 * Lädt die aktuelle images.json und rendert die Bilder dynamisch ins Grid.
 */

async function loadImages() {
  console.debug('[LoadImages] Lade images.json...');
  try {
    const response = await fetch('/images.json?t=' + Date.now(), { cache: 'no-store' });
    if (!response.ok) {
      console.error('[LoadImages] Fehler beim Laden:', response.statusText);
      return;
    }
    const images = await response.json();
    console.debug('[LoadImages] Anzahl Bilder:', images.length);

    const grid = document.getElementById('photo-grid');
    if (!grid) {
      console.error('[LoadImages] Kein Grid gefunden!');
      return;
    }
    grid.innerHTML = ''; // Grid leeren

    images.forEach(img => {
      const photoElement = document.createElement('a');
      photoElement.className = 'photo';
      photoElement.href = img.imageUrl;
      photoElement.setAttribute('data-gallery', 'gallery');
      photoElement.setAttribute('data-id', img.id);
      photoElement.setAttribute('data-title', img.id + (img.isDefault ? ' (default)' : ''));
      photoElement.setAttribute('aria-label', `Open fullscreen of ${img.id}`);

      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = img.imageUrl.replace('.webp', '-800.webp') + ' 2x';
      source.type = 'image/webp';

      const image = document.createElement('img');
      image.src = img.imageUrl;
      image.alt = img.id;
      image.loading = 'lazy';

      picture.appendChild(source);
      picture.appendChild(image);
      photoElement.appendChild(picture);
      grid.appendChild(photoElement);
    });

    // GLightbox re-initialisieren (optional)
    if (window.GLightbox) {
      window.GLightbox.destroy();
      window.GLightbox = GLightbox({
        selector: ".photo",
        touchNavigation: true,
        zoomable: false,
        openEffect: "fade",
        closeEffect: "fade",
        slideEffect: "fade",
      });
      console.debug('[LoadImages] GLightbox re-initialisiert.');
    }
  } catch (err) {
    console.error('[LoadImages] Fehler:', err);
  }
}

export default loadImages;