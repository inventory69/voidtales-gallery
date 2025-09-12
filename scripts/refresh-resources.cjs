/**
 * Refreshes various resources on the page by appending a cache-busting query parameter.
 * This forces the browser and CDN to reload images, stylesheets, scripts, etc.
 * Debug output is provided for each resource type.
 */

(function refreshResources() {
  console.debug("[RefreshResources] Refresh triggered!");

  // Reload all <img> elements
  document.querySelectorAll('img').forEach(img => {
    const src = img.src.split('?')[0];
    const newSrc = `${src}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading image: ${img.src} -> ${newSrc}`);
    img.src = newSrc;
  });

  // Reload all <source> elements inside <picture>
  document.querySelectorAll('picture source').forEach(source => {
    const srcset = source.srcset.split('?')[0];
    const newSrcset = `${srcset}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading picture source: ${source.srcset} -> ${newSrcset}`);
    source.srcset = newSrcset;
  });

  // Reload all elements with inline CSS background-image
  document.querySelectorAll('[style*="background-image"]').forEach(el => {
    const style = el.style.backgroundImage;
    const urlMatch = style.match(/url\(["']?(.*?)["']?\)/);
    if (urlMatch) {
      const url = urlMatch[1].split('?')[0];
      const newUrl = `${url}?nocache=${Date.now()}`;
      el.style.backgroundImage = `url("${newUrl}")`;
      console.debug(`[RefreshResources] Reloading background-image: ${url} -> ${newUrl}`);
    }
  });

  // Uncomment to reload video posters if needed
  /*
  document.querySelectorAll('video[poster]').forEach(video => {
    const poster = video.poster.split('?')[0];
    const newPoster = `${poster}?nocache=${Date.now()}`;
    video.poster = newPoster;
    console.debug(`[RefreshResources] Reloading video poster: ${poster} -> ${newPoster}`);
  });
  */

  // Reload all external stylesheets
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    if (link.href.startsWith(window.location.origin)) {
      const href = link.href.split('?')[0];
      const newHref = href + '?nocache=' + Date.now();
      console.debug(`[RefreshResources] Reloading stylesheet: ${link.href} -> ${newHref}`);
      link.href = newHref;
    }
  });

  // Reload all external scripts
  document.querySelectorAll('script[src]').forEach(script => {
    const src = script.src.split('?')[0];
    const newSrc = `${src}?nocache=${Date.now()}`;
    console.debug(`[RefreshResources] Reloading script: ${script.src} -> ${newSrc}`);
    const newScript = document.createElement('script');
    newScript.src = newSrc;
    newScript.async = script.async;
    newScript.defer = script.defer;
    script.parentNode.replaceChild(newScript, script);
  });

  // Add more resource types here if needed
})();