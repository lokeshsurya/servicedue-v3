
import { motion } from 'framer-motion'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useState } from 'react'

import { supabase } from '../lib/supabase'

export const Waitlist = () => {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email, source: 'waitlist_page' }])

            if (error) {
                // If error code 23505 (unique violation), we still treat as success for UX
                if (error.code === '23505') {
                    setSubmitted(true)
                } else {
                    console.error('Error:', error)
                    alert('Something went wrong. Please try again.')
                }
            } else {
                setSubmitted(true)
            }
        } catch (error) {
            console.error('Error joining waitlist:', error)
            alert('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <div className="min-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-6">
                <div className="max-w-2xl w-full text-center">

                    {!submitted ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                                🚀 Coming Soon to Your City
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                                Service<span className="text-blue-600">Due</span> 3.0
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                                We are currently onboarding select Suzuki dealerships.
                                Join the waitlist to get early access and a free demo.
                            </p>

                            <form onSubmit={handleSubmit} className="max-w-md mx-auto relative flex items-center">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-11 pr-32 py-4 sm:text-base border-2 border-slate-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-xl shadow-blue-500/10"
                                        placeholder="Enter your work email"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    {loading ? 'Joining...' : 'Join'}
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-slate-400">
                                Limited spots available for the beta program.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-3xl shadow-xl"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">You're on the list!</h2>
                            <p className="text-slate-600 mb-8">
                                Thanks for your interest. We've added <b>{email}</b> to our priority queue.
                                We'll reach out soon!
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                Register another email
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
