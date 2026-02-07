import { motion } from 'framer-motion'
import { Shield, Wrench, RefreshCcw } from 'lucide-react'

interface Tab {
    id: string
    label: string
    description: string
    metric: string
    icon: string
    color: string
}

interface SegmentTabContentProps {
    tab: Tab
}

const iconMap = {
    Shield,
    Wrench,
    RefreshCcw
}

export const SegmentTabContent = ({ tab }: SegmentTabContentProps) => {
    const IconComponent = iconMap[tab.icon as keyof typeof iconMap]

    return (
        <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className="max-w-3xl mx-auto"
        >
            <div className={`${tab.color} rounded-3xl p-12 text-center`}>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md">
                        <IconComponent className="w-10 h-10 text-primary-black" aria-hidden="true" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-lg text-primary-black leading-relaxed mb-6 max-w-2xl mx-auto">
                    {tab.description}
                </p>

                {/* Metric Badge */}
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
                    <span className="text-sm font-semibold text-text-muted">Average Value:</span>
                    <span className="text-xl font-black text-primary-blue">{tab.metric}</span>
                </div>
            </div>
        </motion.div>
    )
}
