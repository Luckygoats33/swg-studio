document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGradientCanvas();
  initCtaCanvas();
  initScrollReveal();
  initCounters();
  initDiagnostic();
  initMobileMenu();
});

function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menu.setAttribute('aria-hidden', !open);
    toggle.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initGradientCanvas() {
  const canvas = document.getElementById('gradient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, time = 0;

  const colors = [
    { r: 79, g: 140, b: 255 },
    { r: 168, g: 85, b: 247 },
    { r: 244, g: 63, b: 94 },
    { r: 249, g: 115, b: 22 },
    { r: 52, g: 211, b: 153 },
  ];

  const blobs = colors.map((c, i) => ({
    x: 0, y: 0,
    r: c.r, g: c.g, b: c.b,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: 300 + Math.random() * 200,
    phase: (i / colors.length) * Math.PI * 2
  }));

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.parentElement.clientWidth;
    h = canvas.parentElement.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    blobs.forEach((b, i) => {
      b.x = w * (0.2 + (i / blobs.length) * 0.6);
      b.y = h * (0.3 + Math.random() * 0.4);
    });
  }

  function draw() {
    time += 0.003;
    ctx.clearRect(0, 0, w, h);

    blobs.forEach((b) => {
      b.x += Math.sin(time + b.phase) * 0.8;
      b.y += Math.cos(time * 0.7 + b.phase) * 0.5;

      if (b.x < -100) b.x = w + 100;
      if (b.x > w + 100) b.x = -100;
      if (b.y < -100) b.y = h + 100;
      if (b.y > h + 100) b.y = -100;

      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
      gradient.addColorStop(0, `rgba(${b.r}, ${b.g}, ${b.b}, 0.25)`);
      gradient.addColorStop(0.5, `rgba(${b.r}, ${b.g}, ${b.b}, 0.08)`);
      gradient.addColorStop(1, `rgba(${b.r}, ${b.g}, ${b.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function initCtaCanvas() {
  const canvas = document.getElementById('cta-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, time = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.parentElement.clientWidth;
    h = canvas.parentElement.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  }

  function draw() {
    time += 0.004;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2 + Math.sin(time) * 100;
    const cy = h / 2 + Math.cos(time * 0.8) * 60;

    const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400);
    g1.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    g1.addColorStop(0.6, 'rgba(79, 140, 255, 0.1)');
    g1.addColorStop(1, 'rgba(79, 140, 255, 0)');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);

    const cx2 = w / 2 + Math.cos(time * 1.2) * 150;
    const cy2 = h / 2 + Math.sin(time * 0.6) * 80;
    const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 350);
    g2.addColorStop(0, 'rgba(244, 63, 94, 0.2)');
    g2.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = el.parentElement.querySelectorAll('.reveal');
        let idx = 0;
        siblings.forEach((s, si) => { if (s === el) idx = si; });

        setTimeout(() => {
          el.classList.add('visible');
        }, (idx % 6) * 80);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        let current = 0;
        const duration = 1800;
        const startTime = performance.now();

        function easeOutQuart(t) {
          return 1 - Math.pow(1 - t, 4);
        }

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          current = Math.round(easeOutQuart(progress) * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function initDiagnostic() {
  const cards = document.querySelectorAll('.symptom-card');
  const result = document.getElementById('diagnostic-result');
  if (!result) return;
  const resultTitle = result.querySelector('h3');
  const resultText = result.querySelector('.recommendation');
  const resultPlan = result.querySelector('.recommended-plan');
  const selected = new Set();

  const recommendations = {
    0: { title: 'You need a Foundation.', text: 'Your digital presence needs a clear reset. A custom site with proper messaging, conversion paths, and analytics will give you the base everything else builds on.', plan: 'Foundation' },
    1: { title: 'You need a Growth System.', text: 'Your site works, but nothing connects. Campaigns land on generic pages, leads vanish, and you cannot measure what matters. You need a connected acquisition system.', plan: 'Growth System' },
    2: { title: 'You are ready for a Flagship.', text: 'You have the foundation and the ambition. Now you need an interactive digital experience that demonstrates your value and a measurement system your team can run.', plan: 'Interactive Flagship' },
  };

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
      if (card.classList.contains('active')) {
        selected.add(i);
      } else {
        selected.delete(i);
      }

      if (selected.size > 0) {
        let rec;
        if (selected.size <= 2) rec = recommendations[0];
        else if (selected.size <= 4) rec = recommendations[1];
        else rec = recommendations[2];

        resultTitle.textContent = rec.title;
        resultText.textContent = rec.text;
        resultPlan.textContent = 'Recommended: ' + rec.plan;
        result.classList.add('visible');
      } else {
        result.classList.remove('visible');
      }
    });
  });
}
