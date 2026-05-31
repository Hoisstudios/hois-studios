(() => {
  const root = document.documentElement;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const revealItems = document.querySelectorAll('.reveal');
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setScrollState = () => {
    const y = window.scrollY || 0;
    root.style.setProperty('--scroll', y.toFixed(0));
    header?.classList.toggle('is-scrolled', y > 18);

    if (!reduceMotion && parallaxItems.length) {
      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallax || 0);
        item.style.transform = `translate3d(0, ${Math.min(y * speed, 42)}px, 0)`;
      });
    }
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setScrollState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  setScrollState();

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const closeMenu = () => {
    toggle?.classList.remove('is-open');
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const willOpen = !nav?.classList.contains('is-open');
    toggle.classList.toggle('is-open', willOpen);
    nav?.classList.toggle('is-open', willOpen);
    toggle.setAttribute('aria-expanded', String(willOpen));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
})();
