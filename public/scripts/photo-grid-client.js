/* photo-grid-client.js - simple justified layout + lightbox (vanilla JS) */

function parsePhotosFromContainer(container){
  const raw = container.dataset.photos || '[]';
  try{ return JSON.parse(raw); } catch(e){ return []; }
}

function computeLayout(ratios, containerWidth, targetRowHeight, spacing){
  const boxes = [];
  let row = [];
  let rowSum = 0;
  let top = 0;
  const space = spacing;
  for (let i=0;i<ratios.length;i++){
    const r = ratios[i];
    row.push({idx:i, r});
    rowSum += r;
    const rowWidthAtTarget = rowSum * targetRowHeight + (row.length - 1)*space;
    if (rowWidthAtTarget >= containerWidth){
      const height = (containerWidth - (row.length - 1)*space) / rowSum;
      let left = 0;
      for (const it of row){
        const w = Math.round(height * it.r);
        boxes[it.idx] = { left, top, width: w, height: Math.round(height) };
        left += w + space;
      }
      top += Math.round(height) + space;
      row = [];
      rowSum = 0;
    }
  }
  if (row.length){
    const height = targetRowHeight;
    let left = 0;
    for (const it of row){
      const w = Math.round(height * it.r);
      boxes[it.idx] = { left, top, width: w, height: Math.round(height) };
      left += w + space;
    }
    top += Math.round(height) + space;
  }
  return { boxes, totalHeight: top };
}

function renderGrid(container){
  const photos = parsePhotosFromContainer(container);
  if (!photos.length) return;
  const ratios = photos.map(p => (p.width && p.height) ? p.width / p.height : 1.5);
  const spacing = 6;
  const targetRowHeight = 220;

  function layout(){
    const w = container.clientWidth || 800;
    const { boxes, totalHeight } = computeLayout(ratios, w, targetRowHeight, spacing);
    container.innerHTML = '';
    container.style.height = totalHeight + 'px';
    photos.forEach((p, i) => {
      const b = boxes[i] || { left:0, top:0, width:200, height:150 };
      const el = document.createElement('div');
      el.className = 'photo';
      el.style.left = b.left + 'px';
      el.style.top = b.top + 'px';
      el.style.width = b.width + 'px';
      el.style.height = b.height + 'px';

      const img = document.createElement('img');
      const thumb400 = (p.thumbBase ? `${p.thumbBase}-400.jpg` : null);
      img.src = thumb400 || p.image;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = p.title || '';
      el.appendChild(img);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        openLightbox(photos, i);
      });

      container.appendChild(el);
    });
  }

  const ro = new ResizeObserver(layout);
  ro.observe(container);
  layout();
}

/* Lightbox logic */
let _ltbox = null;
function openLightbox(photos, index){
  closeLightbox();
  const overlay = document.createElement('div');
  overlay.className = 'ltbox-overlay';
  overlay.tabIndex = 0;

  const img = document.createElement('img');
  img.className = 'ltbox-img';
  img.src = photos[index].image;
  img.alt = photos[index].title || '';
  overlay.appendChild(img);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'ltbox-btn';
  closeBtn.innerText = '✕';
  closeBtn.onclick = (e) => { e.stopPropagation(); closeLightbox(); };
  overlay.appendChild(closeBtn);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'ltbox-nav ltbox-prev';
  prevBtn.innerText = '‹';
  prevBtn.onclick = (e) => { e.stopPropagation(); showIndex(-1); };
  overlay.appendChild(prevBtn);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'ltbox-nav ltbox-next';
  nextBtn.innerText = '›';
  nextBtn.onclick = (e) => { e.stopPropagation(); showIndex(1); };
  overlay.appendChild(nextBtn);

  document.body.appendChild(overlay);
  _ltbox = { overlay, photos, index, img };

  function showIndex(delta){
    let idx = _ltbox.index + delta;
    if (idx < 0) idx = _ltbox.photos.length - 1;
    if (idx >= _ltbox.photos.length) idx = 0;
    _ltbox.index = idx;
    _ltbox.img.src = _ltbox.photos[idx].image;
    _ltbox.img.alt = _ltbox.photos[idx].title || '';
  }

  function onKey(e){
    if (!_ltbox) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showIndex(-1);
    if (e.key === 'ArrowRight') showIndex(1);
  }

  overlay.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', onKey);
  _ltbox._onKey = onKey;

  function closeLightbox(){
    if (!_ltbox) return;
    window.removeEventListener('keydown', _ltbox._onKey);
    if (_ltbox.overlay && _ltbox.overlay.parentNode) _ltbox.overlay.parentNode.removeChild(_ltbox.overlay);
    _ltbox = null;
  }

  // expose helpers inside closure
  _ltbox.showIndex = showIndex;
  _ltbox.close = closeLightbox;
}

function closeLightbox(){
  if (!_ltbox) return;
  window.removeEventListener('keydown', _ltbox._onKey);
  if (_ltbox.overlay && _ltbox.overlay.parentNode) _ltbox.overlay.parentNode.removeChild(_ltbox.overlay);
  _ltbox = null;
}

/* Initialize for all matching containers */
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('#photo-grid.grid-container');
  containers.forEach(c => renderGrid(c));
});
