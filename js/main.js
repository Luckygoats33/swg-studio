document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initNetworkCanvas();
  initDiagnostic();
  initScrollAnimations();
  initCounters();
});

function initNav() {
  const nav = document.querySelector('.nav');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 60);
    lastScroll = y;
  }, { passive: true });
}

function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, nodes = [], mouse = { x: -1000, y: -1000 };
  const nodeCount = window.innerWidth < 768 ? 30 : 60;
  const labels = [
    'WEBSITE', 'CRM', 'ANALYTICS', 'ADS', 'EMAIL', 'SEO',
    'CONTENT', 'SOCIAL', 'LANDING', 'FUNNEL', 'CONVERT',
    'MEASURE', 'OPTIMIZE', 'AUTOMATE', 'BRAND', 'UX'
  ];

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

  function createNodes() {
    nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      const hasLabel = i < labels.length;
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: hasLabel ? 4 : 2,
        label: hasLabel ? labels[i] : null,
        pulse: Math.random() * Math.PI * 2,
        connected: false
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const connectionDist = 180;
    const mouseDist = 250;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;
      a.pulse += 0.02;

      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < mouseDist) {
        const force = (1 - dm / mouseDist) * 0.5;
        a.vx += (a.x - mouse.x) / dm * force;
        a.vy += (a.y - mouse.y) / dm * force;
      }
      a.vx *= 0.99;
      a.vy *= 0.99;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < connectionDist) {
          const alpha = (1 - d / connectionDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 216, 240, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      const glow = 0.5 + Math.sin(n.pulse) * 0.3;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.label
        ? `rgba(0, 216, 240, ${glow})`
        : `rgba(90, 100, 128, ${glow * 0.6})`;
      ctx.fill();

      if (n.label) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 216, 240, ${glow * 0.15})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillStyle = `rgba(0, 216, 240, ${glow * 0.6})`;
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y - 16);
      }
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  createNodes();
  draw();
  window.addEventListener('resize', () => { resize(); createNodes(); });
}

function initDiagnostic() {
  const cards = document.querySelectorAll('.symptom-card');
  const result = document.querySelector('.diagnostic-result');
  const resultTitle = result?.querySelector('h3');
  const resultText = result?.querySelector('.recommendation');
  const resultPlan = result?.querySelector('.recommended-plan');
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

      if (selected.size > 0 && result) {
        let rec;
        if (selected.size <= 2) rec = recommendations[0];
        else if (selected.size <= 4) rec = recommendations[1];
        else rec = recommendations[2];

        resultTitle.textContent = rec.title;
        resultText.textContent = rec.text;
        resultPlan.textContent = 'Recommended: ' + rec.plan;
        result.classList.add('visible');
      } else if (result) {
        result.classList.remove('visible');
      }
    });
  });
}

function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    targets.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 4) * 0.08}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
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
        const duration = 1500;
        const step = target / (duration / 16);

        function tick() {
          current = Math.min(current + step, target);
          el.textContent = prefix + Math.round(current) + suffix;
          if (current < target) requestAnimationFrame(tick);
        }
        tick();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}
