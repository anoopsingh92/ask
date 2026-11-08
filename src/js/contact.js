// Contact page: when a visitor arrives from a button on another page (?page=Name#card), add that
// name to the matching card's email subject and show a short note.
export function initContact() {
  const page = new URLSearchParams(location.search).get('page');
  if (!page) return;
  const id = location.hash.slice(1) || 'advertise';
  const card = document.getElementById(id);
  const btn = card && card.querySelector('.ct-btn');
  const note = document.getElementById('ct-note');
  if (btn) {
    btn.href = btn.href.replace(/subject=([^&]*)/, (m, s) => `subject=${s}${encodeURIComponent(' - ' + page)}`);
  }
  if (note) {
    note.hidden = false;
    note.textContent =
      id === 'advertise'
        ? `You are asking about advertising on the “${page}” page. The email template below already includes it.`
        : `You are asking about “${page}”. The email template below already includes it.`;
  }
}
