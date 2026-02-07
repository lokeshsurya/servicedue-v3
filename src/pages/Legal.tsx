import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const Legal = ({ title }: { title: string }) => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-slate-50 py-20 px-6">
                <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">{title}</h1>
                    <div className="prose prose-slate max-w-none text-slate-600">
                        <p>Last updated: {new Date().toLocaleDateString()}</p>
                        <p>
                            This is a placeholder for the <strong>{title}</strong>.
                            As we are currently in a closed beta/waitlist phase, strict legal terms are being finalized.
                        </p>
                        <h3>1. General</h3>
                        <p>
                            By using ServiceDue, you agree to our standard operating procedures regarding data privacy and usage.
                        </p>
                        <h3>2. Data Protection</h3>
                        <p>
                            We take data security seriously. All customer data is encrypted and handled according to industry standards.
                        </p>
                        <h3>3. Contact</h3>
                        <p>
                            For any legal inquiries, please contact us at <a href="mailto:legal@servicedue.com" className="text-blue-600 hover:underline">legal@servicedue.com</a>.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
