// ─────────────────────────────────────────────────────────────────
// NYC Reentry Resource Database
// Sources: NYC DOC, HRA, Legal Aid, DHS, DOCCS, NYC.gov
// ─────────────────────────────────────────────────────────────────

export type ResourceCategory =
  | 'id'
  | 'housing'
  | 'food'
  | 'employment'
  | 'mentalHealth'
  | 'legal'
  | 'family'
  | 'education'
  | 'community'

export interface Resource {
  id: string
  name: string
  categories: ResourceCategory[]
  description: string
  phone?: string
  address?: string
  hours?: string
  website?: string
  boroughs: string[]         // 'All' or specific
  tags: string[]             // 'walk-in' | 'free' | 'no-id-required' | 'bilingual' | 'women-only'
  source: string             // credibility anchor (e.g. "NYC.gov", "NYC DOC partner")
}

export const CATEGORIES: { key: ResourceCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all',         label: 'All',           icon: 'apps' },
  { key: 'id',          label: 'ID & Docs',     icon: 'badge' },
  { key: 'housing',     label: 'Housing',       icon: 'house' },
  { key: 'food',        label: 'Food',          icon: 'restaurant' },
  { key: 'employment',  label: 'Employment',    icon: 'work' },
  { key: 'mentalHealth',label: 'Mental Health', icon: 'psychology' },
  { key: 'legal',       label: 'Legal',         icon: 'gavel' },
  { key: 'family',      label: 'Family',        icon: 'family_restroom' },
  { key: 'education',   label: 'Education',     icon: 'school' },
  { key: 'community',   label: 'Community',     icon: 'groups' },
]

