// Home Page - Minecloud Style Dashboard with Pick Today's Customers Flow
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Target, MoreHorizontal, ChevronRight, Sparkles
} from 'lucide-react';
import CustomerPicker from '../components/picker/CustomerPicker';
import PickingAnimation from '../components/picker/PickingAnimation';
import type { PickedSegment } from '../components/picker/PickingAnimation';
import PickedResults from '../components/picker/PickedResults';

interface DashboardMetrics {
    total_customers: number;
    total_revenue: number;
    segment_breakdown: {
        warranty: number;
        routine: number;
        winback: number;
    };
    segment_values: {
        warranty: number;
        routine: number;
        winback: number;
    };
}

interface SelectionRecommendation {
    recommended_batch_size: number;
    total_eligible: number;
    days_to_cover_all: number;
    segment_breakdown: Record<string, number>;
    potential_revenue: number;
    message: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [recommendation, setRecommendation] = useState<SelectionRecommendation | null>(null);

    // Picker flow state
    const [showPicker, setShowPicker] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [targetCount, setTargetCount] = useState(50);
    const [pickedSegments, setPickedSegments] = useState<PickedSegment[]>([]);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            // Fetch metrics
            const metricsRes = await fetch('http://localhost:8000/api/dashboard/metrics');
            const metricsData = await metricsRes.json();
            setMetrics(metricsData);

            // Fetch recommendation
            const recRes = await fetch('http://localhost:8000/api/selection/recommendation');
            const recData = await recRes.json();
            setRecommendation(recData);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePick = (count: number) => {
        setTargetCount(count);
        setShowPicker(false);
        setShowAnimation(true);
    };

    const handleAnimationComplete = useCallback((segments: PickedSegment[]) => {
        setPickedSegments(segments);
        setShowAnimation(false);
        setShowResults(true);
    }, []);

