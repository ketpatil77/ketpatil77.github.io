import { motion, useReducedMotion } from 'framer-motion';
import { BadgeCheck, Sparkles } from 'lucide-react';
import { aboutConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import HyperTextParagraph from '@/components/ui/hyper-text-with-decryption';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { useThemeContext } from '@/context/ThemeContext';

export function About() {
  const shouldReduceMotion = useReducedMotion();
  const theme = useThemeContext();
  const isLight = theme === 'light';

  if (!aboutConfig.description) return null;

  const imageFrameStyle = isLight
    ? {
      border: '1px solid rgba(37, 99, 235, 0.45)',
      boxShadow: '0 0 0 1px rgba(37,99,235,0.40), 0 0 0 2px rgba(37,99,235,0.15), 0 0 28px rgba(37,99,235,0.18)',
    }
    : {
      border: '1px solid rgba(34, 211, 238, 0.65)',
      boxShadow: '0 0 0 1px rgba(34,211,238,0.65), 0 0 0 2px rgba(34,211,238,0.20), 0 0 40px rgba(34,211,238,0.28)',
    };

  return (
    <section id="about" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute -bottom-16 -right-16 h-[360px] w-[360px] opacity-[0.05] rounded-full sm:h-[460px] sm:w-[460px] lg:h-[560px] lg:w-[560px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute top-0 left-1/4 h-[260px] w-[260px] opacity-[0.04] rounded-full sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent 65%)', filter: 'blur(70px)', animationDelay: '6s' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header">
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
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Images - desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -24, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
            className="hidden sm:grid grid-cols-2 gap-2"
          >
            {aboutConfig.images.slice(0, 2).map((image, idx) => (
              <div
                key={image.src}
                className="group surface-card relative isolate overflow-hidden rounded-2xl"
                style={{ aspectRatio: idx === 0 ? '4/5' : '4/4.6', ...imageFrameStyle }}
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
              </div>
            ))}

            <div
              className="col-span-2 relative overflow-hidden rounded-2xl p-3.5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <div
                className="absolute left-0 top-0 h-full w-[3px] rounded-l-full"
                style={{ background: 'linear-gradient(to bottom, var(--cyan-full), var(--violet))' }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-4 pl-2">
                <p className="type-hero font-extrabold leading-none" style={{ color: 'var(--cyan-full)', fontSize: 'clamp(2.1rem, 4vw, 3rem)' }}>
                  {aboutConfig.experienceValue}
                </p>
                <p className="whitespace-pre-line text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-400)' }}>
                  {aboutConfig.experienceLabel}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={shouldReduceMotion ? { duration: 0 } : { ...motionTokens.spring.soft, delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            {/* Mobile-only: wide banner photo + exp bar */}
            <div className="sm:hidden">
              <div className="about-banner-photo">
                <img src="/images/profile.jpg" alt="Ketan Patil" loading="lazy" />
              </div>
              <div className="about-exp-bar">
                <span className="about-exp-value">{aboutConfig.experienceValue}</span>
                <span className="about-exp-label">{aboutConfig.experienceLabel}</span>
              </div>
            </div>

            <HyperTextParagraph
              text={aboutConfig.description}
              className="section-copy type-body"
              highlightWords={['frontend', 'backend', 'AI-assisted', 'security', 'performance']}
              baseColor={isLight ? 'rgba(13,12,10,0.78)' : 'rgba(255,255,255,0.72)'}
              interactiveColor={isLight ? '#2563EB' : '#22d3ee'}
              hoverColor={isLight ? '#0D0C0A' : '#ffffff'}
              hoverBackgroundColor={isLight ? 'rgba(37,99,235,0.10)' : 'rgba(6,8,13,0.96)'}
            />

            <div className="glass-card relative rounded-2xl p-3.5">
              <div
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.2) 50%, transparent)' }}
                aria-hidden="true"
              />
              <p className="type-meta mb-2.5 text-xs font-semibold" style={{ color: 'var(--cyan-full)' }}>
                Professional Snapshot
              </p>

              {/* Desktop list */}
              <ul className="hidden sm:grid grid-cols-1 gap-2 sm:grid-cols-2">
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

              {/* Mobile 2-col strengths grid */}
              <div className="about-strengths-grid sm:hidden" role="list">
                {aboutConfig.strengths.map((strength) => (
                  <div key={strength} className="about-strength-chip" role="listitem">
                    <BadgeCheck className="about-strength-icon" aria-hidden="true" />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>

              {/* Added Languages */}
              <div className="mt-6 border-t border-[var(--border-subtle)] pt-4">
                <p className="type-meta mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-400)]">
                  Working Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {aboutConfig.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[0.65rem] font-medium text-[var(--text-300)] shadow-sm transition-colors hover:border-[var(--border-dim)] hover:text-[var(--text-200)]"
                    >
                      {lang}
                    </span>
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