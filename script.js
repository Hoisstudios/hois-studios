(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');

  const setHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  const setProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (window.scrollY / height) * 100 : 0;
    root.style.setProperty('--scroll', `${Math.min(100, Math.max(0, progress))}%`);
  };

  const closeNav = () => {
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Menü öffnen');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
  });

  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNav();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      setHeader();
      setProgress();
      ticking = false;
    });
    ticking = true;
  };

  setHeader();
  setProgress();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setProgress);
})();
