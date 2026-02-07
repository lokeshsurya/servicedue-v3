import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import InputField from '../../components/auth/InputField'
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter'

function SignUp() {
  const navigate = useNavigate()

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dealershipName, setDealershipName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const getPasswordError = () => {
    if (!confirmPassword) return undefined
    if (password !== confirmPassword) return 'Passwords do not match'
    return undefined
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate
    if (!firstName || !lastName || !dealershipName || !email || !password) {
      setError('Please fill in all required fields')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms and Privacy Policy')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          dealership_name: dealershipName
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        // Show success
        setSuccess(true)

        // Redirect after animation
        setTimeout(() => {
          navigate('/')
        }, 1200)
      } else {
        setError(data.detail || 'Sign up failed. Please try again.')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
      console.error('Sign up error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Start Recovery
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 lg:text-4xl">Create your account</h2>
        <p className="mt-3 text-base text-slate-600 lg:text-lg">
          Set up your dealership workspace in under two minutes.
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
          <span>Account created! Setting up your workspace...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First name"
            type="text"
            placeholder="Rajesh"
            value={firstName}
            onChange={setFirstName}
            success={firstName.length >= 2}
            required
            autoComplete="given-name"
          />

          <InputField
            label="Last name"
            type="text"
            placeholder="Patil"
            value={lastName}
            onChange={setLastName}
            success={lastName.length >= 2}
            required
            autoComplete="family-name"
          />
        </div>

        <InputField
          label="Dealership name"
          type="text"
          placeholder="Suzuki Moto Pune"
          value={dealershipName}
          onChange={setDealershipName}
          success={dealershipName.length >= 3}
          required
          autoComplete="organization"
        />

        <InputField
          label="Work email"
          type="email"
          placeholder="owner@dealership.in"
          value={email}
          onChange={setEmail}
          error={email && !validateEmail(email) ? 'Invalid email format' : undefined}
          success={!!(email && validateEmail(email))}
          required
          autoComplete="email"
        />

        <div className="space-y-2">
          <InputField
            label="Password"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={setPassword}
            required
            autoComplete="new-password"
          />

          {password && <PasswordStrengthMeter password={password} />}
        </div>

        <InputField
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={getPasswordError()}
          success={!!(confirmPassword && password === confirmPassword)}
          required
          autoComplete="new-password"
        />

        <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
          />
          I agree to ServiceDue's Terms and Privacy Policy.
        </label>

        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          What you get
        </p>
        <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            Launch 3 smart campaigns immediately after upload
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            Track recovered revenue, risk, and pipeline in one dashboard
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            Autopilot WhatsApp + voice reminders with zero effort
          </li>
        </ul>
      </div>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUp
