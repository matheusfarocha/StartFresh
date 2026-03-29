// ─────────────────────────────────────────────────────────────────
// NYC Open Data — Resource Fetchers
//
// Primary: ji82-xba5  (NYC Facilities Database — 35k+ locations, updated regularly)
// Secondary: kvhd-5fmu (HHS Connect Programs — citywide program descriptions)
// ─────────────────────────────────────────────────────────────────

const FACILITIES = 'https://data.cityofnewyork.us/resource/ji82-xba5.json'
const HHS = 'https://data.cityofnewyork.us/resource/kvhd-5fmu.json'

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

function boroParam(borough: string | null): string {
  return (borough ?? 'Bronx').toUpperCase()
}

// ── Facilities DB fetcher ────────────────────────────────────────
async function fetchFacilities(
  facsubgrp: string | string[],
  borough: string,
  category: string,
  limit = 50,
): Promise<NormalizedResource[]> {
  const subgrps = Array.isArray(facsubgrp) ? facsubgrp : [facsubgrp]
  const subgrpFilter = subgrps.map(s => `facsubgrp='${s}'`).join(' OR ')
  const where = `(${subgrpFilter}) AND boro='${borough}'`
  const qs = new URLSearchParams({ $where: where, $limit: String(limit), $select: 'uid,facname,address,city,zipcode,opname,optype' })
  try {
    const res = await fetch(`${FACILITIES}?${qs}`)
    if (!res.ok) return []
    const data: Record<string, string>[] = await res.json()
    return data
      .filter(item => {
        if (!item.address) return false
        // The name or operator must tell you something useful
        const name = (item.facname ?? '').toLowerCase()
        const op = (item.opname ?? '').toLowerCase()
        const combined = name + ' ' + op
        // Filter out generic entries with no descriptive info
        const hasContext = combined.length > 10 && (
          /shelter|pantry|kitchen|clinic|health|legal|aid|counsel|workforce|career|literacy|education|housing|family|community center|crisis|hotline|food|treatment|rehab|mental|support/i.test(combined)
          || (op && op !== 'null' && op !== name) // operator adds info
        )
        return hasContext
      })
      .map(item => {
        const addr = `${item.address}, ${item.city ?? ''} ${item.zipcode ?? ''}`.trim()
        const op = item.opname && item.opname !== 'NULL' && item.opname.toLowerCase() !== (item.facname ?? '').toLowerCase()
          ? item.opname : null
        return {
          id: item.uid ?? Math.random().toString(36).slice(2),
          title: item.facname ?? item.opname ?? 'Resource',
          category,
          description: op ? `Operated by ${op}` : '',
          phone: null,
          address: addr,
          link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`,
          source: 'api' as const,
        }
      })
  } catch {
    return []
  }
}

// ── HHS Programs fetcher (citywide, no borough filter) ───────────
async function fetchHHSPrograms(
  programCategory: string,
  category: string,
  limit = 10,
): Promise<NormalizedResource[]> {
  const where = `program_category='${programCategory}'`
  const qs = new URLSearchParams({ $where: where, $limit: String(limit), $select: 'unique_id_number,program_name,plain_language_program_name,brief_excerpt,office_locations_url' })
  try {
    const res = await fetch(`${HHS}?${qs}`)
    if (!res.ok) return []
    const data: Record<string, string>[] = await res.json()
    return data.map(item => ({
      id: item.unique_id_number ?? Math.random().toString(36).slice(2),
      title: item.plain_language_program_name ?? item.program_name ?? 'Program',
      category,
      description: (item.brief_excerpt ?? '').replace(/<[^>]*>/g, '').trim(),
      phone: null,
      address: null,
      link: item.office_locations_url ?? null,
      source: 'api' as const,
    }))
  } catch {
    return []
  }
}

// ── Category fetchers ────────────────────────────────────────────

export async function fetchHousingResources(
  borough: string | null,
  housingStatus?: string,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [facilities, programs] = await Promise.all([
    fetchFacilities('NON-RESIDENTIAL HOUSING AND HOMELESS SERVICES', boro, 'Housing', 80),
    fetchHHSPrograms('Housing', 'Housing', 15),
  ])

  const results = [...facilities, ...programs]

  if (housingStatus === 'nowhere') {
    results.sort((a, b) => {
      const aE = /shelter|emergency|crisis|homeless/i.test(a.title + a.description)
      const bE = /shelter|emergency|crisis|homeless/i.test(b.title + b.description)
      return (bE ? 1 : 0) - (aE ? 1 : 0)
    })
    results.forEach(r => {
      if (/shelter|emergency|crisis/i.test(r.title + r.description)) r.emergency = true
    })
  }

  return results
}

export async function fetchFoodResources(
  borough: string | null,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [pantries, programs] = await Promise.all([
    fetchFacilities('SOUP KITCHENS AND FOOD PANTRIES', boro, 'Food', 100),
    fetchHHSPrograms('Food', 'Food', 6),
  ])
  return [...programs, ...pantries]
}

export async function fetchEmploymentResources(
  borough: string | null,
  paroleProbation?: string,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [facilities, programs] = await Promise.all([
    fetchFacilities('WORKFORCE DEVELOPMENT', boro, 'Employment', 50),
    fetchHHSPrograms('Work', 'Employment', 11),
  ])

  const results = [...facilities, ...programs]

  if (paroleProbation === 'parole' || paroleProbation === 'probation') {
    results.sort((a, b) => {
      const aR = /fair chance|reentry|record|justice|returning/i.test(a.title + a.description)
      const bR = /fair chance|reentry|record|justice|returning/i.test(b.title + b.description)
      return (bR ? 1 : 0) - (aR ? 1 : 0)
    })
  }

  return results
}

export async function fetchMentalHealthResources(
  borough: string | null,
  timeAway?: string,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [facilities, healthPrograms] = await Promise.all([
    fetchFacilities(['MENTAL HEALTH', 'SUBSTANCE USE DISORDER TREATMENT PROGRAMS'], boro, 'Mental Health', 100),
    fetchHHSPrograms('Health', 'Mental Health', 13),
  ])

  const results = [...healthPrograms, ...facilities]

  if (timeAway === '15+ years' || timeAway === '5-15 years') {
    results.sort((a, b) => {
      const aT = /trauma|reentry|justice|incarcerat|crisis/i.test(a.title + a.description)
      const bT = /trauma|reentry|justice|incarcerat|crisis/i.test(b.title + b.description)
      return (bT ? 1 : 0) - (aT ? 1 : 0)
    })
  }

  return results
}

export async function fetchLegalAidResources(
  borough: string | null,
  paroleProbation?: string,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const facilities = await fetchFacilities('LEGAL AND INTERVENTION SERVICES', boro, 'Legal Aid', 60)

  if (paroleProbation === 'parole') {
    facilities.sort((a, b) => {
      const aP = /parole|supervision|reentry|criminal/i.test(a.title + a.description)
      const bP = /parole|supervision|reentry|criminal/i.test(b.title + b.description)
      return (bP ? 1 : 0) - (aP ? 1 : 0)
    })
  }

  return facilities
}

export async function fetchBenefitsResources(
  borough: string | null,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [facilities, programs] = await Promise.all([
    fetchFacilities('FINANCIAL ASSISTANCE AND SOCIAL SERVICES', boro, 'Benefits', 30),
    fetchHHSPrograms('Cash & expenses', 'Benefits', 21),
  ])
  return [...facilities, ...programs]
}

export async function fetchEducationResources(
  borough: string | null,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  const [literacy, programs] = await Promise.all([
    fetchFacilities('ADULT AND IMMIGRANT LITERACY', boro, 'Education', 30),
    fetchHHSPrograms('Education', 'Education', 7),
  ])
  return [...literacy, ...programs]
}

export async function fetchHealthCareResources(
  borough: string | null,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  return fetchFacilities('HOSPITALS AND CLINICS', boro, 'Health Care', 50)
}

export async function fetchCommunityResources(
  borough: string | null,
): Promise<NormalizedResource[]> {
  const boro = boroParam(borough)
  return fetchFacilities('COMMUNITY CENTERS AND COMMUNITY PROGRAMS', boro, 'Community', 50)
}
