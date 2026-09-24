/* ==========================================================================
   FORMA — Hero Shader
   initHeroShader(variant) — Three.js WebGL backgrounds
   variant = 'a' | 'b' | 'c'
   - A: warm concentric rings (editorial)
   - B: shimmering particles (cinematic)
   - C: geometric grid lines (constructivist)
   Requires Three.js r128 loaded via CDN before this script.
   ========================================================================== */

/**
 * Initialise the WebGL hero background.
 * Looks for an element with id="hero-canvas" or creates a canvas
 * inside the first element with class .hero.
 *
 * @param {string} variant — 'a', 'b', or 'c'
 */
function initHeroShader(variant) {
  // Bail on reduced motion — static gradient fallback will show
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    return;
  }

  // Check Three.js availability
  if (typeof THREE === 'undefined') {
    console.warn('[hero-shader] Three.js not loaded, skipping WebGL hero.');
    return;
  }

  variant = (variant || 'a').toLowerCase();

  // Find or create canvas container
  var heroEl = document.getElementById('hero-canvas') || document.querySelector('.hero');
  if (!heroEl) {
    console.warn('[hero-shader] No .hero or #hero-canvas element found.');
    return;
  }

  // --- Palette from tokens ---
  var colors = {
    charcoal: 0x1A1714,
    black: 0x0A0A08,
    gold: 0xC8A45A,
    goldLight: 0xE6CC92,
    sand: 0xD4C9B0,
    taupe: 0x8A7A68,
    mocha: 0x5C4A38,
    orange: 0xD4864A,
    ivory: 0xF0EDE6,
    surface: 0x252220
  };

  // --- Setup renderer ---
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  var canvas = renderer.domElement;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';

  // Ensure hero has position context
  var heroPos = window.getComputedStyle(heroEl).position;
  if (heroPos === 'static') {
    heroEl.style.position = 'relative';
  }
  heroEl.insertBefore(canvas, heroEl.firstChild);

  var width = heroEl.offsetWidth;
  var height = heroEl.offsetHeight;
  renderer.setSize(width, height);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  // --- Shader materials per variant ---
  var material;

  if (variant === 'a') {
    // Warm concentric rings
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color(colors.charcoal) },
        uColor2: { value: new THREE.Color(colors.gold) },
        uColor3: { value: new THREE.Color(colors.mocha) }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec2 uResolution;',
        'uniform vec3 uColor1;',
        'uniform vec3 uColor2;',
        'uniform vec3 uColor3;',
        'varying vec2 vUv;',
        'void main() {',
        '  vec2 uv = vUv;',
        '  vec2 center = vec2(0.5, 0.5);',
        '  float dist = length(uv - center);',
        '  float ring = sin(dist * 20.0 - uTime * 0.5) * 0.5 + 0.5;',
        '  ring = smoothstep(0.3, 0.7, ring);',
        '  float pulse = sin(uTime * 0.3) * 0.05 + 0.95;',
        '  vec3 col = mix(uColor1, uColor3, dist * 1.5);',
        '  col = mix(col, uColor2, ring * 0.15 * pulse);',
        '  float vignette = 1.0 - smoothstep(0.3, 0.9, dist);',
        '  col *= 0.7 + vignette * 0.3;',
        '  gl_FragColor = vec4(col, 0.6);',
        '}'
      ].join('\n'),
      transparent: true
    });

  } else if (variant === 'b') {
    // Shimmering particles
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color(colors.black) },
        uColor2: { value: new THREE.Color(colors.goldLight) },
        uColor3: { value: new THREE.Color(colors.sand) }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec2 uResolution;',
        'uniform vec3 uColor1;',
        'uniform vec3 uColor2;',
        'uniform vec3 uColor3;',
        'varying vec2 vUv;',
        '',
        'float hash(vec2 p) {',
        '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
        '}',
        '',
        'void main() {',
        '  vec2 uv = vUv;',
        '  vec3 col = uColor1;',
        '  float shimmer = 0.0;',
        '  for (int i = 0; i < 6; i++) {',
        '    float fi = float(i);',
        '    vec2 grid = floor(uv * (8.0 + fi * 4.0));',
        '    float h = hash(grid + fi);',
        '    float t = uTime * (0.2 + h * 0.3) + h * 6.28;',
        '    float sparkle = pow(max(sin(t), 0.0), 20.0 + fi * 10.0);',
        '    shimmer += sparkle * (0.3 - fi * 0.04);',
        '  }',
        '  col = mix(col, uColor2, shimmer * 0.6);',
        '  col = mix(col, uColor3, shimmer * 0.15);',
        '  float fade = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);',
        '  gl_FragColor = vec4(col, fade * 0.5);',
        '}'
      ].join('\n'),
      transparent: true
    });

  } else {
    // variant c — geometric grid lines
    material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uColor1: { value: new THREE.Color(colors.charcoal) },
        uColor2: { value: new THREE.Color(colors.orange) },
        uColor3: { value: new THREE.Color(colors.taupe) }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float uTime;',
        'uniform vec2 uResolution;',
        'uniform vec3 uColor1;',
        'uniform vec3 uColor2;',
        'uniform vec3 uColor3;',
        'varying vec2 vUv;',
        '',
        'void main() {',
        '  vec2 uv = vUv;',
        '  float aspect = uResolution.x / uResolution.y;',
        '  vec2 scaled = vec2(uv.x * aspect, uv.y);',
        '  ',
        '  float gridH = smoothstep(0.02, 0.0, abs(fract(scaled.y * 8.0 + uTime * 0.05) - 0.5) - 0.48);',
        '  float gridV = smoothstep(0.02, 0.0, abs(fract(scaled.x * 8.0 - uTime * 0.03) - 0.5) - 0.48);',
        '  float diag = smoothstep(0.015, 0.0, abs(fract((scaled.x + scaled.y) * 4.0 + uTime * 0.04) - 0.5) - 0.485);',
        '  ',
        '  float lines = max(max(gridH, gridV), diag * 0.5);',
        '  vec3 col = uColor1;',
        '  col = mix(col, uColor3, lines * 0.4);',
        '  col = mix(col, uColor2, lines * 0.15 * (sin(uTime * 0.5 + uv.x * 3.0) * 0.5 + 0.5));',
        '  ',
        '  float vignette = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5));',
        '  col *= 0.75 + vignette * 0.25;',
        '  gl_FragColor = vec4(col, lines * 0.35 + 0.05);',
        '}'
      ].join('\n'),
      transparent: true
    });
  }

  // Full-screen quad
  var geometry = new THREE.PlaneGeometry(2, 2);
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // --- Animation loop ---
  var animationId = null;
  var startTime = performance.now();

  function animate() {
    animationId = requestAnimationFrame(animate);
    var elapsed = (performance.now() - startTime) / 1000;
    material.uniforms.uTime.value = elapsed;
    renderer.render(scene, camera);
  }

  animate();

  // --- Resize handler ---
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      width = heroEl.offsetWidth;
      height = heroEl.offsetHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    }, 150);
  });

  // --- Cleanup on reduced-motion change ---
  prefersReducedMotion.addEventListener('change', function (e) {
    if (e.matches && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  });
}
