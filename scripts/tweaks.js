/* ==========================================================================
   FORMA — Tweak Panel
   Live site customization controls
   ========================================================================== */

function initTweaks() {
  'use strict';

  // --- Defaults ---
  var DEFAULTS = {
    heroPhoto: 1,
    processColor: 'default',
    fontScale: 100,
    imageScale: 100,
    headingWeight: 700,
    sectionSpacing: 100,
    accentColor: 'orange',
    borderWidth: 4
  };

  var state = Object.assign({}, DEFAULTS);

  // --- Process section color presets ---
  var processColors = {
    'default':  { bg: 'transparent',          label: 'По умолч.' },
    'darker':   { bg: '#0a0808',              label: 'Тёмный' },
    'warm':     { bg: '#2d1f16',              label: 'Тёплый' },
    'olive':    { bg: '#1c2a16',              label: 'Олива' },
    'navy':     { bg: '#141828',              label: 'Индиго' },
    'wine':     { bg: '#2a1418',              label: 'Вино' },
    'charcoal': { bg: '#252525',              label: 'Графит' }
  };

  // --- Accent color presets ---
  var accentColors = {
    'orange':   { value: '#D4864A',           label: 'Оранж' },
    'gold':     { value: '#C8A45A',           label: 'Золото' },
    'copper':   { value: '#B87333',           label: 'Медь' },
    'terracotta': { value: '#C45D3E',         label: 'Терракот' },
    'sand':     { value: '#C4A882',           label: 'Песок' }
  };

  // --- Hero photo paths ---
  var heroPhotos = [
    'images/hero/hero-1.jpg',
    'images/hero/hero-2.jpg',
    'images/hero/hero-3.jpg',
    'images/hero/hero-4.jpg'
  ];

  // --- Build DOM ---
  var panel = document.createElement('div');
  panel.className = 'tweaks-panel';
  panel.innerHTML = buildPanelHTML();
  document.body.appendChild(panel);

  var toggle = document.createElement('button');
  toggle.className = 'tweaks-toggle';
  toggle.innerHTML = '⚙';
  toggle.setAttribute('aria-label', 'Открыть панель настроек');
  toggle.title = 'Твики';
  document.body.appendChild(toggle);

  // --- Toggle ---
  toggle.addEventListener('click', function () {
    panel.classList.toggle('is-open');
  });

  panel.querySelector('.tweaks-panel__close').addEventListener('click', function () {
    panel.classList.remove('is-open');
  });

  // --- Hero photo selector ---
  panel.querySelectorAll('[data-hero]').forEach(function (el) {
    el.addEventListener('click', function () {
      var idx = parseInt(this.dataset.hero, 10);
      setHeroPhoto(idx);
    });
  });

  // --- Process color selector ---
  panel.querySelectorAll('[data-process-color]').forEach(function (el) {
    el.addEventListener('click', function () {
      setProcessColor(this.dataset.processColor);
      scrollToSection('.vc-process');
    });
  });

  // --- Accent color selector ---
  panel.querySelectorAll('[data-accent]').forEach(function (el) {
    el.addEventListener('click', function () {
      setAccentColor(this.dataset.accent);
    });
  });

  // --- Sliders ---
  bindSlider('font-scale', function (v) {
    state.fontScale = v;
    document.documentElement.style.setProperty('--tweaks-font-scale', v / 100);
    updateScaledFonts();
  });

  bindSlider('image-scale', function (v) {
    state.imageScale = v;
    document.documentElement.style.setProperty('--tweaks-image-scale', v / 100);
    updateScaledImages();
  });

  bindSlider('heading-weight', function (v) {
    state.headingWeight = v;
    document.querySelectorAll('.vc-heading').forEach(function (el) {
      el.style.fontWeight = v;
    });
  });

  bindSlider('section-spacing', function (v) {
    state.sectionSpacing = v;
    document.querySelectorAll('.section').forEach(function (el) {
      el.style.paddingBlock = 'calc(var(--space-15) * ' + (v / 100) + ')';
    });
    scrollToSection('.vc-about');
  });

  bindSlider('border-width', function (v) {
    state.borderWidth = v;
    document.documentElement.style.setProperty('--tweaks-border-width', v + 'px');
    updateBorders();
    scrollToSection('.vc-about');
  });

  // --- Reset ---
  panel.querySelector('.tweaks-reset').addEventListener('click', function () {
    state = Object.assign({}, DEFAULTS);
    setHeroPhoto(DEFAULTS.heroPhoto);
    setProcessColor(DEFAULTS.processColor);
    setAccentColor(DEFAULTS.accentColor);
    resetSlider('font-scale', DEFAULTS.fontScale);
    resetSlider('image-scale', DEFAULTS.imageScale);
    resetSlider('heading-weight', DEFAULTS.headingWeight);
    resetSlider('section-spacing', DEFAULTS.sectionSpacing);
    resetSlider('border-width', DEFAULTS.borderWidth);
    document.documentElement.style.removeProperty('--tweaks-font-scale');
    document.documentElement.style.removeProperty('--tweaks-image-scale');
    document.documentElement.style.removeProperty('--tweaks-border-width');
    updateScaledFonts(true);
    updateScaledImages(true);
    updateBorders(true);
    document.querySelectorAll('.vc-heading').forEach(function (el) {
      el.style.fontWeight = '';
    });
    document.querySelectorAll('.section').forEach(function (el) {
      el.style.paddingBlock = '';
    });
  });

  // --- Actions ---

  var scrollTimeout = null;
  function scrollToSection(selector) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      var el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  function setHeroPhoto(idx) {
    state.heroPhoto = idx;
    var img = document.querySelector('.vc-hero__photo');
    if (img) {
      img.src = heroPhotos[idx - 1] || heroPhotos[0];
    }

    panel.querySelectorAll('[data-hero]').forEach(function (el) {
      el.classList.toggle('is-active', parseInt(el.dataset.hero, 10) === idx);
    });
  }

  function setProcessColor(key) {
    state.processColor = key;
    var section = document.querySelector('.vc-process');
    if (section) {
      section.style.backgroundColor = processColors[key].bg;
    }
    panel.querySelectorAll('[data-process-color]').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.processColor === key);
    });
  }

  function setAccentColor(key) {
    state.accentColor = key;
    var color = accentColors[key].value;
    document.documentElement.style.setProperty('--vc-accent', color);
    document.documentElement.style.setProperty('--vc-accent-faded', color.replace(')', ', 0.15)').replace('rgb', 'rgba').replace('#', ''));

    var r = parseInt(color.slice(1, 3), 16);
    var g = parseInt(color.slice(3, 5), 16);
    var b = parseInt(color.slice(5, 7), 16);
    document.documentElement.style.setProperty('--vc-accent-faded', 'rgba(' + r + ',' + g + ',' + b + ',0.15)');
    document.documentElement.style.setProperty('--vc-accent-border', 'rgba(' + r + ',' + g + ',' + b + ',0.35)');

    panel.querySelectorAll('[data-accent]').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.accent === key);
    });
  }

  function updateScaledFonts(reset) {
    var scale = reset ? 1 : state.fontScale / 100;
    document.querySelectorAll('.vc-body, .vc-accent-text').forEach(function (el) {
      if (!el._origFontSize) {
        el._origFontSize = parseFloat(getComputedStyle(el).fontSize);
      }
      el.style.fontSize = reset ? '' : (el._origFontSize * scale) + 'px';
    });
  }

  function updateScaledImages(reset) {
    var scale = reset ? 1 : state.imageScale / 100;
    document.querySelectorAll('.vc-portfolio__img').forEach(function (el) {
      if (!el._origHeight) {
        el._origHeight = el.offsetHeight;
      }
      if (reset) {
        el.style.height = '';
        el.style.minHeight = '';
      } else {
        el.style.height = (el._origHeight * scale) + 'px';
        el.style.minHeight = 'auto';
      }
    });
    var aboutImg = document.querySelector('.vc-about__image');
    if (aboutImg) {
      if (!aboutImg._origHeight) {
        aboutImg._origHeight = aboutImg.offsetHeight;
      }
      aboutImg.style.height = reset ? '' : (aboutImg._origHeight * scale) + 'px';
    }
  }

  function updateBorders(reset) {
    var w = reset ? '' : state.borderWidth + 'px';
    document.querySelectorAll('.vc-about__image').forEach(function (el) {
      el.style.borderLeftWidth = w;
    });
    document.querySelectorAll('.vc-portfolio__card-accent').forEach(function (el) {
      el.style.width = w;
    });
  }

  function bindSlider(id, cb) {
    var slider = panel.querySelector('#tweak-' + id);
    var display = panel.querySelector('#tweak-' + id + '-val');
    if (!slider) return;
    slider.addEventListener('input', function () {
      var v = parseFloat(this.value);
      if (display) display.textContent = v + (this.dataset.unit || '');
      cb(v);
    });
  }

  function resetSlider(id, val) {
    var slider = panel.querySelector('#tweak-' + id);
    var display = panel.querySelector('#tweak-' + id + '-val');
    if (slider) {
      slider.value = val;
      if (display) display.textContent = val + (slider.dataset.unit || '');
    }
  }

  // --- Initial active states ---
  setHeroPhoto(state.heroPhoto);
  setProcessColor(state.processColor);
  panel.querySelectorAll('[data-accent="orange"]').forEach(function (el) {
    el.classList.add('is-active');
  });

  // --- Build panel HTML ---

  function buildPanelHTML() {
    var html = '';

    // Header
    html += '<div class="tweaks-panel__header">';
    html += '<span class="tweaks-panel__title">Твики</span>';
    html += '<button class="tweaks-panel__close" aria-label="Закрыть">&times;</button>';
    html += '</div>';

    // Hero photos
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Hero — фото фасада</span>';
    html += '<div class="tweaks-photos">';
    for (var i = 1; i <= 4; i++) {
      html += '<div class="tweaks-photo" data-hero="' + i + '" ';
      html += 'style="background-image:url(' + heroPhotos[i - 1] + ')">';
      html += '<span class="tweaks-photo__label">' + i + '</span>';
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';

    // Process background color
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Процесс — фон секции</span>';
    html += '<div class="tweaks-colors">';
    Object.keys(processColors).forEach(function (key) {
      var pc = processColors[key];
      var bg = pc.bg === 'transparent' ? 'var(--charcoal)' : pc.bg;
      html += '<div class="tweaks-swatch" data-process-color="' + key + '" ';
      html += 'style="background:' + bg + '" title="' + pc.label + '"></div>';
    });
    html += '</div>';
    html += '</div>';

    // Accent color
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Акцентный цвет</span>';
    html += '<div class="tweaks-colors">';
    Object.keys(accentColors).forEach(function (key) {
      var ac = accentColors[key];
      html += '<div class="tweaks-swatch" data-accent="' + key + '" ';
      html += 'style="background:' + ac.value + '" title="' + ac.label + '"></div>';
    });
    html += '</div>';
    html += '</div>';

    // Font size slider
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Типографика</span>';
    html += sliderRow('font-scale', 'Размер текста', 70, 140, 100, '%');
    html += sliderRow('heading-weight', 'Вес заголовков', 400, 900, 700, '');
    html += '</div>';

    // Image size slider
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Изображения</span>';
    html += sliderRow('image-scale', 'Масштаб', 60, 150, 100, '%');
    html += sliderRow('border-width', 'Рамка акцента', 0, 12, 4, 'px');
    html += '</div>';

    // Spacing slider
    html += '<div class="tweaks-section">';
    html += '<span class="tweaks-section__label">Расстояния</span>';
    html += sliderRow('section-spacing', 'Между секциями', 50, 150, 100, '%');
    html += '</div>';

    // Reset
    html += '<div class="tweaks-section">';
    html += '<button class="tweaks-reset">Сбросить все настройки</button>';
    html += '</div>';

    return html;
  }

  function sliderRow(id, name, min, max, val, unit) {
    return '<div class="tweaks-slider-row">' +
      '<span class="tweaks-slider-name">' + name + '</span>' +
      '<input type="range" class="tweaks-slider" id="tweak-' + id + '" ' +
      'min="' + min + '" max="' + max + '" value="' + val + '" ' +
      'data-unit="' + unit + '">' +
      '<span class="tweaks-slider-value" id="tweak-' + id + '-val">' + val + unit + '</span>' +
      '</div>';
  }
}

document.addEventListener('DOMContentLoaded', initTweaks);
