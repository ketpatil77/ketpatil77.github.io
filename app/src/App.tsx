import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CustomCursor } from '@/components/CustomCursor';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Services } from '@/sections/Services';
import { TechStack } from '@/sections/TechStack';
import { Portfolio } from '@/sections/Portfolio';
import { Experience } from '@/sections/Experience';
import { Credentials } from '@/sections/Credentials';
import { CTA } from '@/sections/CTA';
import { Footer } from '@/sections/Footer';
import { siteConfig } from '@/config';
import { PageReveal } from '@/components/PageReveal';
import AetherFlowHero from '@/components/ui/aether-flow-hero';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeContext } from '@/context/ThemeContext';
import { Mail } from 'lucide-react';

function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const ctaEl = document.getElementById('contact');
      if (!ctaEl) return;
      const rect = ctaEl.getBoundingClientRect();
      const pastCTA = rect.bottom < 0;
      const scrolledEnough = window.scrollY > 800 && rect.top > window.innerHeight;
      setVisible((pastCTA || scrolledEnough) && !dismissed);
    };
    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    return () => window.removeEventListener('scroll', checkVisibility);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className={`mobile-sticky-cta${visible ? '' : ' hidden'}`} role="complementary" aria-label="Contact banner">
      <button className="mobile-sticky-cta-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
      <div className="mobile-sticky-cta-label">
        <span className="mobile-sticky-cta-dot" />
        Available now
      </div>
      <a href="#contact" className="mobile-sticky-cta-btn">
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
        Let's Talk
      </a>
    </div>
  );
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    document.title = siteConfig.title;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', siteConfig.description);
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <motion.div
        className="relative min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.42 }}
      >
        <PageReveal />
        {!prefersReducedMotion && <CustomCursor />}
        {!isMobile && <AetherFlowHero theme={theme} />}

        <Navigation onThemeToggle={toggle} theme={theme} />

        <main className="relative z-10">
          <Hero />
          <div className="section-divider" />
          <Portfolio />
          <div className="section-divider" />
          <Services />
          <div className="section-divider" />
          <Experience />
          <div className="section-divider" />
          <TechStack />
          <div className="section-divider" />
          <About />
          <div className="section-divider" />
          <Credentials />
          <div className="section-divider" />
          <CTA />
          {isMobile && <MobileStickyCTA />}
        </main>

        <Footer />
      </motion.div>
    </ThemeContext.Provider>
  );
}

export default App;
