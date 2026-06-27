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

  /* ── Section header reveal (class-based) ─────────────────── */
  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          headerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$('.section-header').forEach(h => headerObserver.observe(h));

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
  const cycleTextMobile = document.getElementById('cycleTextMobile');
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
      if (cycleTextMobile) { cycleTextMobile.style.opacity = '0'; cycleTextMobile.style.transform = 'translateY(12px)'; }
      cycleText.style.transform = 'translateY(12px)';
      dots[current].classList.remove('active');
      current = (current + 1) % services.length;

      setTimeout(() => {
        cycleText.textContent = services[current];
        if (cycleTextMobile) { cycleTextMobile.textContent = services[current]; cycleTextMobile.style.color = colors[current % colors.length]; cycleTextMobile.style.opacity = '1'; cycleTextMobile.style.transform = 'translateY(0)'; }
        cycleText.style.color = colors[current % colors.length];
        cycleText.style.opacity = '1';
        cycleText.style.transform = 'translateY(0)';
        dots[current].classList.add('active');
      }, 350);
    }, 2200);
  }

})();

/**
 * ── Lightbox gallery ──────────────────────────────────────────
 * Each category maps to an array of photo URLs.
 * Replace the placeholder arrays below with real photo paths
 * once uploaded, e.g. 'images/business-card-1.jpg'
 */
(function () {
  'use strict';

  const galleryData = {
    'business-card': [
      'images/mockups/business-card/visiting%20card%201.webp',
      'images/mockups/business-card/visiting%20card%202.webp',
      'images/mockups/business-card/visiting%20card%203.webp',
      'images/mockups/business-card/visiting%20card%204.webp'
    ],
    'calendar': [
      'images/mockups/calendar/desk%20calendar.webp',
      'images/mockups/calendar/wall%20calendar%201.webp',
      'images/mockups/calendar/wall%20calendar%202.webp',
      'images/mockups/calendar/wall%20calendar%203.webp',
      'images/mockups/calendar/wall%20calendar%204.webp',
      'images/mockups/calendar/wall%20calendar%205.webp',
      'images/mockups/calendar/wall%20calendar%206.webp'
    ],
    'brochure': [
      'images/mockups/brochure/brochure%201.webp',
      'images/mockups/brochure/brochure%202.webp',
      'images/mockups/brochure/brochure%203.webp',
      'images/mockups/brochure/brochure%204.webp',
      'images/mockups/brochure/brochure%205.webp'
    ],
    'diary': [
      'images/mockups/diaries/diary%201.webp'
    ],
    'letterhead': [
      'images/mockups/pads/letterhead%20pad%201.webp',
      'images/mockups/pads/letterhead%20pad%202.webp',
      'images/mockups/pads/letterhead%20pad%203.webp',
      'images/mockups/pads/letterhead%20pad%204.webp',
      'images/mockups/pads/letterhead%20pad%205.webp',
      'images/mockups/pads/letterhead%20pad%206.webp',
      'images/mockups/pads/letterhead%20pad%207.webp'
    ],
    'envelope': [
      'images/mockups/envelope/Envelope%201.webp',
      'images/mockups/envelope/Envelope%202.webp',
      'images/mockups/envelope/Envelope%203.webp'
    ],
    'leaflet': [
      'images/mockups/leaflet/leaflet%201.webp',
      'images/mockups/leaflet/leaflet%202.webp'
    ],
    'banner': [
      'images/mockups/banner/banner%201.webp',
      'images/mockups/banner/banner%202.webp'
    ]
  };

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  let currentCat = null;
  let currentIndex = 0;

  function openLightbox(cat) {
    const photos = galleryData[cat];
    if (!photos || photos.length === 0) return;
    currentCat = cat;
    currentIndex = 0;
    showPhoto();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.classList.remove('zoomed');
  }

  function showPhoto() {
    const photos = galleryData[currentCat];
    lightboxImg.src = photos[currentIndex];
    lightboxImg.classList.remove('zoomed');
    lightboxCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
  }

  function nextPhoto() {
    const photos = galleryData[currentCat];
    currentIndex = (currentIndex + 1) % photos.length;
    showPhoto();
  }

  function prevPhoto() {
    const photos = galleryData[currentCat];
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    showPhoto();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.cat;
      openLightbox(cat);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextPhoto);
  lightboxPrev.addEventListener('click', prevPhoto);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  lightboxImg.addEventListener('click', () => {
    lightboxImg.classList.toggle('zoomed');
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50 && !lightboxImg.classList.contains('zoomed')) {
      if (diff > 0) prevPhoto();
      else nextPhoto();
    }
  }, { passive: true });

})();
