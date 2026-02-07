// Picking Animation Component - Visual segment-by-segment selection
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface PickingAnimationProps {
    isActive: boolean;
    targetCount: number;
    segmentBreakdown: Record<string, number>;
    onComplete: (pickedCustomers: PickedSegment[]) => void;
}

export interface PickedSegment {
    segment: string;
    count: number;
    revenue: number;
    color: string;
    icon: string;
    label: string;
}

const SEGMENT_CONFIG: Record<string, { color: string; icon: string; label: string; value: number }> = {
    'LOST': { color: 'bg-red-500', icon: '🔴', label: 'Lost Customers', value: 2500 },
    'PAID_RISK': { color: 'bg-orange-500', icon: '🟠', label: 'At Risk', value: 1800 },
    'PAID_DUE': { color: 'bg-blue-500', icon: '🔵', label: 'Paid Service Due', value: 1500 },
    '3RD_FREE': { color: 'bg-emerald-500', icon: '🟢', label: '3rd Free Service', value: 300 },
    '2ND_FREE': { color: 'bg-emerald-500', icon: '🟢', label: '2nd Free Service', value: 300 },
    '1ST_FREE': { color: 'bg-emerald-500', icon: '🟢', label: '1st Free Service', value: 300 },
};

const PRIORITY_ORDER = ['LOST', 'PAID_RISK', 'PAID_DUE', '3RD_FREE', '2ND_FREE', '1ST_FREE'];

export default function PickingAnimation({ isActive, targetCount, segmentBreakdown, onComplete }: PickingAnimationProps) {
    const [progress, setProgress] = useState(0);
    const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
    const [pickedPerSegment, setPickedPerSegment] = useState<Record<string, number>>({});
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setProgress(0);
            setCurrentSegmentIndex(0);
            setPickedPerSegment({});
            setIsComplete(false);
            return;
        }

        // Calculate what will be picked
        let remaining = targetCount;
        const picked: Record<string, number> = {};

        for (const segment of PRIORITY_ORDER) {
            if (remaining <= 0) break;
            const available = segmentBreakdown[segment] || 0;
            const toPick = Math.min(available, remaining);
            if (toPick > 0) {
                picked[segment] = toPick;
                remaining -= toPick;
            }
        }

        // Animate the picking process
        const totalDuration = 2000; // 2 seconds total
        const segmentsWithPicks = Object.keys(picked).length;
        const stepDuration = totalDuration / (segmentsWithPicks + 1);

        let step = 0;
        const interval = setInterval(() => {
            step++;
            const newProgress = Math.min((step / (segmentsWithPicks + 1)) * 100, 100);
            setProgress(newProgress);

            if (step <= segmentsWithPicks) {
                setCurrentSegmentIndex(step - 1);
                // Reveal picks one segment at a time
                const segmentKeys = Object.keys(picked);
                const revealedPicks: Record<string, number> = {};
                for (let i = 0; i < step; i++) {
                    revealedPicks[segmentKeys[i]] = picked[segmentKeys[i]];
                }
                setPickedPerSegment(revealedPicks);
            }

            if (step > segmentsWithPicks) {
                clearInterval(interval);
                setIsComplete(true);

                // Build result
                const result: PickedSegment[] = Object.entries(picked).map(([segment, count]) => ({
                    segment,
                    count,
                    revenue: count * SEGMENT_CONFIG[segment].value,
                    color: SEGMENT_CONFIG[segment].color,
                    icon: SEGMENT_CONFIG[segment].icon,
                    label: SEGMENT_CONFIG[segment].label,
                }));

                setTimeout(() => onComplete(result), 500);
            }
        }, stepDuration);

        return () => clearInterval(interval);
    }, [isActive, targetCount, segmentBreakdown, onComplete]);

    if (!isActive) return null;

    const totalPicked = Object.values(pickedPerSegment).reduce((a, b) => a + b, 0);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-8 text-center">
                {/* Header */}
                <div className="mb-6">
                    {isComplete ? (
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
                    )}
                    <h2 className="text-xl font-bold text-slate-800">
                        {isComplete ? 'Selection Complete!' : 'Picking Customers...'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {isComplete
                            ? `${totalPicked} customers selected for today`
                            : 'Analyzing by revenue priority...'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Segment Breakdown */}
                <div className="space-y-3 text-left">
                    {PRIORITY_ORDER.filter(seg => segmentBreakdown[seg] > 0).map((segment, index) => {
                        const config = SEGMENT_CONFIG[segment];
                        const picked = pickedPerSegment[segment] || 0;
                        const isRevealed = index <= currentSegmentIndex;

                        return (
                            <div
                                key={segment}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${isRevealed ? 'bg-slate-50' : 'bg-slate-50/50 opacity-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{config.icon}</span>
                                    <span className="font-medium text-slate-700">{config.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isRevealed && picked > 0 ? (
                                        <>
                                            <span className={`px-2 py-1 ${config.color} text-white text-sm font-bold rounded animate-pulse`}>
                                                {picked}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                ₹{(picked * config.value / 1000).toFixed(0)}K
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