export const RESOURCES: Resource[] = [
  // ── ID & Documents ─────────────────────────────────────────────
  {
    id: 'nyc-vital-records',
    name: 'NYC Vital Records — Birth Certificate',
    categories: ['id'],
    description:
      'Free birth certificates for people released from NYC or NYS custody within the last 30 days. Bring your release paperwork. No appointment needed.',
    phone: '(212) 788-4500',
    address: '125 Worth St, Manhattan, NY 10013',
    hours: 'Mon–Fri 9am–3:30pm',
    website: 'https://www.nyc.gov/vitalrecords',
    boroughs: ['All'],
    tags: ['free', 'walk-in', 'no-id-required'],
    source: 'NYC.gov',
  },
  {
    id: 'dmv-id',
    name: 'NYS DMV — Free State ID for Recently Released',
    categories: ['id'],
    description:
      'Free state ID or driver\'s license for people released from state prison or local jail. Bring birth certificate and release paperwork. Multiple NYC locations.',
    phone: '(518) 473-5595',
    address: 'Multiple boroughs — visit dmv.ny.gov for nearest office',
    hours: 'Mon–Fri 8:30am–4pm (hours vary by location)',
    website: 'https://dmv.ny.gov',
    boroughs: ['All'],
    tags: ['free', 'walk-in'],
    source: 'NYS DMV',
  },
  {
    id: 'ssa-social-security',
    name: 'Social Security Administration — Card Replacement',
    categories: ['id'],
    description:
      'Free replacement Social Security card. Bring state ID and birth certificate. Apply online or walk into any SSA office. Card arrives by mail in 2–4 weeks.',
    phone: '1-800-772-1213',
    address: 'Multiple NYC offices — ssa.gov/locator',
    hours: 'Mon–Fri 9am–4pm',
    website: 'https://www.ssa.gov',
    boroughs: ['All'],
    tags: ['free', 'walk-in'],
    source: 'SSA.gov',
  },
  {
    id: 'doccs-id-program',
    name: 'DOCCS Pre-Release ID Program',
    categories: ['id'],
    description:
      'NYS DOCCS works with DMV to issue state IDs before release from state prison. If you were released without an ID, contact DOCCS\'s reentry unit to initiate the process.',
    phone: '(518) 457-8126',
    address: 'Albany, NY (administered remotely)',
    website: 'https://doccs.ny.gov',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYS DOCCS',
  },

  // ── Housing ────────────────────────────────────────────────────
  {
    id: 'camba-housing',
    name: 'CAMBA — Transitional Housing for Returning Citizens',
    categories: ['housing'],
    description:
      'Transitional and supportive housing for adults returning from incarceration. Walk-in intake available. Also offers employment and benefits assistance.',
    phone: '(718) 940-6800',
    address: '1720 Church Ave, Brooklyn, NY 11226',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://camba.org',
    boroughs: ['Brooklyn', 'Bronx', 'Queens'],
    tags: ['free', 'walk-in'],
    source: 'NYC DHS partner',
  },
  {
    id: 'fortune-society-housing',
    name: 'Fortune Society — Castle Gardens Housing',
    categories: ['housing', 'community'],
    description:
      'Supportive housing in West Harlem for people with criminal records. Priority for those with serious mental illness or long records. Also provides full wraparound services.',
    phone: '(212) 691-7554',
    address: '625 W 140th St, Manhattan, NY 10031',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://fortunesociety.org',
    boroughs: ['Manhattan'],
    tags: ['free'],
    source: 'NYC DOC partner',
  },
  {
    id: 'bronxworks-housing',
    name: 'BronxWorks — Emergency Housing Intake',
    categories: ['housing'],
    description:
      'Emergency shelter intake and transitional housing in the Bronx. Open 7 days a week, no appointment needed. Accepts people regardless of ID status.',
    phone: '(718) 299-0500',
    address: '60 E Tremont Ave, Bronx, NY 10453',
    hours: '7 days, 9am–5pm (emergency intake 24/7 via 311)',
    website: 'https://bronxworks.org',
    boroughs: ['Bronx'],
    tags: ['free', 'walk-in', 'no-id-required'],
    source: 'NYC DHS partner',
  },
  {
    id: 'breaking-ground',
    name: 'Breaking Ground — Street Outreach & Housing',
    categories: ['housing'],
    description:
      'NYC\'s largest provider of permanent supportive housing. Also runs street outreach. Call or walk in — serves all boroughs including returning citizens.',
    phone: '(212) 389-9300',
    address: '505 8th Ave, Manhattan, NY 10018',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://breakingground.org',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC DHS partner',
  },
  {
    id: 'cityfheps',
    name: 'CityFHEPS — NYC Rental Assistance Voucher',
    categories: ['housing'],
    description:
      'NYC rental subsidy for people experiencing homelessness or at risk. Returning citizens may qualify for priority status. Apply at any HRA Job Center.',
    phone: '(718) 557-1399',
    address: 'Apply at nearest HRA office — nyc.gov/hra',
    website: 'https://www.nyc.gov/cityfheps',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC HRA / NYC.gov',
  },
  {
    id: 'dhs-shelter-311',
    name: 'NYC DHS Emergency Shelter — Call 311',
    categories: ['housing'],
    description:
      'Say "I need emergency shelter." Available 24/7 in all boroughs. Separate intakes for single adults, families, and women. PATH intake for families with children under 21.',
    phone: '311',
    address: 'PATH: 151 E 151st St, Bronx (families) | 30th St Shelter (men)',
    hours: '24/7',
    website: 'https://www.nyc.gov/dhs',
    boroughs: ['All'],
    tags: ['free', 'walk-in', 'no-id-required'],
    source: 'NYC DHS',
  },

  // ── Food & Benefits ────────────────────────────────────────────
  {
    id: 'snap-hra',
    name: 'HRA — SNAP Food Stamps',
    categories: ['food'],
    description:
      'Apply for SNAP (food stamps) at HRA. Returning citizens may qualify immediately. Apply online at access.nyc.gov or call 311. Most people are approved within 30 days.',
    phone: '(718) 557-1399',
    address: 'Multiple locations — nyc.gov/hra for nearest office',
    website: 'https://access.nyc.gov',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC HRA / NYC.gov',
  },
  {
    id: 'city-harvest',
    name: 'City Harvest — Food Pantry Finder',
    categories: ['food'],
    description:
      '500+ food pantries and soup kitchens across NYC. Text your zip code to 897-211 to find the nearest one open today. No ID required at most locations.',
    phone: '(646) 412-0600',
    address: '195 Ottilie Ave, Bronx, NY 10472 (main warehouse)',
    website: 'https://www.cityharvest.org/food-connects',
    boroughs: ['All'],
    tags: ['free', 'walk-in', 'no-id-required'],
    source: 'City Harvest (NYC-wide)',
  },
  {
    id: 'cash-assistance-hra',
    name: 'HRA — Cash Assistance',
    categories: ['food'],
    description:
      'Emergency and ongoing cash assistance for income-eligible New Yorkers. Apply at access.nyc.gov or at any HRA Job Center. Some returning citizens qualify immediately.',
    phone: '(718) 557-1399',
    address: 'Multiple HRA offices citywide',
    website: 'https://access.nyc.gov',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC HRA',
  },

  // ── Employment ─────────────────────────────────────────────────
  {
    id: 'strive',
    name: 'STRIVE — Job Training & Placement',
    categories: ['employment'],
    description:
      'Free job training, placement, and career coaching. Specifically designed to serve people with records. Graduates have 70%+ job placement rates. Walk-in or call.',
    phone: '(212) 360-1100',
    address: '239 E 111th St, Manhattan, NY 10029',
    hours: 'Mon–Fri 8:30am–5pm',
    website: 'https://striveinternational.org',
    boroughs: ['Manhattan', 'Bronx', 'Brooklyn'],
    tags: ['free', 'walk-in'],
    source: 'NYC WIA-funded',
  },
  {
    id: 'workforce1',
    name: 'NYC Workforce1 Career Centers',
    categories: ['employment'],
    description:
      'Free job placement, resume help, and career counseling. 30+ locations citywide. Walk-in or call 311. Open to people with records. No appointment needed.',
    phone: '311',
    address: 'Multiple locations — nyc.gov/workforce1',
    hours: 'Mon–Fri 8:30am–5pm',
    website: 'https://www.nyc.gov/workforce1',
    boroughs: ['All'],
    tags: ['free', 'walk-in'],
    source: 'NYC SBS / NYC.gov',
  },
  {
    id: 'ceo',
    name: 'Center for Employment Opportunities (CEO)',
    categories: ['employment'],
    description:
      'Transitional employment program for people with recent criminal records. Provides immediate paid work, job coaching, and permanent job placement. Nationally recognized.',
    phone: '(212) 422-4430',
    address: '50 Broadway, Ste 2100, Manhattan, NY 10004',
    hours: 'Mon–Fri 8am–5pm',
    website: 'https://ceoworks.org',
    boroughs: ['All'],
    tags: ['free', 'paid-work'],
    source: 'DOL / DCJS partner',
  },
  {
    id: 'next-mile-nyc',
    name: 'Next Mile NYC — Reentry Employment Hub',
    categories: ['employment'],
    description:
      'NYC initiative connecting returning citizens to fair-chance employers. Works with 300+ employers committed to hiring people with records. Free resume and interview prep.',
    phone: '(212) 513-0100',
    address: 'Online + in-person workshops citywide',
    website: 'https://www.nyc.gov/nextmile',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC DCJS / NYC.gov',
  },
  {
    id: 'fair-chance-act',
    name: 'NYC Fair Chance Act — Know Your Rights',
    categories: ['employment', 'legal'],
    description:
      'Employers cannot ask about your conviction record before making a conditional job offer. If they do, it\'s illegal. File a complaint with NYC Commission on Human Rights.',
    phone: '(212) 416-0197',
    address: 'NYC Commission on Human Rights — 40 Rector St',
    website: 'https://www.nyc.gov/fairchance',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC Commission on Human Rights',
  },

  // ── Mental Health ──────────────────────────────────────────────
  {
    id: 'nyc-well',
    name: 'NYC Well — Free Mental Health Support',
    categories: ['mentalHealth'],
    description:
      'Free, confidential mental health support by phone, text, or chat. Available 24/7 in 200+ languages. No insurance needed. Counselors trained in reentry experiences.',
    phone: '1-888-NYC-WELL (1-888-692-9355)',
    hours: '24/7',
    website: 'https://nycwell.cityofnewyork.us',
    boroughs: ['All'],
    tags: ['free', 'bilingual', 'no-id-required'],
    source: 'NYC DOHMH',
  },
  {
    id: '988-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    categories: ['mentalHealth'],
    description:
      'Call or text 988 for immediate crisis support. Free, confidential, available 24/7. Save it in your phone now — for yourself or someone you know.',
    phone: '988',
    hours: '24/7',
    website: 'https://988lifeline.org',
    boroughs: ['All'],
    tags: ['free', 'no-id-required'],
    source: 'SAMHSA / Federal',
  },
  {
    id: 'hour-children-mental-health',
    name: 'Hour Children — Peer Support Groups',
    categories: ['mentalHealth', 'family', 'community'],
    description:
      'Peer support groups led by formerly incarcerated women. Powerful, judgment-free environment. Also offers reentry services, childcare, and housing for women and families.',
    phone: '(718) 358-1601',
    address: '36-11 12th St, Long Island City, Queens, NY 11106',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://hourchildren.org',
    boroughs: ['Queens', 'Bronx', 'Brooklyn'],
    tags: ['free', 'women-only'],
    source: 'NYC DOC partner',
  },
  {
    id: 'housing-works-bh',
    name: 'Housing Works — Behavioral Health Services',
    categories: ['mentalHealth'],
    description:
      'Free mental health and substance use treatment for people with justice involvement. Accepts Medicaid and uninsured. Multiple locations in Brooklyn and Manhattan.',
    phone: '(212) 966-0466',
    address: '57 Willoughby St, Brooklyn, NY 11201',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://housingworks.org',
    boroughs: ['Brooklyn', 'Manhattan'],
    tags: ['free', 'walk-in'],
    source: 'NYC DOHMH partner',
  },

  // ── Legal ──────────────────────────────────────────────────────
  {
    id: 'legal-aid-society',
    name: 'Legal Aid Society — Criminal Defense & Reentry',
    categories: ['legal'],
    description:
      'Free legal representation and advice for income-eligible New Yorkers. Has a dedicated reentry unit for issues like housing, benefits, and record sealing. Walk-in clinics available.',
    phone: '(212) 577-3300',
    address: '120 Wall St, Manhattan, NY 10005',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://legalaidnyc.org',
    boroughs: ['All'],
    tags: ['free', 'walk-in'],
    source: 'Legal Aid Society',
  },
  {
    id: 'bronx-defenders',
    name: 'Bronx Defenders — Reentry Legal Help',
    categories: ['legal'],
    description:
      'Free holistic legal defense for Bronx residents including housing, immigration, family, and criminal record matters. Specializes in serving people with justice involvement.',
    phone: '(718) 838-7878',
    address: '360 E 161st St, Bronx, NY 10451',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://bronxdefenders.org',
    boroughs: ['Bronx'],
    tags: ['free'],
    source: 'Bronx Defenders',
  },
  {
    id: 'clean-slate-act',
    name: 'NY Clean Slate Act (Nov 2024) — Record Sealing',
    categories: ['legal'],
    description:
      'New law automatically sealing eligible conviction records after waiting period (3 years for misdemeanors, 8 years for most felonies). Call Legal Aid to check your eligibility.',
    phone: '(212) 577-3300',
    address: 'Administered statewide — apply through Legal Aid or Bronx Defenders',
    website: 'https://www.ny.gov/programs/clean-slate-act',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYS Legislature / NY.gov',
  },
  {
    id: 'osborne-legal',
    name: 'Osborne Association — Legal & Reentry Services',
    categories: ['legal', 'family', 'employment'],
    description:
      'Comprehensive reentry services including legal aid, employment, and family support. Specializes in people with long sentences. NYC\'s oldest reentry organization (1931).',
    phone: '(718) 707-2600',
    address: '809 Westchester Ave, Bronx, NY 10455',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://osborneny.org',
    boroughs: ['Bronx', 'Brooklyn'],
    tags: ['free'],
    source: 'NYC DOC / DCJS partner',
  },

  // ── Family ─────────────────────────────────────────────────────
  {
    id: 'childrens-aid-family',
    name: "Children's Aid Society — Family Reconnection",
    categories: ['family'],
    description:
      'Helps returning parents reconnect with children safely. Free mediation and family support services. Works with ACS to support reunification when appropriate.',
    phone: '(212) 949-4800',
    address: '711 Third Ave, Manhattan, NY 10017',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://childrensaidnyc.org',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC ACS partner',
  },
  {
    id: 'legal-aid-family',
    name: 'Legal Aid — Family Court & Custody',
    categories: ['family', 'legal'],
    description:
      'Free legal help for custody, visitation, and child support matters. Has a returning citizens unit that understands the challenges of reestablishing parental rights after incarceration.',
    phone: '(212) 577-3300',
    address: '120 Wall St, Manhattan, NY 10005',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://legalaidnyc.org/get-legal-help/family-legal-issues',
    boroughs: ['All'],
    tags: ['free'],
    source: 'Legal Aid Society',
  },
  {
    id: 'vfap-osborne',
    name: 'Osborne — Visitor & Family Assistance Program (VFAP)',
    categories: ['family'],
    description:
      'Supports families of incarcerated people and helps with reconnection post-release. Offers transportation assistance for family visits, counseling, and children\'s programs.',
    phone: '(718) 707-2600',
    address: '809 Westchester Ave, Bronx, NY 10455',
    website: 'https://osborneny.org',
    boroughs: ['Bronx', 'Brooklyn'],
    tags: ['free'],
    source: 'NYC DOC partner',
  },

  // ── Education ─────────────────────────────────────────────────
  {
    id: 'cuny-start',
    name: 'CUNY Start — Free College Prep',
    categories: ['education'],
    description:
      'Free pre-college program for CUNY-bound adults who need to strengthen math, reading, or writing. CUNY accepts returning citizens. Call for intake process.',
    phone: '(212) 794-5351',
    address: 'Multiple CUNY campuses citywide',
    website: 'https://www.cuny.edu/admissions/undergraduate/cuny-start',
    boroughs: ['All'],
    tags: ['free'],
    source: 'CUNY / NYC.gov',
  },
  {
    id: 'ged-311',
    name: 'NYC Free GED Programs',
    categories: ['education'],
    description:
      'Free GED test prep and testing at dozens of locations citywide. Call 311 for the site closest to you. You can start within a week. Some programs also offer stipends.',
    phone: '311',
    address: 'Multiple locations — call 311 for nearest',
    website: 'https://www.nyc.gov/ged',
    boroughs: ['All'],
    tags: ['free', 'walk-in'],
    source: 'NYC DOE Adult Education / NYC.gov',
  },
  {
    id: 'literacy-partners',
    name: 'Literacy Partners — Adult Reading & Writing',
    categories: ['education'],
    description:
      'Free one-on-one and small group literacy tutoring for adults. Flexible scheduling. Serves returning citizens across all five boroughs. Open enrollment.',
    phone: '(212) 725-9200',
    address: '30 E 33rd St, Ste 401, Manhattan, NY 10016',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://literacypartners.org',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC Dept. of Education partner',
  },

  // ── Community ─────────────────────────────────────────────────
  {
    id: 'fortune-society-community',
    name: 'Fortune Society — Peer Support & Community',
    categories: ['community', 'mentalHealth', 'employment'],
    description:
      'Peer-led support groups, mentoring, and community for returning citizens. Run largely by formerly incarcerated people. "The Castle" in West Harlem is a full-service reentry hub.',
    phone: '(212) 691-7554',
    address: '625 W 140th St, Manhattan, NY 10031',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://fortunesociety.org',
    boroughs: ['Manhattan'],
    tags: ['free', 'walk-in'],
    source: 'NYC DOC partner',
  },
  {
    id: 'reentry-council-nyc',
    name: 'NYC Mayor\'s Office — Reentry Council',
    categories: ['community'],
    description:
      'NYC government reentry coordination hub. Connects to city services, tracks policy changes, and coordinates between agencies. Resource map and hotline available.',
    phone: '(212) 384-1000',
    address: '100 Gold St, Manhattan, NY 10038',
    website: 'https://www.nyc.gov/reentry',
    boroughs: ['All'],
    tags: ['free'],
    source: 'NYC Mayor\'s Office / NYC.gov',
  },
  {
    id: 'commonpoint-queens',
    name: 'CommonPoint Queens — Reentry Services',
    categories: ['community', 'employment', 'mentalHealth'],
    description:
      'Holistic reentry support for Queens residents including employment, mental health, housing navigation, and peer mentoring. Bilingual staff (English/Spanish).',
    phone: '(718) 268-5011',
    address: '58-20 Little Neck Pkwy, Little Neck, Queens, NY 11362',
    hours: 'Mon–Fri 9am–5pm',
    website: 'https://commonpointqueens.org',
    boroughs: ['Queens'],
    tags: ['free', 'bilingual'],
    source: 'NYC DCJS partner',
  },
]

// ── Impact Statistics (NYC-sourced) ─────────────────────────────
export const IMPACT_STATS = [
  {
    figure: '55,000+',
    label: 'people released from NYC jails each year',
    icon: 'people',
    source: 'NYC DOC Annual Report',
  },
  {
    figure: '72 hrs',
    label: 'critical window — housing & ID prevent relapse',
    icon: 'timer',
    source: 'NYC Mayor\'s Reentry Task Force',
  },
  {
    figure: '43%',
    label: 'return within 3 years without proper support',
    icon: 'refresh',
    source: 'NYC DOC Recidivism Report',
  },
  {
    figure: '$413K',
    label: 'cost per person per year at Rikers Island',
    icon: 'attach_money',
    source: 'NYC Independent Budget Office, 2023',
  },
]
