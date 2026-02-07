import { useState, useEffect, useCallback } from 'react';
import { Settings, LogOut, Check, Brain, Loader2 } from 'lucide-react';
import MasterActionCard from './MasterActionCard';
import { getDashboardMetrics, getTabCustomers, launchCampaign } from '../../lib/api';
import ReviewDrawer from './ReviewDrawer';
import CampaignTicker from './CampaignTicker';
import type { CampaignProgress } from './CampaignTicker';

interface SegmentBreakdown {
    segment: string;
    count: number;
    value: number;
    color: 'amber' | 'indigo' | 'rose';
    icon: any; // Using 'any' for now to avoid complexity with icon types in this quick iteration
    label: string;
}

interface Customer {
    id: string;
    customer_name: string;
    phone: string;
    bike_model: string;
    last_service_date: string;
    estimated_value: number;
}

interface SegmentData {
    segment: string;
    label: string;
    color: string;
    icon: any;
    customers: Customer[];
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<any>(null);
    const [reviewOpen, setReviewOpen] = useState(false);

    // Campaign Ticker State
    const [campaignProgress, setCampaignProgress] = useState<CampaignProgress | null>(null);

    // Data for the drawer
    const [drawerSegments, setDrawerSegments] = useState<SegmentData[]>([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await getDashboardMetrics();
            setMetrics(data);

            // Pre-fetch segment data for the drawer to make it snappy
            // In a real app, might want to lazy load this, but for < 500 customers it's fine
            const [urgent, routine, winback] = await Promise.all([
                getTabCustomers('warranty'),
                getTabCustomers('routine'),
                getTabCustomers('winback')
            ]);

            setDrawerSegments([
                {
                    segment: 'urgent',
                    label: 'Urgent Warranty',
                    color: 'amber',
                    icon: Brain, // Placeholder, icon handled in Drawer
                    customers: urgent.customers || []
                },
                {
                    segment: 'routine',
                    label: 'Routine Service',
                    color: 'indigo',
                    icon: Check,
                    customers: routine.customers || []
                },
                {
                    segment: 'winback',
                    label: 'Win-Back Risk',
                    color: 'rose',
                    icon: Check,
                    customers: winback.customers || []
                }
            ]);

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLaunchCampaign = async (selectedCustomers: Customer[], segment: string) => {
        // 1. Close Drawer
        setReviewOpen(false);

        // 2. Map frontend segment to backend enum
        const segmentMap: Record<string, string> = {
            'urgent': '1ST_FREE',
            'routine': 'PAID_ROUTINE',
            'winback': 'RISK_LOST'
        };
        const backendSegment = segmentMap[segment] || 'PAID_ROUTINE'; // Fallback

        // 3. Initialize Ticker State
        const totalRevenue = selectedCustomers.reduce((sum, c) => sum + c.estimated_value, 0);
        setCampaignProgress({
            status: 'initializing',
            sent: 0,
            total: selectedCustomers.length,
            currentRevenue: 0,
            totalRevenue: totalRevenue,
            logs: ['Initializing campaign engine...', 'Validating contact numbers...']
        });

        const customerIds = selectedCustomers.map(c => c.id);

        try {
            // 4. Start the API call (Async)
            // We initiate the call but don't await it strictly for the *visual* start
            const launchPromise = launchCampaign(customerIds, backendSegment, 'whatsapp', 'WARRANTY_URGENT');

            // 5. Run a simulation loop to visualize "Sending..." for the user
            // This makes it feel like a "Systems Go" moment even if the API is instant
            let currentSent = 0;
            const total = selectedCustomers.length;

            const interval = setInterval(() => {
                currentSent += Math.ceil(Math.random() * 3); // Random batch size
                if (currentSent > total) currentSent = total;

                const progressPercent = currentSent / total;
                const currentRev = Math.floor(totalRevenue * progressPercent);

                setCampaignProgress(prev => {
                    if (!prev) return null;
                    // Add realistic logs based on progress
                    const newLogs = [...prev.logs];
                    if (progressPercent > 0.1 && newLogs.length < 3) newLogs.push(`Allocating WhatsApp template for ${backendSegment}...`);
                    else if (progressPercent > 0.4 && newLogs.length < 4) newLogs.push(`Dispatching batch ${Math.ceil(progressPercent * 4)}/4...`);
                    else if (progressPercent > 0.8 && newLogs.length < 5) newLogs.push('Verifying delivery statuses...');

                    return {
                        ...prev,
                        status: 'sending',
                        sent: currentSent,
                        currentRevenue: currentRev,
                        logs: newLogs
                    };
                });

                if (currentSent >= total) {
                    clearInterval(interval);
                    finalizeCampaign(launchPromise);
                }
            }, 200); // Fast updates

        } catch (error) {
            console.error("Launch failed", error);
            setCampaignProgress(prev => prev ? { ...prev, status: 'failed', logs: [...prev.logs, 'Error: Campaign execution failed.'] } : null);
        }
    };

    const finalizeCampaign = async (launchPromise: Promise<any>) => {
        try {
            await launchPromise; // Ensure backend actually succeeded
            setCampaignProgress(prev => prev ? {
                ...prev,
                status: 'completed',
                sent: prev.total,
                currentRevenue: prev.totalRevenue,
                logs: [...prev.logs, '✅ All messages dispatched successfully.', 'Listening for replies...']
            } : null);

            // Refresh dashboard data after a delay to show impact
            setTimeout(loadDashboard, 2000);

        } catch (error) {
            setCampaignProgress(prev => prev ? { ...prev, status: 'failed', logs: [...prev.logs, '❌ Backend reported an error.'] } : null);
        }
    };

    const handleCloseTicker = () => {
        setCampaignProgress(null);
    };

    if (loading || !metrics) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    const totalCustomers = metrics.risk.count + metrics.urgent.count + metrics.routine.count;
    const totalPotential = metrics.risk.value + metrics.urgent.value + metrics.routine.value;

    const breakdown: SegmentBreakdown[] = [
        {
            segment: 'Urgent Warranty',
            count: metrics.urgent.count,
            value: metrics.urgent.value,
            color: 'amber',
            icon: Brain,
            label: '1st Free Service'
        },
        {
            segment: 'Routine Service',
            count: metrics.routine.count,
            value: metrics.routine.value,
            color: 'indigo',
            icon: Check,
            label: 'Paid Periodic'
        },
        {
            segment: 'Win-Back',
            count: metrics.risk.count,
            value: metrics.risk.value,
            color: 'rose',
            icon: Check,
            label: 'Risk / Lost'
        },
    ];

    const stats = [
        { label: 'Cost per Day', value: `₹${Math.floor(totalCustomers * 0.5).toLocaleString('en-IN')}`, subtext: '~₹0.50 per msg' },
        { label: 'Est. Bookings', value: `${Math.floor(totalCustomers * 0.15)}`, subtext: '15% conversion' },
        { label: 'ROI (Est)', value: `${Math.floor((totalPotential * 0.2) / (totalCustomers * 0.5))}x`, subtext: 'Return on Ad Spend', valueColor: 'text-emerald-600' },
    ];

    const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-8 relative">
            {/* Minimal Header */}
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {greeting}, User! 👋
                </h1>
                <p className="text-slate-500 text-lg">
                    Here is your daily action plan managed by ServiceDue Brain.
                </p>
            </div>

            {/* Campaign Ticker (Absolute/Fixed Overlay handled by component itself) */}
            <CampaignTicker progress={campaignProgress} onClose={handleCloseTicker} />

            {/* Master Action Card (Hero) */}
            <MasterActionCard
                totalCustomers={totalCustomers}
                totalRevenue={totalPotential}
                breakdown={breakdown}
                onLaunchAll={() => setReviewOpen(true)}
                stats={stats}
                loading={loading}
                autopilotEnabled={true} // Hardcoded for demo, could be prop
            />

            {/* Secondary Actions / Feed could go here */}

            {/* Review Drawer */}
            <ReviewDrawer
                isOpen={reviewOpen}
                onClose={() => setReviewOpen(false)}
                segments={drawerSegments}
                onLaunch={handleLaunchCampaign}
            />
        </div>
    );
}
