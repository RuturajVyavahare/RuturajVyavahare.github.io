/* ==========================================================================
   RV / SILICON INTERFACE — LIGHTBOX ZOOM VIEWER
   ========================================================================== */

export function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close-btn');

  if (!modal || !imgEl || !captionEl) return;

  function openLightbox(src, caption) {
    imgEl.src = src;
    captionEl.textContent = caption || '';
    modal.classList.add('open');
  }

  function closeLightbox() {
    modal.classList.remove('open');
    imgEl.src = '';
  }

  document.querySelectorAll('.zoomable-image').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-full') || item.getAttribute('src');
      const caption = item.getAttribute('data-caption') || item.getAttribute('alt');
      openLightbox(src, caption);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeLightbox();
    }
  });
}

