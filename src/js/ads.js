// Fills the ad slots on detail pages from ads-data.js. With no data, the static
// "Advertise here" placeholders in the HTML stay as they are.
import { sponsors, affiliates } from './ads-data.js';

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initAds(siteRoot) {
  const pageId = location.pathname.split('/').filter(Boolean).pop() || '';
  const forPage = item => !item.pages || !item.pages.length || item.pages.includes(pageId);
  const rel = 'sponsored nofollow noopener';

  document.querySelectorAll('.ad-slot[data-slot]').forEach(slot => {
    const s = sponsors.find(x => x.slot === slot.dataset.slot && forPage(x));
    if (!s) return;
    const img = s.image
      ? `<img class="ad-img" src="${esc(/^https?:/.test(s.image) ? s.image : siteRoot + s.image.replace(/^\/+/, ''))}" alt="" width="600" height="200" loading="lazy" decoding="async">`
      : '';
    slot.classList.add('is-filled');
    slot.innerHTML = `
      <a class="ad-card" href="${esc(s.href)}" target="_blank" rel="${rel}">
        <span class="ad-tag">Sponsored</span>
        ${img}
        <strong class="ad-name">${esc(s.name)}</strong>
        <span class="ad-tagline">${esc(s.tagline || '')}</span>
        <span class="ad-go">${esc(s.cta || 'Learn more')} &rarr;</span>
      </a>`;
  });

  const box = document.querySelector('[data-affiliates]');
  const list = affiliates.filter(forPage);
  if (box && list.length) {
    box.hidden = false;
    box.innerHTML = `
      <h3>Recommended tools</h3>
      <ul class="ad-aff-list">
        ${list.map(a => `<li><a href="${esc(a.href)}" target="_blank" rel="${rel}"><b>${esc(a.title)}</b><span>${esc(a.text || '')}</span></a></li>`).join('')}
      </ul>
      <p class="ad-disclosure">Affiliate links: I may earn a commission if you buy through them, at no extra cost to you.</p>`;
  }
}
