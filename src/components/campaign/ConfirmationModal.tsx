import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customerCount: number;
    segment: string;
    expectedRevenue: number;
    channel: string;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    customerCount,
    segment,
    expectedRevenue,
    channel
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const segmentNames: Record<string, string> = {
        '1ST_FREE': 'Warranty Guard',
        'PAID_ROUTINE': 'Routine Service',
        'RISK_LOST': 'Win-Back'
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
                    <div className="flex items-start space-x-4 mb-6">
                        <div className="bg-orange-100 rounded-full p-3">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Campaign Launch</h3>
                            <p className="text-sm text-gray-600">
                                You are about to send {channel === 'whatsapp' ? 'WhatsApp messages' : channel === 'voice' ? 'voice calls' : 'WhatsApp messages + voice calls'} to:
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Customers:</span>
                            <span className="font-semibold text-gray-900">{customerCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Segment:</span>
                            <span className="font-semibold text-gray-900">{segmentNames[segment] || segment}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Expected Revenue:</span>
                            <span className="font-semibold text-green-600">₹{expectedRevenue.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-6 text-center italic">
                        This action cannot be undone.
                    </p>

                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                        >
                            Confirm & Send →
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
