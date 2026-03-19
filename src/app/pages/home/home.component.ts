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

    // Three-phase animation over 4000px of scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=4000',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // === PHASE 1 (0% - 20%): Dots spread apart to the right ===
    monoliths.forEach((monolith, i) => {
      tl.to(monolith, {
        x: (i + 1) * 120,
        duration: 0.2,
        ease: 'power2.out'
      }, 0);
    });

    // === PHASE 2 (20% - 50%): Dots morph into cards (staggered) ===
    monoliths.forEach((monolith, i) => {
      const offset = 0.2 + (i * 0.05);

      tl.to(monolith, {
        width: '340px',
        height: '440px',
        borderRadius: '24px',
        background: 'transparent',
        x: 0, // reset spread — cards take natural flow position
        boxShadow: '0 4px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(229,229,234,1)',
        duration: 0.12,
        ease: 'power2.inOut'
      }, offset);

      const content = monolith.querySelector('.monolith-content');
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.06,
          ease: 'power1.in'
        }, offset + 0.1);
      }
    });

    // === PHASE 3 (50% - 90%): Slide track left so all cards visible ===
    tl.to(track, {
      x: () => {
        // Calculate exact distance to bring last card into view
        const trackRight = track.scrollWidth;
        const available = window.innerWidth - 420; // 420 = intro width
        const overflow = trackRight - available;
        return overflow > 0 ? -overflow - 40 : 0;
      },
      duration: 0.4,
      ease: 'power1.inOut',
    }, 0.52);

    // === PHASE 4 (90% - 100%): Hold before unpin ===
    tl.to({}, { duration: 0.08 });

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
