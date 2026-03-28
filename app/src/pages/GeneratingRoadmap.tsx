import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

export default function GeneratingRoadmap() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/roadmap')
    }, 3000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[819px] px-6 py-12 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-fixed opacity-20 rounded-full floating-blob" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary-container opacity-10 rounded-full floating-blob" />

      <div className="w-full max-w-2xl text-center space-y-12 z-10">
        {/* Mascot with Progress Ring */}
        <div className="relative inline-block">
          <div className="w-64 h-64 mx-auto rounded-full bg-surface-container-lowest shadow-[0_32px_64px_-16px_rgba(0,113,100,0.08)] flex items-center justify-center overflow-visible relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90 scale-110">
              <circle
                className="text-secondary opacity-20"
                cx="50%"
                cy="50%"
                fill="transparent"
                r="48%"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle
                className="text-secondary loading-pulse"
                cx="50%"
                cy="50%"
                fill="transparent"
                r="48%"
                stroke="currentColor"
                strokeDasharray="300"
                strokeDashoffset="100"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
            <img
              alt="Mascot thinking"
              className="w-48 h-48 object-contain z-10"
              src="/images/mascot-generating.png"
            />
          </div>
          {/* Decorative floating elements */}
          <div className="absolute -top-4 -right-4 p-4 bg-surface-container-highest rounded-xl shadow-sm rotate-12">
            <Icon name="edit_note" className="text-primary text-3xl" />
          </div>
          <div className="absolute bottom-4 -left-8 p-3 bg-secondary-container rounded-xl shadow-sm -rotate-12">
            <Icon name="auto_awesome" className="text-on-secondary-container text-2xl" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight">
            Hang tight, we're building your{' '}
            <span className="text-primary italic">personal plan...</span>
          </h1>
          <p className="font-body text-xl text-on-surface-variant max-w-lg mx-auto leading-relaxed">
            Our mentor is carefully organizing your resources based on your unique goals and experiences.
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto pt-8">
          <div className="flex items-center gap-3 p-4 bg-surface-container rounded-lg">
            <Icon name="check_circle" filled className="text-secondary" />
            <span className="text-sm font-medium text-on-surface">Goals Analyzed</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-container rounded-lg">
            <div className="w-2 h-2 rounded-full bg-primary loading-pulse" />
            <span className="text-sm font-medium text-on-surface">Curating Steps</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-surface-container/50 rounded-lg opacity-60">
            <Icon name="radio_button_unchecked" className="text-outline-variant" />
            <span className="text-sm font-medium text-on-surface">Finalizing</span>
          </div>
        </div>

        {/* Privacy */}
        <div className="mt-16 inline-flex items-center justify-center gap-2 text-on-surface-variant/80 bg-surface-container-low/50 py-3 px-6 rounded-full border border-outline-variant/10">
          <Icon name="lock" className="text-lg" />
          <span className="text-sm font-medium">Your data is encrypted and 100% private to you.</span>
        </div>
      </div>
    </main>
  )
}
