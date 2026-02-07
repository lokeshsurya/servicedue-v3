import { motion } from 'framer-motion'

interface Stat {
    value: string
    label: string
}

interface StatsRowProps {
    stats: Stat[]
}

export const StatsRow = ({ stats }: StatsRowProps) => {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                >
                    <div className="text-5xl lg:text-6xl font-black text-primary-blue mb-2">
                        {stat.value}
                    </div>
                    <div className="text-sm text-text-muted font-medium uppercase tracking-wide">
                        {stat.label}
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
