import React, { useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { brandConfig, ctaConfig, socialConfig } from '@/config';
import { AnimatedButton } from '@/components/AnimatedButton';
import { motionTokens } from '@/lib/motion';
import { SocialIcons } from '@/components/ui/social-icons';
import { TypingText } from '@/components/ui/typing-text';
import { MovingBorder } from '@/components/ui/moving-border';

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
            radial-gradient(ellipse at 20% 50%, rgba(255,112,67,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(201,169,97,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(255,112,67,0.05) 0%, transparent 40%)
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

const PARTICLE_BURST_FACTORS = [0.82, 1.18, 0.94, 1.26, 0.88, 1.12, 0.98, 1.22, 0.9, 1.14, 0.86, 1.08];

/** Particle burst — small dots that fly outward on click */
function ParticleBurst({ x, y, active }: { x: number; y: number; active: boolean }) {
  const particles = PARTICLE_BURST_FACTORS.map((factor, i) => {
    const angle = (i / PARTICLE_BURST_FACTORS.length) * Math.PI * 2;
    const dist = 34 + factor * 22;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    return { px, py };
  });

  return (
    <AnimatePresence>
      {active && (
        <div
          className="pointer-events-none absolute z-50"
          style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
          aria-hidden="true"
        >
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute h-[6px] w-[6px] rounded-full"
              style={{ background: i % 2 === 0 ? 'var(--cyan-full)' : 'var(--violet)' }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: p.px, y: p.py, scale: 0, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.015 }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

function EmittingPulse({ disabled }: { disabled: boolean }) {
  if (disabled) {
    return (
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: 'var(--cyan-full)' }}
      />
    );
  }
  return (
    <span className="relative inline-flex h-2 w-2" style={{ flexShrink: 0 }}>
      <span className="emitting-ring" />
      <span className="emitting-ring emitting-ring-2" />
      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--cyan-full)' }} />
    </span>
  );
}

export function CTA() {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { onMouseMove } = useSpotlight(cardRef);
  const [headingDone, setHeadingDone] = useState(false);

  // Particle burst state
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null);

  const socialItems = socialConfig.map((social) => ({
    name: social.label === 'Email' ? 'Email' : social.label,
    href: social.href,
  }));

  const handleBurst = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBurst({ x, y, id: Date.now() });
    setTimeout(() => setBurst(null), 700);
  };

  if (!ctaConfig.heading) return null;

  return (
    <section id="contact" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute -top-20 left-1/4 h-[340px] w-[340px] opacity-[0.07] sm:h-[460px] sm:w-[460px] lg:h-[560px] lg:w-[560px]"
        style={{ background: 'radial-gradient(circle, #ff7043, transparent 60%)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute bottom-0 right-0 h-[280px] w-[280px] opacity-[0.06] sm:h-[360px] sm:w-[360px] lg:h-[430px] lg:w-[430px]"
        style={{ background: 'radial-gradient(circle, #c9a961, transparent 60%)', animationDelay: '4s' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
        >
          {/* Moving border wraps the card */}
          <MovingBorder
            borderRadius={16}
            duration={6}
            strokeWidth={1.5}
            color="var(--cyan-full)"
            gradientLength={0.22}
          >
            <div
              ref={cardRef}
              className="card-spotlight surface-card relative overflow-hidden rounded-2xl p-5 sm:p-6"
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

              <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
                <div className="section-header items-center text-center">
                  <span className="section-eyebrow">Connect</span>
                  {/* Typing animation heading */}
                  <h2 className="section-title text-balance">
                    {!shouldReduceMotion ? (
                      <TypingText
                        text={ctaConfig.heading}
                        speed={36}
                        showCaret={!headingDone}
                        onComplete={() => setHeadingDone(true)}
                      />
                    ) : (
                      ctaConfig.heading
                    )}
                  </h2>
                  <p className="section-copy type-body max-w-2xl">{ctaConfig.description}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {ctaConfig.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      className="tech-tag"
                      initial={shouldReduceMotion ? {} : { opacity: 0, y: 6 }}
                      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.04 }}
                      // Slow sine offset for visual rhythm
                      animate={shouldReduceMotion ? {} : {
                        y: [0, -3, 0, 3, 0],
                        transition: { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 },
                      }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* SLA strip with emitting pulse */}
                <div
                  className="inline-flex max-w-full flex-wrap items-center justify-center gap-2.5 rounded-xl px-3 py-2 text-sm leading-relaxed"
                  style={{
                    border: '1px solid var(--border-accent)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-200)',
                  }}
                >
                  <EmittingPulse disabled={Boolean(shouldReduceMotion)} />
                  Response SLA: {ctaConfig.responseTime} · Time zone: {ctaConfig.timezone}
                </div>

                {/* Action buttons with particle burst */}
                <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                  <div className="relative w-full sm:w-auto" onClick={handleBurst}>
                    {burst && <ParticleBurst x={burst.x} y={burst.y} active={true} key={burst.id} />}
                    <AnimatedButton
                      href={brandConfig.resumeHref}
                      download={brandConfig.resumeFileName}
                      variant="primary"
                      className="w-full sm:w-auto"
                      showIcon
                    >
                      {brandConfig.resumeLabel}
                    </AnimatedButton>
                  </div>

                  <div className="relative w-full sm:w-auto" onClick={handleBurst}>
                    {burst && <ParticleBurst x={burst.x} y={burst.y} active={true} key={`2-${burst.id}`} />}
                    <AnimatedButton
                      href={brandConfig.interviewCtaHref}
                      variant="secondary"
                      className="w-full sm:w-auto"
                      showIcon
                    >
                      {brandConfig.interviewCtaLabel}
                    </AnimatedButton>
                  </div>

                  <a
                    href={`mailto:${ctaConfig.email}`}
                    className="btn-outline focus-ring inline-flex w-full items-center justify-center gap-2 sm:w-auto"
                  >
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {ctaConfig.email}
                    <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </a>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <SocialIcons items={socialItems} />
                </div>
              </div>
            </div>
          </MovingBorder>
        </motion.div>
      </div>
    </section>
  );
}
