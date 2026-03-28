import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  disabled?: boolean
}

export default function Header({ disabled }: HeaderProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const logoTo = isLoggedIn ? '/home' : '/login'

  const navLink = (to: string, label: string) => {
    const isActive = pathname === to
    return (
      <Link
        to={to}
        className={`font-headline font-bold text-lg tracking-tight transition-colors rounded-full px-4 py-2 ${
          isActive
            ? 'text-primary border-b-4 border-primary pb-1'
            : 'text-on-background font-medium hover:bg-primary-container/20'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full max-w-screen-xl mx-auto bg-surface-container-low rounded-b-xl px-6 py-4 shadow-[0_24px_48px_-12px_rgba(55,56,49,0.06)]">
      <Link to={logoTo} className="text-2xl font-extrabold text-primary font-headline">
        FreshStart
      </Link>

      <nav className="hidden md:flex items-center gap-2">
        {disabled ? (
          <>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Home</span>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Roadmap</span>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Resources</span>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Community</span>
          </>
        ) : (
          <>
            {navLink('/home', 'Home')}
            {navLink('/roadmap', 'Roadmap')}
            {navLink('/resources', 'Resources')}
            {navLink('/community', 'Community')}
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center p-2 rounded-full hover:bg-primary-container/20 transition-colors active:scale-95 duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
            account_circle
          </span>
        </button>
      </div>
    </header>
  )
}
