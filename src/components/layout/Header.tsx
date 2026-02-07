// Header Component - Simplified
import { Search, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Get current page title from path
    const getPageTitle = () => {
        const path = location.pathname;
        const titles: Record<string, string> = {
            '/': 'Dashboard',
            '/campaigns': 'Campaign History',
            '/templates': 'Templates',
            '/customers': 'Customers',
            '/smart-campaign': 'Smart Campaign',
            '/broadcast': 'Broadcast',
            '/settings': 'Settings',
            '/upload': 'Upload Data',
        };
        return titles[path] || 'ServiceDue';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/customers?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Page Title */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-900 p-1 shadow-sm">
                    <img src="/logo-icon.png" alt="ServiceDue" className="h-full w-full object-contain" />
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-4">
                {/* Search Bar - Searches Customers */}
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers..."
                        className="w-52 pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                    />
                </form>

                {/* Notification Bell */}
                <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
}
