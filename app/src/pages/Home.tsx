import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useApp } from '../context/AppContext'

const MOODS = [
  { emoji: '😔', label: 'Struggling', response: 'That\'s okay. Hard days are part of the journey. You showed up — that already takes courage.', color: 'bg-blue-50 border-blue-200' },
  { emoji: '😐', label: 'Getting by', response: 'One foot in front of the other. That\'s enough for today. Check your roadmap for a small next step.', color: 'bg-gray-50 border-gray-200' },
  { emoji: '🙂', label: 'Doing okay', response: 'Good to hear. Momentum builds from days like today. Keep going — you\'re closer than you think.', color: 'bg-yellow-50 border-yellow-200' },
  { emoji: '😊', label: 'Feeling good', response: 'Love to see it! A good day is worth holding on to. Share that energy in the community.', color: 'bg-green-50 border-green-200' },
]

const RIGHTS = [
  "You have the right to apply for <b>SNAP benefits</b> within 30 days of release — even with a felony record in NY.",
  "NYC landlords <b>cannot automatically reject you</b> for housing based on a criminal record — they must do an individual assessment under the Fair Chance Act.",
  "You have the right to <b>emergency shelter</b> in NYC regardless of your record. Call 311 and say \"I need shelter\" — they cannot turn you away.",
]

export default function Home() {
  const navigate = useNavigate()
  const [rightsIndex, setRightsIndex] = useState(0)
  const [mood, setMood] = useState<number | null>(null)
  const { roadmap, currentStep } = useApp()
  const hasRoadmap = !!roadmap
  const totalSteps = roadmap?.sections.reduce((sum, s) => sum + s.steps.length, 0) ?? 0
  const allDone = hasRoadmap && currentStep >= totalSteps

  const features = [
    {
      icon: 'route',
      title: 'My Roadmap',
      description: allDone
        ? 'You completed every step. Amazing!'
        : hasRoadmap
          ? 'Continue your personalized journey.'
          : 'A step-by-step plan tailored to your needs, borough, and goals.',
      color: 'bg-primary-container',
      textColor: 'text-on-primary-container',
      shadow: 'shadow-[0_6px_0_0_#9d4f00]',
      action: hasRoadmap ? '/roadmap' : '/question/userType',
      actionLabel: allDone ? 'View Roadmap' : hasRoadmap ? 'View Roadmap' : 'Start My Plan',
      badge: allDone ? 'Completed' : hasRoadmap ? 'In Progress' : 'Recommended',
      primary: true,
    },
    {
      icon: 'menu_book',
      title: 'Resource Directory',
      description: 'Browse verified NYC organizations for housing, jobs, ID, health, and more.',
      color: 'bg-secondary-container',
      textColor: 'text-on-secondary-container',
      shadow: 'shadow-[0_6px_0_0_#00635d]',
      action: '/resources',
      actionLabel: 'Browse Resources',
      badge: null,
      primary: false,
    },
    {
      icon: 'groups',
      title: 'Community',
      description: 'Connect with others who are on the same path. You are not alone.',
      color: 'bg-tertiary-container',
      textColor: 'text-on-tertiary-container',
      shadow: 'shadow-[0_6px_0_0_#005e88]',
      action: '/community',
      actionLabel: 'Join Community',
      badge: null,
      primary: false,
    },
  ]

  return (
    <main className="flex-grow max-w-3xl mx-auto w-full px-6 pt-8 pb-24">
      {/* Greeting */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-highest shrink-0">
            <img alt="Profile" src="/images/avatar-profile.png" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-on-surface-variant font-medium text-sm">Welcome back</p>
            <h1 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
              Ready for your fresh start?
            </h1>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feature) => (
            <button
              key={feature.title}
              onClick={() => navigate(feature.action)}
              className={`${feature.color} ${feature.shadow} p-6 rounded-lg text-left active:translate-y-1 active:shadow-none transition-all cursor-pointer flex flex-col gap-4 ${
                feature.primary ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center">
                  <span className={`material-symbols-outlined ${feature.textColor} text-3xl`}>{feature.icon}</span>
                </div>
                {feature.badge && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {feature.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-headline font-extrabold text-xl ${feature.textColor} mb-1`}>{feature.title}</h3>
                <p className={`text-sm ${feature.textColor} opacity-80 leading-relaxed`}>{feature.description}</p>
              </div>
              <div className={`flex items-center gap-2 font-headline font-bold text-sm ${feature.textColor}`}>
                {feature.actionLabel}
                <Icon name="arrow_forward" className="text-sm" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Encouragement Banner */}
      <section className="mt-12">
        <div className="relative bg-[#007164] rounded-lg shadow-[0_5px_0_0_#00493f] overflow-hidden p-8">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 right-8 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute top-6 right-24 w-12 h-12 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Daily Reminder</p>
            <p className="text-white font-headline font-extrabold text-2xl leading-snug mb-4">
              Every step forward counts,<br />no matter how small.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">🌱</div>
              <p className="text-white/70 text-sm">You've got a whole city rooting for you.</p>
            </div>
          </div>
        </div>

        {/* 3 info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

          {/* Tip of the Day */}
          <div className="bg-[#fdc003]/15 rounded-lg shadow-[0_4px_0_0_#c49500] p-5 flex flex-col gap-3 sm:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <p className="font-headline font-extrabold text-[#7a5c00] text-xs uppercase tracking-widest">Tip of the Day</p>
            </div>
            <p className="text-[#5a4200] text-sm leading-relaxed font-medium">
              Bring 2 forms of ID to any shelter or benefits intake. A library card + birth certificate works.
            </p>
          </div>

          {/* Daily Check-in */}
          <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_0_0_#bcb9b3] p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌤️</span>
              <p className="font-headline font-extrabold text-on-surface-variant text-xs uppercase tracking-widest">Daily Check-in</p>
            </div>
            {mood === null ? (
              <>
                <p className="text-on-surface text-sm font-medium">How are you feeling today?</p>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {MOODS.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => setMood(i)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-container-high transition-colors"
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-[10px] text-on-surface-variant font-semibold leading-tight text-center">{m.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{MOODS[mood].emoji}</span>
                  <p className="text-on-surface text-sm font-medium leading-relaxed">{MOODS[mood].response}</p>
                </div>
                <button
                  onClick={() => setMood(null)}
                  className="mt-auto text-on-surface-variant text-xs underline text-left"
                >
                  Change my answer
                </button>
              </>
            )}
          </div>

          {/* Know Your Rights */}
          <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_0_0_#bcb9b3] p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚖️</span>
              <p className="font-headline font-extrabold text-on-surface-variant text-xs uppercase tracking-widest">Know Your Rights</p>
            </div>
            <p
              className="text-on-surface text-sm leading-relaxed font-medium flex-1"
              dangerouslySetInnerHTML={{ __html: RIGHTS[rightsIndex] }}
            />
            <div className="mt-auto flex items-center gap-1.5">
              {RIGHTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRightsIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === rightsIndex ? 'bg-[#007164]' : 'bg-gray-200'}`}
                />
              ))}
              <span className="text-on-surface-variant text-xs ml-1">{rightsIndex + 1} of {RIGHTS.length}</span>
              <button
                onClick={() => setRightsIndex((rightsIndex + 1) % RIGHTS.length)}
                className="ml-auto text-[#007164] hover:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
