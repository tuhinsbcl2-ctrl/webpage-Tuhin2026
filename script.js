/**
 * Artha Sathi Advisory — script.js
 * Handles: sticky navbar, mobile menu, smooth scroll, scroll reveal, contact form validation, back-to-top
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. DOM References
  ───────────────────────────────────────────── */
  const header      = document.getElementById('header');
  const navToggle   = document.getElementById('navToggle');
  const navMenu     = document.getElementById('navMenu');
  const navLinks    = navMenu ? navMenu.querySelectorAll('.nav-link') : [];
  const backToTop   = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ─────────────────────────────────────────────
     2. Sticky Navbar + Active Link on Scroll
  ───────────────────────────────────────────── */
  const SCROLL_THRESHOLD = 80;
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Sticky header style */
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    /* Back-to-top visibility */
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    /* Active nav link based on section in viewport */
    let currentSection = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─────────────────────────────────────────────
     3. Mobile Menu Toggle
  ───────────────────────────────────────────── */
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close menu when a nav link is clicked */
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ─────────────────────────────────────────────
     4. Scroll Reveal Animation
  ───────────────────────────────────────────── */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  var CARDS_PER_ROW = 4;   // maximum columns in the widest grid
  var STAGGER_DELAY = 0.08; // seconds between each card's reveal

  document.querySelectorAll('.reveal').forEach(function (el, index) {
    /* Stagger reveal for cards in the same parent */
    el.style.transitionDelay = (index % CARDS_PER_ROW) * STAGGER_DELAY + 's';
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────
     5. Back to Top
  ───────────────────────────────────────────── */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────────
     6. Contact Form Validation
  ───────────────────────────────────────────── */
  if (contactForm) {
    var nameInput    = document.getElementById('name');
    var emailInput   = document.getElementById('email');
    var messageInput = document.getElementById('message');
    var nameError    = document.getElementById('nameError');
    var emailError   = document.getElementById('emailError');
    var messageError = document.getElementById('messageError');

    function showError(input, errorEl, message) {
      input.classList.add('error');
      errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.classList.remove('error');
      errorEl.textContent = '';
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Real-time clearing of errors */
    if (nameInput)    nameInput.addEventListener('input', function () { clearError(nameInput, nameError); });
    if (emailInput)   emailInput.addEventListener('input', function () { clearError(emailInput, emailError); });
    if (messageInput) messageInput.addEventListener('input', function () { clearError(messageInput, messageError); });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      /* Clear previous success */
      if (formSuccess) formSuccess.textContent = '';

      /* Validate name */
      if (nameInput && nameInput.value.trim().length < 2) {
        showError(nameInput, nameError, 'Please enter your full name.');
        valid = false;
      }

      /* Validate email */
      if (emailInput && !validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        valid = false;
      }

      /* Validate message */
      if (messageInput && messageInput.value.trim().length < 10) {
        showError(messageInput, messageError, 'Please enter a message (at least 10 characters).');
        valid = false;
      }

      if (!valid) return;

      /* Simulate form submission */
      var submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending…';
      }

      setTimeout(function () {
        if (formSuccess) {
          formSuccess.textContent = '✅ Thank you! Your message has been received. We will get back to you shortly.';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
      }, 1500);
    });
  }

  /* ─────────────────────────────────────────────
     7. Smooth scroll polyfill for browsers that
        don't support CSS scroll-behavior
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

})();
