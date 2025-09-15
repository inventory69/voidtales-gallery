import { sortPhotos } from '../src/utils/sortPhotos.js';
import { siteConfig } from '../src/config/site.js';

/**
 * Loads the latest images.json and returns sorted images.
 * Does not manipulate the DOM directly.
 */
async function loadImages() {
  console.debug('[LoadImages] Loading images.json...');
  try {
    const response = await fetch('/images.json?t=' + Date.now(), { cache: 'no-store' });
    if (!response.ok) {
      console.error('[LoadImages] Error loading images.json:', response.statusText);
      return [];
    }
    const images = await response.json();
    const sortedImages = sortPhotos(images, siteConfig.defaultSort);
    console.debug('[LoadImages] Number of images:', sortedImages.length);
    return sortedImages;
  } catch (err) {
    console.error('[LoadImages] Error:', err);
    return [];
  }
}

export default loadImages;