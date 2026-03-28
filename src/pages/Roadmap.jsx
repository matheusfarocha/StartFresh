import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Chatbot from '../components/Chatbot';

// Design tokens from the new UI
const C = {
  primary:                '#9d4f00',
  primaryContainer:       '#fc943f',
  onPrimaryContainer:     '#4c2300',
  secondary:              '#007169',
  secondaryContainer:     '#7ef6ea',
  onSecondaryContainer:   '#005c56',
  tertiaryFixed:          '#fdc003',
  onTertiaryFixed:        '#3d2b00',
  surface:                '#fffbff',
  surfaceContainer:       '#f7f3ec',
  surfaceContainerHigh:   '#f1ede6',
  surfaceContainerHighest:'#ebe8e0',
  outline:                '#82807b',
  outlineVariant:         '#bcb9b3',
  onSurface:              '#393834',
  onSurfaceVariant:       '#666460',
};

const FONT = "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

// Alternating left/right offsets for the winding path (px)
const PATH_OFFSETS = [-100, 100, -80, 90, -90, 80, -100, 100];

export default function Roadmap() {
  const navigate = useNavigate();
  const { roadmap, profile, completedSteps, toggleStep } = useApp();
  const [expandedStep, setExpandedStep] = useState(null);

  if (!roadmap) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: FONT }}>
        <p style={{ color: C.onSurfaceVariant }}>No roadmap yet.</p>
        <button onClick={() => navigate('/onboard')} style={primaryBtn}>
          Start onboarding
        </button>
      </div>
    );
  }

  // Flatten all steps from all sections into one linear list
  const allSteps = roadmap.sections.flatMap(section =>
    section.steps.map(step => ({ ...step, sectionLabel: section.label, sectionIcon: section.icon }))
  );

  const totalSteps = allSteps.length;
  const doneCount = Object.values(completedSteps).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;
  const currentIdx = allSteps.findIndex(s => !completedSteps[s.id]);
  const currentStep = currentIdx >= 0 ? allSteps[currentIdx] : null;
  const allDone = doneCount === totalSteps && totalSteps > 0;

  function stepStatus(i) {
    if (completedSteps[allSteps[i].id]) return 'completed';
    if (i === currentIdx) return 'current';
    if (i === currentIdx + 1) return 'upcoming';
    return 'locked';
  }

  return (
    <div style={{ background: C.surface, minHeight: '100vh', fontFamily: FONT }}>

      {/* ── Top nav ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: C.surface, borderBottom: `4px solid ${C.outlineVariant}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: C.primary, letterSpacing: '-0.5px' }}>FreshStart</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {profile.roadmapMode === 'mentor' && (
            <span style={{ fontSize: 11, padding: '3px 10px', background: C.tertiaryFixed, color: C.onTertiaryFixed, borderRadius: 999, fontWeight: 700 }}>
              🤝 Mentor mode
            </span>
          )}
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.onSurfaceVariant, fontSize: 13, fontFamily: FONT }}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ paddingTop: 88, paddingBottom: 140, maxWidth: 480, margin: '0 auto', padding: '88px 28px 140px' }}>

        {/* Progress section */}
        <section style={{ marginBottom: 40, textAlign: 'center' }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, color: C.onSurface, marginBottom: 4, letterSpacing: '-1px', lineHeight: 1.1 }}>
            My Journey
          </h1>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.onSurfaceVariant }}>
            {allDone
              ? `All ${totalSteps} steps complete!`
              : `Step ${currentIdx + 1} of ${totalSteps} · ${currentStep?.sectionLabel}`}
          </p>
          <div style={{ marginTop: 18, height: 14, background: C.surfaceContainerHighest, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct}%`, background: C.secondary,
              borderRadius: 999, transition: 'width 0.5s ease',
              backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
            }} />
          </div>
          <p style={{ fontSize: 12, color: C.onSurfaceVariant, marginTop: 6 }}>{doneCount}/{totalSteps} steps done</p>
        </section>

        {/* ── Winding path ── */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>

          {/* SVG background path */}
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.18 }}>
            <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 200 1000" fill="none" preserveAspectRatio="none">
              <path
                d="M100,0 C160,120 40,240 100,360 C160,480 40,600 100,720 C160,840 40,960 100,1080"
                stroke={C.outlineVariant} strokeWidth="14" strokeDasharray="14" fill="none"
              />
            </svg>
          </div>

          {allSteps.map((step, i) => {
            const status = stepStatus(i);
            const offset = PATH_OFFSETS[i % PATH_OFFSETS.length];
            // Show mascot encouragement right before the current step (after first completed)
            const showMascot = i === currentIdx && doneCount > 0;

            return (
              <React.Fragment key={step.id}>
                {showMascot && (
                  <div style={{
                    position: 'relative', zIndex: 1,
                    width: '100%', marginBottom: 20,
                    display: 'flex',
                    justifyContent: offset > 0 ? 'flex-start' : 'flex-end',
                    paddingLeft: offset > 0 ? 12 : 0,
                    paddingRight: offset > 0 ? 0 : 12,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: 'white', padding: '12px 14px', borderRadius: 14,
                      boxShadow: `0 4px 0 0 ${C.outlineVariant}`, maxWidth: 220,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: C.tertiaryFixed, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      }}>🌱</div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: C.onSurface, lineHeight: 1.5 }}>
                        You've got this! One step at a time.
                      </p>
                    </div>
                  </div>
                )}

                <div style={{
                  position: 'relative', zIndex: 1,
                  marginLeft: offset,
                  marginBottom: status === 'current' ? 72 : 56,
                }}>
                  <StepNode
                    step={step}
                    status={status}
                    isExpanded={expandedStep === step.id}
                    onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    onComplete={() => { toggleStep(step.id); setExpandedStep(null); }}
                  />
                </div>
              </React.Fragment>
            );
          })}

          {/* All done celebration */}
          {allDone && (
            <div style={{
              position: 'relative', zIndex: 1,
              textAlign: 'center', padding: '32px 28px',
              background: C.secondaryContainer, borderRadius: 24,
              marginTop: 16,
            }}>
              <div style={{ fontSize: 52, marginBottom: 10 }}>🎉</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: C.onSecondaryContainer, marginBottom: 6 }}>You did it.</h3>
              <p style={{ fontSize: 14, color: C.onSecondaryContainer, lineHeight: 1.6 }}>
                Every step completed. This is what a fresh start looks like.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ── Fixed bottom action button ── */}
      {currentStep && (
        <div style={{
          position: 'fixed', bottom: 72, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, padding: '0 24px', zIndex: 40,
        }}>
          <button
            onClick={() => setExpandedStep(currentStep.id)}
            style={{
              width: '100%', padding: '18px 24px',
              background: C.primaryContainer, color: C.onPrimaryContainer,
              fontWeight: 900, fontSize: 18, borderRadius: 14,
              border: 'none', cursor: 'pointer',
              boxShadow: `0 6px 0 0 ${C.primary}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontFamily: FONT,
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = `0 2px 0 0 ${C.primary}`; }}
            onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 6px 0 0 ${C.primary}`; }}
          >
            <span>Continue Step {currentIdx + 1}</span>
            <span style={{ fontSize: 20 }}>→</span>
          </button>
        </div>
      )}

      {/* ── Bottom nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: C.surface, borderTop: `4px solid ${C.outlineVariant}`,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '10px 16px',
      }}>
        {[
          { icon: '🗺️', label: 'Journey', active: true },
          { icon: '📚', label: 'Resources', active: false },
          { icon: '💬', label: 'Support', active: false },
          { icon: '👤', label: 'Profile', active: false },
        ].map(tab => (
          <div key={tab.label} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 18px', borderRadius: 16,
            background: tab.active ? C.primaryContainer : 'transparent',
            color: tab.active ? C.onPrimaryContainer : C.onSurfaceVariant,
            boxShadow: tab.active ? `0 4px 0 0 ${C.primary}` : 'none',
            cursor: 'pointer', userSelect: 'none',
            fontFamily: FONT,
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>
              {tab.label}
            </span>
          </div>
        ))}
      </nav>

      <Chatbot />
    </div>
  );
}

// ── Individual step node on the path ──
function StepNode({ step, status, isExpanded, onToggle, onComplete }) {
  const isCompleted = status === 'completed';
  const isCurrent   = status === 'current';
  const isUpcoming  = status === 'upcoming';
  const isLocked    = status === 'locked';

  const size = isCurrent ? 128 : 96;
  const bg   = isCompleted ? C.secondaryContainer
             : isCurrent   ? C.primaryContainer
             : C.surfaceContainerHighest;

  const shadow = isCompleted ? `0 6px 0 0 ${C.secondary}`
               : isCurrent   ? `0 8px 0 0 ${C.primary}, 0 0 24px rgba(242,140,56,0.35)`
               : `0 6px 0 0 ${C.outlineVariant}`;

  const labelColor = isCurrent   ? C.primary
                   : isCompleted ? C.onSurfaceVariant
                   : C.outline;

  return (
    <div>
      {/* Card + label */}
      <div
        onClick={isLocked ? undefined : onToggle}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: isLocked ? 'default' : 'pointer' }}
      >
        <div style={{
          position: 'relative',
          width: size, height: size,
          background: bg,
          borderRadius: 18,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: shadow,
          border: '4px solid white',
          opacity: isLocked ? 0.4 : isUpcoming ? 0.65 : 1,
          transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: isCurrent ? 48 : 36, lineHeight: 1 }}>{step.sectionIcon}</span>
          {isCurrent && (
            <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.onPrimaryContainer, marginTop: 4 }}>
              Current
            </span>
          )}

          {/* Completed badge */}
          {isCompleted && (
            <div style={{
              position: 'absolute', top: -8, right: -8,
              width: 30, height: 30, borderRadius: '50%',
              background: C.secondary, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, border: '3px solid white',
            }}>✓</div>
          )}

          {/* Lock badge */}
          {isLocked && (
            <div style={{
              position: 'absolute', top: -8, right: -8,
              width: 30, height: 30, borderRadius: '50%',
              background: C.outline, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, border: '3px solid white',
            }}>🔒</div>
          )}
        </div>

        {/* Label */}
        <div style={{ marginTop: 14, textAlign: 'center', maxWidth: 180 }}>
          <p style={{ fontSize: isCurrent ? 15 : 12, fontWeight: isCurrent ? 900 : 700, color: labelColor, lineHeight: 1.35, fontFamily: FONT }}>
            {step.text}
          </p>
          {isCurrent && (
            <span style={{
              display: 'inline-block', marginTop: 8,
              padding: '4px 14px', background: C.tertiaryFixed, color: C.onTertiaryFixed,
              borderRadius: 999, fontSize: 9, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: '0.15em',
            }}>Start Task</span>
          )}
        </div>
      </div>

      {/* Expanded detail drawer */}
      {isExpanded && !isLocked && (
        <div style={{
          marginTop: 16,
          background: 'white', borderRadius: 18,
          padding: '18px 20px',
          boxShadow: `0 4px 0 0 ${C.outlineVariant}`,
          width: 260,
          fontFamily: FONT,
        }}>
          <p style={{ fontSize: 13, color: C.onSurfaceVariant, lineHeight: 1.65, marginBottom: 10 }}>
            {step.detail}
          </p>
          <p style={{ fontSize: 12, color: C.secondary, marginBottom: 16 }}>⏱ {step.time}</p>
          <button
            onClick={e => { e.stopPropagation(); onComplete(); }}
            style={{
              width: '100%', padding: '12px',
              background: isCompleted ? C.surfaceContainerHighest : C.secondaryContainer,
              color: isCompleted ? C.onSurfaceVariant : C.onSecondaryContainer,
              border: 'none', borderRadius: 12,
              fontWeight: 800, fontSize: 14,
              cursor: 'pointer', fontFamily: FONT,
            }}
          >
            {isCompleted ? 'Undo ↩' : 'Mark as complete ✓'}
          </button>
        </div>
      )}
    </div>
  );
}

const primaryBtn = {
  padding: '14px 28px',
  background: C.primaryContainer, color: C.onPrimaryContainer,
  border: 'none', borderRadius: 14,
  fontWeight: 800, fontSize: 16, cursor: 'pointer',
  fontFamily: FONT,
  boxShadow: `0 6px 0 0 ${C.primary}`,
};
