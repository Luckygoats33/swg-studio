document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initCarousel();
  initAccordions();
  initSplitText();
  initScrollReveal();
  initStaggerReveal();
  initClientLogoReveal();
  initCounters();
  initCustomCursor();
  initMagneticButtons();
  initParallax();
  initVideoBreaks();
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

function initSplitText() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.split-text').forEach(el => {
    if (el.querySelector('span, a, strong, em')) return;
    const text = el.textContent;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    el.innerHTML = words.map((word, i) => {
      return `<span class="word"><span class="word-inner" style="transition-delay: ${i * 0.04}s">${word}</span></span>`;
    }).join('');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.split-text').forEach(el => observer.observe(el));
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

function initStaggerReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.stagger-item').forEach(el => el.classList.add('visible'));
    return;
  }

  const groups = new Map();
  document.querySelectorAll('.stagger-item').forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  groups.forEach((items) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = items.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 120);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    items.forEach(el => observer.observe(el));
  });
}

function initClientLogoReveal() {
  const logos = document.querySelectorAll('.client-logo');
  if (!logos.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    logos.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const allLogos = Array.from(entry.target.parentElement.children);
        const idx = allLogos.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  logos.forEach(el => observer.observe(el));
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

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 769) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let cx = -100, cy = -100;
  let fx = -100, fy = -100;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function animateFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a, button, .carousel-btn, .work-card, .checkbox-item, .radio-item, .submit-btn, .floating-pill, .hero-cta-round';

  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.add('hidden');
    follower.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    cursor.classList.remove('hidden');
    follower.classList.remove('hidden');
  });
}

function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });

  const roundBtn = document.querySelector('.hero-cta-round');
  if (roundBtn) {
    roundBtn.addEventListener('mousemove', (e) => {
      const rect = roundBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      roundBtn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.1)`;
    });
    roundBtn.addEventListener('mouseleave', () => {
      roundBtn.style.transform = '';
      roundBtn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s';
      setTimeout(() => { roundBtn.style.transition = ''; }, 400);
    });
  }
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  function onScroll() {
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const rect = el.getBoundingClientRect();
      const viewCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const offset = (elCenter - viewCenter) * speed;
      const video = el.querySelector('.video-break-media');
      if (video) {
        video.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initVideoBreaks() {
  const videos = document.querySelectorAll('.video-break-media');
  if (!videos.length) return;

  videos.forEach(v => {
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(v => observer.observe(v));

  const heroVideo = document.querySelector('.hero-video-bg video');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.loop = true;
    heroVideo.play().catch(() => {});
  }
}