    const handleLaunchAll = async (channel: 'whatsapp' | 'voice') => {
        try {
            // Pick customers using API
            const pickResponse = await fetch('http://localhost:8000/api/selection/pick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ batch_size: targetCount })
            });
            const pickData = await pickResponse.json();

            if (pickData.customers && pickData.customers.length > 0) {
                // Launch campaign
                const launchResponse = await fetch('http://localhost:8000/api/campaigns/launch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead_ids: pickData.customers.map((c: any) => c.id),
                        segment: 'MIXED',
                        channel: channel,
                        template_id: 'SMART_PICK'
                    })
                });

                if (launchResponse.ok) {
                    const totalRevenue = pickedSegments.reduce((sum, seg) => sum + seg.revenue, 0);
                    alert(`✅ Campaign launched via ${channel.toUpperCase()}!\n${pickData.customers.length} customers contacted\nPotential Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);
                    setShowResults(false);
                    fetchDashboard(); // Refresh
                }
            }
        } catch (error) {
            console.error('Failed to launch:', error);
            alert('Failed to launch campaign');
        }
    };

    const handleLaunchSegment = async (segment: string, channel: 'whatsapp' | 'voice') => {
        const segmentPick = pickedSegments.find(s => s.segment === segment);
        if (!segmentPick) return;

        try {
            // Fetch customers for this segment
            const response = await fetch(`http://localhost:8000/api/customers?segment=${segment}&limit=${segmentPick.count}`);
            const data = await response.json();

            if (data.customers && data.customers.length > 0) {
                const launchResponse = await fetch('http://localhost:8000/api/campaigns/launch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        lead_ids: data.customers.map((c: any) => c.id),
                        segment: segment,
                        channel: channel,
                        template_id: `${segment}_template`
                    })
                });

                if (launchResponse.ok) {
                    alert(`✅ ${segment} campaign launched via ${channel.toUpperCase()}!\n${data.customers.length} customers contacted\nPotential Revenue: ₹${segmentPick.revenue.toLocaleString('en-IN')}`);
                }
            }
        } catch (error) {
            console.error('Failed to launch segment:', error);
            alert('Failed to launch segment campaign');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Quick Access Cards - Segment Revenue
    const quickAccessCards = [
        {
            id: 'lost',
            icon: '🔴',
            title: 'Lost Customers',
            value: `₹${((metrics?.segment_values?.winback || 0) / 1000).toFixed(0)}K`,
            count: `${metrics?.segment_breakdown?.winback || 0} customers`,
            color: 'bg-red-50 border-red-100',
            iconBg: 'bg-red-100',
        },
        {
            id: 'at-risk',
            icon: '🟠',
            title: 'At Risk',
            value: `₹${((metrics?.segment_values?.routine || 0) / 1000).toFixed(0)}K`,
            count: `${metrics?.segment_breakdown?.routine || 0} customers`,
            color: 'bg-orange-50 border-orange-100',
            iconBg: 'bg-orange-100',
        },
        {
            id: 'warranty',
            icon: '🟢',
            title: 'Free Service Due',
            value: `₹${((metrics?.segment_values?.warranty || 0) / 1000).toFixed(0)}K`,
            count: `${metrics?.segment_breakdown?.warranty || 0} customers`,
            color: 'bg-emerald-50 border-emerald-100',
            iconBg: 'bg-emerald-100',
        },
        {
            id: 'total',
            icon: '💰',
            title: 'Total Recovery',
            value: `₹${((metrics?.total_revenue || 0) / 1000).toFixed(0)}K`,
            count: `${metrics?.total_customers || 0} customers`,
            color: 'bg-blue-50 border-blue-100',
            iconBg: 'bg-blue-100',
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Quick Access Section */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-medium text-slate-500">Quick Access</h2>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Quick Access Cards Grid */}
            <div className="grid grid-cols-4 gap-4">
                {quickAccessCards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => navigate('/customers')}
                        className={`${card.color} border rounded-xl p-4 cursor-pointer quick-card hover:shadow-md transition-all`}
                    >
                        <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center text-xl mb-3`}>
                            {card.icon}
                        </div>
                        <h3 className="text-sm font-medium text-slate-700">{card.title}</h3>
                        <p className="text-lg font-bold text-slate-900 mt-1">{card.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{card.count}</p>
                    </div>
                ))}
            </div>

            {/* Pick Today's Customers Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                            <Target className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Pick Today's Customers</h2>
                            <p className="text-white/80 text-sm mt-1">
                                <Sparkles className="w-4 h-4 inline mr-1" />
                                AI recommends contacting {recommendation?.recommended_batch_size || 50} customers today
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPicker(true)}
                        className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
                    >
                        <Target className="w-5 h-5" />
                        Pick Customers
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20">
                    <div>
                        <p className="text-white/60 text-xs">Total Eligible</p>
                        <p className="text-xl font-bold">{recommendation?.total_eligible || 0}</p>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs">Potential Revenue</p>
                        <p className="text-xl font-bold">₹{((recommendation?.potential_revenue || 0) / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                        <p className="text-white/60 text-xs">Days to Cover All</p>
                        <p className="text-xl font-bold">
                            {(recommendation?.total_eligible || 0) === 0
                                ? '✓ Done'
                                : `~${recommendation?.days_to_cover_all || Math.ceil((recommendation?.total_eligible || 1) / (recommendation?.recommended_batch_size || 25))} days`
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Activity Feed + Revenue Progress Section */}
            <div className="grid grid-cols-2 gap-6">
                {/* Left: Activity Feed */}
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <h2 className="text-sm font-medium text-slate-800">Live Activity</h2>
                        </div>
                        <span className="text-xs text-slate-400">Auto-refreshing</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {/* Activity Items - Will be populated from backend */}
                        {[
                            { icon: '📱', text: 'WhatsApp sent to 15 customers', time: '2 min ago', type: 'success' },
                            { icon: '📞', text: 'IVR calls completed: 8 connected', time: '15 min ago', type: 'success' },
                            { icon: '✅', text: 'Rajesh Kumar pressed 1 (interested)', time: '18 min ago', type: 'highlight' },
                            { icon: '📅', text: '3 customers booked service today', time: '1 hr ago', type: 'success' },
                            { icon: '🔄', text: '5 calls will retry tomorrow', time: '2 hr ago', type: 'pending' },
                        ].map((activity, idx) => (
                            <div
                                key={idx}
                                className={`px-6 py-3 flex items-center gap-3 ${activity.type === 'highlight' ? 'bg-green-50' : ''
                                    }`}
                            >
                                <span className="text-lg">{activity.icon}</span>
                                <div className="flex-1">
                                    <p className={`text-sm ${activity.type === 'highlight' ? 'text-green-700 font-medium' : 'text-slate-700'
                                        }`}>
                                        {activity.text}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 py-3 border-t border-slate-100">
                        <button
                            onClick={() => navigate('/campaigns')}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View full history
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right: Revenue Progress */}
                <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h2 className="text-sm font-medium text-slate-800">This Month's Recovery</h2>
                        <span className="text-xs text-slate-400">Feb 2026</span>
                    </div>

                    <div className="p-6">
                        {/* Main Progress */}
                        <div className="text-center mb-6">
                            <p className="text-4xl font-bold text-slate-900">₹{((metrics?.total_revenue || 0) / 1000).toFixed(0)}K</p>
                            <p className="text-sm text-slate-500 mt-1">recovered from campaigns</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-2">
                                <span>Progress</span>
                                <span>{Math.min(100, Math.round(((metrics?.total_revenue || 0) / (recommendation?.potential_revenue || 1)) * 100))}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, ((metrics?.total_revenue || 0) / (recommendation?.potential_revenue || 1)) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>₹0</span>
                                <span>₹{((recommendation?.potential_revenue || 0) / 1000).toFixed(0)}K potential</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-2xl font-bold text-slate-800">{metrics?.total_customers || 0}</p>
                                <p className="text-xs text-slate-500">Total Customers</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{recommendation?.total_eligible || 0}</p>
                                <p className="text-xs text-slate-500">Need Contact</p>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => setShowPicker(true)}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Target className="w-5 h-5" />
                            Start Today's Outreach
                        </button>
                    </div>
                </div>
            </div>

            {/* Picker Modal */}
            <CustomerPicker
                isOpen={showPicker}
                onClose={() => setShowPicker(false)}
                onPick={handlePick}
                recommendation={recommendation}
            />

            {/* Picking Animation */}
            <PickingAnimation
                isActive={showAnimation}
                targetCount={targetCount}
                segmentBreakdown={recommendation?.segment_breakdown || {}}
                onComplete={handleAnimationComplete}
            />

            {/* Picked Results */}
            <PickedResults
                isOpen={showResults}
                pickedSegments={pickedSegments}
                onClose={() => setShowResults(false)}
                onLaunchAll={handleLaunchAll}
                onLaunchSegment={handleLaunchSegment}
            />
        </div>
    );
}
