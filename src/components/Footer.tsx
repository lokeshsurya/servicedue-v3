import { Link } from 'react-router-dom'

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    const quickLinks = [
        { label: 'Product', to: '/#features' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'About Us', to: '/how-it-works' },
        { label: 'Contact', to: '/contact' }
    ]

    const legalLinks = [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/privacy' }
    ]

    const socialLinks = [
        { label: 'LinkedIn', href: '#', icon: '💼' },
        { label: 'Twitter', href: '#', icon: '🐦' },
        { label: 'Facebook', href: '#', icon: '📘' }
    ]

    return (
        <footer className="bg-primary-black text-white py-12 md:py-16">
            <div className="max-w-container mx-auto px-6 md:px-12 lg:px-16">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Company Info */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                                <span className="text-white font-black text-lg">S</span>
                            </div>
                            <span className="text-xl font-black">ServiceDue</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
                            Revenue intelligence platform for dealerships. Recover lost customers through automated WhatsApp campaigns and smart follow-ups.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>📧</span>
                            <a href="mailto:contact@servicedue.com" className="hover:text-white transition-colors">
                                contact@servicedue.com
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-gray-400 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Copyright */}
                    <p className="text-gray-400 text-sm">
                        © {currentYear} ServiceDue. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                className="text-gray-400 hover:text-white transition-colors text-xl"
                                aria-label={social.label}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
