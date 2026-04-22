import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Info, Sparkles, X } from 'lucide-react';
import { portfolioConfig, proofConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { TiltCard } from '@/components/ui/tilt-card';
import { LazySpline } from '@/components/ui/spline';
import { getPortfolioSceneUrl } from '@/config/spline';
import { useIsMobile } from '@/hooks/use-mobile';

type PortfolioStackItem = CardStackItem & {
  year: string;
  category: string;
  outcome: string;
  codeHref: string;
  impact: string;
  role: string;
  duration: string;
  stackSummary: string;
  summary: string;
  tech: string[];
  liveHref: string;
  highlights: string[];
  metrics: string[];
};

function PortfolioDeviceFallback({ project }: { project: PortfolioStackItem | null }) {
  if (!project?.imageSrc) {
    return (
      <div
        className="h-full w-full"
        style={{
          background:
            'radial-gradient(circle at top, rgba(255,112,67,0.18), transparent 48%), linear-gradient(165deg, rgba(5,8,14,0.98), rgba(16,21,34,0.9))',
        }}
      />
    );
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center p-6 sm:p-8"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,112,67,0.18), transparent 48%), linear-gradient(165deg, rgba(5,8,14,0.98), rgba(16,21,34,0.9))',
      }}
    >
      <div className="relative w-full max-w-[19rem] rounded-[2.35rem] border border-white/10 bg-[#0b0f14] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute left-1/2 top-3 h-1.5 w-20 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="overflow-hidden rounded-[1.85rem] border border-white/10 bg-black/60">
          <img
            src={project.imageSrc}
            alt={`${project.title} preview`}
            className="aspect-[9/16] w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-[0.62rem] uppercase tracking-[0.12em] text-white/70">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [isCompactStack, setIsCompactStack] = useState(false);
  const [isNarrowStack, setIsNarrowStack] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | number | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const projects = portfolioConfig.projects;

  const baseStackProjects = useMemo<PortfolioStackItem[]>(
    () =>
      projects.map((project, index) => ({
        id: `${project.title}-${index}`,
        title: project.title,
        description: project.summary,
        imageSrc: project.posterImage,
        href: project.liveHref,
        ctaLabel: 'Case Brief',
        tag: project.category,
        year: project.year,
        category: project.category,
        outcome: project.outcome,
        codeHref: project.codeHref,
        impact: project.impact,
        role: project.role,
        duration: project.duration,
        stackSummary: project.stackSummary,
        summary: project.summary,
        tech: project.tech,
        liveHref: project.liveHref,
        highlights: project.highlights,
        metrics: project.metrics,
      })),
    [projects],
  );

  const stackProjects = baseStackProjects;

  const selectedProject = useMemo(
    () => stackProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId, stackProjects],
  );
  const activeProject = stackProjects[activeProjectIndex] ?? stackProjects[0] ?? null;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const update = () => setIsCompactStack(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');
    const update = () => setIsNarrowStack(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('[data-project-details-trigger="true"]')) return;
      if (popupRef.current?.contains(target)) return;
      setSelectedProjectId(null);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProjectId(null);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProjectId]);

  if (!portfolioConfig.heading || projects.length === 0) return null;

  const stackCardWidth = isNarrowStack ? 286 : isCompactStack ? 320 : 590;
  const stackCardHeight = isNarrowStack ? 212 : isCompactStack ? 220 : 340;
  const stackMaxVisible = isNarrowStack ? 1 : isCompactStack ? 3 : 5;
  const stackOverlap = isNarrowStack ? 0.68 : isCompactStack ? 0.6 : 0.52;
  const stackSpread = isNarrowStack ? 0 : isCompactStack ? 30 : 40;
  const stackDepth = isNarrowStack ? 40 : isCompactStack ? 80 : 120;
  const primaryActionLabel =
    selectedProject?.liveHref.startsWith('mailto:') ? 'Request Private Demo' : 'View Live Deployment';
  const activeProjectPrimaryLabel =
    activeProject?.liveHref.startsWith('mailto:') ? 'Request Private Demo' : 'View Live Deployment';
  const showPortfolioShowcase = !shouldReduceMotion && !isMobile && Boolean(activeProject);

  return (
    <section id="portfolio" className="section-shell relative overflow-hidden">
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] sm:h-[560px] sm:w-[560px] lg:h-[700px] lg:w-[700px]"
        style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header items-center text-center">
          <span className="section-eyebrow mx-auto">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {proofConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={proofConfig.heading}
            type="words"
            className="section-title max-w-4xl text-balance"
          />
          <p className="section-copy type-body mx-auto max-w-3xl text-center">{proofConfig.description}</p>
        </div>

        {showPortfolioShowcase && activeProject && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: motionTokens.ease.standard }}
            className="mt-8 grid gap-4 xl:grid-cols-[1.08fr_0.92fr]"
          >
            <div className="glass-card overflow-hidden rounded-[1.75rem] border border-[var(--border-dim)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
                <div>
                  <p className="type-heading text-xs uppercase tracking-[0.2em] text-[var(--cyan-full)]">
                    3D Portfolio Device
                  </p>
                  <p className="type-body mt-1 text-[0.72rem] text-[var(--text-400)]">
                    Active project mapped to an interactive Spline stage.
                  </p>
                </div>
                <p className="type-body text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-400)]">
                  {activeProject.year}
                </p>
              </div>

              <div className="relative h-[22rem] sm:h-[26rem]">
                <LazySpline
                  scene={getPortfolioSceneUrl()}
                  fallback={<PortfolioDeviceFallback project={activeProject} />}
                  className="h-full w-full"
                  containerClassName="h-full w-full"
                  rootMargin="180px"
                />

                <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-[rgba(6,6,10,0.62)] p-4 backdrop-blur-md">
                  <p className="text-[0.65rem] uppercase tracking-[0.18em] text-[var(--cyan-dim)]">
                    {activeProject.category}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{activeProject.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/80">{activeProject.summary}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="glass-card rounded-[1.75rem] border border-[var(--border-subtle)] p-5">
                <p className="type-heading text-xs uppercase tracking-[0.18em] text-[var(--cyan-full)]">
                  Project Brief
                </p>
                <p className="mt-3 text-lg font-semibold text-[var(--text-100)]">{activeProject.outcome}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-300)]">{activeProject.stackSummary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {activeProject.metrics.slice(0, 4).map((metric) => (
                    <span
                      key={metric}
                      className="rounded-full border border-[var(--border-accent)] bg-[var(--bg-elevated)] px-3 py-1 text-[0.7rem] font-medium text-[var(--text-200)]"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-[1.75rem] border border-[var(--border-subtle)] p-5">
                <p className="type-heading text-xs uppercase tracking-[0.18em] text-[var(--text-400)]">
                  Active stack
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeProject.tech.slice(0, 8).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1 text-[0.7rem] font-medium text-[var(--text-300)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={activeProject.liveHref} className="btn-primary focus-ring inline-flex min-h-[44px] items-center justify-center px-4 text-sm">
                    {activeProjectPrimaryLabel}
                  </a>
                  <a href={activeProject.codeHref} className="btn-outline focus-ring inline-flex min-h-[44px] items-center justify-center px-4 text-sm">
                    View Code
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.22, ease: motionTokens.ease.standard, delay: 0.02 }
          }
          className="relative mt-8 pb-2 sm:mt-10"
        >
          <TiltCard maxTilt={8} scale={1.02} disabled={Boolean(shouldReduceMotion)}>
          <CardStack
            items={stackProjects}
            className="mx-auto w-full max-w-7xl"
            cardWidth={stackCardWidth}
            cardHeight={stackCardHeight}
            maxVisible={stackMaxVisible}
            overlap={stackOverlap}
            spreadDeg={stackSpread}
            depthPx={stackDepth}
            springStiffness={420}
            springDamping={40}
            showDots
            onChangeIndex={(index) => {
              setActiveProjectIndex(index);
              setSelectedProjectId(null);
            }}
            renderCard={(item, { active }) => {
              const isOpen = selectedProjectId === item.id;

              return (
                <article
                  className={`relative isolate h-full w-full overflow-hidden rounded-2xl border ${active
                    ? 'border-[rgba(255,112,67,0.70)] ring-1 ring-[rgba(255,112,67,0.45)] shadow-[0_0_0_1px_rgba(255,112,67,0.62),0_0_0_2px_rgba(255,112,67,0.24),0_0_34px_rgba(255,112,67,0.28)]'
                    : 'border-[var(--border-subtle)]'
                    }`}
                  tabIndex={active ? 0 : -1}
                >
                  <GlowingEffect
                    disabled={Boolean(shouldReduceMotion) || !active}
                    glow
                    blur={6}
                    spread={76}
                    proximity={108}
                    inactiveZone={0.28}
                    movementDuration={0.85}
                    borderWidth={4}
                    className="z-20 rounded-2xl opacity-100"
                  />

                  <img
                    src={item.imageSrc}
                    alt={`${item.title} preview`}
                    loading={active ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                  {/* Gradient overlay — adapts to theme: dark uses near-black, light uses near-base */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, var(--portfolio-overlay-from, rgba(0,0,0,0.82)) 0%, rgba(0,0,0,0.30) 50%, transparent 100%)',
                    }}
                    aria-hidden="true"
                  />

{active && (
                    <div className="shine-border-hover absolute right-3 top-3 z-30 overflow-hidden rounded-full" style={{ padding: '1px' }}>
                      <button
                        type="button"
                        data-project-details-trigger="true"
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                        aria-controls="portfolio-project-details"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setSelectedProjectId((prev) => (prev === item.id ? null : item.id));
                        }}
                        className="focus-ring portfolio-details-btn inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-[0.62rem]"
                        style={{
                          border: '1px solid var(--border-accent)',
                          background: 'var(--portfolio-btn-bg, rgba(0,0,0,0.62))',
                          color: 'var(--cyan-full)',
                        }}
                      >
                        <Info className="h-3.5 w-3.5" aria-hidden="true" />
                        Case Brief
                      </button>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.1em] sm:text-[0.62rem] sm:tracking-[0.14em]" style={{ color: 'var(--cyan-dim)' }}>
                      {item.category} • {item.year}
                    </p>
                    <h4
                      className={`mt-1 font-semibold ${isCompactStack ? 'text-sm' : 'text-lg'}`}
                      style={{ color: '#ffffff', textShadow: '0 1px 8px rgba(0,0,0,0.65)' }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className={`mt-1 line-clamp-2 ${isCompactStack ? 'text-[0.72rem]' : 'text-sm'}`}
                      style={{ color: 'rgba(240,248,255,0.88)', textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}
                    >
                      {item.outcome}
                    </p>
                  </div>
                </article>
              );
            }}
