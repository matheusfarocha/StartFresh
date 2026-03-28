import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Chatbot from '../components/Chatbot';

export default function Roadmap() {
  const navigate = useNavigate();
  const { roadmap, profile, completedSteps, toggleStep } = useApp();
  const [expandedSection, setExpandedSection] = useState(null);
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [showFirstAction, setShowFirstAction] = useState(false);

  if (!roadmap) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p style={{ color: 'var(--ink-soft)' }}>No roadmap yet.</p>
        <Button onClick={() => navigate('/onboard')}>Start onboarding</Button>
      </div>
    );
  }

  const totalSteps = roadmap.sections.reduce((acc, s) => acc + s.steps.length, 0);
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;
  const allDone = doneCount === totalSteps && totalSteps > 0;

  // Find first incomplete step
  let firstAction = null;
  if (roadmap) {
    outer: for (const section of roadmap.sections) {
      for (const step of section.steps) {
        if (!completedSteps[step.id]) {
          firstAction = { ...step, sectionLabel: section.label, sectionIcon: section.icon };
          break outer;
        }
      }
    }
  }

  // Congrats + First Action overlay
  if (allDone && showFirstAction) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }} className="page-enter">
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--green-deep)', marginBottom: 12, lineHeight: 1.2 }}>
            You did it.
          </h1>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 40 }}>
            Every step completed. This is what a fresh start looks like. Take a breath — you've earned it.
          </p>
          <div style={{
            background: 'var(--white)', border: '2px solid var(--green-light)',
            borderRadius: 'var(--radius-xl)', padding: '28px', marginBottom: 28,
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--green-mid)', marginBottom: 10 }}>
              Your first action in the real world
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>📋</span>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>
                {roadmap.sections[0]?.steps[0]?.text}
              </div>
            </div>
            <div style={{
              fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65,
              background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '12px 14px',
            }}>
              {roadmap.sections[0]?.steps[0]?.detail}
            </div>
            <div style={{ fontSize: 12, color: 'var(--green-mid)', marginTop: 10 }}>
              ⏱ {roadmap.sections[0]?.steps[0]?.time}
            </div>
          </div>
          <Button full onClick={() => { setShowFirstAction(false); }}>
            Back to my roadmap
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', background: 'var(--white)',
        borderBottom: '1px solid var(--cream-dark)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>FreshStart</span>
        </div>
        <button onClick={() => navigate('/')} style={navLinkStyle}>Sign out</button>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px' }} className="page-enter">

        {/* Tutorial card — shown until dismissed */}
        {!tutorialDismissed && (
          <div style={{
            background: 'var(--green-deep)', color: 'white',
            borderRadius: 'var(--radius-xl)', padding: '28px 28px 24px',
            marginBottom: 28, position: 'relative',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-light)', marginBottom: 10 }}>
              Welcome to your roadmap
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, marginBottom: 16, lineHeight: 1.3 }}>
              Here's how FreshStart works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { icon: '☑️', text: 'Tap a category to expand it, then check off steps as you complete them' },
                { icon: '💬', text: 'Use the chat button (bottom right) to ask questions anytime' },
                { icon: '📞', text: 'Call 311 from any phone for NYC services — free, 24/7' },
                { icon: '🔁', text: 'Your progress is saved. Come back anytime to pick up where you left off' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.55 }}>{t.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setTutorialDismissed(true)}
              style={{
                background: 'var(--green-light)', color: 'white',
                border: 'none', borderRadius: 'var(--radius-sm)',
                padding: '10px 20px', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              Got it, show me my plan →
            </button>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-mid)', marginBottom: 8 }}>
            Your personalized roadmap
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300, color: 'var(--ink)', lineHeight: 1.25, marginBottom: 8 }}>
            {profile.borough} · {profile.timeAway} away
          </h1>
          {profile.roadmapMode === 'mentor' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 12, padding: '4px 12px',
              background: 'var(--amber-pale)', color: 'var(--amber)',
              borderRadius: 20, marginBottom: 8,
            }}>
              🤝 Mentor-guided mode
            </div>
          )}
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            ID & Documents comes first — everything else depends on it.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          background: 'var(--green-deep)', borderRadius: 'var(--radius-lg)',
          padding: '22px 26px', marginBottom: 28, color: 'white',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>Your progress</div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--green-light)', width: `${pct}%`, borderRadius: 4, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
              {doneCount} of {totalSteps} steps completed
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300 }}>{pct}%</div>
          </div>
        </div>

        {/* First Action highlight — shown when roadmap is open and tutorial dismissed */}
        {tutorialDismissed && firstAction && doneCount === 0 && (
          <div style={{
            background: 'var(--white)',
            border: '2px solid var(--green-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px', marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-mid)', marginBottom: 8 }}>
              Your first action · {firstAction.sectionLabel}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 22, marginTop: 2 }}>{firstAction.sectionIcon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>{firstAction.text}</div>
                <div style={{ fontSize: 12, color: 'var(--green-mid)' }}>⏱ {firstAction.time}</div>
              </div>
            </div>
          </div>
        )}

        {/* Sections */}
        {roadmap.sections.map((section, si) => {
          const isOpen = expandedSection === section.key;
          const sectionDone = section.steps.filter(s => completedSteps[s.id]).length;

          return (
            <div key={section.key} style={{ marginBottom: 12 }}>
              <button
                onClick={() => setExpandedSection(isOpen ? null : section.key)}
                style={{
                  width: '100%', background: 'var(--white)',
                  border: `1.5px solid ${isOpen ? 'var(--green-light)' : 'var(--cream-dark)'}`,
                  borderRadius: isOpen ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)',
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-body)', transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: si === 0 ? 'var(--green-deep)' : 'var(--cream)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{section.icon}</div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {section.label}
                    {section.isAuto && (
                      <span style={{ fontSize: 10, padding: '2px 8px', background: 'var(--amber-pale)', color: 'var(--amber)', borderRadius: 20 }}>
                        Added for you
                      </span>
                    )}
                    {si === 0 && (
                      <span style={{ fontSize: 10, padding: '2px 8px', background: '#fff3cd', color: '#856404', borderRadius: 20 }}>
                        Start here
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {sectionDone}/{section.steps.length} steps done
                  </div>
                </div>
                <span style={{ color: 'var(--ink-muted)', fontSize: 20, transform: isOpen ? 'rotate(90deg)' : 'rotate(0)', transition: '0.2s' }}>›</span>
              </button>

              {isOpen && (
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--green-light)', borderTop: 'none',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  overflow: 'hidden',
                }}>
                  {section.steps.map((step, idx) => {
                    const done = !!completedSteps[step.id];
                    return (
                      <div key={step.id} style={{
                        borderTop: idx > 0 ? '1px solid var(--cream-dark)' : 'none',
                        padding: '18px 22px',
                        background: done ? 'rgba(216,243,220,0.2)' : 'transparent',
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                      }}>
                        <button
                          onClick={() => toggleStep(step.id)}
                          style={{
                            width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                            border: `2px solid ${done ? 'var(--green-mid)' : 'var(--cream-dark)'}`,
                            background: done ? 'var(--green-mid)' : 'transparent',
                            cursor: 'pointer', marginTop: 2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 12, transition: 'var(--transition)',
                          }}
                        >
                          {done ? '✓' : ''}
                        </button>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            fontSize: 14, fontWeight: 500,
                            color: done ? 'var(--ink-muted)' : 'var(--ink)',
                            textDecoration: done ? 'line-through' : 'none', marginBottom: 4,
                          }}>
                            {step.text}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--green-mid)', marginBottom: 8 }}>⏱ {step.time}</div>
                          <div style={{
                            fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.65,
                            background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '10px 12px',
                          }}>
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* All done celebration */}
        {allDone && (
          <div style={{
            marginTop: 32, background: 'var(--green-pale)',
            border: '2px solid var(--green-mid)',
            borderRadius: 'var(--radius-xl)', padding: '36px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 8 }}>
              You did it.
            </h3>
            <p style={{ color: 'var(--green-mid)', fontSize: 15, marginBottom: 24 }}>
              Every step completed. This is what a fresh start looks like.
            </p>
            <Button onClick={() => setShowFirstAction(true)}>
              View your real-world first action →
            </Button>
          </div>
        )}

      </main>

      <Chatbot />
    </div>
  );
}

const navLinkStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--ink-soft)', fontSize: 14, fontFamily: 'var(--font-body)',
  padding: '6px 12px', borderRadius: 8,
};
