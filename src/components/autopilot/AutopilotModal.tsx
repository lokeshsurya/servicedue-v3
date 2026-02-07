// Autopilot Settings Modal Component
import { useState, useEffect } from 'react';
import { X, Settings, Calendar, Users } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface AutopilotSettings {
    enabled: boolean;
    warranty_enabled: boolean;
    warranty_max_customers: number;
    routine_enabled: boolean;
    routine_max_customers: number;
    winback_enabled: boolean;
    winback_max_customers: number;
    email_notifications: boolean;
    notification_email: string | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (enabled: boolean) => void;
}

export default function AutopilotModal({ isOpen, onClose, onSave }: Props) {
    const [settings, setSettings] = useState<AutopilotSettings>({
        enabled: false,
        warranty_enabled: true,
        warranty_max_customers: 50,
        routine_enabled: true,
        routine_max_customers: 100,
        winback_enabled: false,
        winback_max_customers: 30,
        email_notifications: true,
        notification_email: null
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/autopilot/settings');
            setSettings(response.data);
        } catch (error) {
            console.error('Failed to load autopilot settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (enabled: boolean) => {
        setSaving(true);
        try {
            await apiClient.post('/autopilot/toggle', { enabled });
            setSettings(prev => ({ ...prev, enabled }));
            onSave(enabled);
        } catch (error) {
            console.error('Failed to toggle autopilot:', error);
            alert('Failed to toggle autopilot. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await apiClient.put('/autopilot/settings', settings);
            onSave(settings.enabled);
            onClose();
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Settings className="w-6 h-6 text-purple-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Autopilot Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading settings...</div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Master Toggle */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Enable Autopilot</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Run campaigns automatically based on the schedule below
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggle(!settings.enabled)}
                                    disabled={saving}
                                    className={`
                                        relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                                        ${settings.enabled ? 'bg-purple-600' : 'bg-gray-300'}
                                        ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    <span
                                        className={`
                                            inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                                            ${settings.enabled ? 'translate-x-7' : 'translate-x-1'}
                                        `}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Segment Settings */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Campaign Schedules
                            </h3>

                            {/* Warranty Guard */}
                            <SegmentCard
                                title="Warranty Guard"
                                subtitle="1ST_FREE customers"
                                schedule="Every day at 9:00 AM"
                                enabled={settings.warranty_enabled}
                                maxCustomers={settings.warranty_max_customers}
                                onToggle={(enabled) => setSettings(prev => ({ ...prev, warranty_enabled: enabled }))}
                                onMaxChange={(max) => setSettings(prev => ({ ...prev, warranty_max_customers: max }))}
                                color="orange"
                            />

                            {/* Routine Service */}
                            <SegmentCard
                                title="Routine Service"
                                subtitle="PAID_ROUTINE customers"
                                schedule="Every Monday at 9:00 AM"
                                enabled={settings.routine_enabled}
                                maxCustomers={settings.routine_max_customers}
                                onToggle={(enabled) => setSettings(prev => ({ ...prev, routine_enabled: enabled }))}
                                onMaxChange={(max) => setSettings(prev => ({ ...prev, routine_max_customers: max }))}
                                color="blue"
                            />

                            {/* Win-Back */}
                            <SegmentCard
                                title="Win-Back"
                                subtitle="RISK_LOST customers"
                                schedule="Every Friday at 9:00 AM"
                                enabled={settings.winback_enabled}
                                maxCustomers={settings.winback_max_customers}
                                onToggle={(enabled) => setSettings(prev => ({ ...prev, winback_enabled: enabled }))}
                                onMaxChange={(max) => setSettings(prev => ({ ...prev, winback_max_customers: max }))}
                                color="red"
                            />
                        </div>

                        {/* Notification Settings */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={settings.email_notifications}
                                    onChange={(e) => setSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                                    <p className="text-sm text-gray-500 mt-1">Get notified when campaigns complete</p>
                                    {settings.email_notifications && (
                                        <input
                                            type="email"
                                            value={settings.notification_email || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, notification_email: e.target.value }))}
                                            placeholder="your@email.com"
                                            className="mt-2 px-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Segment Settings Card Component
interface SegmentCardProps {
    title: string;
    subtitle: string;
    schedule: string;
    enabled: boolean;
    maxCustomers: number;
    onToggle: (enabled: boolean) => void;
    onMaxChange: (max: number) => void;
    color: 'orange' | 'blue' | 'red';
}

function SegmentCard({ title, subtitle, schedule, enabled, maxCustomers, onToggle, onMaxChange, color }: SegmentCardProps) {
    const colorClasses = {
        orange: 'border-orange-200 bg-orange-50',
        blue: 'border-blue-200 bg-blue-50',
        red: 'border-red-200 bg-red-50'
    };

    return (
        <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{title}</h4>
                    <p className="text-sm text-gray-600">{subtitle}</p>
                </div>
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onToggle(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
            </div>

            {enabled && (
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <label className="text-sm text-gray-700">Max customers:</label>
                        <input
                            type="number"
                            value={maxCustomers}
                            onChange={(e) => onMaxChange(parseInt(e.target.value) || 0)}
                            min="1"
                            max="500"
                            className="px-3 py-1 border border-gray-300 rounded w-20 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
