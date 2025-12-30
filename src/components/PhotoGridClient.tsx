import { useEffect, useState, useRef } from "preact/hooks";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";
import { siteConfig } from "../config/site.js";
import { sortPhotos } from "../utils/sortPhotos.js";

declare global {
  interface Window {
    _glightboxInstance?: ReturnType<typeof GLightbox>;
  }
}

type Photo = {
  id: string;
  imageUrl: string;
  thumbPath?: string;
  title?: string;
  caption?: string;
  author?: string;
  body?: string;
};

const BATCH_SIZE = 10;

export default function PhotoGridClient({
  photos,
  staffAuthors,
  ariaLabelPrefix,
}: {
  photos?: Photo[];
  staffAuthors?: string[];
  ariaLabelPrefix?: string;
}) {
  const [originalPhotos, setOriginalPhotos] = useState<Photo[]>([]);
  const [loadedPhotos, setLoadedPhotos] = useState<Photo[]>([]);
  const [sortOption, setSortOption] = useState(getInitialSort());
  const [loading, setLoading] = useState(true);
  const [flashing, setFlashing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pendingBatch, setPendingBatch] = useState(false);
  const [pendingHashId, setPendingHashId] = useState<string | null>(null);
  const [lightboxReady, setLightboxReady] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Image load handlers
  const handleImageLoad = (photoId: string) => {
    setImageLoadStates(prev => ({ ...prev, [photoId]: 'loaded' }));
    // Add loaded class to parent .photo container
    const img = document.querySelector(`img[data-photo-id="${photoId}"]`);
    if (img) {
      const photoContainer = img.closest('.photo');
      if (photoContainer) {
        photoContainer.classList.add('loaded');
      }
      img.classList.add('loaded');
    }
  };

  const handleImageError = (photoId: string) => {
    setImageLoadStates(prev => ({ ...prev, [photoId]: 'error' }));
    // Retry loading after delay
    setTimeout(() => retryImageLoad(photoId), 2000);
  };

  const retryImageLoad = (photoId: string) => {
    const img = document.querySelector(`img[data-photo-id="${photoId}"]`);
    if (img instanceof HTMLImageElement) {
      setImageLoadStates(prev => ({ ...prev, [photoId]: 'loading' }));
      // Force reload by adding timestamp
      const src = img.src.split('?')[0];
      img.src = `${src}?retry=${Date.now()}`;
    }
  };

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

        let slideIndex = typeof lightbox.currentIndex === "number" ? lightbox.currentIndex : -1;
        if (slideIndex < 0) {
          const activeSlide = document.querySelector(".gslide.current");
          const allSlides = Array.from(document.querySelectorAll(".gslide"));
          slideIndex = activeSlide ? allSlides.indexOf(activeSlide) : -1;
        }

        const photoObj = slideIndex >= 0 ? loadedPhotos[slideIndex] : undefined;
        const photoId = photoObj?.id || "";

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

      requestAnimationFrame(() => {
        btnContainer.style.opacity = "1";
      });
    }
  }

  // Load images on mount & refresh
  async function loadAndSetPhotos() {
    setLoading(true);
    setFlashing(true);
    setLoadedPhotos([]);
    setTimeout(() => setFlashing(false), 200);
    try {
      // @ts-ignore
      const { default: loadImages } = await import("../../scripts/load-images.js");
      const loaded = await loadImages();
      const mapped = loaded.map((img: any) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        thumbPath: `/images/thumbs/${img.id}${img.isDefault ? '-default' : ''}-400.webp`,
        title: img.title || img.id,
        caption: img.caption || '',
        author: img.author || '',
        body: img.body || '',
        date: img.date,
      }));
      setOriginalPhotos(mapped);
      setVisibleCount(20);
    } catch (err) {
      console.error('[PhotoGridClient] Error loading photos:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAndSetPhotos();
  }, []);

  useEffect(() => {
    const handleSort = (e: CustomEvent) => {
      setSortOption(e.detail.sortOption);
      setVisibleCount(20);
      setPendingBatch(false);
      setIsLoadingMore(false);
      setGridKey(prev => prev + 1);

      // Wenn random gewählt wurde, originalPhotos neu mischen!
      if (e.detail.sortOption === "random") {
        setLoadedPhotos(sortPhotos([...originalPhotos], "random"));
      }
    };
    window.addEventListener('sortGallery', handleSort as EventListener);
    return () => window.removeEventListener('sortGallery', handleSort as EventListener);
  }, [originalPhotos]);

  useEffect(() => {
    if (originalPhotos.length === 0) return;
      setLoadedPhotos(sortPhotos(originalPhotos, sortOption));
  }, [originalPhotos, sortOption]);

  useEffect(() => {
    const handleRefresh = () => loadAndSetPhotos();
    window.addEventListener('refreshGallery', handleRefresh);
    return () => window.removeEventListener('refreshGallery', handleRefresh);
  }, []);

  // Hash: Check on mount if we need to open a specific image
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#img-")) {
      setPendingHashId(hash.replace("#img-", ""));
    }
  }, []);

  // Infinite Scroll: robust Observer, feuert nur einmal pro Batch
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMore &&
          !pendingBatch &&
          visibleCount < loadedPhotos.length
        ) {
          setIsLoadingMore(true);
          setPendingBatch(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, loadedPhotos.length));
            setIsLoadingMore(false);
            setPendingBatch(false);
          }, 900); // Loader für 900ms sichtbar
        }
      },
      { rootMargin: "200px" }
    );
    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoadingMore, pendingBatch, visibleCount, loadedPhotos.length]);

  // GLightbox: always use loadedPhotos
  useEffect(() => {
    if (loadedPhotos.length === 0) return;
    setLightboxReady(false);
    if (window._glightboxInstance) window._glightboxInstance.destroy();
    const lightbox = GLightbox({
      selector: ".photo",
      touchNavigation: true,
      zoomable: false,
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "slide",
    });

    lightbox.on("open", () => {
      addCustomButtonsToContainer(lightbox);
    });
    lightbox.on("slide_changed", () => {
      addCustomButtonsToContainer(lightbox);
    });
    lightbox.on("close", () => {
      document.querySelectorAll(".custom-glightbox-btns").forEach((el) => el.remove());
    });

    window._glightboxInstance = lightbox;
    setTimeout(() => setLightboxReady(true), 100); // Mark GLightbox as ready after init
  }, [loadedPhotos, visibleCount]);

  // Hash-Open: Open only once and only if GLightbox is ready and not already open
  useEffect(() => {
    if (!pendingHashId || !lightboxReady) return;
    const index = loadedPhotos.findIndex(photo => photo.id === pendingHashId);
    if (
      index >= 0 &&
      index < visibleCount &&
      window._glightboxInstance &&
      typeof window._glightboxInstance.openAt === "function"
    ) {
      // Öffne das Bild nur, wenn die Lightbox nicht bereits offen ist
      if (!document.querySelector(".glightbox-open")) {
        setTimeout(() => {
          if (window._glightboxInstance) {
            window._glightboxInstance.openAt(index);
            setPendingHashId(null);
          }
        }, 200);
      }
    } else if (index >= visibleCount && index >= 0) {
      setVisibleCount(index + 1);
    }
  }, [pendingHashId, loadedPhotos, visibleCount, lightboxReady]);

  function isStaffPhoto(photo: Photo) {
    return staffAuthors?.some(
      staff => staff.trim().toLowerCase() === (photo.author?.trim().toLowerCase() || "")
    ) ?? false;
  }

  const loaderStyle = {
    fontFamily: siteConfig.fontFamily,
    gridColumn: "1 / -1",
  };

  return (
    <div>
      {loading && (
        <div class="photo-grid-loader" style={loaderStyle}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" stroke="#888" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="60">
              <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite"/>
            </circle>
          </svg>
          <span>Loading Gallery ...</span>
        </div>
      )}
      <div
        key={gridKey}
        id="photo-grid"
        class={`grid-container ${flashing ? 'flashing' : ''}`}
      >
        {loadedPhotos.slice(0, visibleCount).map((photo, i) => {
          // Animation für alle sichtbaren Bilder nach Sortierung/Initial-Load
          const animate = flashing || visibleCount <= BATCH_SIZE || i < visibleCount;
          return (
            <a
              class={`photo${isStaffPhoto(photo) ? " staff-photo" : ""}`}
              style={animate ? { "--photo-delay": `${(i % BATCH_SIZE) * 0.12}s` } : {}}
              href={photo.imageUrl}
              data-gallery="gallery"
              data-id={photo.id}
              data-title={
                photo.caption?.trim()
                  ? photo.caption
                  : photo.body?.trim()
                  ? photo.body
                  : photo.title?.trim()
              }
              data-description={`Author: ${photo.author}`}
              aria-label={`${ariaLabelPrefix} ${photo.title}`}
              key={photo.id}
            >
              <span class="photo-overlay">{photo.author}</span>
              <picture>
                <source
                  srcSet={`${photo.thumbPath?.replace("-400.webp", "-800.webp")} 2x`}
                  type="image/webp"
                />
                <img
                  data-photo-id={photo.id}
                  src={photo.thumbPath}
                  srcSet={`${photo.thumbPath} 1x, ${photo.thumbPath?.replace("-400.webp", "-800.webp")} 2x`}
                  alt={photo.title}
                  loading={animate ? "eager" : "lazy"}
                  onLoad={() => handleImageLoad(photo.id)}
                  onError={() => handleImageError(photo.id)}
                  className={imageLoadStates[photo.id] === 'loaded' ? 'loaded' : ''}
                />
              </picture>
              {isStaffPhoto(photo) && (
                <span class="staff-badge" title="Staff member">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="12,3 15,10 22,10 17,14 19,21 12,17 5,21 7,14 2,10 9,10" />
                  </svg>
                </span>
              )}
            </a>
          );
        })}
        {isLoadingMore && (
          <div class="photo-grid-loader" style={loaderStyle}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="#888" strokeWidth="4" fill="none" strokeDasharray="100" strokeDashoffset="60">
                <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <span>Loading more images...</span>
          </div>
        )}
        <div ref={sentinelRef}></div>
      </div>
    </div>
  );
}

function getInitialSort(defaultSort: string = "date-desc") {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem("gallerySortOption");
    if (stored) return stored;
    if (window.__gallerySortOption) return window.__gallerySortOption;
  }
  return defaultSort;
}
