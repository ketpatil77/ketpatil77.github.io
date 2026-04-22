import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  FileText,
  LayoutPanelTop,
  Menu,
  Moon,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { navigationConfig } from '@/config';
import { AnimatedButton } from '@/components/AnimatedButton';
import { motionTokens } from '@/lib/motion';
import type { Theme } from '@/hooks/useTheme';

const HEADER_OFFSET = 82;

const mobileOverlayLinks: Array<{ label: string; href: string; icon: LucideIcon }> = [
  { label: 'Overview', href: '#hero', icon: LayoutPanelTop },
  { label: 'Case Studies', href: '#portfolio', icon: BriefcaseBusiness },
  { label: 'Experience', href: '#experience', icon: Boxes },
  { label: 'Research', href: '#publications', icon: FileText },
];

type NavigationProps = {
  onThemeToggle: () => void;
  theme: Theme;
};

function resolveMobileActiveHref(activeHref: string) {
  if (activeHref === '#publications') return '#publications';
  if (activeHref === '#experience') return '#experience';
  if (activeHref === '#portfolio') return '#portfolio';
  if (activeHref === '#services' || activeHref === '#tech-stack' || activeHref === '#about') {
    return '#experience';
  }
  return '#portfolio';
}

export function Navigation({ onThemeToggle, theme }: NavigationProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(navigationConfig.links[0]?.href ?? '#portfolio');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  // Dock scale + blur as user scrolls past 400px
  const dockScale = useTransform(scrollY, [0, 400], [1, 0.94]);
  const dockBlur = useTransform(scrollY, [0, 400], [8, 18]);

  const isLight = theme === 'light';

  const sectionAnchors = useMemo(
    () => navigationConfig.links.map((link) => link.href).filter((href) => href.startsWith('#')),
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(y > 10);
      setScrollProgress(maxScroll > 0 ? y / maxScroll : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const elements = sectionAnchors
      .map((href) => document.querySelector(href))
      .filter((el): el is Element => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .forEach((entry) => setActiveHref(`#${entry.target.id}`));
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0,
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionAnchors]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setIsMenuOpen(false);
    };

    handleViewportChange(mediaQuery);
    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) {
      setIsMenuOpen(false);
      return;
    }
    event.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setActiveHref(href === '#hero' ? '#portfolio' : href);
    setIsMenuOpen(false);
  };

  if (!navigationConfig.logo && navigationConfig.links.length === 0) return null;

  const mobileActiveHref = resolveMobileActiveHref(activeHref);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          isScrolled || isMenuOpen ? 'nav-shell' : 'bg-transparent',
        )}
        style={!prefersReducedMotion ? { scale: dockScale } : undefined}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : motionTokens.duration.base }}
      >
        <div 
          className="container-large"
          style={!prefersReducedMotion && isScrolled ? { backdropFilter: `blur(${dockBlur.get()}px)` } : undefined}
        >
          <div className="flex h-[4rem] items-center justify-between gap-4">
            <a
              href="#hero"
              onClick={(event) => handleNavClick(event, '#hero')}
              className="focus-ring type-heading inline-flex min-h-11 items-center rounded-md px-2 text-base font-semibold tracking-tight sm:px-1"
              style={{ color: 'var(--text-100)' }}
              aria-label="Go to top"
            >
              <span className="text-gradient" style={{ marginRight: '0.25rem' }}>Ketan</span>
              <span style={{ color: 'var(--text-200)' }}>Patil</span>
            </a>

            <div className="hidden items-center gap-1 md:flex">
              {navigationConfig.links.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(event) => handleNavClick(event, link.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'focus-ring type-body relative rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
                    )}
                    style={{
                      color: isActive ? 'var(--text-100)' : 'var(--text-300)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-200)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.color = 'var(--text-300)';
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: isLight ? 'rgba(230,81,0,0.08)' : 'rgba(255,255,255,0.05)',
                          border: isLight
                            ? '1px solid rgba(230,81,0,0.20)'
                            : '1px solid rgba(255,255,255,0.10)',
                        }}
                        transition={{ type: 'spring', bounce: 0.22, duration: 0.4 }}
                      />
                    )}
                    <span className="relative inline-flex items-center gap-2">
                      {link.label}
                        {isActive && (
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: 'var(--cyan-full)' }}
                            aria-hidden="true"
                          />
                        )}
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                onClick={onThemeToggle}
                className="focus-ring hidden h-11 w-11 items-center justify-center rounded-lg transition-all duration-200 md:inline-flex"
                style={{
                  border: '1px solid var(--border-dim)',
                  background: isLight ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.04)',
                  color: 'var(--text-200)',
                }}
                aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isLight ? (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    >
                      <Moon className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: 30, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -30, scale: 0.7 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    >
                      <Sun className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="hidden lg:block">
                <AnimatedButton
                  href={navigationConfig.contactHref}
                  download={navigationConfig.contactDownloadName}
                  variant="primary"
                  size="sm"
                  className="px-[1.1rem] py-2 text-sm"
                  showIcon
                >
                  {navigationConfig.contactLabel}
                </AnimatedButton>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="focus-ring inline-flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg md:hidden"
                style={{
                  border: '1px solid var(--border-dim)',
                  background: isLight ? 'rgba(255,255,255,0.88)' : 'rgba(10,10,10,0.78)',
                  color: 'var(--text-200)',
                  boxShadow: isLight
                    ? '0 10px 24px -18px rgba(15, 23, 42, 0.35)'
                    : '0 12px 28px -18px rgba(0, 0, 0, 0.88)',
                }}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full" style={{ height: '2px', background: 'var(--border-subtle)' }} aria-hidden="true">
          <div
            className="transition-[width] duration-150"
            style={{
              height: '2px',
              width: `${Math.max(0, scrollProgress * 100)}%`,
              background: isLight
                ? 'linear-gradient(90deg, var(--cyan-full), rgba(201,169,97,0.70))'
                : 'linear-gradient(90deg, var(--cyan-full), rgba(201,169,97,0.55))',
            }}
          />
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="mobile-overlay-backdrop fixed inset-0 z-[60] md:hidden"
            style={{
              background: isLight ? 'rgba(250, 247, 244, 0.60)' : 'rgba(20, 20, 20, 0.60)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : motionTokens.duration.fast }}
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              className="mobile-overlay-shell container-large relative flex h-full flex-col overflow-y-auto pb-4 pt-4"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 18 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x > 80) setIsMenuOpen(false);
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : motionTokens.duration.base,
                ease: motionTokens.ease.standard,
              }}
              onClick={(event) => event.stopPropagation()}
              style={{ touchAction: 'pan-y' }}
            >
              <div className="mobile-overlay-header">
                <a
                  href="#hero"
                  onClick={(event) => handleNavClick(event, '#hero')}
                  className="focus-ring mobile-overlay-wordmark"
                  aria-label="Go to overview"
                >
                  <span className="text-gradient" style={{ marginRight: '0.3rem' }}>Ketan</span> Patil
                </a>

                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    onClick={onThemeToggle}
                    className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200"
                    style={{
                      border: '1px solid var(--border-dim)',
                      background: isLight ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.05)',
                      color: 'var(--text-200)',
                    }}
                    aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                  >
                    {isLight ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      border: '1px solid var(--border-dim)',
                      background: isLight ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.05)',
                      color: 'var(--text-200)',
                    }}
                    aria-label="Close navigation"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mobile-overlay-body">
                <div className="mobile-overlay-intro">
                  <p className="mobile-overlay-label">Navigation</p>
                  <div className="mobile-overlay-rule" aria-hidden="true" />
                </div>

                <nav className="mobile-overlay-nav" aria-label="Mobile navigation">
                  {mobileOverlayLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = mobileActiveHref === link.href;
                    return (
                      <motion.a
                        key={link.label}
                        href={link.href}
                        onClick={(event) => handleNavClick(event, link.href)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn('focus-ring mobile-overlay-item', isActive && 'is-active')}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
                      >
                        <span className="mobile-overlay-icon" aria-hidden="true">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="mobile-overlay-text">{link.label}</span>
                      </motion.a>
                    );
                  })}
                </nav>
              </div>

              <div className="mobile-overlay-footer">
                <a href="#portfolio" onClick={(event) => handleNavClick(event, '#portfolio')} className="mobile-overlay-cta focus-ring">
                  Explore Case Studies
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
