import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const NotFound = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
                <div className="text-center max-w-md">
                    {/* 404 Number */}
                    <h1 className="text-9xl font-black text-primary-blue mb-4 tracking-tight">
                        404
                    </h1>

                    {/* Heading */}
                    <h2 className="text-3xl font-black text-primary-black mb-4">
                        Page Not Found
                    </h2>

                    {/* Description */}
                    <p className="text-text-body text-lg mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/"
                            className="bg-primary-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-blue/90 transition-all shadow-button"
                        >
                            Go to Home
                        </a>
                        <a
                            href="/dashboard"
                            className="border-2 border-primary-blue text-primary-blue px-8 py-3 rounded-full font-semibold hover:bg-primary-blue hover:text-white transition-all"
                        >
                            Go to Dashboard
                        </a>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-text-muted mb-4">Maybe you were looking for:</p>
                        <div className="flex flex-wrap gap-4 justify-center text-sm">
                            <a href="/login" className="text-primary-blue hover:underline">Login</a>
                            <span className="text-gray-300">•</span>
                            <a href="/signup" className="text-primary-blue hover:underline">Sign Up</a>
                            <span className="text-gray-300">•</span>
                            <a href="/#contact" className="text-primary-blue hover:underline">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
