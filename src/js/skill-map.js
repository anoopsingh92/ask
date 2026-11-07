// Interactive skill map: group tabs, search, skill chips, a relationship graph and a detail panel.
import { categories, projects, skills } from './skills-data.js';

const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const NS = 'http://www.w3.org/2000/svg';

export function initSkillMap(root, siteRoot) {
  const byId = Object.fromEntries(skills.map(s => [s.id, s]));
  const cat = Object.fromEntries(categories.map(c => [c.id, c]));
  const state = { cat: categories[0].id, skill: 'drupal-custom-theme', query: '' };
  const href = p => (/^https?:/.test(p.href) ? p.href : siteRoot + p.href);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  const siblings = s => skills.filter(o => o.cat === s.cat && o.id !== s.id);

  root.innerHTML = `
    <div class="sm-tools">
      <input class="sm-search" id="sm-search" type="search" placeholder="Search ${skills.length} skills…" aria-label="Search skills" autocomplete="off">
      <button class="sm-random" id="sm-random" type="button">Surprise me &#8635;</button>
      <p class="sm-count" id="sm-count" role="status" aria-live="polite"></p>
    </div>
    <div class="sm-tabs" role="group" aria-label="Skill groups">
      ${categories.map(c => `<button type="button" class="sm-tab" data-cat="${c.id}" aria-pressed="false">${esc(c.label)} <span class="ls-count">${c.skills.length}</span></button>`).join('')}
    </div>
    <p class="sm-blurb" id="sm-blurb"></p>
    <div class="sm-nodes" role="group" aria-label="Skills">
      ${skills.map(s => `<button type="button" class="sm-node" data-id="${s.id}" data-cat="${s.cat}" aria-pressed="false">${esc(s.name)}</button>`).join('')}
    </div>
    <div class="sm-stage">
      <div class="sm-graph" id="sm-graph" aria-hidden="true"></div>
      <aside class="sm-panel box" aria-live="polite"></aside>
    </div>`;

  const panel = root.querySelector('.sm-panel');
  const graph = root.querySelector('#sm-graph');
  const nodes = [...root.querySelectorAll('.sm-node')];
  const tabs = [...root.querySelectorAll('.sm-tab')];
  const search = root.querySelector('#sm-search');
  const count = root.querySelector('#sm-count');
  const blurb = root.querySelector('#sm-blurb');

  const matches = n => (state.query ? byId[n.dataset.id].name.toLowerCase().includes(state.query) : n.dataset.cat === state.cat);

  /* ---------- relationship graph ---------- */
  const ring = (n, rx, ry, start) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((start + (360 / n) * i) * Math.PI) / 180;
      return { x: 50 + rx * Math.cos(a), y: 50 + ry * Math.sin(a) };
    });

  function drawGraph(sel, related, linkedByProject) {
    const projs = sel.projects.map(k => ({ key: k, ...projects[k] }));
    const inner = ring(projs.length, 21, 27, -90);
    const outer = ring(related.length, 41, 40, related.length > 4 ? -75 : -45);

    const line = (a, b, cls) => `<line class="${cls}" x1="${a.x}%" y1="${a.y}%" x2="${b.x}%" y2="${b.y}%"/>`;
    const c = { x: 50, y: 50 };
    let lines = '';
    projs.forEach((p, i) => (lines += line(c, inner[i], 'sm-edge sm-edge--project')));
    related.forEach((r, i) => {
      lines += line(c, outer[i], linkedByProject ? 'sm-edge' : 'sm-edge sm-edge--soft');
      if (linkedByProject) {
        projs.forEach((p, j) => {
          if (r.projects.includes(p.key)) lines += line(inner[j], outer[i], 'sm-edge sm-edge--thin');
        });
      }
    });

    const pos = pt => `left:${pt.x.toFixed(2)}%;top:${pt.y.toFixed(2)}%`;
    graph.innerHTML = `
      <svg class="sm-lines" width="100%" height="100%" focusable="false">${lines}</svg>
      <span class="sm-gnode sm-gnode--center" style="${pos(c)}">${esc(sel.name)}</span>
      ${projs
        .map(
          (p, i) =>
            `<a class="sm-gnode sm-gnode--project" tabindex="-1" style="${pos(inner[i])}" href="${esc(href(p))}"${p.external ? ' target="_blank" rel="noopener"' : ''}>${esc(p.label)}</a>`
        )
        .join('')}
      ${related
        .map(
          (r, i) =>
            `<button type="button" class="sm-gnode sm-gnode--skill${linkedByProject ? '' : ' is-soft'}" tabindex="-1" data-id="${r.id}" style="${pos(outer[i])}">${esc(r.name)}</button>`
        )
        .join('')}
      <p class="sm-legend"><i class="sm-key sm-key--skill"></i>${linkedByProject ? 'Skills used together' : 'Same group'}<i class="sm-key sm-key--project"></i>Projects</p>`;
    graph.classList.toggle('is-static', reduce);
  }

  /* ---------- render ---------- */
  function render() {
    const sel = byId[state.skill];
    const connected = pairs(sel.id);
    const linked = new Set(connected.map(s => s.id));
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
    count.textContent = state.query
      ? `${shown} match${shown === 1 ? '' : 'es'}`
      : `${skills.length} skills · ${categories.length} groups · ${Object.keys(projects).length} projects`;
    blurb.textContent = state.query ? `Showing skills that match “${state.query}”.` : `${cat[state.cat].label}: ${cat[state.cat].blurb}`;

    const related = (connected.length ? connected : siblings(sel)).slice(0, 6);
    drawGraph(sel, related, connected.length > 0);

    const seen = sel.projects.map(p => projects[p]);
    const sib = connected.length ? [] : related;
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
        connected.length
          ? `<h4 class="sm-sub">Pairs with</h4><div class="sm-pairs">${related.map(s => `<button type="button" class="sm-pair" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>`
          : sib.length
            ? `<h4 class="sm-sub">More in this group</h4><div class="sm-pairs">${sib.map(s => `<button type="button" class="sm-pair" data-id="${s.id}">${esc(s.name)}</button>`).join('')}</div>`
            : ''
      }`;
  }

  const select = id => {
    state.skill = id;
    if (!state.query || !byId[id].name.toLowerCase().includes(state.query)) {
      state.query = '';
      search.value = '';
      state.cat = byId[id].cat;
    }
    render();
  };

  root.addEventListener('click', e => {
    const tab = e.target.closest('.sm-tab');
    const node = e.target.closest('.sm-node, .sm-pair, .sm-gnode--skill');
    if (tab) {
      state.cat = tab.dataset.cat;
      state.query = '';
      search.value = '';
      if (byId[state.skill].cat !== state.cat) state.skill = skills.find(s => s.cat === state.cat).id;
      render();
    } else if (node) {
      select(node.dataset.id);
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

  root.querySelector('#sm-random').addEventListener('click', () => {
    let next;
    do next = skills[Math.floor(Math.random() * skills.length)];
    while (next.id === state.skill);
    select(next.id);
  });

  // arrow keys move between the visible skill chips
  root.querySelector('.sm-nodes').addEventListener('keydown', e => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys) && e.key !== 'Home' && e.key !== 'End') return;
    const visible = nodes.filter(n => !n.hidden);
    const i = visible.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? visible.length - 1 : (i + keys[e.key] + visible.length) % visible.length;
    visible[next].focus();
  });

  render();
}
