/**
 * LAKSHYA® — Project Showcase & Case Study Engine
 * Authentic representation of self-initiated concept projects with real-time search, filters & detailed case studies
 */

export const PROJECTS_DATA = [
  {
    id: 'glitter-bean-cafe',
    title: 'Glitter Bean Café',
    category: 'Café & Restaurant',
    categorySlug: 'cafe-restaurant',
    year: '2026',
    isConcept: true,
    tagline: 'A modern café website concept designed to create a premium digital presence and engaging customer experience.',
    liveUrl: 'https://git-cafe-nine.vercel.app/',
    image: 'public/images/project-glitter-bean.svg',
    tags: ['HTML5', 'Modern CSS', 'Responsive Design', 'JavaScript', 'Vercel Deployment'],
    featured: true,
    caseStudy: {
      headline: 'Artisanal Coffee & Mindful Hospitality in the Digital Space',
      overview: 'Glitter Bean Café is a self-initiated concept website designed to explore how high-end culinary hospitality brands can translate physical sensory warmth into a digital storefront.',
      conceptAndInspiration: 'Inspired by minimalist Scandinavian coffee houses and Japanese tea salons, the design centers around serene whitespace, gentle cream-and-espresso palettes, and quiet typography.',
      businessObjectives: [
        'Craft an inviting digital identity that differentiates the café from generic local competitors.',
        'Ensure the seasonal menu is effortless to navigate on mobile devices for on-the-go patrons.',
        'Establish clear calls-to-action for table reservations and seasonal bean subscriptions.'
      ],
      designDirection: 'The visual direction combines an ivory canvas (#F5F0E8) with roasted coffee tones (#8D6840 and #171512). Classic serif headings evoke artisanal heritage while modern geometric sans ensures clean legibility.',
      uxDecisions: [
        'Streamlined single-scroll layout that tells a cohesive story from bean sourcing to seating.',
        'Accessible menu categorization with clear dietary markers and high-contrast pricing.',
        'Sticky quick-actions optimized for one-thumb mobile interaction.'
      ],
      developmentProcess: 'Developed using semantic HTML5 and modern CSS custom properties with CSS Grid for layout flexibility. Deployed via continuous delivery on Vercel for instantaneous global caching.',
      technologiesUsed: ['HTML5', 'CSS3 (Custom Properties & Grid)', 'Vanilla JavaScript', 'Vercel Edge Network', 'SVG Vector Graphics'],
      challengesAndSolutions: [
        {
          challenge: 'Maintaining instant page loads with rich editorial layouts.',
          solution: 'Utilized inline SVG vector artwork and modern CSS clamp() units to eliminate heavy external assets and achieve zero layout shifts.'
        },
        {
          challenge: 'Achieving consistent typography across diverse operating systems.',
          solution: 'Created a resilient typography stack prioritizing modern system fonts paired with web-optimized editorial serifs.'
        }
      ]
    }
  },
  {
    id: 'listen-rooms-coffee',
    title: 'Listen Rooms Coffee',
    category: 'Creative Concepts',
    categorySlug: 'creative-concepts',
    year: '2026',
    isConcept: true,
    tagline: 'A creative website concept inspired by a listening café experience, combining coffee culture, music and distinctive visual storytelling.',
    liveUrl: 'https://aashu-smoky.vercel.app/',
    image: 'public/images/project-aashu-smoky.svg',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Audio-Inspired UX', 'Brand Storytelling', 'Vercel'],
    featured: true,
    caseStudy: {
      headline: 'The Tactile Symphony of Hi-Fi Acoustics & Espresso Culture',
      overview: 'Listen Rooms Coffee is a self-initiated concept celebrating the timeless Japanese jazz-kissa culture: a tranquil venue where patrons gather for analog soundscapes, curated vinyl spins, and smoked specialty brews.',
      conceptAndInspiration: 'Inspired by analog audio equipment, vinyl record grooves, warm vacuum tube amplifiers, and smoky late-night lounge atmospheres.',
      businessObjectives: [
        'Immerse visitors in an atmospheric brand universe that feels intimate, curated, and culturally resonant.',
        'Showcase the daily spinning record archive and specialty single-origin roast pairings.',
        'Demonstrate how interactive frontend architecture can evoke sensory ambiance.'
      ],
      designDirection: 'A rich noir palette anchored in deep charcoal (#171512), champagne amber (#C5A16A), and warm cedarwood. Micro-textures and concentric ring geometry mirror 33⅓ RPM vinyl discs.',
      uxDecisions: [
        'Moody dark mode presentation designed to emulate a dimly lit listening lounge.',
        'Interactive vinyl spinning visual cues that respond to user engagement.',
        'Curated "Now Spinning" tracklist and listening session timetable.'
      ],
      developmentProcess: 'Engineered with clean vanilla JavaScript to coordinate interactive states without the overhead of heavy client libraries. Built with responsive layout breakpoints ensuring flawless rendering from mobile phones to 4K displays.',
      technologiesUsed: ['HTML5 Semantic Structure', 'CSS3 Animations & Transforms', 'Vanilla JavaScript State Management', 'Vercel Deployment'],
      challengesAndSolutions: [
        {
          challenge: 'Conveying sonic and analog ambiance purely through visual web design.',
          solution: 'Designed bespoke vinyl record SVG graphics with subtle rotational animations and warm amber lighting gradients that evoke tube amplification.'
        },
        {
          challenge: 'Maintaining accessible color contrast on dark noir surfaces.',
          solution: 'Audited all text elements against WCAG AAA standards, utilizing #F5F0E8 ivory and #DFC79E champagne gold text on charcoal backdrops.'
        }
      ]
    }
  }
];

