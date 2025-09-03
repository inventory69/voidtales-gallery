import { useEffect } from "preact/hooks";
import * as FancyboxUI from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

type Photo = {
  fullsizePath: string;
  thumbPath: string;
  title: string;
};

export default function PhotoGridClient({ photos }: { photos: Photo[] }) {
  useEffect(() => {
    FancyboxUI.Fancybox.bind("[data-fancybox='gallery']", {});
    return () => {
        FancyboxUI.Fancybox.destroy();
    };
  }, []);

  return (
    <div id="photo-grid" class="grid-container">
      {photos.map((photo) => (
        <a
          class="photo"
          href={photo.fullsizePath}
          data-fancybox="gallery"
          data-caption={photo.title}
          aria-label={`Öffne Vollbild von ${photo.title}`}
        >
        <picture>
            <source 
              srcSet={`${photo.thumbPath.replace('-400.webp', '-800.webp')} 2x`} 
              type="image/webp" 
            />
            <img 
              src={photo.thumbPath}
              srcSet={`${photo.thumbPath} 1x, ${photo.thumbPath.replace('-400.webp', '-800.webp')} 2x`}
              alt={photo.title}
              loading="lazy"
            />
        </picture>
        </a>
      ))}
    </div>
  );
}