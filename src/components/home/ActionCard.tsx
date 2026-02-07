import { Phone, MessageCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface CustomerLead {
    id: string;
    name: string;
    phone: string;
    bike_model: string;
    vehicle_number: string;
    segment: '1ST_FREE' | 'PAID_ROUTINE' | 'RISK_LOST';
    estimated_value: number;
    days_remaining?: number; // For Warranty
    days_overdue?: number;   // For Routine
    last_service_date?: string; // For Winback
}

interface ActionCardProps {
    customer: CustomerLead;
    type: 'warranty' | 'routine' | 'winback';
    onCall: (phone: string) => void;
    onWhatsApp: (phone: string, name: string) => void;
}

export default function ActionCard({ customer, type, onCall, onWhatsApp }: ActionCardProps) {
    const getBadgeStyle = () => {
        switch (type) {
            case 'warranty': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'routine': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'winback': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'warranty': return <AlertCircle className="w-4 h-4 text-orange-600" />;
            case 'routine': return <Clock className="w-4 h-4 text-blue-600" />;
            case 'winback': return <TrendingUp className="w-4 h-4 text-red-600" />;
        }
    };

    const getContextText = () => {
        if (type === 'warranty' && customer.days_remaining !== undefined) {
            return `${customer.days_remaining} days left`;
        }
        if (type === 'routine' && customer.days_overdue !== undefined) {
            return `${customer.days_overdue} days overdue`;
        }
        return 'Action Req.';
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between group">
            <div className="flex items-center space-x-4">
                {/* Icon Badge */}
                <div className={`p-3 rounded-full ${getBadgeStyle()} bg-opacity-50`}>
                    {getIcon()}
                </div>

                {/* Customer Details */}
                <div>
                    <h3 className="font-bold text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500 font-medium flex items-center mt-0.5">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mr-2 border border-gray-200">
                            {customer.bike_model}
                        </span>
                        <span className="text-gray-400">{customer.vehicle_number}</span>
                    </p>
                    <p className={`text-xs mt-1 font-semibold ${type === 'warranty' ? 'text-orange-600' :
                            type === 'routine' ? 'text-blue-600' : 'text-red-600'
                        }`}>
                        {getContextText()} • ₹{customer.estimated_value.toLocaleString('en-IN')}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onCall(customer.phone)}
                    className="p-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
                    title="Call Customer"
                >
                    <Phone className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onWhatsApp(customer.phone, customer.name)}
                    className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                    title="Send WhatsApp"
                >
                    <MessageCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
