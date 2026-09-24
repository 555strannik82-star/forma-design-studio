# Интерфейсы и границы

## Границы, решённые в спецификации

| Модуль | Владеет | Выставляет | Прячет |
|---|---|---|---|
| `tokens` | CSS-переменные, шрифты, общие стили | `styles/tokens.css` — подключается во все варианты | расчёт значений |
| `switcher` | UI переключателя, состояние текущего варианта | `initSwitcher(currentVariant)` — вызывается на каждой странице | логику показа/скрытия при скролле, prefetch |
| `animations` | Intersection Observer, scroll-trigger | `initScrollAnimations()`, CSS-классы `.reveal`, `.parallax`, `.reveal-stagger` | threshold, timing, stagger-логику |
| `hero-shader` | WebGL/Canvas контекст, шейдерный код | `initHeroShader(variant)` — variant = 'a'\|'b'\|'c' | шейдерный код, RAF-цикл |
| `variant-a` | HTML-структура варианта A, `styles/variant-a.css` | HTML-файл `variant-a.html` | внутреннюю разметку секций |
| `variant-b` | HTML-структура варианта B, `styles/variant-b.css` | HTML-файл `variant-b.html` | внутреннюю разметку секций |
| `variant-c` | HTML-структура варианта C, `styles/variant-c.css` | HTML-файл `variant-c.html` | внутреннюю разметку секций |

## Правила проекта

- **Стек:** Vanilla HTML/CSS/JS. Без фреймворков, сборщиков, npm.
- **CDN:** Three.js r128 — `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- **Шрифты:** Google Fonts — Playfair Display, Cormorant Garamond, Inter, Oswald
- **Файловая структура:**
  ```
  variant-a.html
  variant-b.html
  variant-c.html
  styles/
    tokens.css
    switcher.css
    variant-a.css
    variant-b.css
    variant-c.css
  scripts/
    switcher.js
    animations.js
    hero-shader.js
  ```
- **Запуск:** открыть HTML-файл в браузере или запустить `python -m http.server 8080`
- **Не трогать:** `index.html` (существующая страница), `.autopilot/`, `AGENTS.md`, `CLAUDE.md`
- **Отсутствующие зависимости:** не устанавливать ничего. Всё работает через CDN или inline.

## Швы для тестов

Один шов: страница загружается → переключатель рендерится → все 6 секций видимы → scroll-анимации срабатывают.

## Из таска 01 — фундамент

- `styles/tokens.css` — CSS-переменные: палитра (--black, --charcoal, --surface, --border, --ivory, --sand, --taupe, --mocha, --gold, --gold-light, --orange), типографика, сетка, отступы, breakpoints. Подключается `@import` во все варианты.
- `styles/switcher.css` — стили плавающей панели переключателя.
- `scripts/switcher.js` — `initSwitcher(currentVariant: 'a'|'b'|'c')` — рендерит панель A/B/C, текущий вариант золотым, скрывает при скролле вниз, показывает при скролле вверх.
- `scripts/animations.js` — `initScrollAnimations()` — Intersection Observer, добавляет `.revealed` при пересечении viewport. CSS-классы: `.reveal` (fade+slide-up), `.parallax` (вертикальный параллакс), `.reveal-stagger` (каскадное появление).
- `scripts/hero-shader.js` — `initHeroShader(variant: 'a'|'b'|'c')` — Three.js r128, три шейдера: тёплые кольца (A), мерцающие частицы (B), геометрическая сетка (C). Ищет `#hero-canvas` в DOM.
- `prefers-reduced-motion` уважается во всех модулях.
- Google Fonts подключены через `@import` в `tokens.css`: Playfair Display, Cormorant Garamond, Inter, Oswald.

## Из таска 02 — вариант A «Редакция»

- `variant-a.html` — полная страница с 6 секциями (Hero, О студии, Портфолио, Услуги, Процесс, Контакт).
- `styles/variant-a.css` — стили варианта A: Playfair Display 700 для заголовков, Cormorant Garamond 300 italic для акцентов, золотой акцент.
- Подключает: `tokens.css`, `switcher.css`, `variant-a.css`, `switcher.js`, `animations.js`, `hero-shader.js`.
- Вызывает: `initHeroShader('a')`, `initScrollAnimations()`, `initSwitcher('a')`.
- Секции: `#hero`, `#about`, `#portfolio`, `#services`, `#process`, `#contact`.
- Hero: 3 выноски (callouts) поверх шейдера.

## Из таска 03 — вариант B «Кино»

- `variant-b.html` — полная страница с 6 секциями. `body.variant-b` переключает стили.
- `styles/variant-b.css` — Inter 800 uppercase для заголовков, Cormorant Garamond 300 italic gold-light для акцентов, фон #0A0A08.
- Вызывает: `initHeroShader('b')`, `initScrollAnimations()`, `initSwitcher('b')`.
- Секции: `#hero`, `#about`, `#portfolio`, `#services`, `#process`, `#contact`.
- Hero: 3 выноски с точками-маркерами.
- Портфолио: горизонтальная snap-scroll галерея.
- Полноэкранные фото-блоки с overlay в секциях «Услуги» и «Контакт».

## Из таска 04 — вариант C «Конструктор»

- `variant-c.html` — полная страница с 6 секциями. Осевая асимметрия.
- `styles/variant-c.css` — Oswald 700 condensed uppercase для заголовков, Playfair Display italic для акцентов, оранжевый `--vc-accent: var(--orange)`.
- Вызывает: `initHeroShader('c')`, `initScrollAnimations()`, `initSwitcher('c')`.
- Секции: `#hero`, `#about`, `#portfolio`, `#services`, `#process`, `#contact`.
- Анимации: clip-path unfold (`.vc-unfold`, `.vc-unfold--right`, `.vc-unfold--down`, `.vc-unfold--up`, `.vc-unfold--diagonal`).
- Геометрические линии-разделители между секциями.
