// Interactive skill map: category filters, skill nodes and a detail panel.
import { categories, projects, skills } from './skills-data.js';

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initSkillMap(root, siteRoot) {
  const byId = Object.fromEntries(skills.map(s => [s.id, s]));
  const catLabel = Object.fromEntries(categories.map(c => [c.id, c.label]));
  const state = { cat: 'all', skill: 'theming' };
  const href = p => (/^https?:/.test(p.href) ? p.href : siteRoot + p.href);

  // skills that share at least one project are "connected"
  const pairs = id => {
    const mine = byId[id].projects;
    return skills
      .filter(s => s.id !== id && s.projects.some(p => mine.includes(p)))
      .map(s => ({ s, n: s.projects.filter(p => mine.includes(p)).length }))
      .sort((a, b) => b.n - a.n)
      .map(x => x.s);
  };

  root.innerHTML = `
    <div class="sm-tabs" role="group" aria-label="Skill categories">
      <button type="button" class="sm-tab" data-cat="all" aria-pressed="true">All <span class="ls-count">${skills.length}</span></button>
      ${categories
        .map(c => `<button type="button" class="sm-tab" data-cat="${c.id}" aria-pressed="false">${esc(c.label)} <span class="ls-count">${skills.filter(s => s.cat === c.id).length}</span></button>`)
        .join('')}
    </div>
    <div class="sm-body">
      <div class="sm-nodes" role="group" aria-label="Skills">
        ${skills.map(s => `<button type="button" class="sm-node" data-id="${s.id}" data-cat="${s.cat}" aria-pressed="false">${esc(s.name)}</button>`).join('')}
      </div>
      <aside class="sm-panel box" aria-live="polite"></aside>
    </div>`;

  const panel = root.querySelector('.sm-panel');
  const nodes = [...root.querySelectorAll('.sm-node')];
  const tabs = [...root.querySelectorAll('.sm-tab')];

  function render() {
    const sel = byId[state.skill];
    const linked = new Set(pairs(sel.id).map(s => s.id));
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.cat === state.cat)));
    nodes.forEach(n => {
      const id = n.dataset.id;
      n.hidden = state.cat !== 'all' && n.dataset.cat !== state.cat;
      n.setAttribute('aria-pressed', String(id === state.skill));
      n.classList.toggle('is-linked', linked.has(id));
      n.classList.toggle('is-dim', id !== state.skill && !linked.has(id));
    });
    const seen = sel.projects.map(p => projects[p]);
    const pair = pairs(sel.id).slice(0, 6);
    panel.innerHTML = `
      <p class="sm-kicker">${esc(catLabel[sel.cat])}</p>
      <h3 class="sm-title">${esc(sel.name)}</h3>
      <p class="sm-info">${esc(sel.info)}</p>
      <h4 class="sm-sub">Seen in</h4>
      ${
        seen.length
          ? `<ul class="sm-list">${seen.map(p => `<li><a href="${esc(href(p))}"${p.external ? ' target="_blank" rel="noopener"' : ''}>${esc(p.label)}${p.external ? ' ↗' : ' →'}</a></li>`).join('')}</ul>`
          : '<p class="sm-none">Part of my day-to-day toolkit across client work.</p>'
      }
      ${
        pair.length
          ? `<h4 class="sm-sub">Pairs with</h4><div class="sm-pairs">${pair.map(s => `<button type="button" class="sm-pair" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>`
          : ''
      }`;
  }

  root.addEventListener('click', e => {
    const tab = e.target.closest('.sm-tab');
    const node = e.target.closest('.sm-node, .sm-pair');
    if (tab) {
      state.cat = tab.dataset.cat;
      const sel = byId[state.skill];
      // keep the selection visible when it is filtered out
      if (state.cat !== 'all' && sel.cat !== state.cat) state.skill = skills.find(s => s.cat === state.cat).id;
      render();
    } else if (node) {
      state.skill = node.dataset.id;
      if (state.cat !== 'all' && byId[state.skill].cat !== state.cat) state.cat = 'all';
      render();
    }
  });

  render();
}
