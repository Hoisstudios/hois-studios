
(function(){
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const navLinks = Array.from(document.querySelectorAll('.nav a[href*="#"]'));
  const build = document.querySelector('.build-showcase');
  const buildSteps = Array.from(document.querySelectorAll('.build-step'));
  const nodeCards = Array.from(document.querySelectorAll('.node-card'));

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const setBuildState = () => {
    if (!build) return;
    const rect = build.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const raw = total <= 0 ? (rect.top < window.innerHeight && rect.bottom > 0 ? .5 : 0) : (0 - rect.top) / total;
    const progress = clamp(raw, 0, 1);
    build.style.setProperty('--build-progress', progress.toFixed(3));

    const activeIndex = clamp(Math.round(progress * (buildSteps.length - 1)), 0, Math.max(0, buildSteps.length - 1));
    buildSteps.forEach((step, index) => step.classList.toggle('is-active', index === activeIndex));
    const ids = ['admin', 'media', 'fashion'];
    nodeCards.forEach(card => card.classList.toggle('is-active', card.dataset.node === ids[activeIndex]));
  };

  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--progress', Math.min(100, y / max * 100) + '%');
    document.documentElement.style.setProperty('--scroll-y', y.toFixed(0));
    if (header) header.classList.toggle('scrolled', y > 12);
    setBuildState();
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);

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

  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el, i) => {
      if (i < 12) el.style.setProperty('--d', Math.min(i * 55, 260) + 'ms');
      io.observe(el);
    });
  }

  const sections = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href').slice(link.getAttribute('href').indexOf('#'))) }))
    .filter(item => item.section);
  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sections.forEach(item => item.link.classList.toggle('active', item.section === entry.target));
      });
    }, { threshold: .38, rootMargin: '-18% 0px -55% 0px' });
    sections.forEach(item => navObserver.observe(item.section));
  }
})();
