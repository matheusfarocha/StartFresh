import React from 'react';

export default function Mascot({ message, size = 44 }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      background: 'var(--green-pale)',
      border: '1.5px solid var(--green-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px 20px',
      marginBottom: 32,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: 'var(--green-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5, flexShrink: 0,
      }}>
        🌱
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-mid)', marginBottom: 4, letterSpacing: '0.04em' }}>
          Friendly Tip
        </div>
        <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
          {message}
        </p>
      </div>
    </div>
  );
}
