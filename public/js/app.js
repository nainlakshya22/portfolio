/**
 * LAKSHYA® — Master Application Entry Point
 * Orchestrates all architectural subsystems for the luxury digital portfolio experience
 */

import { initTheme } from './theme.js';
import { initHeroScene } from './three-scene.js';
import { initProjects, closeCaseStudyModal } from './projects.js';
import { initContact } from './contact.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  const tasks = [
    { name: 'Theme', fn: initTheme },
    { name: 'Projects', fn: initProjects },
    { name: 'Hero3D', fn: initHeroScene },
    { name: 'Contact', fn: initContact },
    { name: 'Animations', fn: initAnimations },
    { name: 'MobileDrawer', fn: initMobileDrawer },
    { name: 'GlobalModals', fn: initGlobalModalHandlers }
  ];

  tasks.forEach(t => {
    try {
      t.fn();
    } catch (e) {
      console.warn(`[LAKSHYA®] Module ${t.name} initialized with fallback:`, e);
    }
  });
});

function initMobileDrawer() {
  const toggleBtn = document.getElementById('btn-mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const navLinks = drawer ? drawer.querySelectorAll('a') : [];

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

function initGlobalModalHandlers() {
  // Case study modal close button & backdrop click
  const modalBackdrop = document.getElementById('case-study-modal-backdrop');
  const modalCloseBtn = document.getElementById('case-study-modal-close');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeCaseStudyModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeCaseStudyModal();
      }
    });
  }

  // Global ESC key dismisses modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCaseStudyModal();
    }
  });
}
