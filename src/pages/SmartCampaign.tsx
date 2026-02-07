// Smart Campaign Page - Intelligent Customer Selection
import { useState, useEffect, useMemo } from 'react';
import { Target, Users, DollarSign, Zap, ChevronRight } from 'lucide-react';

// Segment revenue values (matching backend)
const SEGMENT_VALUES: Record<string, number> = {
    'LOST': 2500,
    'PAID_RISK': 1800,
    'PAID_DUE': 1500,
    '3RD_FREE': 300,
    '2ND_FREE': 300,
    '1ST_FREE': 300,
};

// Priority order for money-first selection
const PRIORITY_ORDER = ['LOST', 'PAID_RISK', 'PAID_DUE', '3RD_FREE', '2ND_FREE', '1ST_FREE'];

interface SelectionRecommendation {
    recommended_batch_size: number;
    total_eligible: number;
    segment_breakdown: {
        LOST: number;
        PAID_RISK: number;
        PAID_DUE: number;
        '1ST_FREE': number;
        '2ND_FREE': number;
        '3RD_FREE': number;
    };
    potential_revenue: number;
}

export default function SmartCampaign() {
    const [customerCount, setCustomerCount] = useState(100);
    const [recommendation, setRecommendation] = useState<SelectionRecommendation | null>(null);
    const [loading, setLoading] = useState(true);
    const [launching, setLaunching] = useState(false);

    // Fetch recommendation on mount
    useEffect(() => {
        fetchRecommendation();
    }, []);

    const fetchRecommendation = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/selection/recommendation');
            const data = await response.json();
            setRecommendation(data);
            setCustomerCount(data.recommended_batch_size || 100);
        } catch (error) {
            console.error('Failed to fetch recommendation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLaunch = async () => {
        setLaunching(true);
        try {
            // Pick customers using POST with body
            const pickResponse = await fetch('http://localhost:8000/api/selection/pick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batch_size: customerCount })
            });
            const pickData = await pickResponse.json();

            if (pickData.customers && pickData.customers.length > 0) {
                // Launch campaign
                const launchResponse = await fetch('http://localhost:8000/api/campaigns/launch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead_ids: pickData.customers.map((l: any) => l.id),
                        segment: 'MIXED',
                        channel: 'whatsapp',
                        template_id: 'ROUTINE_SERVICE_DUE'
                    })
                });

                if (launchResponse.ok) {
                    alert(`✅ Campaign launched! ${pickData.customers.length} customers contacted.\nPotential Revenue: ₹${pickData.total_revenue_potential.toLocaleString('en-IN')}`);
                }
            }
        } catch (error) {
            console.error('Failed to launch:', error);
            alert('Failed to launch campaign');
        } finally {
            setLaunching(false);
        }
    };

    // Calculate revenue based on segment breakdown and customer count (money-first priority)
    const estimatedRevenue = useMemo(() => {
        if (!recommendation?.segment_breakdown) return customerCount * 1500; // Fallback

        let remaining = customerCount;
        let totalRevenue = 0;

        // Pick customers in priority order (matching backend logic)
        for (const segment of PRIORITY_ORDER) {
            if (remaining <= 0) break;

            const available = recommendation.segment_breakdown[segment as keyof typeof recommendation.segment_breakdown] || 0;
            const picked = Math.min(available, remaining);

            totalRevenue += picked * SEGMENT_VALUES[segment];
            remaining -= picked;
        }

        return totalRevenue;
    }, [customerCount, recommendation]);

    const estimatedCost = customerCount * 0.70; // ₹0.70 per WhatsApp

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl animate-fadeIn">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-slate-800 mb-2">Smart Campaign</h1>
                <p className="text-slate-500 text-sm">AI picks the best customers based on revenue potential</p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
                {/* Customer Count Slider */}
                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                        How many customers to contact today?
                    </label>
                    <div className="relative">
                        <input
                            type="range"
                            min="10"
                            max={recommendation?.total_eligible || 500}
                            value={customerCount}
                            onChange={(e) => setCustomerCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            <span>10</span>
                            <span className="text-lg font-semibold text-blue-600">{customerCount} customers</span>
                            <span>{recommendation?.total_eligible || 500}</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <DollarSign className="w-4 h-4" />
                            Revenue Potential
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                            ₹{(estimatedRevenue / 1000).toFixed(0)}K
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            Customers
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                            {customerCount}
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
                            <Zap className="w-4 h-4" />
                            Cost
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                            ₹{estimatedCost.toFixed(0)}
                        </div>
                    </div>
                </div>

                {/* Segment Breakdown */}
                <div className="mb-8">
                    <h3 className="text-sm font-medium text-slate-700 mb-3">Segment Breakdown (Priority Order)</h3>
                    <div className="flex gap-3">
                        <span className="badge badge-red">🔴 LOST: {recommendation?.segment_breakdown?.LOST || 0}</span>
                        <span className="badge badge-orange">🟠 PAID_RISK: {recommendation?.segment_breakdown?.PAID_RISK || 0}</span>
                        <span className="badge badge-blue">🔵 PAID_DUE: {recommendation?.segment_breakdown?.PAID_DUE || 0}</span>
                        <span className="badge badge-green">🟢 FREE: {(recommendation?.segment_breakdown?.['1ST_FREE'] || 0) + (recommendation?.segment_breakdown?.['2ND_FREE'] || 0) + (recommendation?.segment_breakdown?.['3RD_FREE'] || 0)}</span>
                    </div>
                </div>

                {/* Launch Button */}
                <button
                    onClick={handleLaunch}
                    disabled={launching}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {launching ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Launching...
                        </>
                    ) : (
                        <>
                            <Target className="w-5 h-5" />
                            Launch Smart Campaign
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-1">💡 How it works</h4>
                <p className="text-sm text-blue-600">
                    Smart Campaign prioritizes customers by money potential: LOST (₹2,500) → PAID_RISK (₹1,800) → PAID_DUE (₹1,500) → FREE (₹300).
                    It also respects the 30-day contact gap rule.
                </p>
            </div>
        </div>
    );
}
