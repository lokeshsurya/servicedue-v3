import { useState } from 'react';
import { Zap, ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface SegmentBreakdown {
    segment: string;
    count: number;
    value: number;
    color: 'amber' | 'indigo' | 'rose';
    icon: React.ElementType;
    label: string;
}

interface QuickStat {
    label: string;
    value: string;
    subtext: string;
    valueColor?: string;
}

interface MasterActionCardProps {
    totalCustomers: number;
    totalRevenue: number;
    breakdown: SegmentBreakdown[];
    onLaunchAll: () => Promise<void> | void;
    loading?: boolean;
    stats: QuickStat[];
    autopilotEnabled?: boolean;
}

export default function MasterActionCard({
    totalCustomers,
    totalRevenue,
    breakdown,
    onLaunchAll,
    loading = false,
    stats,
    autopilotEnabled = true // Default to true for demo
}: MasterActionCardProps) {
    const [expanded, setExpanded] = useState(false);

    const colorClasses = {
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        rose: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-shadow hover:shadow-md">
            {/* Header - Clean Badge */}
            <div className="px-8 pt-8 pb-0 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                        <Brain className="w-3 h-3 text-indigo-500" />
                        <span>ServiceDue Brain</span>
                    </span>

                    {/* Autopilot Badge - High tech style */}
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${autopilotEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                        <Zap className={`w-3 h-3 ${autopilotEnabled ? 'fill-emerald-500' : ''}`} />
                        <span>{autopilotEnabled ? 'Autopilot: ON' : 'Autopilot: OFF'}</span>
                    </span>
                </div>

                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                    Ready to Launch
                </span>
            </div>

            {/* Main Content - Hero Style */}
            <div className="px-8 py-10 text-center">
                <p className="text-slate-500 text-sm font-medium mb-8 uppercase tracking-wide">
                    Today's Priority Selection
                </p>

                <div className="flex items-center justify-center space-x-8 mb-4">
                    <div className="text-right">
                        <p className="text-7xl font-bold text-slate-900 tracking-tighter leading-none">
                            {totalCustomers}
                        </p>
                        <p className="text-slate-500 font-medium text-lg mt-1">customers</p>
                    </div>

                    <div className="h-16 w-px bg-slate-200"></div>

                    <div className="text-left">
                        <p className="text-7xl font-bold text-emerald-600 tracking-tighter leading-none">
                            ₹{(totalRevenue / 1000).toFixed(1)}k
                        </p>
                        <p className="text-emerald-600/80 font-medium text-lg mt-1">potential</p>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mb-10 max-w-lg mx-auto leading-relaxed">
                    AI-selected based on warranty expiry, service history, and revenue recovery potential.
                </p>

                {/* Action Section */}
                <div className="max-w-md mx-auto space-y-4">
                    <button
                        onClick={onLaunchAll}
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-medium text-lg shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <span>Review & Launch Campaign</span>
                                <Zap className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center justify-center space-x-1 mx-auto transition-colors py-2"
                    >
                        <span>{expanded ? 'Hide Breakdown' : 'View Breakdown'}</span>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Integrated Stats Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-6">
                <div className="grid grid-cols-3 divide-x divide-slate-200">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center px-4 first:pl-0 last:pr-0">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">
                                {stat.label}
                            </p>
                            <p className={`text-xl font-bold ${stat.valueColor || 'text-slate-900'} tracking-tight`}>
                                {stat.value}
                            </p>
                            <p className="text-slate-400 text-xs mt-0.5 font-medium">
                                {stat.subtext}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Expandable Breakdown */}
            {expanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-3 max-w-3xl mx-auto">
                        <p className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide text-center">
                            Campaign Composition
                        </p>
                        {breakdown.map((segment, index) => {
                            const Icon = segment.icon;
                            return (
                                <div
                                    key={index}
                                    className={`${colorClasses[segment.color]} border bg-white rounded-xl p-4 transition-all hover:shadow-sm flex items-center justify-between group`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${segment.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                                                segment.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                                                    'bg-rose-100 text-rose-600'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{segment.label}</p>
                                            <p className="text-xs opacity-70 font-medium uppercase tracking-wide">{segment.segment}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-slate-900">{segment.count}</p>
                                        <p className="text-xs font-medium opacity-70">
                                            ₹{segment.value.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
