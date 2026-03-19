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
            const scale = 1 + progress * 0.15;
            const blur = progress * 12;
            const opacity = 1 - progress;
            const translateY = progress * 80;
            heroTitle.style.transform = `translateY(${translateY}px) scale(${scale})`;
            heroTitle.style.filter = `blur(${blur}px)`;
            heroTitle.style.opacity = `${opacity}`;
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

    // Services horizontal scroll
    this.initServicesScroll();
  }

  private async initServicesScroll() {
    // Skip on mobile — CSS handles vertical layout
    if (window.innerWidth <= 768) return;

    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.wwd-scroll-section');
    const track = document.querySelector<HTMLElement>('.wwd-track');
    const monoliths = document.querySelectorAll('.service-monolith');

    if (!section || !track || monoliths.length === 0) return;

    // Total scroll distance: enough for morph phase + slide phase
    const totalScroll = 3000;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // === PHASE 1 (0% - 35%): Dots morph into cards ===
    monoliths.forEach((monolith, i) => {
      const startAt = i * 0.06; // stagger: 0, 0.06, 0.12, 0.18

      // Morph dot → card
      tl.to(monolith, {
        width: '360px',
        height: '460px',
        borderRadius: '24px',
        background: 'rgba(255,255,255,0)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,229,234,1)',
        duration: 0.15,
        ease: 'power2.out'
      }, startAt);

      // Fade in content
      const content = monolith.querySelector('.monolith-content');
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.08,
          ease: 'power1.in'
        }, startAt + 0.12);
      }
    });

    // === PHASE 2 (35% - 95%): Slide track horizontally ===
    tl.to(track, {
      x: () => {
        const trackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(trackWidth - viewportWidth + 100);
      },
      duration: 0.6,
      ease: 'none',
    }, 0.35);

    // === PHASE 3 (95% - 100%): Brief pause before unpin ===
    tl.to({}, { duration: 0.05 });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        ScrollTrigger.refresh();
      }
    });
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
