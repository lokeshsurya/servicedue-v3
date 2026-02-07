// Campaign Templates Page - Manage voice and WhatsApp campaign templates
import { useState, useEffect } from 'react';
import {
    Phone, MessageSquare, Plus, Pause, Edit3,
    Copy, Trash2, Upload, Volume2, ChevronDown, ChevronUp,
    Check, X
} from 'lucide-react';

interface CampaignTemplate {
    id: string;
    name: string;
    type: 'voice' | 'whatsapp';
    segment: string;
    is_default: boolean;
    whatsapp_message?: string;
    voice_script?: string;
    audio_url?: string;
    created_at: string;
    updated_at: string;
}

const SEGMENT_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    '1ST_FREE': { icon: '🟢', label: '1st Free Service', color: 'bg-emerald-100 text-emerald-700' },
    '2ND_FREE': { icon: '🟢', label: '2nd Free Service', color: 'bg-emerald-100 text-emerald-700' },
    '3RD_FREE': { icon: '🟢', label: '3rd Free Service', color: 'bg-emerald-100 text-emerald-700' },
    'PAID_DUE': { icon: '🔵', label: 'Paid Service', color: 'bg-blue-100 text-blue-700' },
    'PAID_RISK': { icon: '🟠', label: 'At Risk', color: 'bg-orange-100 text-orange-700' },
    'LOST': { icon: '🔴', label: 'Lost Customer', color: 'bg-red-100 text-red-700' },
    'ALL': { icon: '🎯', label: 'All Segments', color: 'bg-purple-100 text-purple-700' },
};

