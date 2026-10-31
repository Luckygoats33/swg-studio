document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    initFallback();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const lenis = initLenis();
  initCursor();
  initNav();
  initMobileMenu();
  initSplitText();
  initHeroVideoScrub();
  initHeroAnimations();
  initDiagnosticCardAnimations();
  initVideoBreakParallax();
  initServicesPinAnimation();
  initProcessAnimations();
  initWorkHorizontalScroll();
  initPlanAnimations();
  initLabAnimations();
  initAboutAnimations();
  initCtaClipReveal();
  initCtaTextAnimation();
  initCounters();
  initDiagnostic();

  ScrollTrigger.refresh();
});

function initFallback() {
  initNav();
  initMobileMenu();
  initCounters();
  initDiagnostic();
}

function initLenis() {
  if (typeof Lenis === 'undefined') return null;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenis;
}

function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const cursor = document.querySelector('.cursor');
  if (!dot || !ring || !cursor) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    gsap.to(dot, { x: mx, y: my, duration: 0.08, overwrite: true });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    gsap.set(ring, { x: rx, y: ry });
  });

  const hoverables = document.querySelectorAll('a, button, [role="button"], .nav-cta, .plan-cta, .btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

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

function initSplitText() {
  document.querySelectorAll('[data-split]').forEach(el => {
    splitTextNodes(el);
  });
}

function splitTextNodes(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const text = node.textContent;
    if (!text.trim()) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '\n' || char === '\r') continue;
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? ' ' : char;
      fragment.appendChild(span);
    }
    node.parentNode.replaceChild(fragment, node);
  });
}

function initHeroVideoScrub() {
  const video = document.querySelector('.hero-video-wrap video');
  if (!video) return;

  if (window.innerWidth < 1024) {
    video.play();
    return;
  }

  video.pause();

  const ready = () => {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        if (video.duration) {
          video.currentTime = self.progress * video.duration;
        }
      },
    });
  };

  if (video.readyState >= 2) {
    ready();
  } else {
    video.addEventListener('loadeddata', ready, { once: true });
    video.load();
  }
}

function initHeroAnimations() {
  const heroChars = document.querySelectorAll('.hero h1 .char');
  if (heroChars.length) {
    gsap.from(heroChars, {
      y: 60,
      opacity: 0,
      rotateX: -40,
      stagger: 0.018,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.3,
    });
  }

  gsap.from('.hero-badge', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.1,
  });

  gsap.from('.hero-sub', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.7,
  });

  gsap.from('.hero-actions', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.85,
  });

  gsap.from('.hero-stats', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: 1.0,
  });

  gsap.to('.hero-content', {
    y: -80,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '60% top',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: '15% top',
      end: '30% top',
      scrub: true,
    },
  });
}

function initDiagnosticCardAnimations() {
  const cards = document.querySelectorAll('.symptom-card');
  if (!cards.length) return;

  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.diagnostic-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

function initVideoBreakParallax() {
  const video = document.querySelector('.video-break video');
  if (!video) return;

  gsap.to(video, {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.video-break',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  gsap.from('.vb-label', {
    y: 30, opacity: 0, duration: 0.6, immediateRender: false,
    scrollTrigger: { trigger: '.video-break', start: 'top 70%' },
  });

  gsap.from('.vb-title', {
    y: 40, opacity: 0, duration: 0.8, delay: 0.15, immediateRender: false,
    scrollTrigger: { trigger: '.video-break', start: 'top 70%' },
  });
}

function initServicesPinAnimation() {
  const section = document.querySelector('#services');
  const cards = document.querySelectorAll('.service-card');
  if (!section || !cards.length) return;

  gsap.fromTo('#services .section-tag',
    { x: -30, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.6,
      scrollTrigger: { trigger: '#services', start: 'top 80%', toggleActions: 'play none none none' },
    }
  );

  gsap.fromTo('#services .section-title',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.8,
      scrollTrigger: { trigger: '#services', start: 'top 75%', toggleActions: 'play none none none' },
    }
  );

  gsap.fromTo('#services .section-desc',
    { y: 30, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.7, delay: 0.1,
      scrollTrigger: { trigger: '#services', start: 'top 75%', toggleActions: 'play none none none' },
    }
  );

  cards.forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

function initProcessAnimations() {
  const steps = document.querySelectorAll('.process-step');
  if (!steps.length) return;

  gsap.from('.process-left .section-tag', {
    x: -30, opacity: 0, duration: 0.6, immediateRender: false,
    scrollTrigger: { trigger: '#process', start: 'top 80%' },
  });

  gsap.from('.process-left .section-title', {
    y: 40, opacity: 0, duration: 0.8, immediateRender: false,
    scrollTrigger: { trigger: '#process', start: 'top 75%' },
  });

  gsap.from('.process-left .section-desc', {
    y: 30, opacity: 0, duration: 0.7, delay: 0.1, immediateRender: false,
    scrollTrigger: { trigger: '#process', start: 'top 75%' },
  });

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 65%',
      onEnter: () => step.classList.add('is-active'),
    });

    gsap.from(step, {
      x: 40, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
      scrollTrigger: { trigger: step, start: 'top 80%' },
    });
  });
}

