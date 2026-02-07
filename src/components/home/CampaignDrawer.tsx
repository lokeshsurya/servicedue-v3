import { X, MessageCircle, Phone, Sparkles } from 'lucide-react';

interface CampaignDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    segment: string;
    count: number;
    value: number;
}

export default function CampaignDrawer({ isOpen, onClose, segment, count, value }: CampaignDrawerProps) {
    if (!isOpen) return null;

    const cost = (count * 0.70).toFixed(2); // Mock calculation based on WhatsApp cost

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Drawer */}
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Launch Campaign • {segment}</h2>
                        <p className="text-sm text-gray-500">Recover ₹{value.toLocaleString('en-IN')} revenue</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto">
                    {/* Section 1: Channel */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">1. Choose Channel</h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-4 border-2 border-green-500 bg-green-50 rounded-xl cursor-pointer transition-all">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-green-600 flex items-center justify-center mr-4 bg-white">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 flex items-center">
                                            WhatsApp Official
                                            <span className="ml-2 bg-green-200 text-green-800 text-xs px-2 py-0.5 rounded-full">Recommended</span>
                                        </p>
                                        <p className="text-sm text-gray-600">High open rate (92%) • ₹0.70/msg</p>
                                    </div>
                                </div>
                                <MessageCircle className="w-6 h-6 text-green-600" />
                            </label>

                            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 opacity-60">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-4"></div>
                                    <div>
                                        <p className="font-bold text-gray-900">Voice Call</p>
                                        <p className="text-sm text-gray-600">Lower answer rate • ₹0.50/call</p>
                                    </div>
                                </div>
                                <Phone className="w-6 h-6 text-gray-400" />
                            </label>
                        </div>
                    </div>

                    {/* Section 2: Template Preview */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">2. Message Preview</h3>
                        <div className="bg-gray-100 p-4 rounded-xl text-sm font-mono text-gray-700 leading-relaxed border border-gray-200">
                            <p>Hi <span className="text-blue-600">{`{customer_name}`}</span>,</p>
                            <br />
                            <p>Your <span className="text-blue-600">{`{bike_model}`}</span>'s warranty expires in <span className="text-blue-600">{`{days_left}`}</span> days!</p>
                            <br />
                            <p>Book your 1st Free Service now to save ₹800 on future repairs.</p>
                            <br />
                            <p>📅 Book Now: <span className="text-blue-600">suzu.ki/{`{link}`}</span></p>
                        </div>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center transition-all transform hover:scale-[1.02]">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Send to {count} Customers (₹{cost})
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        <span className="font-semibold text-gray-600">100% Safe:</span> Validated by Suzuki Brain
                    </p>
                </div>
            </div>
        </div>
    );
}