export default function CampaignTemplates() {
    const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'voice' | 'whatsapp'>('voice');
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null);
    const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/templates');
            const data = await response.json();
            setTemplates(data.templates || []);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/templates/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTemplates(templates.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const handleDuplicate = async (template: CampaignTemplate) => {
        try {
            const response = await fetch('http://localhost:8000/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${template.name} (Copy)`,
                    type: template.type,
                    segment: template.segment,
                    whatsapp_message: template.whatsapp_message,
                    voice_script: template.voice_script,
                    audio_url: template.audio_url
                })
            });
            if (response.ok) {
                fetchTemplates();
            }
        } catch (error) {
            console.error('Failed to duplicate:', error);
        }
    };

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedTemplates);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedTemplates(newExpanded);
    };

    const filteredTemplates = templates.filter(t => t.type === activeTab);
    const defaultTemplates = filteredTemplates.filter(t => t.is_default);
    const customTemplates = filteredTemplates.filter(t => !t.is_default);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800">Campaign Templates</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your voice and WhatsApp campaign templates</p>
                </div>
                <button
                    onClick={() => { setEditingTemplate(null); setShowCreateModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('voice')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'voice'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <Phone className="w-4 h-4" />
                    Voice Campaigns
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                        {templates.filter(t => t.type === 'voice').length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'whatsapp'
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Campaigns
                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                        {templates.filter(t => t.type === 'whatsapp').length}
                    </span>
                </button>
            </div>

            {/* Default Templates */}
            <div className="mb-8">
                <h2 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">
                    Ready-Made Templates
                </h2>
                <div className="space-y-3">
                    {defaultTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            isExpanded={expandedTemplates.has(template.id)}
                            isPlaying={playingAudio === template.id}
                            onToggleExpand={() => toggleExpand(template.id)}
                            onPlayAudio={() => setPlayingAudio(playingAudio === template.id ? null : template.id)}
                            onEdit={() => { setEditingTemplate(template); setShowCreateModal(true); }}
                            onDuplicate={() => handleDuplicate(template)}
                            onDelete={() => handleDelete(template.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Custom Templates */}
            <div>
                <h2 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">
                    Custom Templates
                </h2>
                {customTemplates.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                        <div className="text-3xl mb-2">✨</div>
                        <h3 className="font-medium text-slate-700 mb-1">No custom templates yet</h3>
                        <p className="text-sm text-slate-500 mb-4">Create your own campaign templates for special offers</p>
                        <button
                            onClick={() => { setEditingTemplate(null); setShowCreateModal(true); }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                            Create Your First Template
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {customTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isExpanded={expandedTemplates.has(template.id)}
                                isPlaying={playingAudio === template.id}
                                onToggleExpand={() => toggleExpand(template.id)}
                                onPlayAudio={() => setPlayingAudio(playingAudio === template.id ? null : template.id)}
                                onEdit={() => { setEditingTemplate(template); setShowCreateModal(true); }}
                                onDuplicate={() => handleDuplicate(template)}
                                onDelete={() => handleDelete(template.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <CreateTemplateModal
                    template={editingTemplate}
                    activeTab={activeTab}
                    onClose={() => { setShowCreateModal(false); setEditingTemplate(null); }}
                    onSave={() => { fetchTemplates(); setShowCreateModal(false); setEditingTemplate(null); }}
                />
            )}
        </div>
    );
}

// Template Card Component
interface TemplateCardProps {
    template: CampaignTemplate;
    isExpanded: boolean;
    isPlaying: boolean;
    onToggleExpand: () => void;
    onPlayAudio: () => void;
    onEdit: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

function TemplateCard({ template, isExpanded, isPlaying, onToggleExpand, onPlayAudio, onEdit, onDuplicate, onDelete }: TemplateCardProps) {
    const segmentConfig = SEGMENT_CONFIG[template.segment] || SEGMENT_CONFIG['ALL'];

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={onToggleExpand}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{segmentConfig.icon}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-800">{template.name}</h3>
                            {template.is_default && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">Default</span>
                            )}
                        </div>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${segmentConfig.color}`}>
                            {segmentConfig.label}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {template.type === 'voice' && template.audio_url && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onPlayAudio(); }}
                            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-slate-100 p-4 bg-slate-50">
                    {/* Message/Script Preview */}
                    {template.type === 'whatsapp' && template.whatsapp_message && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 mb-1">WhatsApp Message</label>
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-slate-700">
                                {template.whatsapp_message}
                            </div>
                        </div>
                    )}

                    {template.type === 'voice' && template.voice_script && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Voice Script</label>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-slate-700">
                                {template.voice_script}
                            </div>
                        </div>
                    )}

                    {/* Audio Player */}
                    {template.type === 'voice' && template.audio_url && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-500 mb-1">Audio File</label>
                            <audio
                                controls
                                src={`http://localhost:8000${template.audio_url}`}
                                className="w-full h-10"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
                        >
                            <Edit3 className="w-3 h-3" />
                            Edit
                        </button>
                        <button
                            onClick={onDuplicate}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
                        >
                            <Copy className="w-3 h-3" />
                            Duplicate
                        </button>
                        {!template.is_default && (
                            <button
                                onClick={onDelete}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors"
                            >
                                <Trash2 className="w-3 h-3" />
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Create/Edit Template Modal
interface CreateTemplateModalProps {
    template: CampaignTemplate | null;
    activeTab: 'voice' | 'whatsapp';
    onClose: () => void;
    onSave: () => void;
}

function CreateTemplateModal({ template, activeTab, onClose, onSave }: CreateTemplateModalProps) {
    const [formData, setFormData] = useState({
        name: template?.name || '',
        type: template?.type || activeTab,
        segment: template?.segment || 'ALL',
        whatsapp_message: template?.whatsapp_message || '',
        voice_script: template?.voice_script || '',
        audio_url: template?.audio_url || ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleUploadAudio = async (file: File) => {
        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            const response = await fetch('http://localhost:8000/api/templates/upload-audio', {
                method: 'POST',
                body: formDataUpload
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, audio_url: data.url }));
            }
        } catch (error) {
            console.error('Failed to upload:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const url = template
                ? `http://localhost:8000/api/templates/${template.id}`
                : 'http://localhost:8000/api/templates';

            const response = await fetch(url, {
                method: template ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                onSave();
            }
        } catch (error) {
            console.error('Failed to save:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {template ? 'Edit Template' : 'Create New Template'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Template Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Diwali Special Offer"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Type</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, type: 'voice' }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${formData.type === 'voice'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'border-slate-200 text-slate-600'
                                    }`}
                            >
                                <Phone className="w-4 h-4" />
                                Voice Call
                            </button>
                            <button
                                onClick={() => setFormData(prev => ({ ...prev, type: 'whatsapp' }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border transition-colors ${formData.type === 'whatsapp'
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : 'border-slate-200 text-slate-600'
                                    }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Segment */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target Segment</label>
                        <select
                            value={formData.segment}
                            onChange={(e) => setFormData(prev => ({ ...prev, segment: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Segments</option>
                            <option value="1ST_FREE">1st Free Service</option>
                            <option value="2ND_FREE">2nd Free Service</option>
                            <option value="3RD_FREE">3rd Free Service</option>
                            <option value="PAID_DUE">Paid Service Due</option>
                            <option value="PAID_RISK">At Risk</option>
                            <option value="LOST">Lost Customer</option>
                        </select>
                    </div>

                    {/* Voice Fields */}
                    {formData.type === 'voice' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Voice Script</label>
                                <textarea
                                    value={formData.voice_script}
                                    onChange={(e) => setFormData(prev => ({ ...prev, voice_script: e.target.value }))}
                                    placeholder="Namaste {name} ji, ..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-slate-400 mt-1">Variables: {'{name}'}, {'{bike_model}'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Audio File</label>
                                {formData.audio_url ? (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                        <Volume2 className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 flex-1">{formData.audio_url}</span>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, audio_url: '' }))}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
                                        <Upload className="w-5 h-5 text-slate-400" />
                                        <span className="text-sm text-slate-500">
                                            {uploading ? 'Uploading...' : 'Upload MP3 or WAV'}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".mp3,.wav,.ogg"
                                            className="hidden"
                                            onChange={(e) => e.target.files?.[0] && handleUploadAudio(e.target.files[0])}
                                        />
                                    </label>
                                )}
                            </div>
                        </>
                    )}

                    {/* WhatsApp Fields */}
                    {formData.type === 'whatsapp' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp Message</label>
                            <textarea
                                value={formData.whatsapp_message}
                                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_message: e.target.value }))}
                                placeholder="🎁 {name} ji, ..."
                                rows={4}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-400 mt-1">Variables: {'{name}'}, {'{bike_model}'}, {'{link}'}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData.name}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                            <Check className="w-4 h-4" />
                        )}
                        {template ? 'Save Changes' : 'Create Template'}
                    </button>
                </div>
            </div>
        </div>
    );
}
