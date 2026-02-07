import { useState, useEffect } from 'react';
import { getTabCustomers, launchCampaign } from '../../lib/api';
import CampaignDrawer from '../campaign/CampaignDrawer';
import ConfirmationModal from '../campaign/ConfirmationModal';
import RevenueTicker from '../campaign/RevenueTicker';

type TabType = 'warranty' | 'routine' | 'winback';

interface Customer {
    id: string;
    name: string;
    phone: string;
    bike_model: string;
    vehicle_number: string;
    segment: string;
    estimated_value: number;
    days_remaining?: number;
    days_overdue?: number;
    last_service_date?: string;
}

interface TabData {
    customers: Customer[];
    total: number;
    showing: number;
    has_more: boolean;
}

export default function ActionTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('warranty');
    const [tabData, setTabData] = useState<TabData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);

    // Campaign UI states
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [tickerRunning, setTickerRunning] = useState(false);
    const [pendingLaunch, setPendingLaunch] = useState<{ channel: 'whatsapp' | 'voice' | 'mix', templateId: string } | null>(null);

    useEffect(() => {
        async function fetchTabData() {
            setLoading(true);
            try {
                const data = await getTabCustomers(activeTab);
                setTabData(data);
                setSelectedCustomers([]);  // Reset selection on tab change
            } catch (err) {
                console.error('Failed to load customer list:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTabData();
    }, [activeTab]);

    const tabs = [
        { id: 'warranty' as TabType, label: 'Warranty Guard', emoji: '🟠', segment: '1ST_FREE' },
        { id: 'routine' as TabType, label: 'Routine Service', emoji: '🔵', segment: 'PAID_ROUTINE' },
        { id: 'winback' as TabType, label: 'Win-Back', emoji: '🔴', segment: 'RISK_LOST' },
    ];

    const activeTabData = tabs.find(t => t.id === activeTab)!;

    const handleSelectAll = () => {
        if (tabData) {
            if (selectedCustomers.length === tabData.customers.length) {
                setSelectedCustomers([]);
            } else {
                setSelectedCustomers(tabData.customers);
            }
        }
    };

    const handleSelectCustomer = (customer: Customer) => {
        if (selectedCustomers.find(c => c.id === customer.id)) {
            setSelectedCustomers(selectedCustomers.filter(c => c.id !== customer.id));
        } else {
            setSelectedCustomers([...selectedCustomers, customer]);
        }
    };

    const handleLaunchClick = () => {
        if (selectedCustomers.length > 0) {
            setDrawerOpen(true);
        }
    };

    const handleDrawerLaunch = (channel: 'whatsapp' | 'voice' | 'mix', templateId: string) => {
        setPendingLaunch({ channel, templateId });
        setDrawerOpen(false);
        setConfirmModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!pendingLaunch) return;

        setConfirmModalOpen(false);
        setTickerRunning(true);

        try {
            const leadIds = selectedCustomers.map(c => c.id);
            await launchCampaign(leadIds, activeTabData.segment, pendingLaunch.channel, pendingLaunch.templateId);
        } catch (err) {
            console.error('Campaign launch failed:', err);
        }
    };

    const handleTickerComplete = () => {
        setTickerRunning(false);
        setPendingLaunch(null);
        setSelectedCustomers([]);
        // Refresh tab data to show updated metrics
    };

    const totalRevenue = selectedCustomers.reduce((sum, c) => sum + c.estimated_value, 0);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md">
                {/* Tab Headers */}
                <div className="border-b border-gray-200">
                    <div className="flex space-x-1 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-4 py-3 text-sm font-bold rounded-t-lg transition-colors ${activeTab === tab.id
                                    ? tab.id === 'warranty'
                                        ? 'bg-orange-600 text-white'
                                        : tab.id === 'routine'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-red-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.emoji} {tab.label}
                                {tabData && activeTab === tab.id && (
                                    <span className="ml-2 px-2.5 py-1 bg-white bg-opacity-30 text-white text-xs font-bold rounded-full">
                                        {tabData.total}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-gray-600 mt-2 text-sm">Loading customers...</p>
                        </div>
                    ) : tabData && tabData.customers.length > 0 ? (
                        <>
                            {/* Showing indicator + Launch button */}
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold">{tabData.showing}</span> of{' '}
                                    <span className="font-semibold">{tabData.total}</span> customers
                                    {selectedCustomers.length > 0 && (
                                        <span className="ml-2 text-primary">
                                            • {selectedCustomers.length} selected
                                        </span>
                                    )}
                                </p>
                                <button
                                    onClick={handleLaunchClick}
                                    disabled={selectedCustomers.length === 0}
                                    className="px-6 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {selectedCustomers.length > 0
                                        ? `Recover ₹${totalRevenue.toLocaleString('en-IN')} (${selectedCustomers.length})`
                                        : 'Select customers to launch'
                                    }
                                </button>
                            </div>

                            {/* Customer Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCustomers.length === tabData.customers.length}
                                                    onChange={handleSelectAll}
                                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                />
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Bike
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {activeTab === 'warranty' ? 'Days Left' : activeTab === 'routine' ? 'Days Overdue' : 'Last Service'}
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tabData.customers.map((customer) => (
                                            <tr
                                                key={customer.id}
                                                className={`hover:bg-blue-50 transition-all duration-150 cursor-pointer ${selectedCustomers.find(c => c.id === customer.id) ? 'bg-blue-100' : ''
                                                    }`}
                                                onClick={() => handleSelectCustomer(customer)}
                                            >
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedCustomers.find(c => c.id === customer.id)}
                                                        onChange={() => handleSelectCustomer(customer)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                                    />
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                    <div className="text-xs text-gray-500">{customer.vehicle_number}</div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {customer.phone}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {customer.bike_model}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                    {activeTab === 'warranty' && customer.days_remaining !== undefined && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${customer.days_remaining < 3 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                                                            }`}>
                                                            {customer.days_remaining} days
                                                        </span>
                                                    )}
                                                    {activeTab === 'routine' && customer.days_overdue !== undefined && (
                                                        <span className="text-gray-600">{customer.days_overdue} days ago</span>
                                                    )}
                                                    {activeTab === 'winback' && customer.last_service_date && (
                                                        <span className="text-gray-600">
                                                            {new Date(customer.last_service_date).toLocaleDateString('en-IN')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-emerald-600">
                                                    ₹{customer.estimated_value.toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Show More Button */}
                            {tabData.has_more && (
                                <div className="mt-4 text-center">
                                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                                        Show More Customers
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No customers in this segment yet.</p>
                            <p className="text-sm text-gray-400 mt-2">Upload dealer data to see actionable leads.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign Components */}
            <CampaignDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                selectedCustomers={selectedCustomers}
                segment={activeTabData.segment}
                onLaunch={handleDrawerLaunch}
            />

            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                customerCount={selectedCustomers.length}
                segment={activeTabData.segment}
                expectedRevenue={totalRevenue}
                channel={pendingLaunch?.channel || 'whatsapp'}
            />

            <RevenueTicker
                isRunning={tickerRunning}
                totalCount={selectedCustomers.length}
                onComplete={handleTickerComplete}
            />
        </>
    );
}
