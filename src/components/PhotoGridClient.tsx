// PhotoGridClient component: Renders a grid of photos with GLightbox integration.
// Handles photo display, lazy loading, and fullscreen viewing with captions and custom buttons.
// Expects image metadata with unique IDs, which the voidtales workflow already provides!

import { useEffect } from "preact/hooks";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";

// Photo type definition
type Photo = {
  id: string;
  fullsizePath: string;
  thumbPath: string;
  title: string;
  caption: string;
  author: string;
  body: string;
};

export default function PhotoGridClient({
  photos,
  ariaLabelPrefix = "Open fullscreen of",
}: {
  photos: Photo[];
  ariaLabelPrefix?: string;
}) {
  // Show notification overlay inside GLightbox
  function showNotification(message: string, type: "success" | "error") {
    const container = document.querySelector(".glightbox-container");
    if (!container) return;

    const notification = document.createElement("div");
    notification.className = `glightbox-notification glightbox-notification-${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add custom share and view buttons to GLightbox
  function addCustomButtonsToContainer(lightbox: any) {
    // Remove existing custom button containers
    document.querySelectorAll(".custom-glightbox-btns").forEach((el) => el.remove());

    const container = document.querySelector(".gcontainer");
    if (container && !container.querySelector(".custom-glightbox-btns")) {
      const btnContainer = document.createElement("div");
      btnContainer.className = "custom-glightbox-btns";
      btnContainer.style.opacity = "0";

      // Share button: copies direct link to current image with its unique ID
      const shareBtn = document.createElement("button");
      shareBtn.className = "glightbox-share-btn";
      shareBtn.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
      shareBtn.title = "Share";
      shareBtn.onclick = (event) => {
        event.stopPropagation();
        event.preventDefault();

        // Get current slide index from GLightbox or fallback to DOM
        let slideIndex = typeof lightbox.currentIndex === "number" ? lightbox.currentIndex : -1;
        if (slideIndex < 0) {
          const activeSlide = document.querySelector(".gslide.current");
          const allSlides = Array.from(document.querySelectorAll(".gslide"));
          slideIndex = activeSlide ? allSlides.indexOf(activeSlide) : -1;
        }

        // Get photo ID for the current slide
        const photoObj = slideIndex >= 0 ? photos[slideIndex] : undefined;
        const photoId = photoObj?.id || "";

        // Build shareable URL with #img-<id>
        const pageUrl = window.location.origin + window.location.pathname +
          (photoId ? `#img-${photoId}` : "");

        try {
          navigator.clipboard.writeText(pageUrl);
          showNotification("Link copied! Share this to open the image in lightbox.", "success");
        } catch {
          showNotification("Failed to copy link. Please copy manually: " + pageUrl, "error");
        }
      };

      // View original button: opens the original image in a new tab
      const viewBtn = document.createElement("button");
      viewBtn.className = "glightbox-view-btn";
      viewBtn.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      viewBtn.title = "View original";
      viewBtn.onclick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        const activeSlide = document.querySelector(".gslide.current");
        const img = activeSlide?.querySelector(".gslide-image img");
        if (img instanceof HTMLImageElement) {
          window.open(img.src, "_blank");
        } else {
          showNotification("Unable to open original image.", "error");
        }
      };

      btnContainer.appendChild(shareBtn);
      btnContainer.appendChild(viewBtn);
      container.appendChild(btnContainer);

      // Fade in buttons after insertion
      requestAnimationFrame(() => {
        btnContainer.style.opacity = "1";
      });
    }
  }

  // Initialize GLightbox and handle custom buttons and hash navigation
  useEffect(() => {
    const lightbox = GLightbox({
      selector: ".photo",
      touchNavigation: true,
      zoomable: false,
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "fade",
    });

    // Open lightbox at specific image if hash is present
    const hash = window.location.hash;
    if (hash.startsWith("#img-")) {
      const id = hash.replace("#img-", "");
      const index = photos.findIndex(photo => photo.id === id);
      if (index >= 0) {
        setTimeout(() => {
          lightbox.openAt(index);
        }, 500);
      }
    }

    // Add custom buttons on open and slide change
    lightbox.on("open", () => {
      addCustomButtonsToContainer(lightbox);
    });
    lightbox.on("slide_changed", () => {
      addCustomButtonsToContainer(lightbox);
    });

    // Remove custom buttons immediately on close
    lightbox.on("close", () => {
      document.querySelectorAll(".custom-glightbox-btns").forEach((el) => el.remove());
    });

    // Cleanup GLightbox instance on unmount
    return () => lightbox.destroy();
  }, []);

  return (
    <div id="photo-grid" class="grid-container">
      {photos.map((photo, i) => (
        <a
          class="photo"
          href={photo.fullsizePath}
          data-gallery="gallery"
          data-id={photo.id}
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
          <picture>
            <source
              srcSet={`${photo.thumbPath.replace("-400.webp", "-800.webp")} 2x`}
              type="image/webp"
            />
            <img
              src={photo.thumbPath}
              srcSet={`${photo.thumbPath} 1x, ${photo.thumbPath.replace("-400.webp", "-800.webp")} 2x`}
              alt={photo.title}
              loading={i < 3 ? "eager" : "lazy"}
            />
          </picture>
        </a>
      ))}
    </div>
  );
}