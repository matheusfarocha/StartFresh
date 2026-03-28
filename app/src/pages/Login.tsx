import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

export default function Login() {
  const navigate = useNavigate()

  return (
    <main className="flex-grow flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo & Welcome */}
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-3">
            Welcome to <span className="text-primary">FreshStart</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Sign in to access your personalized roadmap and resources.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest p-8 rounded-lg shadow-[0_6px_0_0_#bcb9b3]">
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
                className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block font-label font-bold text-sm text-on-surface mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg px-4 py-4 focus-within:ring-3 focus-within:ring-primary-fixed transition-all">
              <Icon name="lock" className="text-on-surface-variant" />
              <input
                type="password"
                placeholder="Enter your password"
                className="bg-transparent outline-none w-full text-on-surface placeholder:text-outline-variant font-body"
              />
            </div>
          </div>

          {/* Log In Button */}
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 bg-primary-container text-on-primary-container font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_1px_0_0_#9d4f00] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Log In
            <Icon name="arrow_forward" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-grow h-px bg-outline-variant/30" />
            <span className="text-sm text-on-surface-variant font-medium">or</span>
            <div className="flex-grow h-px bg-outline-variant/30" />
          </div>

          {/* Continue as Guest */}
          <button
            onClick={() => navigate('/home')}
            className="w-full py-4 bg-surface-container-high text-on-surface font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        {/* Privacy note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-on-surface-variant">
          <Icon name="lock" className="text-sm" />
          <span className="text-sm">No personal data required. Your privacy comes first.</span>
        </div>
      </div>
    </main>
  )
}
