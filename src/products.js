// src/products.js: product listing page logic (filters, search, grid/list view, copy buttons)
import './css/products.css';
import { loadDownloadCount } from './js/products-data.js';

export * from './js/products-data.js';

function initProductListing() {
  const list = document.getElementById('product-list');
  if (!list) return; // not the listing page

  const cards = [...list.querySelectorAll('.ls-card')];
  const filterWrap = document.getElementById('prod-filters');
  const search = document.getElementById('prod-search');
  const status = document.getElementById('prod-status');
  const viewBtns = document.querySelectorAll('#prod-view button');
  const state = { filter: 'all', price: 'all', query: '' };
  const tabWrap = document.getElementById('prod-tabs');

  ['flexi-style', 'flexistyle-bootstrap', 'flexistyle-bootstrap-scss', 'flexistyle-dxp'].forEach(loadDownloadCount);

  // Empty-state message (created once, shown when nothing matches)
  const empty = document.createElement('div');
  empty.className = 'ls-empty';
  empty.hidden = true;
  empty.innerHTML = '<p>No products match your filters yet.</p><button type="button">Reset filters</button>';
  list.appendChild(empty);

  const syncFilters = () =>
    filterWrap?.querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.f === state.filter))
    );

  function apply() {
    let shown = 0;
    cards.forEach((card) => {
      const okFilter = state.filter === 'all' || card.dataset.c === state.filter;
      const okPrice = state.price === 'all' || card.dataset.p === state.price;
      const okQuery = !state.query || card.textContent.toLowerCase().includes(state.query);
      const visible = okFilter && okPrice && okQuery;
      card.classList.toggle('is-hidden', !visible);
      if (visible) shown++;
    });
    empty.hidden = shown > 0;
    if (status) status.textContent = `Showing ${shown} of ${cards.length} products`;
  }

  // Filter pills with live counts
  filterWrap?.querySelectorAll('button').forEach((btn) => {
    const f = btn.dataset.f;
    const n = f === 'all' ? cards.length : cards.filter((c) => c.dataset.c === f).length;
    btn.insertAdjacentHTML('beforeend', `<span class="ls-count">${n}</span>`);
    btn.addEventListener('click', () => {
      state.filter = f;
      syncFilters();
      apply();
    });
  });

  // Free / Premium tabs
  const syncTabs = () =>
    tabWrap?.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === state.price)));
  tabWrap?.querySelectorAll('button').forEach((btn) => {
    const p = btn.dataset.p;
    const n = p === 'all' ? cards.length : cards.filter((c) => c.dataset.p === p).length;
    btn.insertAdjacentHTML('beforeend', `<span class="ls-count">${n}</span>`);
    btn.addEventListener('click', () => {
      state.price = p;
      syncTabs();
      apply();
    });
  });

  search?.addEventListener('input', () => {
    state.query = search.value.trim().toLowerCase();
    apply();
  });

  empty.querySelector('button').addEventListener('click', () => {
    state.filter = 'all';
    state.price = 'all';
    state.query = '';
    if (search) search.value = '';
    syncFilters();
    syncTabs();
    apply();
  });

  // Grid / list toggle (remembered per browser)
  const setView = (view) => {
    list.classList.toggle('is-list', view === 'list');
    viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    try {
      localStorage.setItem('ls-view', view);
    } catch (e) {
      /* storage unavailable */
    }
  };
  viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  let saved = 'grid';
  try {
    saved = localStorage.getItem('ls-view') === 'list' ? 'list' : 'grid';
  } catch (e) {
    /* storage unavailable */
  }
  setView(saved);

  // Copy buttons
  document.querySelectorAll('.cmd-chip button').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const orig = btn.textContent;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = 'Copied!';
      } catch (err) {
        btn.textContent = 'Press Ctrl+C';
      }
      setTimeout(() => (btn.textContent = orig), 1600);
    });
  });

  apply();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductListing);
} else {
  initProductListing();
}