/>
          </TiltCard>

          <AnimatePresence>
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(2,2,2,0.65)] p-4 backdrop-blur-md sm:p-6"
                onClick={() => setSelectedProjectId(null)}
              >
                <motion.aside
                  id="portfolio-project-details"
                  key={String(selectedProject.id)}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`portfolio-project-title-${selectedProject.id}`}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: motionTokens.ease.standard }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative flex max-h-[90vh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl shadow-2xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  {/* Modal Header & Close Btn */}
                  <div className="flex shrink-0 items-start justify-between border-b border-[var(--border-subtle)] p-5 sm:p-6">
                    <div>
                      <p className="type-meta text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: 'var(--cyan-full)' }}>
                        {selectedProject.category} • {selectedProject.year}
                      </p>
                      <h3
                        id={`portfolio-project-title-${selectedProject.id}`}
                        className="type-hero mt-2 text-[1.65rem] font-extrabold leading-tight tracking-tight sm:text-[2.2rem]"
                        style={{ color: 'var(--text-100)' }}
                      >
                        {selectedProject.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(null)}
                      className="focus-ring ml-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[var(--border-subtle)] active:scale-95"
                      style={{ border: '1px solid var(--border-accent)', background: 'var(--bg-elevated)', color: 'var(--cyan-full)' }}
                      aria-label="Close case study"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div className="space-y-6">
                      <section>
                        <h4 className="type-meta mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-300)]">
                          <span className="h-px w-4 bg-[var(--border-accent)]" />
                          The Challenge & Context
                        </h4>
                        <p className="type-body text-[0.95rem] leading-relaxed text-[var(--text-200)]">
                          {selectedProject.summary}
                        </p>
                      </section>

                      <section>
                        <h4 className="type-meta mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-300)]">
                          <span className="h-px w-4 bg-[var(--border-accent)]" />
                          Project Metrics
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedProject.metrics.slice(0, 4).map((metric) => (
                            <div
                              key={`${selectedProject.id}-${metric}`}
                              className="rounded-xl border border-[var(--border-subtle)] p-3"
                              style={{ background: 'var(--bg-elevated)' }}
                            >
                              <p className="type-meta text-[0.62rem] font-bold text-[var(--cyan-full)]">Metric</p>
                              <p className="mt-1 text-sm leading-relaxed text-[var(--text-200)]">{metric}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="type-meta mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-300)]">
                          <span className="h-px w-4 bg-[var(--border-accent)]" />
                          Architecture & Execution
                        </h4>
                        <p className="type-body text-[0.95rem] leading-relaxed text-[var(--text-200)]">
                          {selectedProject.stackSummary}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedProject.tech.map((tech) => (
                            <span key={`${selectedProject.id}-${tech}`} className="tech-tag" style={{ background: 'var(--bg-elevated)' }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h4 className="type-meta mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-300)]">
                          <span className="h-px w-4 bg-[var(--border-accent)]" />
                          Key Execution Points
                        </h4>
                        <ul className="space-y-2.5">
                          {selectedProject.highlights.map((highlight) => (
                            <li key={`${selectedProject.id}-${highlight}`} className="flex gap-3 text-[0.875rem] leading-relaxed text-[var(--text-200)]">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cyan-full)]" aria-hidden="true" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <div className="grid gap-3">
                        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                          <p className="type-meta text-[0.65rem] font-bold text-[var(--cyan-full)] text-opacity-80">
                            Measurable Impact
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-100)]">{selectedProject.impact}</p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                          <p className="type-meta text-[0.65rem] font-bold text-[var(--cyan-full)] text-opacity-80">
                            Delivered Outcome
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-200)]">{selectedProject.outcome}</p>
                        </div>

                        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
                          <p className="type-meta text-[0.65rem] font-bold text-[var(--cyan-full)] text-opacity-80">
                            Role Scope
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-200)]">{selectedProject.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex shrink-0 flex-col gap-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:flex-row sm:p-6">
                    <a href={selectedProject.liveHref} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring w-full text-sm sm:w-auto">
                      {primaryActionLabel}
                    </a>
                    <a href={selectedProject.codeHref} target="_blank" rel="noopener noreferrer" className="btn-outline focus-ring w-full text-sm sm:w-auto" style={{ background: 'var(--bg-surface)' }}>
                      Review Source Code
                    </a>
                  </div>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="type-meta mt-2 text-center text-[0.72rem] sm:text-[0.62rem]" style={{ color: 'var(--text-400)' }}>
            Open Case Brief on the active card to review role, architecture, impact, and outcome.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
