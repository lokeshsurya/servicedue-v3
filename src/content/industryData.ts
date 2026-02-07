export interface IndustryPageData {
    brand: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    headline: string;
    subheadline: string;
    painPoints: string[];
    features: string[];
    faq: { q: string; a: string }[];
}

export const industryData: IndustryPageData[] = [
    {
        brand: 'Suzuki',
        slug: 'suzuki-service-crm',
        metaTitle: 'Best Service CRM for Suzuki Dealerships | WhatsApp Automation',
        metaDescription: 'Automate service reminders for your Suzuki workshop. Recover lost Access 125 & Gixxer customers with WhatsApp. Boost revenue by 30%.',
        headline: 'Automate Your Suzuki Service Center',
        subheadline: 'The only CRM designed for High-Volume Suzuki Workshops. Syncs with your DMS to automate service reminders.',
        painPoints: [
            'Manual calling of Access 125 owners is slow',
            'Low show-up rate for free services',
            'Lost revenue from post-warranty drop-offs'
        ],
        features: [
            'DMS Integration for Suzuki',
            'Automated "Service Due" WhatsApp messages',
            'BS6 Service Checklist Automation'
        ],
        faq: [
            { q: 'Does this work with my Suzuki DMS?', a: 'Yes, we integrate with most standard DMS used by Suzuki dealers in India.' },
            { q: 'Can I send video service updates?', a: 'Absolutely. Send photos and videos of replaced parts via WhatsApp.' }
        ]
    },
    {
        brand: 'Hero',
        slug: 'hero-service-crm',
        metaTitle: 'Hero MotoCorp Dealership Service Software | WhatsApp CRM',
        metaDescription: 'Grow your Hero workshop revenue. Automate Splendor & HF Deluxe service calls. WhatsApp reminders for free & paid services.',
        headline: 'Supercharge Your Hero Workshop',
        subheadline: 'Handle 100+ Job Cards daily with ease. Automate follow-ups for Splendor, Passion, and Xpulse owners.',
        painPoints: [
            'Staff spends all day calling non-responsive numbers',
            'Huge customer base (Splendor/HF Deluxe) is hard to manage manually',
            'Missed AMCs renewals'
        ],
        features: [
            'Bulk WhatsApp for Hero Mass Market models',
            'AMC Expiry Tracking',
            'Digital Job Card for Hero Service'
        ],
        faq: [
            { q: 'Is this suitable for rural Hero dealers?', a: 'Yes! Our WhatsApp messages work great even with customers in Tier-2/3 cities.' }
        ]
    },
    {
        brand: 'Royal Enfield',
        slug: 'royal-enfield-service-crm',
        metaTitle: 'Royal Enfield Service CRM & Customer Experience Tool',
        metaDescription: 'Premium service experience for RE owners. Automate Classic 350 & Himalayan service bookings. Build a ride community.',
        headline: 'Premium Service for Royal Enfield Owners',
        subheadline: 'Give your Classic & Himalayan riders the premium experience they expect. Automated updates, ride invites, and service reminders.',
        painPoints: [
            'Premium customers expect proactive communication',
            'Manual scheduling of ride events and service camps',
            'Parts availability updates'
        ],
        features: [
            'Service + Ride Event Management',
            'Premium WhatsApp Templates',
            'Accessory Upsell Automation'
        ],
        faq: [
            { q: 'Can I use this for Ride events?', a: 'Yes, you can broadcast ride invites to your customer base.' }
        ]
    },
    {
        brand: 'TVS',
        slug: 'tvs-service-crm',
        metaTitle: 'TVS Service Center Automation Software | Jupiter & Apache CRM',
        metaDescription: 'Boost service retention for TVS Jupiter & Apache. Automated WhatsApp reminders, feedback collection, and revenue recovery.',
        headline: 'Next-Gen CRM for TVS Dealers',
        subheadline: 'From Jupiter commuters to Apache racers—keep every customer coming back to your service center.',
        painPoints: [
            'Managing diverse customer segments (Scooter vs Racing)',
            'Feedback collection (CSI scores)',
            'Lost customers after free service period'
        ],
        features: [
            'Segmented Campaigns (Jupiter vs Apache)',
            'Automated Feedback (CSI Booster)',
            'Lost Customer Win-back sequences'
        ],
        faq: [
            { q: 'Does it improve CSI scores?', a: 'Yes, automated feedback collection helps catch unhappy customers before they complain.' }
        ]
    },
    {
        brand: 'Honda',
        slug: 'honda-service-crm',
        metaTitle: 'Honda Two-Wheeler Service CRM | Activa & Shine Automation',
        metaDescription: 'The #1 CRM for Honda workshops. Automate Activa service reminders. Reduce churn and increase paid service revenue.',
        headline: 'Efficiency for Honda Workshops',
        subheadline: 'Manage the massive volume of Activa & Shine customers without adding more staff. 100% Automated follow-ups.',
        painPoints: [
            'Overwhelmed by Activa service volume',
            'High call center costs',
            'Data entry errors in job cards'
        ],
        features: [
            'High-Volume WhatsApp Sender',
            'Activa-specific Service Packages',
            'Zero-touch Reminder System'
        ],
        faq: [
            { q: 'Can it handle 50,000+ customer records?', a: 'Yes, ServiceDue is built for scale.' }
        ]
    }
];
