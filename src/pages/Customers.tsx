import { useState, useEffect } from 'react';
import { Search, Download, Users as UsersIcon } from 'lucide-react';
import { getCustomers, getCustomerStats } from '../lib/api';

interface Customer {
    id: string;
    name: string;
    phone: string;
    bike_model: string;
    vehicle_number: string;
    segment: string;
    last_service_date: string;
    next_service_date: string;
    estimated_value: number;
}

interface CustomerStats {
    total: number;
    warranty: number;
    routine: number;
    winback: number;
}

export default function Customers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState<CustomerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [segment, setSegment] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const limit = 50;

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [search, segment, page]);

    const fetchStats = async () => {
        try {
            const data = await getCustomerStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await getCustomers({
                search,
                segment,
                page,
                limit
            });
            setCustomers(data.customers);
            setTotal(data.total);
            setPages(data.pages);
        } catch (err) {
            console.error('Failed to load customers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on new search
    };

    const handleSegmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSegment(e.target.value);
        setPage(1);
    };

    const getSegmentBadge = (seg: string) => {
        const colors: Record<string, string> = {
            '1ST_FREE': 'bg-orange-100 text-orange-800',
            '2ND_FREE': 'bg-orange-100 text-orange-800',
            '3RD_FREE': 'bg-orange-100 text-orange-800',
            'PAID_DUE': 'bg-blue-100 text-blue-800',
            'PAID_RISK': 'bg-yellow-100 text-yellow-800',
            'LOST': 'bg-red-100 text-red-800',
            'SAFE': 'bg-green-100 text-green-800'
        };
        const labels: Record<string, string> = {
            '1ST_FREE': '1st Free Service',
            '2ND_FREE': '2nd Free Service',
            '3RD_FREE': '3rd Free Service',
            'PAID_DUE': 'Paid Due',
            'PAID_RISK': 'At Risk',
            'LOST': 'Lost',
            'SAFE': 'Safe'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[seg] || 'bg-gray-100 text-gray-800'}`}>
                {labels[seg] || seg}
            </span>
        );
    };

    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    {stats && (
                        <p className="text-gray-600 mt-1">
                            {stats.total} total • {stats.warranty} warranty • {stats.routine} routine • {stats.winback} win-back
                        </p>
                    )}
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or vehicle number..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Segment Filter */}
                    <div className="w-48">
                        <select
                            value={segment}
                            onChange={handleSegmentChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Segments</option>
                            <option value="1ST_FREE">1st Free Service</option>
                            <option value="2ND_FREE">2nd Free Service</option>
                            <option value="3RD_FREE">3rd Free Service</option>
                            <option value="PAID_DUE">Paid Due</option>
                            <option value="PAID_RISK">At Risk</option>
                            <option value="LOST">Lost</option>
                            <option value="SAFE">Safe</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading customers...</p>
                    </div>
                ) : customers.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  font-semibold text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Bike
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Segment
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Last Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Next Due
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">{customer.vehicle_number}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {customer.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {customer.bike_model}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getSegmentBadge(customer.segment)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(customer.last_service_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(customer.next_service_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-emerald-600">
                                                ₹{customer.estimated_value?.toLocaleString('en-IN') || '0'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} customers
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Page {page} of {pages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(pages, page + 1))}
                                    disabled={page === pages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No customers found</p>
                        <p className="text-sm text-gray-400 mt-2">
                            {search || segment !== 'all' ? 'Try adjusting your filters' : 'Upload an Excel file to add customers'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
