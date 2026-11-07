// Enlarged view for award certificates: opens the clicked image in a native <dialog>.
export function initLightbox() {
  const dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', 'Enlarged certificate');
  dlg.innerHTML = '<button class="lb-close" type="button" aria-label="Close">&times;</button><img class="lb-img" alt=""><p class="lb-cap"></p>';
  document.body.append(dlg);
  const img = dlg.querySelector('.lb-img');
  const cap = dlg.querySelector('.lb-cap');

  document.addEventListener('click', e => {
    const zoom = e.target.closest('.aw-zoom');
    if (!zoom) return;
    const src = zoom.querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = src.alt;
    dlg.showModal();
  });

  // close on the X button or a click outside the picture
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('.lb-close')) dlg.close();
  });
}