export function initProjects() {
  const container = document.getElementById('projects-list-container');
  const searchInput = document.getElementById('project-search-input');
  const sortSelect = document.getElementById('project-sort-select');
  const categoryFilters = document.querySelectorAll('.category-filter-btn');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  const emptyState = document.getElementById('projects-empty-state');

  if (!container) return;

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';

  // Render Category Counts
  updateCategoryCounts();

  function updateCategoryCounts() {
    const allCount = PROJECTS_DATA.length;
    const cafeCount = PROJECTS_DATA.filter(p => p.categorySlug === 'cafe-restaurant').length;
    const creativeCount = PROJECTS_DATA.filter(p => p.categorySlug === 'creative-concepts').length;

    const allBadge = document.querySelector('[data-category="all"] .count-badge');
    const cafeBadge = document.querySelector('[data-category="cafe-restaurant"] .count-badge');
    const creativeBadge = document.querySelector('[data-category="creative-concepts"] .count-badge');

    if (allBadge) allBadge.textContent = `(${allCount})`;
    if (cafeBadge) cafeBadge.textContent = `(${cafeCount})`;
    if (creativeBadge) creativeBadge.textContent = `(${creativeCount})`;
  }

  function getFilteredProjects() {
    let list = [...PROJECTS_DATA];

    // Filter by Category
    if (currentCategory !== 'all') {
      list = list.filter(item => item.categorySlug === currentCategory);
    }

    // Filter by Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (currentSort === 'newest') {
      list.sort((a, b) => b.year.localeCompare(a.year));
    } else if (currentSort === 'oldest') {
      list.sort((a, b) => a.year.localeCompare(b.year));
    } else if (currentSort === 'featured') {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }

  function renderProjects() {
    const filtered = getFilteredProjects();

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(project => `
      <article class="project-card" data-project-id="${project.id}">
        <div class="project-media-col">
          <img src="${project.image}" alt="${project.title} Preview" class="browser-mockup" loading="lazy">
        </div>
        <div class="project-info-col">
          <div>
            <div class="project-header-meta">
              <span class="concept-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Self-Initiated Concept Project
              </span>
              <span class="tech-tag">${project.category} · ${project.year}</span>
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.tagline}</p>
            <div class="project-tags-list">
              ${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>
          <div class="project-actions">
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              View Live Website
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </a>
            <button class="btn btn-secondary btn-sm btn-open-case-study" data-id="${project.id}">
              Explore Case Study
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm btn-share-project" data-title="${project.title}" data-url="${project.liveUrl}" title="Share project link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    attachCardEventListeners();
  }

  function attachCardEventListeners() {
    // Open Case Study
    container.querySelectorAll('.btn-open-case-study').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const project = PROJECTS_DATA.find(p => p.id === id);
        if (project) openCaseStudyModal(project);
      });
    });

    // Share Project
    container.querySelectorAll('.btn-share-project').forEach(btn => {
      btn.addEventListener('click', async () => {
        const title = btn.getAttribute('data-title');
        const url = btn.getAttribute('data-url');
        shareProjectLink(title, url);
      });
    });
  }

  // Event Listeners for Filters
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProjects();
    });
  }

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      currentCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      categoryFilters.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });
      renderProjects();
    });
  }

  // Initial render
  renderProjects();
}

/**
 * Case Study Modal Controller
 */
export function openCaseStudyModal(project) {
  const modalBackdrop = document.getElementById('case-study-modal-backdrop');
  const modalBody = document.getElementById('case-study-modal-content');
  if (!modalBackdrop || !modalBody) return;

  const cs = project.caseStudy;

  modalBody.innerHTML = `
    <div class="case-study-hero">
      <div class="project-header-meta">
        <span class="concept-badge">Self-Initiated Concept Project</span>
        <span class="tech-tag">${project.category} · ${project.year}</span>
      </div>
      <h2 class="display-title" style="font-size: clamp(2rem, 3.5vw, 3rem); margin: 0.5rem 0 1rem;">${project.title}</h2>
      <p class="lead-text" style="font-size: 1.15rem; color: var(--color-accent-gold-dark);">${cs.headline}</p>
    </div>

    <div class="case-study-preview-image">
      <img src="${project.image}" alt="${project.title} Detailed Architecture" style="width: 100%; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
    </div>

    <div class="case-study-section">
      <h3 class="section-label">01. Project Overview &amp; Inspiration</h3>
      <p style="margin-bottom: 1rem;">${cs.overview}</p>
      <p>${cs.conceptAndInspiration}</p>
    </div>

    <div class="case-study-section">
      <h3 class="section-label">02. Core Business Objectives</h3>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
        ${cs.businessObjectives.map(obj => `<li style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: var(--color-accent-gold); font-size: 0.8rem; margin-top: 5px;">✦</span><span>${obj}</span></li>`).join('')}
      </ul>
    </div>

    <div class="case-study-section">
      <h3 class="section-label">03. Design Direction &amp; Visual Identity</h3>
      <p>${cs.designDirection}</p>
    </div>

    <div class="case-study-section">
      <h3 class="section-label">04. User Experience &amp; Architecture</h3>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem;">
        ${cs.uxDecisions.map(d => `<li style="display: flex; gap: 10px; align-items: flex-start;"><span style="color: var(--color-accent-gold); font-size: 0.8rem; margin-top: 5px;">✦</span><span>${d}</span></li>`).join('')}
      </ul>
    </div>

    <div class="case-study-section">
      <h3 class="section-label">05. Development &amp; Technologies Used</h3>
      <p style="margin-bottom: 1rem;">${cs.developmentProcess}</p>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${cs.technologiesUsed.map(t => `<span class="tech-tag" style="padding: 0.4rem 0.8rem;">${t}</span>`).join('')}
      </div>
    </div>

    <div class="case-study-section">
      <h3 class="section-label">06. Real Challenges &amp; Technical Solutions</h3>
      <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.5rem;">
        ${cs.challengesAndSolutions.map(item => `
          <div style="background-color: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.25rem;">
            <p style="font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.4rem;">Challenge: ${item.challenge}</p>
            <p style="font-size: 0.88rem; color: var(--color-text-secondary);">Solution: ${item.solution}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="case-study-footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        Launch Live Website
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </a>
      <button class="btn btn-secondary" id="modal-close-action-btn">Close Case Study</button>
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('modal-close-action-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCaseStudyModal);
}

export function closeCaseStudyModal() {
  const modalBackdrop = document.getElementById('case-study-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Web Share API with Fallback
 */
export async function shareProjectLink(title, url) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `LAKSHYA® — ${title}`,
        text: `Explore the ${title} concept project by independent web developer Lakshya.`,
        url: url
      });
      return;
    } catch (err) {
      // User cancelled share or failed, fall back to copy
    }
  }

  // Fallback: Copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    showToast(`Link copied to clipboard: ${url}`);
  } catch (err) {
    showToast(`Project link: ${url}`);
  }
}

export function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
