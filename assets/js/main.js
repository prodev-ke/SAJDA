/* ==========================================================================
   SAJDA — site behaviour
   Vanilla JS, no dependencies. Every feature degrades gracefully.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Sticky header --------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* --- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.querySelector('.nav__links');
  if (toggle && links) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* --- Scroll reveal ---------------------------------------------------- */
  var revealables = document.querySelectorAll('[data-reveal]');
  if (revealables.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealables.forEach(function (el) { revealObserver.observe(el); });
    }
  }

  /* --- Count-up statistics ---------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var format = function (n, el) {
      var out = el.dataset.group === 'false'
        ? String(n)
        : n.toLocaleString('en-KE');
      return (el.dataset.prefix || '') + out + (el.dataset.suffix || '');
    };

    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      if (reduced) { el.textContent = format(target, el); return; }
      var duration = 1700;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        // easeOutExpo
        var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = format(Math.round(target * eased), el);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var countObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* --- Funding bar ------------------------------------------------------ */
  var fill = document.querySelector('.funding__fill');
  if (fill && 'IntersectionObserver' in window) {
    var fillObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.width = (entry.target.dataset.progress || 0) + '%';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fillObserver.observe(fill);
  } else if (fill) {
    fill.style.width = (fill.dataset.progress || 0) + '%';
  }

  /* --- Gallery filters -------------------------------------------------- */
  var filters = document.querySelectorAll('.filter');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
  var emptyMsg = document.querySelector('.gallery-empty');

  if (filters.length && items.length) {
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        var shown = 0;
        items.forEach(function (item) {
          var match = cat === 'all' || item.dataset.category === cat;
          item.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (emptyMsg) emptyMsg.hidden = shown > 0;
      });
    });
  }

  /* --- Lightbox --------------------------------------------------------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox && items.length) {
    var lbImg = lightbox.querySelector('.lightbox__stage img');
    var lbCap = lightbox.querySelector('.lightbox__caption');
    var lbCount = lightbox.querySelector('.lightbox__count');
    var lbClose = lightbox.querySelector('.lightbox__close');
    var lbPrev = lightbox.querySelector('.lightbox__nav--prev');
    var lbNext = lightbox.querySelector('.lightbox__nav--next');
    var current = 0;
    var lastFocus = null;

    var visible = function () {
      return items.filter(function (i) { return !i.classList.contains('is-hidden'); });
    };

    var show = function (idx) {
      var list = visible();
      if (!list.length) return;
      current = (idx + list.length) % list.length;
      var item = list[current];
      lbImg.src = item.dataset.full || item.querySelector('img').src;
      lbImg.alt = item.querySelector('img').alt;
      if (lbCap) lbCap.textContent = item.dataset.caption || '';
      if (lbCount) lbCount.textContent = (current + 1) + ' / ' + list.length;
    };

    var open = function (item) {
      lastFocus = document.activeElement;
      show(visible().indexOf(item));
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    };

    var close = function () {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (item) {
      item.addEventListener('click', function (e) { e.preventDefault(); open(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
      });
    });

    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', function () { show(current - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    // Touch swipe
    var touchX = null;
    lightbox.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 55) show(dx > 0 ? current - 1 : current + 1);
      touchX = null;
    }, { passive: true });
  }

  /* --- Copy-to-clipboard (paybill / account numbers) -------------------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.copy || '';
      var done = function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('is-copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('is-copied');
        }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done).catch(function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* --- Current year ----------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
