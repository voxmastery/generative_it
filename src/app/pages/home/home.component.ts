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

    const shapes = document.querySelectorAll<HTMLElement>('[data-speed]');
    let ticking = false;

    this.scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          shapes.forEach(shape => {
            const speed = parseFloat(shape.dataset['speed'] || '0');
            shape.style.transform = `translateY(${scrollY * speed}px)`;
          });
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
