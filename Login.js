import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'create'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setUser({ name: name || 'Friend', phone });
    navigate('/learn');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'var(--font-body)' }}>
      {/* Left panel — hero */}
      <div style={{
        flex: '0 0 45%',
        background: 'var(--green-deep)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: 'rgba(82,183,136,0.12)',
        }} />
        <div style={{
          position: 'absolute', top: 80, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(82,183,136,0.08)',
        }} />

        {/* Logo */}
        <div style={{
          position: 'absolute', top: 40, left: 48,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--green-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🌱</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontWeight: 400 }}>Revia</span>
        </div>

        <div className="page-enter">
          <div style={{
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--green-light)', marginBottom: 16,
          }}>A new chapter</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300,
            color: 'white', lineHeight: 1.18, marginBottom: 20,
          }}>
            Take a deep breath.{' '}
            <em style={{ color: 'var(--green-light)', fontStyle: 'italic' }}>Your fresh start begins right here.</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, lineHeight: 1.65, maxWidth: 320 }}>
            We believe in the dignity of this journey. Step into a space designed to support your growth — one real, concrete action at a time.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px',
        background: 'var(--cream)',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }} className="page-enter">

          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6 }}>
              {mode === 'login'
                ? 'Sign in to resume your progress and access your roadmap.'
                : 'A caseworker or family member can help you set this up.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'create' && (
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
                  Your first name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="What should we call you?"
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(917) 555-0100"
                style={inputStyle}
              />
              <p style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 6 }}>
                No email? No problem — your phone number is all you need.
              </p>
            </div>

            {mode === 'login' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>
                  PIN
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  style={inputStyle}
                />
              </div>
            )}

            <Button type="submit" full style={{ marginBottom: 16, fontSize: 16, padding: '16px 28px' }}>
              {mode === 'login' ? 'Start My Journey →' : 'Create My Account →'}
            </Button>

            <button
              type="button"
              onClick={() => setMode(m => m === 'login' ? 'create' : 'login')}
              style={{
                width: '100%', padding: '14px',
                background: 'transparent',
                border: '1.5px solid var(--cream-dark)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--ink-soft)', fontSize: 14,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green-light)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--cream-dark)'}
            >
              {mode === 'login' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </button>
          </form>

          <p style={{ marginTop: 24, fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.6 }}>
            Need help getting started? Ask a caseworker, family member, or anyone you trust to help you sign up.
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
  fontFamily: 'var(--font-body)', fontSize: 15,
  background: 'var(--white)', color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color 0.2s',
};
