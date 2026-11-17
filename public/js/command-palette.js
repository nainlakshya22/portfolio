/**
 * LAKSHYA® — Keyboard-Accessible Command Palette
 * Trigger: Ctrl+K / Cmd+K or header button
 */

import { showToast } from './projects.js';

export function initCommandPalette() {
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const input = document.getElementById('cmd-palette-input');
  const list = document.getElementById('cmd-palette-list');
  const triggerBtn = document.getElementById('btn-open-cmd');

  if (!backdrop || !input || !list) return;

  const COMMANDS = [
    { id: 'home', label: 'Go to Home / Hero', section: '#home', shortcut: 'H' },
    { id: 'about', label: 'About Lakshya & Philosophy', section: '#about', shortcut: 'A' },
    { id: 'work', label: 'View Selected Projects', section: '#work', shortcut: 'P' },
    { id: 'skills', label: 'View Skills & Expertise', section: '#skills', shortcut: 'S' },
    { id: 'services', label: 'Explore Web Development Services', section: '#services', shortcut: 'V' },
    { id: 'process', label: 'Our Development Process', section: '#process', shortcut: 'D' },
    { id: 'contact', label: 'Get in Touch / Request Quote', section: '#contact', shortcut: 'C' },
    { id: 'whatsapp', label: 'Chat via WhatsApp (+91 78499 95988)', action: 'open-whatsapp', shortcut: 'W' },
    { id: 'instagram', label: 'Instagram Studio (@lakshya.web)', action: 'open-insta', shortcut: 'I' },
    { id: 'theme', label: 'Toggle Light / Dark Mode', action: 'toggle-theme', shortcut: 'T' },
    { id: 'share', label: 'Copy Portfolio URL to Clipboard', action: 'copy-url', shortcut: 'U' }
  ];

  let selectedIndex = 0;
  let filteredCommands = [...COMMANDS];

  function openPalette() {
    backdrop.classList.add('open');
    input.value = '';
    filteredCommands = [...COMMANDS];
    selectedIndex = 0;
    renderList();
    setTimeout(() => input.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closePalette() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderList() {
    if (filteredCommands.length === 0) {
      list.innerHTML = `<li class="cmd-palette-item" style="color: var(--color-text-muted); cursor: default;">No matching commands found.</li>`;
      return;
    }

    list.innerHTML = filteredCommands.map((cmd, idx) => `
      <li class="cmd-palette-item ${idx === selectedIndex ? 'active' : ''}" data-idx="${idx}">
        <span>${cmd.label}</span>
        <kbd>${cmd.shortcut}</kbd>
      </li>
    `).join('');

    // Attach click listeners to list items
    list.querySelectorAll('.cmd-palette-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-idx'), 10);
        if (!isNaN(idx) && filteredCommands[idx]) {
          executeCommand(filteredCommands[idx]);
        }
      });
    });
  }

  function executeCommand(cmd) {
    closePalette();
    if (cmd.section) {
      const target = document.querySelector(cmd.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (cmd.action === 'open-whatsapp') {
      window.open('https://wa.me/917849995988?text=Hi%20Lakshya,%20I%20would%20like%20to%20discuss%20a%20web%20development%20project.', '_blank');
    } else if (cmd.action === 'open-insta') {
      window.open('https://www.instagram.com/lakshya.web/', '_blank');
    } else if (cmd.action === 'toggle-theme') {
      const toggleBtn = document.querySelector('.btn-theme-toggle');
      if (toggleBtn) toggleBtn.click();
    } else if (cmd.action === 'copy-url') {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Portfolio URL copied to clipboard.');
      });
    }
  }

  // Keyboard shortcut Ctrl+K / Cmd+K & Global Hotkeys
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (backdrop.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closePalette();
    }
  });

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openPalette);
  }

  // Backdrop click closes palette
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePalette();
  });

  // Filter input typing
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    filteredCommands = COMMANDS.filter(cmd => cmd.label.toLowerCase().includes(q));
    selectedIndex = 0;
    renderList();
  });

  // Keyboard navigation within list
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderList();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredCommands.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
        renderList();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  });
}
