window.STATE =
{
  "slug": "forma-portfolio-variants",
  "dir": "2026-09-23-forma-portfolio-variants",
  "title": "FORMA — варианты портфолио-сайта с переключением",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T1",
  "briefFile": "2026-09-23-brief.md",
  "memoryFile": "AGENTS.md",
  "skillDir": "/d/CLAUDE/.claude/skills/autopilot",
  "startedAt": "2026-09-23T00:02:23+05:00",
  "updatedAt": "2026-09-23T01:15:00+05:00",
  "finishedAt": "2026-09-23T01:15:00+05:00",
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-09-23T00:02:23+05:00", "finishedAt": "2026-09-23T00:15:00+05:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-09-23T00:15:00+05:00", "finishedAt": "2026-09-23T00:20:00+05:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-09-23T00:20:00+05:00", "finishedAt": "2026-09-23T00:22:00+05:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-09-23T00:22:00+05:00", "finishedAt": "2026-09-23T00:30:00+05:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-09-23T00:30:00+05:00", "finishedAt": "2026-09-23T00:35:00+05:00", "note": "4 таска, ярус T1" },
    { "id": "build",     "status": "done", "startedAt": "2026-09-23T00:35:00+05:00", "finishedAt": "2026-09-23T00:52:00+05:00", "note": "4 из 4 тасков готовы" },
    { "id": "review",    "status": "done", "startedAt": "2026-09-23T00:45:00+05:00", "finishedAt": "2026-09-23T00:52:00+05:00", "note": "inline-ревью всех тасков" },
    { "id": "final",     "status": "done", "startedAt": "2026-09-23T01:05:00+05:00", "finishedAt": "2026-09-23T01:15:00+05:00" }
  ],
  "requirements": {
    "total": 24, "done": 23, "inTicket": 0, "inSpec": 0,
    "placeholder": 1, "deferred": 0, "dropped": 0
  },
  "tickets": [
    {
      "id": "01", "title": "Фундамент: токены, переключатель, анимации",
      "requirements": ["R02", "R08", "R12", "R21i", "R23i", "R24i"],
      "blockedBy": [], "wave": 1, "zone": ["styles/", "scripts/"],
      "status": "done", "startedAt": "2026-09-23T00:40:00+05:00", "finishedAt": "2026-09-23T00:45:00+05:00", "retries": 0, "repairs": 0, "handoffs": 0
    },
    {
      "id": "02", "title": "Вариант A «Редакция»",
      "requirements": ["R01", "R03", "R06", "R07", "R10", "R13", "R15", "R16", "R17", "R18", "R19", "R20", "R22i"],
      "blockedBy": ["01"], "wave": 2, "zone": ["variant-a.html", "styles/variant-a.css"],
      "status": "done", "startedAt": "2026-09-23T00:44:00+05:00", "finishedAt": "2026-09-23T00:48:00+05:00", "retries": 0, "repairs": 0, "handoffs": 0
    },
    {
      "id": "03", "title": "Вариант B «Кино»",
      "requirements": ["R01", "R03", "R06", "R13", "R15", "R16", "R17", "R18", "R19", "R20", "R22i"],
      "blockedBy": ["01"], "wave": 2, "zone": ["variant-b.html", "styles/variant-b.css"],
      "status": "done", "startedAt": "2026-09-23T00:44:00+05:00", "finishedAt": "2026-09-23T00:49:00+05:00", "retries": 0, "repairs": 0, "handoffs": 0
    },
    {
      "id": "04", "title": "Вариант C «Конструктор»",
      "requirements": ["R01", "R03", "R06", "R09", "R11", "R13", "R16", "R17", "R18", "R19", "R20", "R22i"],
      "blockedBy": ["01"], "wave": 2, "zone": ["variant-c.html", "styles/variant-c.css"],
      "status": "done", "startedAt": "2026-09-23T00:44:00+05:00", "finishedAt": "2026-09-23T00:52:00+05:00", "retries": 0, "repairs": 0, "handoffs": 0
    }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": ["R14 — scroll-видео интерьера"], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": { "findings": 3, "missing": 0, "halfCovered": 1, "extra": 2, "fixed": 3 },
  "concerns": [
    { "ticket": "02", "file": "variant-a.html", "finding": "tight-leading — line-height ниже 1.3x (Impeccable)", "verdict": "report" },
    { "ticket": "02", "file": "variant-a.html", "finding": "cramped-padding — текст слишком близко к краю контейнера (Impeccable, 2 места)", "verdict": "fix-now" },
    { "ticket": "03", "file": "variant-b.html", "finding": "hero-canvas как div вместо canvas — Three.js монтирует свой canvas внутрь контейнера", "verdict": "drop", "reason": "by design — Three.js монтирует свой canvas в div-контейнер" },
    { "ticket": "03", "file": "variant-b.html", "finding": "cramped-padding — текст близко к краю контейнера (Impeccable)", "verdict": "fix-now" },
    { "ticket": "03", "file": "variant-b.html", "finding": "pulsing-dot — декоративный пульс на hero-выноске без live-данных (Impeccable)", "verdict": "drop", "reason": "декоративный элемент, дело вкуса" },
    { "ticket": "04", "file": "variant-c.html", "finding": "side-tab — толстая боковая граница на карточках (Impeccable, 2 места)", "verdict": "report" },
    { "ticket": "04", "file": "variant-c.html", "finding": "cramped-padding — текст близко к краю контейнера (Impeccable, 3 места)", "verdict": "fix-now" }
  ],
  "reviewers": { "manifestSpec": null, "craft": null },
  "blind": {
    "ranAt": "2026-09-23T01:10:00+05:00",
    "total": 16,
    "done": 15,
    "partial": 1,
    "missing": 0,
    "notes": "R13 (hero scroll trigger) отмечен как частично: шейдер анимируется по времени, а не по скроллу. Однако scroll-trigger анимации контента (reveal/callouts) работают. R14 — placeholder (ожидаемо, видео нет). Расхождений с манифестом нет."
  }
}
