'use client';

import { useState, type FormEvent } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = '/';
    } else {
      setError('Incorrect password');
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#17171a',
          border: '1px solid #27272d',
          borderRadius: 12,
          padding: 32,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#ededf0' }}>
          AIW Agentic Website Wizard
        </h1>
        <p style={{ marginTop: 8, marginBottom: 24, color: '#a0a0ad', fontSize: 14 }}>
          Enter password to continue.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: '100%',
            padding: '12px 14px',
            background: '#111113',
            border: '1px solid #303038',
            borderRadius: 8,
            color: '#ededf0',
            fontSize: 14,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        {error && (
          <div style={{ marginTop: 12, color: '#e86080', fontSize: 13 }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '12px 14px',
            background: loading || !password ? '#27272d' : '#9580f0',
            color: loading || !password ? '#65657a' : '#111113',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {loading ? 'Checking…' : 'Continue'}
        </button>
      </form>
    </main>
  );
}