function initWorkHorizontalScroll() {
  const scrollWrap = document.querySelector('.work-scroll');
  const track = document.querySelector('.work-track');
  if (!scrollWrap || !track) return;

  gsap.from('.work-section-header .section-tag', {
    x: -30, opacity: 0, duration: 0.6, immediateRender: false,
    scrollTrigger: { trigger: '.work-section-header', start: 'top 80%' },
  });

  gsap.from('.work-section-header .section-title', {
    y: 40, opacity: 0, duration: 0.8, immediateRender: false,
    scrollTrigger: { trigger: '.work-section-header', start: 'top 75%' },
  });

  ScrollTrigger.matchMedia({
    '(min-width: 769px)': () => {
      const getScrollAmount = () => {
        return -(track.scrollWidth - window.innerWidth + 60);
      };

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: scrollWrap,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount())}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    },
  });
}

function initPlanAnimations() {
  const cards = document.querySelectorAll('.plan-card');
  if (!cards.length) return;

  gsap.from('#plans .section-header', {
    y: 40, opacity: 0, duration: 0.8, immediateRender: false,
    scrollTrigger: { trigger: '#plans', start: 'top 80%' },
  });

  gsap.from(cards, {
    y: 60, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out', immediateRender: false,
    scrollTrigger: { trigger: '.plans-grid', start: 'top 80%' },
  });

  gsap.from('.plans-addon', {
    y: 30, opacity: 0, duration: 0.7, immediateRender: false,
    scrollTrigger: { trigger: '.plans-addon', start: 'top 90%' },
  });
}

function initLabAnimations() {
  gsap.from('#lab .section-header', {
    y: 40, opacity: 0, duration: 0.8, immediateRender: false,
    scrollTrigger: { trigger: '#lab', start: 'top 80%' },
  });

  gsap.from('.lab-card', {
    y: 50, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power2.out', immediateRender: false,
    scrollTrigger: { trigger: '.lab-grid', start: 'top 80%' },
  });
}

function initAboutAnimations() {
  gsap.from('.about-text .section-tag', {
    x: -30, opacity: 0, duration: 0.6, immediateRender: false,
    scrollTrigger: { trigger: '#about', start: 'top 80%' },
  });

  gsap.from('.about-text .section-title', {
    y: 40, opacity: 0, duration: 0.8, immediateRender: false,
    scrollTrigger: { trigger: '#about', start: 'top 75%' },
  });

  gsap.from('.about-text p', {
    y: 30, opacity: 0, stagger: 0.1, duration: 0.7, immediateRender: false,
    scrollTrigger: { trigger: '.about-text', start: 'top 70%' },
  });

  gsap.from('.stat-card', {
    y: 40, opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.7, ease: 'power2.out', immediateRender: false,
    scrollTrigger: { trigger: '.about-stats', start: 'top 80%' },
  });
}

function initCtaClipReveal() {
  const cta = document.querySelector('.cta-section');
  if (!cta) return;

  gsap.fromTo(cta,
    { clipPath: 'circle(8% at 50% 50%)' },
    {
      clipPath: 'circle(100% at 50% 50%)',
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: cta,
        start: 'top 85%',
        end: 'top 25%',
        scrub: 1,
      },
    }
  );
}

function initCtaTextAnimation() {
  const ctaChars = document.querySelectorAll('.cta-title .char');
  if (!ctaChars.length) return;

  gsap.from(ctaChars, {
    y: 50, opacity: 0, stagger: 0.015, duration: 0.8, ease: 'power3.out', immediateRender: false,
    scrollTrigger: { trigger: '.cta-title', start: 'top 70%' },
  });

  gsap.from('.cta-sub', {
    y: 30, opacity: 0, duration: 0.7, delay: 0.2, immediateRender: false,
    scrollTrigger: { trigger: '.cta-sub', start: 'top 80%' },
  });

  gsap.from('.cta-actions', {
    y: 30, opacity: 0, duration: 0.7, delay: 0.3, immediateRender: false,
    scrollTrigger: { trigger: '.cta-actions', start: 'top 85%' },
  });
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  if (typeof gsap !== 'undefined') {
    counters.forEach(el => {
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
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = prefix + Math.round(obj.val) + suffix;
            },
          });
        },
      });
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          const duration = 1800;
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

    counters.forEach(el => observer.observe(el));
  }
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
