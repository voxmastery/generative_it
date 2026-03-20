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
      const glow = document.getElementById('cursorGlow');
      if (glow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;

        window.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          glow.classList.add('active');
        });

        const animateGlow = () => {
          glowX += (mouseX - glowX) * 0.08;
          glowY += (mouseY - glowY) * 0.08;
          glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
          requestAnimationFrame(animateGlow);
        };
        requestAnimationFrame(animateGlow);

        // Hide on mouse leave
        document.addEventListener('mouseleave', () => glow.classList.remove('active'));
        document.addEventListener('mouseenter', () => glow.classList.add('active'));
      }
    }
  }
}
