// ─────────────────────────────────────────────────────────────────
// Dynamic Roadmap Engine v2
// Uses ALL onboarding answers to generate a deeply personalized
// roadmap with context-aware steps, scoring, and filtering.
// ─────────────────────────────────────────────────────────────────

export interface RoadmapStep {
  id: string
  text: string
  what: string    // Short "what is this" explanation
  detail: string  // How to do it
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

interface RoadmapInputs {
  timeAway: string
  borough: string
  needs: string[]
  hasID?: string
  hasBirthCert?: string
  hasSSN?: string
  housingStatus?: string
  hasChildren?: string
  foodSituation?: string   // 'none' | 'sometimes' | 'ok'
  paroleProbation?: string
  hasPhone?: string        // 'yes' | 'basic' | 'no'
}

const SECTIONS: Record<string, { label: string; icon: string; color: string }> = {
  emergency:    { label: 'Emergency Shelter',     icon: 'emergency',        color: '#b23d21' },
  id:           { label: 'ID & Documents',        icon: 'badge',            color: '#2d6a4f' },
  housing:      { label: 'Housing',               icon: 'house',            color: '#1a3d2b' },
  food:         { label: 'Food & Benefits',       icon: 'restaurant',       color: '#e07b2a' },
  employment:   { label: 'Employment',            icon: 'work',             color: '#52b788' },
  mentalHealth: { label: 'Mental Health',         icon: 'psychology',       color: '#6b6b63' },
  legal:        { label: 'Legal Help',            icon: 'gavel',            color: '#1a3d2b' },
  family:       { label: 'Family Reconnection',   icon: 'family_restroom',  color: '#9e9e94' },
  education:    { label: 'Education',             icon: 'school',           color: '#52b788' },
  community:    { label: 'Community',             icon: 'groups',           color: '#2d6a4f' },
  phone:        { label: 'Phone & Connectivity', icon: 'smartphone',       color: '#52b788' },
}

// ── Step generators ──────────────────────────────────────────────

function getEmergencySteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { hasChildren, borough } = inputs
  const steps: RoadmapStep[] = []

  if (hasChildren === 'yes') {
    steps.push({ id: 'em-1', text: 'Go to PATH intake center now', what: 'NYC\'s emergency intake center for families with children. They provide immediate shelter placement.', detail: 'PATH is for families with children under 21. Located at 151 E 151st St, Bronx. Open 24/7. Bring any documents you have — but they will help you even without ID.', time: 'Right now' })
  } else {
    const shelterMap: Record<string, string> = {
      Bronx: '30th Street Men\'s Shelter (400 E 30th St, Manhattan) or Franklin Women\'s Shelter (1122 Franklin Ave, Bronx)',
      Brooklyn: '30th Street Men\'s Shelter (400 E 30th St, Manhattan) or HELP Women\'s Center (115 E Williams Ave, Brooklyn)',
      Manhattan: '30th Street Men\'s Shelter (400 E 30th St) or Franklin Women\'s Shelter (Bronx)',
      default: '30th Street Men\'s Shelter (Manhattan) or call 311 for nearest women\'s shelter',
    }
    steps.push({ id: 'em-1', text: 'Call 311 for emergency shelter intake', what: 'NYC\'s free 24/7 hotline connects you to a shelter bed tonight. No ID needed.', detail: `Say "I need emergency shelter." Available 24/7. For adults: ${shelterMap[borough] ?? shelterMap['default']}. No ID required for emergency intake.`, time: 'Right now' })
  }

  steps.push({ id: 'em-2', text: 'Find a drop-in center for immediate help', what: 'Walk-in centers that provide food, showers, clothing, and a case manager — no questions asked.', detail: 'Drop-in centers provide food, showers, clothing, and case management. No ID required. Open 24hrs in all boroughs — call 311 or visit nyc.gov/dropin.', time: 'Right now' })

  return steps
}

function getIDSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { hasID, hasBirthCert, hasSSN, borough } = inputs
  const steps: RoadmapStep[] = []

  if (hasID === 'yes') {
    if (hasSSN !== 'yes') {
      steps.push({ id: 'id-1', text: 'Apply for your Social Security card', what: 'Your 9-digit number used for jobs, taxes, and benefits. The card proves it\'s yours.', detail: 'Visit your nearest SSA office with your state ID. Free replacement.', time: '2–4 weeks (mail)' })
    }
    return steps
  }

  if (hasBirthCert !== 'yes') {
    steps.push({ id: 'id-1', text: 'Get your birth certificate', what: 'The "seed" document needed to get every other form of ID. Proves your identity and citizenship.', detail: 'NYC Vital Records — 125 Worth St, Manhattan. Free if released in the last 30 days — bring your release paperwork. Otherwise $15 money order. Walk-in or mail.', time: '1–2 days' })
  }

  const dmvMap: Record<string, string> = { Bronx: 'DMV Tremont Ave office, Bronx. No appointment needed Tue & Thu mornings.', Brooklyn: 'DMV Atlantic Ave, Brooklyn.', Manhattan: 'DMV Herald Square, 12 W 31st St.', Queens: 'DMV College Point, 30-56 Whitestone Expressway.', 'Staten Island': 'DMV Staten Island, 1775 South Ave.' }
  const dmvInfo = dmvMap[borough] ?? 'Visit your nearest DMV.'
  const idPrereq = hasBirthCert === 'yes' ? 'Bring your birth certificate' : 'Bring your new birth certificate (from previous step)'

  if (hasID === 'expired') {
    steps.push({ id: 'id-2', text: 'Renew your expired ID', what: 'A valid government photo ID. Required for housing, jobs, bank accounts, and benefits.', detail: `${dmvInfo} ${idPrereq} + release papers. Renewal is faster than a new application. Fee waivers available.`, time: 'Same day' })
  } else {
    steps.push({ id: 'id-2', text: 'Get your state ID', what: 'A valid government photo ID. Required for housing, jobs, bank accounts, and benefits.', detail: `${dmvInfo} ${idPrereq} + release papers + proof of address (shelter letter works). Fee is $9 — waivers available.`, time: 'Same day' })
  }

  if (hasSSN !== 'yes') {
    const ssaMap: Record<string, string> = { Bronx: 'SSA Office — 2 blocks from Tremont DMV.', Brooklyn: 'SSA Office on Flatbush Ave.', default: 'Visit your nearest SSA office.' }
    steps.push({ id: 'id-3', text: 'Apply for your Social Security card', what: 'Your 9-digit number for jobs, taxes, and benefits. Employers and landlords will ask for it.', detail: `${ssaMap[borough] ?? ssaMap['default']} Bring your new state ID and birth certificate. Free.`, time: '2–4 weeks (mail)' })
  }

  return steps
}

function getHousingSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { housingStatus, hasID, borough, paroleProbation } = inputs
  const steps: RoadmapStep[] = []
  const needsID = hasID !== 'yes'

  if (housingStatus === 'temporary') {
    steps.push({ id: 'h-1', text: 'Start looking for transitional housing now', what: 'Transitional housing gives you a stable place for months while you get on your feet. Many are free.', detail: `Temporary situations can change fast. Contact Fortune Society (212-691-7554) or call 311 for transitional housing in ${borough}. Most programs accept returning citizens.`, time: 'This week' })
  } else if (housingStatus === 'shelter') {
    steps.push({ id: 'h-1', text: 'Connect with your shelter case manager', what: 'Your case manager is your advocate — they can fast-track housing applications and connect you to programs.', detail: 'Ask about transitional housing programs and CityFHEPS voucher eligibility. Your case manager can fast-track applications.', time: 'Today' })
  } else {
    steps.push({ id: 'h-1', text: 'Contact transitional housing providers', what: 'Organizations that provide free temporary housing specifically for returning citizens while you stabilize.', detail: `CAMBA Housing${borough === 'Bronx' || borough === 'Brooklyn' ? ' — (718) 940-6800, walk-in Mon–Fri 9am–4pm' : ' — call 311 for your borough'}. Also try Fortune Society (212-691-7554) and Housing Works.`, time: 'Same day' })
  }

  if (housingStatus !== 'stable') {
    const voucherNote = needsID ? 'Requires ID — complete your ID steps first.' : 'Bring your ID and proof of income/benefits.'
    const hraMap: Record<string, string> = { Bronx: 'HRA office on E. 149th St.', Brooklyn: 'HRA Livingston St office, Downtown Brooklyn.', default: 'Your nearest HRA office (call 311 for location).' }
    const poNote = paroleProbation === 'parole' || paroleProbation === 'probation' ? ' Your parole/probation officer may be able to write a support letter.' : ''
    steps.push({ id: 'h-2', text: 'Apply for CityFHEPS rental voucher', what: 'A city program that pays most of your rent directly to your landlord. Covers up to $2,217/month for a single adult.', detail: `${voucherNote} Apply at ${hraMap[borough] ?? hraMap['default']} You may qualify for priority status as a returning citizen.${poNote}`, time: '2–6 weeks' })
  }

  return steps
}

function getFoodSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { foodSituation } = inputs
  const steps: RoadmapStep[] = []

  // Immediate food first if hungry now
  if (foodSituation === 'none') {
    steps.push({ id: 'f-0', text: 'Get food today — no ID needed', what: 'Free food available right now at hundreds of locations across NYC. No paperwork, no questions.', detail: 'Text your zip code to 898-211 to find the closest food pantry open today. Also check nyc.gov/getfood for community fridges and hot meals near you.', time: 'Right now' })
  }

  if (foodSituation !== 'ok') {
    steps.push({ id: 'f-1', text: 'Apply for SNAP (food stamps)', what: 'A government program that puts money on a card each month for groceries. Accepted at most stores.', detail: 'Apply online at access.nyc.gov or call 311. You may qualify for expedited benefits (within 7 days) if you have less than $150/month income and $100 in resources.', time: '1–2 weeks' })
  }

  if (foodSituation === 'sometimes') {
    steps.push({ id: 'f-2', text: 'Find your nearest food pantry', what: 'Community-run locations that give out free groceries weekly. No ID or proof of income needed.', detail: 'NYC has 500+ food pantries. Text your zip code to 898-211 to find the closest one. Many also provide toiletries and household items.', time: 'Same day' })
  }

  return steps
}

function getEmploymentSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { paroleProbation, timeAway } = inputs
  const steps: RoadmapStep[] = []

  steps.push({ id: 'e-1', text: 'Register with STRIVE', what: 'A free 3-week job training program that leads directly to job placement. Specifically for people with records.', detail: 'Free job training + placement. Multiple NYC locations. (212) 360-1100. Open to people with records.', time: '1 week to start' })

  if (paroleProbation === 'parole' || paroleProbation === 'probation') {
    steps.push({ id: 'e-2', text: 'Know your rights: NYC Fair Chance Act', what: 'A NYC law that protects you — employers can\'t ask about your record until after offering you the job.', detail: 'Employers CANNOT ask about your record until after a conditional offer. This is law. If violated, call NYC Commission on Human Rights: (212) 416-0197.', time: '30 min read' })
  } else {
    steps.push({ id: 'e-2', text: 'Know your rights: NYC Fair Chance Act', what: 'A NYC law that protects you — employers can\'t ask about your record until after offering you the job.', detail: 'Employers cannot ask about your record until after a conditional offer. Print this info — it\'s the law. Get details at nyc.gov/fairchance.', time: '30 min read' })
  }

  if (timeAway === '15+ years' || timeAway === '5-15 years') {
    steps.push({ id: 'e-3', text: 'Center for Employment Opportunities (CEO)', what: 'Provides immediate paid work on day one, then helps you find a permanent job. Great for building a recent work history.', detail: 'CEO provides immediate paid transitional work + long-term job placement. Especially helpful if you\'ve been away a long time. (212) 422-4430.', time: 'This week' })
  }

  steps.push({ id: 'e-4', text: 'NYC Workforce1 Career Center', what: 'Free city-run job centers with resume help, interview coaching, and direct employer connections.', detail: 'Free job placement services. 30+ locations citywide. Walk-in or call 311 for your nearest center.', time: 'Same day' })

  return steps
}

function getMentalHealthSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { timeAway, borough } = inputs
  const steps: RoadmapStep[] = []

  steps.push({ id: 'm-1', text: 'Save the crisis line in your phone', what: 'A free 24/7 lifeline for when things feel overwhelming. Call, text, or chat — no judgment.', detail: '988 Lifeline — text or call anytime, 24/7. Free, confidential. Also try NYC Well: call 888-NYC-WELL for local counseling referrals.', time: '2 minutes' })

  const counselingMap: Record<string, string> = { Bronx: 'Bronx Community Solutions — 215 E 161st St, Bronx. Mon–Fri 9am–5pm. No insurance needed.', Brooklyn: 'Housing Works Behavioral Health — multiple Brooklyn locations. Walk-in or call (718) 277-0386.', Manhattan: 'Housing Works — 743 Broadway, Manhattan. Walk-in or call (212) 966-0466.', default: 'Call NYC Well (888-NYC-WELL) for a referral to free counseling near you.' }
  steps.push({ id: 'm-2', text: 'Get free walk-in counseling', what: 'Talk to a professional who understands reentry. Free, no insurance needed, no appointment.', detail: `${counselingMap[borough] ?? counselingMap['default']} Counselors understand reentry — no judgment.`, time: 'Same week' })

  if (timeAway === '5-15 years' || timeAway === '15+ years') {
    steps.push({ id: 'm-3', text: 'Join a peer support group', what: 'Meet others who\'ve been through the same thing. Led by formerly incarcerated people — real understanding.', detail: 'Hour Children — groups led by formerly incarcerated people. Powerful and judgment-free. (718) 358-1601. Also try Fortune Society\'s peer network.', time: 'This week' })
  }

  return steps
}

function getLegalSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { paroleProbation } = inputs
  const steps: RoadmapStep[] = []

  steps.push({ id: 'l-1', text: 'Know the NYC Clean Slate Act', what: 'A new law that automatically seals eligible convictions from your record — it might apply to you.', detail: 'Automatic sealing of eligible convictions after waiting period (enacted Nov 2024). Call Legal Aid at (212) 577-3300 to check if you qualify.', time: '30 min' })
  steps.push({ id: 'l-2', text: 'Get free legal representation', what: 'Free lawyers who specialize in helping returning citizens with housing, employment, and rights issues.', detail: 'Legal Aid Society — free for income-eligible New Yorkers. (212) 577-3300. Walk-in clinics at 120 Wall St Mon–Fri 9am–5pm.', time: 'This week' })

  if (paroleProbation === 'parole' || paroleProbation === 'probation') {
    steps.push({ id: 'l-3', text: 'Understand your supervision rights', what: 'You have legal rights while on supervision. A lawyer can explain your conditions and advocate for you.', detail: 'Legal Aid\'s Reentry Project can explain your conditions, help with violations, and advocate for early discharge. (212) 577-3300.', time: 'This week' })
  }

  if (paroleProbation === 'unsure') {
    steps.push({ id: 'l-3', text: 'Clarify your supervision status', what: 'It\'s critical to know if you\'re on parole or probation — violations you don\'t know about can have serious consequences.', detail: 'Call Legal Aid at (212) 577-3300 to check your status. They can look it up and explain what it means for you.', time: 'Today' })
  }

  return steps
}

function getFamilySteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { hasChildren } = inputs
  const steps: RoadmapStep[] = []

  if (hasChildren === 'yes') {
    steps.push({ id: 'fa-1', text: 'Contact Legal Aid — custody & visitation', what: 'Free legal help to navigate custody, visitation, and family court as a returning parent.', detail: 'Legal Aid has a returning citizens family law unit. They can help with custody, visitation, and family court. (212) 577-3300. Free.', time: 'This week' })
    steps.push({ id: 'fa-2', text: 'Children\'s Aid Society — family reunification', what: 'Professional mediators who help you rebuild your relationship with your children safely and gradually.', detail: 'Free mediation and reunification services for returning parents. Helps rebuild trust and navigate the system safely.', time: '2–4 weeks' })
  } else {
    steps.push({ id: 'fa-1', text: 'Contact Legal Aid — family law', what: 'Free legal help for any family-related concerns — custody, visitation, child support, or reconnection.', detail: 'If you have family, custody, or visitation concerns, Legal Aid has a returning citizens unit. (212) 577-3300. Free.', time: 'This week' })
  }

  steps.push({ id: 'fa-3', text: 'Osborne Association — family programs', what: 'Long-running organization that helps returning citizens rebuild family bonds through classes and therapy.', detail: 'Parenting classes, family therapy, children\'s programs. (718) 637-6560.', time: 'This week' })

  return steps
}

