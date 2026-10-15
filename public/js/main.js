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
        input: document.getElementById('contact-subject'),
        error: document.getElementById('contact-subject-error'),
        message: 'Please enter a subject.'
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

      // Gather data
      var formData = {
        name: document.getElementById('contact-name').value,
        phone: document.getElementById('contact-phone').value,
        email: document.getElementById('contact-email-input').value,
        inquiryType: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value,
        preferredContact: document.querySelector('input[name="preferred-contact"]:checked') ? document.querySelector('input[name="preferred-contact"]:checked').value : 'email'
      };

      var submitBtn = document.getElementById('contact-submit');
      var originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
      var i18n = window.CONTACT_I18N || {
        btnSending:   'Sending...',
        successTitle: 'Thank you for your inquiry.',
        successText:  'We will respond within one business day.',
        errorTitle:   'Something went wrong.',
        errorText:    'Please try again later or contact us directly.'
      };
      
      if (submitBtn) {
        submitBtn.textContent = i18n.btnSending;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      // Get reCAPTCHA token if configured, then submit
      var siteKey = window.RECAPTCHA_SITE_KEY;
      var submitForm = function(recaptchaToken) {
        if (recaptchaToken) formData.recaptchaToken = recaptchaToken;

        fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.success) {
          var emailOk = data.emailSent === true;

          if (submitBtn) {
            submitBtn.textContent = emailOk ? i18n.emailSentTitle : i18n.errorTitle;
            submitBtn.style.backgroundColor = emailOk ? 'var(--color-olive)' : '#B45309';
            submitBtn.style.opacity = '1';
          }

          var confirmation = document.createElement('div');
          confirmation.setAttribute('role', 'alert');

          if (emailOk) {
            // ✅ Email delivered — green success box
            confirmation.style.cssText = 'padding:20px;background:#F0F5F0;border:1px solid #B8D4B8;margin-top:24px;font-size:15px;color:#2D4A2D;';
            confirmation.innerHTML = '<strong>' + i18n.emailSentTitle + '</strong><br>' + i18n.successText;
          } else {
            // ⚠️ Saved to DB but email failed — amber warning box
            confirmation.style.cssText = 'padding:20px;background:#FFFBEB;border:1px solid #F59E0B;margin-top:24px;font-size:15px;color:#92400E;';
            confirmation.innerHTML = '<strong>&#9888; ' + i18n.errorTitle + '</strong><br>' + i18n.emailWarningText;
          }

          form.appendChild(confirmation);
          form.reset();
        } else {
          throw new Error(data.message || i18n.errorTitle);
        }
      })
      .catch(function(error) {
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
        
        var errorMsg = document.createElement('div');
        errorMsg.setAttribute('role', 'alert');
        errorMsg.style.cssText = 'padding: 20px; background-color: #FDF3F3; border: 1px solid #F3D0D0; margin-top: 24px; font-size: 15px; color: var(--color-error);';
        errorMsg.innerHTML = '<strong>' + i18n.errorTitle + '</strong><br>' + (error.message || i18n.errorText);
        form.appendChild(errorMsg);
        
        // Remove error message after 5 seconds
        setTimeout(function() {
          if (errorMsg.parentNode) {
            errorMsg.parentNode.removeChild(errorMsg);
          }
        }, 5000);
      });
      }; // end submitForm

      // Execute reCAPTCHA v3 invisibly, then submit
      if (siteKey && siteKey !== 'your_recaptcha_site_key_here' && window.grecaptcha) {
        window.grecaptcha.ready(function() {
          window.grecaptcha.execute(siteKey, { action: 'contact' }).then(function(token) {
            submitForm(token);
          });
        });
      } else {
        submitForm(null);
      }
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

  /* ---------- Language Dropdown ---------- */
  function initLangDropdown() {
    var dropdown = document.getElementById('lang-dropdown');
    var btn = document.getElementById('lang-dropdown-btn');
    if (!dropdown || !btn) return;

    function openDropdown() {
      dropdown.classList.add('lang-dropdown--open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function closeDropdown() {
      dropdown.classList.remove('lang-dropdown--open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggleDropdown() {
      if (dropdown.classList.contains('lang-dropdown--open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  /* ---------- Initialize ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initCookieConsent();
    initMobileNav();
    initFormValidation();
    initSmoothScroll();
    initLangDropdown();
  });

})();
