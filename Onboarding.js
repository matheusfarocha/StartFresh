import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateRoadmap } from '../data/roadmapEngine';
import Button from '../components/Button';
import Mascot from '../components/Mascot';

const TIME_OPTIONS = [
  { value: '< 1 year',   label: 'Less than 1 year', sub: 'Things haven\'t changed too much' },
  { value: '1-5 years',  label: '1 – 5 years', sub: 'Some catching up to do' },
  { value: '5-15 years', label: '5 – 15 years', sub: 'A lot has changed, we\'ll cover it' },
  { value: '15+ years',  label: '15 years or more', sub: 'We\'ll walk through everything, step by step' },
];

const BOROUGHS = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'];

const NEEDS = [
  { key: 'housing',     label: 'Housing',             icon: '🏠', sub: 'Finding a place to stay' },
  { key: 'employment',  label: 'Employment',          icon: '💼', sub: 'Getting a job' },
  { key: 'food',        label: 'Food & Benefits',     icon: '🍽️', sub: 'SNAP, food pantries' },
  { key: 'mentalHealth',label: 'Mental Health',       icon: '💬', sub: 'Counseling & support' },
  { key: 'family',      label: 'Family',              icon: '👨‍👩‍👧', sub: 'Reconnecting with loved ones' },
  { key: 'education',   label: 'Education',           icon: '📚', sub: 'GED, college, training' },
  { key: 'community',   label: 'Community',           icon: '🤝', sub: 'Mentors, peer groups' },
];

const MASCOT_MESSAGES = [
  "How long were you away? I'll use this to find the most relevant resources for you.",
  "Which borough are you coming back to? I'll find places close to you.",
  "What's most important right now? Pick everything that applies — there are no wrong answers.",
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, setProfile, setRoadmap } = useApp();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState({ timeAway: null, borough: null, needs: [] });

  function handleTimeSelect(val) {
    setLocal(p => ({ ...p, timeAway: val }));
  }
  function handleBoroughSelect(val) {
    setLocal(p => ({ ...p, borough: val }));
  }
  function handleNeedToggle(key) {
    setLocal(p => ({
      ...p,
      needs: p.needs.includes(key) ? p.needs.filter(n => n !== key) : [...p.needs, key],
    }));
  }

  function handleNext() {
    if (step < 2) { setStep(s => s + 1); return; }
    // Final step — generate roadmap
    const finalProfile = { ...profile, ...local };
    setProfile(finalProfile);
    const rm = generateRoadmap(finalProfile);
    setRoadmap(rm);
    navigate('/roadmap');
  }

  const canNext =
    (step === 0 && local.timeAway) ||
    (step === 1 && local.borough) ||
    (step === 2 && local.needs.length > 0);

  const progress = ((step + 1) / 3) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--cream-dark)' }}>
        <div style={{
          height: '100%', background: 'var(--green-light)',
          width: `${progress}%`, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', background: 'var(--white)',
        borderBottom: '1px solid var(--cream-dark)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌱</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>Revia</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Question {step + 1} of 3</span>
      </nav>

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '48px 32px', width: '100%' }} className="page-enter">

        <Mascot message={MASCOT_MESSAGES[step]} />

        {/* Step 0 — Time away */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300, color: 'var(--ink)', marginBottom: 28 }}>
              How long were you away?
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIME_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  sub={opt.sub}
                  selected={local.timeAway === opt.value}
                  onClick={() => handleTimeSelect(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 1 — Borough */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300, color: 'var(--ink)', marginBottom: 28 }}>
              Which borough are you returning to?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {BOROUGHS.map(b => (
                <OptionCard
                  key={b}
                  label={b}
                  selected={local.borough === b}
                  onClick={() => handleBoroughSelect(b)}
                  center
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Needs */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300, color: 'var(--ink)', marginBottom: 8 }}>
              What's most important right now?
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 28 }}>Select everything that applies. You can always add more later.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {NEEDS.map(n => (
                <NeedCard
                  key={n.key}
                  icon={n.icon}
                  label={n.label}
                  sub={n.sub}
                  selected={local.needs.includes(n.key)}
                  onClick={() => handleNeedToggle(n.key)}
                />
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 16 }}>
              Note: ID & Documents will always be included — it's needed for everything else.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 12, marginTop: 40, alignItems: 'center' }}>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)}>
              ← Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canNext}
            style={{ flex: 1, opacity: canNext ? 1 : 0.45, cursor: canNext ? 'pointer' : 'default' }}
          >
            {step === 2 ? 'Build my roadmap →' : 'Next →'}
          </Button>
        </div>
      </main>
    </div>
  );
}

function OptionCard({ label, sub, selected, onClick, center }) {
  return (
    <button onClick={onClick} style={{
      padding: '18px 22px',
      background: selected ? 'var(--green-deep)' : 'var(--white)',
      border: `2px solid ${selected ? 'var(--green-deep)' : 'var(--cream-dark)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'var(--transition)',
      textAlign: center ? 'center' : 'left',
      fontFamily: 'var(--font-body)',
    }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--green-light)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--cream-dark)'; }}
    >
      <div style={{ fontSize: 15, fontWeight: 500, color: selected ? 'white' : 'var(--ink)', marginBottom: sub ? 4 : 0 }}>{label}</div>
      {sub && <div style={{ fontSize: 13, color: selected ? 'rgba(255,255,255,0.72)' : 'var(--ink-muted)' }}>{sub}</div>}
    </button>
  );
}

function NeedCard({ icon, label, sub, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '16px 18px',
      background: selected ? 'var(--green-pale)' : 'var(--white)',
      border: `2px solid ${selected ? 'var(--green-mid)' : 'var(--cream-dark)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'var(--transition)',
      textAlign: 'left',
      fontFamily: 'var(--font-body)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--green-light)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--cream-dark)'; }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: selected ? 'var(--green-deep)' : 'var(--ink)' }}>{label}</div>
        <div style={{ fontSize: 12, color: selected ? 'var(--green-mid)' : 'var(--ink-muted)' }}>{sub}</div>
      </div>
      {selected && <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--green-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>✓</div>}
    </button>
  );
}
