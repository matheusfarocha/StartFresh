import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import Chatbot from '../components/Chatbot';

const NYC_STATS = [
  { num: '28%', label: 'Job placement rate', sub: 'within 90 days with program support' },
  { num: '48%', label: 'Stable housing', sub: 'secured within 6 months' },
  { num: '33%', label: 'GED completion', sub: 'among returning citizens in NYC' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, roadmap, profile, completedSteps } = useApp();

  const totalSteps = roadmap?.sections?.reduce((acc, s) => acc + s.steps.length, 0) || 0;
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  // Get next incomplete step across sections
  let nextStep = null;
  if (roadmap) {
    outer: for (const section of roadmap.sections) {
      for (const step of section.steps) {
        if (!completedSteps[step.id]) { nextStep = { ...step, sectionLabel: section.label }; break outer; }
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
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
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => navigate('/roadmap')} style={navBtnStyle}>My Roadmap</button>
          <button onClick={() => navigate('/')} style={navBtnStyle}>Sign out</button>
        </div>
      </nav>

      <main style={{ maxWidth: 780, margin: '0 auto', padding: '48px 32px' }} className="page-enter">

        <Mascot
          size={52}
          message={`Welcome back, ${user?.name || 'friend'}! ${pct > 0 ? `You're ${pct}% through your roadmap — keep going!` : "Let's get your roadmap started."}`}
        />

        {/* Top row — progress + next step */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 28 }}>
          {/* Progress circle card */}
          <div style={{
            background: 'var(--green-deep)', borderRadius: 'var(--radius-lg)',
            padding: '28px 24px', color: 'white', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 14 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="34"
                  fill="none" stroke="var(--green-light)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300 }}>{pct}%</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{doneCount}/{totalSteps} steps done</div>
          </div>

          {/* Next step */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--green-pale)',
            padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            {nextStep ? (
              <>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-mid)', marginBottom: 8 }}>
                    Your next step · {nextStep.sectionLabel}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.35 }}>{nextStep.text}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>⏱ {nextStep.time}</div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/roadmap')} style={{ alignSelf: 'flex-start', marginTop: 16 }}>
                  See full roadmap →
                </Button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12 }}>
                {totalSteps === 0 ? (
                  <>
                    <p style={{ color: 'var(--ink-soft)', fontSize: 14, textAlign: 'center' }}>No roadmap yet — let's build yours.</p>
                    <Button size="sm" onClick={() => navigate('/onboard')}>Start onboarding →</Button>
                  </>
                ) : (
                  <p style={{ color: 'var(--green-mid)', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>🎉 All steps complete!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* NYC Stats */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
          NYC reentry stats
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {NYC_STATS.map(s => (
            <div key={s.num} style={{
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '20px 18px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--green-mid)', marginBottom: 6 }}>{s.num}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.5 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Quick access */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
          Quick access
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { icon: '🗺️', label: 'My Roadmap', sub: 'View all steps', action: () => navigate('/roadmap') },
            { icon: '📚', label: 'Resources', sub: 'NYC programs & services', action: () => navigate('/learn') },
            { icon: '🤝', label: 'Community', sub: 'Connect with mentors', action: null },
          ].map(q => (
            <button key={q.label} onClick={q.action || undefined} style={{
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '20px',
              cursor: q.action ? 'pointer' : 'default',
              textAlign: 'left', fontFamily: 'var(--font-body)',
              transition: 'var(--transition)',
              opacity: q.action ? 1 : 0.55,
            }}
              onMouseEnter={e => { if (q.action) e.currentTarget.style.borderColor = 'var(--green-light)'; }}
              onMouseLeave={e => { if (q.action) e.currentTarget.style.borderColor = 'var(--cream-dark)'; }}
            >
              <div style={{ fontSize: 26, marginBottom: 10 }}>{q.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{q.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>{q.sub}</div>
              {!q.action && <div style={{ fontSize: 10, color: 'var(--amber)', marginTop: 6 }}>Coming soon</div>}
            </button>
          ))}
        </div>

        {/* NYC Alumni */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
          NYC alumni
        </h2>
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { initials: 'DW', name: 'DeShawn W.', borough: 'Bronx', label: 'Mentor', color: '#1a3d2b' },
            { initials: 'MC', name: 'Maria C.', borough: 'Brooklyn', label: 'Peer Support', color: '#2d6a4f' },
            { initials: 'RM', name: 'Ramon M.', borough: 'Queens', label: 'Mentor', color: '#52b788' },
          ].map(a => (
            <div key={a.initials} style={{
              flex: 1, background: 'var(--white)',
              border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: a.color, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 500, fontSize: 16,
              }}>{a.initials}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{a.borough}</div>
              </div>
              <span style={{ fontSize: 11, padding: '3px 10px', background: 'var(--green-pale)', color: 'var(--green-mid)', borderRadius: 20 }}>{a.label}</span>
              <button style={{
                fontSize: 12, padding: '6px 14px', marginTop: 4,
                background: 'var(--cream)', border: '1px solid var(--cream-dark)',
                borderRadius: 20, cursor: 'default', color: 'var(--ink-muted)',
                fontFamily: 'var(--font-body)',
              }}>Connect (soon)</button>
            </div>
          ))}
        </div>

      </main>

      <Chatbot />
    </div>
  );
}

const navBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--ink-soft)', fontSize: 14, fontFamily: 'var(--font-body)',
  padding: '6px 12px', borderRadius: 8,
};
