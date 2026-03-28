import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  disabled?: boolean
}

export default function Header({ disabled }: HeaderProps) {
  const location = useLocation()
  const isRoadmap = location.pathname === '/roadmap'

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full max-w-screen-xl mx-auto bg-surface-container-low rounded-b-xl px-6 py-4 shadow-[0_24px_48px_-12px_rgba(55,56,49,0.06)]">
      <Link to="/" className="text-2xl font-extrabold text-primary font-headline">
        FreshStart
      </Link>

      <nav className="hidden md:flex items-center gap-2">
        {disabled ? (
          <>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Journey</span>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Resources</span>
            <span className="text-on-background font-medium opacity-50 cursor-not-allowed px-4 py-2">Support</span>
          </>
        ) : (
          <>
            <Link
              to={isRoadmap ? '/roadmap' : '/'}
              className={`font-headline font-bold text-lg tracking-tight transition-colors rounded-full px-4 py-2 ${
                isRoadmap || location.pathname === '/'
                  ? 'text-primary border-b-4 border-primary pb-1'
                  : 'text-on-background font-medium hover:bg-primary-container/20'
              }`}
            >
              Journey
            </Link>
            <span className="text-on-background font-medium font-headline text-lg tracking-tight hover:bg-primary-container/20 transition-colors rounded-full px-4 py-2 cursor-pointer">
              Resources
            </span>
            <span className="text-on-background font-medium font-headline text-lg tracking-tight hover:bg-primary-container/20 transition-colors rounded-full px-4 py-2 cursor-pointer">
              Support
            </span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-primary-container/20 transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
            account_circle
          </span>
        </button>
      </div>
    </header>
  )
}
