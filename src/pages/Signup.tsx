import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupFormData } from '../validation/auth'
import { useState } from 'react'
import { logger } from '../lib/logger'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { signup as apiSignup } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export const Signup = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    })

    const password = watch('password')

    const { login } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (data: SignupFormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            logger.debug('Signup request:', data)

            // Transform data for backend (split name into first/last)
            const nameParts = data.name.split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

            const payload = {
                email: data.email,
                password: data.password,
                first_name: firstName,
                last_name: lastName,
                dealership_name: data.dealershipName
            }

            const response = await apiSignup(payload)
            login(response.user, response.token)

            // Success animation
            await new Promise(resolve => setTimeout(resolve, 500))
            navigate('/dashboard')
        } catch (err: any) {
            logger.error('Signup error:', err)
            setError(err.response?.data?.detail || 'Signup failed. Email might be already registered.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Calculate password strength
    const getPasswordStrength = () => {
        if (!password) return 0
        let strength = 0
        if (password.length >= 8) strength += 25
        if (/[A-Z]/.test(password)) strength += 25
        if (/[a-z]/.test(password)) strength += 25
        if (/[0-9]/.test(password)) strength += 25
        return strength
    }

    const passwordStrength = getPasswordStrength()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated background gradient orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">

                    {/* Logo & Title */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="inline-flex items-center justify-center gap-2 mb-6"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                                <span className="text-white font-black text-2xl">S</span>
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                ServiceDue
                            </span>
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Get started free
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Join 500+ dealerships growing their revenue
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3"
                        >
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Dealership Name */}
                        <div>
                            <label htmlFor="dealershipName" className="block text-sm font-medium text-slate-700 mb-2">
                                Dealership Name
                            </label>
                            <input
                                type="text"
                                id="dealershipName"
                                {...register('dealershipName')}
                                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none ${errors.dealershipName
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="ABC Motors Pvt Ltd"
                                disabled={isSubmitting}
                            />
                            {errors.dealershipName && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.dealershipName.message}
                                </p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Your Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register('name')}
                                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none ${errors.name
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="Rahul Sharma"
                                disabled={isSubmitting}
                            />
                            {errors.name && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Work Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register('email')}
                                className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none ${errors.email
                                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                placeholder="you@dealership.com"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+91</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    {...register('phone')}
                                    className={`w-full pl-14 pr-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none ${errors.phone
                                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    placeholder="9876543210"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    {...register('password')}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 bg-white/50 backdrop-blur-sm transition-all duration-200 outline-none ${errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    placeholder="Create a strong password"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && password.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex gap-1">
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 25 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-slate-200'}`} />
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 50 ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-slate-200'}`} />
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= 75 ? 'bg-gradient-to-r from-yellow-500 to-green-500' : 'bg-slate-200'}`} />
                                        <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-slate-200'}`} />
                                    </div>
                                    <p className="text-xs text-slate-600">
                                        {passwordStrength < 50 && '⚠️ Weak - Add uppercase, lowercase, and numbers'}
                                        {passwordStrength >= 50 && passwordStrength < 100 && '⚡ Good - Almost there!'}
                                        {passwordStrength === 100 && '✅ Strong password'}
                                    </p>
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg mt-6 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating your account...
                                    </>
                                ) : (
                                    <>
                                        Start free trial
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                        </button>

                        {/* Terms & Privacy */}
                        <p className="text-xs text-center text-slate-500 mt-4">
                            By signing up, you agree to our{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2">
                                Privacy Policy
                            </a>
                        </p>
                    </form>
                </div>

                {/* Login Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline underline-offset-2 transition-all">
                            Sign in →
                        </a>
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span>24/7 Support</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
