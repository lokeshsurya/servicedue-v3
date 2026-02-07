import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import InputField from '../../components/auth/InputField'

function SignIn() {
  const navigate = useNavigate()

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Show success briefly
        setSuccess(true)

        // Redirect after animation
        setTimeout(() => {
          navigate('/')
        }, 800)
      } else {
        setError(data.detail || 'Sign in failed. Please check your credentials.')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
      console.error('Sign in error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Dealer Access
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Welcome back</h2>
        <p className="mt-3 text-base text-slate-600 lg:text-lg">
          Sign in to monitor recovered revenue and launch new campaigns.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Sign in successful! Redirecting...</span>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          disabled
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400 cursor-not-allowed"
        >
          Continue with Google
        </button>
        <button
          disabled
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400 cursor-not-allowed"
        >
          Continue with Microsoft
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or sign in with email
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <InputField
          label="Work email"
          type="email"
          placeholder="dealer@example.com"
          value={email}
          onChange={setEmail}
          error={email && !validateEmail(email) ? 'Invalid email format' : undefined}
          success={!!(email && validateEmail(email))}
          required
          autoComplete="email"
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Password<span className="text-red-500 ml-1">*</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-700">
              Forgot password?
            </Link>
          </div>
          <InputField
            label=""
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="current-password"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
          />
          Keep me signed in for 30 days
        </label>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Live snapshot
        </p>
        <p className="mt-2 text-sm text-slate-600">
          28 customers are due this week. Recovering just 40% adds ₹1.2L to this month's revenue.
        </p>
      </div>

      <p className="text-center text-sm text-slate-500">
        New to ServiceDue?{' '}
        <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
          Create an account
        </Link>
      </p>
    </div>
  )
}

export default SignIn
