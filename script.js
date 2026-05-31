(function(){
  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-button');
  const buildMaps = document.querySelectorAll('.build-map');

  const applyBuildMotion = (map) => {
    const pointerX = Number(map.dataset.pointerX || 0);
    const pointerY = Number(map.dataset.pointerY || 0);
    const shift = Number(map.dataset.shift || 0);
    map.style.setProperty('--line-x', (-pointerX * .22).toFixed(2) + 'px');
    map.style.setProperty('--line-y', (shift - pointerY * .22).toFixed(2) + 'px');
    map.style.setProperty('--core-x', (pointerX * .28).toFixed(2) + 'px');
    map.style.setProperty('--core-y', (shift + pointerY * .28).toFixed(2) + 'px');
  };

  const progress = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    document.documentElement.style.setProperty('--progress', Math.min(100, y / max * 100) + '%');
    if (header) header.classList.toggle('scrolled', y > 12);

    buildMaps.forEach((map) => {
      const rect = map.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - window.innerHeight / 2) / Math.max(1, window.innerHeight);
      map.dataset.shift = Math.max(-8, Math.min(8, distance * -18)).toFixed(2);
      applyBuildMotion(map);
    });
  };

  progress();
  window.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress, { passive: true });

  buildMaps.forEach((map) => {
    map.addEventListener('pointermove', (event) => {
      const rect = map.getBoundingClientRect();
      map.dataset.pointerX = (((event.clientX - rect.left) / rect.width - .5) * 12).toFixed(2);
      map.dataset.pointerY = (((event.clientY - rect.top) / rect.height - .5) * 12).toFixed(2);
      applyBuildMotion(map);
    });
    map.addEventListener('pointerleave', () => {
      map.dataset.pointerX = '0';
      map.dataset.pointerY = '0';
      applyBuildMotion(map);
    });
  });

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
