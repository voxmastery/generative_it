# White Theme Aesthetic Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the dark-themed Angular site to a premium white/light "Rovae White" aesthetic with blue-to-cyan gradient accents, Plus Jakarta Sans typography, and warm layered card design.

**Architecture:** CSS-only color/surface changes across 8 CSS files + HTML cleanup (removing decorative shapes and background effects) across 2 HTML files + font import in index.html. No structural or logic changes.

**Tech Stack:** Angular 19, CSS custom properties, Google Fonts (Plus Jakarta Sans, Space Mono)

**Spec:** `docs/superpowers/specs/2026-03-19-white-theme-aesthetic-overhaul-design.md`

---

### Task 1: Font Imports & Global Design Tokens

**Files:**
- Modify: `src/index.html:14-16`
- Modify: `src/styles.css:8-27`

- [ ] **Step 1: Add Plus Jakarta Sans + Space Mono fonts to index.html**

Replace line 16 in `src/index.html`:
```html
<!-- OLD -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

<!-- NEW -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Update all :root CSS variables in styles.css**

Replace `:root` block (lines 8-27) in `src/styles.css`:
```css
:root {
  --bg: #f8f8fa;
  --bg-surface: #ffffff;
  --bg-elevated: #f2f2f7;
  --bg-border: #e5e5ea;
  --text-primary: #1d1d1f;
  --text-secondary: #6e6e73;
  --text-muted: #aeaeb2;
  --surface: rgba(0, 0, 0, 0.02);
  --border-frost: #e5e5ea;
  --shadow-sm: 0 2px 16px rgba(0, 0, 0, 0.04);
  --accent: #0054fa;
  --accent-cyan: #02d5d9;
  --accent-gradient: linear-gradient(135deg, #0054fa, #02d5d9);
  --radius-card: 28px;
  --radius-pill: 80px;
  --green: #02d5d9;
  --gold: #f59e0b;
  --dark: #1d1d1f;
  --font: 'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Space Mono', monospace;
  --transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 3: Verify build**

Run: `cd "/home/voxmastery/Documents/GIT website code/GIT website" && npx ng build 2>&1 | tail -5`
Expected: "Application bundle generation complete"

- [ ] **Step 4: Commit**

```bash
git add src/index.html src/styles.css
git commit -m "feat: update design tokens and font imports for white theme"
```

---

### Task 2: Global Component Styles (frost, buttons, typography, cleanup)

**Files:**
- Modify: `src/styles.css:89-264`

- [ ] **Step 1: Update .frost class (lines 90-97)**

```css
/* OLD */
.frost {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-card);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow: var(--shadow-sm);
}

/* NEW */
.frost {
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-sm);
}
```

- [ ] **Step 2: Update .section-title to use clamp (line 101)**

```css
/* OLD */
  font-size: 52px;

/* NEW */
  font-size: clamp(28px, 4vw, 52px);
```

- [ ] **Step 3: Add font-mono to .section-label (line 116-121)**

Add `font-family: var(--font-mono);` after line 120 (`text-transform: uppercase;`).

- [ ] **Step 4: Update .btn-pill (lines 129-143)**

```css
/* OLD */
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.12);

/* NEW */
  background: var(--bg-surface);
  color: var(--text-primary);
  border: 1px solid var(--bg-border);
```

Update `.btn-pill:hover` (lines 139-143):
```css
/* OLD */
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.2);

/* NEW */
  background: var(--bg-elevated);
  border-color: #d1d1d6;
```

- [ ] **Step 5: Update .btn-dark shadows (lines 154-160)**

```css
/* OLD */
  box-shadow: 0 4px 20px rgba(0, 102, 255, 0.25);
}
.btn-dark:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(0, 102, 255, 0.35);
}

/* NEW */
  box-shadow: 0 4px 20px rgba(0, 84, 250, 0.20);
}
.btn-dark:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 8px 30px rgba(0, 84, 250, 0.35);
}
```

- [ ] **Step 6: Remove shape classes and float keyframes (lines 162-250)**

Delete everything from `/* ---------- Wireframe shapes ---------- */` through `.float-5` (lines 162-250). These are dead code after HTML cleanup.

- [ ] **Step 7: Remove redundant mobile .section-title override (line 254-256)**

In the `@media (max-width: 768px)` block, remove:
```css
  .section-title {
    font-size: 32px;
  }
```
(clamp handles responsive sizing now)

- [ ] **Step 8: Verify build**

Run: `npx ng build 2>&1 | tail -5`
Expected: "Application bundle generation complete"

- [ ] **Step 9: Commit**

```bash
git add src/styles.css
git commit -m "feat: update global frost, button, and typography styles for white theme"
```

---

### Task 3: Remove Background Effects (app component)

**Files:**
- Modify: `src/app/app.component.html:3-7`
- Modify: `src/app/app.component.css:1-75`

- [ ] **Step 1: Remove dot-grid and glow-wave divs from app.component.html**

Remove lines 3-7:
```html
<!-- DELETE THESE LINES -->
<div class="dot-grid"></div>
<div class="glow-wave glow-1"></div>
<div class="glow-wave glow-2"></div>
<div class="glow-wave glow-3"></div>
```

File should become:
```html
<a class="skip-nav" href="#main-content">Skip to main content</a>

<app-header></app-header>
<main id="main-content">
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

- [ ] **Step 2: Gut app.component.css**

Replace entire file with:
```css
app-header {
  position: relative;
  z-index: 200;
}
main, app-footer {
  position: relative;
  z-index: 2;
}
```

- [ ] **Step 3: Verify build**

Run: `npx ng build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add src/app/app.component.html src/app/app.component.css
git commit -m "feat: remove dot-grid and glow-wave background effects"
```

---

### Task 4: Header / Navigation

**Files:**
- Modify: `src/app/components/header/header.component.css:29-142`

- [ ] **Step 1: Update scrolled nav styles (lines 29-38)**

```css
/* OLD */
.nav.scrolled .nav-inner {
  max-width: 860px;
  border-radius: var(--radius-pill);
  background: rgba(15, 15, 19, 0.75);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  padding: 18px 14px 18px 32px;
}

/* NEW */
.nav.scrolled .nav-inner {
  max-width: 860px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid var(--bg-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 18px 14px 18px 32px;
}
```

- [ ] **Step 2: Update CTA shadow (line 84)**

```css
/* OLD */
  box-shadow: 0 2px 12px rgba(0, 102, 255, 0.2);
/* NEW */
  box-shadow: 0 2px 12px rgba(0, 84, 250, 0.20);
```

- [ ] **Step 3: Update mobile nav-links dropdown (lines 117-132)**

```css
/* OLD */
    background: rgba(15, 15, 19, 0.95);
    ...
    border: 1px solid rgba(255, 255, 255, 0.08);

/* NEW */
    background: rgba(255, 255, 255, 0.95);
    ...
    border: 1px solid var(--bg-border);
```

- [ ] **Step 4: Update mobile link hover (line 140)**

```css
/* OLD */
  .nav-links a:hover { background: rgba(255,255,255,0.05); }
/* NEW */
  .nav-links a:hover { background: rgba(0,0,0,0.04); }
```

- [ ] **Step 5: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/components/header/header.component.css
git commit -m "feat: update nav to white glass theme"
```

---

### Task 5: Home Page HTML — Remove All Wireframe Shapes

**Files:**
- Modify: `src/app/pages/home/home.component.html:3-10,43-44,81-82,118-119,200-201`

- [ ] **Step 1: Remove ALL shape divs from home.component.html**

Delete these lines:
- Hero shapes: lines 3-10 (7 shape divs)
- What We Do shapes: lines 43-44 (2 shape divs)
- How We Work shapes: lines 81-82 (2 shape divs)
- Testimonials shapes: lines 118-119 (2 shape divs)
- CTA shapes: lines 200-201 (2 shape divs)

- [ ] **Step 2: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/pages/home/home.component.html
git commit -m "feat: remove all wireframe shape elements from home page"
```

---

### Task 6: Home Page CSS — Colors & Components

**Files:**
- Modify: `src/app/pages/home/home.component.css`

This is the largest change. Apply all edits in order:

- [ ] **Step 1: Hero badge (lines 35-44)**

```css
/* OLD */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  ...
  color: var(--accent-cyan);

/* NEW */
  background: rgba(0, 84, 250, 0.06);
  border: 1px solid rgba(0, 84, 250, 0.15);
  ...
  color: var(--accent);
```

- [ ] **Step 2: Green dot (line 45)**

```css
/* OLD */
.green-dot { ... background: var(--accent-cyan); ... }
/* NEW */
.green-dot { ... background: var(--accent); ... }
```

- [ ] **Step 3: Hero title — fluid sizing (line 47)**

```css
/* OLD */
  font-size: 72px;
/* NEW */
  font-size: clamp(42px, 6vw, 72px);
```

- [ ] **Step 4: Client logos (lines 85-90)**

```css
/* OLD */
  background: rgba(255, 255, 255, 0.06);
  ...
  border: 1px solid rgba(255, 255, 255, 0.08);
  filter: brightness(1.8) contrast(0.9);

/* NEW */
  background: var(--bg-surface);
  ...
  border: 1px solid var(--bg-border);
  filter: none;
```

- [ ] **Step 5: Statement sections — .thin, cells, right bg (lines 123, 147-157)**

```css
/* .stmt-headline .thin — line 123 */
  color: var(--text-muted);

/* .stmt-right — line 147 */
  background: var(--bg-elevated);

/* .stmt-cell — line 152 */
  background: var(--bg);

/* .stmt-cell:hover — line 157 */
  background: var(--bg-elevated);
```

- [ ] **Step 6: .stmt-cta WCAG fix (lines 137-140)**

```css
/* OLD */
  color: var(--accent-cyan);
}
.stmt-cta:hover { gap: 16px; color: var(--accent); }

/* NEW */
  color: var(--accent);
}
.stmt-cta:hover { gap: 16px; color: #0243c7; }
```

- [ ] **Step 7: Step cells and line (lines 188-203)**

```css
/* .step-cell — line 188 */
  background: var(--bg);

/* .step-cell:hover — line 193 */
  background: var(--bg-elevated);

/* .step-line — line 203 */
  background: var(--bg-border);
```

- [ ] **Step 8: Testimonial card — remove float, update hover (lines 230-260)**

```css
/* line 230 — remove idle animation */
  animation: none;

/* .tst-card::after glow — line 249 */
  background: radial-gradient(circle at center, rgba(0, 84, 250, 0.03) 0%, transparent 60%);

/* .tst-card:hover — lines 254-258 */
  box-shadow: 0 16px 40px rgba(0, 84, 250, 0.08);
  border-color: rgba(0, 84, 250, 0.15);
```

- [ ] **Step 9: Testimonial avatar (line 282)**

```css
/* OLD */
.tst-avatar { ... background: var(--accent); ... }
/* NEW */
.tst-avatar { ... background: var(--accent-gradient); ... }
```

- [ ] **Step 10: Tech marquee — pills and fade edges (lines 308-335)**

```css
/* Fade edges — lines 308-309 */
.tech-marquee-wrap::before { left: 0; background: linear-gradient(90deg, var(--bg), transparent); }
.tech-marquee-wrap::after { right: 0; background: linear-gradient(-90deg, var(--bg), transparent); }

/* .tech-pill — lines 318-329 */
  background: var(--bg-surface);
  border: 1px solid var(--bg-border);
  ...
  color: var(--text-secondary);
```

- [ ] **Step 11: CTA section — .thin and strong colors (lines 354, 361)**

```css
/* .cta-title .thin — line 354 */
  color: var(--text-muted);

/* .cta-sub strong — line 361 */
  color: var(--accent);
```

- [ ] **Step 12: Remove redundant mobile font overrides**

In `@media (max-width: 768px)` block, remove:
- `.hero-title { font-size: 42px; letter-spacing: -1.5px; }` (line 376) — clamp handles it
- `.cta-title { font-size: 36px; letter-spacing: -1px; }` (line 396) — clamp handles it

Keep `letter-spacing` adjustments by moving them to the non-media rule if desired, or just remove entirely.

- [ ] **Step 13: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/pages/home/home.component.css
git commit -m "feat: update home page CSS to white theme with WCAG-compliant colors"
```

---

### Task 7: Footer

**Files:**
- Modify: `src/app/components/footer/footer.component.css:1-86`

- [ ] **Step 1: Update footer bg (line 2)**

```css
  background: #1d1d1f;
```

- [ ] **Step 2: Update gradient separator (line 15)**

```css
  background: linear-gradient(90deg, transparent, rgba(0, 84, 250, 0.3), rgba(2, 213, 217, 0.2), transparent);
```

- [ ] **Step 3: Update footer link/text colors for contrast (lines 37-43)**

```css
.ft-col p,
.ft-col a {
  color: #aeaeb2;
  ...
}
```

- [ ] **Step 4: Update bottom bar (line 70)**

```css
  color: #6e6e73;
```

- [ ] **Step 5: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/components/footer/footer.component.css
git commit -m "feat: update footer to refined dark with contrast-safe text"
```

---

### Task 8: Services Page

**Files:**
- Modify: `src/app/pages/services/services.component.css:36-44`

- [ ] **Step 1: Update card bg and border (lines 36-38)**

```css
  background: var(--bg-surface);
  ...
  border: 1px solid var(--bg-border);
```

- [ ] **Step 2: Update hover (lines 42-44)**

```css
  box-shadow: 0 20px 60px rgba(0, 84, 250, 0.08);
  border-color: rgba(0, 84, 250, 0.15);
```

- [ ] **Step 3: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/pages/services/services.component.css
git commit -m "feat: update services cards to white theme"
```

---

### Task 9: Contact Page

**Files:**
- Modify: `src/app/pages/contacts/contacts.component.css:28-42,52`

- [ ] **Step 1: Update input styles (lines 35-36)**

```css
  border: 1px solid var(--bg-border);
  ...
  background: var(--bg);
```

- [ ] **Step 2: Update success icon (line 52)**

```css
.success-icon { ... background: var(--accent-gradient); ... }
```

- [ ] **Step 3: Verify build + Commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/pages/contacts/contacts.component.css
git commit -m "feat: update contact form inputs to white theme"
```

---

### Task 10: Final Build Verification

- [ ] **Step 1: Full build**

```bash
cd "/home/voxmastery/Documents/GIT website code/GIT website" && npx ng build 2>&1 | tail -10
```
Expected: zero errors, "Application bundle generation complete"

- [ ] **Step 2: Serve and visually verify**

```bash
npx ng serve --open &
```

Check all pages:
- `/` — warm off-white bg, white cards with borders, gradient CTAs, no shapes/dots
- `/about` — value cards have frost treatment, stats readable
- `/services` — white cards with border, blue hover glow
- `/contacts` — inputs visible on #f8f8fa, focus shows blue
- `/terms`, `/privacy` — text readable
- Mobile 375px — nav dropdown white glass, link hover visible

- [ ] **Step 3: Final commit if any fixes needed**
