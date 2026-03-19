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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // === SIMULTANEOUS: Morph cards + slide track (like reference) ===
    // Both happen at position 0, running together

    // Slide track left — runs the entire duration
    tl.to(track, {
      x: () => {
        // After morph, 4 cards at 340px + 3 gaps at 32px = 1456px total track width
        // Available space = viewport - intro(440px including padding)
        const introWidth = 440;
        const available = window.innerWidth - introWidth;
        const cardsTotal = (340 * 4) + (32 * 3);
        const overflow = cardsTotal - available;
        return overflow > 0 ? -(overflow + 60) : 0; // 60px breathing room
      },
      duration: 1,
      ease: 'none',
    }, 0);

    // Morph each dot → card (staggered, simultaneous with slide)
    monoliths.forEach((monolith, i) => {
      const stagger = i * 0.12; // each card morphs 12% after previous

      tl.to(monolith, {
        width: '340px',
        height: '440px',
        borderRadius: '24px',
        background: 'transparent',
        boxShadow: '0 4px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,229,234,1)',
        duration: 0.25,
        ease: 'power2.inOut'
      }, stagger);

      // Fade in content after morph
      const content = monolith.querySelector('.monolith-content');
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.1,
          ease: 'power1.in'
        }, stagger + 0.18);
      }
    });

    // Hold briefly before unpin
    tl.to({}, { duration: 0.05 });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) ScrollTrigger.refresh();
    });
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
