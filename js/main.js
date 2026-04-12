// Smooth scroll for anchor links (backup; CSS scroll-behavior also set)
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  const id = a.getAttribute('href');
  if (id === '#') return;
  a.addEventListener('click', function (e) {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* Hero typewriter — cycles through roles, respects reduced-motion */
(function () {
  const target = document.querySelector('.hero-typewriter');
  if (!target) return;

  const roles = [
    'I develop cloud infra',
    'I automate DevOps',
    'I ship AWS systems',
    'I build agentic AI tools'
  ];

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    target.textContent = roles[0];
    return;
  }

  const TYPE_MS = 60;
  const ERASE_MS = 30;
  const HOLD_MS = 2200;
  let roleIdx = 0;
  let charIdx = 0;
  let erasing = false;

  function tick() {
    const role = roles[roleIdx];
    if (!erasing) {
      charIdx++;
      target.textContent = role.slice(0, charIdx);
      if (charIdx === role.length) {
        erasing = true;
        return setTimeout(tick, HOLD_MS);
      }
      return setTimeout(tick, TYPE_MS);
    } else {
      charIdx--;
      target.textContent = role.slice(0, charIdx);
      if (charIdx === 0) {
        erasing = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      return setTimeout(tick, ERASE_MS);
    }
  }

  tick();
})();
