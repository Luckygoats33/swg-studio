document.addEventListener('DOMContentLoaded', () => {
  initLoader();
});

function initLoader() {
  const loader = document.getElementById('loader');
  const loaderText = document.getElementById('loader-text');
  if (!loader) { initSite(); return; }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const target = 'SWG';
  let frame = 0;
  const totalFrames = 40;

  const scramble = setInterval(() => {
    frame++;
    let result = '';
    for (let i = 0; i < target.length; i++) {
      if (frame / totalFrames > (i / target.length) + 0.4) {
        result += target[i];
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    loaderText.textContent = result;

    if (frame >= totalFrames) {
      clearInterval(scramble);
      loaderText.textContent = target;
      setTimeout(() => {
        loader.classList.add('done');
        setTimeout(() => {
          loader.remove();
          initSite();
        }, 500);
      }, 400);
    }
  }, 30);
}

function initSite() {
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    initLenis();
  }

  initCursor();
  initNav();
  initMobileMenu();
  initServiceAccordion();
  initDiagnostic();

  if (hasGSAP) {
    initHeroAnimations();
    initScrollReveals();
    initCounters();

    gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    });

    ScrollTrigger.refresh();
  } else {
    initCountersFallback();
  }
}

/* ---- LENIS ---- */
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---- CURSOR ---- */
function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.querySelector('.cursor');
  const cross = document.querySelector('.cursor-cross');
  if (!cursor || !cross) return;

  let mx = -100, my = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (typeof gsap !== 'undefined') {
      gsap.to(cursor, { x: mx, y: my, duration: 0.08, overwrite: true });
    } else {
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
    }
  });

  const hoverTargets = document.querySelectorAll('a, button, [role="button"]');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* ---- NAV ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
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
    toggle.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    toggle.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---- SERVICE ACCORDION ---- */
function initServiceAccordion() {
  const rows = document.querySelectorAll('.service-row');
  rows.forEach(row => {
    const head = row.querySelector('.service-head');
    if (!head) return;

    head.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');

      rows.forEach(r => {
        r.classList.remove('open');
        const h = r.querySelector('.service-head');
        if (h) h.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        row.classList.add('open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ---- DIAGNOSTIC ---- */
function initDiagnostic() {
  const rows = document.querySelectorAll('.symptom-row');
  const result = document.getElementById('diagnostic-result');
  if (!result) return;

  const resultTitle = document.getElementById('result-title');
  const resultText = document.getElementById('result-text');
  const resultPlan = document.getElementById('result-plan');
  const selected = new Set();

  const recs = {
    low: {
      title: 'You need a Foundation.',
      text: 'Your digital presence needs a clear reset. A custom site with proper messaging, conversion paths, and analytics.',
      plan: 'Foundation',
    },
    mid: {
      title: 'You need a Growth System.',
      text: 'Your site works, but nothing connects. Campaigns land on generic pages, leads vanish. You need a connected system.',
      plan: 'Growth System',
    },
    high: {
      title: 'You are ready for a Flagship.',
      text: 'You have the foundation. Now you need an interactive experience that demonstrates your value and a system your team can run.',
      plan: 'Interactive Flagship',
    },
  };

  rows.forEach((row, i) => {
    row.addEventListener('click', () => {
      row.classList.toggle('active');
      if (row.classList.contains('active')) selected.add(i); else selected.delete(i);

      if (selected.size > 0) {
        let rec;
        if (selected.size <= 2) rec = recs.low;
        else if (selected.size <= 4) rec = recs.mid;
        else rec = recs.high;

        resultTitle.textContent = rec.title;
        resultText.textContent = rec.text;
        resultPlan.textContent = rec.plan + ' →';
        result.classList.add('visible');

        if (typeof gsap !== 'undefined') {
          gsap.from(result, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
        }
      } else {
        result.classList.remove('visible');
      }
    });
  });
}

/* ---- GSAP ANIMATIONS ---- */
function initHeroAnimations() {
  const lines = document.querySelectorAll('.hero-line');
  if (!lines.length) return;

  gsap.from(lines, {
    clipPath: 'inset(0 0 100% 0)',
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    delay: 1.8,
  });

  gsap.from('.hero-rule', {
    scaleX: 0,
    transformOrigin: 'left center',
    duration: 0.8,
    ease: 'power2.out',
    delay: 2.4,
  });

  gsap.from('.hero-foot-left', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 2.6,
  });

  gsap.from('.hero-stat', {
    y: 20,
    opacity: 0,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power2.out',
    delay: 2.8,
  });

  gsap.to('.hero-inner', {
    y: -80,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '50% top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function initScrollReveals() {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  gsap.from('.symptom-row', {
    x: -20,
    opacity: 0,
    stagger: 0.06,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.symptom-list',
      start: 'top 80%',
    },
  });

  gsap.from('.service-row', {
    x: -20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.service-list',
      start: 'top 80%',
    },
  });

  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    gsap.from(processSteps, {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.process-grid',
        start: 'top 80%',
      },
    });
  }

  gsap.from('.work-case', {
    y: 50,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.work-cases',
      start: 'top 80%',
    },
  });

  const cta = document.querySelector('.cta-headline');
  if (cta) {
    gsap.from(cta, {
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.cta',
        start: 'top 75%',
      },
    });
  }
}

/* ---- COUNTERS ---- */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val) + suffix;
          },
        });
      },
    });
  });
}

function initCountersFallback() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2000;
        const startTime = performance.now();

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = prefix + Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}
