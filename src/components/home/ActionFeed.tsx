import ActionCard from './ActionCard';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

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

interface ActionFeedProps {
    urgentLeads: CustomerLead[];
    routineLeads: CustomerLead[];
    winbackLeads: CustomerLead[];
    loading: boolean;
}

export default function ActionFeed({ urgentLeads, routineLeads, winbackLeads, loading }: ActionFeedProps) {

    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    const handleWhatsApp = (phone: string, name: string) => {
        const message = encodeURIComponent(`Hi ${name}, your service is due at our Suzuki Service Center. Would you like to book a slot?`);
        window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
                ))}
            </div>
        );
    }

    const hasNoActions = urgentLeads.length === 0 && routineLeads.length === 0 && winbackLeads.length === 0;

    if (hasNoActions) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500">All caught up! No urgent actions required.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Urgent Section */}
            {urgentLeads.length > 0 && (
                <section>
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">Urgent: Warranty Expiring</h2>
                        <span className="ml-auto text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                            {urgentLeads.length} pending
                        </span>
                    </div>
                    <div className="space-y-3">
                        {urgentLeads.map(lead => (
                            <ActionCard
                                key={lead.id}
                                customer={lead}
                                type="warranty"
                                onCall={handleCall}
                                onWhatsApp={handleWhatsApp}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Routine Section */}
            {routineLeads.length > 0 && (
                <section>
                    <div className="flex items-center mb-4">
                        <Clock className="w-5 h-5 text-blue-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">Pipeline: Service Due</h2>
                    </div>
                    <div className="space-y-3">
                        {routineLeads.map(lead => (
                            <ActionCard
                                key={lead.id}
                                customer={lead}
                                type="routine"
                                onCall={handleCall}
                                onWhatsApp={handleWhatsApp}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Winback Section */}
            {winbackLeads.length > 0 && (
                <section>
                    <div className="flex items-center mb-4">
                        <TrendingUp className="w-5 h-5 text-red-600 mr-2" />
                        <h2 className="text-lg font-bold text-gray-800">Win-Back Opportunities</h2>
                    </div>
                    <div className="space-y-3">
                        {winbackLeads.map(lead => (
                            <ActionCard
                                key={lead.id}
                                customer={lead}
                                type="winback"
                                onCall={handleCall}
                                onWhatsApp={handleWhatsApp}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
