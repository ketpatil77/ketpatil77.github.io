import { motion, useReducedMotion } from 'framer-motion';
import { Briefcase, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { experienceConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';

export function Experience() {
    const shouldReduceMotion = useReducedMotion();

    if (!experienceConfig.items || experienceConfig.items.length === 0) return null;

    return (
        <section id="experience" className="section-shell relative overflow-hidden">
            {/* Ambient background */}
            <div
                className="pointer-events-none absolute left-0 top-1/4 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-[0.03]"
                style={{ background: 'radial-gradient(circle, var(--cyan-full), transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="container-large relative z-10">
                <div className="section-header mb-8 sm:mb-12">
                    <span className="section-eyebrow">
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        {experienceConfig.label}
                    </span>
                    <AnimatedText
                        el="h2"
                        text={experienceConfig.heading}
                        type="words"
                        className="section-title max-w-3xl text-balance mt-3"
                    />
                    <p className="section-copy type-body max-w-2xl mt-4">{experienceConfig.description}</p>
                </div>

                <div className="relative mx-auto max-w-5xl">
                    {/* Continuous vertical line aligned to the left */}
                    <div
                        className="absolute left-[17px] top-2 h-[calc(100%-8px)] w-[1.5px]"
                        style={{ background: 'linear-gradient(to bottom, var(--border-subtle), var(--border-dim) 50%, transparent)' }}
                        aria-hidden="true"
                    />

                    <div className="space-y-6 sm:space-y-8">
                        {experienceConfig.items.map((item, idx) => (
                            <motion.div
                                key={`${item.company}-${idx}`}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={
                                    shouldReduceMotion
                                        ? { duration: 0 }
                                        : { duration: motionTokens.duration.base, ease: motionTokens.ease.standard, delay: idx * 0.1 }
                                }
                                className="relative flex items-start"
                            >
                                {/* Timeline fixed dot/icon */}
                                <div
                                    className="absolute left-0 top-1 z-20 flex h-[35px] w-[35px] items-center justify-center rounded-full border shadow-[0_0_10px_rgba(34,211,238,0.1)] transition-transform duration-300 hover:scale-110"
                                    style={{
                                        borderColor: 'var(--border-accent)',
                                        background: 'var(--bg-elevated)',
                                        color: 'var(--cyan-full)',
                                    }}
                                >
                                    <Briefcase className="h-4 w-4" />
                                </div>

                                {/* Experience Card: Optimized for space */}
                                <div className="ml-12 w-full">
                                    <div
                                        className="glass-card group relative p-4 transition-all duration-300 hover:border-[var(--border-bright)] sm:p-6"
                                        style={{ borderColor: 'var(--border-subtle)' }}
                                    >
                                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--cyan-full)' }}>
                                                        {item.duration}
                                                    </span>
                                                </div>
                                                <h3 className="type-heading text-lg font-bold text-[var(--text-100)] tracking-tight sm:text-xl">
                                                    {item.company}
                                                </h3>
                                                <p className="type-body font-semibold text-[var(--text-200)] sm:text-base">
                                                    {item.role}
                                                </p>
                                            </div>

                                            <div
                                                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-2.5 py-1 text-[0.7rem] font-medium transition-colors group-hover:border-[var(--border-dim)]"
                                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-300)' }}
                                            >
                                                <MapPin className="h-3 w-3 text-[var(--cyan-dim)]" />
                                                {item.location}
                                            </div>
                                        </div>

                                        <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                                            {item.highlights.map((highlight, hIdx) => (
                                                <li key={hIdx} className="flex gap-3 text-[0.85rem] leading-relaxed text-[var(--text-300)] sm:text-[0.92rem]">
                                                    <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--cyan-dim)]" />
                                                    <span className="group-hover:text-[var(--text-200)] transition-colors">{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 -z-10 rounded-[inherit] bg-gradient-to-br from-[var(--cyan-trace)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
