import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Brain, ChevronDown, Circle, CloudCog, Code2, ShieldCheck, Sparkles } from 'lucide-react';
import { brandConfig, servicesConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { TiltCard } from '@/components/ui/tilt-card';
import { LazySpline } from '@/components/ui/spline';
import { getServicesSceneUrl } from '@/config/spline';
import { useIsMobile } from '@/hooks/use-mobile';

function renderServiceIcon(iconName: string, className: string) {
  const props = { className, 'aria-hidden': true as const };
  switch (iconName) {
    case 'Brain':     return <Brain {...props} />;
    case 'Code2':     return <Code2 {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'CloudCog':  return <CloudCog {...props} />;
    default:          return <Circle {...props} />;
  }
}

/** Maps service icon names to their animated CSS class + description hint */
function serviceIconAnimClass(iconName: string) {
  switch (iconName) {
    case 'Brain':    return 'service-icon-brain';
    case 'CloudCog': return 'service-icon-cloudcog';
    default:         return '';
  }
}

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

const SERVICE_IMAGES = [
  '/images/service-ai.png',
  '/images/service-frontend.png',
  '/images/service-security.png',
  '/images/service-cloud.png',
];

const SERVICE_TINTS = [
  'rgba(255,112,67,0.10)',
  'rgba(201,169,97,0.10)',
  'rgba(255,112,67,0.08)',
  'rgba(201,169,97,0.08)',
];

function ServiceVisual({ index, iconName }: { index: number; iconName: string }) {
  const img = SERVICE_IMAGES[index % SERVICE_IMAGES.length];
  const tint = SERVICE_TINTS[index % SERVICE_TINTS.length];

  return (
    <div className="service-visual-card relative h-32 overflow-hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <img
        src={img}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ opacity: 0.55 }}
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(6,6,10,0.72) 0%, rgba(6,6,10,0.46) 60%, rgba(6,6,10,0.20) 100%)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0" style={{ background: tint, mixBlendMode: 'screen' }} aria-hidden="true" />

      <div
        className="absolute left-5 top-5 z-10 flex items-center gap-2 text-xs uppercase tracking-[0.14em]"
        style={{ color: 'var(--cyan-dim)' }}
      >
        {renderServiceIcon(iconName, `h-4 w-4 shrink-0 ${serviceIconAnimClass(iconName)}`)}
        Signal
      </div>

      <span
        className="absolute right-4 top-4 z-10 rounded-full px-2 py-1 font-mono text-[0.62rem]"
        style={{
          border: '1px solid var(--border-accent)',
          background: 'rgba(6,6,10,0.72)',
          color: 'var(--cyan-full)',
          backdropFilter: 'blur(4px)',
        }}
      >
        0{index + 1}
      </span>

      <div
        className="absolute inset-x-0 top-0 z-10 h-px rounded-t-2xl"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent) 50%, transparent)' }}
        aria-hidden="true"
      />
    </div>
  );
}

