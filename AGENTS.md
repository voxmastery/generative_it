# Agent Memory

## Angular

- When using `[routerLinkActiveOptions]` on router links, import `RouterLinkActive` from `@angular/router` in addition to `RouterLink`; otherwise NG8002 build error occurs.
- Header component: `src/app/components/header/` (template + component).
- Prefer `@if` over `*ngIf` when no other CommonModule imports needed; avoids NG8103/NG0303.
- For simple animations (e.g. loader), use pure CSS `@keyframes` instead of GSAP; GSAP can cause "Missing plugin" / CSSPlugin tree-shaking issues with Angular/Vite.

## Project Structure

- Home page: `src/app/pages/home/`, not `src/app/components/home/`.
- Services page heading: "Services we offer".

## Our Clients Section

- No white containers for logos; logos sit directly on section background (transparent cards).
- Section is label plus logo marquee only; no headline, stats, or "View our work" CTA.
- When scaling: increase logo and marquee text size, keep "OUR CLIENTS" label unchanged.
- Prefer 2 sets of logos (6 items) for marquee; use `translateX(-50%)` keyframe for seamless loop.
- Logo sizes: desktop 240px height, max-width 400px; balance larger logos with fewer copies.
- Reference sites for Our Clients styling: apolloinfotech.com, consumer-sketch.com, dgtalists.com, dynodesoft.com, makewaystech.com, rovae.in, techupr.com.

## Design References

- Design mockup folder: `/home/voxmastery/Documents/referene` (29 HTML files).
