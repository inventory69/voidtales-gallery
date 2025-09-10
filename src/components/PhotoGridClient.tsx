// PhotoGridClient component: Renders a grid of photos with GLightbox integration.
// Handles photo display, lazy loading, and fullscreen viewing with captions.

import { useEffect } from "preact/hooks";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

// Type definition for a Photo object
type Photo = {
  fullsizePath: string; // Path to the full-size image
  thumbPath: string;    // Path to the thumbnail image
  title: string;        // Title of the photo
  caption: string;      // Caption text
  author: string;       // Author of the photo
  body: string;         // Additional body text
};

// Main component function
export default function PhotoGridClient({ photos, ariaLabelPrefix = "Open fullscreen of" }: { photos: Photo[], ariaLabelPrefix?: string }) {
  // useEffect: Initialize GLightbox on component mount and clean up on unmount
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".photo",
      touchNavigation: true,
      zoomable: false, // deactivated for now, causes issues
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "fade",
    });

    // Check for hash on page load and open lightbox
    const hash = window.location.hash;
    if (hash.startsWith('#image-')) {
      const index = parseInt(hash.replace('#image-', ''), 10);
      if (!isNaN(index) && index >= 0) {
        setTimeout(() => {
          lightbox.openAt(index); // Open lightbox at specific image
        }, 500); // Delay to ensure images are loaded
      }
    }

    // Add share button after lightbox opens
    lightbox.on('slide_changed', () => {
      setTimeout(() => {
        const container = document.querySelector('.glightbox-container');
        if (container && !container.querySelector('.glightbox-share-btn')) {
          // Share button
          const shareBtn = document.createElement('button');
          shareBtn.className = 'glightbox-share-btn';
          shareBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`; // Chain icon SVG
          shareBtn.title = 'Share'; // Tooltip for accessibility
          shareBtn.onclick = (event) => {
            event.stopPropagation(); // Prevent event bubbling
            event.preventDefault();  // Prevent default behavior
            
            // Try to get index from GLightbox (ignore TypeScript error)
            // @ts-ignore
            if (lightbox && typeof lightbox.currentIndex === 'number') {
              // @ts-ignore
              const slideIndex = lightbox.currentIndex;
              if (slideIndex !== -1) {
                // Create shareable link with hash (e.g., https://your-site.com/#image-1)
                const pageUrl = window.location.origin + window.location.pathname + `#image-${slideIndex}`;
                
                try {
                  navigator.clipboard.writeText(pageUrl);
                  // Show modern overlay instead of alert
                  showNotification('Link copied! Share this to open the image in lightbox.', 'success');
                } catch (error) {
                  console.error('Clipboard error:', error); // Keep error log for debugging
                  // Show modern overlay instead of alert
                  showNotification('Failed to copy link. Please copy manually: ' + pageUrl, 'error');
                }
              } else {
                // Show modern overlay instead of alert
                showNotification('Unable to generate share link.', 'error');
              }
            } else {
              // Fallback to DOM
              const activeSlide = document.querySelector('.gslide.loaded.current');
              const allSlides = document.querySelectorAll('.gslide');
              const slideIndex = activeSlide ? Array.from(allSlides).indexOf(activeSlide) : -1;
              if (slideIndex !== -1) {
                // Create shareable link with hash (e.g., https://your-site.com/#image-1)
                const pageUrl = window.location.origin + window.location.pathname + `#image-${slideIndex}`;
                
                try {
                  navigator.clipboard.writeText(pageUrl);
                  // Show modern overlay instead of alert
                  showNotification('Link copied! Share this to open the image in lightbox.', 'success');
                } catch (error) {
                  console.error('Clipboard error:', error); // Keep error log for debugging
                  // Show modern overlay instead of alert
                  showNotification('Failed to copy link. Please copy manually: ' + pageUrl, 'error');
                }
              } else {
                // Show modern overlay instead of alert
                showNotification('Unable to generate share link.', 'error');
              }
            }
          };
          container.appendChild(shareBtn);

          // View original button
          const viewBtn = document.createElement('button');
          viewBtn.className = 'glightbox-view-btn';
          viewBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`; // Eye icon SVG
          viewBtn.title = 'View original'; // Tooltip for accessibility
          viewBtn.onclick = (event) => {
            event.stopPropagation(); // Prevent event bubbling
            event.preventDefault();  // Prevent default behavior
            
            // Get the current image src
            const img = document.querySelector('.gslide.active .gslide-image img') || document.querySelector('.gslide.loaded.current .gslide-image img');
            if (img && img instanceof HTMLImageElement) {
              window.open(img.src, '_blank'); // Open original image in new tab
            } else {
              showNotification('Unable to open original image.', 'error');
            }
          };
          container.appendChild(viewBtn);
        }
      }, 100);
    });

    // Cleanup: Destroy GLightbox instance on component unmount
    return () => lightbox.destroy();
  }, []);

  // Function to show modern notification overlay
  function showNotification(message: string, type: 'success' | 'error') {
    const container = document.querySelector('.glightbox-container');
    if (!container) return;

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `glightbox-notification glightbox-notification-${type}`;
    notification.textContent = message;

    // Append to container
    container.appendChild(notification);

    // Show and hide after 3 seconds
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300); // Wait for fade out
    }, 3000);
  }

  return (
    // Main grid container for photos
    <div id="photo-grid" class="grid-container">
      {photos.map((photo, i) => (
        // Link to open photo in GLightbox
        <a
          class="photo"
          href={photo.fullsizePath}
          data-gallery="gallery"
          data-title={
            photo.body?.trim()
              ? photo.body
              : photo.caption?.trim()
              ? photo.caption
              : photo.title?.trim()
          }
          data-description={`Author: ${photo.author}`}
          aria-label={`${ariaLabelPrefix} ${photo.title}`}
        >
          {/* // Picture element for responsive images with WebP support */}
          <picture>
            {/* // High-res source for 2x displays */}
            <source 
              srcSet={`${photo.thumbPath.replace('-400.webp', '-800.webp')} 2x`} 
              type="image/webp" 
            />
            {/* // Main image with srcset for different resolutions */}
            <img 
              src={photo.thumbPath}
              srcSet={`${photo.thumbPath} 1x, ${photo.thumbPath.replace('-400.webp', '-800.webp')} 2x`}
              alt={photo.title}
              // Eager loading for first 3 images, lazy for others
              loading={i < 3 ? "eager" : "lazy"}
            />
          </picture>
        </a>
      ))}
    </div>
  );
}