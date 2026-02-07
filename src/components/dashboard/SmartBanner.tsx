import { Lightbulb } from 'lucide-react';

interface DashboardMetrics {
    risk_revenue: number;
    recovered_revenue: number;
    urgent_count: number;
    urgent_revenue: number;
    pipeline_count: number;
    pipeline_revenue: number;
    autopilot_active: boolean;
}

interface SmartBannerProps {
    metrics: DashboardMetrics;
}

export default function SmartBanner({ metrics }: SmartBannerProps) {
    // Determine highest priority recommendation
    const getRecommendation = () => {
        // Priority 1: URGENT (warranty expiring soon)
        if (metrics.urgent_count > 0) {
            return {
                segment: 'URGENT',
                count: metrics.urgent_count,
                revenue: metrics.urgent_revenue,
                message: `Contact ${metrics.urgent_count} Warranty customers today to secure ₹${metrics.urgent_revenue.toLocaleString('en-IN')}`,
                color: 'from-[#60A5FA] to-[#3B82F6]', // Muted blue gradient
            };
        }

        // Priority 2: PIPELINE (routine service due soon)
        if (metrics.pipeline_count > 0) {
            return {
                segment: 'PIPELINE',
                count: metrics.pipeline_count,
                revenue: metrics.pipeline_revenue,
                message: `Reach out to ${metrics.pipeline_count} customers for upcoming services (₹${metrics.pipeline_revenue.toLocaleString('en-IN')} potential)`,
                color: 'from-[#60A5FA] to-[#3B82F6]',
            };
        }

        // Priority 3: RISK (lost customers to win back)
        if (metrics.risk_revenue > 0) {
            return {
                segment: 'RISK',
                count: 0,
                revenue: metrics.risk_revenue,
                message: `Start win-back campaigns to recover ₹${metrics.risk_revenue.toLocaleString('en-IN')} at risk`,
                color: 'from-[#FB923C] to-[#F97316]', // Muted orange
            };
        }

        // Default: All clear
        return {
            segment: 'ALL_CLEAR',
            count: 0,
            revenue: 0,
            message: 'All customers are up to date! Great work.',
            color: 'from-[#34D399] to-[#10B981]', // Muted green
        };
    };

    const recommendation = getRecommendation();

    return (
        <div
            className={`
                bg-gradient-to-r ${recommendation.color}
                rounded-lg shadow-sm p-6 mb-6
                border border-white/20
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                    <div className="mt-1">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-1">
                            Smart Recommendation
                        </h3>
                        <p className="text-white text-lg font-medium">
                            {recommendation.message}
                        </p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors border border-white/30">
                    View Details
                </button>
            </div>
        </div>
    );
}
