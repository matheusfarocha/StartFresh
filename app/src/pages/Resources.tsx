import { useEffect, useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import {
  fetchHousingResources,
  fetchEmploymentResources,
  fetchMentalHealthResources,
  fetchLegalAidResources,
  fetchFoodResources,
  type NormalizedResource,
} from '../lib/resourcesAPI'
import { RESOURCES } from '../data/resources'

// ── Category config ───────────────────────────────────────────────
const TABS = [
  { key: 'all',          label: 'All Resources',  icon: 'apps' },
  { key: 'housing',      label: 'Housing',         icon: 'house' },
  { key: 'id',           label: 'ID & Docs',       icon: 'badge' },
  { key: 'food',         label: 'Food',            icon: 'restaurant' },
  { key: 'employment',   label: 'Employment',      icon: 'work' },
  { key: 'mentalHealth', label: 'Mental Health',   icon: 'psychology' },
  { key: 'legal',        label: 'Legal',           icon: 'gavel' },
]

const CATEGORY_GRADIENT: Record<string, string> = {
  housing:      'from-[#1a3d2b] to-[#2d6a4f]',
  id:           'from-[#2d6a4f] to-[#52b788]',
  food:         'from-[#e07b2a] to-[#fdc003]',
  employment:   'from-[#52b788] to-[#2d6a4f]',
  mentalHealth: 'from-[#6b6b63] to-[#9e9e94]',
  legal:        'from-[#9d4f00] to-[#e07b2a]',
  community:    'from-[#007164] to-[#00635d]',
}

const CATEGORY_ICON: Record<string, string> = {
  housing: 'house', id: 'badge', food: 'restaurant',
  employment: 'work', mentalHealth: 'psychology', legal: 'gavel',
  'ID & Benefits': 'badge', 'Mental Health': 'psychology',
  Housing: 'house', Employment: 'work', Legal: 'gavel',
  Benefits: 'restaurant', Food: 'restaurant',
}

// ── Static fallback: convert resources.ts entries to NormalizedResource ──
function staticFallback(category: string): NormalizedResource[] {
  return RESOURCES
    .filter(r => r.categories.includes(category as never))
    .slice(0, 6)
    .map(r => ({
      id:          r.id,
      title:       r.name,
      category,
      description: r.description,
      phone:       r.phone ?? null,
      address:     r.address ?? null,
      link:        r.website ?? null,
      source:      'static' as const,
    }))
}

// ID steps from roadmapEngine (no reliable public API)
const ID_STATIC: NormalizedResource[] = [
  { id: 'id-s1', title: 'NYC Vital Records — Birth Certificate', category: 'id',
    description: 'Free birth certificates within 30 days of release. Bring release paperwork. No appointment needed.',
    phone: '(212) 788-4500', address: '125 Worth St, Manhattan', link: 'https://www.nyc.gov/vitalrecords', source: 'static' },
  { id: 'id-s2', title: 'NYS DMV — Free State ID', category: 'id',
    description: 'Free state ID for recently released people. Bring birth certificate and release paperwork.',
    phone: '(518) 473-5595', address: 'Multiple boroughs — dmv.ny.gov for nearest', link: 'https://dmv.ny.gov', source: 'static' },
  { id: 'id-s3', title: 'Social Security Administration', category: 'id',
    description: 'Free replacement Social Security card. Apply online or walk in. Card arrives in 2–4 weeks.',
    phone: '1-800-772-1213', address: 'Multiple NYC offices — ssa.gov/locator', link: 'https://www.ssa.gov', source: 'static' },
]

// ── Skeleton card ─────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col animate-pulse">
      <div className="h-36 rounded-lg bg-surface-container mb-4" />
      <div className="h-3 w-1/3 bg-surface-container rounded mb-3" />
      <div className="h-4 w-2/3 bg-surface-container rounded mb-2" />
      <div className="h-3 w-full bg-surface-container rounded mb-1" />
      <div className="h-3 w-4/5 bg-surface-container rounded mb-6" />
      <div className="mt-auto h-10 w-full bg-surface-container rounded-md" />
    </div>
  )
}

