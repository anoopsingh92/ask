// Career journey: filter chips and "you are here" progress along the timeline.
export function initJourney() {
  const list = document.getElementById('jt');
  if (!list) return;
  const items = [...list.querySelectorAll('.jt-item')];
  const buttons = [...document.querySelectorAll('#jt-filters button')];

  buttons.forEach(btn =>
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach(it => (it.hidden = type !== 'all' && it.dataset.type !== type));
      update();
    })
  );

  let tick = 0;
  function update() {
    tick = 0;
    const mid = window.innerHeight * 0.5;
    let active = null;
    items.forEach(it => {
      if (it.hidden) return;
      const r = it.getBoundingClientRect();
      it.classList.toggle('is-passed', r.top < mid);
      if (r.top < mid && r.bottom > mid) active = it;
    });
    items.forEach(it => it.classList.toggle('is-active', it === active));
  }
  const schedule = () => tick || (tick = requestAnimationFrame(update));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
