// Picked Results Component - Segment-grouped results with audio preview and launch
import { useState } from 'react';
import {
    ChevronDown, ChevronUp, Send, Phone, Pause,
    Users, DollarSign, Zap, X, Volume2
} from 'lucide-react';

interface Customer {
    id: string;
    customer_name: string;
    phone: string;
    bike_model: string;
    vehicle_number: string;
    segment: string;
    estimated_value: number;
}

interface PickedSegment {
    segment: string;
    count: number;
    revenue: number;
    color: string;
    icon: string;
    label: string;
    customers?: Customer[];
}

interface PickedResultsProps {
    isOpen: boolean;
    pickedSegments: PickedSegment[];
    onClose: () => void;
    onLaunchAll: (channel: 'whatsapp' | 'voice') => void;
    onLaunchSegment: (segment: string, channel: 'whatsapp' | 'voice') => void;
}

// Campaign templates per segment
const CAMPAIGN_TEMPLATES: Record<string, { whatsapp: string; voice: string; audioUrl?: string }> = {
    'LOST': {
        whatsapp: "🙏 {name} ji, aapki {bike_model} ki bahut yaad aa rahi hai! Special win-back offer: 20% off on full service. Book now: {link}",
        voice: "Namaste {name} ji, main Suzuki service center se bol raha hoon. Aapki bike ki service due hai. Abhi book karein aur 20% discount paayein.",
        audioUrl: "/audio/lost_customer.mp3"
    },
    'PAID_RISK': {
        whatsapp: "⚠️ {name} ji, aapki {bike_model} ko service ki zaroorat hai! 4 mahine ho gaye. 15% discount on booking today: {link}",
        voice: "Namaste {name} ji, aapki Suzuki ki regular service due hai. Aaj book karein aur 15% discount paayein.",
        audioUrl: "/audio/paid_risk.mp3"
    },
    'PAID_DUE': {
        whatsapp: "🔧 {name} ji, aapki {bike_model} ki routine service due hai! Book now for smooth riding: {link}",
        voice: "Namaste {name} ji, aapki bike ki routine service due hai. Slot book karne ke liye 1 dabayein.",
        audioUrl: "/audio/paid_due.mp3"
    },
    '1ST_FREE': {
        whatsapp: "🎁 {name} ji, aapki {bike_model} ki FREE 1st service due hai! Warranty mein hai, jaldi book karein: {link}",
        voice: "Namaste {name} ji, aapki nayi Suzuki ki pehli free service due hai. Warranty claim karne ke liye jaldi book karein.",
        audioUrl: "/audio/free_service.mp3"
    },
    '2ND_FREE': {
        whatsapp: "🎁 {name} ji, aapki {bike_model} ki FREE 2nd service due hai! Don't miss warranty benefit: {link}",
        voice: "Namaste {name} ji, aapki Suzuki ki doosri free service due hai. Warranty benefit miss na karein.",
        audioUrl: "/audio/free_service.mp3"
    },
    '3RD_FREE': {
        whatsapp: "🎁 {name} ji, LAST FREE service for your {bike_model}! Book before warranty ends: {link}",
        voice: "Namaste {name} ji, yeh aapki aakhri free service hai. Warranty khatam hone se pehle book karein.",
        audioUrl: "/audio/free_service.mp3"
    },
};

