// src/main.js
import './css/style.css';
import './css/products.css';
import './js/script.js';
import { caseStudies } from './js/case-studies-data.js';

function initCaseStudies() {
  const container = document.getElementById('case-studies-grid');
  const filterWrap = document.getElementById('cs-filters');
  if (!container || !caseStudies.length) return;

  function render(filter = 'all') {
    const filtered = caseStudies.filter(cs => {
      if (filter === 'all') return true;
      if (filter === 'open-source') return cs.category.toLowerCase().includes('open source') || cs.category.toLowerCase().includes('theme');
      if (filter === 'headless') return cs.category.toLowerCase().includes('headless') || cs.category.toLowerCase().includes('dxp');
      if (filter === 'saas') return cs.category.toLowerCase().includes('saas');
      return true;
    });

    container.innerHTML = filtered
      .map(
        (cs) => `
      <article class="box rv in" style="display: flex; flex-direction: column; justify-content: space-between; gap: 20px; padding: 32px 28px; position: relative;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;">
            <span style="font-family: var(--mono); font-size: 0.74rem; color: var(--ac); background: color-mix(in srgb, var(--ac) 12%, transparent); border: 1px solid color-mix(in srgb, var(--ac) 30%, transparent); padding: 4px 12px; border-radius: 99px; font-weight: 600;">
              ${cs.category}
            </span>
            <span style="font-family: var(--mono); font-size: 0.76rem; color: var(--mut);">${cs.client}</span>
          </div>

          <h2 style="font-size: 1.45rem; line-height: 1.3; margin: 0 0 12px; color: var(--fg); letter-spacing: -0.02em;">
            <a href="${cs.link}" title="${cs.title}" style="color: inherit; text-decoration: none; transition: color 0.2s ease;">
              ${cs.title}
            </a>
          </h2>

          <p style="color: var(--mut); font-size: 0.94rem; line-height: 1.65; margin: 0 0 20px;">
            ${cs.excerpt}
          </p>

          <div class="chips" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px;">
            ${cs.tags.map(tag => `<span style="font-family: var(--mono); font-size: 0.72rem; border: 1px solid var(--line); border-radius: 99px; padding: 3px 10px; color: var(--fg);">${tag}</span>`).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 16px; margin-top: auto; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 16px; font-family: var(--mono); font-size: 0.8rem;">
            ${Object.entries(cs.stats)
            .map(([k, v]) => `<span><b style="color: var(--ac);">${v}</b> <small style="color: var(--mut);">${k}</small></span>`)
            .join('')}
          </div>
          <a class="btn p" href="${cs.link}" title="Explore ${cs.title}" style="padding: 9px 20px; font-size: 0.82rem; text-decoration: none; white-space: nowrap;">
            Read Deep-Dive &rarr;
          </a>
        </div>
      </article>`
      )
      .join('');
  }

  // Filter button click handlers
  if (filterWrap) {
    filterWrap.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filterWrap.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        render(btn.dataset.filter);
      });
    });
  }

  render('all');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCaseStudies);
} else {
  initCaseStudies();
}