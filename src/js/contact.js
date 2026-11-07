// Contact page: when a visitor arrives from an ad button (?page=Name), add that page to the
// advertising email subject and show a short note.
export function initContact() {
  const page = new URLSearchParams(location.search).get('page');
  if (!page) return;
  const btn = document.querySelector('#advertise .ct-btn');
  const note = document.getElementById('ct-note');
  if (btn) {
    btn.href = btn.href.replace(/subject=([^&]*)/, (m, s) => `subject=${s}${encodeURIComponent(' - ' + page)}`);
  }
  if (note) {
    note.hidden = false;
    note.textContent = `You are asking about advertising on the “${page}” page. The email template below already includes it.`;
  }
}
