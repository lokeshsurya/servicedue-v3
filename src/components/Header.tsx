import { Link } from 'react-router-dom'

export const Header = () => {
    const navLinks = [
        { label: 'Features', to: '/#features' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'Contact', to: '/contact' }
    ]

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo - Left */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                        <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-lg">S</span>
                        </div>
                        <span className="text-xl font-black text-primary-black">ServiceDue</span>
                    </Link>

                    {/* Center Navigation - Desktop Only */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="text-xs font-semibold text-primary-black hover:text-primary-blue transition-colors tracking-wide"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Side - Waitlist Buttons */}
                    <div className="flex items-center gap-6">
                        <Link
                            to="/waitlist"
                            className="hidden md:inline-block border-2 border-primary-blue text-primary-blue px-6 py-2 rounded-full font-semibold text-sm hover:bg-primary-blue hover:text-white transition-all"
                        >
                            JOIN WAITLIST
                        </Link>
                        <Link
                            to="/waitlist"
                            className="text-sm font-semibold text-primary-black hover:text-primary-blue transition-colors"
                        >
                            Log In
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    )
}
