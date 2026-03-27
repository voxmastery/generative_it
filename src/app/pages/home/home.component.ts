import { Component, Inject, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  private scrollHandler: (() => void) | null = null;
  private lenisInstance: any = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Lenis smooth scroll
    const Lenis = (await import('lenis')).default;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    this.lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    if (prefersReducedMotion) {
      // Show all content statically without animations
      this.showStaticContent();
      this.initCounters();
      return;
    }

    // Hero parallax
    const heroTitle = document.querySelector<HTMLElement>('.hero-title');
    const heroSub = document.querySelector<HTMLElement>('.hero-sub');
    const heroBadge = document.querySelector<HTMLElement>('.hero-badge');
    const heroCta = document.querySelector<HTMLElement>('.hero .btn-dark');
    const heroSection = document.querySelector<HTMLElement>('.hero');
    let ticking = false;

    this.scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = heroSection?.offsetHeight || 800;
          const progress = Math.min(scrollY / (heroHeight * 0.7), 1);

          if (heroTitle) {
            heroTitle.style.transform = `translateY(${progress * 80}px) scale(${1 + progress * 0.15})`;
            heroTitle.style.filter = `blur(${progress * 12}px)`;
            heroTitle.style.opacity = `${1 - progress}`;
          }
          if (heroSub) {
            heroSub.style.transform = `translateY(${progress * 40}px)`;
            heroSub.style.opacity = `${Math.max(0, 1 - progress * 1.5)}`;
          }
          if (heroBadge) {
            heroBadge.style.opacity = `${Math.max(0, 1 - progress * 2)}`;
          }
          if (heroCta) {
            heroCta.style.transform = `translateY(${progress * 30}px)`;
            heroCta.style.opacity = `${Math.max(0, 1 - progress * 1.8)}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    this.initServicesScroll();
    this.initTetrisDrop();
    this.initMagneticButtons();
    this.initCardTilt();
    this.initHeroTextReveal();
    this.initScrollReveal();
    this.initCounters();
  }

  /** Show all animated content statically for reduced-motion users */
  private showStaticContent(): void {
    // Show hero elements
    document.querySelectorAll<HTMLElement>('.hero-badge, .hero-title, .hero-sub, .hero .btn-dark').forEach(el => {
      el.style.opacity = '1';
    });
    // Show service cards expanded
    document.querySelectorAll<HTMLElement>('.service-monolith').forEach(m => {
      m.style.width = window.innerWidth <= 768 ? '100%' : '300px';
      m.style.height = window.innerWidth <= 768 ? 'auto' : '400px';
      m.style.borderRadius = '20px';
      m.style.background = '#ffffff';
      m.style.boxShadow = '0 4px 32px rgba(0,0,0,0.06)';
      const content = m.querySelector<HTMLElement>('.monolith-content');
      if (content) content.style.opacity = '1';
    });
    // Show HWW card and cells
    const hwwCard = document.querySelector<HTMLElement>('.hww-card');
    const hwwIntro = document.querySelector<HTMLElement>('.hww-intro');
    if (hwwCard) { hwwCard.style.opacity = '1'; hwwCard.style.transform = 'none'; }
    if (hwwIntro) hwwIntro.style.opacity = '1';
    document.querySelectorAll<HTMLElement>('.drop-cell').forEach(cell => {
      cell.style.opacity = '1';
      cell.style.transform = 'none';
    });
    // Show scroll-reveal elements
    document.querySelectorAll<HTMLElement>('.tst-section .section-title, .tst-section .section-sub, .tst-card, .tech-section .section-label, .cta-title, .cta-sub, .cta-section .btn-dark').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  private async initServicesScroll() {
    if (window.innerWidth <= 768) {
      this.initMobileServicesCarousel();
      return;
    }

    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.wwd-scroll-section');
    const track = document.querySelector<HTMLElement>('.wwd-track');
    const monoliths = document.querySelectorAll<HTMLElement>('.service-monolith');

    if (!section || !track || monoliths.length === 0) return;

    // How far right the dots need to travel
    const travelDistance = window.innerWidth - 400;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // === PHASE 1 (0% - 30%): Dots travel LEFT to RIGHT ===
    // Each dot goes further right (staggered spread)
    monoliths.forEach((monolith, i) => {
      tl.to(monolith, {
        x: travelDistance - (i * 60), // spread: first goes furthest right
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0);
    });

    // === PHASE 2 (30% - 75%): Dots slide back LEFT, morphing into cards ===
    monoliths.forEach((monolith, i) => {
      const stagger = 0.30 + (i * 0.08); // each card starts 8% after previous

      // Morph dot → card while returning to natural position
      tl.to(monolith, {
        x: 0,
        width: '300px',
        height: '400px',
        borderRadius: '24px',
        background: 'transparent',
        boxShadow: '0 4px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,229,234,1)',
        duration: 0.20,
        ease: 'power2.out'
      }, stagger);

      // Fade in content once card is formed
      const content = monolith.querySelector('.monolith-content');
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.08,
          ease: 'power1.in'
        }, stagger + 0.15);
      }
    });

    // === PHASE 3 (75% - 95%): Slide track left so all 4 cards are visible ===
    tl.to(track, {
      x: () => {
        const introWidth = 390;
        const available = window.innerWidth - introWidth;
        const cardsTotal = (300 * 4) + (24 * 3);
        const overflow = cardsTotal - available;
        return overflow > 0 ? -(overflow + 80) : 0;
      },
      duration: 0.20,
      ease: 'power1.inOut',
    }, 0.72);

    // === PHASE 4 (95% - 100%): Hold before unpin ===
    tl.to({}, { duration: 0.05 });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) ScrollTrigger.refresh();
    });
  }

  private async initTetrisDrop() {
    if (window.innerWidth <= 768) return;

    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.hww-drop-section');
    const card = document.querySelector<HTMLElement>('.hww-card');
    const intro = document.querySelector<HTMLElement>('.hww-intro');
    const cells = document.querySelectorAll<HTMLElement>('.drop-cell');

    if (!section || !card || !intro || cells.length === 0) return;

    const startRotations = [-4, 3, -2, 5];

    // Set initial states
    gsap.set(card, { x: -800, opacity: 0 });
    gsap.set(intro, { opacity: 0 });
    cells.forEach((cell, i) => {
      gsap.set(cell, {
        y: -500,
        rotation: startRotations[i],
        opacity: 0,
        transformOrigin: 'center center',
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1200',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Phase 1 (0-20%): Container slides in from left
    tl.to(card, {
      x: 0,
      opacity: 1,
      duration: 0.20,
      ease: 'power3.out',
    }, 0);

    // Phase 2 (15-30%): Intro text fades in
    tl.to(intro, {
      opacity: 1,
      duration: 0.12,
      ease: 'power1.in',
    }, 0.15);

    // Phase 3 (30-90%): Cards drop in one by one with bounce
    cells.forEach((cell, i) => {
      const stagger = 0.30 + (i * 0.15);

      tl.to(cell, {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.15,
        ease: 'bounce.out',
      }, stagger);
    });

    // Phase 4: Hold before unpin
    tl.to({}, { duration: 0.12 });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) ScrollTrigger.refresh();
    });
  }

  private async initScrollReveal() {
    if (!this.isBrowser || window.innerWidth <= 768) return;

    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // Fade-up elements that should animate on scroll
    const revealElements = document.querySelectorAll(
      '.tst-section .section-title, .tst-section .section-sub, .tst-card, .tech-section .section-label, .cta-title, .cta-sub, .cta-section .btn-dark'
    );

    revealElements.forEach((el) => {
      gsap.fromTo(el as HTMLElement,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }

  private async initCounters() {
    if (!this.isBrowser) return;

    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const counters = document.querySelectorAll('.client-stat-num');

    counters.forEach((counter) => {
      const el = counter as HTMLElement;
      const text = el.textContent || '';
      const match = text.match(/(\d+)/);
      if (!match) return;

      const target = parseInt(match[1]);
      const suffix = text.replace(match[1], '');
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val) + suffix;
        }
      });
    });
  }

  private async initHeroTextReveal() {
    if (!this.isBrowser) return;

    const gsapModule = await import('gsap');
    const gsap = gsapModule.default || gsapModule.gsap;

    // Stagger-reveal hero elements
    const heroElements = [
      '.hero-badge',
      '.hero-title',
      '.hero-sub',
      '.hero .btn-dark'
    ];

    gsap.fromTo(heroElements.map(s => document.querySelector(s)).filter(Boolean),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 2.5, // after loader finishes
      }
    );
  }

  private initCardTilt() {
    if (!this.isBrowser) return;

    const cards = document.querySelectorAll<HTMLElement>('.tst-card, .monolith-content');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  private async initMobileServicesCarousel() {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.wwd-scroll-section');
    const monoliths = document.querySelectorAll<HTMLElement>('.service-monolith');

    if (!section || monoliths.length === 0) return;

    const vw = window.innerWidth;
    const cardWidth = vw - 56;
    // Calculate card height: fill available track space (track is flex:1)
    const track = document.querySelector('.wwd-track') as HTMLElement;
    const trackHeight = track?.offsetHeight || 300;
    const cardHeight = Math.min(trackHeight - 16, 340); // leave 16px breathing room, cap at 340
    const dotSize = 16;

    // Set all monoliths as dots off-screen right
    monoliths.forEach((m) => {
      gsap.set(m, {
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        x: vw + 50,
        opacity: 1,
        background: '#0E6FFF',
        boxShadow: '0 0 10px rgba(14,111,255,0.3)',
      });
      const content = m.querySelector('.monolith-content') as HTMLElement;
      if (content) gsap.set(content, { opacity: 0 });
    });

    const perCard = 0.24;
    const totalScroll = 3500;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    monoliths.forEach((monolith, i) => {
      const s = i * perCard;
      const content = monolith.querySelector('.monolith-content');

      // === ENTER: Dot glides from right to center ===
      tl.to(monolith, {
        x: 0,
        duration: 0.05,
        ease: 'power3.out',
      }, s);

      // === MORPH: Dot smoothly expands into card ===
      tl.to(monolith, {
        width: cardWidth,
        height: cardHeight,
        borderRadius: '20px',
        background: '#ffffff',
        boxShadow: '0 4px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,229,234,1)',
        duration: 0.06,
        ease: 'power2.inOut',
      }, s + 0.04);

      // === REVEAL: Content fades in ===
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.04,
          ease: 'power1.in',
        }, s + 0.08);
      }

      // === HOLD: Card stays visible for reading ===

      // === EXIT: Content fades, card shrinks to dot, exits left ===
      if (i < monoliths.length - 1) {
        if (content) {
          tl.to(content, {
            opacity: 0,
            duration: 0.03,
          }, s + 0.15);
        }

        // Shrink back to dot smoothly
        tl.to(monolith, {
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: '#0E6FFF',
          boxShadow: '0 0 10px rgba(14,111,255,0.3)',
          duration: 0.05,
          ease: 'power2.inOut',
        }, s + 0.17);

        // Dot glides out left
        tl.to(monolith, {
          x: -(vw + 50),
          duration: 0.04,
          ease: 'power3.in',
        }, s + 0.21);
      }
    });

    // Hold last card before unpin
    tl.to({}, { duration: 0.06 });
  }

  private initMagneticButtons() {
    if (!this.isBrowser) return;

    const buttons = document.querySelectorAll<HTMLElement>('.btn-dark');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease-out';
      });
    });
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.lenisInstance) {
      this.lenisInstance.destroy();
    }
  }
}
