import React from 'react';

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  transition: 'var(--transition)',
  textDecoration: 'none',
};

const VARIANTS = {
  primary: {
    background: 'var(--green-deep)',
    color: 'white',
    padding: '14px 24px',
    fontSize: 15,
  },
  secondary: {
    background: 'transparent',
    color: 'var(--ink)',
    padding: '12px 20px',
    fontSize: 14,
    border: '1.5px solid var(--cream-dark)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--green-mid)',
    padding: '10px 16px',
    fontSize: 14,
  },
};

export default function Button({ variant = 'primary', full, style, children, disabled, ...props }) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      {...props}
      disabled={disabled}
      style={{
        ...BASE,
        ...variantStyle,
        width: full ? '100%' : undefined,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'default' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
