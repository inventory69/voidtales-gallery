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
    images.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
    console.debug('[LoadImages] Anzahl Bilder:', images.length);

    const grid = document.getElementById('photo-grid');
    if (!grid) {
      console.error('[LoadImages] Kein Grid gefunden!');
      return;
    }
    grid.innerHTML = ''; // Grid leeren

    images.forEach(img => {
      // Thumb-Dateiname: Für Default-Bilder mit Suffix, sonst ohne
      const thumbFile = img.isDefault
        ? `${img.id}-default-800.webp`
        : `${img.id}-800.webp`;
      const thumbUrl = `/images/thumbs/${thumbFile}`;

      const photoElement = document.createElement('a');
      photoElement.className = 'photo';
      photoElement.href = img.imageUrl;
      photoElement.setAttribute('data-gallery', 'gallery');
      photoElement.setAttribute('data-id', img.id);
      photoElement.setAttribute('data-title', img.id + (img.isDefault ? ' (default)' : ''));
      photoElement.setAttribute('aria-label', `Open fullscreen of ${img.id}`);

      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.srcset = thumbUrl + ' 2x';
      source.type = 'image/webp';

      const image = document.createElement('img');
      image.src = thumbUrl;
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