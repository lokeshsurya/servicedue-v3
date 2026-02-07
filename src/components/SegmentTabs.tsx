import { motion } from 'framer-motion'

interface Tab {
    id: string
    label: string
}

interface SegmentTabsProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
}

export const SegmentTabs = ({ tabs, activeTab, onTabChange }: SegmentTabsProps) => {
    return (
        <div className="flex justify-center mb-12" role="tablist">
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-100">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        onClick={() => onTabChange(tab.id)}
                        className={`
              relative px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200
              ${activeTab === tab.id
                                ? 'text-white'
                                : 'text-text-muted hover:text-primary-black'
                            }
            `}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabBg"
                                className="absolute inset-0 bg-primary-blue rounded-full"
                                transition={{ type: "spring", duration: 0.5 }}
                                style={{ zIndex: 0 }}
                            />
                        )}
                        <span className="relative" style={{ zIndex: 1 }}>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
