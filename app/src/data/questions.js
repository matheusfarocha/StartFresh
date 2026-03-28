// ============================================================
// questions.js — Adaptive Question Bank for FreshStart
// Each question defines its options and a next() function
// that takes the current answer and returns the next question ID.
// null means the onboarding flow is complete → generate roadmap.
// ============================================================

export const QUESTION_BANK = {

  // ── STEP 1: Time away ────────────────────────────────────────
  // Drives: auto-need injection (mentalHealth, community),
  //         Osborne referral for 15+ (they specialize in long-term),
  //         tone/language complexity of roadmap steps
  timeAway: {
    id: 'timeAway',
    question: 'How long were you away?',
    sub: "I'll use this to find the most relevant resources for you.",
    type: 'single',
    options: [
      { value: '< 1 year',   label: 'Less than 1 year',   sub: 'Things haven\'t changed too much' },
      { value: '1-5 years',  label: '1 – 5 years',        sub: 'Some catching up to do' },
      { value: '5-15 years', label: '5 – 15 years',       sub: 'A lot has changed — we\'ll cover it' },
      { value: '15+ years',  label: '15 years or more',   sub: 'We\'ll walk through everything, step by step' },
    ],
    next: () => 'borough',
  },

  // ── STEP 2: Borough ──────────────────────────────────────────
  // Drives: all borough-specific resource lookups —
  //         drop-in centers, HRA offices, DMV locations,
  //         SNAP centers, Medicaid offices, shelter intake
  borough: {
    id: 'borough',
    question: 'Which borough are you returning to?',
    sub: "I'll find programs and offices close to you.",
    type: 'single',
    options: [
      { value: 'Bronx',         label: 'Bronx' },
      { value: 'Brooklyn',      label: 'Brooklyn' },
      { value: 'Manhattan',     label: 'Manhattan' },
      { value: 'Queens',        label: 'Queens' },
      { value: 'Staten Island', label: 'Staten Island' },
    ],
    next: () => 'hasID',
  },

  // ── STEP 3: ID status ────────────────────────────────────────
  // THE most critical branch. No ID = entire roadmap restructures.
  // Data basis: Section 9 — "What to bring" confirms ID gates
  // HRA benefits, shelter formal intake, Medicaid enrollment,
  // housing applications, and employment.
  hasID: {
    id: 'hasID',
    question: 'Do you currently have a valid government-issued ID?',
    sub: 'This affects almost every next step — there are no wrong answers.',
    type: 'single',
    options: [
      { value: 'yes',     label: 'Yes, I have a valid ID' },
      { value: 'expired', label: 'I have one but it\'s expired' },
      { value: 'no',      label: 'No, I don\'t have one' },
    ],
    // No ID or expired → ask about birth certificate (needed for ID recovery chain)
    // Has ID → skip to housing situation
    next: (answer) => answer === 'yes' ? 'housingStatus' : 'hasBirthCert',
  },

  // ── STEP 3a: Birth certificate (only if no/expired ID) ───────
  // Data basis: ID recovery chain in roadmapEngine.js —
  // birth cert must come before SSN which must come before state ID.
  // NYC Vital Records is the resource; free within 30 days of release.
  hasBirthCert: {
    id: 'hasBirthCert',
    question: 'Do you have a copy of your birth certificate?',
    sub: "This is the first thing needed to get your ID — don't worry if you don't have it.",
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, I have it' },
      { value: 'no',  label: 'No, I don\'t have it' },
    ],
    // Either way → proceed to housing; answer is stored and used
    // by roadmapEngine to order ID recovery steps correctly
    next: () => 'housingStatus',
  },

  // ── STEP 4: Housing situation ─────────────────────────────────
  // Drives: whether Section 1 (emergency drop-in) or
  //         Section 2 (transitional housing programs) surfaces first.
  // Data basis:
  //   - Drop-in centers: no ID required, 24hrs, all boroughs (Section 1)
  //   - ETH / Housing Works / Fortune Society: for those experiencing
  //     homelessness or housing instability (Section 2)
  //   - PATH: for families with children under 21 (Section 1)
  housingStatus: {
    id: 'housingStatus',
    question: 'Where are you staying right now?',
    sub: "Be honest — this helps me find the right kind of help.",
    type: 'single',
    options: [
      { value: 'nowhere',  label: 'I have nowhere to stay tonight' },
      { value: 'temporary',label: 'Staying with someone temporarily' },
      { value: 'shelter',  label: 'Already in a shelter' },
      { value: 'stable',   label: 'I have stable housing' },
    ],
    next: (answer) => answer === 'nowhere' ? 'hasChildren' : 'paroleProbation',
  },

  // ── STEP 4a: Children (only if nowhere to stay) ───────────────
  // Data basis: DHS Shelter Intake has separate intake paths —
  //   - Families with children under 21 → PATH (151 E 151st St, Bronx)
  //   - Adult men → 30th Street Men's Shelter
  //   - Adult women → Franklin Shelter (Bronx) or HELP Women's (Brooklyn)
  //   - Adult families no children → AFIC
  // This single question routes the user to the correct intake center.
  hasChildren: {
    id: 'hasChildren',
    question: 'Are you with children under 21?',
    sub: 'This determines which shelter intake center is right for you.',
    type: 'single',
    options: [
      { value: 'yes', label: 'Yes, I have children with me' },
      { value: 'no',  label: 'No, just me (or adults only)' },
    ],
    next: () => 'paroleProbation',
  },

  // ── STEP 5: Parole / Probation ────────────────────────────────
  // Drives: housing eligibility filtering (some programs
  //         have restrictions for people on supervision),
  //         legal aid surfacing (Clean Slate Act, rights info),
  //         employment section (Fair Chance Act context becomes
  //         more urgent when on supervision)
  // Data basis: Section 6 — Legal Aid, Clean Slate Act (Nov 2024),
  //             SNAP eligibility note re: drug trafficking convictions
  paroleProbation: {
    id: 'paroleProbation',
    question: 'Are you currently on parole or probation?',
    sub: "This affects which housing and benefit options are available to you.",
    type: 'single',
    options: [
      { value: 'parole',     label: 'Yes — parole' },
      { value: 'probation',  label: 'Yes — probation' },
      { value: 'no',         label: 'No, I\'m off supervision' },
      { value: 'unsure',     label: 'I\'m not sure' },
    ],
    next: () => 'needs',
  },

  // ── STEP 6: Needs (multi-select) ─────────────────────────────
  // Drives: which sections appear in the roadmap and their
  //         score bonuses in roadmapEngine.js
  // Every key maps to a resource section in the data:
  //   housing      → Sections 1 & 2
  //   food         → Section 3 (SNAP/HRA)
  //   employment   → Section 4 (STRIVE, Workforce1, Next Mile NYC)
  //   mentalHealth → Section 5 (NYC Well, Housing Works behavioral health)
  //   legal        → Section 6 (Legal Aid, Clean Slate Act)
  //   family       → Section 7 VFAP (Osborne/Hour Children, Rikers family program)
  //   education    → CUNY Start, GED programs
  //   community    → Fortune Society peer networks, Revia peer matching
  needs: {
    id: 'needs',
    question: "What's most important right now?",
    sub: 'Select everything that applies. There are no wrong answers.',
    type: 'multi',
    options: [
      { value: 'housing',      label: 'Housing',          icon: '🏠', sub: 'Finding a place to stay' },
      { value: 'food',         label: 'Food & Benefits',  icon: '🍽️', sub: 'SNAP, food pantries, cash assistance' },
      { value: 'employment',   label: 'Employment',       icon: '💼', sub: 'Getting a job, job training' },
      { value: 'mentalHealth', label: 'Mental Health',    icon: '💬', sub: 'Counseling, crisis support' },
      { value: 'legal',        label: 'Legal Help',       icon: '⚖️', sub: 'Rights, record sealing, fair hearings' },
      { value: 'family',       label: 'Family',           icon: '👨‍👩‍👧', sub: 'Reconnecting with loved ones' },
      { value: 'education',    label: 'Education',        icon: '📚', sub: 'GED, college, vocational training' },
      { value: 'community',    label: 'Community',        icon: '🤝', sub: 'Mentors, peer groups' },
    ],
    next: () => null, // End of flow → generate roadmap
  },
};

// ── Flow entry point ─────────────────────────────────────────────
// Always start here
export const FIRST_QUESTION = 'timeAway';

// ── Helper: get next question ID given current question + answer ──
export function getNextQuestion(questionId, answer) {
  const question = QUESTION_BANK[questionId];
  if (!question) return null;
  return question.next(answer);
}

// ── Helper: build ordered question list for progress tracking ────
// Returns the actual path taken based on accumulated answers
export function getQuestionPath(answers) {
  const path = [];
  let current = FIRST_QUESTION;
  while (current) {
    path.push(current);
    const answer = answers[current];
    if (!answer) break; // haven't answered this one yet
    current = getNextQuestion(current, answer);
  }
  return path;
}

