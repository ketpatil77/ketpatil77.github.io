import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Award, Sparkles } from 'lucide-react';
import { credentialsConfig } from '@/config';
import { AnimatedText } from '@/components/AnimatedText';
import { motionTokens } from '@/lib/motion';

export function Credentials() {
    const shouldReduceMotion = useReducedMotion();
    const [selectedCertificateName, setSelectedCertificateName] = useState(
        credentialsConfig.certifications[0]?.name ?? '',
    );
    const selectedCertificate = useMemo(
        () => credentialsConfig.certifications.find((cert) => cert.name === selectedCertificateName) ?? null,
        [selectedCertificateName],
    );

    return (
        <section id="credentials" className="section-shell relative overflow-hidden">
            <div
                className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04] lg:h-[560px] lg:w-[560px]"
                style={{ background: 'radial-gradient(circle, var(--violet), transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="container-large relative z-10">
                <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
                    {/* Header Area */}
                    <div className="lg:col-span-2">
                        <div>
                            <span className="section-eyebrow">
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                                {credentialsConfig.label}
                            </span>
                            <AnimatedText
                                el="h2"
                                text="Academic Foundation and Industry Credentials."
                                type="words"
                                className="section-title text-balance mt-2"
                            />
                            <p className="section-copy type-body lg:pr-8">
                                Computer engineering education supported by certifications in networking, cybersecurity, machine learning, and data systems.
                            </p>

                            {/* Education Block */}
                            <div className="mt-8 space-y-6">
                                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-300)' }}>
                                    <GraduationCap className="h-4 w-4" style={{ color: 'var(--cyan-dim)' }} />
                                    Education
                                </h3>
                                <div className="space-y-5">
                                    {credentialsConfig.education.map((edu, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group relative h-full pl-4"
                                        >
                                            <div className="absolute left-0 top-1 h-full w-px transition-colors" style={{ background: 'var(--border-subtle)' }} />
                                            <p className="text-xs font-bold" style={{ color: 'var(--cyan-full)' }}>{edu.duration}</p>
                                            <h4 className="mt-1 font-bold leading-snug" style={{ color: 'var(--text-100)' }}>{edu.degree}</h4>
                                            <p className="text-sm" style={{ color: 'var(--text-200)' }}>{edu.institution}</p>
                                            <p className="mt-1 text-[0.65rem] uppercase tracking-wider" style={{ color: 'var(--text-300)' }}>{edu.location}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Grid */}
                    <div className="lg:col-span-3">
                        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-300)' }}>
                            <Award className="h-4 w-4" style={{ color: 'var(--cyan-dim)' }} />
                            Professional Certifications
                        </h3>
                        <p className="mb-4 text-xs" style={{ color: 'var(--text-400)' }}>
                            Click any certificate name to view details.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {credentialsConfig.certifications.map((cert, idx) => (
                                <motion.div
                                    key={cert.name}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={
                                        shouldReduceMotion
                                            ? { duration: 0 }
                                            : { duration: motionTokens.duration.base, ease: motionTokens.ease.standard, delay: idx * 0.05 }
                                    }
                                    className="surface-card group flex items-start justify-between p-4 transition-all duration-300"
                                    style={{
                                        borderColor: selectedCertificateName === cert.name ? 'var(--border-accent)' : 'var(--border-subtle)',
                                        background: selectedCertificateName === cert.name ? 'var(--cyan-trace)' : undefined,
                                    }}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[0.6rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-300)' }}>{cert.year}</span>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedCertificateName(cert.name)}
                                                className="focus-ring inline-flex min-h-11 items-center rounded-sm px-1 text-left text-sm font-bold transition-colors hover:text-[var(--cyan-full)]"
                                                style={{ color: selectedCertificateName === cert.name ? 'var(--cyan-full)' : 'var(--text-100)' }}
                                                aria-pressed={selectedCertificateName === cert.name}
                                            >
                                                {cert.name}
                                            </button>
                                        </div>
                                        <p className="mt-1 text-xs" style={{ color: 'var(--text-300)' }}>{cert.issuer}</p>
                                    </div>
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                                        style={{ background: 'var(--cyan-glow)', color: 'var(--cyan-full)' }}
                                    >
                                        <Award className="h-4 w-4" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {selectedCertificate && (
                            <motion.article
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={shouldReduceMotion ? { duration: 0 } : { duration: motionTokens.duration.base, ease: motionTokens.ease.standard }}
                                className="surface-card mt-4 p-4 sm:p-5"
                                style={{ borderColor: 'var(--border-accent)' }}
                                aria-live="polite"
                            >
                                <p className="text-[0.62rem] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--cyan-full)' }}>
                                    Certificate Details
                                </p>
                                <h4 className="mt-2 text-base font-bold sm:text-lg" style={{ color: 'var(--text-100)' }}>
                                    {selectedCertificate.name}
                                </h4>
                                <p className="mt-1 text-xs" style={{ color: 'var(--text-300)' }}>
                                    {selectedCertificate.issuer} · {selectedCertificate.year}
                                </p>

                                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-200)' }}>
                                    {selectedCertificate.summary}
                                </p>

                                <div className="mt-4">
                                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--text-300)' }}>
                                        Focus Areas
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedCertificate.focusAreas.map((area) => (
                                            <span
                                                key={`${selectedCertificate.name}-${area}`}
                                                className="rounded-full border px-2.5 py-1 text-[0.67rem] font-medium"
                                                style={{
                                                    borderColor: 'var(--border-subtle)',
                                                    color: 'var(--text-200)',
                                                    background: 'var(--bg-elevated)',
                                                }}
                                            >
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {(selectedCertificate.credentialId || selectedCertificate.verifyHref) && (
                                    <div className="mt-4 space-y-2 text-xs" style={{ color: 'var(--text-300)' }}>
                                        {selectedCertificate.credentialId && (
                                            <p>
                                                Credential ID: <span style={{ color: 'var(--text-200)' }}>{selectedCertificate.credentialId}</span>
                                            </p>
                                        )}
                                        {selectedCertificate.verifyHref && (
                                            <a href={selectedCertificate.verifyHref} className="btn-outline focus-ring inline-flex w-fit items-center gap-2">
                                                Verify Credential
                                            </a>
                                        )}
                                    </div>
                                )}
                            </motion.article>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
