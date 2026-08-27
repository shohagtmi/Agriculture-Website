/**
 * কৃষি বাংলাদেশ — Agriculture BD
 * Shared JavaScript
 * js/main.js
 *
 * Works with GitHub Pages static hosting.
 * No frameworks, no dependencies — vanilla JS only.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     1. Mobile Navigation — hamburger open / close
  ───────────────────────────────────────────────────────── */
  function initMobileNav() {
    var hamburger = document.querySelector('.nav-hamburger');
    var mobileNav = document.querySelector('.nav-mobile');
    if (!hamburger || !mobileNav) return;

    function openMenu() {
      mobileNav.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'মেনু বন্ধ করুন');
    }

    function closeMenu() {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'মেনু খুলুন');
    }

    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a nav link is tapped
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside the nav
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('open') &&
        !hamburger.contains(e.target) &&
        !mobileNav.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     2. Active Nav Link
     Reads the current page filename and marks matching
     links in both desktop (.nav-links) and mobile (.nav-mobile).
  ───────────────────────────────────────────────────────── */
  function setActiveNavLink() {
    var path     = window.location.pathname;
    // last segment, e.g. "krishi-rin.html" or "" / "/"
    var filename = path.split('/').pop() || '';

    // Treat root path, empty string, and index.html all as "home"
    var isHome = (filename === '' || filename === 'index.html');

    document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(function (link) {
      var href     = (link.getAttribute('href') || '').split('/').pop();
      var linkHome = (href === '' || href === 'index.html');

      var match = (isHome && linkHome) || (!isHome && href && href === filename);

      if (match) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────
     3. FAQ Accordion
     Expects this HTML pattern per question:
       <div class="faq-item">
         <button class="faq-q">
           প্রশ্ন
           <span class="faq-icon" aria-hidden="true">+</span>
         </button>
         <div class="faq-a">উত্তর</div>
       </div>
  ───────────────────────────────────────────────────────── */
  function initFAQ() {
    var buttons = document.querySelectorAll('.faq-q');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var answer = btn.nextElementSibling;
        if (!answer || !answer.classList.contains('faq-a')) return;

        var isOpen = answer.classList.contains('open');

        // Close all open items first
        document.querySelectorAll('.faq-q').forEach(function (q) {
          var a  = q.nextElementSibling;
          var ic = q.querySelector('.faq-icon');
          if (a)  a.classList.remove('open');
          q.classList.remove('open');
          q.setAttribute('aria-expanded', 'false');
          if (ic) ic.textContent = '+';
        });

        // If clicked item was closed, open it
        if (!isOpen) {
          answer.classList.add('open');
          btn.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          var icon = btn.querySelector('.faq-icon');
          if (icon) icon.textContent = '×';
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     4. Smooth scroll for in-page anchor links (#section)
  ───────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id     = anchor.getAttribute('href');
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────
     5. Auto-generate breadcrumb
     Usage — add to any page:
       <nav class="breadcrumb"
            data-auto="true"
            data-crumbs="Home,কৃষি ঋণ"
            data-hrefs="index.html,">
       </nav>
     Last item has an empty href → rendered as plain text.
  ───────────────────────────────────────────────────────── */
  function initBreadcrumb() {
    var bc = document.querySelector('.breadcrumb[data-auto="true"]');
    if (!bc) return;

    var labels = (bc.dataset.crumbs || '').split(',');
    var hrefs  = (bc.dataset.hrefs  || '').split(',');
    var parts  = [];

    labels.forEach(function (label, i) {
      label = label.trim();
      var href = (hrefs[i] || '').trim();
      if (href) {
        parts.push('<a href="' + href + '">' + label + '</a>');
      } else {
        parts.push('<span aria-current="page">' + label + '</span>');
      }
    });

    bc.innerHTML = parts.join(' <span aria-hidden="true">›</span> ');
  }

  /* ─────────────────────────────────────────────────────────
     6. Footer — current year
     Usage: <span id="footer-year"></span> in footer
  ───────────────────────────────────────────────────────── */
  function setCurrentYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ─────────────────────────────────────────────────────────
     7. Contact form — basic client-side validation
     Usage: <form class="js-contact-form"> with
       <input name="name">  and  <textarea name="message">
     Replace the alert() with a real backend / Formspree call.
  ───────────────────────────────────────────────────────── */
  function initContactForm() {
    var form = document.querySelector('.js-contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameEl    = form.querySelector('[name="name"]');
      var messageEl = form.querySelector('[name="message"]');

      if (!nameEl || !nameEl.value.trim()) {
        alert('আপনার নাম লিখুন।');
        if (nameEl) nameEl.focus();
        return;
      }
      if (!messageEl || !messageEl.value.trim()) {
        alert('আপনার বার্তা লিখুন।');
        if (messageEl) messageEl.focus();
        return;
      }

      // ── Replace below with your actual form handler ──────
      // e.g. fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) })
      alert('বার্তা পাঠানো হয়েছে! ধন্যবাদ।');
      form.reset();
    });
  }

  /* ─────────────────────────────────────────────────────────
     Init — run everything after DOM is ready
  ───────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    setActiveNavLink();
    initFAQ();
    initSmoothScroll();
    initBreadcrumb();
    setCurrentYear();
    initContactForm();
  });

})();
