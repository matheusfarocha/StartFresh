import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

const FACTS = [
  { icon: '🏙️', text: 'Over 25,000 people return to NYC from incarceration each year. You are not alone.' },
  { icon: '📋', text: 'Getting your ID is the first step to almost everything — housing, jobs, benefits.' },
  { icon: '🤝', text: 'NYC has free programs specifically for people in your situation. We\'ll connect you.' },
];

export default function Learn() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '18px 40px',
        background: 'var(--white)', borderBottom: '1px solid var(--cream-dark)',
        gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🌱</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>FreshStart</span>
      </nav>

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '60px 32px', width: '100%' }} className="page-enter">
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-mid)', marginBottom: 12 }}>
          You've got this
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, color: 'var(--ink)', lineHeight: 1.25, marginBottom: 16 }}>
          {user?.name ? `Hi ${user.name},` : 'Hi,'} many people have been right where you are.
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
          Returning to NYC can feel overwhelming. We're going to break it down into simple steps — one at a time, no jargon, no judgment.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
          {FACTS.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '18px 20px',
            }}>
              <span style={{ fontSize: 28, lineHeight: 1 }}>{f.icon}</span>
              <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>{f.text}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--green-pale)', border: '1.5px solid var(--green-light)',
          borderRadius: 'var(--radius-lg)', padding: '20px 24px', marginBottom: 40,
        }}>
          <p style={{ fontSize: 14, color: 'var(--green-deep)', lineHeight: 1.65 }}>
            <strong>Privacy:</strong> Your information stays on your device. We don't share or sell anything.
          </p>
        </div>

        <Button full onClick={() => navigate('/onboard')} style={{ fontSize: 17, padding: '18px 28px' }}>
          Let's build my plan →
        </Button>
      </main>
    </div>
  );
}
