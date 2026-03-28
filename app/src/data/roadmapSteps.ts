export interface RoadmapStep {
  id: number
  title: string
  category: string
  categoryColor: 'secondary' | 'tertiary' | 'primary'
  description: string
  details: {
    organization: string
    address: string
    phone: string
    tip: string
  }
}

export const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    title: 'Get your birth certificate',
    category: 'ID & Benefits',
    categoryColor: 'secondary',
    description:
      'This is the fundamental "seed" document required for almost every other form of identification.',
    details: {
      organization: 'NYC Department of Health & Mental Hygiene',
      address: '125 Worth Street, Room 144, Manhattan, NY 10013',
      phone: '(212) 639-9675',
      tip: 'Bring a money order for $15. Processing takes about 2 weeks by mail, or you can walk in.',
    },
  },
  {
    id: 2,
    title: 'Draft your story (Resume)',
    category: 'Employment',
    categoryColor: 'tertiary',
    description:
      'Translate your skills and experiences into a professional format that focuses on your future potential.',
    details: {
      organization: 'Center for Employment Opportunities (CEO)',
      address: '50 Broadway, Suite 1604, New York, NY 10004',
      phone: '(212) 422-4430',
      tip: 'CEO provides free resume workshops specifically designed for returning citizens. No appointment needed for walk-ins on Tuesdays.',
    },
  },
  {
    id: 3,
    title: 'Apply for Non-Driver ID',
    category: 'ID & Benefits',
    categoryColor: 'secondary',
    description:
      'A valid state ID is your passport to opening a bank account and securing housing.',
    details: {
      organization: 'NY DMV',
      address: 'Multiple locations — nearest to Brooklyn: 625 Atlantic Ave',
      phone: '(518) 486-9786',
      tip: 'You\'ll need your birth certificate (Step 1), proof of address (shelter letter works), and Social Security card. The fee is $9 but fee waivers are available.',
    },
  },
  {
    id: 4,
    title: 'Open a fee-free bank account',
    category: 'Finance',
    categoryColor: 'primary',
    description:
      'Keeping your money safe and accessible is key to building long-term financial independence.',
    details: {
      organization: 'Spring Bank (CDFI)',
      address: '69 E 167th Street, Bronx, NY 10452',
      phone: '(718) 590-7070',
      tip: 'Spring Bank is a Community Development Financial Institution — they specialize in second-chance banking. No ChexSystems check required.',
    },
  },
  {
    id: 5,
    title: 'Schedule a health checkup',
    category: 'Wellness',
    categoryColor: 'tertiary',
    description:
      'Your physical and mental health are the engine that powers your entire journey forward.',
    details: {
      organization: 'NYC Health + Hospitals',
      address: 'Multiple locations — walk-ins welcome at Bellevue, Woodhull, Kings County',
      phone: '(844) NYC-4NYC',
      tip: 'You can get care regardless of insurance status or ability to pay. Bring any medical records you have from your facility.',
    },
  },
  {
    id: 6,
    title: 'Apply for SNAP benefits',
    category: 'ID & Benefits',
    categoryColor: 'secondary',
    description:
      'Food assistance can help you stretch your budget while you\'re getting back on your feet. You may qualify for expedited benefits.',
    details: {
      organization: 'NYC Human Resources Administration (HRA)',
      address: 'Apply online at ACCESS HRA or visit your local HRA center',
      phone: '(718) 557-1399',
      tip: 'If you have less than $150 in monthly income and less than $100 in resources, you may qualify for expedited SNAP within 7 days.',
    },
  },
  {
    id: 7,
    title: 'Connect with a reentry mentor',
    category: 'Wellness',
    categoryColor: 'tertiary',
    description:
      'Having someone who\'s walked this path before can make all the difference. A mentor provides guidance, accountability, and encouragement.',
    details: {
      organization: 'The Fortune Society',
      address: '29-76 Northern Blvd, Long Island City, NY 11101',
      phone: '(212) 691-7554',
      tip: 'Fortune Society offers peer mentoring from people with lived experience. They also have housing, employment, and education services all under one roof.',
    },
  },
  {
    id: 8,
    title: 'Enroll in workforce training',
    category: 'Employment',
    categoryColor: 'tertiary',
    description:
      'Build marketable skills in high-demand fields like construction, culinary arts, IT, or healthcare. Many programs are free and include job placement.',
    details: {
      organization: 'Doe Fund\'s Ready, Willing & Able Program',
      address: '232 East 84th Street, New York, NY 10028',
      phone: '(212) 628-5207',
      tip: 'The Doe Fund provides paid transitional work, housing, career training, and job placement. It\'s one of NYC\'s most respected reentry programs.',
    },
  },
]
