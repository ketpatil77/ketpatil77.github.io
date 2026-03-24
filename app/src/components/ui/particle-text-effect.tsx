import { useEffect, useMemo, useRef } from 'react';

type Vector2D = { x: number; y: number };
type RgbColor = { r: number; g: number; b: number };

type ParticleTextEffectProps = {
  text: string;
  className?: string;
  height?: number;
  pixelStep?: number;
  drawAsPoints?: boolean;
  fontFamily?: string;
  fontWeight?: number;
  palette?: string[];
};

type MouseState = {
  x: number | null;
  y: number | null;
  isPressed: boolean;
  isRightClick: boolean;
  radius: number;
};

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 90;
  maxSpeed = 1;
  maxForce = 0.1;
  particleSize = 8;
  isKilled = false;

  startColor: RgbColor = { r: 0, g: 0, b: 0 };
  targetColor: RgbColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move(mouse: MouseState) {
    let proximityMult = 1;
    const distanceToTarget = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y);
    if (distanceToTarget < this.closeEnoughTarget) {
      proximityMult = distanceToTarget / this.closeEnoughTarget;
    }

    const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
    const magnitude = Math.hypot(towardsTarget.x, towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y };
    const steerMagnitude = Math.hypot(steer.x, steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    if (mouse.x !== null && mouse.y !== null) {
      const deltaX = this.pos.x - mouse.x;
      const deltaY = this.pos.y - mouse.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance > 0 && distance < mouse.radius) {
        const pushX = deltaX / distance;
        const pushY = deltaY / distance;
        const push = (mouse.radius - distance) / mouse.radius;
        const strength = mouse.isPressed ? 6 : 2.8;
        this.acc.x += pushX * push * strength;
        this.acc.y += pushY * push * strength;
      }
    }

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
      return;
    }

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  kill(bounds: { width: number; height: number }) {
    if (this.isKilled) return;

    const randomPos = generateRandomPos(bounds.width / 2, bounds.height / 2, (bounds.width + bounds.height) / 2);
    this.target.x = randomPos.x;
    this.target.y = randomPos.y;

    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.isKilled = true;
  }
}

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function hexToRgb(input: string): RgbColor | null {
  const hex = input.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function generateRandomPos(x: number, y: number, mag: number): Vector2D {
  const randomX = Math.random() * 1000;
  const randomY = Math.random() * 500;
  const direction = { x: randomX - x, y: randomY - y };
  const magnitude = Math.hypot(direction.x, direction.y);
  if (magnitude > 0) {
    direction.x = (direction.x / magnitude) * mag;
    direction.y = (direction.y / magnitude) * mag;
  }
  return { x: x + direction.x, y: y + direction.y };
}

const DEFAULT_PALETTE = ['#AEEBFF'];

export function ParticleTextEffect({
  text,
  className,
  height = 176,
  pixelStep = 4,
  drawAsPoints = true,
  fontFamily = "'Sentient', 'Times New Roman', serif",
  fontWeight = 700,
  palette = DEFAULT_PALETTE,
}: ParticleTextEffectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<MouseState>({ x: null, y: null, isPressed: false, isRightClick: false, radius: 92 });

  const colors = useMemo(() => {
    const parsed = palette.map(hexToRgb).filter((item): item is RgbColor => item !== null);
    return parsed.length > 0 ? parsed : DEFAULT_PALETTE.map((c) => hexToRgb(c)!).filter(Boolean);
  }, [palette]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const particles = particlesRef.current;
    let width = 0;
    let canvasHeight = height;

    const pickColor = () => colors[Math.floor(Math.random() * colors.length)] ?? { r: 255, g: 255, b: 255 };

    const fitFontSize = (renderCtx: CanvasRenderingContext2D, targetText: string, maxWidth: number, maxHeight: number) => {
      let size = Math.floor(maxHeight * 0.74);
      const minSize = 28;
      while (size > minSize) {
        renderCtx.font = `${fontWeight} ${size}px ${fontFamily}`;
        if (renderCtx.measureText(targetText).width <= maxWidth) break;
        size -= 1;
      }
      return size;
    };

    const setCanvasSize = () => {
      width = Math.max(320, Math.floor(wrapper.clientWidth));
      canvasHeight = height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(canvasHeight * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${canvasHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const mapTextToParticles = (word: string) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = canvasHeight;
      const offscreenCtx = offscreen.getContext('2d');
      if (!offscreenCtx) return;

      offscreenCtx.clearRect(0, 0, width, canvasHeight);
      const fontSize = fitFontSize(offscreenCtx, word, width * 0.94, canvasHeight);
      offscreenCtx.fillStyle = '#ffffff';
      offscreenCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      offscreenCtx.textAlign = 'center';
      offscreenCtx.textBaseline = 'middle';
      offscreenCtx.fillText(word, width / 2, canvasHeight / 2);

      const imageData = offscreenCtx.getImageData(0, 0, width, canvasHeight);
      const pixels = imageData.data;

      const coords: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < canvasHeight; y += pixelStep) {
        for (let x = 0; x < width; x += pixelStep) {
          const idx = (y * width + x) * 4;
          if (pixels[idx + 3] > 120) coords.push({ x, y });
        }
      }

      for (let i = coords.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }

      let activeCount = 0;
      for (const coord of coords) {
        let particle: Particle;
        if (activeCount < particles.length) {
          particle = particles[activeCount];
          particle.isKilled = false;
        } else {
          particle = new Particle();
          const randomPos = generateRandomPos(width / 2, canvasHeight / 2, (width + canvasHeight) / 2);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;
          particle.maxSpeed = Math.random() * 5 + 3.8;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 4 + 4;
          particle.colorBlendRate = Math.random() * 0.022 + 0.004;
          particles.push(particle);
        }

        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = pickColor();
        particle.colorWeight = 0;
        particle.target.x = coord.x;
        particle.target.y = coord.y;
        activeCount += 1;
      }

      for (let i = activeCount; i < particles.length; i += 1) {
        particles[i].kill({ width, height: canvasHeight });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, canvasHeight);

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];
        particle.move(mouseRef.current);
        particle.draw(ctx, drawAsPoints);

        if (
          particle.isKilled &&
          (particle.pos.x < -10 || particle.pos.x > width + 10 || particle.pos.y < -10 || particle.pos.y > canvasHeight + 10)
        ) {
          particles.splice(i, 1);
        }
      }

      if (mouseRef.current.isPressed && mouseRef.current.isRightClick && mouseRef.current.x !== null && mouseRef.current.y !== null) {
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          const distance = Math.hypot(p.pos.x - mouseRef.current.x, p.pos.y - mouseRef.current.y);
          if (distance < 52) p.kill({ width, height: canvasHeight });
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    const updateMouseFromEvent = (event: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const onPointerDown = (event: PointerEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = event.button === 2;
      updateMouseFromEvent(event);
    };

    const onPointerUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const onPointerMove = (event: PointerEvent) => updateMouseFromEvent(event);
    const onPointerLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const onContextMenu = (event: MouseEvent) => event.preventDefault();

    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
      mapTextToParticles(text.toUpperCase());
    });

    resizeObserver.observe(wrapper);
    setCanvasSize();
    mapTextToParticles(text.toUpperCase());
    render();

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('contextmenu', onContextMenu);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('contextmenu', onContextMenu);
    };
  }, [colors, drawAsPoints, fontFamily, fontWeight, height, pixelStep, text]);

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <canvas ref={canvasRef} className="h-full w-full rounded-xl" />
    </div>
  );
}
