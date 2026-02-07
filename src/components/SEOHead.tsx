import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    canonicalPath?: string;
    schema?: Record<string, any>;
    noindex?: boolean;
}

export const SEOHead = ({ title, description, canonicalPath, schema, noindex = false }: SEOHeadProps) => {
    const siteUrl = 'https://servicedueapp.in';
    const canonicalUrl = canonicalPath ? `${siteUrl}${canonicalPath}` : siteUrl;

    // Default Organization Schema (E-E-A-T)
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "ServiceDue",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        },
        "author": {
            "@type": "Organization",
            "name": "ServiceDue",
            "url": siteUrl,
            "logo": `${siteUrl}/logo-full.png`,
            "sameAs": [
                "https://www.linkedin.com/company/servicedue",
                "https://twitter.com/servicedue",
                "https://www.instagram.com/servicedue"
            ]
        }
    };

    const finalSchema = schema || orgSchema;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />

            {/* Indexing Control */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* AEO: Structured Data for LLMs */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
};
