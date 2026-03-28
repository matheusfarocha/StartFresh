import React, { useState, useRef, useEffect } from 'react';

const RESPONSES = [
  {
    keywords: ['id', 'identification', 'license', 'driver'],
    answer: "To get a NYC ID, first get your birth certificate at NYC Vital Records (125 Worth St, Manhattan — free within 30 days of release). Then visit any DMV with your birth certificate and release papers. No appointment needed on Tue & Thu mornings at many locations.",
  },
  {
    keywords: ['housing', 'shelter', 'home', 'place to stay', 'where to sleep'],
    answer: "For emergency housing, call 311 and say 'I need emergency shelter' — available 24/7. For transitional housing, contact CAMBA at (718) 940-6800 (walk-in Mon–Fri 9am–4pm). After getting your ID, you can apply for a CityFHEPS rental voucher at your nearest HRA office.",
  },
  {
    keywords: ['job', 'work', 'employment', 'hire', 'career'],
    answer: "STRIVE offers free job training and placement and accepts people with records — call (212) 360-1100. NYC's Fair Chance Act means employers cannot ask about your record until after a job offer. Visit any Workforce1 Career Center (30+ locations, call 311) for free placement help.",
  },
  {
    keywords: ['food', 'eat', 'snap', 'food stamp', 'pantry', 'hungry'],
    answer: "Apply for SNAP (food stamps) at access.nyc.gov or by calling 311 — you may qualify immediately. To find a food pantry near you today, text your zip code to 898-211.",
  },
  {
    keywords: ['mental health', 'counseling', 'therapy', 'stress', 'anxiety', 'depression', 'mental'],
    answer: "Free walk-in counseling is available at Bronx Community Solutions (215 E 161st St) with no insurance needed. Hour Children runs judgment-free peer support groups led by formerly incarcerated people — call (718) 358-1601. Save 988 in your phone for the 24/7 crisis line.",
  },
  {
    keywords: ['social security', 'ssn', 'social security card'],
    answer: "After getting your state ID, visit your nearest SSA (Social Security Administration) office with your ID and birth certificate. Your card will arrive by mail in 2–4 weeks.",
  },
  {
    keywords: ['birth certificate', 'vital records'],
    answer: "Get your birth certificate at NYC Vital Records, 125 Worth St, Manhattan. If you were released in the last 30 days, it's free — bring your release paperwork.",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    answer: "Hi! I'm here to help. You can ask me about: getting your ID, finding housing, job help, food assistance, mental health support, or any step on your roadmap. What do you need?",
  },
];

function getResponse(input) {
  const text = input.toLowerCase();
  for (const r of RESPONSES) {
    if (r.keywords.some(k => text.includes(k))) return r.answer;
  }
  return "I'm not sure about that one. Try asking about: ID documents, housing, jobs, food, or mental health. You can also call 311 — they connect you to NYC services 24/7.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm here to help. Ask me anything — like 'How do I get my ID?' or 'Find housing'." },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { from: 'user', text };
    const botMsg  = { from: 'bot', text: getResponse(text) };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 200,
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--green-deep)',
          color: 'white', fontSize: 24,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
        title="Support Chat"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 200,
          width: 320, maxHeight: 460,
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--cream-dark)',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--green-deep)', color: 'white',
            padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🌱</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Support</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Ask me anything</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 10,
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 13px',
                  borderRadius: m.from === 'user'
                    ? '14px 14px 4px 14px'
                    : '14px 14px 14px 4px',
                  background: m.from === 'user' ? 'var(--green-deep)' : 'var(--cream)',
                  color: m.from === 'user' ? 'white' : 'var(--ink)',
                  fontSize: 13,
                  lineHeight: 1.55,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          <div style={{ padding: '4px 14px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Where do I get ID?', 'Find housing', 'Job help'].map(q => (
              <button key={q}
                onClick={() => { setInput(q); }}
                style={{
                  fontSize: 11, padding: '4px 10px',
                  border: '1px solid var(--cream-dark)',
                  borderRadius: 20, background: 'var(--cream)',
                  cursor: 'pointer', color: 'var(--ink-soft)',
                  fontFamily: 'var(--font-body)',
                }}
              >{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            borderTop: '1px solid var(--cream-dark)',
            display: 'flex', gap: 8, padding: '10px 12px',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type your question..."
              style={{
                flex: 1, padding: '9px 12px',
                border: '1.5px solid var(--cream-dark)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 13, outline: 'none',
                background: 'var(--cream)',
              }}
            />
            <button onClick={send} style={{
              padding: '9px 14px',
              background: 'var(--green-deep)', color: 'white',
              border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: 14,
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
