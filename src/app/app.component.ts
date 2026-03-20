import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'stark';
  loaderHidden = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onLoaderAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'loader-slide-up') {
      this.loaderHidden = true;
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const container = document.getElementById('sparkleContainer');
      if (!container) return;

      const colors = ['#0E6FFF', '#00F0FF', '#0E6FFF', '#00F0FF', '#8b5cf6'];
      const sizes = [8, 10, 12, 14, 16];
      let lastSpawn = 0;
      let lastX = 0, lastY = 0;

      window.addEventListener('mousemove', (e) => {
        const now = Date.now();
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        // Only spawn sparkles when moving fast enough, throttled to every 60ms
        if (now - lastSpawn < 60 || speed < 8) {
          lastX = e.clientX;
          lastY = e.clientY;
          return;
        }

        lastSpawn = now;
        lastX = e.clientX;
        lastY = e.clientY;

        // Spawn 1-2 sparkles at cursor position
        const count = speed > 30 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';

          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = sizes[Math.floor(Math.random() * sizes.length)];
          const offsetX = (Math.random() - 0.5) * 20;
          const offsetY = (Math.random() - 0.5) * 20;

          sparkle.style.left = (e.clientX + offsetX) + 'px';
          sparkle.style.top = (e.clientY + offsetY) + 'px';
          sparkle.style.setProperty('--sparkle-color', color);
          sparkle.style.setProperty('--sparkle-size', size + 'px');

          container.appendChild(sparkle);

          // Remove after animation completes
          setTimeout(() => sparkle.remove(), 800);
        }

        // Safety: limit max sparkles in DOM
        while (container.children.length > 30) {
          container.removeChild(container.firstChild!);
        }
      });
    }
  }
}
