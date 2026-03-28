import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'

const timeOptions = [
  { label: 'Less than 1 year', icon: 'schedule' },
  { label: '1\u20135 years', icon: 'calendar_today' },
  { label: '5\u201310 years', icon: 'event_repeat' },
  { label: '10\u201320 years', icon: 'history' },
  { label: '20+ years', icon: 'update' },
]

export default function QuestionTimeAway() {
  const navigate = useNavigate()
  const { setTimeAway } = useApp()

  return (
    <main className="min-h-screen max-w-screen-xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center">
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-16">
        <div className="flex justify-between items-end mb-4 px-2">
          <span className="font-headline font-bold text-primary text-xl">Step 2 of 3</span>
          <span className="font-body text-on-surface-variant font-medium">Getting closer</span>
        </div>
        <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-primary to-primary-container rounded-full shadow-sm transition-all duration-500" />
        </div>
      </div>

      {/* Conversational Layout */}
      <div className="w-full grid md:grid-cols-12 gap-12 items-start">
        {/* Left: Mascot */}
        <div className="md:col-span-5 flex flex-col items-center md:items-end text-center md:text-right relative">
          <div className="relative mb-8">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-fixed opacity-40 blur-3xl rounded-full [contain:strict] [will-change:transform]" />
            <div className="w-56 h-56 bg-surface-container-highest rounded-full flex items-center justify-center overflow-hidden shadow-sm relative">
              <img
                alt="Mascot"
                className="w-40 h-40 object-contain drop-shadow-xl"
                src="/images/mascot-timeaway.png"
              />
            </div>
          </div>
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface leading-tight mb-6">
            How long were <br className="hidden md:block" />
            you away?
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed">
            NYC has changed a lot. Whether it's been a few months or several decades, we want to tailor our advice so it makes sense for the modern city you're returning to.
          </p>
        </div>

        {/* Right: Options */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            {timeOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => { setTimeAway(option.label); navigate('/question/urgent-need') }}
                className="group flex items-center justify-between px-8 py-7 bg-surface-container-lowest hover:bg-primary-container/20 border-b-2 border-transparent hover:border-primary transition-all duration-300 rounded-xl shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Icon name={option.icon} />
                  </div>
                  <span className="font-headline font-bold text-2xl text-on-surface">{option.label}</span>
                </div>
                <Icon name="arrow_forward_ios" className="text-primary-fixed-dim group-hover:translate-x-2 transition-transform" />
              </button>
            ))}
          </div>

          {/* Info box */}
          <div className="mt-8 p-8 bg-secondary-container/20 rounded-xl flex gap-4 items-start">
            <Icon name="info" filled className="text-secondary text-3xl" />
            <div>
              <h4 className="font-headline font-bold text-secondary text-lg mb-1">Why do we ask this?</h4>
              <p className="font-body text-on-surface opacity-80 leading-relaxed">
                A lot has changed—from how we use the MTA to how housing applications work online. Your answer helps us skip the basics if you've been around, or explain new systems if you've been away longer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-16 flex justify-center">
        <button
          onClick={() => navigate('/question/borough')}
          className="flex items-center gap-2 px-8 py-3 text-on-surface-variant font-headline font-bold hover:text-primary transition-colors group cursor-pointer"
        >
          <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
          Go back to previous step
        </button>
      </div>
    </main>
  )
}