function getEducationSteps(_inputs: RoadmapInputs): RoadmapStep[] {
  return [
    { id: 'ed-1', text: 'Explore CUNY Start or adult education', what: 'Free or low-cost college-level courses at NYC\'s public university system. Financial aid available.', detail: 'CUNY accepts returning citizens. Call (212) 794-5351 for guidance.', time: 'Next enrollment' },
    { id: 'ed-2', text: 'Get your GED (if needed)', what: 'A high school equivalency diploma. Opens doors to better jobs and college. Many programs pay you while you study.', detail: 'Free GED prep citywide. Call 311 for locations. You can start within a week. Many programs offer stipends.', time: 'Start this week' },
  ]
}

function getCommunitySteps(_inputs: RoadmapInputs): RoadmapStep[] {
  return [
    { id: 'c-1', text: 'Connect with Fortune Society\'s peer network', what: 'A community of people who\'ve been through what you\'re going through. Same experience, no judgment.', detail: 'Fortune Society — 29-76 Northern Blvd, LIC. (212) 691-7554. Drop-in welcome.', time: 'Right now' },
    { id: 'c-2', text: 'Find a mentor', what: 'A formerly incarcerated person matched to your background who can guide you through the process.', detail: 'Free mentoring through FreshStart and Fortune Society. Matched to your borough and experience.', time: 'This week' },
  ]
}

function getPhoneSteps(inputs: RoadmapInputs): RoadmapStep[] {
  const { hasPhone } = inputs
  const steps: RoadmapStep[] = []

  if (hasPhone === 'no') {
    steps.push({ id: 'ph-1', text: 'Get a free smartphone through Lifeline', what: 'A federal program that gives qualifying low-income people a free phone with data. You almost certainly qualify.', detail: 'Apply at lifelinesupport.org or call 800-234-9473. You can also visit an Assurance Wireless or SafeLink store — multiple locations in every borough. Bring your ID (or release papers if no ID yet).', time: 'Same day – 1 week' })
    steps.push({ id: 'ph-2', text: 'Use free internet at your local library', what: 'NYC public libraries offer free Wi-Fi, computers, and even device lending. No ID needed to use them.', detail: 'Find your nearest branch at nypl.org (Manhattan/Bronx/SI) or bklynlibrary.org (Brooklyn) or queenslibrary.org (Queens). Walk in — no library card needed for internet access.', time: 'Same day' })
  } else if (hasPhone === 'basic') {
    steps.push({ id: 'ph-1', text: 'Upgrade to a free smartphone through Lifeline', what: 'Your basic phone can\'t run the apps you need for jobs, benefits, and maps. Lifeline gives free smartphones to qualifying people.', detail: 'Apply at lifelinesupport.org or call 800-234-9473. Also check with your current carrier — some offer free upgrades for Lifeline-eligible customers.', time: 'Same day – 1 week' })
  }

  return steps
}

// ── Step generators map ──────────────────────────────────────────
const STEP_GENERATORS: Record<string, (inputs: RoadmapInputs) => RoadmapStep[]> = {
  emergency: getEmergencySteps, id: getIDSteps, housing: getHousingSteps,
  food: getFoodSteps, employment: getEmploymentSteps, mentalHealth: getMentalHealthSteps,
  legal: getLegalSteps, family: getFamilySteps, education: getEducationSteps, community: getCommunitySteps,
  phone: getPhoneSteps,
}

