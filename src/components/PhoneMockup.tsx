import { motion } from 'framer-motion'
import { MessageTailLeft, MessageTailRight, ReadReceiptIcon, CellSignalIcon, BatteryIcon } from './icons'
import { PHONE_CONFIG, MESSAGE_DELAYS, ANIMATION_DURATION, ANIMATION_EASING } from '../constants/animations'

interface Message {
    type: 'incoming' | 'outgoing'
    text: string
    time: string
    read?: boolean
}

interface PhoneMockupProps {
    contact: {
        name: string
        status: string
        initial: string
    }
    messages: Message[]
}

export const PhoneMockup = ({ contact, messages }: PhoneMockupProps) => {
    return (
        <motion.div
            className="relative max-w-[240px] lg:max-w-[280px] w-full"
            initial={{ rotate: PHONE_CONFIG.TILT_DEGREES, y: PHONE_CONFIG.ENTRANCE_Y, x: PHONE_CONFIG.OFFSET_X_INITIAL }}
            animate={{ rotate: PHONE_CONFIG.TILT_DEGREES, y: 0, x: PHONE_CONFIG.OFFSET_X }}
            transition={{ duration: ANIMATION_DURATION.SLOW, ease: ANIMATION_EASING.EASE_OUT }}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            role="img"
            aria-label="Phone mockup showing WhatsApp conversation with automated service reminder"
        >
            {/* Deep Shadow Layer */}
            <div className="absolute inset-0 bg-black/20 blur-3xl transform translate-y-12 scale-90 -z-10 rounded-[50px]" aria-hidden="true" />

            {/* Main Chassis (Metallic Border) */}
            <div className="relative rounded-[48px] p-[10px] bg-metal-gradient shadow-phone-real">

                {/* Side Buttons */}
                <div className="absolute top-24 -left-[2px] w-[2px] h-8 bg-gray-400 rounded-l-md" aria-hidden="true" />
                <div className="absolute top-36 -left-[2px] w-[2px] h-14 bg-gray-400 rounded-l-md" aria-hidden="true" />
                <div className="absolute top-52 -left-[2px] w-[2px] h-14 bg-gray-400 rounded-l-md" aria-hidden="true" />
                <div className="absolute top-40 -right-[2px] w-[2px] h-20 bg-gray-400 rounded-r-md" aria-hidden="true" />

                {/* Inner Bezel (Black Border) */}
                <div className="relative rounded-[40px] border-[6px] border-black bg-black overflow-hidden h-full">

                    {/* Screen Content */}
                    <div className="relative aspect-[9/19.5] bg-[#0B141A] w-full h-full overflow-hidden">

                        {/* Dynamic Island / Notch Area */}
                        <div className="absolute top-0 w-full h-8 z-50 flex justify-center items-start pt-2" aria-hidden="true">
                            <div className="w-[100px] h-[28px] bg-black rounded-full flex items-center justify-end px-3 gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#1c1c1e]/50" />
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="absolute top-0 left-0 right-0 z-40 px-7 py-3 flex items-center justify-between" aria-hidden="true">
                            <span className="text-white text-[12px] font-medium tracking-wide pl-2 pt-1">9:41</span>
                            <div className="flex items-center gap-1.5 pt-1 pr-1">
                                <CellSignalIcon />
                                <BatteryIcon />
                            </div>
                        </div>

                        {/* WhatsApp Header */}
                        <div className="absolute top-12 left-0 right-0 z-30 px-2">
                            <div className="flex items-center gap-3 bg-[#202C33]/90 backdrop-blur-md p-3 rounded-xl border border-white/5 mx-2 shadow-sm">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner">
                                    {contact.initial}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-semibold text-sm truncate">{contact.name}</div>
                                    <div className="text-[#25D366] text-xs font-medium">{contact.status}</div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="pt-32 px-4 space-y-4 w-full">
                            {/* Day Label */}
                            <div className="flex justify-center mb-4">
                                <span className="bg-[#202C33] text-[#8696a0] text-[10px] font-medium px-3 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                                    Today
                                </span>
                            </div>

                            {/* Render Messages */}
                            {messages.map((message, index) => {
                                const delay = index === 0 ? MESSAGE_DELAYS.FIRST :
                                    index === 1 ? MESSAGE_DELAYS.SECOND :
                                        MESSAGE_DELAYS.THIRD

                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9, x: message.type === 'incoming' ? -10 : 10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        transition={{ delay }}
                                        className={`flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`
                      ${message.type === 'incoming' ? 'bg-[#202C33] rounded-tl-none' : 'bg-[#005C4B] rounded-tr-none'}
                      rounded-2xl px-3 py-2 max-w-[80%] shadow-sm relative
                    `}>
                                            <p className="text-white text-xs leading-relaxed">{message.text}</p>

                                            {message.type === 'outgoing' ? (
                                                <div className="flex justify-end items-center gap-1 mt-1">
                                                    <span className="text-[#aebac1] text-[10px]">{message.time}</span>
                                                    {message.read && <ReadReceiptIcon />}
                                                </div>
                                            ) : (
                                                <span className="text-[#8696a0] text-[10px] mt-1 block text-right">{message.time}</span>
                                            )}

                                            {/* Message Tail */}
                                            {message.type === 'incoming' ? <MessageTailLeft /> : <MessageTailRight />}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Glass Glare Overlay */}
                        <div className="absolute inset-0 bg-glass-reflection z-50 pointer-events-none opacity-40 rounded-[32px]" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
