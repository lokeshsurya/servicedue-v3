import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface SegmentTabsProps {
    activeTab: 'warranty' | 'routine' | 'winback';
    onTabChange: (tab: 'warranty' | 'routine' | 'winback') => void;
    counts: {
        warranty: number;
        routine: number;
        winback: number;
    };
}

export default function SegmentTabs({ activeTab, onTabChange, counts }: SegmentTabsProps) {
    const tabs = [
        {
            id: 'warranty',
            label: 'Warranty Guard',
            icon: AlertTriangle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            activeBorder: 'border-orange-500',
            count: counts.warranty
        },
        {
            id: 'routine',
            label: 'Routine Service',
            icon: Clock,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            activeBorder: 'border-blue-500',
            count: counts.routine
        },
        {
            id: 'winback',
            label: 'Win-Back',
            icon: TrendingUp,
            color: 'text-red-600',
            bg: 'bg-red-50',
            activeBorder: 'border-red-500',
            count: counts.winback
        },
    ] as const;

    return (
        <div className="flex space-x-2 p-1 bg-gray-100/50 rounded-xl mb-6">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as any)}
                        className={`
                            flex-1 flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200
                            ${isActive
                                ? `bg-white text-gray-900 shadow-sm border-b-2 ${tab.activeBorder}`
                                : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
                            }
                        `}
                    >
                        <div className={`mr-2 p-1 rounded-md ${isActive ? tab.bg : 'bg-gray-200'}`}>
                            <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-gray-500'}`} />
                        </div>
                        {tab.label}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
