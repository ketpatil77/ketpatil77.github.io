import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  Calendar,
  Download,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { brandConfig, heroConfig, proofConfig } from '@/config';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ParticleTextEffect } from '@/components/ui/particle-text-effect';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useThemeContext } from '@/context/ThemeContext';
import { LiquidWebGLBackground } from '@/components/ui/liquid-webgl-bg';
import { useIsMobile } from '@/hooks/use-mobile';
import anime from 'animejs';

function useSpotlight(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [enabled, ref]);
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerformanceMode = shouldReduceMotion || isMobile;
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = useThemeContext();
  const isLight = theme === 'light';
  useSpotlight(cardRef, !lowPerformanceMode);

  const titleParts = heroConfig.title.split('|').map((part) => part.trim()).filter(Boolean);
  const mobileHeroLabel = titleParts[0] ?? heroConfig.title;
  const mobileRoles = heroConfig.roles.slice(0, 3);
  const mobileStats = heroConfig.metrics.slice(0, 3);

  const particlePalette = isLight ? ['#1e40af', '#1d4ed8'] : ['#AEEBFF', '#22d3ee'];

  useEffect(() => {
    if (lowPerformanceMode) return;

    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    tl.add({
      targets: '.hero-fade-up',
      translateY: [24, 0],
      opacity: [0, 1],
      filter: ['blur(6px)', 'blur(0px)'],
      duration: 1000,
      delay: anime.stagger(150, { start: 500 }),
      easing: 'easeOutQuint',
    })
      .add(
        {
          targets: '.hero-tag',
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 800,
          delay: anime.stagger(60),
          easing: 'easeOutElastic(1, 0.6)',
        },
        '-=600',
      )
      .add(
        {
          targets: '.hero-card-wrapper',
          translateX: [40, 0],
          translateY: [20, 0],
          rotateX: [12, 0],
          rotateY: [-12, 0],
          scale: [0.96, 1],
          opacity: [0, 1],
          duration: 1200,
          easing: 'easeOutQuart',
        },
        '-=1000',
      )
      .add(
        {
          targets: '.btn-magnetic',
          opacity: [0, 1],
          translateY: [15, 0],
          duration: 600,
          delay: anime.stagger(100),
          easing: 'easeOutBack',
        },
        '-=800',
      );
  }, [lowPerformanceMode]);

  if (!heroConfig.name) return null;

  if (isMobile) {
    return (
      <section id="hero" className="hero-mobile-section relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.15]" aria-hidden="true" />

        {/* Photo background panel */}
        <div className="hero-vcard-photo">
          <div className="hero-vcard-badge">Available 2026</div>
          <img
            src="/images/profile.jpg"
            alt={`Portrait of ${heroConfig.name}`}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Content panel */}
        <div className="hero-vcard-content">
          <div>
            <p className="hero-vcard-role">{mobileHeroLabel}</p>
            <h1 className="hero-vcard-name">{heroConfig.name}</h1>
          </div>

          <p className="hero-vcard-intro">{heroConfig.intro}</p>

          {/* 3-column stats ribbon */}
          <div className="hero-vcard-stats" aria-label="Portfolio metrics">
            {mobileStats.map((metric) => (
              <div key={metric.label} className="hero-vcard-stat">
                <p className="hero-vcard-stat-value">{metric.value}</p>
                <p className="hero-vcard-stat-label">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Role chips */}
          <div className="hero-vcard-chips">
            {mobileRoles.map((role) => (
              <span key={role} className="hero-vcard-chip">{role}</span>
            ))}
          </div>

          <a href="#portfolio" className="hero-vcard-cta btn-primary focus-ring">
            Explore Case Studies
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    );
  }
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-16 pb-6 sm:pt-20 lg:pt-24 lg:pb-8"
      style={{ perspective: '1200px' }}
    >
      {!lowPerformanceMode && <LiquidWebGLBackground />}

      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-[0.25]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-base)]/50 to-[var(--bg-base)] z-0"
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 xl:gap-12">
          <div className="flex flex-col gap-4">
            <div className={shouldReduceMotion ? '' : 'hero-fade-up opacity-0'}>
              <span className="section-eyebrow">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Available for 2026 engineering roles and high-impact product collaborations
              </span>
            </div>

            <div className="space-y-1">
              {lowPerformanceMode ? (
                <h1 className="hero-heading text-balance">{heroConfig.name}</h1>
              ) : (
                <>
                  <h1 className="sr-only">{heroConfig.name}</h1>
                  <ParticleTextEffect
                    text={heroConfig.name}
                    className="max-w-[44rem]"
                    height={190}
                    pixelStep={4}
                    fontFamily="'Sentient', 'Times New Roman', serif"
                    fontWeight={700}
                    palette={particlePalette}
                  />
                </>
              )}

              <div className={shouldReduceMotion ? '' : 'hero-fade-up opacity-0'}>
                <p
                  className="type-heading text-gradient font-semibold"
                  style={{ fontSize: 'clamp(1.05rem, 2.3vw, 1.55rem)', letterSpacing: '-0.02em' }}
                >
                  {heroConfig.title}
                </p>
              </div>
            </div>

            <p
              className={`type-body max-w-xl text-sm leading-[1.62] sm:text-base text-[var(--text-300)] ${
                lowPerformanceMode ? '' : 'hero-fade-up opacity-0'
              }`}
            >
              {heroConfig.intro}
            </p>

            <div className="flex flex-wrap gap-2">
              {heroConfig.roles.map((role) => (
                <span key={role} className={`tech-tag ${lowPerformanceMode ? '' : 'hero-tag opacity-0'}`}>
                  {role}
                </span>
              ))}
            </div>

            <div className="mt-2 grid gap-3 sm:flex sm:flex-wrap sm:items-center">
              <a
                href="#portfolio"
                className={`w-full sm:w-auto ${lowPerformanceMode ? '' : 'btn-magnetic opacity-0'}`}
              >
                <MagneticButton variant="primary" intensity={0.5} className="w-full justify-center sm:w-auto">
                  Explore Case Studies
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </a>
              <a
                href={brandConfig.resumeHref}
                download={brandConfig.resumeFileName}
                className={`w-full sm:w-auto ${lowPerformanceMode ? '' : 'btn-magnetic opacity-0'}`}
              >
                <MagneticButton variant="outline" intensity={0.35} className="w-full justify-center sm:w-auto">
                  <Download className="w-4 h-4" />
                  {brandConfig.resumeLabel}
                </MagneticButton>
              </a>
              <a
                href={brandConfig.interviewCtaHref}
                className={`w-full sm:w-auto ${lowPerformanceMode ? '' : 'btn-magnetic opacity-0'}`}
              >
                <MagneticButton variant="secondary" intensity={0.3} className="w-full justify-center sm:w-auto">
                  <Calendar className="w-4 h-4" />
                  {brandConfig.interviewCtaLabel}
                </MagneticButton>
              </a>
            </div>

            <div className={`proof-ribbon mt-2 backdrop-blur-sm ${lowPerformanceMode ? '' : 'hero-fade-up opacity-0'}`}>
              {proofConfig.highlights.slice(0, 3).map((metric) => (
                <div key={metric.label} className="proof-ribbon-item">
                  <p className="proof-ribbon-value">{metric.value}</p>
                  <p className="proof-ribbon-label">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside
            className={`relative mx-auto w-full max-w-[18rem] lg:max-w-none origin-center ${
              lowPerformanceMode ? '' : 'hero-card-wrapper opacity-0'
            }`}
          >
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-30 transition-opacity duration-1000"
              style={{ background: 'radial-gradient(circle at 50% 80%, rgba(34,211,238,0.18), transparent 70%)' }}
              aria-hidden="true"
            />

            <div
              ref={cardRef}
              className="card-spotlight surface-card relative overflow-hidden rounded-[1.6rem] p-3.5 sm:p-4 shadow-2xl bg-[var(--bg-surface)] backdrop-blur-sm"
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: isLight
                    ? 'linear-gradient(90deg, transparent, rgba(37,99,235,0.22) 30%, rgba(180,83,9,0.18) 70%, transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3) 30%, rgba(139,92,246,0.2) 70%, transparent)',
                }}
                aria-hidden="true"
              />

              {heroConfig.backgroundImage && (
                <div
                  className="absolute inset-0 opacity-[0.20]"
                  style={{
                    background: `linear-gradient(160deg, rgba(2,2,2,0.3), rgba(2,2,2,0.9)), url(${heroConfig.backgroundImage}) center/cover no-repeat`,
                  }}
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex flex-col gap-3">
                <div
                  className="group relative isolate overflow-hidden rounded-2xl"
                  style={
                    isLight
                      ? {
                          border: '1px solid rgba(37,99,235,0.3)',
                          boxShadow: '0 0 0 1px rgba(37,99,235,0.4), 0 0 20px rgba(37,99,235,0.15)',
                        }
                      : {
                          border: '1px solid rgba(34,211,238,0.5)',
                          boxShadow: '0 0 0 1px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.25)',
                        }
                  }
                >
                  <GlowingEffect
                    disabled={Boolean(lowPerformanceMode)}
                    glow
                    blur={8}
                    spread={80}
                    proximity={120}
                    inactiveZone={0.3}
                    movementDuration={1}
                    borderWidth={4}
                    className="z-20 rounded-2xl opacity-100 mix-blend-screen"
                  />
                  <img
                    src="/images/profile.jpg"
                    alt={`Portrait of ${heroConfig.name}`}
                    className="aspect-[4/3.6] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>

                <div className="grid gap-1.5">
                  <div className="surface-soft flex items-start gap-3 rounded-xl px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan-full)]" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-100)]">Location</p>
                      <p className="text-sm text-[var(--text-300)]">{heroConfig.location}</p>
                    </div>
                  </div>
                  <div className="surface-soft flex items-start gap-3 rounded-xl px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm">
                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan-full)]" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-100)]">Availability</p>
                      <p className="text-sm text-[var(--text-300)]">{heroConfig.availability}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
