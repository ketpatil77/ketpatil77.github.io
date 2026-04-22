import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CustomCursor } from '@/components/CustomCursor';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Services } from '@/sections/Services';
import { TechStack } from '@/sections/TechStack';
import { Portfolio } from '@/sections/Portfolio';
import { Experience } from '@/sections/Experience';
import { Publications } from '@/sections/Publications';
import { Credentials } from '@/sections/Credentials';
import { Footer } from '@/sections/Footer';
import { siteConfig } from '@/config';
import { PageReveal } from '@/components/PageReveal';
import AetherFlowHero from '@/components/ui/aether-flow-hero';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeContext } from '@/context/ThemeContext';
import { DeviceCapabilitiesProvider } from '@/context/DeviceCapabilitiesContext';

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
    <DeviceCapabilitiesProvider>
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
            <Publications />
            <div className="section-divider" />
            <TechStack />
            <div className="section-divider" />
            <About />
            <div className="section-divider" />
            <Credentials />
          </main>

          <Footer />
        </motion.div>
      </ThemeContext.Provider>
    </DeviceCapabilitiesProvider>
  );
}

export default App;
