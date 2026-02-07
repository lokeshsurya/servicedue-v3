import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Upload Your Customer Data',
            description: 'Import your customer list via Excel. We automatically segment them based on service dates, warranty status, and more.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
            )
        },
        {
            number: '02',
            title: 'Set Up Smart Campaigns',
            description: 'Choose from pre-built templates or create custom WhatsApp campaigns. Set triggers like "7 days before service due".',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        },
        {
            number: '03',
            title: 'Autopilot Engagement',
            description: 'Sit back as ServiceDue automatically sends personalized messages at the right time. Track opens, replies, and bookings in real-time.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            number: '04',
            title: 'Watch Revenue Grow',
            description: 'See real-time analytics on customer engagement, service bookings, and revenue generated. Optimize and scale.',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        }
    ]

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
                                From zero to autopilot in 4 simple steps
                            </h1>
                            <p className="text-xl text-slate-600 mb-8">
                                Get up and running in less than 10 minutes. No technical skills required.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Steps */}
                <section className="pb-20 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            {/* Number Badge */}
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/50">
                                                    {step.number}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="text-blue-600">
                                                        {step.icon}
                                                    </div>
                                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                                                        {step.title}
                                                    </h3>
                                                </div>
                                                <p className="text-lg text-slate-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute left-8 top-full h-12 w-0.5 bg-gradient-to-b from-blue-300 to-transparent"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video Demo Section */}
                <section className="pb-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-slate-900 text-center mb-6">
                                See it in action
                            </h2>
                            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-600">Demo video coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="pb-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready to automate your dealership?
                            </h2>
                            <p className="text-blue-100 text-lg mb-8">
                                Join 500+ dealerships already using ServiceDue
                            </p>
                            <Link
                                to="/waitlist"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg"
                            >
                                Start Free Trial →
                            </Link>

                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}
