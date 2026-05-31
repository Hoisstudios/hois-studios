const header = document.querySelector('[data-header]');
const navButton = document.querySelector('[data-nav-button]');
const reveals = document.querySelectorAll('.reveal');

function updateChrome() {
  const y = window.scrollY || document.documentElement.scrollTop;
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--progress', `${Math.min(100, (y / max) * 100)}%`);
  if (header) header.classList.toggle('is-scrolled', y > 18);
}

updateChrome();
window.addEventListener('scroll', updateChrome, { passive: true });

if (navButton && header) {
  navButton.addEventListener('click', () => {
    const open = !header.classList.contains('is-open');
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    navButton.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('[data-nav] a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      navButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  reveals.forEach((el, index) => {
    if (el.classList.contains('area-card') || el.classList.contains('principle')) {
      el.style.setProperty('--delay', `${Math.min(index * 35, 180)}ms`);
    }
    observer.observe(el);
  });
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}
