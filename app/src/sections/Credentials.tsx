import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import { Award, GraduationCap, Sparkles, ExternalLink } from 'lucide-react';
import { credentialsConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MagneticButton } from '@/components/ui/magnetic-button';

export function Credentials() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [selectedCertificateName, setSelectedCertificateName] = useState(
    credentialsConfig.certifications[0]?.name ?? '',
  );
  const selectedCertificate = useMemo(
    () => credentialsConfig.certifications.find((cert) => cert.name === selectedCertificateName) ?? null,
    [selectedCertificateName],
  );

  // Mobile snap reel state
  const snapRef = useRef<HTMLDivElement>(null);
  const [activeSnap, setActiveSnap] = useState(0);

  const handleSnapScroll = () => {
    if (!snapRef.current) return;
    const scrollLeft = snapRef.current.scrollLeft;
    const cardWidth = snapRef.current.clientWidth * 0.85 + 16;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveSnap(idx);
    const cert = credentialsConfig.certifications[idx];
    if (cert) setSelectedCertificateName(cert.name);
  };

  // Detail panel swipe navigation
  const currentCertIdx = credentialsConfig.certifications.findIndex(c => c.name === selectedCertificateName);

  const handleDetailDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 80) return;
    if (info.offset.x < 0 && currentCertIdx < credentialsConfig.certifications.length - 1) {
      setSelectedCertificateName(credentialsConfig.certifications[currentCertIdx + 1].name);
    } else if (info.offset.x > 0 && currentCertIdx > 0) {
      setSelectedCertificateName(credentialsConfig.certifications[currentCertIdx - 1].name);
    }
  };

  return (
    <section id="credentials" className="section-shell relative overflow-hidden">
      <div
        className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] lg:h-[560px] lg:w-[560px]"
        style={{ background: 'radial-gradient(circle, var(--violet), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-12">
          {/* ── Left: section header + education ── */}
          <div>
            <div className="section-header items-start text-left">
              <span className="section-eyebrow">
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                {credentialsConfig.label}
              </span>
              <AnimatedText
                el="h2"
                text="Academic Foundation, Research Credibility, and Industry Credentials."
                type="words"
                className="section-title text-balance"
              />
              <p className="section-copy type-body max-w-2xl">
                Computer engineering education supported by two peer-reviewed publications and seven
                certifications across networking, cybersecurity, machine learning, IT support, and data
                systems.
              </p>
            </div>

            <div className="mt-8 space-y-6 sm:mt-10">
              <h3
                className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-300)' }}
              >
                <GraduationCap className="h-4 w-4 shrink-0" style={{ color: 'var(--cyan-dim)' }} />
                Education
              </h3>
              <div className="space-y-5">
                {credentialsConfig.education.map((edu, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 }}
                    className="group relative h-full pl-5"
                  >
                    {/* Animated left border line */}
                    <motion.div
                      className="absolute left-0 top-0 w-px"
                      initial={{ height: 0 }}
                      whileInView={{ height: '100%' }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 + 0.1, duration: 0.6 }}
                      style={{ background: 'linear-gradient(to bottom, var(--cyan-full), var(--violet))' }}
                    />
                    {/* Dot at top of line */}
                    <motion.div
                      className="absolute left-[-3px] top-1 h-[7px] w-[7px] rounded-full"
                      initial={shouldReduceMotion ? {} : { scale: 0 }}
                      whileInView={shouldReduceMotion ? {} : { scale: 1 }}
                      viewport={{ once: true }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.1 + 0.05, type: 'spring', bounce: 0.5 }}
                      style={{ background: 'var(--cyan-full)', boxShadow: '0 0 6px var(--cyan-full)' }}
                    />
                    <p className="mb-0.5 text-xs font-bold" style={{ color: 'var(--cyan-full)' }}>
                      {edu.duration}
                    </p>
                    <h4 className="mt-1 font-bold leading-snug" style={{ color: 'var(--text-100)' }}>
                      {edu.degree}
                    </h4>
                    <p className="text-sm" style={{ color: 'var(--text-200)' }}>
                      {edu.institution}
                    </p>
                    <p className="mt-1 text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--text-300)' }}>
                      {edu.location}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: certifications ── */}
          <div>
            <h3
              className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
              style={{ color: 'var(--text-300)' }}
            >
              <Award className="h-4 w-4 shrink-0" style={{ color: 'var(--cyan-dim)' }} />
              Professional Certifications
            </h3>

            {!isMobile && (
              <p className="mb-4 text-xs" style={{ color: 'var(--text-400)' }}>
                Click any certificate name to view details.
              </p>
            )}

            {/* Desktop cert grid with shine-border on selected */}
            <div className={`grid items-stretch gap-3 ${isMobile ? 'hidden' : 'sm:grid-cols-2'}`}>
              {credentialsConfig.certifications.map((cert, idx) => {
                const isSelected = selectedCertificateName === cert.name;
                const isLastOdd =
                  idx === credentialsConfig.certifications.length - 1 &&
                  credentialsConfig.certifications.length % 2 !== 0;

                return (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { duration: motionTokens.duration.base, ease: motionTokens.ease.standard, delay: idx * 0.05 }
                    }
                    className={`relative${isLastOdd ? ' sm:col-span-2 sm:max-w-[calc(50%-6px)] sm:mx-0' : ''}`}
                  >
                    {/* Shine border wrapper when selected */}
                    <div
                      className={`surface-card group flex h-full flex-col gap-2 p-4 transition-all duration-300 rounded-[var(--radius)] overflow-hidden`}
                      style={{
                        borderColor: isSelected ? 'var(--border-accent)' : 'var(--border-subtle)',
                        background: isSelected ? 'var(--cyan-trace)' : undefined,
                        // Shine border animation on the selected card
                        ...(isSelected && !shouldReduceMotion ? {
                          backgroundImage: 'none',
                          boxShadow: '0 0 0 1px var(--border-accent), 0 0 18px rgba(255,112,67,0.12)',
                        } : {}),
                      }}
                    >
                      {/* Animated top border accent on selected */}
                      {isSelected && (
                        <motion.div
                          layoutId="cert-selected-accent"
                          className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background: 'linear-gradient(90deg, transparent, var(--cyan-full) 50%, transparent)' }}
                        />
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-300)' }}>
                            {cert.year}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCertificateName(cert.name)}
                            className="focus-ring mt-1 inline-flex min-h-11 rounded-sm px-1 text-left text-sm font-semibold transition-colors hover:text-[var(--cyan-full)]"
                            style={{ color: isSelected ? 'var(--cyan-full)' : 'var(--text-100)' }}
                            aria-pressed={isSelected}
                          >
                            {cert.name}
                          </button>
                          <p className="mt-1 text-xs" style={{ color: 'var(--text-300)' }}>
                            {cert.issuer}
                          </p>
                        </div>

                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
                          style={{ background: 'var(--cyan-glow)', color: 'var(--cyan-full)' }}
                        >
                          <Award className="h-4 w-4 shrink-0" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile: snap-scroll reel */}
            {isMobile && (
              <div>
                <div ref={snapRef} className="snap-reel" onScroll={handleSnapScroll}>
                  {credentialsConfig.certifications.map((cert) => {
                    const isSelected = selectedCertificateName === cert.name;
                    return (
                      <div key={cert.name} className="snap-reel-item">
                        <div
                          className="surface-card flex flex-col gap-2 p-4 h-full rounded-[var(--radius)]"
                          style={{
                            borderColor: isSelected ? 'var(--border-accent)' : 'var(--border-subtle)',
                            background: isSelected ? 'var(--cyan-trace)' : undefined,
                          }}
                        >
                          <span className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-300)' }}>
                            {cert.year}
                          </span>
                          <p className="text-sm font-semibold" style={{ color: isSelected ? 'var(--cyan-full)' : 'var(--text-100)' }}>
                            {cert.name}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-300)' }}>
                            {cert.issuer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="dots-indicator" aria-hidden="true">
                  {credentialsConfig.certifications.map((_, i) => (
                    <div key={i} className={`dots-indicator-dot${i === activeSnap ? ' active' : ''}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Cert detail panel — swipeable crossfade */}
            <AnimatePresence mode="wait">
              {selectedCertificate && (
                <motion.article
                  key={selectedCertificate.name}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: motionTokens.duration.base, ease: motionTokens.ease.standard }
                  }
                  drag={shouldReduceMotion ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDetailDragEnd}
                  className="surface-card mt-6 rounded-2xl border p-5 cursor-grab active:cursor-grabbing"
                  style={{ borderColor: 'var(--border-accent)', touchAction: 'pan-y' }}
                  aria-live="polite"
                >
                  {/* Swipe hint on mobile */}
                  {isMobile && credentialsConfig.certifications.length > 1 && (
                    <p className="mb-2 text-center text-[0.6rem] text-[var(--text-500)]" aria-hidden="true">
                      ← swipe to navigate →
                    </p>
                  )}
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--cyan-full)' }}>
                    Certificate Details
                  </p>
                  <h4 className="mt-2 text-base font-bold sm:text-lg" style={{ color: 'var(--text-100)' }}>
                    {selectedCertificate.name}
                  </h4>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-300)' }}>
                    {selectedCertificate.issuer} · {selectedCertificate.year}
                  </p>

                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-200)' }}>
                    {selectedCertificate.summary}
                  </p>

                  <div className="mt-4">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--text-300)' }}>
                      Focus Areas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCertificate.focusAreas.map((area) => (
                        <span
                          key={`${selectedCertificate.name}-${area}`}
                          className="rounded-full border px-2.5 py-1 text-[0.67rem] font-medium"
                          style={{
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-200)',
                            background: 'var(--bg-elevated)',
                          }}
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(selectedCertificate.credentialId || selectedCertificate.verifyHref) && (
                    <div className="mt-4 space-y-2 text-xs" style={{ color: 'var(--text-300)' }}>
                      {selectedCertificate.credentialId && (
                        <p>
                          Credential ID: <span style={{ color: 'var(--text-200)' }}>{selectedCertificate.credentialId}</span>
                        </p>
                      )}
                      {selectedCertificate.verifyHref && (
                        <MagneticButton
                          variant="outline"
                          intensity={0.3}
                          className="inline-flex w-fit items-center gap-2 text-xs"
                          onClick={() => window.open(selectedCertificate.verifyHref, '_blank', 'noopener')}
                        >
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          Verify Credential
                        </MagneticButton>
                      )}
                    </div>
                  )}
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
