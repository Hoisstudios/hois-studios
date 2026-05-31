const root = document.documentElement;
const body = document.body;
const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const year = document.querySelector('[data-year]');

if (year) year.textContent = new Date().getFullYear();

const updateScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  root.style.setProperty('--scroll-progress', progress.toFixed(2));
  header?.classList.toggle('is-scrolled', scrollTop > 18);
};

updateScroll();
window.addEventListener('scroll', updateScroll, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
}

const revealItems = document.querySelectorAll('.reveal, .statement');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

revealItems.forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { threshold: 0.42 });

sections.forEach((section) => activeObserver.observe(section));

const movingElements = document.querySelectorAll('[data-depth]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && movingElements.length) {
  window.addEventListener('pointermove', (event) => {
    const x = event.clientX - window.innerWidth / 2;
    const y = event.clientY - window.innerHeight / 2;

    movingElements.forEach((element) => {
      const depth = Number(element.dataset.depth || 0.02);
      element.style.setProperty('--mx', (-x * depth).toFixed(2));
      element.style.setProperty('--my', (-y * depth).toFixed(2));
    });
  }, { passive: true });
}

const paths = document.querySelectorAll('.draw-line');
paths.forEach((path) => {
  const length = Math.ceil(path.getTotalLength());
  path.style.setProperty('--path-length', length);
});
