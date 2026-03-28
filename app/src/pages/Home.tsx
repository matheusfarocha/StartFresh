import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

const features = [
  {
    icon: 'route',
    title: 'My Roadmap',
    description: 'A step-by-step plan tailored to your needs, borough, and goals.',
    color: 'bg-primary-container',
    textColor: 'text-on-primary-container',
    shadow: 'shadow-[0_6px_0_0_#9d4f00]',
    action: '/question/borough',
    actionLabel: 'Start My Plan',
    primary: true,
  },
  {
    icon: 'menu_book',
    title: 'Resource Directory',
    description: 'Browse verified NYC organizations for housing, jobs, ID, health, and more.',
    color: 'bg-secondary-container',
    textColor: 'text-on-secondary-container',
    shadow: 'shadow-[0_6px_0_0_#00635d]',
    action: '#',
    actionLabel: 'Browse Resources',
    primary: false,
  },
  {
    icon: 'face',
    title: 'Meet Your Mentor',
    description: 'Get guidance from a friendly AI companion who understands your journey.',
    color: 'bg-[#fdc003]',
    textColor: 'text-[#3d2b00]',
    shadow: 'shadow-[0_6px_0_0_#805f00]',
    action: '#',
    actionLabel: 'Say Hello',
    primary: false,
  },
  {
    icon: 'groups',
    title: 'Community',
    description: 'Connect with others who are on the same path. You are not alone.',
    color: 'bg-tertiary-container',
    textColor: 'text-on-tertiary-container',
    shadow: 'shadow-[0_6px_0_0_#005e88]',
    action: '#',
    actionLabel: 'Coming Soon',
    primary: false,
  },
]

export default function Home() {
  const navigate = useNavigate()

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

        {/* Quick status card */}
        <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0_4px_0_0_#bcb9b3] flex items-center gap-5">
          <div className="w-16 h-16 bg-secondary-container rounded-lg flex items-center justify-center shadow-[0_3px_0_0_#00635d] shrink-0">
            <Icon name="emoji_events" className="text-on-secondary-container text-3xl" />
          </div>
          <div className="flex-grow">
            <p className="font-headline font-bold text-on-surface">Your Journey Awaits</p>
            <p className="text-sm text-on-surface-variant mt-1">
              Answer 3 quick questions and we'll build a personalized action plan for you.
            </p>
          </div>
          <Icon name="arrow_forward" className="text-primary text-2xl shrink-0" />
        </div>
      </section>

      {/* Feature Grid */}
      <section>
        <h2 className="font-headline font-extrabold text-xl text-on-surface tracking-tight mb-6 uppercase">
          What would you like to do?
        </h2>

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
                <div className={`w-14 h-14 rounded-lg bg-white/20 flex items-center justify-center`}>
                  <span className={`material-symbols-outlined ${feature.textColor} text-3xl`}>{feature.icon}</span>
                </div>
                {feature.primary && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Recommended
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

      {/* Quick Links */}
      <section className="mt-12">
        <h2 className="font-headline font-extrabold text-xl text-on-surface tracking-tight mb-6 uppercase">
          Quick Access
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: 'call', label: 'Hotlines' },
            { icon: 'map', label: 'Nearby' },
            { icon: 'description', label: 'Documents' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-surface-container-lowest p-5 rounded-lg shadow-[0_4px_0_0_#bcb9b3] flex flex-col items-center gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                <Icon name={item.icon} className="text-primary text-2xl" />
              </div>
              <span className="font-headline font-bold text-sm text-on-surface">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
