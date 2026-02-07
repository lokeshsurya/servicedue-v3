import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface AutopilotCardProps {
    badge: string
    headline: string
    description: string
    highlights: string[]
    cta: {
        primary: string
        secondary: string
        ariaLabel: string
    }
}

export const AutopilotCard = ({ badge, headline, description, highlights, cta }: AutopilotCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-bg-pink rounded-3xl p-8 md:p-12 lg:p-16"
        >
            <div className="max-w-4xl mx-auto">
                {/* Badge */}
                <div className="mb-6">
                    <span className="inline-block bg-badge-purple text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                        {badge}
                    </span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Content */}
                    <div>
                        {/* Headline */}
                        <h2 className="text-4xl lg:text-5xl font-black text-primary-black leading-tight tracking-tighter mb-6">
                            {headline}
                        </h2>

                        {/* Description */}
                        <p className="text-lg text-text-body leading-relaxed mb-8">
                            {description}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-3 mb-8">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 bg-primary-blue rounded-full flex items-center justify-center mt-0.5">
                                        <Check className="w-3 h-3 text-white" aria-hidden="true" />
                                    </div>
                                    <span className="text-base text-primary-black font-medium">{highlight}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap items-center gap-4">
                            <motion.a
                                href="/signup"
                                className="bg-primary-blue text-white px-8 py-3.5 rounded-full font-semibold text-sm uppercase tracking-wider shadow-button hover:shadow-button-hover transition-all duration-200"
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                aria-label={cta.ariaLabel}
                            >
                                {cta.primary}
                            </motion.a>

                            <a
                                href="#final-cta"
                                className="text-primary-blue font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                                aria-label="Learn more about autopilot mode"
                            >
                                {cta.secondary} <span className="text-lg" aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative">
                            {/* Large WhatsApp + Phone Icon Illustration */}
                            <div className="w-64 h-64 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">📱</div>
                                    <div className="text-5xl">📞</div>
                                    <div className="mt-4 text-sm font-semibold text-text-muted">
                                        WhatsApp + IVR
                                    </div>
                                </div>
                            </div>

                            {/* Decorative pulse animation */}
                            <motion.div
                                className="absolute inset-0 bg-primary-blue rounded-3xl -z-10"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
