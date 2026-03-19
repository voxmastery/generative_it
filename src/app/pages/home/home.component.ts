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

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

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
    this.initDropCards();
  }

  private async initServicesScroll() {
    if (window.innerWidth <= 768) return;

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
        end: '+=3500',
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

  private async initDropCards() {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll<HTMLElement>('.drop-card');
    if (cards.length === 0) return;

    // Set initial state — each card starts higher, with different rotation
    cards.forEach((card, i) => {
      gsap.set(card, {
        y: -(180 + i * 40),       // higher for later cards
        rotation: -5 + (i * 3),    // varied tilt: -5, -2, 1, 4
        scale: 0.75,
        opacity: 0,
      });
    });

    // Each card drops independently, triggered by scroll
    cards.forEach((card, i) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: '.hww-drop-zone',
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.18,  // stagger: 0s, 0.18s, 0.36s, 0.54s
        ease: 'bounce.out',
        onComplete: () => card.classList.add('landed'),
        onReverseComplete: () => card.classList.remove('landed'),
      });
    });
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
