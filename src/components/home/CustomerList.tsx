import { Phone, CheckCircle2 } from 'lucide-react';

interface CustomerLead {
    id: string;
    name: string;
    phone: string;
    bike_model: string;
    vehicle_number: string;
    segment: '1ST_FREE' | 'PAID_ROUTINE' | 'RISK_LOST';
    estimated_value: number;
    days_remaining?: number;
    days_overdue?: number;
    last_service_date?: string;
}

interface CustomerListProps {
    leads: CustomerLead[];
    type: 'warranty' | 'routine' | 'winback';
    loading: boolean;
}

export default function CustomerList({ leads, type, loading }: CustomerListProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                <p className="text-gray-500">No customers found in this segment.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked readOnly />
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bike Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Potential</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked readOnly />
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-900">{lead.name}</p>
                                    <p className="text-xs text-gray-500 font-mono flex items-center mt-1">
                                        <Phone className="w-3 h-3 mr-1" />
                                        {lead.phone}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-700">{lead.bike_model}</p>
                                    <p className="text-xs text-gray-400 font-mono mt-0.5">{lead.vehicle_number}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {type === 'warranty' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                            Expires in {lead.days_remaining} days
                                        </span>
                                    )}
                                    {type === 'routine' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {lead.days_overdue} days overdue
                                        </span>
                                    )}
                                    {type === 'winback' && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Last service: {lead.last_service_date}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    ₹{lead.estimated_value.toLocaleString('en-IN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center text-xs text-gray-500">
                Showing {leads.length} of {leads.length} customers
            </div>
        </div>
    );
}
