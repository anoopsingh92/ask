// src/js/products-data.js: download counters shown on product pages
export async function trackDownload(productKey) {
  const storageKey = `download_count_${productKey}`;
  let count = parseInt(localStorage.getItem(storageKey) || '0', 10) + 1;
  localStorage.setItem(storageKey, count.toString());

  const badge = document.querySelector(`[data-download-count="${productKey}"]`);
  if (badge) badge.textContent = `${count} downloads`;
}

export function loadDownloadCount(productKey) {
  const storageKey = `download_count_${productKey}`;
  const count = parseInt(localStorage.getItem(storageKey) || '128', 10);
  const badge = document.querySelector(`[data-download-count="${productKey}"]`);
  if (badge) badge.textContent = `${count} downloads`;
}