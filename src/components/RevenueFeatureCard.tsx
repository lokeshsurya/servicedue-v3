import { motion } from 'framer-motion'
import { BarChart3, Zap, Upload, Shield } from 'lucide-react'

interface RevenueFeatureCardProps {
    badge: string
    headline: string
    description: string
    bgColor: string
    icon: string
}

const iconMap = {
    BarChart3,
    Zap,
    Upload,
    Shield
}

export const RevenueFeatureCard = ({ badge, headline, description, bgColor, icon }: RevenueFeatureCardProps) => {
    const IconComponent = iconMap[icon as keyof typeof iconMap]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className={`${bgColor} rounded-3xl p-8 transition-shadow hover:shadow-lg`}
        >
            {/* Badge */}
            <div className="mb-4">
                <span className="inline-block bg-white text-primary-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    {badge}
                </span>
            </div>

            {/* Icon */}
            <div className="mb-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <IconComponent className="w-7 h-7 text-primary-black" aria-hidden="true" />
                </div>
            </div>

            {/* Headline */}
            <h3 className="text-2xl font-black text-primary-black leading-tight mb-3">
                {headline}
            </h3>

            {/* Description */}
            <p className="text-base text-text-body leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}
