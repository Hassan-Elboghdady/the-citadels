/* ==========================================================================
   The Citadels — Main JavaScript
   Cookie consent, mobile navigation, form validation
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Cookie Consent ---------- */
  function initCookieConsent() {
    var banner = document.getElementById('cookie-consent');
    var acceptBtn = document.getElementById('cookie-accept');
    var declineBtn = document.getElementById('cookie-decline');

    if (!banner) return;

    var consent = localStorage.getItem('cookie_consent');

    if (!consent) {
      // Small delay so the banner slides up smoothly after page load
      setTimeout(function () {
        banner.classList.add('cookie-consent--visible');
      }, 800);
    }

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'accepted');
        banner.classList.remove('cookie-consent--visible');
        // If Google Analytics is configured, it would be initialized here
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'declined');
        banner.classList.remove('cookie-consent--visible');
      });
    }
  }

  /* ---------- Mobile Navigation ---------- */
  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('site-nav');
    var overlay = document.getElementById('nav-overlay');

    if (!toggle || !nav) return;

    function openNav() {
      nav.classList.add('site-nav--open');
      toggle.setAttribute('aria-expanded', 'true');
      if (overlay) overlay.classList.add('nav-overlay--visible');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      nav.classList.remove('site-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      if (overlay) overlay.classList.remove('nav-overlay--visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeNav);
    }

    // Close nav on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    // Close nav when a link is clicked
    var navLinks = nav.querySelectorAll('.site-nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ---------- Form Validation ---------- */
  function initFormValidation() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var fields = [
      {
        input: document.getElementById('contact-name'),
        error: document.getElementById('contact-name-error'),
        message: 'Please enter your full name.'
      },
      {
        input: document.getElementById('contact-phone'),
        error: document.getElementById('contact-phone-error'),
        message: 'Please enter a valid phone number.'
      },
      {
        input: document.getElementById('contact-email-input'),
        error: document.getElementById('contact-email-error'),
        message: 'Please enter a valid email address.'
      },
      {
        input: document.getElementById('contact-inquiry'),
        error: document.getElementById('contact-inquiry-error'),
        message: 'Please select an inquiry type.'
      },
      {
        input: document.getElementById('contact-message'),
        error: document.getElementById('contact-message-error'),
        message: 'Please enter your message.'
      },
      {
        input: document.getElementById('contact-consent'),
        error: document.getElementById('contact-consent-error'),
        message: 'You must agree to the privacy policy to send this inquiry.'
      }
    ];

    function showError(field) {
      if (field.error) {
        field.error.textContent = field.message;
      }
      if (field.input) {
        field.input.setAttribute('aria-invalid', 'true');
        field.input.style.borderColor = 'var(--color-error)';
      }
    }

    function clearError(field) {
      if (field.error) {
        field.error.textContent = '';
      }
      if (field.input) {
        field.input.removeAttribute('aria-invalid');
        field.input.style.borderColor = '';
      }
    }

    function validateField(field) {
      if (!field.input) return true;

      var value = field.input.value;
      var type = field.input.type;
      var tagName = field.input.tagName.toLowerCase();

      // Checkbox validation
      if (type === 'checkbox') {
        if (!field.input.checked) {
          showError(field);
          return false;
        }
        clearError(field);
        return true;
      }

      // Select validation
      if (tagName === 'select') {
        if (!value) {
          showError(field);
          return false;
        }
        clearError(field);
        return true;
      }

      // Empty check
      if (!value.trim()) {
        showError(field);
        return false;
      }

      // Email validation
      if (type === 'email') {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          showError(field);
          return false;
        }
      }

      // Phone validation (basic: at least 8 digits)
      if (type === 'tel') {
        var digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 8) {
          showError(field);
          return false;
        }
      }

      clearError(field);
      return true;
    }

    // Clear errors on input
    fields.forEach(function (field) {
      if (!field.input) return;
      var eventType = field.input.type === 'checkbox' ? 'change' : 'input';
      field.input.addEventListener(eventType, function () {
        clearError(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = true;
      var firstInvalidField = null;

      fields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
          if (!firstInvalidField && field.input) {
            firstInvalidField = field.input;
          }
        }
      });

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.focus();
        }
        return;
      }

      // Form is valid - show confirmation
      // In production, this would submit to a backend endpoint
      var submitBtn = document.getElementById('contact-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Inquiry Sent';
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = 'var(--color-olive)';
      }

      // Show a simple confirmation message
      var confirmation = document.createElement('div');
      confirmation.setAttribute('role', 'alert');
      confirmation.style.cssText = 'padding: 20px; background-color: #F0F5F0; border: 1px solid #B8D4B8; margin-top: 24px; font-size: 15px; color: var(--color-olive);';
      confirmation.innerHTML = '<strong>Thank you for your inquiry.</strong><br>We will respond within one business day.';
      form.appendChild(confirmation);
    });
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  function initSmoothScroll() {
    var anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  /* ---------- Cart Badge (global) ---------- */
  function updateCartBadge() {
    try {
      var items = JSON.parse(localStorage.getItem('citadels_cart')) || [];
      var count = items.reduce(function(sum, i) { return sum + i.qty; }, 0);
      var badges = document.querySelectorAll('.cart-badge');
      badges.forEach(function(badge) {
        if (count > 0) {
          badge.textContent = count > 99 ? '99+' : count;
          badge.style.display = '';
        } else {
          badge.style.display = 'none';
        }
      });
    } catch (e) {}
  }

  /* ---------- Initialize ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initCookieConsent();
    initMobileNav();
    initFormValidation();
    initSmoothScroll();
    updateCartBadge();
  });

})();
