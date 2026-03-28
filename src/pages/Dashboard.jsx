import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Mascot from '../components/Mascot';
import Chatbot from '../components/Chatbot';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, roadmap, completedSteps } = useApp();

  const totalSteps = roadmap?.sections?.reduce((acc, s) => acc + s.steps.length, 0) || 0;
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

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
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', background: 'var(--white)',
        borderBottom: '1px solid var(--cream-dark)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>FreshStart</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/roadmap')} style={navBtnStyle}>My Roadmap</button>
          <button onClick={() => navigate('/')} style={navBtnStyle}>Sign out</button>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }} className="page-enter">
        <Mascot
          message={`Welcome back, ${user?.name || 'friend'}! ${pct > 0 ? `You're ${pct}% through your roadmap — keep going!` : "Let's get your roadmap started."}`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 32 }}>
          {/* Progress */}
          <div style={{
            background: 'var(--green-deep)', borderRadius: 'var(--radius-lg)',
            padding: '28px 24px', color: 'white', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 300, lineHeight: 1 }}>{pct}%</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>{doneCount}/{totalSteps} steps done</div>
          </div>

          {/* Next step */}
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--cream-dark)', padding: '24px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            {nextStep ? (
              <>
                <div>
                  <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-mid)', marginBottom: 8 }}>
                    Your next step · {nextStep.sectionLabel}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.35 }}>{nextStep.text}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>⏱ {nextStep.time}</div>
                </div>
                <Button variant="ghost" onClick={() => navigate('/roadmap')} style={{ alignSelf: 'flex-start', marginTop: 16, padding: '8px 0' }}>
                  See full roadmap →
                </Button>
              </>
            ) : totalSteps === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, textAlign: 'center' }}>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>No roadmap yet — let's build yours.</p>
                <Button size="sm" onClick={() => navigate('/onboard')}>Start onboarding →</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <p style={{ color: 'var(--green-mid)', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>All steps complete!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick access */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
          Quick access
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '🗺️', label: 'My Roadmap',     sub: 'View all steps',          action: () => navigate('/roadmap') },
            { icon: '💬', label: 'Support Chat',    sub: 'Ask a question',          action: null, note: 'Use the chat button ↘' },
            { icon: '📞', label: 'Call 311',        sub: 'NYC services 24/7',       action: null, note: 'Dial 311 from any phone' },
          ].map(q => (
            <button key={q.label} onClick={q.action || undefined} style={{
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '20px',
              cursor: q.action ? 'pointer' : 'default',
              textAlign: 'left', fontFamily: 'var(--font-body)',
              transition: 'var(--transition)',
            }}
              onMouseEnter={e => { if (q.action) e.currentTarget.style.borderColor = 'var(--green-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cream-dark)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{q.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{q.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 3 }}>{q.note || q.sub}</div>
            </button>
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
