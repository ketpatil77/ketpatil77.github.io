import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { aboutConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { TiltCard } from '@/components/ui/tilt-card';
import { ScrollRevealText } from '@/components/ui/scroll-reveal-text';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useThemeContext } from '@/context/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { LazySpline } from '@/components/ui/spline';
import { getAboutSceneUrl } from '@/config/spline';

export function About() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const theme = useThemeContext();
  const isLight = theme === 'light';
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax on the two image tiles — opposing vertical speeds
  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ['start end', 'end start'],
  });
  const img1Y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  if (!aboutConfig.description) return null;

  const imageFrameStyle = isLight
    ? {
        border: '1px solid rgba(230, 81, 0, 0.45)',
        boxShadow: '0 0 0 1px rgba(230,81,0,0.40), 0 0 0 2px rgba(230,81,0,0.15), 0 0 28px rgba(230,81,0,0.18)',
      }
    : {
        border: '1px solid rgba(255, 112, 67, 0.65)',
        boxShadow: '0 0 0 1px rgba(255,112,67,0.65), 0 0 0 2px rgba(255,112,67,0.20), 0 0 40px rgba(255,112,67,0.28)',
      };

  // Parse experience value numeric part
  const expRaw = aboutConfig.experienceValue.replace(/[^0-9.]/g, '');
  const expNum = parseFloat(expRaw) || 0;
  const expSuffix = aboutConfig.experienceValue.replace(/^[0-9.]+/, '');

  return (
    <section ref={sectionRef} id="about" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute -bottom-16 -right-16 h-[360px] w-[360px] opacity-[0.05] rounded-full sm:h-[460px] sm:w-[460px] lg:h-[560px] lg:w-[560px]"
        style={{ background: 'radial-gradient(circle, #c9a961, transparent 65%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute top-0 left-1/4 h-[260px] w-[260px] opacity-[0.04] rounded-full sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]"
        style={{ background: 'radial-gradient(circle, #ff7043, transparent 65%)', filter: 'blur(70px)', animationDelay: '6s' }}
        aria-hidden="true"
      />
      
      {/* 3D Spline Ambient Background */}
      {!shouldReduceMotion && !isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <LazySpline
            scene={getAboutSceneUrl()}
            fallback={<div className="h-full w-full" />}
            className="h-full w-full opacity-20"
            containerClassName="h-full w-full"
            rootMargin="220px"
          />
        </div>
      )}
      
      

      <div className="container-large relative z-10">
        <div className="section-header items-start text-left">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {aboutConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={aboutConfig.heading}
            type="words"
            className="section-title max-w-4xl text-balance"
          />

          {/* Scroll-reveal paragraph — signature effect */}
          {!shouldReduceMotion && !isMobile ? (
            <ScrollRevealText
              text={aboutConfig.description}
              className="section-copy type-body max-w-3xl"
              el="p"
            />
          ) : (
            <p className="section-copy type-body max-w-3xl">{aboutConfig.description}</p>
          )}
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2 lg:gap-8 xl:mt-10">
          {/* ── Images with parallax + tilt ── */}
          <motion.div
            initial={{ opacity: 0, x: -24, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
            className="hidden grid-cols-2 gap-3 sm:grid"
          >
            {aboutConfig.images.slice(0, 2).map((image, idx) => (
              <motion.div
                key={image.src}
                style={shouldReduceMotion ? undefined : { y: idx === 0 ? img1Y : img2Y }}
              >
                <TiltCard
                  maxTilt={5}
                  scale={1.03}
                  disabled={Boolean(shouldReduceMotion) || isMobile}
                  className="group surface-card relative isolate overflow-hidden rounded-2xl"
                  style={{ aspectRatio: idx === 0 ? '4/5' : '4/4.6', ...imageFrameStyle } as React.CSSProperties}
                >
                  <GlowingEffect
                    disabled={Boolean(shouldReduceMotion)}
                    glow
                    blur={6}
                    spread={72}
                    proximity={104}
                    inactiveZone={0.34}
                    movementDuration={0.95}
                    borderWidth={4}
                    className="z-20 rounded-2xl opacity-100"
                  />
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </TiltCard>
              </motion.div>
            ))}

            {/* Experience bar with animated counter */}
            <div
              className="col-span-2 relative overflow-hidden rounded-2xl p-4 sm:p-5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div
                className="absolute left-0 top-0 h-full w-[3px] rounded-l-full"
                style={{ background: 'linear-gradient(to bottom, var(--cyan-full), var(--violet))' }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-4 pl-2">
                <p className="type-hero font-extrabold leading-none" style={{ color: 'var(--cyan-full)', fontSize: 'clamp(2.1rem, 4vw, 3rem)' }}>
                  {expNum > 0 && !shouldReduceMotion ? (
                    <AnimatedCounter value={expNum} suffix={expSuffix} durationMs={1400} />
                  ) : (
                    aboutConfig.experienceValue
                  )}
                </p>
                <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>
                  {aboutConfig.experienceLabel}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Text side ── */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={shouldReduceMotion ? { duration: 0 } : { ...motionTokens.spring.soft, delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            {/* Mobile-only: banner photo + exp bar */}
            <div className="sm:hidden">
              <div className="about-banner-photo">
                <img src="/images/profile.jpg" alt="Ketan Patil" loading="lazy" />
              </div>
              <div className="about-exp-bar">
                <span className="about-exp-value">{aboutConfig.experienceValue}</span>
                <span className="about-exp-label">{aboutConfig.experienceLabel}</span>
              </div>
            </div>

            <div className="glass-card relative rounded-2xl p-4 sm:p-5">
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,112,67,0.2) 50%, transparent)' }}
                aria-hidden="true"
              />
              <p className="type-meta mb-2.5 text-xs font-semibold" style={{ color: 'var(--cyan-full)' }}>
                Professional Snapshot
              </p>

              {/* Desktop staggered strengths list */}
              <ul className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2">
                {aboutConfig.strengths.map((strength, i) => (
                  <motion.li
                    key={strength}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05, duration: 0.35 }}
                    className="flex items-start gap-2.5 text-sm"
                    style={{ color: 'var(--text-200)' }}
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--cyan-full)' }} aria-hidden="true" />
                    <span>{strength}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Mobile strengths grid */}
              <div className="about-strengths-grid sm:hidden" role="list">
                {aboutConfig.strengths.map((strength) => (
                  <div key={strength} className="about-strength-chip" role="listitem">
                    <BadgeCheck className="about-strength-icon" aria-hidden="true" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                <p className="type-meta mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-400)]">
                  Working Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {aboutConfig.languages.map((lang, i) => (
                    <motion.span
                      key={lang}
                      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.85 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.06 }}
                      className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[0.65rem] font-medium text-[var(--text-300)] shadow-sm transition-colors hover:border-[var(--border-dim)] hover:text-[var(--text-200)]"
                    >
                      {lang}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Focus areas */}
              <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                <p className="type-meta mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-400)]">
                  Domain Focus
                </p>
                <div className="flex flex-wrap gap-2">
                  {aboutConfig.focusAreas.map((focusArea, i) => (
                    <motion.span
                      key={focusArea}
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05 }}
                      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}
                      className="cursor-default rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[0.65rem] font-medium text-[var(--text-300)] shadow-sm transition-colors hover:border-[var(--border-dim)] hover:text-[var(--text-200)]"
                    >
                      {focusArea}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
