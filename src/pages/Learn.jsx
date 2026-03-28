import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import Chatbot from '../components/Chatbot';

const STORIES = [
  { initials: 'D.W.', borough: 'Bronx', quote: 'I got my ID on day 3. That one step opened every door.' },
  { initials: 'M.C.', borough: 'Brooklyn', quote: 'I was scared I\'d have to figure this all out alone. I didn\'t.' },
  { initials: 'R.M.', borough: 'Queens', quote: 'The housing step took 2 weeks. But I followed the plan and it worked.' },
];

export default function Learn() {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', padding: '18px 40px',
        background: 'var(--white)', borderBottom: '1px solid var(--cream-dark)', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🌱</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--ink)', fontWeight: 400 }}>FreshStart</span>
      </nav>

      <main style={{ flex: 1, maxWidth: 640, margin: '0 auto', padding: '60px 32px', width: '100%' }} className="page-enter">

        {/* "You're not alone" hero section */}
        <div style={{
          background: 'var(--green-deep)', borderRadius: 'var(--radius-xl)',
          padding: '36px 32px', marginBottom: 36, color: 'white',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-light)', marginBottom: 12 }}>
            You are not alone
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, lineHeight: 1.25, marginBottom: 16 }}>
            {user?.name ? `${user.name}, every` : 'Every'} year, over{' '}
            <em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>25,000 people</em>{' '}
            return to NYC just like you.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Most of them started exactly where you are right now — uncertain, maybe overwhelmed. Many found their footing. You can too.
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}>
          {[
            { num: '25K+', label: 'Return to NYC each year' },
            { num: 'Free', label: 'NYC programs for you' },
            { num: '1st', label: 'Step: get your ID' },
          ].map(s => (
            <div key={s.num} style={{
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '18px 14px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--green-mid)', marginBottom: 4 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* What this app does */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
            Here's what we'll do together
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '❓', text: 'Ask you 4 quick questions (less than 2 minutes)' },
              { icon: '🗺️', text: 'Build your personal step-by-step plan for NYC' },
              { icon: '✅', text: 'Let you check off steps as you complete them' },
              { icon: '💬', text: 'Answer your questions anytime via the support chat' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'var(--white)', border: '1px solid var(--cream-dark)',
                borderRadius: 'var(--radius-md)', padding: '14px 18px',
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stories */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--ink)', marginBottom: 16 }}>
          From people who've been here
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {STORIES.map(s => (
            <div key={s.initials} style={{
              background: 'var(--white)', border: '1px solid var(--cream-dark)',
              borderRadius: 'var(--radius-md)', padding: '18px 20px',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', background: 'var(--green-deep)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>{s.initials}</div>
              <div>
                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, marginBottom: 4, fontStyle: 'italic' }}>
                  "{s.quote}"
                </p>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{s.borough}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat callout */}
        <div style={{
          background: 'var(--green-pale)', border: '1.5px solid var(--green-light)',
          borderRadius: 'var(--radius-lg)', padding: '18px 22px', marginBottom: 32,
          display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <span style={{ fontSize: 28 }}>💬</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green-deep)', marginBottom: 4 }}>Support chat is available right now</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
              Have a question before you start? Tap the chat button in the corner — it can answer things like "How do I get my ID?" or "Find housing."
            </div>
          </div>
        </div>

        <Button full onClick={() => navigate('/onboard')} style={{ fontSize: 17, padding: '18px 28px' }}>
          Let's build my plan →
        </Button>

        <p style={{ fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', marginTop: 16 }}>
          Privacy: Your information stays on this device. We don't share or sell anything.
        </p>
      </main>

      <Chatbot />
    </div>
  );
}
