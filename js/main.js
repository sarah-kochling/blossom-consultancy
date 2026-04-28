/* =============================================
   BLOSSOM CONSULTANCY — Main App
   ============================================= */

'use strict';

// ─── Router ────────────────────────────────────
const Router = (() => {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav__menu-link');

  function show(pageId) {
    // Hide all pages
    pages.forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Update nav link active states
    navLinks.forEach(link => {
      const linkPage = link.dataset.page;
      link.classList.toggle('active', linkPage === pageId);
    });

    // Update document title for SEO / UX
    const titles = {
      'page-home':    'Blossom Consultancy — Consumer Insights & Innovation',
      'page-contact': 'Contact Us — Blossom Consultancy',
    };
    document.title = titles[pageId] || 'Blossom Consultancy';

    // Update URL hash for shareability (no full reload)
    const hashes = { 'page-home': '#home', 'page-contact': '#contact' };
    history.pushState({ page: pageId }, '', hashes[pageId] || '#home');

    // Trigger reveals on new page
    setTimeout(() => RevealObserver.scan(), 100);
  }

  function init() {
    // Listen for nav link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        show(pageId);
        Nav.close();
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
      const pageId = e.state?.page || 'page-home';
      show(pageId);
    });

    // Initial load: check hash
    const hash = window.location.hash;
    const initial = hash === '#contact' ? 'page-contact' : 'page-home';
    show(initial);
  }

  return { init, show };
})();


// ─── Navigation ────────────────────────────────
const Nav = (() => {
  const nav     = document.getElementById('mainNav');
  const burger  = document.getElementById('navBurger');

  let isOpen = false;

  function open() {
    isOpen = true;
    nav.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;
    nav.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function isDesktop() {
    return window.matchMedia('(min-width: 768px)').matches;
  }

  function init() {
    // Scroll shadow
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    // Burger toggle — only relevant on mobile
    burger.addEventListener('click', () => {
      if (!isDesktop()) toggle();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen && !isDesktop()) close();
    });

    // Close on overlay click (outside menu list) — mobile only
    document.getElementById('navMenu')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget && !isDesktop()) close();
    });

    // On resize to desktop, ensure overlay is dismissed
    window.addEventListener('resize', () => {
      if (isDesktop() && isOpen) close();
    }, { passive: true });
  }

  return { init, open, close, toggle };
})();


// ─── Reveal on Scroll ───────────────────────────
const RevealObserver = (() => {
  let observer = null;

  function scan() {
    const elements = document.querySelectorAll('.reveal:not(.visible)');
    elements.forEach(el => observer?.observe(el));
  }

  function init() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    scan();
  }

  return { init, scan };
})();


// ─── Hero Effect ───────────────────────────────
const HeroEffect = (() => {
  function init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Trigger subtle zoom-out on load
    requestAnimationFrame(() => {
      setTimeout(() => hero.classList.add('loaded'), 50);
    });
  }

  return { init };
})();


// ─── Init ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  Router.init();
  RevealObserver.init();
  HeroEffect.init();
});
