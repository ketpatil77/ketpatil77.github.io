import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Boxes, Sparkles, Terminal } from 'lucide-react';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { techStackConfig } from '@/config';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useThemeContext } from '@/context/ThemeContext';
import { DragScroll } from '@/components/ui/drag-scroll';
import { TiltCard } from '@/components/ui/tilt-card';

const brandColorMapDark: Record<string, string> = {
  NVIDIA: '#84cc16',
  Supabase: '#34d399',
  OpenAI: '#7dd3fc',
  Turso: '#60a5fa',
  Vercel: '#d4d4d8',
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
  const fallbacksDark = ['#ff7043', '#ffb300', '#c9a961', '#ffd54f', '#ff6e40', '#e8a838'];
  const fallbacksLight = ['#e65100', '#bf360c', '#a07000', '#8d5200', '#c84b00', '#7a4200'];
  const fallback = (isLight ? fallbacksLight : fallbacksDark)[index % 6];
  return map[name] ?? fallback;
}

function LogoChip({
  logo,
  idx,
  isLight,
  shouldReduceMotion,
}: {
  logo: { name: string; src: string };
  idx: number;
  isLight: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const accent = brandColor(logo.name, idx, isLight);

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { delay: idx * 0.03, duration: 0.28, ease: motionTokens.ease.standard }}
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
      className="group flex min-h-[3rem] min-w-[8.5rem] basis-[9.5rem] flex-none items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center shadow-sm transition-colors"
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'linear-gradient(165deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))',
      }}
    >
      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: accent }} aria-hidden="true" />
      <span
        className="type-heading text-[0.82rem] font-semibold tracking-tight"
        style={{ color: accent }}
      >
        {logo.name}
      </span>
    </motion.div>
  );
}

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const theme = useThemeContext();
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState(techStackConfig.groups[0]?.id);

  const activeGroup = useMemo(
    () => techStackConfig.groups.find((group) => group.id === activeTab) ?? techStackConfig.groups[0],
    [activeTab],
  );

  if (techStackConfig.groups.length === 0 || !activeGroup) return null;

  const explorerItems = activeGroup.items.slice(0, 5);

  return (
    <section id="tech-stack" className="section-shell relative overflow-hidden">
      <div
        className="ambient-blob pointer-events-none absolute top-1/3 right-1/4 h-[500px] w-[500px] rounded-full opacity-[0.04] mix-blend-screen"
        style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="container-large relative z-10">
        <div className="section-header items-start text-left">
          <motion.span
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="section-eyebrow"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {techStackConfig.label}
          </motion.span>
          <AnimatedText
            el="h2"
            text={techStackConfig.heading}
            type="words"
            className="section-title max-w-3xl text-balance"
          />
          <p className="section-copy type-body max-w-3xl">{techStackConfig.description}</p>
        </div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: motionTokens.ease.standard }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {techStackConfig.logos.map((logo, idx) => (
            <LogoChip
              key={logo.name}
              logo={logo}
              idx={idx}
              isLight={isLight}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
          className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--border-dim)]"
          style={{
            background:
              'radial-gradient(circle at top, rgba(255,112,67,0.12), transparent 42%), linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
          }}
        >
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
            <div>
              <p className="type-heading text-xs uppercase tracking-[0.2em] text-[var(--cyan-full)]">
                Technology Explorer
              </p>
              <p className="mt-1 text-[0.72rem] text-[var(--text-400)]">
                Local depth scene tied to the active stack category.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-1 text-[0.68rem] font-medium text-[var(--text-300)] sm:inline-flex">
              <Boxes className="h-3.5 w-3.5 text-[var(--cyan-dim)]" aria-hidden="true" />
              {activeGroup.label}
            </div>
          </div>

          <div
            className="relative min-h-[22rem] overflow-hidden sm:min-h-[24rem] lg:min-h-[26rem]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '34px 34px',
            }}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-full"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,112,67,0.12), transparent 46%), radial-gradient(circle at center, rgba(201,169,97,0.08), transparent 58%)',
              }}
              aria-hidden="true"
            />

            <motion.div
              key={activeGroup.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, ease: motionTokens.ease.standard }}
              className="mx-auto w-full max-w-[18rem] rounded-[1.6rem] border border-[var(--border-dim)] px-4 py-4 text-center shadow-[0_24px_60px_-34px_rgba(0,0,0,0.8)]"
              style={{
                background: 'linear-gradient(165deg, rgba(10,10,10,0.7), rgba(24,24,24,0.45))',
                backdropFilter: 'blur(10px)',
              }}
            >
              <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-[var(--text-400)]">
                Active layer
              </p>
              <p className="mt-2 type-heading text-base font-semibold text-[var(--text-100)]">
                {activeGroup.label}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-300)]">
                {explorerItems.length} core technologies with production-facing impact.
              </p>
            </motion.div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {explorerItems.map((item, index) => {
                const accent = brandColor(item.name, index, isLight);
                return (
                  <motion.div
                    key={`${activeGroup.id}-${item.name}`}
                    initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-24px' }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: index * 0.04, duration: 0.26, ease: motionTokens.ease.standard }}
                    whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.01 }}
                    className="min-w-0 rounded-2xl border px-3 py-3 text-left shadow-[0_18px_40px_-26px_rgba(0,0,0,0.55)]"
                    style={{
                      borderColor: 'var(--border-dim)',
                      background: 'linear-gradient(165deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025))',
                    }}
                  >
                    <p className="text-[0.54rem] font-bold uppercase tracking-[0.18em]" style={{ color: accent }}>
                      Stack node
                    </p>
                    <p className="mt-2 type-heading text-sm font-semibold leading-tight text-[var(--text-100)]">
                      {item.name}
                    </p>
                    <p className="mt-2 text-[0.68rem] leading-relaxed text-[var(--text-300)] line-clamp-3">
                      {item.impact}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={shouldReduceMotion ? { duration: 0 } : motionTokens.spring.soft}
          className="mt-8"
        >
          <Tabs defaultValue={techStackConfig.groups[0].id} onValueChange={setActiveTab} className="w-full">
            <div className="relative mb-6">
              {isMobile ? (
                <DragScroll showFade snap={false} className="w-full">
                  <div className="flex gap-2 px-1 py-1.5">
                    {techStackConfig.groups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => setActiveTab(group.id)}
                        className={[
                          'shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold tracking-wide transition-all min-h-[40px]',
                          activeTab === group.id
                            ? 'border-[var(--border-dim)] bg-[var(--bg-elevated)] text-[var(--text-100)] shadow-md'
                            : 'border-transparent text-[var(--text-300)]',
                        ].join(' ')}
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>
                </DragScroll>
              ) : (
                <TabsList
                  className="scrollbar-none h-auto w-full justify-start overflow-x-auto rounded-xl border border-[var(--border-dim)] bg-[var(--bg-surface)] p-1.5 shadow-lg transition-colors"
                  style={{
                    maskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)',
                  }}
                >
                  {techStackConfig.groups.map((group) => (
                    <TabsTrigger
                      className="type-heading min-h-[40px] rounded-lg border border-transparent px-4 py-2 text-sm font-semibold tracking-wide text-[var(--text-300)] transition-all data-[state=active]:border-[var(--border-dim)] data-[state=active]:bg-[var(--bg-elevated)] data-[state=active]:text-[var(--text-100)] data-[state=active]:shadow-md hover:text-[var(--text-100)]"
                      value={group.id}
                      key={group.id}
                    >
                      {group.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              )}
            </div>

            {techStackConfig.groups.map((group) => (
              <TabsContent value={group.id} key={group.id} className="mt-0 rounded-2xl focus-visible:outline-none" tabIndex={-1}>
                {activeTab === group.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.24, ease: motionTokens.ease.standard }}
                    className={`grid items-stretch gap-3 grid-cols-1 sm:grid-cols-2 ${
                      group.items.length >= 5 ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
                    }`}
                  >
                    {group.items.map((item) => (
                      <TiltCard
                        key={item.name}
                        maxTilt={5}
                        scale={1.02}
                        disabled={Boolean(shouldReduceMotion) || isMobile}
                        className="h-full"
                      >
                        <div
                          className="group relative flex h-full min-h-[11.25rem] flex-col gap-3 rounded-2xl border p-4 transition-all duration-300 hover:border-[var(--border-bright)]"
                          tabIndex={0}
                          aria-label={`${item.name}. ${item.description}. Impact: ${item.impact}`}
                          style={{
                            borderColor: 'var(--border-subtle)',
                            background: 'linear-gradient(165deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
                          }}
                        >
                          <div
                            className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at center, var(--cyan-trace), transparent 90%)' }}
                          />

                          <div className="relative z-10 flex items-center justify-between gap-2">
                            <h3 className="type-heading text-sm font-bold tracking-tight text-[var(--text-100)] sm:text-base">
                              {item.name}
                            </h3>
                            <Terminal className="h-3.5 w-3.5 shrink-0 text-[var(--text-400)] transition-colors duration-300 group-hover:text-[var(--cyan-full)]" />
                          </div>

                          <p className="relative z-10 type-body text-sm leading-relaxed text-[var(--text-300)]">
                            {item.description}
                          </p>

                          <div className="relative z-10 mt-auto border-t border-[var(--border-subtle)] pt-3">
                            <p className="type-body text-sm italic leading-relaxed text-[var(--cyan-dim)] transition-colors duration-300 group-hover:text-[var(--cyan-full)]">
                              {item.impact}
                            </p>
                          </div>
                        </div>
                      </TiltCard>
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
