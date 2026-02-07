import { WhatsAppIcon } from './icons'

interface WhatsAppBadgeProps {
    text: string
}

export const WhatsAppBadge = ({ text }: WhatsAppBadgeProps) => {
    return (
        <div
            className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5 w-fit ml-2"
            role="img"
            aria-label="WhatsApp Business Partner certification badge"
        >
            <WhatsAppIcon />
            <span className="text-xs font-semibold text-primary-black">{text}</span>
        </div>
    )
}
