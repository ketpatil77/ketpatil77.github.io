import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { publicationsConfig } from '@/config';
import { useIsMobile } from '@/hooks/use-mobile';

function PaperFront({ item }: { item: (typeof publicationsConfig.items)[number] }) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent) 50%, transparent)' }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="tech-tag">{item.issue}</span>
        <span className="tech-tag">{item.publishedOn}</span>
        <span className="tech-tag">IF {item.impactFactor}</span>
        <span
          className="rounded-full border px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-wider"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-300)' }}
        >
          {item.paperId}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="type-heading text-[1.04rem] font-bold leading-snug text-[var(--text-100)] sm:text-[1.12rem]">
          {item.title}
        </h3>
        <p className="mt-3 text-xs font-semibold text-[var(--text-200)]">{item.journal}</p>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-400)]">{item.authors}</p>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-200)]">{item.summary}</p>

      <div className="mt-5 flex-1">
        <p className="type-meta text-[0.62rem] font-bold text-[var(--text-400)]">Key Contributions</p>
        <ul className="mt-3 space-y-2.5">
          {item.contributions.map((contribution) => (
            <li key={contribution} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-200)]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cyan-full)]" aria-hidden="true" />
              <span>{contribution}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
        <p className="hidden text-[0.65rem] text-[var(--text-500)] sm:block">Hover for proof metrics</p>
        <a
          href={item.pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline focus-ring inline-flex items-center gap-1.5 px-3 py-2 text-xs"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Read Paper
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function PaperBack({ item }: { item: (typeof publicationsConfig.items)[number] }) {
  return (
    <>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--violet), transparent)' }}
        aria-hidden="true"
      />

      <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--violet)]">
        Proof Metrics
      </p>
      <h4 className="mt-3 type-heading text-base font-semibold leading-snug text-[var(--text-100)]">
        {item.title}
      </h4>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {item.metrics.map((metric) => (
          <div
            key={metric}
            className="rounded-xl border px-3 py-3"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
          >
            <p className="text-xs font-medium leading-relaxed text-[var(--text-200)]">{metric}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex-1">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--text-400)]">Focus Areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.focusAreas.map((area) => (
            <span
              key={area}
              className="rounded-full border px-2.5 py-1 text-[0.65rem]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-200)', background: 'var(--bg-elevated)' }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <a
          href={item.pdfHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline focus-ring inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-xs"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          Read Full Paper
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function PaperCard({
  item,
  index,
  shouldReduceMotion,
}: {
  item: (typeof publicationsConfig.items)[number];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const isMobile = useIsMobile();
  const [flipped, setFlipped] = useState(false);
  const disableFlip = Boolean(shouldReduceMotion) || isMobile;

  if (disableFlip) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.3, ease: motionTokens.ease.standard, delay: index * 0.06 }
        }
        className="relative flex min-h-[31rem] flex-col overflow-hidden rounded-2xl border p-5"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'linear-gradient(165deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
        }}
      >
        <PaperFront item={item} />
      </motion.article>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, ease: motionTokens.ease.standard, delay: index * 0.06 }}
      className="group relative min-h-[31rem]"
      style={{ perspective: '1600px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocusCapture={() => setFlipped(true)}
      onBlurCapture={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 18, mass: 0.85 }}
        className="relative h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <article
          className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-2xl border p-5"
          style={{
            borderColor: 'var(--border-subtle)',
            background: 'linear-gradient(165deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <PaperFront item={item} />
        </article>

        <article
          className="absolute inset-0 flex h-full flex-col overflow-hidden rounded-2xl border p-5"
          style={{
            borderColor: 'var(--border-subtle)',
            background: 'linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.018))',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <PaperBack item={item} />
        </article>
      </motion.div>
    </motion.div>
  );
}

export function Publications() {
  const shouldReduceMotion = useReducedMotion();

  if (publicationsConfig.items.length === 0) return null;

  return (
    <section id="publications" className="section-shell relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-[360px] w-[360px] -translate-y-1/3 rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, var(--violet), transparent 65%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] translate-x-1/4 translate-y-1/4 rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 65%)', filter: 'blur(100px)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header items-start text-left">
          <span className="section-eyebrow">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {publicationsConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={publicationsConfig.heading}
            type="words"
            className="section-title max-w-4xl text-balance"
          />
          <p className="section-copy type-body max-w-3xl">{publicationsConfig.description}</p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {publicationsConfig.themes.map((theme) => (
            <div
              key={theme}
              className="flex items-start gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
            >
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--cyan-full)]" aria-hidden="true" />
              <span className="text-xs leading-relaxed text-[var(--text-200)]">{theme}</span>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
          className="relative mt-6 overflow-hidden rounded-[1.6rem] border p-5 sm:p-6"
          style={{
            borderColor: 'var(--border-subtle)',
            background: 'linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent) 40%, rgba(201,169,97,0.36) 70%, transparent)' }}
            aria-hidden="true"
          />

          <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
            <div className="min-w-0">
              <p className="type-meta text-[0.66rem] font-bold text-[var(--cyan-full)]">Research Snapshot</p>
              <h3 className="mt-2 type-heading text-[1.28rem] font-bold leading-tight text-[var(--text-100)] sm:text-[1.5rem]">
                Two peer-reviewed AI/ML papers published in 2026.
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-300)]">
                Publication-grade proof with benchmark metrics, edge deployment context, and direct paper access.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {publicationsConfig.highlights.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border px-3 py-3 sm:px-4"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
                >
                  <p className="type-heading text-[1.18rem] font-bold leading-none text-[var(--text-100)] sm:text-[1.4rem]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] leading-snug text-[var(--text-400)]">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {publicationsConfig.items.map((item, index) => (
            <PaperCard key={item.paperId} item={item} index={index} shouldReduceMotion={shouldReduceMotion} />
          ))}
        </div>
      </div>
    </section>
  );
}
