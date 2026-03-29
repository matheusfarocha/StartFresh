import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

export default function Welcome() {
  const navigate = useNavigate()
  const learnMoreRef = useRef<HTMLElement>(null)

  return (
    <>
      {/* Hero */}
      <main className="relative min-h-[819px] flex flex-col items-center justify-center px-6 pt-12 pb-24 max-w-7xl mx-auto">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-secondary-fixed organic-blob rounded-full" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-primary-fixed organic-blob rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left: Mascot */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-surface-bright/70 rounded-xl -rotate-3 scale-105 shadow-sm" />
              <div className="relative bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_-16px_rgba(55,56,49,0.08)]">
                <img
                  alt="Friendly illustrated mascot"
                  className="w-full max-w-sm mx-auto object-contain"
                  src="/images/mascot-welcome.png"
                />
                <div className="absolute -bottom-6 -right-6 bg-secondary-container text-on-secondary-container py-3 px-6 rounded-full font-headline font-bold shadow-lg rotate-3">
                  Let's take the first step together
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start text-left space-y-8">
            <div className="space-y-4">
              <span className="inline-block py-1 px-4 bg-primary-container/20 text-on-primary-container rounded-full font-label font-bold text-sm tracking-widest uppercase">
                Starting Fresh in NYC
              </span>
              <h1 className="font-headline font-extrabold text-5xl md:text-7xl text-on-background leading-[1.1] tracking-tight">
                Welcome back.
                <br />
                <span className="text-primary">We've got you.</span>
              </h1>
            </div>

            <p className="font-body text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed">
              Returning to society is a journey, not a sprint. FreshStart helps you navigate your first days out in NYC with a clear, personal plan that feels like home.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/login')}
                className="group relative flex items-center justify-center gap-3 bg-primary text-on-primary px-10 py-5 rounded-xl font-headline font-bold text-xl shadow-[0_20px_40px_-10px_rgba(157,79,0,0.3)] active:scale-95 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(157,79,0,0.4)] cursor-pointer"
              >
                Get Started
                <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => learnMoreRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-3 bg-surface-container-high text-on-surface px-10 py-5 rounded-xl font-headline font-semibold text-xl hover:bg-surface-container-highest transition-colors active:scale-95 duration-200 cursor-pointer"
              >
                Learn More
                <Icon name="keyboard_arrow_down" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-3 border border-outline-variant/10">
                <Icon name="verified" filled className="text-secondary" />
                <span className="font-label font-medium text-sm">Personal Plan</span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg flex items-center gap-3 border border-outline-variant/10">
                <Icon name="location_on" filled className="text-secondary" />
                <span className="font-label font-medium text-sm">NYC Resources</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Learn More Section */}
      <section ref={learnMoreRef} className="bg-surface-container px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight mb-4">
              How FreshStart works
            </h2>
            <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto">
              Three simple steps to your personalized reentry plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'chat',
                step: '1',
                title: 'Answer a few questions',
                desc: 'Tell us your borough, your situation, and what you need most. Takes about 2 minutes.',
              },
              {
                icon: 'auto_awesome',
                step: '2',
                title: 'Get your personal roadmap',
                desc: 'We build a step-by-step plan with real NYC resources — addresses, phone numbers, and what to bring.',
              },
              {
                icon: 'check_circle',
                step: '3',
                title: 'Complete steps at your pace',
                desc: 'Track your progress, mark steps done, and chat with Sage if you need help along the way.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_6px_0_0_#bcb9b3] text-center">
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_4px_0_0_#9d4f00]">
                  <Icon name={item.icon} className="text-on-primary-container text-3xl" />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-primary mb-2">Step {item.step}</div>
                <h3 className="font-headline font-extrabold text-xl text-on-surface mb-3">{item.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we help with */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-on-surface tracking-tight mb-4">
              What we help with
            </h2>
            <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto">
              Real resources for real needs — all verified, all in NYC.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: 'badge', label: 'ID & Documents', color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
              { icon: 'house', label: 'Housing', color: 'bg-primary-container', textColor: 'text-on-primary-container' },
              { icon: 'restaurant', label: 'Food & Benefits', color: 'bg-[#fdc003]', textColor: 'text-[#3d2b00]' },
              { icon: 'work', label: 'Employment', color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
              { icon: 'psychology', label: 'Mental Health', color: 'bg-surface-container-highest', textColor: 'text-on-surface' },
              { icon: 'gavel', label: 'Legal Help', color: 'bg-primary-container', textColor: 'text-on-primary-container' },
              { icon: 'school', label: 'Education', color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
              { icon: 'smartphone', label: 'Phone Access', color: 'bg-[#fdc003]', textColor: 'text-[#3d2b00]' },
            ].map((item) => (
              <div key={item.label} className={`${item.color} p-5 rounded-xl flex flex-col items-center gap-3 text-center shadow-[0_4px_0_0_rgba(0,0,0,0.1)]`}>
                <span className={`material-symbols-outlined ${item.textColor} text-3xl`}>{item.icon}</span>
                <span className={`font-headline font-bold text-sm ${item.textColor}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline font-extrabold text-4xl text-on-primary tracking-tight mb-4">
            Ready to start your journey?
          </h2>
          <p className="font-body text-xl text-on-primary/80 mb-8 max-w-xl mx-auto">
            It takes about 2 minutes. No personal data required.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group inline-flex items-center gap-3 bg-surface-container-lowest text-primary px-10 py-5 rounded-xl font-headline font-bold text-xl shadow-[0_6px_0_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,0.2)] transition-all cursor-pointer"
          >
            Get Started
            <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </>
  )
}
