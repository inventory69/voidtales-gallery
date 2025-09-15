/**
 * Sorts an array of photo objects by the given option.
 * @param {Array} photos - Array of photo objects
 * @param {string} option - Sort option (e.g., 'date-desc', 'name-asc')
 * @returns {Array} Sorted array
 */
export function sortPhotos(photos, option) {
  switch (option) {
    case 'date-desc':
      return [...photos].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    case 'date-asc':
      return [...photos].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
    case 'name-asc':
      return [...photos].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    case 'name-desc':
      return [...photos].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    case 'random':
      return [...photos].sort(() => Math.random() - 0.5);
    // Add more sort options here
    default:
      return photos;
  }
}