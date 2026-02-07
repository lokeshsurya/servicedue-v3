// Settings Page - Dealer Profile and API Integrations
import { useState, useEffect } from 'react';
import { User, Key, Save, Check, X, AlertCircle, Loader } from 'lucide-react';
import { apiClient } from '../lib/api';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'integrations'>('profile');

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`
                            flex items-center space-x-2 px-6 py-4 font-medium transition-colors
                            ${activeTab === 'profile'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'}
                        `}
                    >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('integrations')}
                        className={`
                            flex items-center space-x-2 px-6 py-4 font-medium transition-colors
                            ${activeTab === 'integrations'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-600 hover:text-gray-900'}
                        `}
                    >
                        <Key className="w-5 h-5" />
                        <span>Integrations</span>
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'integrations' && <IntegrationsTab />}
                </div>
            </div>
        </div>
    );
}

// Profile Tab Component
function ProfileTab() {
    const [profile, setProfile] = useState({
        dealer_name: '',
        dealer_phone: '',
        dealer_email: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await apiClient.get('/settings/profile');
            setProfile(response.data);
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setSaved(false);
        try {
            await apiClient.put('/settings/profile', profile);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dealer Name
                </label>
                <input
                    type="text"
                    value={profile.dealer_name}
                    onChange={(e) => setProfile({ ...profile, dealer_name: e.target.value })}
                    placeholder="e.g., Mr. Patil - Pune Suzuki"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    type="tel"
                    value={profile.dealer_phone}
                    onChange={(e) => setProfile({ ...profile, dealer_phone: e.target.value })}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <input
                    type="email"
                    value={profile.dealer_email}
                    onChange={(e) => setProfile({ ...profile, dealer_email: e.target.value })}
                    placeholder="dealer@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                    {saved && (
                        <span className="flex items-center text-green-600 text-sm">
                            <Check className="w-4 h-4 mr-2" />
                            Profile saved successfully!
                        </span>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>
        </div>
    );
}

// Integrations Tab Component
function IntegrationsTab() {
    const [integrations, setIntegrations] = useState({
        interakt_api_key: '',
        interakt_status: 'not_configured',
        exotel_sid: '',
        exotel_token: '',
        exotel_exophone: '',
        exotel_status: 'not_configured',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState<string | null>(null);

    useEffect(() => {
        loadIntegrations();
    }, []);

    const loadIntegrations = async () => {
        try {
            const response = await apiClient.get('/settings/integrations');
            setIntegrations(response.data);
        } catch (error) {
            console.error('Failed to load integrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiClient.put('/settings/integrations', integrations);
            alert('Integration settings saved successfully!');
            await loadIntegrations(); // Reload to get masked keys
        } catch (error) {
            console.error('Failed to save integrations:', error);
            alert('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleTestInterakt = async () => {
        setTesting('interakt');
        try {
            await apiClient.post('/settings/test/interakt', integrations.interakt_api_key);
            setIntegrations({ ...integrations, interakt_status: 'connected' });
            alert('✅ Interakt connection successful!');
        } catch (error: any) {
            setIntegrations({ ...integrations, interakt_status: 'error' });
            alert(`❌ Connection failed: ${error.response?.data?.detail || error.message}`);
        } finally {
            setTesting(null);
        }
    };

    const handleTestExotel = async () => {
        setTesting('exotel');
        try {
            await apiClient.post('/settings/test/exotel', {
                sid: integrations.exotel_sid,
                token: integrations.exotel_token
            });
            setIntegrations({ ...integrations, exotel_status: 'connected' });
            alert('✅ Exotel connection successful!');
        } catch (error: any) {
            setIntegrations({ ...integrations, exotel_status: 'error' });
            alert(`❌ Connection failed: ${error.response?.data?.detail || error.message}`);
        } finally {
            setTesting(null);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading integrations...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Interakt WhatsApp */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">WhatsApp (Interakt)</h3>
                        <p className="text-sm text-gray-600 mt-1">Send WhatsApp messages to customers</p>
                    </div>
                    <StatusBadge status={integrations.interakt_status} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            API Key
                        </label>
                        <input
                            type="text"
                            value={integrations.interakt_api_key}
                            onChange={(e) => setIntegrations({ ...integrations, interakt_api_key: e.target.value })}
                            placeholder="Enter your Interakt API key"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Get your API key from{' '}
                            <a href="https://www.interakt.shop/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                Interakt Dashboard
                            </a>
                        </p>
                    </div>

                    <button
                        onClick={handleTestInterakt}
                        disabled={testing === 'interakt' || !integrations.interakt_api_key}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {testing === 'interakt' ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>{testing === 'interakt' ? 'Testing...' : 'Test Connection'}</span>
                    </button>
                </div>
            </div>

            {/* Exotel Voice */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Voice (Exotel)</h3>
                        <p className="text-sm text-gray-600 mt-1">Make voice calls to customers</p>
                    </div>
                    <StatusBadge status={integrations.exotel_status} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">SID</label>
                        <input
                            type="text"
                            value={integrations.exotel_sid}
                            onChange={(e) => setIntegrations({ ...integrations, exotel_sid: e.target.value })}
                            placeholder="Enter your Exotel SID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Token</label>
                        <input
                            type="text"
                            value={integrations.exotel_token}
                            onChange={(e) => setIntegrations({ ...integrations, exotel_token: e.target.value })}
                            placeholder="Enter your Exotel Token"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Exophone</label>
                        <input
                            type="text"
                            value={integrations.exotel_exophone}
                            onChange={(e) => setIntegrations({ ...integrations, exotel_exophone: e.target.value })}
                            placeholder="0XXXXXXXXXX"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Get credentials from{' '}
                            <a href="https://exotel.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                                Exotel Dashboard
                            </a>
                        </p>
                    </div>

                    <button
                        onClick={handleTestExotel}
                        disabled={testing === 'exotel' || !integrations.exotel_sid || !integrations.exotel_token}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {testing === 'exotel' ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>{testing === 'exotel' ? 'Testing...' : 'Test Connection'}</span>
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
                </button>
            </div>
        </div>
    );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    const statusConfig = {
        connected: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Connected' },
        not_configured: { color: 'bg-gray-100 text-gray-600', icon: AlertCircle, label: 'Not Configured' },
        error: { color: 'bg-red-100 text-red-800', icon: X, label: 'Error' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_configured;
    const Icon = config.icon;

    return (
        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
        </span>
    );
}
