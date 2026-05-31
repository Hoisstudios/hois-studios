
(function () {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileNav = document.querySelector('.nav-links');
  let lastY = window.scrollY;
  let ticking = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function updateScroll() {
    const y = window.scrollY || 0;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pageProgress = clamp(y / max, 0, 1);
    root.style.setProperty('--page-progress-width', (pageProgress * 100).toFixed(2) + '%');
    root.style.setProperty('--ambient-y', (y * -0.04).toFixed(1) + 'px');
    root.style.setProperty('--panel-blob-y', (y * -0.03).toFixed(1) + 'px');

    if (header) {
      if (y > lastY && y > 260) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
    }
    lastY = y;

    document.querySelectorAll('[data-scroll-scene]').forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 0 : clamp((-rect.top) / travel, 0, 1);
      scene.style.setProperty('--scene-progress', progress.toFixed(4));
      scene.style.setProperty('--route-offset', (680 - progress * 680).toFixed(1));
      scene.style.setProperty('--node-y', ((0.5 - progress) * 18).toFixed(1) + 'px');
      scene.style.setProperty('--node-scale', (0.94 + progress * 0.08).toFixed(3));
    });

    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateScroll();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .scroll-card').forEach((el) => revealObserver.observe(el));

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === id));
    });
  }, { threshold: 0.35 });
  sections.forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      btn.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });
  });

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = !mobileNav.classList.contains('is-open');
      mobileNav.classList.toggle('is-open', open);
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuButton.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
