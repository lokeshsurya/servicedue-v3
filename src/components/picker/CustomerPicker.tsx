// Customer Picker Component - "Pick Today's Customers" flow
import { useState, useEffect } from 'react';
import { Target, Users, DollarSign, Zap, X, Sparkles } from 'lucide-react';

interface PickerProps {
    isOpen: boolean;
    onClose: () => void;
    onPick: (count: number) => void;
    recommendation: {
        total_eligible: number;
        recommended_batch_size: number;
        segment_breakdown: Record<string, number>;
        potential_revenue: number;
    } | null;
}

// Segment revenue values
const SEGMENT_VALUES: Record<string, number> = {
    'LOST': 2500,
    'PAID_RISK': 1800,
    'PAID_DUE': 1500,
    '3RD_FREE': 300,
    '2ND_FREE': 300,
    '1ST_FREE': 300,
};

const PRIORITY_ORDER = ['LOST', 'PAID_RISK', 'PAID_DUE', '3RD_FREE', '2ND_FREE', '1ST_FREE'];

export default function CustomerPicker({ isOpen, onClose, onPick, recommendation }: PickerProps) {
    const [customerCount, setCustomerCount] = useState(50);

    useEffect(() => {
        if (recommendation?.recommended_batch_size) {
            setCustomerCount(recommendation.recommended_batch_size);
        }
    }, [recommendation]);

    // Calculate estimated revenue based on priority selection
    const calculateRevenue = (count: number) => {
        if (!recommendation?.segment_breakdown) return count * 1500;

        let remaining = count;
        let totalRevenue = 0;

        for (const segment of PRIORITY_ORDER) {
            if (remaining <= 0) break;
            const available = recommendation.segment_breakdown[segment] || 0;
            const picked = Math.min(available, remaining);
            totalRevenue += picked * SEGMENT_VALUES[segment];
            remaining -= picked;
        }

        return totalRevenue;
    };

    const estimatedRevenue = calculateRevenue(customerCount);
    const estimatedCost = customerCount * 0.70;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg">Pick Today's Customers</h2>
                                <p className="text-white/80 text-sm">AI will select high-value targets</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Recommendation */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium text-sm">Smart Recommendation</span>
                        </div>
                        <p className="text-slate-700">
                            Contact <strong>{recommendation?.recommended_batch_size || 50} customers/day</strong> to reach all{' '}
                            {recommendation?.total_eligible || 0} customers in 25 days
                        </p>
                    </div>

                    {/* Slider */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-4">
                            How many customers to contact today?
                        </label>
                        <input
                            type="range"
                            min="10"
                            max={Math.max(10, recommendation?.total_eligible || 200)}
                            value={customerCount}
                            onChange={(e) => setCustomerCount(Number(e.target.value))}
                            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-slate-400">10</span>
                            <span className="text-2xl font-bold text-blue-600">{customerCount}</span>
                            <span className="text-xs text-slate-400">{recommendation?.total_eligible || 200}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <DollarSign className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                            <div className="text-lg font-bold text-emerald-600">
                                ₹{(estimatedRevenue / 1000).toFixed(0)}K
                            </div>
                            <div className="text-xs text-slate-500">Revenue</div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                            <div className="text-lg font-bold text-blue-600">{customerCount}</div>
                            <div className="text-xs text-slate-500">Customers</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <Zap className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                            <div className="text-lg font-bold text-purple-600">₹{estimatedCost.toFixed(0)}</div>
                            <div className="text-xs text-slate-500">Cost</div>
                        </div>
                    </div>

                    {/* Pick Button */}
                    <button
                        onClick={() => onPick(customerCount)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Target className="w-5 h-5" />
                        Pick {customerCount} Customers
                    </button>
                </div>
            </div>
        </div>
    );
}
