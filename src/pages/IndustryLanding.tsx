import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SEOHead } from '../components/SEOHead'
import { industryData } from '../content/industryData'

export default function IndustryLanding() {
    const { slug } = useParams()
    const data = industryData.find(d => d.slug === slug)

    if (!data) {
        return <Navigate to="/404" replace />
    }

    // AEO Schema: Solution Specific
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `ServiceDue for ${data.brand}`,
        "applicationCategory": "BusinessApplication",
        "description": data.metaDescription,
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <SEOHead
                title={data.metaTitle}
                description={data.metaDescription}
                canonicalPath={`/solutions/${data.slug}`}
                schema={schema}
            />
            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-white to-blue-50/50">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide">
                                FOR {data.brand.toUpperCase()} DEALERS
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                                {data.headline}
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                {data.subheadline}
                            </p>
                            <div className="pt-4">
                                <a
                                    href="/waitlist"
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                                >
                                    Get Early Access
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pain Points Grid */}
                <section className="py-20 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900">Why {data.brand} Dealers Switch to Us</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {data.painPoints.map((point, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                                >
                                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                                        <span className="text-2xl">🛑</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 leading-snug">
                                        "{point}"
                                    </h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-6 bg-slate-900 text-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                    Built for {data.brand} Service Centers
                                </h2>
                                <ul className="space-y-6">
                                    {data.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-4 text-lg text-slate-300">
                                            <div className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                ✓
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                                <div className="space-y-4">
                                    {/* Mock Chat Interface */}
                                    <div className="bg-slate-700/50 p-4 rounded-lg rounded-tl-none self-start max-w-[80%]">
                                        <p className="text-sm text-slate-300">
                                            Hi! Your {data.brand} is due for service. Book now?
                                        </p>
                                    </div>
                                    <div className="bg-blue-600 p-4 rounded-lg rounded-tr-none self-end max-w-[80%] ml-auto">
                                        <p className="text-sm text-white">
                                            Yes, book for tomorrow 10 AM.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section (AEO Goldmine) */}
                <section className="py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                            Common Questions from {data.brand} Dealers
                        </h2>
                        <div className="space-y-4">
                            {data.faq.map((item, i) => (
                                <details key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 group">
                                    <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center">
                                        {item.q}
                                        <span className="text-blue-600 transition-transform group-open:rotate-180">▼</span>
                                    </summary>
                                    <p className="mt-4 text-slate-600 leading-relaxed">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-6 bg-blue-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-8">
                            Start Recovering Revenue Today
                        </h2>
                        <a
                            href="/waitlist"
                            className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
                        >
                            Get Started Free →
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
