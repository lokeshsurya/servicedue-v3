import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react'
import InputField from '../../components/auth/InputField'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setCountdown(60)

        // Countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setError(data.detail || 'Failed to send reset link')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
      console.error('Reset password error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = () => {
    setSuccess(false)
    setCountdown(0)
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Recover Access
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Reset your password</h2>
        <p className="mt-3 text-base text-slate-600 lg:text-lg">
          We will send a secure reset link to your registered email.
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
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2">
            <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset link sent!</p>
              <p className="text-xs mt-1 text-green-600">
                Check your inbox at <span className="font-medium">{email}</span>
              </p>
              {countdown > 0 && (
                <p className="text-xs mt-2 text-green-600">
                  Resend available in {countdown}s
                </p>
              )}
              {countdown === 0 && (
                <button
                  onClick={handleResend}
                  className="text-xs font-medium text-green-700 hover:text-green-800 mt-2 underline"
                >
                  Didn't receive it? Resend link
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

        <button
          type="submit"
          disabled={loading || !email || success}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending link...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Link sent
            </>
          ) : (
            'Send reset link'
          )}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Need help?
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Reach us at <a href="mailto:support@servicedue.ai" className="font-medium text-blue-600 hover:text-blue-700">support@servicedue.ai</a> or WhatsApp your account manager for instant help.
        </p>
      </div>

      <p className="text-center text-sm text-slate-500">
        Remembered it?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}

export default ForgotPassword
