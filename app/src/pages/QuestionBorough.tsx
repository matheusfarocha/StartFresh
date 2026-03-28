import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

const boroughs = [
  { name: 'Bronx', icon: 'location_city' },
  { name: 'Brooklyn', icon: 'apartment' },
  { name: 'Manhattan', icon: 'domain' },
  { name: 'Queens', icon: 'holiday_village' },
  { name: 'Staten Island', icon: 'foundation' },
]

export default function QuestionBorough() {
  const navigate = useNavigate()

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="font-headline font-bold text-primary tracking-tight">Step 1 of 3</span>
          <span className="text-on-surface-variant font-medium">Getting Started</span>
        </div>
        <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary w-1/3 rounded-full transition-all duration-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Questions */}
        <div className="lg:col-span-8">
          <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
            Which borough are you returning to?
          </h1>
          <p className="text-lg text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
            Selecting your borough helps us connect you with local neighborhood resources and support teams closest to your new home.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boroughs.map((borough) => (
              <button
                key={borough.name}
                onClick={() => navigate('/question/time-away')}
                className={`group flex items-center justify-between p-6 bg-surface-container-lowest hover:bg-primary-container/10 border-2 border-transparent hover:border-primary-container rounded-xl transition-all duration-300 text-left active:scale-[0.98] cursor-pointer ${
                  borough.name === 'Staten Island' ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container transition-colors">
                    <Icon name={borough.icon} className="text-3xl" />
                  </div>
                  <span className="font-headline text-xl font-bold">{borough.name}</span>
                </div>
                <Icon name="arrow_forward" className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="relative p-8 bg-secondary-container rounded-xl shadow-lg transform rotate-1">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-container rounded-full blur-2xl opacity-40 [contain:strict] [will-change:transform]" />
            <div className="flex flex-col gap-4 relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md -mt-12 self-start border-4 border-secondary-container overflow-hidden">
                <img
                  alt="FreshStart Mascot"
                  className="w-10 h-10"
                  src="/images/mascot-borough.png"
                />
              </div>
              <h3 className="font-headline font-bold text-on-secondary-container text-xl">Friendly Tip</h3>
              <p className="text-on-secondary-container leading-relaxed">
                "Don't worry if you're not sure about your final address yet! Picking the borough where you'll be spending the most time is a great start."
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-surface-container-low rounded-lg">
            <div className="flex items-center gap-3 text-secondary font-bold mb-2">
              <Icon name="verified_user" />
              <span className="font-headline">Privacy First</span>
            </div>
            <p className="text-sm text-on-surface-variant">
              Your location data is only used to personalize your resource list. We never share your personal information without your consent.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
