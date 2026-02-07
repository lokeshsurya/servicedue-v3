import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Users, DollarSign, TrendingUp, Phone, MessageSquare, Check } from 'lucide-react';
import { launchCampaign } from '../lib/api';

/**
 * CAMPAIGN BUILDER PAGE
 * Professional campaign creation like Twilio/Exotel
 * 
 * Features:
 * - Full customer list with details
 * - Channel selection (Voice/WhatsApp/Mix)
 * - Audio preview player
 * - Cost calculator
 * - Edit capabilities
 * - Confirmation before send
 */

interface Customer {
    id: string;
    customer_name: string;
    phone: string;
    bike_model: string;
    segment: string;
    estimated_value: number;
}

interface LocationState {
    customers: Customer[];
    segment: string;
}

export default function CampaignBuilder() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    // State management
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
    const [segment, setSegment] = useState(state?.segment || '1ST_FREE');
    const [channel, setChannel] = useState<'voice' | 'whatsapp' | 'mix'>('voice');
    const [isLaunching, setIsLaunching] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const customers = state?.customers || [];

    // Initialize with all customers selected
    useEffect(() => {
        if (customers.length > 0) {
            setSelectedCustomers(customers.map(c => c.id));
        }
    }, [customers.length]);

    // Calculate costs
    const costPerChannel = {
        voice: 0.60,
        whatsapp: 0.35,
        mix: 0.95
    };

    const selectedCount = selectedCustomers.length;
    const estimatedCost = selectedCount * costPerChannel[channel];
    const potentialRevenue = customers
        .filter(c => selectedCustomers.includes(c.id))
        .reduce((sum, c) => sum + (c.estimated_value || 0), 0);

    // Handlers
    const toggleCustomer = (customerId: string) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        );
    };

    const selectAll = () => {
        setSelectedCustomers(customers.map(c => c.id));
    };

    const deselectAll = () => {
        setSelectedCustomers([]);
    };

    const handleLaunch = async () => {
        if (selectedCount === 0) {
            alert('Please select at least one customer');
            return;
        }

        setShowConfirmation(true);
    };

    const confirmLaunch = async () => {
        try {
            setIsLaunching(true);

            await launchCampaign(
                selectedCustomers,
                segment,
                channel,
                `${segment}_template`
            );

            // Navigate to campaigns page to see progress
            navigate('/campaigns');
        } catch (error) {
            console.error('Campaign launch failed:', error);
            alert('Failed to launch campaign. Please try again.');
        } finally {
            setIsLaunching(false);
            setShowConfirmation(false);
        }
    };

    const getSegmentLabel = (seg: string) => {
        const labels: Record<string, string> = {
            '1ST_FREE': 'Warranty Reminder',
            'PAID_ROUTINE': 'Routine Service',
            'RISK_LOST': 'Win-Back Campaign'
        };
        return labels[seg] || seg;
    };

    const getAudioUrl = () => {
        // Map segment to audio file
        return 'http://localhost:8000/audio/warrenty%201st%20message%20kubera.wav';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>
                                <p className="text-sm text-gray-600">{getSegmentLabel(segment)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Save as Draft
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Users className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Selected Customers</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{selectedCount}</p>
                        <p className="text-xs text-gray-500 mt-1">of {customers.length} total</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-600">Estimated Cost</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">₹{estimatedCost.toFixed(0)}</p>
                        <p className="text-xs text-gray-500 mt-1">₹{costPerChannel[channel].toFixed(2)} per {channel}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-white/90">Potential Revenue</span>
                        </div>
                        <p className="text-3xl font-bold text-white">₹{potentialRevenue.toLocaleString()}</p>
                        <p className="text-xs text-white/80 mt-1">Expected bookings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Configuration */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Segment Selector */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Campaign Type</h3>
                            <div className="space-y-2">
                                {[
                                    { id: '1ST_FREE', label: 'Warranty Reminder', desc: 'First free service' },
                                    { id: 'PAID_ROUTINE', label: 'Routine Service', desc: 'Periodic maintenance' },
                                    { id: 'RISK_LOST', label: 'Win-Back', desc: 'Re-engage lost customers' }
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSegment(option.id)}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${segment === option.id
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="font-medium text-sm text-gray-900">{option.label}</div>
                                        <div className="text-xs text-gray-500">{option.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Channel Selector */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Communication Channel</h3>
                            <div className="space-y-2">
                                {[
                                    { id: 'voice' as const, icon: Phone, label: 'Voice Call', cost: '₹0.60/call' },
                                    { id: 'whatsapp' as const, icon: MessageSquare, label: 'WhatsApp', cost: '₹0.35/msg' },
                                    { id: 'mix' as const, icon: Phone, label: 'Mixed', cost: '₹0.95/both' }
                                ].map(option => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => setChannel(option.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${channel === option.id
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 text-gray-600" />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-sm text-gray-900">{option.label}</div>
                                                <div className="text-xs text-gray-500">{option.cost}</div>
                                            </div>
                                            {channel === option.id && <Check className="w-5 h-5 text-indigo-600" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Audio Preview */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Message Preview</h3>
                            <div className="bg-gray-50 rounded-lg p-4 mb-3">
                                <audio controls className="w-full" src={getAudioUrl()}>
                                    Your browser does not support audio playback.
                                </audio>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                "Hello? ... Namaste Sir. Main Suzuki Service Center se Priya baat kar rahi hoon..."
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Customer List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Customer List</h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={selectAll}
                                            className="px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={deselectAll}
                                            className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Deselect All
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-auto max-h-[600px]">
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12"></th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bike Model</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {customers.map((customer) => {
                                            const isSelected = selectedCustomers.includes(customer.id);
                                            return (
                                                <tr
                                                    key={customer.id}
                                                    onClick={() => toggleCustomer(customer.id)}
                                                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => { }}
                                                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {customer.customer_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {customer.phone}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {customer.bike_model}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                                        ₹{customer.estimated_value?.toLocaleString() || 0}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">{selectedCount} customers</span> selected
                            {' • '}
                            <span className="font-semibold text-gray-900">₹{estimatedCost.toFixed(0)}</span> estimated cost
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLaunch}
                                disabled={selectedCount === 0 || isLaunching}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLaunching ? 'Launching...' : 'Launch Campaign →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Campaign Launch?</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Customers:</span>
                                <span className="font-semibold text-gray-900">{selectedCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Channel:</span>
                                <span className="font-semibold text-gray-900 capitalize">{channel}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Cost:</span>
                                <span className="font-semibold text-gray-900">₹{estimatedCost.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                                <span className="text-gray-600">Potential Revenue:</span>
                                <span className="font-bold text-green-600">₹{potentialRevenue.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            This will send {channel === 'voice' ? 'voice calls' : channel === 'whatsapp' ? 'WhatsApp messages' : 'both voice and WhatsApp'} to {selectedCount} customers immediately.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLaunch}
                                disabled={isLaunching}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {isLaunching ? 'Sending...' : 'Confirm & Send'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
