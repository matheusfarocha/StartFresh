import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, displayName, isLoggedIn, signOut } = useAuth()
  const { resetRoadmap } = useApp()

  if (!isLoggedIn) {
    return (
      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-6xl mb-4">person</span>
          <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-3">Profile</h1>
          <p className="text-on-surface-variant text-lg max-w-md mb-6">
            Sign in to view your profile.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-primary-container text-on-primary-container font-headline font-black text-lg rounded-lg shadow-[0_4px_0_0_#9d4f00] active:translate-y-1 active:shadow-[0_1px_0_0_#9d4f00] transition-all cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <main className="flex-grow max-w-2xl mx-auto w-full px-6 pt-12 pb-24">
      {/* Profile Header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-6 shadow-[0_6px_0_0_#9d4f00]">
          <span className="material-symbols-outlined text-on-primary-container text-5xl">person</span>
        </div>
        <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">
          {displayName || 'FreshStart User'}
        </h1>
        <p className="text-on-surface-variant font-medium">{user?.email}</p>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_4px_0_0_#bcb9b3]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
              <Icon name="mail" className="text-primary text-2xl" />
            </div>
            <div className="flex-grow">
              <p className="font-label font-bold text-sm text-on-surface-variant uppercase tracking-wider">Email</p>
              <p className="font-headline font-bold text-lg text-on-surface">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_4px_0_0_#bcb9b3]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
              <Icon name="calendar_today" className="text-primary text-2xl" />
            </div>
            <div className="flex-grow">
              <p className="font-label font-bold text-sm text-on-surface-variant uppercase tracking-wider">Member Since</p>
              <p className="font-headline font-bold text-lg text-on-surface">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 space-y-3">
        <button
          onClick={handleSignOut}
          className="w-full py-4 bg-surface-container-high text-error font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Icon name="logout" className="text-error" />
          Sign Out
        </button>
        <button
          onClick={async () => { await resetRoadmap(); navigate('/home') }}
          className="w-full py-4 bg-surface-container-high text-on-surface font-headline font-bold text-lg rounded-lg shadow-[0_4px_0_0_#bcb9b3] active:translate-y-1 active:shadow-[0_1px_0_0_#bcb9b3] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Icon name="restart_alt" className="text-on-surface-variant" />
          Restart Roadmap
        </button>
      </div>
    </main>
  )
}
