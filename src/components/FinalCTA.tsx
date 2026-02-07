import { motion } from 'framer-motion'

interface FinalCTAProps {
    headline: string
    subheadline: string
    cta: {
        primary: string
        secondary: string
        ariaLabel: string
    }
}

export const FinalCTA = ({ headline, subheadline, cta }: FinalCTAProps) => {
    return (
        <div className="text-center max-w-4xl mx-auto">
            {/* Headline */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-4xl lg:text-5xl font-black text-primary-black leading-tight tracking-tighter mb-6"
            >
                {headline}
            </motion.h2>

            {/* Subheadline */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-text-body leading-relaxed mb-8"
            >
                {subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center items-center gap-4"
            >
                <motion.a
                    href="/signup"
                    className="bg-primary-blue text-white px-10 py-4 rounded-full font-semibold text-base uppercase tracking-wider shadow-button hover:shadow-button-hover transition-all duration-200"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={cta.ariaLabel}
                >
                    {cta.primary}
                </motion.a>

                <a
                    href="mailto:contact@servicedue.com"
                    className="text-primary-blue font-bold text-base inline-flex items-center gap-1 hover:gap-2 transition-all px-6 py-4"
                    aria-label="Schedule a demo"
                >
                    {cta.secondary} <span className="text-xl" aria-hidden="true">→</span>
                </a>
            </motion.div>
        </div>
    )
}
