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
  }

  ngOnDestroy() {
    if (this.isBrowser && this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
