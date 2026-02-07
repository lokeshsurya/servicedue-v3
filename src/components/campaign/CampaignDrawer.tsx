import { X } from 'lucide-react';
import { useState } from 'react';
import { TEMPLATES, getTemplateForSegment, previewMessage } from '../../lib/templates';

interface CampaignDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCustomers: any[];
    segment: string;
    onLaunch: (channel: 'whatsapp' | 'voice' | 'mix', templateId: string) => void;
}

const CHANNELS = [
    {
        id: 'whatsapp' as const,
        name: 'WhatsApp',
        emoji: '🟢',
        cost: 0.70,
        description: 'High open rate (92%)',
        recommended: true
    },
    {
        id: 'voice' as const,
        name: 'Voice Call',
        emoji: '📞',
        cost: 0.50,
        description: 'Lower answer rate (35%)'
    },
    {
        id: 'mix' as const,
        name: 'WhatsApp + Voice Mix',
        emoji: '🤖',
        cost: 1.20,
        description: 'Maximum reach (WhatsApp → Voice)'
    }
];

export default function CampaignDrawer({ isOpen, onClose, selectedCustomers, segment, onLaunch }: CampaignDrawerProps) {
    const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'voice' | 'mix'>('whatsapp');

    if (!isOpen) return null;

    const template = getTemplateForSegment(segment);
    const totalCost = selectedCustomers.length * CHANNELS.find(c => c.id === selectedChannel)!.cost;
    const totalRevenue = selectedCustomers.reduce((sum, c) => sum + (c.estimated_value || 0), 0);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Launch Campaign</h2>
                            <p className="text-sm text-gray-600 mt-1">{selectedCustomers.length} customers selected</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Section A: Channel Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Communication Channel</h3>
                        <div className="space-y-3">
                            {CHANNELS.map((channel) => (
                                <button
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedChannel === channel.id
                                            ? 'border-primary bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="text-xl">{channel.emoji}</span>
                                                <span className="font-semibold text-gray-900">{channel.name}</span>
                                                {channel.recommended && (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{channel.description}</p>
                                            <p className="text-sm text-gray-900 mt-2">
                                                ₹{channel.cost} per message • Total: <span className="font-semibold">₹{(selectedCustomers.length * channel.cost).toFixed(2)}</span>
                                            </p>
                                        </div>
                                        {selectedChannel === channel.id && (
                                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Section B: Message Preview */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Preview</h3>
                        <div className="bg-gray-50 rounded-lg px-2 py-1 mb-3 inline-block">
                            <span className="text-xs font-medium text-gray-600">Auto-selected for {segment} segment</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Template: {template.name}</p>
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                                    {previewMessage(template.id as keyof typeof TEMPLATES)}
                                </pre>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Message will be personalized with each customer's name, bike model, and details
                            </p>
                        </div>
                    </div>

                    {/* Section C: Launch Button */}
                    <button
                        onClick={() => onLaunch(selectedChannel, template.id)}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <span>🚀</span>
                            <span>SEND NOW</span>
                        </div>
                        <div className="text-sm font-normal mt-1 opacity-90">
                            Send to {selectedCustomers.length} customers • Cost: ₹{totalCost.toFixed(2)} • Expected: ₹{totalRevenue.toLocaleString('en-IN')}
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}
