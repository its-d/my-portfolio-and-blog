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
