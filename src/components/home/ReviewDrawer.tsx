import { useState } from 'react';
import { X, Zap, Check } from 'lucide-react';

interface Customer {
    id: string;
    customer_name: string;
    phone: string;
    bike_model: string;
    last_service_date: string;
    estimated_value: number;
}

interface SegmentData {
    segment: string;
    label: string;
    color: string;
    icon: React.ElementType;
    customers: Customer[];
}

interface ReviewDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    segments: SegmentData[];
    onLaunch: (selectedCustomers: Customer[], segment: string) => void;
}

export default function ReviewDrawer({ isOpen, onClose, segments, onLaunch }: ReviewDrawerProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

    // Initialize all customers as selected when drawer opens
    useState(() => {
        if (isOpen) {
            const allIds = new Set(segments.flatMap(s => s.customers.map(c => c.id)));
            setSelectedCustomers(allIds);
        }
    });

    if (!isOpen) return null;

    const currentSegment = segments[activeTab];
    const allCustomers = segments.flatMap(s => s.customers);
    const totalSelected = Array.from(selectedCustomers).filter(id =>
        allCustomers.some(c => c.id === id)
    ).length;
    const totalRevenue = allCustomers
        .filter(c => selectedCustomers.has(c.id))
        .reduce((sum, c) => sum + c.estimated_value, 0);

    const toggleCustomer = (customerId: string) => {
        const newSet = new Set(selectedCustomers);
        if (newSet.has(customerId)) {
            newSet.delete(customerId);
        } else {
            newSet.add(customerId);
        }
        setSelectedCustomers(newSet);
    };

    const toggleAll = () => {
        const currentIds = currentSegment.customers.map(c => c.id);
        const allSelected = currentIds.every(id => selectedCustomers.has(id));

        const newSet = new Set(selectedCustomers);
        if (allSelected) {
            currentIds.forEach(id => newSet.delete(id));
        } else {
            currentIds.forEach(id => newSet.add(id));
        }
        setSelectedCustomers(newSet);
    };

    const handleLaunch = () => {
        const selected = allCustomers.filter(c => selectedCustomers.has(c.id));
        onLaunch(selected, currentSegment.segment);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Review Customers</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Select customers to include in this campaign</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
                        {segments.map((segment, index) => {
                            // const Icon = segment.icon;
                            const isActive = activeTab === index;
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`flex-1 flex items-center justify-center py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${segment.color === 'amber' || segment.color === 'orange' ? 'bg-amber-500' :
                                            segment.color === 'blue' || segment.color === 'indigo' ? 'bg-indigo-500' :
                                                'bg-rose-500'
                                        }`}></span>
                                    {segment.label}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-md text-xs ${isActive ? 'bg-slate-100 text-slate-600' : 'bg-slate-200/50 text-slate-500'
                                        }`}>
                                        {segment.customers.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Customer List */}
                <div className="flex-1 overflow-y-auto px-8 py-6 bg-slate-50/50">
                    {/* Select All Bar */}
                    <div className="flex items-center justify-between mb-4 pl-2">
                        <button
                            onClick={toggleAll}
                            className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${currentSegment.customers.every(c => selectedCustomers.has(c.id))
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-white border-slate-300 text-transparent'
                                }`}>
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </div>
                            <span>Select All</span>
                        </button>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                            {currentSegment.customers.filter(c => selectedCustomers.has(c.id)).length} / {currentSegment.customers.length} Selected
                        </span>
                    </div>

                    {/* Customer Cards */}
                    <div className="space-y-3">
                        {currentSegment.customers.map((customer) => {
                            const isSelected = selectedCustomers.has(customer.id);
                            return (
                                <label
                                    key={customer.id}
                                    className={`group flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected
                                            ? 'border-indigo-600 bg-indigo-50/30 shadow-sm ring-1 ring-indigo-600/10'
                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                                        }`}
                                >
                                    <div className="mt-1">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white border-slate-300 group-hover:border-slate-400 text-transparent'
                                            }`}>
                                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleCustomer(customer.id)}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className={`font-semibold text-base truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                                                    {customer.customer_name}
                                                </p>
                                                <p className="text-sm text-slate-500 font-mono mt-0.5">{customer.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-emerald-600 tracking-tight">
                                                    ₹{customer.estimated_value.toLocaleString('en-IN')}
                                                </p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Value</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center space-x-3 text-xs font-medium text-slate-500">
                                            <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 border border-slate-200">
                                                {customer.bike_model}
                                            </span>
                                            <span>Previous: {new Date(customer.last_service_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Selected</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight">{totalSelected} <span className="text-base font-medium text-slate-500">customers</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Revenue</p>
                            <p className="text-2xl font-bold text-emerald-600 tracking-tight">
                                ₹{totalRevenue.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLaunch}
                        disabled={totalSelected === 0}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                    >
                        <Zap className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
                        <span>Launch Campaign ({totalSelected})</span>
                    </button>
                </div>
            </div>
        </>
    );
}