export default function PickedResults({ isOpen, pickedSegments, onClose, onLaunchAll, onLaunchSegment }: PickedResultsProps) {
    const [expandedSegments, setExpandedSegments] = useState<Record<string, boolean>>({});
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);

    if (!isOpen || pickedSegments.length === 0) return null;

    const totalCustomers = pickedSegments.reduce((sum, seg) => sum + seg.count, 0);
    const totalRevenue = pickedSegments.reduce((sum, seg) => sum + seg.revenue, 0);
    const whatsappCost = totalCustomers * 0.70;
    const voiceCost = totalCustomers * 0.50;

    const toggleSegment = (segment: string) => {
        setExpandedSegments(prev => ({ ...prev, [segment]: !prev[segment] }));
    };

    const toggleAudio = (segment: string) => {
        if (playingAudio === segment) {
            setPlayingAudio(null);
        } else {
            setPlayingAudio(segment);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
            <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-2xl my-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-semibold text-lg">📋 Today's Outreach List</h2>
                            <p className="text-white/80 text-sm">{totalCustomers} customers ready to contact</p>
                        </div>
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border-b">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                            <Users className="w-3 h-3" /> Customers
                        </div>
                        <div className="text-xl font-bold text-slate-800">{totalCustomers}</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                            <DollarSign className="w-3 h-3" /> Revenue
                        </div>
                        <div className="text-xl font-bold text-emerald-600">₹{(totalRevenue / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                            <Zap className="w-3 h-3" /> Cost
                        </div>
                        <div className="text-xl font-bold text-slate-800">₹{whatsappCost.toFixed(0)}</div>
                    </div>
                </div>

                {/* Segment Groups */}
                <div className="max-h-96 overflow-y-auto p-4 space-y-3">
                    {pickedSegments.map((seg) => {
                        const template = CAMPAIGN_TEMPLATES[seg.segment] || CAMPAIGN_TEMPLATES['PAID_DUE'];
                        const isExpanded = expandedSegments[seg.segment];
                        const isPlaying = playingAudio === seg.segment;

                        return (
                            <div key={seg.segment} className="border border-slate-200 rounded-xl overflow-hidden">
                                {/* Segment Header */}
                                <div
                                    className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100"
                                    onClick={() => toggleSegment(seg.segment)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{seg.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{seg.label}</h3>
                                            <p className="text-sm text-slate-500">
                                                {seg.count} customers • ₹{(seg.revenue / 1000).toFixed(0)}K potential
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="p-4 border-t border-slate-100">
                                        {/* WhatsApp Template */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                <Send className="w-4 h-4 text-green-600" />
                                                WhatsApp Message
                                            </div>
                                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-slate-700">
                                                {template.whatsapp}
                                            </div>
                                        </div>

                                        {/* Voice Template */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                                <Phone className="w-4 h-4 text-blue-600" />
                                                Voice Call Script
                                            </div>
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-slate-700">
                                                {template.voice}
                                            </div>
                                            {/* Audio Preview */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleAudio(seg.segment); }}
                                                className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                                            >
                                                {isPlaying ? (
                                                    <>
                                                        <Pause className="w-4 h-4" />
                                                        Stop Preview
                                                    </>
                                                ) : (
                                                    <>
                                                        <Volume2 className="w-4 h-4" />
                                                        Play Audio Preview
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Launch Buttons for this segment */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onLaunchSegment(seg.segment, 'whatsapp')}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                            >
                                                <Send className="w-4 h-4" />
                                                WhatsApp (₹{(seg.count * 0.70).toFixed(0)})
                                            </button>
                                            <button
                                                onClick={() => onLaunchSegment(seg.segment, 'voice')}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                Voice (₹{(seg.count * 0.50).toFixed(0)})
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer - Launch All */}
                <div className="p-4 bg-slate-50 border-t">
                    <div className="flex gap-3">
                        <button
                            onClick={() => onLaunchAll('whatsapp')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                        >
                            <Send className="w-5 h-5" />
                            Launch All via WhatsApp (₹{whatsappCost.toFixed(0)})
                        </button>
                        <button
                            onClick={() => onLaunchAll('voice')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                        >
                            <Phone className="w-5 h-5" />
                            Launch All via Voice (₹{voiceCost.toFixed(0)})
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-3">
                        Expected revenue: ₹{(totalRevenue / 1000).toFixed(0)}K • ROI: {((totalRevenue / whatsappCost) * 100).toFixed(0)}x
                    </p>
                </div>
            </div>
        </div>
    );
}
