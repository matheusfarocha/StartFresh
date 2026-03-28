import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <main className="relative min-h-[819px] flex flex-col items-center justify-center px-6 pt-12 pb-24 max-w-7xl mx-auto">
      {/* Decorative Organic Blobs */}
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
              onClick={() => navigate('/question/borough')}
              className="group relative flex items-center justify-center gap-3 bg-primary text-on-primary px-10 py-5 rounded-xl font-headline font-bold text-xl shadow-[0_20px_40px_-10px_rgba(157,79,0,0.3)] active:scale-95 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(157,79,0,0.4)] cursor-pointer"
            >
              Get Started
              <Icon name="arrow_forward" className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="flex items-center justify-center gap-3 bg-surface-container-high text-on-surface px-10 py-5 rounded-xl font-headline font-semibold text-xl hover:bg-surface-container-highest transition-colors active:scale-95 duration-200 cursor-pointer">
              Learn More
            </button>
          </div>

          {/* Bento-lite info boxes */}
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
  )
}
