// ─────────────────────────────────────────────────────────────────
// Dynamic Roadmap Engine
// Priority-based scoring + borough-specific steps
// ─────────────────────────────────────────────────────────────────

export interface RoadmapStep {
  id: string
  text: string
  detail: string
  time: string
}

export interface RoadmapSection {
  key: string
  label: string
  icon: string
  color: string
  score: number
  isAuto: boolean
  steps: RoadmapStep[]
}

export interface GeneratedRoadmap {
  sections: RoadmapSection[]
  borough: string
  timeAway: string
  generatedAt: string
}

// ── Priority scoring weights ──────────────────────────────────────
const URGENCY: Record<string, { base: number; label: string; icon: string; color: string }> = {
  id:           { base: 100, label: 'ID & Documents',      icon: 'badge',            color: '#2d6a4f' },
  housing:      { base: 90,  label: 'Housing',             icon: 'house',            color: '#1a3d2b' },
  food:         { base: 85,  label: 'Food & Benefits',     icon: 'restaurant',       color: '#e07b2a' },
  employment:   { base: 70,  label: 'Employment',          icon: 'work',             color: '#52b788' },
  mentalHealth: { base: 65,  label: 'Mental Health',       icon: 'psychology',       color: '#6b6b63' },
  family:       { base: 55,  label: 'Family Reconnection', icon: 'family_restroom',  color: '#9e9e94' },
  education:    { base: 45,  label: 'Education',           icon: 'school',           color: '#52b788' },
  community:    { base: 40,  label: 'Community',           icon: 'groups',           color: '#2d6a4f' },
  legal:        { base: 75,  label: 'Legal Help',          icon: 'gavel',            color: '#1a3d2b' },
}