// ── Scoring algorithm ────────────────────────────────────────────
function computeScore(key: string, inputs: RoadmapInputs): number {
  const { needs, housingStatus, hasID, timeAway, paroleProbation, hasChildren, foodSituation } = inputs
  const BASE: Record<string, number> = { emergency: 0, id: 100, phone: 95, housing: 90, food: 85, employment: 70, mentalHealth: 65, legal: 75, family: 55, education: 45, community: 40 }
  let score = BASE[key] ?? 50

  // ── Survival tier (absolute priorities) ──────────────────────
  // Hungry + no shelter = nothing else matters until these are handled
  // Target order: Food (if starving) → Shelter → Phone → ID → everything else

  if (needs.includes(key)) score += 20

  if (key === 'food') {
    if (foodSituation === 'none') score = 10000     // #1 absolute — get food NOW
    else if (foodSituation === 'sometimes') score += 15
    else if (foodSituation === 'ok') score -= 20
  }

  if (key === 'emergency') {
    score = foodSituation === 'none' ? 9999 : 10000 // shelter is #1 unless also starving
  }

  if (key === 'housing') {
    if (housingStatus === 'nowhere') score = 9998    // right after emergency shelter
    else if (housingStatus === 'temporary') score += 30
    else if (housingStatus === 'shelter') score += 10
    else if (housingStatus === 'stable') score -= 20
  }

  if (key === 'phone') {
    if (inputs.hasPhone === 'no') score = 997        // after survival, before ID
    else if (inputs.hasPhone === 'basic') score = 80
  }

  if (key === 'id') {
    if (hasID === 'yes') score = 50
    else score = 996                                  // after phone
  }

  // ── Everything else ────────────────────────────────────────
  if (key === 'mentalHealth') {
    if (timeAway === '15+ years') score += 25
    else if (timeAway === '5-15 years') score += 15
    if (housingStatus === 'nowhere') score += 10
  }
  if (key === 'legal') {
    if (paroleProbation === 'parole') score += 20
    else if (paroleProbation === 'probation') score += 15
    else if (paroleProbation === 'unsure') score += 25
  }
  if (key === 'family' && hasChildren === 'yes') score += 20
  if (key === 'community') {
    if (timeAway === '15+ years') score += 20
    else if (timeAway === '5-15 years') score += 10
  }
  if (key === 'employment' && housingStatus === 'nowhere') score -= 15

  return score
}

// ── Main export ──────────────────────────────────────────────────
export function generateRoadmap(inputs: RoadmapInputs): GeneratedRoadmap {
  const { timeAway, borough, needs, housingStatus, paroleProbation, hasID, foodSituation } = inputs
  const sectionKeys = new Set(needs)

  // Always include ID
  sectionKeys.add('id')

  // Emergency if nowhere to stay
  if (housingStatus === 'nowhere') sectionKeys.add('emergency')

  // Auto-add housing if in crisis
  if ((housingStatus === 'nowhere' || housingStatus === 'temporary') && !needs.includes('housing')) sectionKeys.add('housing')

  // Auto-add food if hungry
  if ((foodSituation === 'none' || foodSituation === 'sometimes') && !needs.includes('food')) sectionKeys.add('food')

  // Auto-add food if homeless
  if (housingStatus === 'nowhere' && !needs.includes('food')) sectionKeys.add('food')

  // Auto-add mental health for long-term
  if (timeAway === '5-15 years' || timeAway === '15+ years') sectionKeys.add('mentalHealth')

  // Auto-add community for very long-term
  if (timeAway === '15+ years') sectionKeys.add('community')

  // Auto-add legal if on supervision or unsure
  if (paroleProbation === 'parole' || paroleProbation === 'probation' || paroleProbation === 'unsure') sectionKeys.add('legal')

  // Auto-add phone if no phone or basic phone
  if (inputs.hasPhone === 'no' || inputs.hasPhone === 'basic') sectionKeys.add('phone')

  // Build sections
  const sections: RoadmapSection[] = []
  for (const key of sectionKeys) {
    const meta = SECTIONS[key]
    const generator = STEP_GENERATORS[key]
    if (!meta || !generator) continue
    const steps = generator(inputs)
    if (steps.length === 0) continue
    sections.push({ key, label: meta.label, icon: meta.icon, color: meta.color, score: computeScore(key, inputs), isAuto: !needs.includes(key) && key !== 'id' && key !== 'emergency', steps })
  }

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
    hasSSN: answers.hasSSN as string | undefined,
    housingStatus: answers.housingStatus as string | undefined,
    hasChildren: answers.hasChildren as string | undefined,
    foodSituation: answers.foodSituation as string | undefined,
    paroleProbation: answers.paroleProbation as string | undefined,
    hasPhone: answers.hasPhone as string | undefined,
  })
}
