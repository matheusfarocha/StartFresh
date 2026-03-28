import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateRoadmap } from '../data/roadmapEngine';
import { QUESTION_BANK, FIRST_QUESTION, getNextQuestion } from '../data/questions';
import Button from '../components/Button';
import Mascot from '../components/Mascot';

// Rough max path length for progress estimation
const ESTIMATED_TOTAL = 8;

export default function Onboarding() {
  const navigate = useNavigate();
  const { setProfile, setRoadmap } = useApp();

  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]); // stack of visited question IDs
  const [currentId, setCurrentId] = useState(FIRST_QUESTION);

  const question = QUESTION_BANK[currentId];
  const currentAnswer = answers[currentId];

  const canNext =
    question.type === 'multi'
      ? (currentAnswer || []).length > 0
      : !!currentAnswer;

  const progress = Math.min(((history.length + 1) / ESTIMATED_TOTAL) * 100, 95);
  const stepLabel = `Step ${history.length + 1}`;

  function handleSingleSelect(value) {
    setAnswers(prev => ({ ...prev, [currentId]: value }));
  }

  function handleMultiToggle(value) {
    setAnswers(prev => {
      const existing = prev[currentId] || [];
      const next = existing.includes(value)
        ? existing.filter(v => v !== value)
        : [...existing, value];
      return { ...prev, [currentId]: next };
    });
  }

  function handleNext() {
    const answer = currentAnswer;
    const nextId = getNextQuestion(currentId, answer);

    if (nextId === null) {
      const profile = {
        ...answers,
        borough: answers.borough,
        timeAway: answers.timeAway,
        needs: answers.needs || [],
      };
      setProfile(profile);
      setRoadmap(generateRoadmap(profile));
      navigate('/roadmap');
      return;
    }

    setHistory(prev => [...prev, currentId]);
    setCurrentId(nextId);
  }

  function handleBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCurrentId(prev);
  }

  const isLastQuestion = getNextQuestion(currentId, currentAnswer) === null;

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
        <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{stepLabel}</span>
      </nav>

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '48px 32px', width: '100%' }} className="page-enter">
        <Mascot message={question.sub} />

        <h2 style={headingStyle}>{question.question}</h2>

        {question.type === 'single' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {question.options.map(opt => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={currentAnswer === opt.value}
                onClick={() => handleSingleSelect(opt.value)}
              />
            ))}
          </div>
        )}

        {question.type === 'multi' && (
          <>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 24 }}>
              {question.sub}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {question.options.map(opt => (
                <NeedCard
                  key={opt.value}
                  icon={opt.icon}
                  label={opt.label}
                  sub={opt.sub}
                  selected={(currentAnswer || []).includes(opt.value)}
                  onClick={() => handleMultiToggle(opt.value)}
                />
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 14 }}>
              ID &amp; Documents will always be included — it's needed for everything else.
            </p>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
          {history.length > 0 && (
            <Button variant="secondary" onClick={handleBack}>
              ← Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={!canNext} style={{ flex: 1 }}>
            {isLastQuestion && canNext ? 'Build my roadmap →' : 'Next →'}
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

function OptionCard({ label, sub, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '18px 22px',
      background: selected ? 'var(--green-deep)' : 'var(--white)',
      border: `2px solid ${selected ? 'var(--green-deep)' : 'var(--cream-dark)'}`,
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer', textAlign: 'left',
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
