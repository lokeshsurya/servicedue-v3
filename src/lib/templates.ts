// Message templates for campaigns
export const TEMPLATES = {
    WARRANTY_EXPIRY_URGENT: {
        id: 'WARRANTY_EXPIRY_URGENT',
        segment: '1ST_FREE',
        name: 'Warranty Expiring Soon',
        description: 'Urgent reminder for customers whose warranty is about to expire',
        message: `Hi {customer_name},

Your Suzuki {bike_model}'s warranty expires in {days_left} days!

Book your 1st Free Service now to:
✓ Protect your warranty
✓ Save ₹800 on future repairs
✓ Keep your bike running smooth

📅 Book Now: {booking_link}

- Team ServiceDue`
    },

    ROUTINE_SERVICE_DUE: {
        id: 'ROUTINE_SERVICE_DUE',
        segment: 'PAID_ROUTINE',
        name: 'Routine Service Reminder',
        description: 'Reminder for regular maintenance customers',
        message: `Hi {customer_name},

Time for your {bike_model}'s routine service!

Regular maintenance ensures:
✓ Better fuel efficiency
✓ Longer engine life
✓ Safe riding experience

📅 Book your service: {booking_link}

- Team ServiceDue`
    },

    WINBACK_OFFER: {
        id: 'WINBACK_OFFER',
        segment: 'RISK_LOST',
        name: 'Win-Back Offer',
        description: 'Special offer to win back lost customers',
        message: `Hi {customer_name},

We miss you! 😊

Get ₹500 discount on your {bike_model} service + FREE safety check!

This exclusive offer is valid for 7 days only.

📅 Book Now: {booking_link}

- Team ServiceDue`
    }
};

export function getTemplateForSegment(segment: string) {
    const templateMap: Record<string, keyof typeof TEMPLATES> = {
        '1ST_FREE': 'WARRANTY_EXPIRY_URGENT',
        'PAID_ROUTINE': 'ROUTINE_SERVICE_DUE',
        'RISK_LOST': 'WINBACK_OFFER'
    };

    const templateId = templateMap[segment] || 'ROUTINE_SERVICE_DUE';
    return TEMPLATES[templateId];
}

export function previewMessage(templateId: keyof typeof TEMPLATES, sampleData?: any) {
    const template = TEMPLATES[templateId];
    const sample = sampleData || {
        customer_name: 'Rajesh Kumar',
        bike_model: 'Access 125',
        days_left: '3',
        booking_link: 'https://servicedue.in/book/sample'
    };

    let message = template.message;
    Object.entries(sample).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, String(value));
    });

    return message;
}
