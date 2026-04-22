import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { experienceConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';

function parseDuration(duration: string): { years: number; months: number } {
  const now = new Date();
  const match = duration.match(/(?:(\w+)\s+)?(\d{4})\s*[-–]\s*(?:(\w+)\s+)?(\d{4}|Present)/i);
  if (!match) return { years: 0, months: 0 };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [, startMonth, startYear, endMonth, endYear] = match;
  const start = new Date(
    parseInt(startYear, 10),
    startMonth ? months.indexOf(startMonth.slice(0, 3)) : 0,
  );
  const end =
    endYear === 'Present'
      ? now
      : new Date(parseInt(endYear, 10), endMonth ? months.indexOf(endMonth.slice(0, 3)) : 11);

  const diffMonths = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
  return { years: Math.floor(diffMonths / 12), months: diffMonths % 12 };
}

function DurationTicker({ duration }: { duration: string }) {
  const shouldReduceMotion = useReducedMotion();
  const { years, months } = parseDuration(duration);
  const [tick, setTick] = useState({ years: 0, months: 0 });

  useEffect(() => {
    if (shouldReduceMotion || (years === 0 && months === 0)) return;

    const durationMs = 700;
    const startTime = performance.now();
    let frameId = 0;

    const update = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setTick({
        years: Math.floor(eased * years),
        months: Math.floor(eased * months),
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(update);
      } else {
        setTick({ years, months });
      }
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [months, shouldReduceMotion, years]);

  if (years === 0 && months === 0) return <span>{duration}</span>;

  const displayYears = shouldReduceMotion ? years : tick.years;
  const displayMonths = shouldReduceMotion ? months : tick.months;

  return (
    <span>
      {displayYears > 0 && `${displayYears}y `}
      {displayMonths > 0 && `${displayMonths}mo`}
      {!displayYears && !displayMonths && duration}
    </span>
  );
}

function ExperienceCard({
  item,
  index,
  shouldReduceMotion,
}: {
  item: (typeof experienceConfig.items)[number];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const cardNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { delay: index * 0.06, duration: 0.34, ease: motionTokens.ease.standard }
      }
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      className="group relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-[1.4rem] border p-5 shadow-[0_18px_44px_-34px_rgba(0,0,0,0.85)] sm:p-6"
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-accent) 50%, transparent)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at top, rgba(255,112,67,0.10), transparent 50%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{ borderColor: 'var(--border-accent)', background: 'var(--cyan-glow)', color: 'var(--cyan-full)' }}
          >
            <Briefcase className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[var(--text-400)]">
              Experience {cardNumber}
            </p>
            <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--cyan-full)]">
              <DurationTicker duration={item.duration} />
            </p>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.68rem] font-medium"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-300)' }}
        >
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[var(--cyan-dim)]" aria-hidden="true" />
          <span className="leading-none">{item.location}</span>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <h3 className="type-heading text-xl font-bold tracking-tight text-[var(--text-100)]">
          {item.company}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--text-200)]">
          {item.role}
        </p>
      </div>

      <ul className="relative z-10 mt-5 space-y-3">
        {item.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-300)]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cyan-dim)]" aria-hidden="true" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function Experience() {
  const shouldReduceMotion = useReducedMotion();

  if (!experienceConfig.items || experienceConfig.items.length === 0) return null;

  return (
    <section id="experience" className="section-shell relative overflow-hidden">
      <div
        className="pointer-events-none absolute left-0 top-1/4 h-[380px] w-[380px] -translate-x-1/2 rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header">
          <span className="section-eyebrow">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {experienceConfig.label}
          </span>
          <AnimatedText
            el="h2"
            text={experienceConfig.heading}
            type="words"
            className="section-title max-w-3xl text-balance"
          />
          <p className="section-copy type-body max-w-2xl">{experienceConfig.description}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
          {experienceConfig.items.map((item, index) => (
            <ExperienceCard
              key={`${item.company}-${index}`}
              item={item}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
