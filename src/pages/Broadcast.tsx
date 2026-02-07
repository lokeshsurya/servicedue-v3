// Enterprise Broadcast System - Twilio-like Campaign Launcher
import { useState, useEffect, useRef } from 'react';
import {
    Send, Phone, MessageSquare, Users, Upload, X,
    CheckCircle2, Image, FileText, Video,
    Zap, FileSpreadsheet, Trash2
} from 'lucide-react';

interface Template {
    id: string;
    name: string;
    channel: 'voice' | 'whatsapp';
    segment: string;
    message_template?: string;
    audio_url?: string;
    is_default: boolean;
}

interface UploadedList {
    phones: string[];
    names: string[];
    total_count: number;
    preview: { phone: string; name: string }[];
}

export default function Broadcast() {
    // Channel & Mode
    const [channel, setChannel] = useState<'whatsapp' | 'voice'>('whatsapp');
    const [audienceMode, setAudienceMode] = useState<'segment' | 'upload' | 'manual'>('segment');

    // Audience
    const [segment, setSegment] = useState('all');
    const [uploadedList, setUploadedList] = useState<UploadedList | null>(null);
    const [manualPhones, setManualPhones] = useState('');
    const [uploading, setUploading] = useState(false);

    // Message
    const [useTemplate, setUseTemplate] = useState(true);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [customMessage, setCustomMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);

    // Preview & Send
    const [preview, setPreview] = useState<{ total_recipients: number; estimated_cost_whatsapp: number; estimated_cost_voice: number } | null>(null);
    const [sending, setSending] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [campaignName, setCampaignName] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    // Segment options
    const segments = [
        { value: 'all', label: 'All Customers', icon: '👥', desc: 'Everyone eligible' },
        { value: 'LOST', label: 'Lost Customers', icon: '🔴', desc: '₹2,500 avg value' },
        { value: 'PAID_RISK', label: 'At Risk', icon: '🟠', desc: '₹1,800 avg value' },
        { value: 'PAID_DUE', label: 'Service Due', icon: '🟡', desc: '₹1,500 avg value' },
        { value: '1ST_FREE', label: '1st Free Service', icon: '🟢', desc: 'Warranty customers' },
        { value: '2ND_FREE', label: '2nd Free Service', icon: '🟢', desc: 'Warranty customers' },
        { value: '3RD_FREE', label: '3rd Free Service', icon: '🟢', desc: 'Warranty customers' },
    ];

    // Load templates
    useEffect(() => {
        fetch('http://localhost:8000/api/templates')
            .then(res => res.json())
            .then(data => setTemplates(data.templates || []))
            .catch(console.error);
    }, []);

    // Load preview when segment changes
    useEffect(() => {
        if (audienceMode === 'segment') {
            const url = segment === 'all'
                ? 'http://localhost:8000/api/broadcast/preview'
                : `http://localhost:8000/api/broadcast/preview?segment_filter=${segment}`;
            fetch(url)
                .then(res => res.json())
                .then(data => setPreview(data))
                .catch(console.error);
        }
    }, [segment, audienceMode]);

    // Handle Excel upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/broadcast/upload-list', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedList(data);
                setAudienceMode('upload');
            } else {
                const error = await response.json();
                alert('Upload failed: ' + (error.detail || 'Unknown error'));
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    // Get recipient count
    const getRecipientCount = () => {
        if (audienceMode === 'segment') return preview?.total_recipients || 0;
        if (audienceMode === 'upload') return uploadedList?.total_count || 0;
        if (audienceMode === 'manual') {
            const phones = manualPhones.split(/[,\n]/).filter(p => p.trim().length >= 10);
            return phones.length;
        }
        return 0;
    };

    // Get cost estimate
    const getCost = () => {
        const count = getRecipientCount();
        return channel === 'voice' ? count * 1.5 : count * 0.7;
    };

    // Get message content
    const getMessage = () => {
        if (useTemplate && selectedTemplate) {
            return selectedTemplate.message_template || '[Audio Template]';
        }
        return customMessage;
    };

    // Handle send
    const handleSend = async () => {
        setSending(true);
        try {
            let phoneNumbers: string[] = [];

            if (audienceMode === 'upload' && uploadedList) {
                phoneNumbers = uploadedList.phones;
            } else if (audienceMode === 'manual') {
                phoneNumbers = manualPhones.split(/[,\n]/)
                    .map(p => p.trim().replace(/\D/g, '').slice(-10))
                    .filter(p => p.length === 10);
            }

            const body: any = {
                message: getMessage(),
                channel,
                campaign_name: campaignName || undefined,
                template_id: useTemplate ? selectedTemplate?.id : undefined,
            };

            if (audienceMode === 'segment') {
                body.segment_filter = segment;
            } else {
                body.phone_numbers = phoneNumbers;
            }

            const response = await fetch('http://localhost:8000/api/broadcast/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (response.ok) {
                setShowConfirm(false);
                alert(`✅ Campaign Launched!\n\n${data.message}\nCampaign: ${data.campaign_name}`);
                // Reset
                setSelectedTemplate(null);
                setCustomMessage('');
                setUploadedList(null);
                setManualPhones('');
                setCampaignName('');
            } else {
                alert('Failed: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            console.error('Failed:', error);
            alert('Failed to launch campaign');
        } finally {
            setSending(false);
        }
    };

    // Filter templates by channel
    const filteredTemplates = templates.filter(t => t.channel === channel);

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 mb-1">Broadcast Campaign</h1>
                    <p className="text-slate-500 text-sm">Send bulk messages or voice calls to customers</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { setChannel('whatsapp'); setSelectedTemplate(null); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${channel === 'whatsapp'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <MessageSquare className="w-5 h-5" />
                        WhatsApp
                    </button>
                    <button
                        onClick={() => { setChannel('voice'); setSelectedTemplate(null); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${channel === 'voice'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <Phone className="w-5 h-5" />
                        Voice Call
                    </button>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-12 gap-6">
                {/* Column 1: Audience Selection */}
                <div className="col-span-4 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Select Audience
                        </h2>

                        {/* Mode Tabs */}
                        <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg">
                            {[
                                { id: 'segment', label: 'Segments', icon: Users },
                                { id: 'upload', label: 'Upload', icon: Upload },
                                { id: 'manual', label: 'Manual', icon: FileText },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setAudienceMode(mode.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${audienceMode === mode.id
                                        ? 'bg-white text-slate-800 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <mode.icon className="w-3.5 h-3.5" />
                                    {mode.label}
                                </button>
                            ))}
                        </div>

                        {/* Segment Mode */}
                        {audienceMode === 'segment' && (
                            <div className="space-y-2">
                                {segments.map((seg) => (
                                    <button
                                        key={seg.value}
                                        onClick={() => setSegment(seg.value)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${segment === seg.value
                                            ? 'bg-blue-50 border-2 border-blue-500'
                                            : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                                            }`}
                                    >
                                        <span className="text-xl">{seg.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-700">{seg.label}</p>
                                            <p className="text-xs text-slate-400">{seg.desc}</p>
                                        </div>
                                        {segment === seg.value && (
                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Upload Mode */}
                        {audienceMode === 'upload' && (
                            <div>
                                {!uploadedList ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                                        ) : (
                                            <>
                                                <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-slate-600 mb-1">Drop Excel or CSV file</p>
                                                <p className="text-xs text-slate-400">Include column: Phone, Mobile, or Contact</p>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                <span className="text-sm font-medium text-green-700">
                                                    {uploadedList.total_count} contacts loaded
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setUploadedList(null)}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-xs text-slate-500 mb-2">Preview:</div>
                                        <div className="space-y-1">
                                            {uploadedList.preview.map((row, idx) => (
                                                <div key={idx} className="flex justify-between text-xs bg-slate-50 px-3 py-2 rounded">
                                                    <span className="text-slate-600">{row.name || 'Customer'}</span>
                                                    <span className="text-slate-400">{row.phone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Manual Mode */}
                        {audienceMode === 'manual' && (
                            <div>
                                <textarea
                                    value={manualPhones}
                                    onChange={(e) => setManualPhones(e.target.value)}
                                    placeholder="Enter phone numbers, one per line or comma-separated&#10;&#10;Example:&#10;9876543210&#10;9876543211, 9876543212"
                                    rows={8}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    {manualPhones.split(/[,\n]/).filter(p => p.trim().length >= 10).length} valid numbers detected
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Message Composer */}
                <div className="col-span-5 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {channel === 'voice' ? 'Voice Script' : 'Message'}
                            </h2>
                            <button
                                onClick={() => setUseTemplate(!useTemplate)}
                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${useTemplate
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {useTemplate ? '✓ Using Template' : 'Write Custom'}
                            </button>
                        </div>

                        {useTemplate ? (
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                {filteredTemplates.length === 0 ? (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500 mb-1">No templates found</p>
                                        <p className="text-xs text-slate-400">Create templates in the Templates page</p>
                                    </div>
                                ) : (
                                    filteredTemplates.map((template) => (
                                        <button
                                            key={template.id}
                                            onClick={() => setSelectedTemplate(template)}
                                            className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all ${selectedTemplate?.id === template.id
                                                ? 'bg-blue-50 border-2 border-blue-500'
                                                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${channel === 'voice' ? 'bg-blue-100' : 'bg-green-100'
                                                }`}>
                                                {channel === 'voice'
                                                    ? <Phone className="w-5 h-5 text-blue-600" />
                                                    : <MessageSquare className="w-5 h-5 text-green-600" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700">{template.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                                    {template.segment}
                                                </p>
                                                {template.message_template && (
                                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                                        {template.message_template}
                                                    </p>
                                                )}
                                            </div>
                                            {selectedTemplate?.id === template.id && (
                                                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    placeholder={channel === 'voice'
                                        ? "Enter script for text-to-speech conversion..."
                                        : "Type your WhatsApp message...\n\nUse {{name}} for customer name"
                                    }
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>{customMessage.length} / 1000 characters</span>
                                    <div className="flex gap-2">
                                        <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">{'{{name}}'}</button>
                                        <button className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200">{'{{bike}}'}</button>
                                    </div>
                                </div>

                                {/* Attachments for WhatsApp */}
                                {channel === 'whatsapp' && (
                                    <div className="pt-3 border-t border-slate-100">
                                        <p className="text-xs text-slate-500 mb-2">Attachment (optional)</p>
                                        <div className="flex gap-2">
                                            <input
                                                ref={attachmentInputRef}
                                                type="file"
                                                accept="image/*,video/*,.pdf"
                                                className="hidden"
                                                onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                                            />
                                            <button
                                                onClick={() => attachmentInputRef.current?.click()}
                                                className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                                            >
                                                <Image className="w-4 h-4" />
                                                Image
                                            </button>
                                            <button
                                                onClick={() => attachmentInputRef.current?.click()}
                                                className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                                            >
                                                <Video className="w-4 h-4" />
                                                Video
                                            </button>
                                            <button
                                                onClick={() => attachmentInputRef.current?.click()}
                                                className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
                                            >
                                                <FileText className="w-4 h-4" />
                                                PDF
                                            </button>
                                        </div>
                                        {attachment && (
                                            <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 rounded-lg">
                                                <span className="text-sm text-blue-700">📎 {attachment.name}</span>
                                                <button onClick={() => setAttachment(null)} className="ml-auto text-slate-400 hover:text-red-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Preview & Launch */}
                <div className="col-span-3 space-y-4">
                    {/* Phone Preview */}
                    <div className={`rounded-2xl p-4 ${channel === 'voice' ? 'bg-blue-50' : 'bg-green-50'}`}>
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                                {channel === 'voice'
                                    ? <Phone className="w-4 h-4 text-blue-600" />
                                    : <MessageSquare className="w-4 h-4 text-green-600" />
                                }
                                <span className="text-xs font-medium text-slate-600">
                                    {channel === 'voice' ? 'Voice Call' : 'WhatsApp Preview'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                {getMessage() || (
                                    <span className="text-slate-400 italic">
                                        {useTemplate ? 'Select a template' : 'Enter your message'}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Campaign Summary</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Channel</span>
                                <span className="font-medium text-slate-800 flex items-center gap-1">
                                    {channel === 'voice' ? <Phone className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                    {channel === 'voice' ? 'Voice Call' : 'WhatsApp'}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Recipients</span>
                                <span className="font-bold text-slate-800">{getRecipientCount()}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Audience</span>
                                <span className="font-medium text-slate-800 capitalize">{audienceMode}</span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Estimated Cost</span>
                                <span className="font-bold text-lg text-slate-800">₹{getCost().toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Name */}
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Campaign name (optional)"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Launch Button */}
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={
                            getRecipientCount() === 0 ||
                            (useTemplate && !selectedTemplate) ||
                            (!useTemplate && !customMessage.trim())
                        }
                        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${channel === 'voice'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-200'
                            : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200'
                            }`}
                    >
                        <Zap className="w-5 h-5" />
                        Launch Campaign
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${channel === 'voice' ? 'bg-blue-100' : 'bg-green-100'
                                }`}>
                                {channel === 'voice'
                                    ? <Phone className="w-7 h-7 text-blue-600" />
                                    : <MessageSquare className="w-7 h-7 text-green-600" />
                                }
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Ready to Launch?</h3>
                                <p className="text-sm text-slate-500">This will start sending immediately</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Recipients</span>
                                <span className="font-bold text-slate-800">{getRecipientCount()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Channel</span>
                                <span className="font-medium">{channel === 'voice' ? '📞 Voice Call' : '💬 WhatsApp'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Template</span>
                                <span className="font-medium truncate max-w-[150px]">
                                    {useTemplate ? selectedTemplate?.name : 'Custom Message'}
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Estimated Cost</span>
                                <span className="font-bold text-lg text-slate-800">₹{getCost().toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className={`flex-1 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 ${channel === 'voice'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {sending ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Launching...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Launch Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
