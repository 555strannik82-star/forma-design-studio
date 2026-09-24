/* ==========================================================================
   FORMA — Variant Switcher
   initSwitcher(currentVariant) — renders floating A/B/C panel
   Hides on scroll down, shows on scroll up.
   Prefetches variant pages for instant navigation.
   ========================================================================== */

/**
 * Initialise the variant switcher.
 * @param {string} currentVariant — 'a', 'b', or 'c'
 */
function initSwitcher(currentVariant) {
  if (!currentVariant || !['a', 'b', 'c'].includes(currentVariant.toLowerCase())) {
    console.warn('[switcher] invalid variant:', currentVariant);
    return;
  }

  currentVariant = currentVariant.toLowerCase();

  var variants = [
    { id: 'a', label: 'A', href: 'variant-a.html' },
    { id: 'b', label: 'B', href: 'variant-b.html' },
    { id: 'c', label: 'C', href: 'variant-c.html' }
  ];

  // --- Build DOM ---
  var nav = document.createElement('nav');
  nav.className = 'variant-switcher';
  nav.setAttribute('aria-label', 'Switch variant');

  variants.forEach(function (v) {
    var btn = document.createElement('a');
    btn.className = 'variant-switcher__btn';
    btn.href = v.href;
    btn.textContent = v.label;
    btn.setAttribute('aria-label', 'Variant ' + v.label);

    if (v.id === currentVariant) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-current', 'page');
    }

    nav.appendChild(btn);
  });

  document.body.appendChild(nav);

  // --- Prefetch other variants ---
  variants.forEach(function (v) {
    if (v.id !== currentVariant) {
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = v.href;
      document.head.appendChild(link);
    }
  });

  // --- Scroll show/hide ---
  var lastScrollY = window.scrollY;
  var ticking = false;
  var scrollThreshold = 50; // px of scroll before hiding

  function onScroll() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(function () {
      var currentScrollY = window.scrollY;
      var delta = currentScrollY - lastScrollY;

      if (delta > scrollThreshold && currentScrollY > 100) {
        // scrolling down — hide
        nav.classList.add('is-hidden');
      } else if (delta < -scrollThreshold || currentScrollY < 100) {
        // scrolling up or near top — show
        nav.classList.remove('is-hidden');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });
  }

  // Respect prefers-reduced-motion: skip scroll behaviour
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReducedMotion.matches) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Listen for changes (user toggles setting mid-session)
  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      window.removeEventListener('scroll', onScroll);
      nav.classList.remove('is-hidden');
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });
}
