import { useState, useEffect } from 'react';
import { getDashboardMetrics } from '../lib/api';
import { BarChart3, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

interface DashboardMetrics {
    risk: number;
    recovered: number;
    urgent: number;
    pipeline: number;
    autopilot_active: boolean;
    counts: {
        risk_count: number;
        urgent_count: number;
        pipeline_count: number;
    };
}

export default function Dashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics();
                setMetrics(data);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetrics();
    }, []);

    if (loading || !metrics) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const totalRevenue = metrics.recovered + metrics.pipeline + metrics.urgent + metrics.risk;
    const recoveryRate = totalRevenue > 0 ? Math.round((metrics.recovered / totalRevenue) * 100) : 0;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-8 h-8 mr-3 text-indigo-600" />
                    Business Health Check
                </h1>
                <p className="text-gray-500 mt-2">Monthly performance overview and revenue trends.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Recovery</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">₹{metrics.recovered.toLocaleString('en-IN')}</p>
                    <div className="flex items-center mt-2 text-sm text-green-700 bg-green-50 w-fit px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% this month
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pipeline Value</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">₹{metrics.pipeline.toLocaleString('en-IN')}</p>
                    <p className="text-gray-500 text-sm mt-2">{metrics.counts.pipeline_count} customers scheduled</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">At Risk</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">₹{metrics.risk.toLocaleString('en-IN')}</p>
                    <p className="text-gray-500 text-sm mt-2">{metrics.counts.risk_count} lapsed customers</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Ticket</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹1,850</p>
                    <p className="text-gray-500 text-sm mt-2">Across all segments</p>
                </div>
            </div>

            {/* Charts Section (CSS Only) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Goal Progress */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Monthly Revenue Goal</h3>
                        <span className="text-sm font-semibold text-gray-500">Target: ₹5,00,000</span>
                    </div>

                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                    Progress
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-indigo-600">
                                    {recoveryRate}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-indigo-100">
                            <div style={{ width: `${recoveryRate}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {['Week 1', 'Week 2', 'Week 3'].map((week, i) => (
                            <div key={week} className="flex flex-col items-center">
                                <div className="h-32 w-full bg-gray-50 rounded-xl relative flex items-end justify-center pb-2 overflow-hidden group">
                                    <div
                                        className="w-12 bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600"
                                        style={{ height: `${[40, 65, 30][i]}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 mt-2 uppercase">{week}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Funnel */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h3>
                    <div className="space-y-6">
                        <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center text-sm font-semibold text-gray-600">
                                    <Users className="w-4 h-4 mr-2" />
                                    Leads Contacted
                                </span>
                                <span className="font-bold">142</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        <div className="relative pl-4 border-l-2 border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center text-sm font-semibold text-gray-600">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Booked
                                </span>
                                <span className="font-bold">89</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1 font-semibold">62% Conversion</p>
                        </div>

                        <div className="relative pl-8 border-l-2 border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="flex items-center text-sm font-semibold text-gray-600">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Revenue
                                </span>
                                <span className="font-bold">₹{metrics.recovered.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
