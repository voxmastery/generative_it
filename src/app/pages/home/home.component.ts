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

    // Hero parallax (scroll-driven, no GSAP needed)
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
            const opacity = 1 - progress * 1.5;
            const translateY = progress * 40;
            heroSub.style.transform = `translateY(${translateY}px)`;
            heroSub.style.opacity = `${Math.max(0, opacity)}`;
          }

          if (heroBadge) {
            const opacity = 1 - progress * 2;
            heroBadge.style.opacity = `${Math.max(0, opacity)}`;
          }

          if (heroCta) {
            const opacity = 1 - progress * 1.8;
            const translateY = progress * 30;
            heroCta.style.transform = `translateY(${translateY}px)`;
            heroCta.style.opacity = `${Math.max(0, opacity)}`;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    // GSAP horizontal scroll for What We Do monoliths
    this.initServicesScroll();
  }

  private async initServicesScroll() {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');

    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.default || scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const section = document.querySelector('.wwd-scroll-section');
    const track = document.querySelector('.wwd-track');
    const monoliths = document.querySelectorAll('.service-monolith');

    if (!section || !track || monoliths.length === 0) return;

    const getScrollDistance = () => {
      return track.scrollWidth - window.innerWidth + 400;
    };

    // Pin the section and create the horizontal scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Scroll the track horizontally
    tl.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
    }, 0);

    // Morph each monolith from dot to card (staggered)
    monoliths.forEach((monolith, index) => {
      tl.to(monolith, {
        width: '380px',
        height: '480px',
        borderRadius: '24px',
        background: 'transparent',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 84, 250, 0.08)',
        duration: 0.5,
        ease: 'power2.inOut'
      }, index * 0.3);

      // Fade in card content after morph
      const content = monolith.querySelector('.monolith-content');
      if (content) {
        tl.to(content, {
          opacity: 1,
          duration: 0.2
        }, (index * 0.3) + 0.3);
      }
    });

    // Refresh on resize
    window.addEventListener('resize', () => ScrollTrigger.refresh());
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