// ── Borough-specific steps ────────────────────────────────────────
const STEPS: Record<string, Record<string, RoadmapStep[]>> = {
  id: {
    Bronx: [
      { id: 'id-1', text: 'Get your birth certificate', detail: 'NYC Vital Records — 125 Worth St, Manhattan. Free if released in the last 30 days. Bring your release paperwork.', time: '1–2 days' },
      { id: 'id-2', text: 'Get your state ID or driver\'s license', detail: 'DMV Tremont Ave office, Bronx. Bring birth certificate + release papers. No appointment needed on Tue & Thu mornings.', time: 'Same day' },
      { id: 'id-3', text: 'Apply for your Social Security card', detail: 'SSA Office — 2 blocks from Tremont DMV. Bring your new state ID and birth certificate.', time: '2–4 weeks (mail)' },
    ],
    Brooklyn: [
      { id: 'id-1', text: 'Get your birth certificate', detail: 'NYC Vital Records — 125 Worth St. Free within 30 days of release. Bring release paperwork.', time: '1–2 days' },
      { id: 'id-2', text: 'Get your state ID', detail: 'DMV Atlantic Ave, Brooklyn. Bring birth certificate + release papers.', time: 'Same day' },
      { id: 'id-3', text: 'Apply for your Social Security card', detail: 'SSA Office on Flatbush Ave. Bring new state ID.', time: '2–4 weeks (mail)' },
    ],
    default: [
      { id: 'id-1', text: 'Get your birth certificate', detail: 'NYC Vital Records — 125 Worth St, Manhattan. Free if released in the last 30 days.', time: '1–2 days' },
      { id: 'id-2', text: 'Get your state ID', detail: 'Visit your nearest DMV with your birth certificate and release papers.', time: 'Same day' },
      { id: 'id-3', text: 'Apply for your Social Security card', detail: 'Visit your nearest SSA office with your state ID and birth certificate.', time: '2–4 weeks (mail)' },
    ],
  },
  housing: {
    Bronx: [
      { id: 'h-1', text: 'Contact CAMBA Housing', detail: 'Transitional housing that accepts returning citizens. Bronx office: (718) 940-6800. Walk-in Mon–Fri 9am–4pm.', time: 'Same day' },
      { id: 'h-2', text: 'Apply for CityFHEPS rental voucher', detail: 'Requires ID (complete step 1 first). Apply at HRA office on E. 149th St. You may qualify for priority status.', time: '2–6 weeks' },
      { id: 'h-3', text: 'Emergency backup: BronxWorks intake', detail: 'Open 7 days. 60 E. Tremont Ave. No appointment needed for emergency intake.', time: 'Same day' },
    ],
    Brooklyn: [
      { id: 'h-1', text: 'Contact CAMBA Housing', detail: 'Transitional housing, Brooklyn office: (718) 940-6800. Walk-in Mon–Fri 9am–4pm.', time: 'Same day' },
      { id: 'h-2', text: 'Apply for CityFHEPS rental voucher', detail: 'Requires ID. Apply at nearest HRA. You may qualify for priority status.', time: '2–6 weeks' },
      { id: 'h-3', text: 'Emergency backup: Emergency shelter', detail: 'Call 311 and say "I need emergency shelter." Available 24/7.', time: 'Same day' },
    ],
    default: [
      { id: 'h-1', text: 'Contact a transitional housing provider', detail: 'Call 311 and ask for "transitional housing for returning citizens." Available in all boroughs.', time: 'Same day' },
      { id: 'h-2', text: 'Apply for CityFHEPS rental voucher', detail: 'Requires ID. Apply at your nearest HRA office after getting your ID.', time: '2–6 weeks' },
      { id: 'h-3', text: 'Emergency backup: Call 311', detail: 'Say "I need emergency shelter." Available 24/7, all boroughs.', time: 'Same day' },
    ],
  },
  employment: {
    default: [
      { id: 'e-1', text: 'Register with STRIVE', detail: 'Free job training + placement. Multiple NYC locations. (212) 360-1100. Open to people with records.', time: '1 week to start' },
      { id: 'e-2', text: 'Know your rights: NYC Fair Chance Act', detail: 'Employers cannot ask about your record until after a conditional offer. Print this info — it\'s the law.', time: '30 min read' },
      { id: 'e-3', text: 'NYC Workforce1 Career Center', detail: 'Free job placement services. 30+ locations citywide. Walk-in or call 311 for your nearest center.', time: 'Same day' },
    ],
  },
  food: {
    default: [
      { id: 'f-1', text: 'Apply for SNAP (food stamps)', detail: 'Apply online at access.nyc.gov or call 311. You may qualify immediately as a returning citizen.', time: '1–2 weeks' },
      { id: 'f-2', text: 'Find your nearest food pantry', detail: 'NYC has 500+ food pantries. Text your zip code to 898-211 to find the closest one open today.', time: 'Same day' },
    ],
  },
  mentalHealth: {
    default: [
      { id: 'm-1', text: 'Bronx Community Solutions — free walk-in counseling', detail: 'No insurance needed. 215 E 161st St, Bronx. Mon–Fri 9am–5pm. Counselors understand reentry.', time: 'Same week' },
      { id: 'm-2', text: 'Join a peer support group', detail: 'Hour Children — groups led by formerly incarcerated people. Powerful and judgment-free. Call (718) 358-1601.', time: 'This week' },
      { id: 'm-3', text: 'Save the crisis line in your phone', detail: '988 Lifeline — text or call anytime. Free, confidential. Save it now.', time: '2 minutes' },
    ],
  },
  family: {
    default: [
      { id: 'fa-1', text: 'Contact Legal Aid — family law', detail: 'If you have custody or visitation concerns, Legal Aid has a returning citizens unit. (212) 577-3300. Free.', time: 'This week' },
      { id: 'fa-2', text: "Children's Aid Society — family reconnection", detail: 'Helps returning parents reconnect with children safely. Free mediation services.', time: '2–4 weeks' },
    ],
  },
  education: {
    default: [
      { id: 'ed-1', text: 'Explore CUNY Start or adult education', detail: 'Free or low-cost. CUNY accepts returning citizens. Call (212) 794-5351 for guidance.', time: 'Next enrollment' },
      { id: 'ed-2', text: 'Get your GED (if needed)', detail: 'Free GED prep citywide. Call 311 for locations. You can start within a week.', time: 'Start this week' },
    ],
  },
  community: {
    default: [
      { id: 'c-1', text: "Connect with FreshStart's peer network", detail: "Other people who've been through this. Same borough, same experience. No judgment.", time: 'Right now' },
      { id: 'c-2', text: 'Find a mentor', detail: 'Community leaders and formerly incarcerated mentors matched to your background. Free through FreshStart.', time: 'This week' },
    ],
  },
  legal: {
    default: [
      { id: 'l-1', text: 'Know the NYC Clean Slate Act (Nov 2024)', detail: 'Automatic sealing of eligible convictions after waiting period. Call Legal Aid at (212) 577-3300 to check if you qualify.', time: '30 min' },
      { id: 'l-2', text: 'Get free legal representation', detail: 'Legal Aid Society — free for income-eligible New Yorkers. (212) 577-3300. Walk-in clinics at 120 Wall St Mon–Fri 9am–5pm.', time: 'This week' },
      { id: 'l-3', text: 'Know the NYC Fair Chance Act', detail: 'Employers cannot ask about your record before a conditional offer. Print this info — it\'s the law. Get it at nyc.gov/fairchance.', time: '30 min' },
    ],
  },
}