// ── Resource card ─────────────────────────────────────────────────
function ResourceCard({ resource }: { resource: NormalizedResource }) {
  const catKey = resource.category.toLowerCase().replace(/\s+&\s+/g, '').replace(/\s+/g, '')
  const gradient = CATEGORY_GRADIENT[resource.category] ?? CATEGORY_GRADIENT[catKey] ?? 'from-secondary to-secondary-container'
  const icon = CATEGORY_ICON[resource.category] ?? 'info'

  return (
    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
      {/* Header visual */}
      <div className={`h-36 rounded-lg overflow-hidden mb-4 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
        <span className="material-symbols-outlined text-white/80 text-5xl">{icon}</span>
        {resource.emergency && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
            Emergency
          </span>
        )}
        {resource.source === 'api' && (
          <span className="absolute bottom-2 left-2 bg-black/30 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            NYC Open Data
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
          {resource.category}
        </span>
        <h4 className="font-headline font-bold text-base text-on-surface mb-2 leading-snug">
          {resource.title}
        </h4>
        <p className="text-sm text-on-surface-variant mb-4 line-clamp-3 leading-relaxed flex-1">
          {resource.description || 'Contact for more information.'}
        </p>

        {/* Contact details */}
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
              <span className="material-symbols-outlined text-sm text-primary flex-shrink-0 mt-0.5">location_on</span>
              <span className="line-clamp-1">{resource.address}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        {resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full py-3 rounded-md bg-surface-container-highest text-on-surface font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-primary-container/20 transition-all"
          >
            Visit Site
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        ) : (
          <div className="mt-auto w-full py-3 rounded-md bg-surface-container-highest text-on-surface-variant font-bold text-sm text-center">
            Call for info
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function Resources() {
  const { borough, needs, answers } = useApp()
  const housingStatus   = answers.housingStatus as string | undefined
  const paroleProbation = answers.paroleProbation as string | undefined
  const hasBirthCert    = answers.hasBirthCert as string | undefined
  const timeAway        = answers.timeAway as string | undefined

  const [allResources, setAllResources] = useState<Record<string, NormalizedResource[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const results: Record<string, NormalizedResource[]> = {}

      // ID & Documents — always static (no reliable public API)
      results.id = ID_STATIC

      // Fetch only what the user selected, with fallback to static
      const fetches: [string, Promise<NormalizedResource[]>, string][] = [
        ['housing',      fetchHousingResources(borough, housingStatus),               'housing'],
        ['food',         fetchFoodResources(borough),                                  'food'],
        ['employment',   fetchEmploymentResources(borough, paroleProbation),           'employment'],
        ['mentalHealth', fetchMentalHealthResources(borough, timeAway),               'mentalHealth'],
        ['legal',        fetchLegalAidResources(borough, paroleProbation),            'legal'],
      ]

      const activeNeeds = needs.length > 0 ? needs : ['housing', 'food', 'employment', 'mentalHealth', 'legal']

      await Promise.all(
        fetches
          .filter(([key]) => activeNeeds.includes(key))
          .map(async ([key, promise, staticKey]) => {
            const data = await promise
            results[key] = data.length > 0 ? data : staticFallback(staticKey)
          })
      )

      setAllResources(results)
      setLoading(false)
    }

    load()
  }, [borough, needs, housingStatus, paroleProbation, hasBirthCert, timeAway])

  // Flatten for 'all' tab
  const flatAll = useMemo(
    () => Object.values(allResources).flat(),
    [allResources]
  )

  const displayed = useMemo(() => {
    const base = activeTab === 'all' ? flatAll : (allResources[activeTab] ?? [])
    if (!searchTerm.trim()) return base
    const q = searchTerm.toLowerCase()
    return base.filter(r =>
      `${r.title} ${r.category} ${r.description}`.toLowerCase().includes(q)
    )
  }, [activeTab, flatAll, allResources, searchTerm])

  const hasOnboarding = borough || needs.length > 0

  return (
    <main className="mt-24 max-w-7xl mx-auto px-6 mb-12">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="mb-12 text-center">
        <h1 className="text-display-lg font-extrabold text-on-surface tracking-tight mb-4">
          Find Your Path Forward
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed mb-2 mx-auto">
          {hasOnboarding
            ? `Showing resources near ${borough ?? 'your borough'} — filtered to match your needs.`
            : 'Access local support, essential documents, and tools designed to help you build a stable future.'}
        </p>
        {hasOnboarding && (
          <p className="text-xs text-secondary font-medium mb-6">
            <span className="material-symbols-outlined text-xs align-middle mr-1">verified</span>
            Live data from NYC Open Data — updated daily
          </p>
        )}

        {/* Search */}
        <div className="relative max-w-3xl mx-auto">
          <input
            className="w-full bg-surface-container-highest rounded-xl px-6 py-5 text-body-lg focus:outline-none focus:ring-4 focus:ring-primary-fixed border-none shadow-none"
            placeholder="Search for housing, legal aid, jobs..."
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search resources"
          />
          <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
        </div>
      </header>

      {/* ── Category tabs ───────────────────────────────────── */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          {TABS.map(tab => {
            const active = activeTab === tab.key
            const count = tab.key === 'all' ? flatAll.length : (allResources[tab.key]?.length ?? 0)
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all cursor-pointer ${
                  active
                    ? 'bg-primary text-on-primary shadow-[0_3px_0_0_#7a3c00]'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
                {!loading && count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Result count ────────────────────────────────────── */}
      {!loading && (
        <p className="text-sm text-on-surface-variant font-medium mb-6 text-center">
          {displayed.length} resource{displayed.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      )}

      {/* ── Grid ────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : displayed.length > 0 ? (
          <>
            {displayed.map(r => <ResourceCard key={r.id} resource={r} />)}

            {/* Suggest a resource card */}
            <div className="bg-surface-container-low rounded-lg p-4 flex flex-col transition-all duration-300 hover:bg-surface-container">
              <div className="h-36 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full bg-gradient-to-br from-tertiary-container to-tertiary flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl">add_circle</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h4 className="font-headline font-bold text-base mb-2">Suggest a Resource</h4>
                <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
                  Know of a service that could help others? Let us know so we can add it.
                </p>
                <button className="mt-auto w-full py-3 rounded-md bg-tertiary-container text-on-tertiary-container font-bold text-sm">
                  Contribute
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-full text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
            <p className="font-headline font-bold text-lg mb-1">No results found</p>
            <p className="text-sm">Try a different category or search term.</p>
          </div>
        )}
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="mt-12 p-5 bg-surface-container rounded-xl text-center">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Live results from{' '}
          <span className="font-bold text-on-surface">NYC Open Data</span> (HHS Connect &
          DOHMH). Static entries verified against NYC.gov, NYC DOC, and HRA.
          If anything looks outdated, call{' '}
          <span className="text-secondary font-bold">311</span>.
        </p>
      </div>
    </main>
  )
}
