import { Sparkles, ArrowRight } from 'lucide-react';

interface SmartBannerProps {
    count: number;
    value: number;
    segment: string;
    onAction: () => void;
}

export default function SmartBanner({ count, value, segment, onAction }: SmartBannerProps) {
    if (count === 0) return null;

    return (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mb-8">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Recommendation</h2>
                        <p className="text-white/90 mt-1">
                            Contact <span className="font-bold border-b border-white/40">{count} {segment} customers</span> to secure <span className="font-bold text-yellow-300">₹{value.toLocaleString('en-IN')}</span> today.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onAction}
                    className="group bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center shadow-md whitespace-nowrap"
                >
                    Launch Campaign
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
        </div>
    );
}
