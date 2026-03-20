# White Theme Aesthetic Overhaul — Design Spec

## Context

The client reviewed the live site at generativeitsolutions.netlify.app (white/light theme) and said the colors "aren't aesthetic." After analyzing competitor sites (Rovae, Dgtalists, TechupR) and 28+ reference design files, we're keeping the white theme but upgrading it to a "Warm Layered" premium aesthetic with blue-to-cyan gradient accents.

**Approach:** "Rovae White" — invert Rovae's proven dark formula for a light theme. Bordered white cards on off-white background, blue-to-cyan gradient CTAs, Plus Jakarta Sans headlines.

## Color System & Design Tokens

### New `:root` variables (src/styles.css)

```css
--bg:              #f8f8fa
--bg-surface:      #ffffff
--bg-elevated:     #f2f2f7
--bg-border:       #e5e5ea
--text-primary:    #1d1d1f
--text-secondary:  #6e6e73
--text-muted:      #aeaeb2
--surface:         rgba(0, 0, 0, 0.02)
--border-frost:    #e5e5ea
--shadow-sm:       0 2px 16px rgba(0,0,0,0.04)
--accent:          #0054fa
--accent-cyan:     #02d5d9
--accent-gradient: linear-gradient(135deg, #0054fa, #02d5d9)
--green:           #02d5d9
--gold:            #f59e0b
--dark:            #1d1d1f
--font:            'Plus Jakarta Sans', 'Inter', ui-sans-serif, system-ui, sans-serif
--font-mono:       'Space Mono', monospace
```

### Surface Token Mapping

| Token | Value | Usage |
|-------|-------|-------|
| `.frost` bg | `#ffffff` | Card backgrounds |
| `.frost` border | `1px solid var(--bg-border)` | Card borders |
| `.frost` shadow | `var(--shadow-sm)` | Card depth |
| `.frost` backdrop-filter | **Remove** | No visual purpose on white |
| `.btn-dark` shadow | `rgba(0,84,250,0.20)` | CTA glow |
| `.btn-dark` hover shadow | `rgba(0,84,250,0.35)` | CTA hover glow |
| `.btn-pill` bg | `#ffffff` | Ghost button |
| `.btn-pill` border | `1px solid var(--bg-border)` | Ghost button border |
| `.btn-pill` hover bg | `var(--bg-elevated)` / `#f2f2f7` | Darken on hover (not lighten) |
| `.btn-pill` hover border | `#d1d1d6` | Darker border on hover |

## Typography Upgrade

### Font Stack Changes

Add to `src/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Sizing (fluid with clamp)

| Element | Selector | File | Current | New |
|---------|----------|------|---------|-----|
| Hero title | `.hero-title` | home.component.css:47 | `font-size: 72px` | `clamp(42px, 6vw, 72px)` |
| Section title | `.section-title` | styles.css:101 | `font-size: 52px` | `clamp(28px, 4vw, 52px)` |
| CTA title | `.cta-title` | home.component.css:348 | `font-size: 56px` | `clamp(36px, 5vw, 56px)` |

**Cleanup:** Remove redundant mobile `@media` font-size overrides for `.section-title` (styles.css:255), `.hero-title` (home.component.css:376), and `.cta-title` (home.component.css:396) since `clamp()` handles responsive sizing.

### Mono Labels

Add `font-family: var(--font-mono);` to the `.section-label` rule in styles.css (line 116).

## Component Changes

### Nav (header.component.css)

| Property | Old | New |
|----------|-----|-----|
| Scrolled bg | `rgba(15,15,19,0.75)` | `rgba(255,255,255,0.85)` |
| Scrolled border | `rgba(255,255,255,0.08)` | `1px solid var(--bg-border)` |
| Scrolled box-shadow | `rgba(0,0,0,0.3)` | `rgba(0,0,0,0.06)` |
| CTA shadow | `rgba(0,102,255,0.2)` | `rgba(0,84,250,0.20)` |
| Mobile dropdown bg | `rgba(15,15,19,0.95)` | `rgba(255,255,255,0.95)` |
| Mobile dropdown border | `rgba(255,255,255,0.08)` | `1px solid var(--bg-border)` |
| Mobile link hover bg | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.04)` |

