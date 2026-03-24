import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { techStackConfig } from '@/config';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import GeometricBlurMesh from '@/components/ui/geometric-blur-mesh';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeContext } from '@/context/ThemeContext';
import anime from 'animejs';

const brandColorMapDark: Record<string, string> = {
  NVIDIA: '#84cc16',
  Supabase: '#34d399',
  OpenAI: '#7dd3fc',
  Turso: '#60a5fa',
  Vercel: '#c4c4c4',
  GitHub: '#93c5fd',
  Claude: '#fb923c',
  Clerk: '#a78bfa',
};

const brandColorMapLight: Record<string, string> = {
  NVIDIA: '#4d7c0f',
  Supabase: '#059669',
  OpenAI: '#0284c7',
  Turso: '#2563eb',
  Vercel: '#4b5563',
  GitHub: '#1d4ed8',
  Claude: '#ea580c',
  Clerk: '#7c3aed',
};

function brandColor(name: string, index: number, isLight: boolean) {
  const map = isLight ? brandColorMapLight : brandColorMapDark;
  const fallbacksDark = ['#67e8f9', '#22d3ee', '#38bdf8', '#a78bfa', '#34d399', '#f59e0b'];
  const fallbacksLight = ['#0891b2', '#0284c7', '#2563eb', '#7c3aed', '#059669', '#b45309'];
  const fallback = (isLight ? fallbacksLight : fallbacksDark)[index % 6];
  return map[name] ?? fallback;
}

function FloatingLogos({ logos, disabled, isLight }: { logos: { name: string; src: string }[], disabled: boolean, isLight: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll('.floating-logo');
    anime.remove(elements);
    if (disabled) return;

    anime({
      targets: elements,
      translateY: () => anime.random(-8, 8),
      translateX: () => anime.random(-4, 4),
      rotate: () => anime.random(-2, 2),
      duration: () => anime.random(2500, 4500),
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    return () => {
      anime.remove(elements);
    };
  }, [disabled]);

  return (
    <div ref={containerRef} className="flex flex-wrap justify-center gap-3 sm:gap-4 py-4 mb-2">
      {logos.map((logo, idx) => (
        <div
          key={logo.name}
          className="floating-logo surface-soft bg-opacity-30 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 border border-[var(--border-subtle)] hover:border-[var(--border-dim)] transition-colors shadow-sm"
        >
          <span
            className="type-heading text-[0.8rem] font-bold tracking-tight"
            style={{ color: brandColor(logo.name, idx, isLight) }}
          >
            {logo.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const lowPerformanceMode = Boolean(shouldReduceMotion) || isMobile;
  const theme = useThemeContext();
  const [activeTab, setActiveTab] = useState(techStackConfig.groups[0]?.id);

  if (techStackConfig.groups.length === 0) return null;

  return (
    <section id="tech-stack" className="section-shell relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div
        className="ambient-blob pointer-events-none absolute top-1/3 right-1/4 h-[500px] w-[500px] opacity-[0.04] rounded-full mix-blend-screen"
        style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header items-center text-center mb-6">
          <motion.span
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="section-eyebrow mx-auto"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {techStackConfig.label}
          </motion.span>
          <AnimatedText
            el="h2"
            text={techStackConfig.heading}
            type="words"
            className="section-title max-w-3xl text-balance mt-2"
          />
        </div>

        {/* Compressed Floating Logos */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={lowPerformanceMode ? { duration: 0 } : { delay: 0.1, duration: 0.3 }}
        >
          <FloatingLogos logos={techStackConfig.logos} disabled={lowPerformanceMode} isLight={theme === 'light'} />
        </motion.div>

        {!lowPerformanceMode && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={motionTokens.spring.soft}
            className="mb-6"
          >
            <div className="glass-card overflow-hidden rounded-2xl border border-[var(--border-dim)]">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-2">
                <p className="type-heading text-xs uppercase tracking-[0.2em] text-[var(--text-300)]">
                  Interactive Architecture Canvas
                </p>
                <p className="type-body text-[0.65rem] text-[var(--text-400)]">
                  Click to cycle visual states
                </p>
              </div>
              <GeometricBlurMesh
                className="h-[11rem] sm:h-[13rem] lg:h-[14rem]"
                showHud={false}
                enableKeyboard={false}
                initialShape={2}
              />
            </div>
          </motion.div>
        )}

        {/* Animated Tabs with Condensed Grid */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={lowPerformanceMode ? { duration: 0 } : motionTokens.spring.soft}
        >
          <Tabs defaultValue={techStackConfig.groups[0].id} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent h-px top-1/2 -z-10 hidden sm:block" />

              <TabsList className="bg-[var(--bg-surface)] backdrop-blur-md border border-[var(--border-dim)] p-1.5 h-auto rounded-xl flex-wrap justify-center shadow-lg transition-colors">
                {techStackConfig.groups.map(g => (
                  <TabsTrigger
                    className="rounded-lg px-4 py-2 text-xs sm:text-sm type-heading tracking-wide transition-all data-[state=active]:bg-[var(--bg-elevated)] data-[state=active]:text-[var(--text-100)] data-[state=active]:shadow-md data-[state=active]:border-[var(--border-dim)] border border-transparent hover:text-[var(--text-100)] text-[var(--text-300)]"
                    value={g.id}
                    key={g.id}
                  >
                    {g.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {techStackConfig.groups.map(group => (
              <TabsContent value={group.id} key={group.id} className="mt-0 focus-visible:outline-none rounded-2xl" tabIndex={-1}>
                {activeTab === group.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: motionTokens.ease.standard }}
                    className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                  >
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="group relative glass-card px-4 py-4 flex flex-col gap-2 hover:border-[var(--border-bright)] transition-all duration-300"
                        tabIndex={0}
                        aria-label={`${item.name}. ${item.description}. Impact: ${item.impact}`}
                      >
                        <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, var(--cyan-trace), transparent 90%)' }} />

                        <div className="relative z-10 flex items-center justify-between">
                          <h3 className="type-heading text-sm sm:text-base font-bold text-[var(--text-100)] tracking-tight">
                            {item.name}
                          </h3>
                          <Terminal className="w-3.5 h-3.5 text-[var(--text-400)] group-hover:text-[var(--cyan-full)] transition-colors duration-300" />
                        </div>

                        <p className="relative z-10 type-body text-[0.8rem] text-[var(--text-300)] leading-snug line-clamp-2 group-hover:line-clamp-none transition-all">
                          {item.description}
                        </p>

                        <div className="relative z-10 mt-1 border-t border-[var(--border-subtle)] pt-2">
                          <p className="type-body text-[0.72rem] italic text-[var(--cyan-dim)] group-hover:text-[var(--cyan-full)] transition-colors duration-300 line-clamp-2">
                            {item.impact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
