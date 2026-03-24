import { useEffect, useRef } from 'react';
import type { Theme } from '@/hooks/useTheme';

type AetherFlowHeroProps = {
  className?: string;
  theme?: Theme;
};

type MouseState = {
  x: number | null;
  y: number | null;
  radius: number;
};

type Bounds = {
  width: number;
  height: number;
};

class Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;

  constructor(x: number, y: number, dx: number, dy: number, size: number, color: string) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D, bounds: Bounds, mouse: MouseState) {
    if (this.x > bounds.width || this.x < 0) this.dx = -this.dx;
    if (this.y > bounds.height || this.y < 0) this.dy = -this.dy;

    if (mouse.x !== null && mouse.y !== null) {
      const deltaX = mouse.x - this.x;
      const deltaY = mouse.y - this.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 0 && distance < mouse.radius + this.size) {
        const forceX = deltaX / distance;
        const forceY = deltaY / distance;
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= forceX * force * 5;
        this.y -= forceY * force * 5;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw(ctx);
  }
}

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function AetherFlowHero({ className, theme = 'dark' }: AetherFlowHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // keep a mutable ref so the running animation loop reads the latest theme
  const themeRef = useRef<Theme>(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let particles: Particle[] = [];
    const mouse: MouseState = { x: null, y: null, radius: 200 };
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    const getBounds = (): Bounds => ({ width: window.innerWidth, height: window.innerHeight });

    /**
     * Returns theme-aware colours.
     * Dark:  violet / white-near
     * Light: cobalt / cobalt-lighter (translucent so the ivory bg shows)
     */
    const getColors = () => {
      if (themeRef.current === 'light') {
        return {
          particle: 'rgba(37, 99, 235, 0.55)',      // cobalt
          lineBase: (opacity: number) => `rgba(37, 99, 235, ${opacity * 0.6})`,
          lineHover: (opacity: number) => `rgba(29, 78, 216, ${opacity * 0.85})`,
          bg: 'rgba(0,0,0,0)',                        // transparent — body colour shows
        };
      }
      return {
        particle: 'rgba(191, 128, 255, 0.82)',
        lineBase: (opacity: number) => `rgba(200, 150, 255, ${opacity})`,
        lineHover: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
        bg: '#000000',
      };
    };

    const createParticles = () => {
      const { width, height } = getBounds();
      const colors = getColors();
      particles = [];
      const count = Math.max(60, Math.floor((width * height) / 9000));

      for (let i = 0; i < count; i += 1) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * (width - size * 4) + size * 2;
        const y = Math.random() * (height - size * 4) + size * 2;
        const dx = Math.random() * 0.4 - 0.2;
        const dy = Math.random() * 0.4 - 0.2;
        particles.push(new Particle(x, y, dx, dy, size, colors.particle));
      }
    };

    const resize = () => {
      const { width, height } = getBounds();
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const connectParticles = () => {
      const { width, height } = getBounds();
      const maxDistance = (width / 7) * (height / 7);
      const colors = getColors();

      for (let a = 0; a < particles.length; a += 1) {
        for (let b = a; b < particles.length; b += 1) {
          const deltaX = particles[a].x - particles[b].x;
          const deltaY = particles[a].y - particles[b].y;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          if (distanceSquared >= maxDistance) continue;

          const opacity = Math.max(0, 1 - distanceSquared / 20000);

          if (mouse.x !== null && mouse.y !== null) {
            const mouseDeltaX = particles[a].x - mouse.x;
            const mouseDeltaY = particles[a].y - mouse.y;
            const mouseDistance = Math.hypot(mouseDeltaX, mouseDeltaY);
            ctx.strokeStyle =
              mouseDistance < mouse.radius
                ? colors.lineHover(opacity)
                : colors.lineBase(opacity);
          } else {
            ctx.strokeStyle = colors.lineBase(opacity);
          }

          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const { width, height } = getBounds();
      const colors = getColors();

      // For dark: fill solid black. For light: clear to transparent so CSS bg shows.
      if (colors.bg === 'rgba(0,0,0,0)') {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < particles.length; i += 1) {
        particles[i].update(ctx, { width, height }, mouse);
      }
      connectParticles();
    };

    const handleMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const handleLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseout', handleLeave);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseout', handleLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      className={cn('pointer-events-none fixed inset-0 -z-30 overflow-hidden', className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
