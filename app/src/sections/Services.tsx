import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  Brain,
  Circle,
  CloudCog,
  Code2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { servicesConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';

function renderServiceIcon(iconName: string, className: string) {
  const props = { className, 'aria-hidden': true as const };
  switch (iconName) {
    case 'Brain':
      return <Brain {...props} />;
    case 'Code2':
      return <Code2 {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'CloudCog':
      return <CloudCog {...props} />;
    default:
      return <Circle {...props} />;
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

const BENTO_SIZES = ['lg:col-span-2', 'lg:col-span-1', 'lg:col-span-1', 'lg:col-span-2'];

const SERVICE_IMAGES = [
  '/images/service-ai.png',
  '/images/service-frontend.png',
  '/images/service-security.png',
  '/images/service-cloud.png',
];

// Per-image tint overlay so each card has its own color mood
const SERVICE_TINTS = [
  'rgba(34,211,238,0.10)',   // AI — cyan mist
  'rgba(139,92,246,0.10)',   // Frontend — violet mist
  'rgba(244,63,94,0.10)',    // Security — rose mist
  'rgba(34,211,238,0.08)',   // Cloud — cyan mist
];

function ServiceVisual({ index, iconName, isFeatured }: { index: number; iconName: string; isFeatured: boolean }) {
  const img = SERVICE_IMAGES[index % SERVICE_IMAGES.length];
  const tint = SERVICE_TINTS[index % SERVICE_TINTS.length];
  const heightClass = isFeatured ? 'h-32 sm:h-36' : 'h-24 sm:h-28';

  return (
    <div
      className={`service-visual-card relative overflow-hidden ${heightClass}`}
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Background photo */}
      <img
        src={img}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ opacity: 0.55 }}
        loading="lazy"
      />

      {/* Dark scrim so card text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, rgba(6,6,10,0.72) 0%, rgba(6,6,10,0.46) 60%, rgba(6,6,10,0.20) 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Colour tint layer for brand identity */}
      <div
        className="absolute inset-0"
        style={{ background: tint, mixBlendMode: 'screen' }}
        aria-hidden="true"
      />

      {/* SIGNAL label — top-left */}
      <div
        className="absolute left-5 top-5 flex items-center gap-2 text-xs uppercase tracking-[0.14em] z-10"
        style={{ color: 'var(--cyan-dim)' }}
      >
        {renderServiceIcon(iconName, 'h-4 w-4')}
        Signal
      </div>

      {/* Number badge — top-right */}
      <span
        className="absolute right-4 top-4 rounded-full px-2 py-1 font-mono text-[0.62rem] z-10"
        style={{
          border: '1px solid var(--border-accent)',
          background: 'rgba(6,6,10,0.72)',
          color: 'var(--cyan-full)',
          backdropFilter: 'blur(4px)',
        }}
      >
        0{index + 1}
      </span>

      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px z-10"
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
}: {
  service: (typeof servicesConfig.services)[number];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { onMouseMove } = useSpotlight(ref);
  const isFeatured = BENTO_SIZES[index % BENTO_SIZES.length].includes('col-span-2');

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { ...motionTokens.spring.soft, delay: index * 0.06 }}
      className={`group card-spotlight glass-card relative flex flex-col overflow-hidden rounded-2xl ${BENTO_SIZES[index % BENTO_SIZES.length]}`}
      ref={ref}
      onMouseMove={onMouseMove}
    >
      <ServiceVisual index={index} iconName={service.iconName} isFeatured={isFeatured} />

      <div className="relative z-10 flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              border: '1px solid var(--border-dim)',
              background: 'var(--cyan-glow)',
              color: 'var(--cyan-full)',
            }}
          >
            {renderServiceIcon(service.iconName, 'h-4 w-4')}
          </span>
          <h3 className="type-heading text-sm font-semibold" style={{ color: 'var(--text-100)' }}>{service.title}</h3>
        </div>

        <p className="type-body flex-1 text-sm leading-[1.55]" style={{ color: 'var(--text-200)' }}>{service.description}</p>

        <p className="type-body text-xs leading-relaxed" style={{ color: 'var(--text-300)' }}>Outcome: {service.outcomes}</p>

        <a href="#contact" className="btn-outline focus-ring mt-auto inline-flex min-h-[46px] items-center justify-between gap-2 text-sm">
          Discuss Implementation
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

export function Services() {
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!servicesConfig.heading && servicesConfig.services.length === 0) return null;

  return (
    <section id="services" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute top-1/2 -left-40 -translate-y-1/2 h-[620px] w-[480px] opacity-[0.05] rounded-full"
        style={{ background: 'radial-gradient(circle, #22d3ee, transparent 65%)', filter: 'blur(110px)' }}
        aria-hidden="true"
      />
      <div
        className="ambient-blob pointer-events-none absolute bottom-0 right-0 h-[460px] w-[460px] opacity-[0.05] rounded-full"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 65%)', filter: 'blur(95px)', animationDelay: '5s' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {servicesConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={servicesConfig.heading}
            type="words"
            className="section-title max-w-3xl text-balance"
          />
          <p className="section-copy type-body">{servicesConfig.description}</p>
        </div>

        {/* Mobile: accordion. Desktop: bento grid */}
        <div className="sm:grid sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-3 space-y-2 sm:space-y-0">
          {servicesConfig.services.map((service, index) => {
            const accentColors = ['var(--cyan-full)', '#8b5cf6', '#f43f5e', 'var(--cyan-dim)'];
            const accent = accentColors[index % accentColors.length];
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.06, duration: 0.4, ease: [0.22,1,0.36,1] }}
              >
                {/* Mobile accordion card */}
                <div className={`service-accordion-card sm:hidden${isOpen ? ' open' : ''}`}>
                  <div className="service-accent-bar" style={{ background: accent }} />
                  <button
                    className="service-accordion-header"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`service-body-${index}`}
                  >
                    <span className="service-accordion-icon">
                      {renderServiceIcon(service.iconName, 'h-4 w-4')}
                    </span>
                    <span className="service-accordion-title">{service.title}</span>
                    <span className="service-accordion-number">0{index + 1}</span>
                    <ChevronDown className={`service-accordion-chevron${isOpen ? ' open' : ''}`} aria-hidden="true" />
                  </button>
                  <div
                    id={`service-body-${index}`}
                    className={`service-accordion-body${isOpen ? ' open' : ''}`}
                  >
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-200)' }}>{service.description}</p>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-300)' }}>Outcome: {service.outcomes}</p>
                    <a href="#contact" className="btn-outline focus-ring inline-flex w-full min-h-[44px] items-center justify-between gap-2 text-sm">
                      Discuss Implementation
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Desktop card (bento) */}
                <ServiceCard service={service} index={index} shouldReduceMotion={shouldReduceMotion ?? false} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
