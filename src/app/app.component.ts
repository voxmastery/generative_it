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
      this.initSparkleCanvas();
    }
  }

  private initSparkleCanvas() {
    const canvas = document.getElementById('sparkleCanvas') as HTMLCanvasElement;
    if (!canvas || window.matchMedia('(pointer: coarse)').matches) return;

    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    interface Sparkle {
      x: number; y: number;
      size: number; rotation: number;
      opacity: number; life: number;
      maxLife: number; vy: number;
      color: string; rotSpeed: number;
    }

    const sparkles: Sparkle[] = [];
    const colors = ['#0E6FFF', '#00F0FF', '#0E6FFF', '#00F0FF', '#8b5cf6'];
    let mouseX = 0, mouseY = 0, lastX = 0, lastY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 3) {
        const count = speed > 40 ? 3 : speed > 15 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          sparkles.push({
            x: mouseX + (Math.random() - 0.5) * 20,
            y: mouseY + (Math.random() - 0.5) * 20,
            size: 4 + Math.random() * 8,
            rotation: Math.random() * Math.PI * 2,
            opacity: 0.7 + Math.random() * 0.3,
            life: 0,
            maxLife: 30 + Math.random() * 20,
            vy: -(0.5 + Math.random() * 1.5),
            color: colors[Math.floor(Math.random() * colors.length)],
            rotSpeed: (Math.random() - 0.5) * 0.15,
          });
        }
      }

      lastX = mouseX;
      lastY = mouseY;
    });

    // Draw 4-point star shape
    const drawStar = (cx: number, cy: number, size: number, rotation: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      const s = size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.1, -s * 0.1, s * 0.1, -s * 0.1, s, 0);
      ctx.bezierCurveTo(s * 0.1, s * 0.1, s * 0.1, s * 0.1, 0, s);
      ctx.bezierCurveTo(-s * 0.1, s * 0.1, -s * 0.1, s * 0.1, -s, 0);
      ctx.bezierCurveTo(-s * 0.1, -s * 0.1, -s * 0.1, -s * 0.1, 0, -s);
      ctx.closePath();
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life++;
        s.y += s.vy;
        s.rotation += s.rotSpeed;
        s.opacity *= 0.96;

        if (s.life > s.maxLife) {
          sparkles.splice(i, 1);
          continue;
        }

        const progress = s.life / s.maxLife;
        const scale = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        ctx.globalAlpha = s.opacity * scale;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;

        drawStar(s.x, s.y, s.size * scale, s.rotation);
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      // Cap max particles
      if (sparkles.length > 60) sparkles.splice(0, sparkles.length - 60);

      requestAnimationFrame(animate);
    };

    animate();
  }
}
