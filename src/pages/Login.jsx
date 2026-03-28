import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setUser({ name: name.trim() || 'Friend' });
    navigate('/learn');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)' }}>
      {/* Left panel */}
      <div style={{
        flex: '0 0 45%',
        background: 'var(--green-deep)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: '50%', background: 'rgba(82,183,136,0.12)' }} />
        <div style={{ position: 'absolute', top: 80, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(82,183,136,0.08)' }} />

        <div style={{ position: 'absolute', top: 40, left: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🌱</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 400 }}>FreshStart</span>
        </div>

        <div className="page-enter">
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-light)', marginBottom: 16 }}>
            A new chapter
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
            Take a deep breath.{' '}
            <em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>Your fresh start begins right here.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            We believe in the dignity of this journey. Step into a space designed to support your growth — one real, concrete action at a time.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px', background: 'var(--cream)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }} className="page-enter">
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>
              Welcome
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              Enter your first name to get started. That's all we need.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
                Your first name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What should we call you?"
                style={inputStyle}
              />
              <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 6 }}>
                No account needed. Your data stays on this device.
              </p>
            </div>

            <Button type="submit" full style={{ fontSize: 16, padding: '16px 28px', marginBottom: 16 }}>
              Start My Journey →
            </Button>
          </form>

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            A caseworker or family member can help you use this app too.
          </p>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '13px 16px',
  border: '1.5px solid var(--cream-dark)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 15,
  background: 'var(--white)', color: 'var(--ink)',
  outline: 'none',
};