### Hero (home.component.css + home.component.html)

- **Remove from HTML:** ALL wireframe shape elements across ALL sections (Hero, What We Do, How We Work, Testimonials, CTA)
- **Badge:** `background: rgba(0,84,250,0.06)`, `border: 1px solid rgba(0,84,250,0.15)`, `color: #0054fa`
- **Badge dot:** `background: #0054fa`
- **Gradient text:** Updated to new `--accent-gradient`

### App Root (app.component.css + app.component.html)

- **Remove from HTML:** `.dot-grid` div, all `.glow-wave` divs
- **Remove from CSS:** `.dot-grid`, `.glow-wave`, `.glow-1/2/3` rules and all drift keyframes
- **Remove from styles.css:** `.shape-*` classes, `.float-*` animation classes, and `@keyframes float1/2/3` (dead code after HTML removal)

### Clients (home.component.css)

| Property | Old | New |
|----------|-----|-----|
| Logo card bg | `rgba(255,255,255,0.06)` | `#ffffff` |
| Logo card border | `rgba(255,255,255,0.08)` | `1px solid var(--bg-border)` |
| Logo filter | `brightness(1.8) contrast(0.9)` | `none` |

### What We Do / How We Work (home.component.css)

| Property | Old | New |
|----------|-----|-----|
| `.stmt-headline .thin` | `#a0a0b4` | `var(--text-muted)` |
| `.stmt-cell` bg | `rgba(255,255,255,0.03)` | `var(--bg)` / `#f8f8fa` |
| `.stmt-cell` hover bg | `rgba(255,255,255,0.06)` | `var(--bg-elevated)` / `#f2f2f7` |
| `.stmt-right` bg | `rgba(255,255,255,0.04)` | `var(--bg-elevated)` |
| `.stmt-cta` color | `var(--accent-cyan)` | `var(--accent)` / `#0054fa` (WCAG fix) |
| `.stmt-cta:hover` color | `var(--accent)` | `#0243c7` (darker blue on hover) |
| `.step-cell` bg | `rgba(255,255,255,0.03)` | `var(--bg)` |
| `.step-cell` hover | `rgba(255,255,255,0.06)` | `var(--bg-elevated)` |
| `.step-line` | `rgba(255,255,255,0.18)` | `var(--bg-border)` |
| `.cta-title .thin` | `#a0a0b4` | `var(--text-muted)` |
| `.cta-sub strong` | `var(--accent-cyan)` | `var(--accent)` (WCAG fix) |

### Testimonials (home.component.css)

| Property | Old | New |
|----------|-----|-----|
| Idle float animation | Active | **Remove** (`animation: none`) |
| Hover glow pseudo | `rgba(0,102,255,0.06)` | `rgba(0,84,250,0.03)` |
| Hover border | `rgba(0,102,255,0.2)` | `rgba(0,84,250,0.15)` |
| Hover shadow | `rgba(0,0,0,0.2)` | `rgba(0,84,250,0.08)` |
| Avatar bg | `var(--accent)` flat | `var(--accent-gradient)` |

### Tech Marquee (home.component.css)

| Property | Old | New |
|----------|-----|-----|
| Pill bg | `rgba(255,255,255,0.06)` | `#ffffff` |
| Pill border | `rgba(255,255,255,0.10)` | `1px solid var(--bg-border)` |
| Pill text color | `#a0a0b4` | `var(--text-secondary)` |
| Fade edge gradient | `#0f0f13` | `var(--bg)` / `#f8f8fa` |

### Footer (footer.component.css)

