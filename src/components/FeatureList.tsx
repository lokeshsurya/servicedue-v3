import { TrendingUp, Users, Zap } from 'lucide-react'

interface Feature {
    icon: string
    text: string
}

interface FeatureListProps {
    features: Feature[]
}

const iconMap = {
    TrendingUp,
    Users,
    Zap
}

export const FeatureList = ({ features }: FeatureListProps) => {
    return (
        <div className="pl-2 space-y-5">
            {features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap]

                return (
                    <div key={index} className="flex items-center gap-4">
                        <div className="w-6 flex justify-center">
                            <IconComponent className="w-5 h-5 text-primary-black" aria-hidden="true" />
                        </div>
                        <h4 className="text-base font-semibold text-primary-black">{feature.text}</h4>
                    </div>
                )
            })}
        </div>
    )
}
