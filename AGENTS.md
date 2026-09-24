<!-- autopilot:start -->
# FORMA — три варианта портфолио-сайта студии дизайна интерьеров

Три визуально разных варианта одностраничника для студии FORMA: A (редакция), B (кино), C (конструктор). Vanilla HTML/CSS/JS, Three.js r128 через CDN. Тестов нет, сборки нет, npm нет.

## Команды

| Команда | Что делает |
|---------|------------|
| `py -m http.server 8080` | Локальный сервер в корне проекта |
| Открыть `http://localhost:8080/variant-a.html` | Вариант A — Редакция |
| Открыть `http://localhost:8080/variant-b.html` | Вариант B — Кино |
| Открыть `http://localhost:8080/variant-c.html` | Вариант C — Конструктор |

Сервер нужен для корректной работы `@import` в CSS и загрузки Three.js. Открытие через `file://` может сломать шейдеры.

## Структура

```
variant-a.html              # Вариант A «Редакция» — Playfair Display, золотой акцент
variant-b.html              # Вариант B «Кино» — Inter 800 uppercase, тёмный фон #0A0A08
variant-c.html              # Вариант C «Конструктор» — Oswald condensed, оранжевый акцент
index.html                  # Старая самостоятельная посадочная (не связана с вариантами, не трогать)
styles/
  tokens.css                # Дизайн-токены: палитра, типографика, сетка, анимационные классы
  switcher.css              # Стили плавающей панели A/B/C
  variant-a.css             # Стили варианта A
  variant-b.css             # Стили варианта B
  variant-c.css             # Стили варианта C
scripts/
  switcher.js               # initSwitcher('a'|'b'|'c') — панель переключения между вариантами
  animations.js             # initScrollAnimations() — Intersection Observer для .reveal, .parallax, .reveal-stagger
  hero-shader.js            # initHeroShader('a'|'b'|'c') — Three.js WebGL фон: кольца / частицы / сетка
Referens/                   # Референсные изображения (1-6.jpg)
```

## Подводные камни

- **`index.html` — отдельная страница.** У неё своя разметка, свои inline-стили, свой калькулятор и FAQ. Она не использует `tokens.css`, `switcher.js` и другие общие модули. Не путать с вариантами.
- **`#hero-canvas` — разная семантика.** В variant-a.html это `<canvas>`, в variant-b.html и variant-c.html — `<div>`. `hero-shader.js` обрабатывает оба случая: ищет `#hero-canvas` или `.hero`, вставляет свой canvas внутрь.
- **Изображения — заглушки.** Все фото заменены CSS-градиентами (`linear-gradient`). При добавлении реальных фото нужно заменить `style="background:..."` и placeholder-классы (`vb-photo--warm`, `portfolio__img--placeholder` и т.д.).
- **Контактные данные — плейсхолдеры.** `[ТЕЛЕФОН]`, `[EMAIL]`, `[АДРЕС]` в вариантах B и C. В варианте A email указан как `hello@forma.studio`.
- **Variant C имеет свои clip-path анимации** (`.vc-unfold`, `.vc-unfold--right` и др.) с собственным IntersectionObserver в inline-скрипте страницы, отдельно от `animations.js`.
- **Variant B имеет inline-скрипт для галереи** — обновляет индикатор-точки при горизонтальном скролле snap-галереи.
- **`prefers-reduced-motion`** уважается во всех модулях: шейдер не запускается, анимации получают `.revealed` мгновенно.
- **Шрифты загружаются через `@import` в `tokens.css`.** Если подключить CSS через `<link>` без сервера — шрифты не загрузятся.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