// ── Auto-add needs based on time away ────────────────────────────
function getAutoNeeds(timeAway: string): string[] {
  const extra: string[] = []
  // 5+ years away → mental health support becomes critical
  if (['5-15 years', '15+ years'].includes(timeAway)) {
    extra.push('mentalHealth')
  }
  // 15+ years → community reconnection is also essential
  if (timeAway === '15+ years') {
    extra.push('community')
  }
  return extra
}

// ── Main export ───────────────────────────────────────────────────
export function generateRoadmap({
  timeAway,
  borough,
  needs,
  hasID,
  hasBirthCert,
  housingStatus,
  hasChildren: _hasChildren,
  paroleProbation,
}: {
  timeAway: string
  borough: string
  needs: string[]
  hasID?: string
  hasBirthCert?: string
  housingStatus?: string
  hasChildren?: string   // reserved for future shelter-intake logic
  paroleProbation?: string
}): GeneratedRoadmap {
  const autoNeeds = getAutoNeeds(timeAway)

  // Auto-add legal if on parole or probation
  const extraNeeds: string[] = []
  if (paroleProbation === 'parole' || paroleProbation === 'probation') {
    extraNeeds.push('legal')
  }

  // ID always first; then user selections; then auto-adds
  const allNeeds = [...new Set(['id', ...needs, ...autoNeeds, ...extraNeeds])]

  const sections: RoadmapSection[] = allNeeds.map(needKey => {
    const meta = URGENCY[needKey]
    if (!meta) return null!

    const stepsMap = STEPS[needKey] ?? {}
    let steps: RoadmapStep[] = stepsMap[borough] ?? stepsMap['default'] ?? []

    // If user already has birth certificate, filter out the 'Get your birth certificate' step
    if (needKey === 'id' && hasID !== 'yes' && hasBirthCert === 'yes') {
      steps = steps.filter(s => s.id !== 'id-1')
    }

    // Score: base weight + bonus if user explicitly selected it
    let score = meta.base
    if (needs.includes(needKey)) score += 20
    if (needKey === 'id') score = 999                                  // always top
    if (needKey === 'mentalHealth' && timeAway === '15+ years') score += 15

    // Housing emergency: bump to near-top
    if (needKey === 'housing' && housingStatus === 'nowhere') score = 998

    return {
      key: needKey,
      label: meta.label,
      icon: meta.icon,
      color: meta.color,
      score,
      steps,
      isAuto: (autoNeeds.includes(needKey) || extraNeeds.includes(needKey)) && !needs.includes(needKey),
    }
  }).filter(Boolean)

  // Sort highest score first
  sections.sort((a, b) => b.score - a.score)

  return { sections, borough, timeAway, generatedAt: new Date().toISOString() }
}

export function buildRoadmapFromAnswers(answers: Record<string, string | string[]>): GeneratedRoadmap {
  return generateRoadmap({
    timeAway: (answers.timeAway as string) ?? '< 1 year',
    borough: (answers.borough as string) ?? 'default',
    needs: (answers.needs as string[]) ?? [],
    hasID: answers.hasID as string | undefined,
    hasBirthCert: answers.hasBirthCert as string | undefined,
    housingStatus: answers.housingStatus as string | undefined,
    hasChildren: answers.hasChildren as string | undefined,
    paroleProbation: answers.paroleProbation as string | undefined,
  })
}
