// Interactive skill map: category tabs, search, skill nodes and a detail panel.
import { categories, projects, skills } from './skills-data.js';

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function initSkillMap(root, siteRoot) {
  const byId = Object.fromEntries(skills.map(s => [s.id, s]));
  const cat = Object.fromEntries(categories.map(c => [c.id, c]));
  const state = { cat: categories[0].id, skill: 'drupal-custom-theme', query: '' };
  const href = p => (/^https?:/.test(p.href) ? p.href : siteRoot + p.href);

  // skills that share at least one project are "connected"
  const pairs = id => {
    const mine = byId[id].projects;
    if (!mine.length) return [];
    return skills
      .filter(s => s.id !== id && s.projects.some(p => mine.includes(p)))
      .map(s => ({ s, n: s.projects.filter(p => mine.includes(p)).length }))
      .sort((a, b) => b.n - a.n)
      .map(x => x.s);
  };

  root.innerHTML = `
    <div class="sm-tools">
      <input class="sm-search" id="sm-search" type="search" placeholder="Search ${skills.length} skills…" aria-label="Search skills" autocomplete="off">
      <p class="sm-count" id="sm-count" role="status" aria-live="polite"></p>
    </div>
    <div class="sm-tabs" role="group" aria-label="Skill groups">
      ${categories
        .map(c => `<button type="button" class="sm-tab" data-cat="${c.id}" aria-pressed="false">${esc(c.label)} <span class="ls-count">${c.skills.length}</span></button>`)
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
  const search = root.querySelector('#sm-search');
  const count = root.querySelector('#sm-count');

  const matches = n => (state.query ? byId[n.dataset.id].name.toLowerCase().includes(state.query) : n.dataset.cat === state.cat);

  function render() {
    const sel = byId[state.skill];
    const linked = new Set(pairs(sel.id).map(s => s.id));
    tabs.forEach(t => t.setAttribute('aria-pressed', String(!state.query && t.dataset.cat === state.cat)));
    let shown = 0;
    nodes.forEach(n => {
      const id = n.dataset.id;
      const show = matches(n);
      n.hidden = !show;
      if (show) shown++;
      n.setAttribute('aria-pressed', String(id === state.skill));
      n.classList.toggle('is-linked', linked.has(id));
      n.classList.toggle('is-dim', linked.size > 0 && id !== state.skill && !linked.has(id));
    });
    count.textContent = state.query ? `${shown} match${shown === 1 ? '' : 'es'}` : `${shown} skills in ${cat[state.cat].label}`;

    const seen = sel.projects.map(p => projects[p]);
    const pair = pairs(sel.id).slice(0, 6);
    const siblings = pair.length ? [] : skills.filter(s => s.cat === sel.cat && s.id !== sel.id).slice(0, 6);
    panel.innerHTML = `
      <p class="sm-kicker">${esc(cat[sel.cat].label)}</p>
      <h3 class="sm-title">${esc(sel.name)}</h3>
      <p class="sm-info">${esc(sel.info || cat[sel.cat].blurb)}</p>
      <h4 class="sm-sub">Seen in</h4>
      ${
        seen.length
          ? `<ul class="sm-list">${seen.map(p => `<li><a href="${esc(href(p))}"${p.external ? ' target="_blank" rel="noopener"' : ''}>${esc(p.label)}${p.external ? ' ↗' : ' →'}</a></li>`).join('')}</ul>`
          : '<p class="sm-none">Part of my day-to-day toolkit across client work.</p>'
      }
      ${
        pair.length
          ? `<h4 class="sm-sub">Pairs with</h4><div class="sm-pairs">${pair.map(s => `<button type="button" class="sm-pair" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>`
          : siblings.length
            ? `<h4 class="sm-sub">More in this group</h4><div class="sm-pairs">${siblings.map(s => `<button type="button" class="sm-pair" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>`
            : ''
      }`;
  }

  root.addEventListener('click', e => {
    const tab = e.target.closest('.sm-tab');
    const node = e.target.closest('.sm-node, .sm-pair');
    if (tab) {
      state.cat = tab.dataset.cat;
      state.query = '';
      search.value = '';
      const first = skills.find(s => s.cat === state.cat);
      if (byId[state.skill].cat !== state.cat) state.skill = first.id;
      render();
    } else if (node) {
      state.skill = node.dataset.id;
      state.cat = byId[state.skill].cat;
      if (state.query && !byId[state.skill].name.toLowerCase().includes(state.query)) {
        state.query = '';
        search.value = '';
      }
      render();
    }
  });

  search.addEventListener('input', () => {
    state.query = search.value.trim().toLowerCase();
    if (state.query) {
      const first = nodes.find(matches);
      if (first && !matches(nodes.find(n => n.dataset.id === state.skill))) state.skill = first.dataset.id;
    }
    render();
  });

  render();
}
