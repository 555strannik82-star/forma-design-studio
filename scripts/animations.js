/* ==========================================================================
   FORMA — Scroll Animations
   initScrollAnimations() — Intersection Observer + CSS animation classes
   CSS classes: .reveal, .parallax, .reveal-stagger
   ========================================================================== */

/**
 * Initialise scroll-triggered reveal animations.
 * Elements with class .reveal, .parallax, or .reveal-stagger
 * receive class .revealed when they enter the viewport.
 *
 * .reveal          — single element fade+slide
 * .parallax        — parallax translate on scroll
 * .reveal-stagger  — container whose children reveal with stagger delay
 */
function initScrollAnimations() {
  // Bail out if reduced motion is preferred
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    // Immediately reveal everything — no animation
    revealAll();
    return;
  }

  // --- Reveal observer (for .reveal and .reveal-stagger) ---
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observe .reveal elements
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Observe .reveal-stagger containers
  var staggerEls = document.querySelectorAll('.reveal-stagger');
  staggerEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Parallax observer (for .parallax) ---
  var parallaxEls = document.querySelectorAll('.parallax');
  if (parallaxEls.length > 0) {
    var parallaxObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          entry.target.dataset.parallaxActive = 'true';
        } else {
          entry.target.dataset.parallaxActive = 'false';
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px 0px 100px 0px'
    });

    parallaxEls.forEach(function (el) {
      parallaxObserver.observe(el);
    });

    // Parallax scroll handler
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        parallaxEls.forEach(function (el) {
          if (el.dataset.parallaxActive !== 'true') return;
          var rect = el.getBoundingClientRect();
          var viewH = window.innerHeight;
          var progress = (viewH - rect.top) / (viewH + rect.height);
          var speed = parseFloat(el.dataset.parallaxSpeed) || 0.15;
          var offset = (progress - 0.5) * speed * 100;
          el.style.transform = 'translateY(' + offset + 'px)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  // Handle dynamic toggle of reduced-motion preference
  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches) {
      revealAll();
    }
  });

  /**
   * Force-reveal all animated elements (for reduced motion).
   */
  function revealAll() {
    document.querySelectorAll('.reveal, .parallax, .reveal-stagger').forEach(function (el) {
      el.classList.add('revealed');
      el.style.transform = '';
    });
  }
}
