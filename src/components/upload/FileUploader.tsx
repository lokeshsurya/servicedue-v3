import { useState, useRef, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Zap, Brain, X, ArrowRight, Keyboard, Database } from 'lucide-react';
import { uploadExcel } from '../../lib/api';

interface UploadStats {
    total_uploaded: number;
    valid_leads: number;
    rejected: number;
    inserted: number;
}

interface UploadResponse {
    success: boolean;
    message: string;
    stats: UploadStats;
    segments: Record<string, number>;
    actionable_leads: number;
}

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [processingStage, setProcessingStage] = useState('');
    const [result, setResult] = useState<UploadResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    }, []);

    const validateAndSetFile = (file: File) => {
        if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.type === "application/vnd.ms-excel" ||
            file.name.endsWith('.xlsx') ||
            file.name.endsWith('.xls')) {
            setFile(file);
            setResult(null);
            setError(null);
        } else {
            setError("Please upload a valid Excel file (.xlsx or .xls)");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const handleBoxClick = () => {
        if (inputRef.current && !file) {
            inputRef.current.click();
        }
    };

    const simulateProgress = () => {
        setProgress(0);
        const stages = [
            "Reading file structure...",
            "Validating phone numbers...",
            "Calculating vehicle age...",
            "Checking service history...",
            "Segmenting customers...",
            "Finalizing brain ingestion..."
        ];

        let step = 0;
        const interval = setInterval(() => {
            if (step >= stages.length) {
                clearInterval(interval);
                return;
            }
            setProcessingStage(stages[step]);
            setProgress(prev => Math.min(prev + 15, 90));
            step++;
        }, 500); // 3 seconds total simulation
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        simulateProgress();

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await uploadExcel(file);
            setProgress(100);
            setProcessingStage("Complete!");
            setTimeout(() => {
                setResult(response);
                setUploading(false);
            }, 500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Upload failed. Please try again.');
            setUploading(false);
        }
    };

    const resetUpload = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setProgress(0);
        setProcessingStage('');
    };

    return (
        <div className="max-w-4xl mx-auto py-12">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4">
                    <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Feed the Brain</h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                    Upload your raw customer data. Our AI will clean, segment, and identify revenue opportunities automatically.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
                {!result ? (
                    <div className="p-10">
                        {/* Drag & Drop Zone */}
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${dragActive
                                    ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]'
                                    : file
                                        ? 'border-emerald-500 bg-emerald-50/30 cursor-default'
                                        : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={handleBoxClick}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {!file ? (
                                <div className="space-y-4 pointer-events-none">
                                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Upload className="w-10 h-10 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-slate-900">
                                            Drop your Excel file here or Click to Browse
                                        </p>
                                        <p className="text-slate-500 mt-2">
                                            We'll handle the formatting automatically.
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest pt-4">
                                        Supports .xlsx, .xls
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6 relative z-10">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                        <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold text-slate-900">{file.name}</p>
                                        <p className="text-slate-500 font-medium">
                                            {(file.size / 1024).toFixed(2)} KB • Ready to process
                                        </p>
                                    </div>

                                    {!uploading && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFile(null);
                                            }}
                                            className="absolute top-0 right-0 p-2 text-slate-400 hover:text-rose-500 transition-colors bg-white/50 rounded-full hover:bg-white"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar (Visible during upload) */}
                        {uploading && (
                            <div className="mt-8 space-y-3 animate-in fade-in duration-300">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-indigo-600">{processingStage}</span>
                                    <span className="text-slate-500">{progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Upload Button */}
                        {file && !uploading && !error && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpload();
                                }}
                                className="mt-8 w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-center space-x-2"
                            >
                                <Zap className="w-5 h-5 text-amber-400" />
                                <span>Process Data with Brain</span>
                            </button>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center text-rose-700 animate-in shake">
                                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {/* Alternative Options Divider */}
                        {!file && !uploading && (
                            <div className="mt-10">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-white text-slate-400 font-medium">OR ADD DATA MANUALLY</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => alert("Manual entry form coming soon! This will allow adding single customers.")}
                                        className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
                                    >
                                        <div className="p-2 bg-slate-100 rounded-lg mr-4">
                                            <Keyboard className="w-5 h-5 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">Manual Entry</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Add single customer</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => alert("DMS Integration coming soon! Connect directly to your existing software.")}
                                        className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-left group"
                                    >
                                        <div className="p-2 bg-indigo-50 rounded-lg mr-4 group-hover:bg-indigo-100 transition-colors">
                                            <Database className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">DMS Connect</p>
                                            <p className="text-xs text-slate-500 mt-0.5">Sync with AutoDAP/Other</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Success State (Post-Processing Report) */
                    <div className="bg-slate-50">
                        {/* Success Header */}
                        <div className="bg-white p-10 text-center border-b border-slate-100">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Ingestion Complete!</h2>
                            <p className="text-slate-600 max-w-lg mx-auto">
                                The Brain has successfully processed your file and identified new revenue opportunities.
                            </p>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 bg-white">
                            <div className="p-8 text-center">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Processed</p>
                                <p className="text-4xl font-bold text-slate-900">{result.stats.total_uploaded}</p>
                            </div>
                            <div className="p-8 text-center">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Actionable Leads</p>
                                <p className="text-4xl font-bold text-emerald-600">{result.actionable_leads}</p>
                            </div>
                        </div>

                        {/* Segment Breakdown */}
                        <div className="p-10">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Segment Identification</h3>
                            <div className="space-y-4">
                                {Object.entries(result.segments).map(([key, count]) => {
                                    if (count === 0) return null;
                                    let color = "bg-slate-100 text-slate-600";
                                    let label = key;

                                    if (key === '1ST_FREE') { color = "bg-amber-100 text-amber-700"; label = "🟠 Urgent Warranty (1st Free)"; }
                                    if (key === 'PAID_ROUTINE') { color = "bg-indigo-100 text-indigo-700"; label = "🔵 Routine Service"; }
                                    if (key === 'RISK_LOST') { color = "bg-rose-100 text-rose-700"; label = "🔴 Risk / Win-Back"; }
                                    if (key === 'SAFE') { color = "bg-emerald-100 text-emerald-700"; label = "🟢 Safe (Recently Serviced)"; }

                                    return (
                                        <div key={key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${color}`}>
                                                    {count}
                                                </span>
                                                <span className="font-medium text-slate-700">{label}</span>
                                            </div>
                                            <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-slate-400"
                                                    style={{ width: `${(count / result.stats.total_uploaded) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-10 flex space-x-4">
                                <button
                                    onClick={resetUpload}
                                    className="flex-1 px-6 py-4 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-white hover:border-slate-400 transition-colors"
                                >
                                    Upload Another
                                </button>
                                <button
                                    className="flex-[2] px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                                    onClick={() => window.location.reload()} // Quick hack to go home or clear state
                                >
                                    <span>View Action Plan</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Privacy Note */}
            <p className="text-center text-slate-400 text-xs mt-8">
                Your data is encrypted and processed locally by ServiceDue Brain.
            </p>
        </div>
    );
}
