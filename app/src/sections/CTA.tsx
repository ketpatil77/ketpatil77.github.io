import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { brandConfig, ctaConfig, socialConfig } from '@/config';
import { AnimatedButton } from '@/components/AnimatedButton';
import { motionTokens } from '@/lib/motion';
import { SocialIcons } from '@/components/ui/social-icons';

function useSpotlight(ref: React.RefObject<HTMLElement | null>) {
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return { onMouseMove };
}

function MeshBackground({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(34,211,238,0.05) 0%, transparent 40%)
          `,
          animation: shouldReduceMotion ? 'none' : 'mesh-shift 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent) 30%, var(--border-dim) 70%, transparent)' }}
      />
    </div>
  );
}

export function CTA() {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { onMouseMove } = useSpotlight(cardRef);
  const socialItems = socialConfig.map((social) => ({
    name: social.label === 'Email' ? 'Email' : social.label,
    href: social.href,
  }));

  if (!ctaConfig.heading) return null;

  return (
    <section id="contact" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute -top-20 left-1/4 h-[340px] w-[340px] opacity-[0.07] sm:h-[460px] sm:w-[460px] lg:h-[560px] lg:w-[560px]"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent 60%)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute bottom-0 right-0 h-[280px] w-[280px] opacity-[0.06] sm:h-[360px] sm:w-[360px] lg:h-[430px] lg:w-[430px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 60%)', animationDelay: '4s' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
        >
          <div
            ref={cardRef}
            className="card-spotlight surface-card relative overflow-hidden rounded-[1.75rem] p-4 sm:p-6 lg:p-7"
            onMouseMove={shouldReduceMotion ? undefined : onMouseMove}
          >
            <MeshBackground shouldReduceMotion={shouldReduceMotion} />

            {ctaConfig.backgroundImage && (
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{ background: `url(${ctaConfig.backgroundImage}) center/cover no-repeat` }}
                aria-hidden="true"
              />
            )}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, transparent 50%, var(--bg-surface) 100%)', opacity: 0.65 }}
              aria-hidden="true"
            />

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="flex flex-col gap-3.5">
                <span className="section-eyebrow">Connect</span>

                <h2
                  className="type-hero text-balance leading-[1.02] tracking-tight"
                  style={{ color: 'var(--text-100)', fontSize: 'clamp(1.65rem, 3.6vw, 2.75rem)', fontStyle: 'italic' }}
                >
                  {ctaConfig.heading}
                </h2>

                <p className="type-body text-sm leading-[1.6] sm:text-base" style={{ color: 'var(--text-200)' }}>
                  {ctaConfig.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {ctaConfig.tags.map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <div
                  className="inline-flex max-w-full flex-wrap items-center gap-2.5 rounded-xl px-3 py-2 text-xs leading-relaxed"
                  style={{
                    border: '1px solid var(--border-accent)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-200)',
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: 'var(--cyan-full)', animation: shouldReduceMotion ? 'none' : 'pulse 2s ease-in-out infinite' }}
                  />
                  Response SLA: {ctaConfig.responseTime} · Time zone: {ctaConfig.timezone}
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <AnimatedButton
                  href={brandConfig.resumeHref}
                  download={brandConfig.resumeFileName}
                  variant="primary"
                  className="w-full"
                  showIcon
                >
                  {brandConfig.resumeLabel}
                </AnimatedButton>

                <AnimatedButton href={brandConfig.interviewCtaHref} variant="secondary" className="w-full" showIcon>
                  {brandConfig.interviewCtaLabel}
                </AnimatedButton>

                <a
                  href={`mailto:${ctaConfig.email}`}
                  className="btn-outline focus-ring inline-flex w-full items-center justify-between gap-2"
                >
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {ctaConfig.email}
                  </span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <SocialIcons items={socialItems} className="mt-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
