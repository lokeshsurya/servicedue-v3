import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    color: 'orange' | 'green' | 'red' | 'blue' | 'purple';
    badge?: string;
}

export default function MetricCard({ title, value, subtitle, icon: Icon, color, badge }: MetricCardProps) {
    // Enterprise SaaS color palette - muted, professional
    const colorStyles = {
        orange: {
            border: 'border-l-[#FB923C]',
            icon: 'text-[#FB923C]',
            iconBg: 'bg-orange-50',
        },
        green: {
            border: 'border-l-[#34D399]',
            icon: 'text-[#34D399]',
            iconBg: 'bg-emerald-50',
        },
        red: {
            border: 'border-l-[#F87171]',
            icon: 'text-[#F87171]',
            iconBg: 'bg-red-50',
        },
        blue: {
            border: 'border-l-[#60A5FA]',
            icon: 'text-[#60A5FA]',
            iconBg: 'bg-blue-50',
        },
        purple: {
            border: 'border-l-[#A78BFA]',
            icon: 'text-[#A78BFA]',
            iconBg: 'bg-purple-50',
        },
    };

    const styles = colorStyles[color];

    // Format Indian currency
    const formatValue = (val: string | number) => {
        if (typeof val === 'number') {
            return `₹${val.toLocaleString('en-IN')}`;
        }
        return val;
    };

    return (
        <div
            className={`
                bg-white rounded-lg border-l-4 ${styles.border}
                shadow-sm hover:shadow-md transition-shadow duration-200
                p-6 relative
            `}
        >
            {/* Icon - Top Right with Background Circle */}
            <div className={`absolute top-4 right-4 ${styles.iconBg} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${styles.icon}`} />
            </div>

            {/* Title - Uppercase with Letter Spacing */}
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {title}
            </div>

            {/* Value - Larger and Bolder */}
            <div className="text-4xl font-bold text-gray-900 mb-1">
                {formatValue(value)}
            </div>

            {/* Subtitle - Lighter Color */}
            {subtitle && (
                <div className="text-sm text-gray-400">
                    {subtitle}
                </div>
            )}

            {/* Badge */}
            {badge && (
                <div className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${styles.iconBg} ${styles.icon}`}>
                    {badge}
                </div>
            )}
        </div>
    );
}
