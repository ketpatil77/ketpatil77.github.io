import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { footerConfig } from '@/config';
import { motionTokens } from '@/lib/motion';

const HEADER_OFFSET = 82;

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const year = useMemo(() => new Date().getFullYear(), []);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 380);
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

  return (
    <footer
      className="relative overflow-hidden pb-7 pt-8"
      style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border-dim) 20%, var(--border-dim) 80%, transparent)' }}
        aria-hidden="true"
      />

      <div className="container-large">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <a href="#" className="focus-ring type-heading inline-flex min-h-11 items-center rounded-md text-lg font-semibold" style={{ color: 'var(--text-100)' }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' }); }}>
            <span className="text-gradient">{footerConfig.logo.split(' ')[0]}</span>
            <span style={{ color: 'var(--text-200)' }}> {footerConfig.logo.split(' ').slice(1).join(' ')}</span>
          </a>

          <nav className="flex flex-wrap items-center gap-3" aria-label="Footer links">
            {footerConfig.utilityLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="utility-link focus-ring"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <p className="type-meta text-[0.72rem] sm:text-[0.62rem]" style={{ color: 'var(--text-400)' }}>For direct outreach, use the Connect section above.</p>
        </div>

        <div
          className="mt-6 flex flex-col items-start justify-between gap-2 pt-4 text-xs sm:flex-row sm:items-center"
          style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-400)' }}
        >
          <p>{footerConfig.copyright || `© ${year} Ketan Patil. All rights reserved.`}</p>
          <p>{footerConfig.credit}</p>
        </div>
      </div>

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
            }}
            aria-label="Back to top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: motionTokens.duration.fast, type: 'spring', bounce: 0.35 }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -2 }}
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
