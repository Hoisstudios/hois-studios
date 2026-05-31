(function(){
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const buildVisual = document.querySelector('.build-visual');

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateBuildVisual = () => {
    if (!buildVisual) return;
    const rect = buildVisual.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
    buildVisual.style.setProperty('--build-progress', progress.toFixed(3));
  };

  const progress = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--progress', Math.min(100, y / max * 100) + '%');
    if (header) header.classList.toggle('scrolled', y > 12);
    updateBuildVisual();
  };
  progress();
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress, { passive: true });

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
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .13, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el, i) => {
    if (i < 8) el.style.setProperty('--d', Math.min(i * 55, 240) + 'ms');
    io.observe(el);
  });
})();
