document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initCarousel();
  initAccordions();
  initScrollReveal();
  initCounters();
});

function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });
}

function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = menu.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    menu.classList.toggle('active', isActive);
    menu.setAttribute('aria-hidden', !isActive);
    toggle.setAttribute('aria-expanded', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const currentEl = document.getElementById('carousel-current');
  const totalEl = document.getElementById('carousel-total');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;

  totalEl.textContent = String(total).padStart(2, '0');

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    currentEl.textContent = String(current + 1).padStart(2, '0');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  let autoplay = setInterval(() => goTo(current + 1), 6000);
  track.closest('.carousel-section').addEventListener('mouseenter', () => clearInterval(autoplay));
  track.closest('.carousel-section').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 6000);
  });
}

function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      const parent = trigger.closest('.accordion');
      parent.querySelectorAll('.accordion-trigger').forEach(t => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.classList.remove('open');
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      }
    });
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-up, .reveal-text');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
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
        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        function tick() {
          current = Math.min(current + step, target);
          el.textContent = Math.round(current) + suffix;
          if (current < target) requestAnimationFrame(tick);
        }
        tick();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}
