import { useState, useEffect } from 'react';
import { getCampaignHistory } from '../lib/api';
import { TrendingUp, Users, Phone, MessageSquare, Calendar, Filter, CheckCircle2, PhoneCall, AlertCircle } from 'lucide-react';

interface Campaign {
    id: string;
    created_at: string;
    segment: string;
    channel: string;
    template_id: string;
    stats: {
        sent: number;
        delivered: number;
        replied: number;
        booked: number;
    };
    revenue: number;
}

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterSegment, setFilterSegment] = useState<string>('all');
    const [filterChannel, setFilterChannel] = useState<string>('all');

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            setLoading(true);
            const data = await getCampaignHistory();
            setCampaigns(data.campaigns || []);
        } catch (err) {
            setError('Failed to load campaigns');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns = campaigns.filter(c => {
        if (filterSegment !== 'all' && c.segment !== filterSegment) return false;
        if (filterChannel !== 'all' && c.channel !== filterChannel) return false;
        return true;
    });

    // Calculate totals
    const totalSent = filteredCampaigns.reduce((sum, c) => sum + c.stats.sent, 0);
    const totalDelivered = filteredCampaigns.reduce((sum, c) => sum + c.stats.delivered, 0);
    const totalReplied = filteredCampaigns.reduce((sum, c) => sum + c.stats.replied, 0);
    const totalBooked = filteredCampaigns.reduce((sum, c) => sum + c.stats.booked, 0);
    const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);

    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '0';
    const responseRate = totalSent > 0 ? ((totalReplied / totalSent) * 100).toFixed(1) : '0';
    const conversionRate = totalSent > 0 ? ((totalBooked / totalSent) * 100).toFixed(1) : '0';

    const getSegmentLabel = (segment: string) => {
        const labels: Record<string, string> = {
            '1ST_FREE': 'Warranty',
            'PAID_ROUTINE': 'Routine Service',
            'RISK_LOST': 'Win-Back'
        };
        return labels[segment] || segment;
    };

    const getChannelIcon = (channel: string) => {
        if (channel === 'voice') return Phone;
        if (channel === 'whatsapp') return MessageSquare;
        return PhoneCall;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign History</h1>
                <p className="text-gray-600">Track your campaign performance and revenue</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600">Sent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalSent.toLocaleString()}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm text-gray-600">Delivered</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalDelivered.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">{deliveryRate}% rate</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="text-sm text-gray-600">Response</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalReplied.toLocaleString()}</p>
                    <p className="text-xs text-amber-600 mt-1">{responseRate}% rate</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-sm text-gray-600">Booked</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalBooked.toLocaleString()}</p>
                    <p className="text-xs text-indigo-600 mt-1">{conversionRate}% conversion</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-white/90">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <div className="flex gap-4 flex-1">
                        <select
                            value={filterSegment}
                            onChange={(e) => setFilterSegment(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Segments</option>
                            <option value="1ST_FREE">Warranty</option>
                            <option value="PAID_ROUTINE">Routine Service</option>
                            <option value="RISK_LOST">Win-Back</option>
                        </select>

                        <select
                            value={filterChannel}
                            onChange={(e) => setFilterChannel(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Channels</option>
                            <option value="voice">Voice</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="mix">Mixed</option>
                        </select>
                    </div>
                    <span className="text-sm text-gray-500">{filteredCampaigns.length} campaigns</span>
                </div>
            </div>

            {/* Campaigns Table */}
            {loading ? (
                <div className="bg-white rounded-xl p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading campaigns...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            ) : filteredCampaigns.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600">Launch your first campaign from the Home page</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Segment</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Channel</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Sent</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivered</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Responded</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Booked</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCampaigns.map((campaign) => {
                                const ChannelIcon = getChannelIcon(campaign.channel);
                                return (
                                    <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(campaign.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700">
                                                {getSegmentLabel(campaign.segment)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <ChannelIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600 capitalize">{campaign.channel}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                            {campaign.stats.sent}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                                            {campaign.stats.delivered}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-amber-600">
                                            {campaign.stats.replied}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-indigo-600">
                                            {campaign.stats.booked}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                            ₹{campaign.revenue.toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
