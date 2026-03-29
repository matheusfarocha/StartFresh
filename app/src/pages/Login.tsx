import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'signup'

export default function Login() {
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (mode === 'signup') {
      if (!displayName) {
        setError('Please enter a display name.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    setSubmitting(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
        setSubmitting(false)
        return
      }
    } else {
      const { error } = await signUp(email, password, displayName)
      if (error) {
        setError(error)
        setSubmitting(false)
        return
      }
    }

    window.scrollTo(0, 0)
    navigate('/home')
  }

  return (
    <main className="flex-grow flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo & Welcome */}
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-3">
            {mode === 'login' ? (
              <>Welcome back to <span className="text-primary">FreshStart</span></>
            ) : (
              <>Join <span className="text-primary">FreshStart</span></>
            )}
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {mode === 'login'
              ? 'Sign in to access your personalized roadmap and resources.'
              : 'Create an account to save your progress and get a personalized plan.'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_6px_0_0_#bcb9b3]">
          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-error-container/20 rounded-lg flex items-center gap-3">
              <Icon name="error" className="text-error" />
              <span className="text-sm text-error font-medium">{error}</span>
            </div>
          )}

          {/* Display Name (signup only) */}
          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
                Display Name
              </label>
              <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
                <Icon name="person" className="text-on-surface-variant" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
              Email
            </label>
            <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
              <Icon name="mail" className="text-on-surface-variant" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
              />
            </div>
          </div>

          {/* Password */}
          <div className={mode === 'signup' ? 'mb-5' : 'mb-8'}>
            <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
              <Icon name="lock" className="text-on-surface-variant" />
              <input
                type="password"
                placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
              />
            </div>
          </div>

          {/* Confirm Password (signup only) */}
          {mode === 'signup' && (
            <div className="mb-8">
              <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
                <Icon name="lock" className="text-on-surface-variant" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_1px_0_0_#9d4f00] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            {!submitting && <Icon name="arrow_forward" />}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-px bg-outline-variant/30" />
            <span className="text-sm text-on-surface-variant font-medium">or</span>
            <div className="flex-grow h-px bg-outline-variant/30" />
          </div>

          {/* Toggle mode */}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
            className="w-full py-4 bg-surface-container-high text-on-surface font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer"
          >
            {mode === 'login' ? 'Create Account' : 'Back to Log In'}
          </button>
        </div>

        {/* Privacy note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant">
          <Icon name="lock" className="text-sm" />
          <span className="text-sm">Your privacy comes first. We never share your data.</span>
        </div>
      </div>
    </main>
  )
}
