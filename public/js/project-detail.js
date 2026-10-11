(function () {
  'use strict';

  function initGallery() {
    // 1. Resolve gallery images with triple-fallback
    let galleryImgs = window.galleryData;

    if (!Array.isArray(galleryImgs) || !galleryImgs.length) {
      const jsonEl = document.getElementById('galleryData');
      if (jsonEl && jsonEl.textContent) {
        try {
          galleryImgs = JSON.parse(jsonEl.textContent);
        } catch (e) {}
      }
    }

    if (!Array.isArray(galleryImgs) || !galleryImgs.length) {
      const domImgs = document.querySelectorAll('.pd-inline-img');
      if (domImgs && domImgs.length) {
        galleryImgs = Array.from(domImgs).map(function (img) {
          return img.getAttribute('src');
        }).filter(Boolean);
      }
    }

    galleryImgs = Array.isArray(galleryImgs) ? galleryImgs : [];
    const total = galleryImgs.length;

    const track = document.getElementById('inlineTrack');
    const dotsWrap = document.getElementById('inlineDots');
    const prevBtn = document.getElementById('inlinePrev');
    const nextBtn = document.getElementById('inlineNext');
    const currentSpan = document.getElementById('inlineCurrent');
    const wrap = document.getElementById('inlineSliderWrap');

    if (!track || !wrap || !prevBtn || !nextBtn || total <= 0) return;

    let current = 0;
    let dots = [];
    let touchStartX = 0;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (currentSpan) currentSpan.textContent = String(current + 1);
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      dots = [];

      if (total <= 10) {
        dotsWrap.style.display = 'flex';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'pd-inline-dot' + (i === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
          dot.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goTo(i);
          });
          dotsWrap.appendChild(dot);
          dots.push(dot);
        }
      } else {
        dotsWrap.style.display = 'none';
      }
    }

    buildDots();

    prevBtn.type = 'button';
    nextBtn.type = 'button';

    prevBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      goTo(current - 1);
    });

    nextBtn.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      goTo(current + 1);
    });

    wrap.addEventListener('touchstart', function (event) {
      if (event.touches && event.touches[0]) {
        touchStartX = event.touches[0].clientX;
      }
    }, { passive: true });

    wrap.addEventListener('touchend', function (event) {
      if (!event.changedTouches || !event.changedTouches[0]) return;
      const diff = touchStartX - event.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    const lbNum = document.getElementById('lightboxNum');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    let lbCurrent = 0;

    function openLightbox(index) {
      if (!lightbox || !lbImg) return;
      lbCurrent = (index + total) % total;
      lbImg.src = galleryImgs[lbCurrent];
      if (lbNum) lbNum.textContent = String(lbCurrent + 1);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function lbGoTo(index) {
      if (!lbImg) return;
      lbCurrent = (index + total) % total;
      lbImg.style.opacity = '0';
      setTimeout(function () {
        lbImg.src = galleryImgs[lbCurrent];
        lbImg.style.opacity = '1';
        if (lbNum) lbNum.textContent = String(lbCurrent + 1);
      }, 150);
    }

    // Attach click to all slider images
    document.querySelectorAll('.pd-inline-img').forEach(function (img) {
      img.addEventListener('click', function (event) {
        event.preventDefault();
        openLightbox(Number(img.dataset.index || 0));
      });

      img.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openLightbox(Number(img.dataset.index || 0));
        }
      });
    });

    if (lbClose) lbClose.addEventListener('click', closeLightbox);

    if (lightbox) {
      lightbox.addEventListener('click', function (event) {
        if (event.target === lightbox) closeLightbox();
      });
    }

    if (lbPrev) {
      lbPrev.addEventListener('click', function (event) {
        event.stopPropagation();
        lbGoTo(lbCurrent - 1);
      });
    }

    if (lbNext) {
      lbNext.addEventListener('click', function (event) {
        event.stopPropagation();
        lbGoTo(lbCurrent + 1);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (!lightbox || !lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') lbGoTo(lbCurrent - 1);
      if (event.key === 'ArrowRight') lbGoTo(lbCurrent + 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
