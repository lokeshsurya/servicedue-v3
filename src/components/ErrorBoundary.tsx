import { Component, type ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo)
        // TODO: Send to error tracking service (Sentry, LogRocket)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-8">
                            We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-blue/90 transition-all"
                            >
                                Refresh Page
                            </button>
                            <a
                                href="/"
                                className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all"
                            >
                                Go Home
                            </a>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-8 text-left">
                                <summary className="text-sm text-gray-500 cursor-pointer mb-2">Error Details (Dev Only)</summary>
                                <pre className="bg-red-50 p-4 rounded-lg text-xs text-red-900 overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
