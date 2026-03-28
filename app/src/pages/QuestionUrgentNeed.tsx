import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'
import { generateRoadmap } from '../data/roadmapEngine'

const needOptions = [
  { label: 'A place to stay', icon: 'home', subtitle: '', key: 'housing' },
  { label: 'ID & Benefits', icon: 'badge', subtitle: 'Birth certificates, food stamps, etc.', key: 'id' },
  { label: 'Finding work', icon: 'work', subtitle: '', key: 'employment' },
  { label: 'Mental health support', icon: 'psychology', subtitle: '', key: 'mentalHealth' },
]

export default function QuestionUrgentNeed() {
  const navigate = useNavigate()
  const { borough, timeAway, setNeeds, setRoadmap } = useApp()

  const handleSelect = (needKey: string) => {
    const needs = [needKey]
    setNeeds(needs)
    const roadmap = generateRoadmap({
      borough: borough ?? 'default',
      timeAway: timeAway ?? 'Less than 1 year',
      needs,
    })
    setRoadmap(roadmap)
    navigate('/generating')
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Organic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary-fixed opacity-20 organic-blob rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary-container opacity-10 organic-blob rounded-full" />

      <div className="w-full max-w-4xl mx-auto z-10">
        {/* Progress */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <span className="font-headline font-bold text-primary tracking-widest text-sm uppercase">Step 3 of 3</span>
          <div className="w-full max-w-md h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-full transition-all duration-700" />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Mascot */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-8 mt-4">
            <div className="relative group">
              <div className="w-48 h-48 bg-secondary-container rounded-full flex items-center justify-center relative overflow-visible">
                <img
                  alt="Supportive mascot"
                  className="w-40 h-40 object-contain drop-shadow-lg transform transition-transform group-hover:scale-105"
                  src="/images/mascot-urgent.png"
                />
              </div>
              {/* Conversational Bubble */}
              <div className="mt-8 bg-surface-container-lowest p-6 rounded-lg rounded-tl-none shadow-[0_24px_48px_-12px_rgba(55,56,49,0.06)] relative">
                <p className="font-body text-lg leading-relaxed text-on-surface">
                  "Almost there! Knowing what you need help with first lets me show you the most useful resources right away. You're doing great."
                </p>
                <div
                  className="absolute -top-4 left-0 w-8 h-8 bg-surface-container-lowest"
                  style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}
                />
              </div>
            </div>
          </div>

          {/* Right: Options */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
              What is your most urgent need right now?
            </h1>

            <div className="grid grid-cols-1 gap-4">
              {needOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleSelect(option.key)}
                  className="group flex items-center p-6 bg-surface-container-lowest hover:bg-primary-container/10 border-2 border-transparent hover:border-primary-container rounded-xl transition-all duration-300 text-left active:scale-[0.98] cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mr-6 group-hover:bg-primary-container transition-colors">
                    <Icon name={option.icon} className="text-primary group-hover:text-on-primary-container" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-headline text-xl font-bold text-on-surface">{option.label}</span>
                    {option.subtitle && (
                      <span className="font-body text-sm text-on-surface-variant">{option.subtitle}</span>
                    )}
                  </div>
                  <Icon
                    name="arrow_forward"
                    className="ml-auto text-outline-variant opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
            </div>

            {/* Back nav */}
            <div className="flex items-center justify-between pt-8">
              <button
                onClick={() => navigate('/question/time-away')}
                className="flex items-center gap-2 font-headline font-bold text-on-surface-variant hover:text-primary transition-colors px-6 py-3 rounded-full hover:bg-surface-container active:scale-95 cursor-pointer"
              >
                <Icon name="arrow_back" />
                Previous step
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
