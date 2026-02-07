import { motion } from 'framer-motion'

interface DealerBrand {
    name: string
    logo: string
}

interface Stat {
    value: string
    label: string
}

interface SocialProofProps {
    headline: string
    dealerBrands: DealerBrand[]
    stats: Stat[]
}

export const SocialProof = ({ headline, dealerBrands, stats }: SocialProofProps) => {
    return (
        <div className="text-center">
            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl font-black text-primary-black mb-12">
                {headline}
            </h2>

            {/* Dealer Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 mb-16">
                {dealerBrands.map((brand, index) => (
                    <motion.div
                        key={brand.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="text-5xl">{brand.logo}</div>
                        <span className="text-sm font-semibold text-text-muted">{brand.name}</span>
                    </motion.div>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className="text-4xl font-black text-primary-blue mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm text-text-muted font-medium">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
