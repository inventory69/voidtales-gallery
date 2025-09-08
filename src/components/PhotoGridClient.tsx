// PhotoGridClient component: Renders a grid of photos with Fancybox lightbox integration.
// Handles photo display, lazy loading, and fullscreen viewing with captions.

import { useEffect } from "preact/hooks";
import * as FancyboxUI from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

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
  // useEffect: Initialize Fancybox on component mount and clean up on unmount
  useEffect(() => {
    // Bind Fancybox to gallery links for lightbox functionality
    FancyboxUI.Fancybox.bind("[data-fancybox='gallery']", {});
    // Cleanup: Destroy Fancybox instance on component unmount
    return () => {
      FancyboxUI.Fancybox.destroy();
    };
  }, []);

  return (
    // Main grid container for photos
    <div id="photo-grid" class="grid-container">
      {photos.map((photo, i) => (
        // Link to open photo in Fancybox lightbox
        <a
          class="photo"
          href={photo.fullsizePath}
          data-fancybox="gallery"
          // Dynamic caption: Use body, caption, or title as fallback
          data-caption={`<span class='photo-text'>${
            photo.body?.trim()
              ? photo.body
              : photo.caption?.trim()
                ? photo.caption
                : photo.title
          }</span><br><span class='photo-author'>Author: ${photo.author}</span>`}
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