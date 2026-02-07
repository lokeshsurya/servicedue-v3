import { useState, useEffect } from 'react';

import { Rocket, Check, AlertCircle, X, Loader2 } from 'lucide-react';

export interface CampaignProgress {
    status: 'initializing' | 'sending' | 'completed' | 'failed';
    sent: number;
    total: number;
    currentRevenue: number;
    totalRevenue: number;
    logs: string[];
}

interface CampaignTickerProps {
    progress: CampaignProgress | null;
    onClose: () => void;
}

export default function CampaignTicker({ progress, onClose }: CampaignTickerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (progress) {
            setIsVisible(true);
        }
    }, [progress]);

    if (!progress || !isVisible) return null;

    const percent = Math.min(Math.round((progress.sent / progress.total) * 100), 100);
    const isComplete = progress.status === 'completed';
    const isFailed = progress.status === 'failed';

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-xl bg-slate-900/90">
                {/* Main Content */}
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Icon Status */}
                        <div className={`p-2 rounded-full ${isComplete ? 'bg-emerald-500/20 text-emerald-400' : isFailed ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                            {isComplete ? <Check className="w-6 h-6" /> :
                                isFailed ? <AlertCircle className="w-6 h-6" /> :
                                    <Loader2 className="w-6 h-6 animate-spin" />}
                        </div>

                        <div>
                            <h3 className="font-bold text-lg tracking-tight flex items-center gap-2">
                                {isComplete ? 'Campaign Complete' :
                                    isFailed ? 'Campaign Paused' :
                                        'Sending Campaign...'}

                                {progress.status === 'sending' && (
                                    <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                                        LIVE
                                    </span>
                                )}
                            </h3>
                            <p className="text-slate-400 text-sm font-medium">
                                {isComplete
                                    ? `Succesfully reached ${progress.sent} customers.`
                                    : `Processed ${progress.sent} of ${progress.total} customers`}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Impact</p>
                        <p className={`text-2xl font-bold tracking-tight ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                            ₹{progress.currentRevenue.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-slate-800 w-full">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-emerald-500' :
                            isFailed ? 'bg-rose-500' :
                                'bg-gradient-to-r from-indigo-500 to-purple-500'
                            }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                {/* Log Ticker (Mini) */}
                <div className="bg-black/20 px-5 py-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono truncate max-w-md">
                        {progress.logs[progress.logs.length - 1] || 'Initializing system...'}
                    </span>
                    {isComplete && (
                        <button
                            onClick={onClose}
                            className="text-white hover:text-emerald-400 font-bold flex items-center gap-1 transition-colors"
                        >
                            CLOSE <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
