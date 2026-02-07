import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';

interface CampaignEvent {
    type: 'delivered' | 'failed' | 'replied' | 'booking_confirmed' | 'booking_declined' | 'heartbeat';
    customer?: string;
    segment?: string;
    channel?: string;
    message?: string;
    revenue?: number;
    reason?: string;
    timestamp: string;
}

export function useEventStream(url: string) {
    const [events, setEvents] = useState<CampaignEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            logger.debug('SSE connected');
            setIsConnected(true);
        };

        eventSource.onmessage = (e) => {
            try {
                const event: CampaignEvent = JSON.parse(e.data);

                // Ignore heartbeats
                if (event.type === 'heartbeat') return;

                // Add event to list (keep last 10)
                setEvents((prev) => [event, ...prev].slice(0, 10));
            } catch (err) {
                logger.error('Failed to parse SSE event:', err);
            }
        };

        eventSource.onerror = () => {
            logger.debug('SSE error, reconnecting...');
            setIsConnected(false);
        };

        return () => {
            eventSource.close();
            setIsConnected(false);
        };
    }, [url]);

    return { events, isConnected };
}
