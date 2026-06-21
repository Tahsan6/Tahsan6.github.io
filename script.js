/**
 * Tahsan Design — script.js
 * Handles: navbar scroll, mobile menu, gallery filter,
 *          scroll-reveal animations, back-to-top, active nav link
 */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────────── */
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

  /* ── DOM refs ─────────────────────────────────────────────── */
  const navbar    = $('#navbar');
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const backToTop  = $('#backToTop');
  const yearSpan   = $('#year');
  const navLinks   = $$('.nav-link');
  const sections   = $$('section[id], footer[id]');

  /* ── Set current year in footer ───────────────────────────── */
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ── Navbar: add .scrolled class on scroll ────────────────── */
  function onScroll () {
    const scrollY = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('scrolled', scrollY > 20);

    // Back-to-top visibility
    backToTop.classList.toggle('visible', scrollY > 400);

    // Active nav link (based on section in view)
    let currentSection = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) currentSection = section.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Mobile menu toggle ───────────────────────────────────── */
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu when a link is clicked
  $$('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Smooth scroll for all anchor links ───────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Back-to-top ──────────────────────────────────────────── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Gallery filter ───────────────────────────────────────── */
  const filterBtns  = $$('.filter-btn');
  const galleryItems = $$('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.classList.remove('hidden');
          // Animate in
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.2s ease';
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('hidden'), 200);
        }
      });
    });
  });

  /* ── Scroll-reveal with IntersectionObserver ──────────────── */
  // Add .reveal class to elements we want to animate in
  const revealTargets = [
    ...$$('.service-card'),
    ...$$('.gallery-item'),
    ...$$('.step'),
    ...$$('.ab-card'),
    ...$$('.stat'),
    ...$$('.about-quote-bubble'),
  ];

  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Section eyebrow / title reveal ──────────────────────── */
  $$('.section-header').forEach(header => {
    header.style.opacity = '0';
    header.style.transform = 'translateY(24px)';
    header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          header.style.opacity = '1';
          header.style.transform = 'translateY(0)';
        }
      },
      { threshold: 0.2 }
    ).observe(header);
  });

  /* ── Service card colour accent on hover (extra polish) ────── */
  $$('.service-card').forEach(card => {
    const colorMap = {
      green : 'rgba(45,184,75,.06)',
      blue  : 'rgba(30,92,179,.06)',
      red   : 'rgba(230,51,41,.06)',
      orange: 'rgba(245,130,31,.06)',
    };
    const color = card.dataset.color;
    card.addEventListener('mouseenter', () => {
      card.style.backgroundColor = colorMap[color] || '';
    });
    card.addEventListener('mouseleave', () => {
      card.style.backgroundColor = '';
    });
  });

  /* ── Ticker pause on hover ────────────────────────────────── */
  const tickerTrack = $('.ticker-track');
  if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  /* ── Cycling service showcase ───────────────────────────────── */
  const services = [
    'Business Cards', 'Banners', 'Brochures', 'Calendars',
    'Diaries', 'Hang Tags', 'Letterhead Pads', 'Packaging',
    'Posters', 'Stickers', 'Magazines', 'Book Covers',
    'Flyers', 'DVD Covers', 'Labels', 'Invitation Cards'
  ];
  const cycleText = document.getElementById('cycleText');
  const cycleDots = document.getElementById('cycleDots');

  if (cycleText && cycleDots) {
    // Build dots
    services.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'cdot' + (i === 0 ? ' active' : '');
      cycleDots.appendChild(dot);
    });

    let current = 0;
    const dots = cycleDots.querySelectorAll('.cdot');

    // Color palette cycling
    const colors = ['#2DB84B','#1E5CB3','#E63329','#F5821F','#1a8a35','#154285','#b01f1a','#c05e0f'];

    setInterval(() => {
      cycleText.style.opacity = '0';
      cycleText.style.transform = 'translateY(12px)';
      dots[current].classList.remove('active');
      current = (current + 1) % services.length;

      setTimeout(() => {
        cycleText.textContent = services[current];
        cycleText.style.color = colors[current % colors.length];
        cycleText.style.opacity = '1';
        cycleText.style.transform = 'translateY(0)';
        dots[current].classList.add('active');
      }, 350);
    }, 2200);
  }

})();