| Property | Old | New |
|----------|-----|-----|
| Background | `#0a0a0e` | `#1d1d1f` |
| Border top | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.08)` |
| Gradient separator | `rgba(0,102,255,0.3), rgba(0,212,170,0.2)` | `rgba(0,84,250,0.3), rgba(2,213,217,0.2)` |
| Bottom bar color | `#48484a` | `#6e6e73` |
| `.ft-col p, .ft-col a` color | `var(--text-secondary)` | `#aeaeb2` (lighter for dark bg contrast) |

### Services Page (services.component.css)

| Property | Old | New |
|----------|-----|-----|
| Card bg | `rgba(255,255,255,0.03)` | `#ffffff` |
| Card border | `rgba(255,255,255,0.06)` | `1px solid var(--bg-border)` |
| Hover shadow | `rgba(0,102,255,0.1)` | `rgba(0,84,250,0.08)` |
| Hover border | `rgba(0,102,255,0.15)` | `rgba(0,84,250,0.15)` |

### Contact Page (contacts.component.css)

| Property | Old | New |
|----------|-----|-----|
| Input bg | `rgba(255,255,255,0.04)` | `var(--bg)` / `#f8f8fa` |
| Input border | `rgba(255,255,255,0.08)` | `1px solid var(--bg-border)` |
| Focus border | `var(--accent)` | `#0054fa` (same via var) |
| Success icon bg | `var(--green)` | `var(--accent-gradient)` |

## Files to Modify

1. **src/index.html** — Add Plus Jakarta Sans + Space Mono font imports
2. **src/styles.css** — `:root` variables, `.frost`, `.btn-pill`, `.btn-dark`, `.section-label`, font vars, remove `.shape-*`/`.float-*` dead code
3. **src/app/app.component.css** — Remove dot-grid and glow-wave styles entirely
4. **src/app/app.component.html** — Remove dot-grid and glow-wave divs
5. **src/app/components/header/header.component.css** — Scrolled nav bg/shadow, CTA shadow, mobile dropdown bg/hover
6. **src/app/pages/home/home.component.css** — All color refs, client logos, tech pills, testimonials, marquee, cells, WCAG fixes for cyan text
7. **src/app/pages/home/home.component.html** — Remove ALL wireframe shape elements from ALL sections
8. **src/app/components/footer/footer.component.css** — bg, separator gradient, link colors for contrast
9. **src/app/pages/services/services.component.css** — Card bg/border/hover
10. **src/app/pages/contacts/contacts.component.css** — Input bg/border, success icon

## What's NOT Changing

- Page structure / HTML layout (except removing shapes/glows)
- Terms, Privacy, 404 pages (inherit global styles correctly)
- Section spacing system (8px grid)
- Animation easing/timing (--transition)
- Icon tint colors (per-service colors stay)
- Service page images
- FontAwesome icons
- About page (inherits tokens, frost class updates apply automatically)

## Verification Plan

1. `npx ng build` — zero errors
2. Localhost:4200 visual check (home page):
   - Background is warm off-white (#f8f8fa), not pure white
   - Cards have visible #e5e5ea borders with subtle shadow
   - Gradient CTAs are blue-to-cyan
   - Text is dark (#1d1d1f primary) — readable, not harsh
   - No wireframe shapes or dot grid visible
   - Client logos display naturally (no brightness filter)
   - Tech pills are white with borders, readable
   - Nav on scroll has white glass effect with subtle shadow
   - Footer is clean dark (#1d1d1f) with gradient separator
   - Footer link text is readable on dark background
3. /services — cards are white with border, hover shows blue glow
4. /contacts — inputs have visible borders on #f8f8fa bg, focus shows blue
5. /about — value cards get frost treatment, stat numbers readable, team photos natural
6. /terms, /privacy — text readable on light background
7. Mobile 375px — all colors work, nav dropdown is white glass, link hover visible
8. WCAG check — no cyan text on white surfaces (all changed to accent blue)