function ServiceCard({
  service,
  index,
  shouldReduceMotion,
  featured = false,
}: {
  service: (typeof servicesConfig.services)[number];
  index: number;
  shouldReduceMotion: boolean | null;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { onMouseMove } = useSpotlight(ref);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { ...motionTokens.spring.soft, delay: index * 0.06 }}
      className={`group card-spotlight glass-card relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-[var(--border-bright)] ${
        featured ? 'bento-featured' : ''
      }`}
      ref={ref}
      onMouseMove={onMouseMove}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
    >
      <ServiceVisual index={index} iconName={service.iconName} />

      <div className="relative z-10 flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${serviceIconAnimClass(service.iconName)}`}
            style={{
              border: '1px solid var(--border-dim)',
              background: 'var(--cyan-glow)',
              color: 'var(--cyan-full)',
            }}
          >
            {renderServiceIcon(service.iconName, 'h-4 w-4 shrink-0')}
          </span>
          <h3 className="type-heading text-sm font-semibold text-[var(--text-100)]">{service.title}</h3>
        </div>

        <p className="type-body text-sm leading-relaxed text-[var(--text-200)]">{service.description}</p>

        {/* Outcomes — expand on hover */}
        <motion.p
          className="type-body text-sm leading-relaxed text-[var(--text-300)] overflow-hidden"
          initial={{ maxHeight: '2.5rem' }}
          whileHover={shouldReduceMotion ? undefined : { maxHeight: '8rem' }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          Outcome: {service.outcomes}
        </motion.p>

        <div className="mt-auto pt-4">
          <a
            href={brandConfig.recruiterCtaHref}
            className="btn-outline focus-ring inline-flex min-h-[46px] w-full items-center justify-between gap-2 text-sm"
          >
            Discuss Implementation
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function Services() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!servicesConfig.heading && servicesConfig.services.length === 0) return null;

  return (
    <section id="services" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute top-1/2 -left-40 h-[620px] w-[480px] -translate-y-1/2 rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #ff7043, transparent 65%)', filter: 'blur(110px)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute bottom-0 right-0 h-[460px] w-[460px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #c9a961, transparent 65%)', filter: 'blur(95px)', animationDelay: '5s' }}
        aria-hidden="true"
      />
      
      {/* 3D Services Background */}
      {!shouldReduceMotion && !isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <LazySpline
            scene={getServicesSceneUrl()}
            fallback={<div className="h-full w-full" />}
            className="h-full w-full opacity-10"
            containerClassName="h-full w-full"
            rootMargin="220px"
          />
        </div>
      )}
      
      

      <div className="container-large relative z-10">
        <div className="section-header items-start text-left">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {servicesConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={servicesConfig.heading}
            type="words"
            className="section-title max-w-3xl text-balance"
          />
          <p className="section-copy type-body max-w-2xl">{servicesConfig.description}</p>
        </div>

        {/* ── Mobile accordion ── */}
        <div className="mt-8 space-y-3 sm:hidden sm:mt-10">
          {servicesConfig.services.map((service, index) => {
            const accentColors = ['var(--cyan-full)', 'var(--violet)', 'var(--cyan-dim)', 'var(--violet)'];
            const accent = accentColors[index % accentColors.length];
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              >
                <div className={`service-accordion-card${isOpen ? ' open' : ''}`}>
                  <div className="service-accent-bar" style={{ background: accent }} />
                  <button
                    className="service-accordion-header"
                    onClick={() => {
                      const next = isOpen ? null : index;
                      setOpenIndex(next);
                      if (next !== null) {
                        // Scroll into view on accordion open
                        setTimeout(() => {
                          const el = document.getElementById(`service-body-${next}`);
                          if (el) {
                            const top = el.getBoundingClientRect().top + window.scrollY - 100;
                            window.scrollTo({ top, behavior: 'smooth' });
                          }
                        }, 60);
                      }
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`service-body-${index}`}
                  >
                    <span className="service-accordion-icon">
                      {renderServiceIcon(service.iconName, 'h-4 w-4 shrink-0')}
                    </span>
                    <span className="service-accordion-title">{service.title}</span>
                    <span className="service-accordion-number">0{index + 1}</span>
                    <ChevronDown className={`service-accordion-chevron${isOpen ? ' open' : ''}`} aria-hidden="true" />
                  </button>
                  <div id={`service-body-${index}`} className={`service-accordion-body${isOpen ? ' open' : ''}`}>
                    <p className="mb-3 text-sm leading-relaxed text-[var(--text-200)]">{service.description}</p>
                    <p className="mb-4 text-sm leading-relaxed text-[var(--text-300)]">Outcome: {service.outcomes}</p>
                    <a
                      href={brandConfig.recruiterCtaHref}
                      className="btn-outline focus-ring inline-flex w-full min-h-[44px] items-center justify-between gap-2 text-sm"
                    >
                      Discuss Implementation
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Desktop: 4 cards in one row side by side ── */}
        <div
          className="mt-8 hidden sm:grid sm:mt-10"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.25rem',
          }}
        >
          {servicesConfig.services.map((service, index) => (
            <TiltCard
              key={service.title}
              maxTilt={4}
              scale={1.015}
              disabled={Boolean(shouldReduceMotion)}
              className="h-full"
            >
              <ServiceCard
                service={service}
                index={index}
                shouldReduceMotion={shouldReduceMotion}
              />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
