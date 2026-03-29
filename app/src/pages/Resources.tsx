import { useState, useMemo } from 'react'
import { RESOURCES } from '../data/resources'
import type { ResourceCategory } from '../data/resources'

const TABS: { key: ResourceCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all',          label: 'All',           icon: 'apps' },
  { key: 'id',           label: 'ID & Docs',     icon: 'badge' },
  { key: 'housing',      label: 'Housing',       icon: 'house' },
  { key: 'food',         label: 'Food',          icon: 'restaurant' },
  { key: 'employment',   label: 'Jobs',          icon: 'work' },
  { key: 'mentalHealth', label: 'Mental Health',  icon: 'psychology' },
  { key: 'legal',        label: 'Legal',         icon: 'gavel' },
  { key: 'family',       label: 'Family',        icon: 'family_restroom' },
  { key: 'education',    label: 'Education',     icon: 'school' },
  { key: 'community',    label: 'Community',     icon: 'groups' },
]

const CATEGORY_GRADIENT: Record<string, string> = {
  id:           'from-[#2d6a4f] to-[#52b788]',
  housing:      'from-[#1a3d2b] to-[#2d6a4f]',
  food:         'from-[#e07b2a] to-[#fdc003]',
  employment:   'from-[#52b788] to-[#2d6a4f]',
  mentalHealth: 'from-[#6b6b63] to-[#9e9e94]',
  legal:        'from-[#9d4f00] to-[#e07b2a]',
  family:       'from-[#007164] to-[#52b788]',
  education:    'from-[#00486a] to-[#69b8ee]',
  community:    'from-[#007164] to-[#00635d]',
}

const CATEGORY_ICON: Record<string, string> = {
  id: 'badge', housing: 'house', food: 'restaurant',
  employment: 'work', mentalHealth: 'psychology', legal: 'gavel',
  family: 'family_restroom', education: 'school', community: 'groups',
}

// Only show resources that have a website AND a description
const VALID_RESOURCES = RESOURCES.filter(r => r.website && r.description)

function ResourceCard({ resource, category }: { resource: typeof VALID_RESOURCES[0]; category: string }) {
  const gradient = CATEGORY_GRADIENT[category] ?? 'from-secondary to-secondary-container'
  const icon = CATEGORY_ICON[category] ?? 'info'

  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
      <div className={`h-32 rounded-lg overflow-hidden mb-4 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <span className="material-symbols-outlined text-white/80 text-5xl">{icon}</span>
        <span className="absolute bottom-2 left-2 bg-black/20 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          {resource.source}
        </span>
      </div>

      <div className="flex-1 flex flex-col">
        <h4 className="font-headline font-bold text-base text-on-surface mb-2 leading-snug">
          {resource.name}
        </h4>
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-3 leading-relaxed flex-1">
          {resource.description}
        </p>

        <div className="flex flex-col gap-1.5 mb-4">
          {resource.phone && (
            <a href={`tel:${resource.phone.replace(/\D/g, '')}`}
               className="flex items-center gap-2 text-xs text-secondary font-bold hover:underline">
              <span className="material-symbols-outlined text-sm">call</span>
              {resource.phone}
            </a>
          )}
          {resource.address && (
            <div className="flex items-start gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">location_on</span>
              <span className="line-clamp-1">{resource.address}</span>
            </div>
          )}
          {resource.hours && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-sm shrink-0">schedule</span>
              {resource.hours}
            </div>
          )}
        </div>

        <a
          href={resource.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full py-3 rounded-md bg-surface-container-highest text-on-surface font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-primary-container/20 transition-all"
        >
          Visit Site
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
    </div>
  )
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState<ResourceCategory | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const displayed = useMemo(() => {
    let results = activeTab === 'all'
      ? VALID_RESOURCES
      : VALID_RESOURCES.filter(r => r.categories.includes(activeTab as ResourceCategory))

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase()
      results = results.filter(r =>
        `${r.name} ${r.description} ${r.tags.join(' ')}`.toLowerCase().includes(q)
      )
    }

    return results
  }, [activeTab, searchTerm])

  const countForTab = (key: string) =>
    key === 'all'
      ? VALID_RESOURCES.length
      : VALID_RESOURCES.filter(r => r.categories.includes(key as ResourceCategory)).length

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-24">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight mb-4">
          Resource Directory
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed mx-auto mb-6">
          Verified NYC organizations for housing, jobs, ID, legal aid, food, and more. Every link checked, every phone number real.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <input
            className="w-full bg-surface-container-highest rounded-xl px-6 py-4 text-base focus:outline-none focus:ring-3 focus:ring-primary-fixed border-none font-body"
            placeholder="Search for housing, legal aid, jobs..."
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
        </div>
      </header>

      {/* Tabs */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {TABS.map(tab => {
            const active = activeTab === tab.key
            const count = countForTab(tab.key)
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-primary text-on-primary shadow-[0_3px_0_0_#7a3c00]'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  active ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Count */}
      <p className="text-sm text-on-surface-variant font-medium mb-6 text-center">
        {displayed.length} resource{displayed.length !== 1 ? 's' : ''} found
        {searchTerm && ` for "${searchTerm}"`}
      </p>

      {/* Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.length > 0 ? (
          displayed.map(r => (
            <ResourceCard key={r.id} resource={r} category={r.categories[0]} />
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
            <p className="font-headline font-bold text-lg mb-1">No results found</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="mt-12 p-5 bg-surface-container rounded-xl text-center">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          All resources verified against NYC.gov, NYC DOC, HRA, and partner organizations.
          If anything looks outdated, call <span className="text-secondary font-bold">311</span>.
        </p>
      </div>
    </main>
  )
}
