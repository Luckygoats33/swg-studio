document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMenu();
  initScrollAnimations();
  initAccordion();
  initBgTextParallax();
});

function initNav() {
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initMenu() {
  const toggle = document.querySelector('.nav-menu-toggle');
  const overlay = document.querySelector('.menu-overlay');
  const links = overlay.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    toggle.textContent = open ? 'Close' : 'Menu';
    toggle.setAttribute('aria-expanded', open);
    overlay.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      overlay.classList.remove('open');
      toggle.textContent = 'Menu';
      toggle.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });
}

function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-up');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => observer.observe(el));
}

function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');

      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initBgTextParallax() {
  const bgTexts = document.querySelectorAll('.bg-text');
  if (!bgTexts.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        bgTexts.forEach(el => {
          const rect = el.parentElement.getBoundingClientRect();
          const centerY = rect.top + rect.height / 2;
          const offset = (centerY - window.innerHeight / 2) * 0.05;
          el.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
