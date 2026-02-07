import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { ANIMATION_DURATION, ANIMATION_DELAY, ANIMATION_EASING } from '../constants/animations'

interface FeatureCardProps {
    title: string
    badge: string
    description: string
    link: {
        text: string
        href: string
    }
}

export const FeatureCard = ({ title, badge, description, link }: FeatureCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: ANIMATION_DURATION.NORMAL,
                delay: ANIMATION_DELAY.LONG
            }}
            className="bg-bg-light-gray rounded-[24px] p-8 shadow-sm"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-primary-black" aria-hidden="true" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-primary-black leading-tight">{title}</h3>
                    <span className="bg-primary-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {badge}
                    </span>
                </div>
            </div>
            <p className="text-sm text-text-body mb-6 leading-relaxed">
                {description}
            </p>
            <a
                href={link.href}
                className="text-primary-blue font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                aria-label={`${link.text} about ${title}`}
            >
                {link.text} <span className="text-lg" aria-hidden="true">→</span>
            </a>
        </motion.div>
    )
}
