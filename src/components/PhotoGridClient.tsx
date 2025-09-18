import { useEffect, useState, useRef } from "preact/hooks";
import GLightbox from "glightbox";
import "glightbox/dist/css/glightbox.css";
// @ts-ignore
import { siteConfig } from "../config/site.js"; // Font importieren

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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

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
    const handleSort = (e: CustomEvent) => setSortOption(e.detail.sortOption);
    window.addEventListener('sortGallery', handleSort as EventListener);
    return () => window.removeEventListener('sortGallery', handleSort as EventListener);
  }, []);

  useEffect(() => {
    if (originalPhotos.length === 0) return;
    // @ts-ignore
    import("../../src/utils/sortPhotos.js").then(({ sortPhotos }) => {
      setLoadedPhotos(sortPhotos(originalPhotos, sortOption));
    });
  }, [originalPhotos, sortOption]);

  useEffect(() => {
    const handleRefresh = () => loadAndSetPhotos();
    window.addEventListener('refreshGallery', handleRefresh);
    return () => window.removeEventListener('refreshGallery', handleRefresh);
  }, []);

  // GLightbox: always use loadedPhotos
  useEffect(() => {
    if (loadedPhotos.length === 0) return;
    if (window._glightboxInstance) window._glightboxInstance.destroy();
    const lightbox = GLightbox({
      selector: ".photo",
      touchNavigation: true,
      zoomable: false,
      openEffect: "fade",
      closeEffect: "fade",
      slideEffect: "slide",
    });
    window._glightboxInstance = lightbox;
  }, [loadedPhotos]);

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
      <div id="photo-grid" class={`grid-container ${flashing ? 'flashing' : ''}`}>
        {loadedPhotos.slice(0, visibleCount).map((photo, i) => {
          // Animation für initiale Bilder und neue Batches
          const isInitial = visibleCount <= BATCH_SIZE || i < BATCH_SIZE;
          const isNew = i >= visibleCount - BATCH_SIZE || isInitial;
          return (
            <a
              class={`photo${isStaffPhoto(photo) ? " staff-photo" : ""}`}
              style={isNew ? { "--photo-delay": `${(i % BATCH_SIZE) * 0.12}s` } : {}}
              href={photo.imageUrl}
              data-gallery="gallery"
              data-id={photo.id}
              data-title={photo.caption?.trim() ? photo.caption : photo.title?.trim()}
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
                  src={photo.thumbPath}
                  srcSet={`${photo.thumbPath} 1x, ${photo.thumbPath?.replace("-400.webp", "-800.webp")} 2x`}
                  alt={photo.title}
                  loading={isNew ? "eager" : "lazy"}
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