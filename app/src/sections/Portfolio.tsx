import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Info, Sparkles, X } from 'lucide-react';
import { portfolioConfig, proofConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import { GlowingEffect } from '@/components/ui/glowing-effect';

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
};

export function Portfolio() {
  const shouldReduceMotion = useReducedMotion();
  const [isCompactStack, setIsCompactStack] = useState(false);
  const [isNarrowStack, setIsNarrowStack] = useState(false);
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
      })),
    [projects],
  );

  const stackProjects = baseStackProjects;

  const selectedProject = useMemo(
    () => stackProjects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId, stackProjects],
  );

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
          <p className="section-copy type-body mx-auto text-center">{proofConfig.description}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.22, ease: motionTokens.ease.standard, delay: 0.02 }
          }
          className="relative mt-2 pb-2"
        >
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
            onChangeIndex={() => {
              setSelectedProjectId(null);
            }}
            renderCard={(item, { active }) => {
              const isOpen = selectedProjectId === item.id;

              return (
                <article
                  className={`relative isolate h-full w-full overflow-hidden rounded-2xl border ${active
                    ? 'border-cyan-300/70 ring-1 ring-cyan-300/45 shadow-[0_0_0_1px_rgba(34,211,238,0.62),0_0_0_2px_rgba(34,211,238,0.24),0_0_34px_rgba(34,211,238,0.28)]'
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
                      className="focus-ring absolute right-3 top-3 z-30 inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-[0.62rem] portfolio-details-btn"
                      style={{
                        border: '1px solid var(--border-accent)',
                        background: 'var(--portfolio-btn-bg, rgba(0,0,0,0.62))',
                        color: 'var(--cyan-full)',
                      }}
                    >
                      <Info className="h-3.5 w-3.5" aria-hidden="true" />
                      Case Brief
                    </button>
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
                  className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-accent)',
                  }}
                >
                  {/* Modal Header & Close Btn */}
                  <div className="flex shrink-0 items-start justify-between border-b border-[var(--border-subtle)] p-5 sm:p-8">
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
                  <div className="flex-1 overflow-y-auto p-5 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                      
                      {/* Left Col (2/3) - Context & Architecture */}
                      <div className="space-y-8 lg:col-span-2">
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
                            Architecture & Execution
                          </h4>
                          <p className="type-body text-[0.95rem] leading-relaxed text-[var(--text-200)]">
                            {selectedProject.stackSummary}
                          </p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {selectedProject.tech.map((tech) => (
                              <span key={`${selectedProject.id}-${tech}`} className="tech-tag" style={{ background: 'var(--bg-elevated)' }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </section>
                      </div>

                      {/* Right Col (1/3) - Impact & Details */}
                      <div className="space-y-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 shadow-inner">
                        <section>
                          <h4 className="type-meta mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--cyan-full)] text-opacity-80">
                            Measurable Impact
                          </h4>
                          <p className="type-body font-medium text-[var(--text-100)]">
                            {selectedProject.impact}
                          </p>
                        </section>
                        
                        <div className="h-px w-full bg-[var(--border-subtle)]" />

                        <section>
                          <h4 className="type-meta mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--cyan-full)] text-opacity-80">
                            Delivered Outcome
                          </h4>
                          <p className="type-body text-[0.85rem] text-[var(--text-200)]">
                            {selectedProject.outcome}
                          </p>
                        </section>

                        <div className="h-px w-full bg-[var(--border-subtle)]" />

                        <section>
                          <h4 className="type-meta mb-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--cyan-full)] text-opacity-80">
                            Role Scope
                          </h4>
                          <p className="type-body text-[0.85rem] text-[var(--text-200)]">
                            {selectedProject.role}
                          </p>
                        </section>
                      </div>

                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex shrink-0 flex-wrap gap-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 sm:px-8 sm:py-6">
                    <a href={selectedProject.liveHref} target="_blank" rel="noopener noreferrer" className="btn-primary focus-ring text-sm sm:px-6">
                      View Live Deployment
                    </a>
                    <a href={selectedProject.codeHref} target="_blank" rel="noopener noreferrer" className="btn-outline focus-ring text-sm sm:px-6" style={{ background: 'var(--bg-surface)' }}>
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
