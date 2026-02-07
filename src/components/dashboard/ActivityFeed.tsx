import { CheckCircle, XCircle, MessageCircle, Clock } from 'lucide-react';
import { useEventStream } from '../../hooks/useEventStream';

function getRelativeTime(timestamp: string): string {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - eventTime.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default function ActivityFeed() {
    const { events, isConnected } = useEventStream('http://localhost:8000/api/events/stream');

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'delivered':
            case 'booking_confirmed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'failed':
            case 'booking_declined':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'replied':
                return <MessageCircle className="w-5 h-5 text-blue-600" />;
            default:
                return <Clock className="w-5 h-5 text-gray-400" />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'delivered':
            case 'booking_confirmed':
                return 'bg-green-50 border-green-200';
            case 'failed':
            case 'booking_declined':
                return 'bg-red-50 border-red-200';
            case 'replied':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getSegmentBadge = (segment?: string) => {
        if (!segment) return null;

        const colors: Record<string, string> = {
            '1ST_FREE': 'bg-orange-100 text-orange-800',
            'PAID_ROUTINE': 'bg-blue-100 text-blue-800',
            'RISK_LOST': 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[segment] || 'bg-gray-100 text-gray-800'}`}>
                {segment}
            </span>
        );
    };

    const getEventMessage = (event: any) => {
        switch (event.type) {
            case 'delivered':
                return (
                    <>
                        <p className="font-medium text-gray-900">Message Delivered to {event.customer}</p>
                        <p className="text-sm text-gray-600 mt-1">
                            {getSegmentBadge(event.segment)} • {event.channel}
                        </p>
                    </>
                );
            case 'failed':
                return (
                    <>
                        <p className="font-medium text-gray-900">Delivery Failed: {event.customer}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.reason}</p>
                    </>
                );
            case 'replied':
                return (
                    <>
                        <p className="font-medium text-gray-900">{event.customer} Replied</p>
                        <p className="text-sm text-gray-700 mt-1 italic">"{event.message}"</p>
                        <p className="text-xs text-gray-500 mt-1">→ System: Booking marked as pending</p>
                    </>
                );
            case 'booking_confirmed':
                return (
                    <>
                        <p className="font-medium text-green-700">✅ Booking Confirmed: {event.customer}</p>
                        <p className="text-sm font-semibold text-green-600 mt-1">
                            Revenue Impact: +₹{event.revenue?.toLocaleString('en-IN')}
                        </p>
                    </>
                );
            case 'booking_declined':
                return (
                    <>
                        <p className="font-medium text-gray-900">Booking Declined: {event.customer}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.reason}</p>
                    </>
                );
            default:
                return <p className="text-gray-600">Unknown event</p>;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">The Pulse</h3>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-600">{isConnected ? 'Live' : 'Connecting...'}</span>
                </div>
            </div>

            {events.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                    Waiting for campaign activity...
                </p>
            ) : (
                <div className="space-y-3">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border ${getEventColor(event.type)} transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className="mt-0.5">{getEventIcon(event.type)}</div>
                                <div className="flex-1">
                                    {getEventMessage(event)}
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {getRelativeTime(event.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
