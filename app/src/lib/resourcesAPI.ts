// ─────────────────────────────────────────────────────────────────
// NYC Open Data — Reentry Resource Fetchers
// Primary dataset: kvhd-5fmu (HHS Connect Human Services Programs)
// Mental health:   8nqg-ia7v (DOHMH Mental Health Service Finder)
// ─────────────────────────────────────────────────────────────────

const HHS_BASE = 'https://data.cityofnewyork.us/resource/kvhd-5fmu.json'
const MH_BASE  = 'https://data.cityofnewyork.us/resource/8nqg-ia7v.json'

export interface NormalizedResource {
  id: string
  title: string
  category: string
  description: string
  phone: string | null
  address: string | null
  link: string | null
  source: 'api' | 'static'
  emergency?: boolean
}

// ── Normalize raw API row → NormalizedResource ────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeResult(item: Record<string, any>, category: string): NormalizedResource {
  return {
    id:          item.unique_id ?? item.objectid ?? Math.random().toString(36).slice(2),
    title:       item.program_name ?? item.agency_name ?? item.organization_name ?? 'Program',
    category,
    description: item.brief_description ?? item.program_description ?? item.description ?? '',
    phone:       item.phone_number ?? item.phone ?? null,
    address:     item.address1
                   ? `${item.address1}${item.city ? ', ' + item.city : ''}`
                   : item.address ?? null,
    link:        item.program_url ?? item.website ?? null,
    source:      'api',
  }
}

// ── Borough normalization ─────────────────────────────────────────
// NYC Open Data uses uppercase full names; our app uses title case
function boroughParam(borough: string | null): string {
  return (borough ?? 'Bronx').toUpperCase()
}

// ── Fetch helpers ─────────────────────────────────────────────────
async function fetchHHS(params: Record<string, string>, limit = 8): Promise<NormalizedResource[]> {
  const qs = new URLSearchParams({ ...params, $limit: String(limit) })
  try {
    const res = await fetch(`${HHS_BASE}?${qs}`)
    if (!res.ok) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await res.json()
    return data.map(item => normalizeResult(item, params.category ?? 'General'))
  } catch {
    return []
  }
}

// ── Category fetchers ─────────────────────────────────────────────

export async function fetchHousingResources(
  borough: string | null,
  housingStatus?: string
): Promise<NormalizedResource[]> {
  const results = await fetchHHS({
    category: 'Housing',
    borough:  boroughParam(borough),
  })

  // If homeless tonight → sort emergency/shelter entries first
  if (housingStatus === 'nowhere') {
    results.sort((a, b) => {
      const aEmergency = /shelter|emergency|crisis/i.test(a.title + a.description)
      const bEmergency = /shelter|emergency|crisis/i.test(b.title + b.description)
      return (bEmergency ? 1 : 0) - (aEmergency ? 1 : 0)
    })
    results.forEach(r => {
      if (/shelter|emergency|crisis/i.test(r.title + r.description)) r.emergency = true
    })
  }

  return results
}

export async function fetchBenefitsResources(
  borough: string | null,
  hasBirthCert?: string
): Promise<NormalizedResource[]> {
  const results = await fetchHHS({
    category: 'Benefits',
    borough:  boroughParam(borough),
  })

  // No birth cert → surface Vital Records / ID entries first
  if (hasBirthCert === 'no') {
    results.sort((a, b) => {
      const aID = /vital records|birth cert|state id|dmv/i.test(a.title + a.description)
      const bID = /vital records|birth cert|state id|dmv/i.test(b.title + b.description)
      return (bID ? 1 : 0) - (aID ? 1 : 0)
    })
  }

  return results
}

export async function fetchEmploymentResources(
  borough: string | null,
  paroleProbation?: string
): Promise<NormalizedResource[]> {
  const results = await fetchHHS({
    category: 'Employment',
    borough:  boroughParam(borough),
  })

  // On supervision → surface Fair Chance / reentry-specific employers first
  if (paroleProbation === 'parole' || paroleProbation === 'probation') {
    results.sort((a, b) => {
      const aFC = /fair chance|reentry|record|justice/i.test(a.title + a.description)
      const bFC = /fair chance|reentry|record|justice/i.test(b.title + b.description)
      return (bFC ? 1 : 0) - (aFC ? 1 : 0)
    })
  }

  return results
}

export async function fetchMentalHealthResources(
  borough: string | null,
  timeAway?: string
): Promise<NormalizedResource[]> {
  const qs = new URLSearchParams({
    borough: boroughParam(borough),
    $limit:  '8',
  })
  try {
    const res = await fetch(`${MH_BASE}?${qs}`)
    if (!res.ok) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any[] = await res.json()
    const results = data.map(item => normalizeResult(item, 'Mental Health'))

    // Long sentences → surface trauma-specialized orgs first
    const longSentence = timeAway === '15+ years' || timeAway === '5-15 years'
    if (longSentence) {
      results.sort((a, b) => {
        const aT = /trauma|reentry|justice|incarcerat/i.test(a.title + a.description)
        const bT = /trauma|reentry|justice|incarcerat/i.test(b.title + b.description)
        return (bT ? 1 : 0) - (aT ? 1 : 0)
      })
    }

    return results
  } catch {
    return []
  }
}

export async function fetchLegalAidResources(
  borough: string | null,
  paroleProbation?: string
): Promise<NormalizedResource[]> {
  const results = await fetchHHS({
    category: 'Legal',
    borough:  boroughParam(borough),
  })

  // On parole → surface parole-specific legal help first
  if (paroleProbation === 'parole') {
    results.sort((a, b) => {
      const aP = /parole|supervision|probation/i.test(a.title + a.description)
      const bP = /parole|supervision|probation/i.test(b.title + b.description)
      return (bP ? 1 : 0) - (aP ? 1 : 0)
    })
  }

  return results
}

export async function fetchFoodResources(
  borough: string | null
): Promise<NormalizedResource[]> {
  return fetchHHS({ category: 'Food', borough: boroughParam(borough) })
}
