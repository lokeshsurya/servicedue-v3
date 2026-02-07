export const heroContent = {
    headline: "Recover Lost Revenue Instantly",
    subheadline: "ServiceDue finds lost customers in your DMS and brings them back through automated WhatsApp campaigns. ₹54,000 average monthly recovery for Suzuki dealers.",
    cta: {
        primary: "START FREE TRIAL",
        ariaLabel: "Start your free trial of ServiceDue"
    },
    featureCard: {
        title: "Automate Recovery",
        badge: "NEW",
        description: "Supercharge your revenue recovery with automated WhatsApp campaigns and smart segmentation.",
        link: {
            text: "Join Waitlist",
            href: "/waitlist"
        }
    },
    features: [
        { icon: "TrendingUp", text: "Drive Sales" },
        { icon: "Users", text: "Get More Leads" },
        { icon: "Zap", text: "Engage Prospects" }
    ],
    whatsappBadge: "WhatsApp Business Partner",
    phoneConversation: {
        contact: {
            name: "Suzuki Service",
            status: "Business Account",
            initial: "S"
        },
        messages: [
            {
                type: "incoming" as const,
                text: "Hi! Your Access 125 is due for service. Book now and get 10% off! 🔧",
                time: "10:15 AM"
            },
            {
                type: "outgoing" as const,
                text: "Yes, please! I'll come tomorrow at 3 PM",
                time: "10:16 AM",
                read: true
            },
            {
                type: "incoming" as const,
                text: "Perfect! Booking confirmed. Estimated cost: ₹1,500. See you!",
                time: "10:17 AM"
            }
        ]
    }
}
