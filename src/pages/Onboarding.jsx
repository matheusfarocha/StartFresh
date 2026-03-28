import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateRoadmap } from '../data/roadmapEngine';
import Button from '../components/Button';
import Mascot from '../components/Mascot';

const BOROUGHS = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'];

const TIME_OPTIONS = [
  { value: '< 1 year',  label: 'Less than 1 year',  sub: 'Things haven\'t changed too much' },
  { value: '1–5 years', label: '1 – 5 years',        sub: 'Some catching up to do' },
  { value: '5+ years',  label: '5 years or more',    sub: 'We\'ll walk through everything, step by step' },
];

const NEEDS = [
  { key: 'housing',      label: 'Housing',       icon: '🏠', sub: 'Finding a place to stay' },
  { key: 'employment',   label: 'Employment',    icon: '💼', sub: 'Getting a job' },
  { key: 'mentalHealth', label: 'Mental Health', icon: '💬', sub: 'Counseling & support' },
];

const ROADMAP_MODES = [
  {
    value: 'auto',
    label: 'Build it myself',
    sub: 'I\'ll follow the steps on my own',
    icon: '🗺️',
  },
  {
    value: 'mentor',
    label: 'A mentor or caseworker will help me',
    sub: 'Someone is guiding me through this',
    icon: '🤝',
  },
];

// 4 steps total (0 = mode, 1 = time away, 2 = borough, 3 = needs)
const TIPS = [
  "There's no wrong answer here. Both paths lead to the same plan — we just want to know who's with you.",
  "Don't worry if things feel uncertain. I'll use your answers to find what matters most right now.",
  "Don't worry if you're not sure about your final address yet. Picking the borough where you'll spend the most time is a great start.",
  "Pick everything that applies — there are no wrong answers. You can always adjust your plan later.",
];

const TOTAL_STEPS = 4;

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, setRoadmap } = useApp();
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState({ roadmapMode: null, timeAway: null, borough: null, needs: [] });

  function handleNext() {
    if (step < TOTAL_STEPS - 1) { setStep(s => s + 1); return; }
    const finalProfile = { ...local };
    setProfile(finalProfile);
    setRoadmap(generateRoadmap(finalProfile));
    navigate('/roadmap');
  }

  const canNext =
    (step === 0 && local.roadmapMode) ||
    (step === 1 && local.timeAway) ||
    (step === 2 && local.borough) ||
    (step === 3 && local.needs.length > 0);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress bar */}
      <div style={{ height: 5, background: 'var(--cream-dark)' }}>
        <div style={{ height: '100%', background: 'var(--green-light)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
      </div>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', background: 'var(--white)',
        borderBottom: '1px solid var(--cream-dark)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>FreshStart</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Step {step + 1} of {TOTAL_STEPS}</span>
      </nav>

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '48px 32px', width: '100%' }} className="page-enter">
        <Mascot message={TIPS[step]} />

        {/* Step 0 — Roadmap mode */}
        {step === 0 && (
          <div>
            <h2 style={headingStyle}>How would you like to build your roadmap?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ROADMAP_MODES.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setLocal(p => ({ ...p, roadmapMode: opt.value }))}
                  style={{
                    padding: '22px 24px',
                    background: local.roadmapMode === opt.value ? 'var(--green-deep)' : 'var(--white)',
                    border: `2px solid ${local.roadmapMode === opt.value ? 'var(--green-deep)' : 'var(--cream-dark)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer', textAlign: 'left',
                    fontFamily: 'var(--font-body)', transition: 'var(--transition)',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <span style={{ fontSize: 32 }}>{opt.icon}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500, color: local.roadmapMode === opt.value ? 'white' : 'var(--ink)', marginBottom: 4 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 13, color: local.roadmapMode === opt.value ? 'rgba(255,255,255,0.72)' : 'var(--ink-muted)' }}>
                      {opt.sub}
                    </div>
                  </div>
                  {local.roadmapMode === opt.value && (
                    <div style={{ marginLeft: 'auto', width: 24, height: 24, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13 }}>✓</div>
                  )}
                </button>
              ))}
            </div>
            {local.roadmapMode === 'mentor' && (
              <div style={{
                marginTop: 16, padding: '14px 18px',
                background: 'var(--amber-pale)', border: '1px solid var(--amber)',
                borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6,
              }}>
                Great — your mentor or caseworker can help you go through the next steps together.
              </div>
            )}
          </div>
        )}

        {/* Step 1 — Time away */}
        {step === 1 && (
          <div>
            <h2 style={headingStyle}>How long were you away?</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {TIME_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.value}
                  label={opt.label} sub={opt.sub}
                  selected={local.timeAway === opt.value}
                  onClick={() => setLocal(p => ({ ...p, timeAway: opt.value }))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Borough */}
        {step === 2 && (
          <div>
            <h2 style={headingStyle}>Which borough are you returning to?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {BOROUGHS.map(b => (
                <OptionCard
                  key={b} label={b}
                  selected={local.borough === b}
                  onClick={() => setLocal(p => ({ ...p, borough: b }))}
                  center
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Needs */}
        {step === 3 && (
          <div>
            <h2 style={headingStyle}>What do you need most right now?</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 24 }}>
              Select everything that applies.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {NEEDS.map(n => (
                <NeedCard
                  key={n.key} icon={n.icon} label={n.label} sub={n.sub}
                  selected={local.needs.includes(n.key)}
                  onClick={() => setLocal(p => ({
                    ...p,
                    needs: p.needs.includes(n.key)
                      ? p.needs.filter(x => x !== n.key)
                      : [...p.needs, n.key],
                  }))}
                />
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 14 }}>
              ID & Documents will always be included — it's needed for everything else.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)}>
              ← Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canNext} style={{ flex: 1 }}>
            {step === TOTAL_STEPS - 1 ? 'Build my roadmap →' : 'Next →'}
          </Button>
        </div>
      </main>
    </div>
  );
}

const headingStyle = {
  fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300,
  color: 'var(--ink)', marginBottom: 24, lineHeight: 1.25,
};

function OptionCard({ label, sub, selected, onClick, center }) {
  return (
    <button onClick={onClick} style={{
      padding: '18px 22px',
      background: selected ? 'var(--green-deep)' : 'var(--white)',
      border: `2px solid ${selected ? 'var(--green-deep)' : 'var(--cream-dark)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer', textAlign: center ? 'center' : 'left',
      fontFamily: 'var(--font-body)', transition: 'var(--transition)',
    }}>
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
      border: `2px solid ${selected ? 'var(--green-light)' : 'var(--cream-dark)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer', textAlign: 'left',
      fontFamily: 'var(--font-body)', transition: 'var(--transition)',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: selected ? 'var(--green-deep)' : 'var(--ink)' }}>{label}</div>
        <div style={{ fontSize: 12, color: selected ? 'var(--green-mid)' : 'var(--ink-muted)' }}>{sub}</div>
      </div>
      {selected && (
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--green-mid)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
        }}>✓</div>
      )}
    </button>
  );
}
