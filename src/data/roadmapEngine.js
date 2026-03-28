const STEPS = {
  id: {
    Bronx: [
      { id: 'id-1', text: 'Get your birth certificate', detail: 'NYC Vital Records — 125 Worth St, Manhattan. Free if released in the last 30 days. Bring your release paperwork.', time: '1–2 days' },
      { id: 'id-2', text: 'Get your state ID or driver\'s license', detail: 'DMV Tremont Ave, Bronx. Bring birth certificate + release papers. No appointment needed Tue & Thu mornings.', time: 'Same day' },
      { id: 'id-3', text: 'Apply for your Social Security card', detail: 'SSA Office near Tremont DMV. Bring your new state ID and birth certificate.', time: '2–4 weeks (mail)' },
    ],
    Brooklyn: [
      { id: 'id-1', text: 'Get your birth certificate', detail: 'NYC Vital Records — 125 Worth St. Free within 30 days of release. Bring release paperwork.', time: '1–2 days' },
      { id: 'id-2', text: 'Get your state ID', detail: 'DMV Atlantic Ave, Brooklyn. Bring birth certificate + release papers.', time: 'Same day' },
      { id: 'id-3', text: 'Apply for your Social Security card', detail: 'SSA Office on Flatbush Ave. Bring your new state ID.', time: '2–4 weeks (mail)' },
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
      { id: 'h-2', text: 'Apply for CityFHEPS rental voucher', detail: 'Requires ID (complete ID step first). Apply at HRA office on E. 149th St. Priority status may apply.', time: '2–6 weeks' },
      { id: 'h-3', text: 'Emergency backup: BronxWorks', detail: 'Open 7 days. 60 E. Tremont Ave. No appointment needed for emergency intake.', time: 'Same day' },
    ],
    Brooklyn: [
      { id: 'h-1', text: 'Contact CAMBA Housing', detail: 'Transitional housing. Brooklyn office: (718) 940-6800. Walk-in Mon–Fri 9am–4pm.', time: 'Same day' },
      { id: 'h-2', text: 'Apply for CityFHEPS rental voucher', detail: 'Requires ID. Apply at nearest HRA office.', time: '2–6 weeks' },
      { id: 'h-3', text: 'Emergency backup: Call 311', detail: 'Say "I need emergency shelter." Available 24/7.', time: 'Same day' },
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
      { id: 'e-2', text: 'Know your rights: NYC Fair Chance Act', detail: 'Employers cannot ask about your record until after a conditional offer. Print this — it\'s the law.', time: '30 min read' },
      { id: 'e-3', text: 'Visit a Workforce1 Career Center', detail: 'Free job placement services. 30+ locations citywide. Walk-in or call 311 for your nearest center.', time: 'Same day' },
    ],
  },
  mentalHealth: {
    default: [
      { id: 'm-1', text: 'Free walk-in counseling', detail: 'Bronx Community Solutions — 215 E 161st St. No insurance needed. Mon–Fri 9am–5pm. Counselors understand reentry.', time: 'This week' },
      { id: 'm-2', text: 'Join a peer support group', detail: 'Hour Children — groups led by formerly incarcerated people. Judgment-free. Call (718) 358-1601.', time: 'This week' },
      { id: 'm-3', text: 'Save the crisis line in your phone', detail: '988 Lifeline — text or call anytime. Free and confidential. Save it right now.', time: '2 minutes' },
    ],
  },
};

const NEED_META = {
  id:          { label: 'ID & Documents', icon: '📋' },
  housing:     { label: 'Housing',        icon: '🏠' },
  employment:  { label: 'Employment',     icon: '💼' },
  mentalHealth:{ label: 'Mental Health',  icon: '💬' },
};

export function generateRoadmap({ timeAway, borough, needs }) {
  const autoNeeds = [];
  if (timeAway === '5+ years') autoNeeds.push('mentalHealth');

  const allNeeds = [...new Set(['id', ...needs, ...autoNeeds])];

  const sections = allNeeds.map(key => {
    const meta = NEED_META[key];
    if (!meta) return null;
    const stepsMap = STEPS[key] || {};
    const steps = stepsMap[borough] || stepsMap.default || [];
    return {
      key,
      ...meta,
      steps,
      isAuto: autoNeeds.includes(key) && !needs.includes(key),
    };
  }).filter(Boolean);

  return { sections, borough, timeAway, generatedAt: new Date().toISOString() };
}
