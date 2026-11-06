// src/main.js
import './css/style.css';
import './css/products.css';
import './css/listing.css';
import './css/detail.css';
import './css/skillmap.css';
import './css/recommendations.css';
import './css/journey.css';
import './css/ads.css';
import './css/awards.css';
import './css/responsive.css';
import { getAppRoot } from './js/script.js';
import { caseStudies } from './js/case-studies-data.js';

const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const imageUrl = (src) => (/^https?:/.test(src) ? src : getAppRoot() + String(src).replace(/^\/+/, ''));

function cardHTML(cs, i) {
  const stats = Object.entries(cs.stats || {})
    .map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`)
    .join('');

  return `
    <article class="ls-card" data-group="${esc(cs.group || '')}">
      <div class="ls-media">
        <img src="${esc(imageUrl(cs.image))}" width="640" height="400" alt="${esc(cs.title)} preview" loading="${i < 3 ? 'eager' : 'lazy'}"${i === 0 ? ' fetchpriority="high"' : ''} decoding="async">
        <span class="ls-cat">${esc(cs.category)}</span>
      </div>
      <div class="ls-main-col">
        <h2 class="ls-title"><a href="${esc(cs.link)}">${esc(cs.title)}</a></h2>
        <p class="ls-excerpt">${esc(cs.excerpt)}</p>
      </div>
      <div class="ls-side">
        <dl class="ls-stats">${stats}</dl>
        <a class="ls-btn" href="${esc(cs.link)}">Read case study <i aria-hidden="true">&rarr;</i></a>
      </div>
    </article>`;
}

function initCaseStudies(caseStudies) {
  const container = document.getElementById('case-studies-grid');
  if (!container || !caseStudies.length) return;

  const filterWrap = document.getElementById('ls-filters');
  const search = document.getElementById('ls-search');
  const status = document.getElementById('ls-status');
  const viewBtns = document.querySelectorAll('#ls-view button');

  const state = { filter: 'all', query: '' };

  const matches = (cs) => {
    if (state.filter !== 'all' && cs.group !== state.filter) return false;
    if (!state.query) return true;
    const hay = [cs.title, cs.category, cs.client, cs.excerpt, ...(cs.tags || [])].join(' ').toLowerCase();
    return state.query.split(/\s+/).every((word) => hay.includes(word));
  };

  function render() {
    const list = caseStudies.filter(matches);

    container.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="ls-empty"><p>No case studies match your filters.</p><button type="button" id="ls-reset">Reset filters</button></div>`;

    if (status) {
      status.textContent = `Showing ${list.length} of ${caseStudies.length} case ${caseStudies.length === 1 ? 'study' : 'studies'}`;
    }

    const reset = document.getElementById('ls-reset');
    if (reset) {
      reset.addEventListener('click', () => {
        state.filter = 'all';
        state.query = '';
        if (search) search.value = '';
        syncFilters();
        render();
      });
    }
  }

  function syncFilters() {
    if (!filterWrap) return;
    filterWrap.querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.filter === state.filter))
    );
  }

  // Filter pills with live counts
  if (filterWrap) {
    filterWrap.querySelectorAll('button').forEach((btn) => {
      const f = btn.dataset.filter;
      const n = f === 'all' ? caseStudies.length : caseStudies.filter((c) => c.group === f).length;
      btn.insertAdjacentHTML('beforeend', `<span class="ls-count">${n}</span>`);
      btn.addEventListener('click', () => {
        state.filter = f;
        syncFilters();
        render();
      });
    });
  }

  // Search
  if (search) {
    search.addEventListener('input', () => {
      state.query = search.value.trim().toLowerCase();
      render();
    });
  }

  // Grid / list toggle (remembered per browser)
  const setView = (view) => {
    container.classList.toggle('is-list', view === 'list');
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

  render();
}

if (document.getElementById('case-studies-grid')) {
  import('./js/case-studies-data.js').then((m) => initCaseStudies(m.caseStudies));
}

// Interactive skill map (homepage): loaded only when the section is about to be seen
const skillMapRoot = document.getElementById('skill-map');
if (skillMapRoot) {
  const loadSkillMap = () => import('./js/skill-map.js').then((m) => m.initSkillMap(skillMapRoot, getAppRoot()));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          loadSkillMap();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(skillMapRoot);
  } else {
    loadSkillMap();
  }
}

// Career journey page: filters and progress line
if (document.getElementById('jt')) {
  import('./js/journey.js').then((m) => m.initJourney());
}

// Ad and affiliate slots on detail pages
if (document.querySelector('.ad-slot')) {
  import('./js/ads.js').then((m) => m.initAds(getAppRoot()));
}

// "What people say": drawn only when the section is about to be seen
const recRoot = document.getElementById('recommendations');
if (recRoot) {
  const loadRecs = () => import('./js/recommendations.js').then((m) => m.initRecommendations(recRoot, getAppRoot()));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          loadRecs();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(recRoot);
  } else {
    loadRecs();
  }
}

// Award certificates: click to enlarge (About page)
if (document.querySelector('.aw-zoom')) {
  import('./js/lightbox.js').then((m) => m.initLightbox());
}
