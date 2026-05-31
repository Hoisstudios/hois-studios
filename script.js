
(function(){
  if (window.__HOIS_STUDIOS_READY__) return;
  window.__HOIS_STUDIOS_READY__ = true;

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href*="#"]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (min, value, max) => Math.min(Math.max(value, min), max);

  function updateScrollState(){
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--progress', Math.min(100, y / max * 100) + '%');
    document.documentElement.style.setProperty('--hero-shift', clamp(0, y, 520) + 'px');
    if (header) header.classList.toggle('scrolled', y > 12);
  }
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  if (menuButton) {
    menuButton.addEventListener('click', function(){
      const open = !body.classList.contains('nav-open');
      body.classList.toggle('nav-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav a').forEach(function(a){
      a.addEventListener('click', function(){
        body.classList.remove('nav-open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((el, i) => {
      if (i < 12) el.style.setProperty('--d', Math.min(i * 60, 360) + 'ms');
      revealObserver.observe(el);
    });
  }

  if (navLinks.length && 'IntersectionObserver' in window) {
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute('href').slice(link.getAttribute('href').indexOf('#'))))
      .filter(Boolean);
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href').endsWith('#' + id)));
    }, { threshold: [.22, .38, .58], rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(section => activeObserver.observe(section));
  }

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x.toFixed(2) + '%');
      card.style.setProperty('--my', y.toFixed(2) + '%');
    });
  });

  function animateSystemMap(){
    if (reduceMotion) return;
    const maps = Array.from(document.querySelectorAll('[data-system-map]'));
    if (!maps.length) return;

    function frame(time){
      maps.forEach(map => {
        const rect = map.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        map.querySelectorAll('.system-pulse').forEach((pulse, index) => {
          const route = map.querySelector('#' + pulse.dataset.route);
          if (!route || !route.getTotalLength) return;
          const length = route.getTotalLength();
          const speed = Number(pulse.dataset.speed || .12);
          const offset = Number(pulse.dataset.offset || index * .23);
          const t = ((time / 1000) * speed + offset) % 1;
          const point = route.getPointAtLength(length * t);
          pulse.style.left = (point.x / 360 * rect.width) + 'px';
          pulse.style.top = (point.y / 420 * rect.height) + 'px';
        });
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  animateSystemMap();
})();
