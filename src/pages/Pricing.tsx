import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const Pricing = () => {
    const plans = [
        {
            name: 'Starter',
            price: '₹2,999',
            period: '/month',
            description: 'Perfect for small dealerships getting started',
            features: [
                'Up to 500 customers',
                '1,000 WhatsApp messages/month',
                'Basic segmentation',
                'Service due reminders',
                'Email support',
                'Dashboard analytics'
            ],
            cta: 'Start Free Trial',
            popular: false
        },
        {
            name: 'Professional',
            price: '₹5,999',
            period: '/month',
            description: 'Most popular for growing dealerships',
            features: [
                'Up to 2,000 customers',
                '5,000 WhatsApp messages/month',
                'Advanced segmentation',
                'Smart campaigns',
                'Broadcast messages',
                'Priority support',
                'Custom templates',
                'API access'
            ],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'For large dealerships with custom needs',
            features: [
                'Unlimited customers',
                'Unlimited messages',
                'All Professional features',
                'Dedicated account manager',
                'Custom integrations',
                'White-label option',
                'SLA guarantee',
                '24/7 phone support'
            ],
            cta: 'Contact Sales',
            popular: false
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
                                Simple, transparent pricing
                            </h1>
                            <p className="text-xl text-slate-600 mb-8">
                                Choose the plan that's right for your dealership. All plans include a 30-day free trial.
                            </p>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                No credit card required for trial
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`relative bg-white rounded-2xl shadow-xl p-8 ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                        <p className="text-slate-600 text-sm">{plan.description}</p>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                                            <span className="text-slate-600">{plan.period}</span>
                                        </div>
                                    </div>

                                    <a
                                        href="/signup"
                                        className={`block w-full text-center py-3 rounded-xl font-semibold mb-6 transition-all ${plan.popular
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                            }`}
                                    >
                                        {plan.cta}
                                    </a>

                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                                                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="pb-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
                            Frequently asked questions
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Can I change plans later?',
                                    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                                },
                                {
                                    q: 'What happens after the free trial?',
                                    a: 'After 30 days, you\'ll be automatically moved to your chosen paid plan. You can cancel anytime during the trial with no charges.'
                                },
                                {
                                    q: 'Do you offer refunds?',
                                    a: 'Yes, we offer a 30-day money-back guarantee on all plans. No questions asked.'
                                },
                                {
                                    q: 'Is there a setup fee?',
                                    a: 'No setup fees. Ever. Just choose a plan and start your free trial immediately.'
                                }
                            ].map((faq, i) => (
                                <details key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                    <summary className="font-semibold text-slate-900 cursor-pointer">
                                        {faq.q}
                                    </summary>
                                    <p className="mt-3 text-slate-600">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}
