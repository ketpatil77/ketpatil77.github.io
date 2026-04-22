import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { footerConfig, socialConfig } from '@/config';
import { SocialIcons } from '@/components/ui/social-icons';
import { motionTokens } from '@/lib/motion';

const HEADER_OFFSET = 82;

/** Progress-ring SVG that tracks scroll position */
function ProgressRing({ progress, size = 44 }: { progress: number; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress, 1));

  return (
    <svg
      width={size}
      height={size}
      className="back-to-top-ring absolute inset-0"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border-dim)"
        strokeWidth={1.5}
      />
      {/* Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--cyan-full)"
        strokeWidth={1.5}
        strokeLinecap="round"
        className="progress-ring-circle"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          transition: 'stroke-dashoffset 0.15s ease',
        }}
      />
    </svg>
  );
}

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const year = useMemo(() => new Date().getFullYear(), []);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const footerRef = useRef<HTMLElement>(null);

  const primaryLinks = footerConfig.utilityLinks.slice(0, Math.ceil(footerConfig.utilityLinks.length / 2));
  const secondaryLinks = footerConfig.utilityLinks.slice(Math.ceil(footerConfig.utilityLinks.length / 2));
  const socialItems = socialConfig.map((social) => ({
    name: social.label === 'Email' ? 'Email' : social.label,
    href: social.href,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setShowBackToTop(y > 380);
      setScrollProgress(maxScroll > 0 ? y / maxScroll : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    event.preventDefault();
    const element = document.querySelector(href);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  // Column stagger variants
  const colVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { delay: i * 0.08, ...motionTokens.spring.soft },
    }),
  };

  const columns = [
    /* Brand */
    <div key="brand">
      <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--text-400)]">Brand</p>
      <a
        href="#hero"
        className="focus-ring type-heading inline-flex min-h-11 items-center rounded-md text-lg font-semibold"
        style={{ color: 'var(--text-100)' }}
        onClick={(event) => handleNavClick(event, '#hero')}
      >
        <span className="text-gradient">{footerConfig.logo.split(' ')[0]}</span>
        <span style={{ color: 'var(--text-200)' }}> {footerConfig.logo.split(' ').slice(1).join(' ')}</span>
      </a>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-300)]">
        Portfolio systems, research-backed delivery, and security-aware product execution.
      </p>
      <p className="mt-3 text-sm text-[var(--text-400)]">{footerConfig.credit}</p>
      <div className="mt-4 flex items-center gap-2">
        <SocialIcons items={socialItems} />
      </div>
    </div>,

    /* Explore */
    <div key="explore">
      <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--text-400)]">Explore</p>
      <div className="grid gap-2">
        {primaryLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(event) => handleNavClick(event, link.href)}
            className="footer-link focus-ring text-sm leading-relaxed text-[var(--text-300)] transition-colors hover:text-[var(--text-100)]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>,

    /* More */
    <div key="more">
      <p className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--text-400)]">More</p>
      <div className="grid gap-2">
        {secondaryLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(event) => handleNavClick(event, link.href)}
            className="footer-link focus-ring text-sm leading-relaxed text-[var(--text-300)] transition-colors hover:text-[var(--text-100)]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>,

  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden pt-10 pb-6"
      style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-dim) 20%, var(--border-dim) 80%, transparent)' }}
        aria-hidden="true"
      />

      <div className="container-large">
        {/* ── 4-column grid with stagger reveal ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={colVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              {col}
            </motion.div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-6 sm:flex-row"
          style={{ marginTop: '2rem' }}
        >
          {/* Copyright with shimmer */}
          <p className={`text-sm ${shouldReduceMotion ? 'text-[var(--text-400)]' : 'text-shimmer'}`}>
            {footerConfig.copyright || `© ${year} Ketan Patil. All rights reserved.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1 sm:justify-end">
            {footerConfig.utilityLinks.map((link) => (
              <a
                key={`bottom-${link.label}`}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="focus-ring utility-link footer-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Back to top button with progress ring ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })}
            className="focus-ring fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-xl"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-accent)',
              color: 'var(--cyan-full)',
              position: 'fixed',
            }}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: motionTokens.duration.fast, type: 'spring', bounce: 0.35 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }}
          >
            {!shouldReduceMotion && <ProgressRing progress={scrollProgress} size={44} />}
            <ArrowUp className="relative z-10 h-4 w-4 shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
