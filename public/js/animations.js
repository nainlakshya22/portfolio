/**
 * LAKSHYA® — Cinematic Animation System
 * GSAP ScrollTrigger Integration with Luxury Custom Cursor & Scroll Progress
 */

export function initAnimations() {
  initCustomCursor();
  initScrollProgressAndBackToTop();
  initNavigationSpy();
  initGsapScrollReveals();
}

/**
 * Custom Luxury Cursor for Desktop Devices
 */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (!cursor || !follower) return;

  // Check if touch device
  if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
    return;
  }

  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Follower smooth spring loop
  function loop() {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    follower.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Hover states on clickable elements
  const interactiveSelectors = 'a, button, input, select, textarea, .project-card, .btn, .skill-card, .service-card, .category-filter-btn';
  document.querySelectorAll(interactiveSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/**
 * Scroll Progress Bar & Floating Back to Top Button
 */
function initScrollProgressAndBackToTop() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.querySelector('.btn-back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/**
 * Real-Time Navigation Scroll Spy
 */
function initNavigationSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/**
 * GSAP ScrollTrigger Cinematic Reveals
 */
function initGsapScrollReveals() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On mobile or reduced-motion: ALWAYS guarantee immediate 100% visibility
  // Never hide content behind ScrollTrigger on mobile touch screens
  if (isMobile || prefersReducedMotion || typeof gsap === 'undefined') {
    document.querySelectorAll('.hero-headline-wrap > *, .section-header, .project-card, .skill-card').forEach(el => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
      el.style.transform = 'none';
    });
    return;
  }

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Headline Entrance
  gsap.from('.hero-headline-wrap > *', {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    clearProps: 'all'
  });

  // Section Headers Reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all'
    });
  });

  // Project Cards Reveal
  gsap.utils.toArray('.project-card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true
      },
      y: 35,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'all'
    });
  });

  // Skills Stagger
  gsap.from('.skill-card', {
    scrollTrigger: {
      trigger: '.skills-grid',
      start: 'top 85%',
      toggleActions: 'play none none none',
      once: true
    },
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.06,
    ease: 'power2.out',
    clearProps: 'all'
  });

  // Trigger ScrollTrigger refresh once everything is loaded
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });
}
