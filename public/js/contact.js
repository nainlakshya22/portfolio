/**
 * LAKSHYA® — Production Contact & Inquiry System
 * Real validation, honeypot spam protection, transparent integration handling
 */

import { showToast } from './projects.js';

export function initContact() {
  const form = document.getElementById('contact-form');
  const serviceSelect = document.getElementById('contact-service');
  const statusAlert = document.getElementById('form-status-alert');
  const submitBtn = document.getElementById('contact-submit-btn');

  // Handle "Get a Quote" triggers from service cards
  document.querySelectorAll('.btn-inquire-service').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (!form) return;

  // Real-time validation clear on input
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (statusAlert) statusAlert.style.display = 'none';

    // Honeypot anti-spam check
    const honeypot = form.querySelector('input[name="company_website_url"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn('Bot submission blocked via honeypot.');
      return;
    }

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const business = form.querySelector('#contact-business').value.trim();
    const service = form.querySelector('#contact-service').value;
    const budget = form.querySelector('#contact-budget').value;
    const message = form.querySelector('#contact-message').value.trim();

    let hasError = false;

    // Validate Full Name
    if (name.length < 2) {
      setError('#contact-name', 'Please provide your full name.');
      hasError = true;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('#contact-email', 'Please provide a valid email address.');
      hasError = true;
    }

    // Validate Message
    if (message.length < 10) {
      setError('#contact-message', 'Please share a brief message (minimum 10 characters).');
      hasError = true;
    }

    if (hasError) return;

    // Set Loading State
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon" style="animation: spinSlow 1s linear infinite;"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
      Processing Inquiry...
    `;

    // Check for configured backend endpoint
    const backendEndpoint = form.getAttribute('data-endpoint') || '';

    if (backendEndpoint && backendEndpoint !== 'NOT_CONFIGURED') {
      try {
        const response = await fetch(backendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, business, service, budget, message })
        });

        if (response.ok) {
          form.reset();
          showStatusAlert('success', 'Thank you! Your project inquiry has been received. Lakshya will reply within 24 hours.');
        } else {
          throw new Error('Server returned an error status.');
        }
      } catch (err) {
        showStatusAlert('error', 'Network error dispatching to serverless endpoint. Preparing direct email backup...');
        openMailtoFallback(name, email, business, service, budget, message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    } else {
      // Backend not yet wired with private credentials: provide transparent honest dispatch
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        openMailtoFallback(name, email, business, service, budget, message);
        showStatusAlert('success', `Inquiry prepared! Your default mail client has opened to send to nainlakshay22@gmail.com. (To automate serverless storage, configure the FORM_ENDPOINT environment secret).`);
      }, 600);
    }
  });

  function setError(selector, message) {
    const input = form.querySelector(selector);
    if (!input) return;
    const group = input.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const errEl = group.querySelector('.form-error');
      if (errEl) errEl.textContent = message;
    }
  }

  function showStatusAlert(type, message) {
    if (!statusAlert) return;
    statusAlert.className = `form-status-alert ${type}`;
    statusAlert.textContent = message;
    statusAlert.style.display = 'block';
  }

  function openMailtoFallback(name, email, business, service, budget, message) {
    const recipient = 'nainlakshay22@gmail.com';
    const subject = encodeURIComponent(`Project Inquiry — ${service} (${name})`);
    const body = encodeURIComponent(
      `Hi Lakshya,\n\n` +
      `I would like to inquire about working together on a project.\n\n` +
      `Client Name: ${name}\n` +
      `Email: ${email}\n` +
      `Business: ${business || 'N/A'}\n` +
      `Service: ${service}\n` +
      `Budget: ${budget || 'Flexible'}\n\n` +
      `Message Details:\n${message}\n\n` +
      `Sent via LAKSHYA® Portfolio Inquiry Form`
    );
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  // WhatsApp Action Configuration
  const whatsappBtn = document.getElementById('btn-whatsapp-contact');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = whatsappBtn.getAttribute('data-phone');
      if (phone && phone !== 'PHONE_NOT_CONFIGURED') {
        const text = encodeURIComponent('Hi Lakshya, I came across your portfolio LAKSHYA® and would like to discuss a web development project.');
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      } else {
        showToast('WhatsApp Direct Chat: Please configure your active WhatsApp phone number in the repository configuration.');
      }
    });
  }

  // Resume Download Handler
  const resumeBtn = document.getElementById('btn-download-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }
}

/**
 * Honest Resume / Curriculum Vitae Modal
 */
function openResumeModal() {
  let modal = document.getElementById('resume-modal-backdrop');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'resume-modal-backdrop';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="case-study-modal" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.4rem;">Curriculum Vitae &amp; Credentials</h3>
            <p style="font-size: 0.76rem; color: var(--color-text-muted);">Lakshya Nain · Independent Freelance Web Developer</p>
          </div>
          <button class="modal-close-btn" id="resume-modal-close">✕</button>
        </div>
        <div class="modal-content-body">
          <div style="background-color: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.5rem;">
            <span class="concept-badge" style="margin-bottom: 0.8rem;">Official Developer Profile</span>
            <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Lakshya Nain</h4>
            <p style="font-size: 0.88rem; line-height: 1.6; color: var(--color-text-secondary); margin-bottom: 1rem;">
              Passionate independent web developer dedicated to building responsive, accessible, and aesthetically memorable web experiences. Specializing in semantic frontend engineering, modern CSS architectures, and interactive brand platforms.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; border-top: 1px solid var(--color-border); padding-top: 1rem; font-size: 0.84rem;">
              <div><strong>Core Stack:</strong> HTML5, CSS3, JavaScript, Responsive Web Design</div>
              <div><strong>Tooling:</strong> Git, GitHub, VS Code, Vercel Continuous Deployment</div>
              <div><strong>Status:</strong> Available for select freelance projects &amp; collaborations</div>
              <div><strong>Email:</strong> nainlakshay22@gmail.com</div>
              <div><strong>WhatsApp / Call:</strong> +91 78499 95988</div>
              <div><strong>Instagram:</strong> @lakshya.web</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <a href="mailto:nainlakshay22@gmail.com?subject=Request%20Formal%20Resume%20PDF" class="btn btn-primary btn-sm">
              Request Full PDF via Email ↗
            </a>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">Verified profile</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#resume-modal-close').addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
