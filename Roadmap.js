import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Chatbot from '../components/Chatbot';

export default function Roadmap() {
  const navigate = useNavigate();
  const { roadmap, profile, completedSteps, toggleStep } = useApp();
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  if (!roadmap) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: 'var(--ink-soft)' }}>No roadmap yet.</p>
        <Button onClick={() => navigate('/onboard')}>Start onboarding</Button>
      </div>
    );
  }

  const totalSteps = roadmap.sections.reduce((acc, s) => acc + s.steps.length, 0);
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const pct = Math.round((doneCount / totalSteps) * 100);

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
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🌱</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>Revia</span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <button onClick={() => navigate('/dashboard')} style={navLinkStyle}>Dashboard</button>
          <button onClick={() => navigate('/')} style={navLinkStyle}>Sign out</button>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }} className="page-enter">

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-mid)', marginBottom: 10 }}>
            Your personalized roadmap
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 12 }}>
            {profile.borough} · {profile.timeAway} away
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: 500 }}>
            We've built your step-by-step plan based on what you told us. ID & Documents comes first — everything else depends on it.
          </p>
        </div>

        {/* Progress card */}
        <div style={{
          background: 'var(--green-deep)', borderRadius: 'var(--radius-lg)',
          padding: '24px 28px', marginBottom: 36, color: 'white',
          display: 'flex', alignItems: 'center', gap: 24,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>Your progress</div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: 'var(--green-light)',
                width: `${pct}%`, borderRadius: 4, transition: 'width 0.5s ease',
              }} />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
              {doneCount} of {totalSteps} steps completed
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300 }}>{pct}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>complete</div>
          </div>
        </div>

        {/* Sections */}
        {roadmap.sections.map((section, si) => {
          const isOpen = expandedSection === section.key;
          const sectionDone = section.steps.filter(s => completedSteps[s.id]).length;

          return (
            <div key={section.key} style={{ marginBottom: 14 }}>
              {/* Section header */}
              <button
                onClick={() => setExpandedSection(isOpen ? null : section.key)}
                style={{
                  width: '100%', background: 'var(--white)',
                  border: `1.5px solid ${isOpen ? 'var(--green-light)' : 'var(--cream-dark)'}`,
                  borderRadius: isOpen ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)',
                  padding: '18px 22px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: si === 0 ? 'var(--green-deep)' : 'var(--cream)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>
                  {section.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                    {section.label}
                    {section.isAuto && (
                      <span style={{
                        marginLeft: 8, fontSize: 10, padding: '2px 8px',
                        background: 'var(--amber-pale)', color: 'var(--amber)',
                        borderRadius: 20,
                      }}>Added for you</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                    {sectionDone}/{section.steps.length} steps done
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {si === 0 && <span style={{ fontSize: 10, padding: '4px 10px', background: '#fff3cd', color: '#856404', borderRadius: 20, fontWeight: 500 }}>Start here</span>}
                  <span style={{ color: 'var(--ink-muted)', fontSize: 18, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }}>›</span>
                </div>
              </button>

              {/* Steps */}
              {isOpen && (
                <div style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--green-light)',
                  borderTop: 'none',
                  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                  overflow: 'hidden',
                }}>
                  {section.steps.map((step, idx) => {
                    const done = !!completedSteps[step.id];
                    const isStepOpen = expandedStep === step.id;

                    return (
                      <div key={step.id} style={{ borderTop: idx > 0 ? '1px solid var(--cream-dark)' : 'none' }}>
                        <div style={{
                          padding: '16px 22px',
                          display: 'flex', alignItems: 'flex-start', gap: 14,
                          background: done ? 'rgba(216,243,220,0.25)' : 'transparent',
                        }}>
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleStep(step.id)}
                            style={{
                              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                              border: `2px solid ${done ? 'var(--green-mid)' : 'var(--cream-dark)'}`,
                              background: done ? 'var(--green-mid)' : 'transparent',
                              cursor: 'pointer', marginTop: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: 12, transition: 'var(--transition)',
                            }}
                          >
                            {done ? '✓' : ''}
                          </button>

                          <div style={{ flex: 1 }}>
                            <div
                              style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ink-muted)' : 'var(--ink)', textDecoration: done ? 'line-through' : 'none', cursor: 'pointer', marginBottom: 2 }}
                              onClick={() => setExpandedStep(isStepOpen ? null : step.id)}
                            >
                              {step.text}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--green-mid)' }}>⏱ {step.time}</div>

                            {isStepOpen && (
                              <div style={{
                                marginTop: 10, padding: '12px 14px',
                                background: 'var(--cream)', borderRadius: 'var(--radius-sm)',
                                fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.65,
                              }}>
                                {step.detail}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setExpandedStep(isStepOpen ? null : step.id)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--ink-muted)', fontSize: 16,
                              transform: isStepOpen ? 'rotate(90deg)' : 'rotate(0)',
                              transition: '0.2s',
                            }}
                          >›</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Completion celebration */}
        {doneCount === totalSteps && totalSteps > 0 && (
          <div style={{
            marginTop: 32, background: 'var(--green-pale)',
            border: '2px solid var(--green-mid)',
            borderRadius: 'var(--radius-xl)', padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--green-deep)', marginBottom: 8 }}>
              You did it.
            </h3>
            <p style={{ color: 'var(--green-mid)', fontSize: 15 }}>Every step completed. This is what a fresh start looks like.</p>
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
  transition: 'color 0.2s',
};
