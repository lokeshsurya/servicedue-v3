// Sidebar Navigation - Minecloud Style
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Megaphone,
    Send,
    Target,
    Settings as SettingsIcon,
    Upload,
    ChevronDown,
    Zap,
    FileText
} from 'lucide-react';

interface QuickStats {
    total_eligible: number;
    potential_revenue: number;
}

export default function Sidebar() {
    const [stats, setStats] = useState<QuickStats | null>(null);

    useEffect(() => {
        // Fetch quick stats
        fetch('http://localhost:8000/api/selection/recommendation')
            .then(res => res.json())
            .then(data => setStats({
                total_eligible: data.total_eligible || 0,
                potential_revenue: data.potential_revenue || 0
            }))
            .catch(() => setStats({ total_eligible: 0, potential_revenue: 0 }));
    }, []);

    const mainNav = [
        { id: 'dashboard', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'history', path: '/campaigns', icon: Megaphone, label: 'History' },
        { id: 'templates', path: '/templates', icon: FileText, label: 'Templates' },
        { id: 'customers', path: '/customers', icon: Users, label: 'Customers' },
        { id: 'smart-campaign', path: '/smart-campaign', icon: Target, label: 'Smart Campaign' },
        { id: 'broadcast', path: '/broadcast', icon: Send, label: 'Broadcast' },
    ];

    const utilityNav = [
        { id: 'upload', path: '/upload', icon: Upload, label: 'Upload Data' },
        { id: 'settings', path: '/settings', icon: SettingsIcon, label: 'Settings' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-slate-200 flex flex-col z-50">
            {/* Logo */}
            <div className="h-16 px-5 flex items-center border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 p-1.5 shadow-sm">
                        <img
                            src="/logo-icon.png"
                            alt="ServiceDue"
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-slate-800">ServiceDue</p>
                        <p className="text-[11px] text-slate-500">Revenue Intelligence OS</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {/* Dashboard with dropdown indicator */}
                <NavLink
                    to="/"
                    className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                        ${isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-100'
                        }
                    `}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="flex-1">Dashboard</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </NavLink>

                {/* Other Nav Items */}
                {mainNav.slice(1).map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Utility Navigation */}
            <div className="px-3 py-4 border-t border-slate-100 space-y-1">
                {utilityNav.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>

            {/* Quick Stats Card */}
            <NavLink
                to="/"
                className="mx-3 mb-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">Today's Opportunity</span>
                </div>
                <p className="text-lg font-bold text-slate-800">
                    {stats?.total_eligible || 0} <span className="text-sm font-normal text-slate-500">customers</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    ₹{((stats?.potential_revenue || 0) / 1000).toFixed(0)}K potential revenue
                </p>
            </NavLink>
        </aside>
    );
}

