import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface RevenueTickerProps {
    isRunning: boolean;
    totalCount: number;
    onComplete: () => void;
}

export default function RevenueTicker({ isRunning, totalCount, onComplete }: RevenueTickerProps) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing...');
    const [sentCount, setSentCount] = useState(0);

    useEffect(() => {
        if (!isRunning) {
            setProgress(0);
            setSentCount(0);
            return;
        }

        // Simulate campaign progress
        const duration = 10000; // 10 seconds total
        const steps = 50;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const newProgress = (currentStep / steps) * 100;
            setProgress(newProgress);

            // Update status based on progress
            if (newProgress < 25) {
                setStatus('Initializing...');
            } else if (newProgress < 75) {
                setStatus('Sending...');
                setSentCount(Math.floor((newProgress / 100) * totalCount));
            } else if (newProgress < 100) {
                setStatus('Finalizing...');
            } else {
                setStatus('Complete!');
                setSentCount(totalCount);
            }

            if (currentStep >= steps) {
                clearInterval(timer);
                // Auto-close after 3 seconds
                setTimeout(() => {
                    onComplete();
                }, 3000);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [isRunning, totalCount, onComplete]);

    if (!isRunning && progress === 0) return null;

    const isComplete = progress >= 100;

    return (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
            } text-white rounded-lg shadow-2xl p-4 min-w-[400px] transition-all`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    {isComplete ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-bold">✅ Campaign Complete!</span>
                        </>
                    ) : (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span className="font-bold">🚀 Campaign Running...</span>
                        </>
                    )}
                </div>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>

            <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                    <span>{status}</span>
                    {progress >= 25 && progress < 100 && (
                        <span>{sentCount}/{totalCount}</span>
                    )}
                    {isComplete && (
                        <span>{totalCount} messages sent</span>
                    )}
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
