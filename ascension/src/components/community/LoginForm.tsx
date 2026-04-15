'use client';

import { useState } from 'react';

interface Session {
  token: string;
  wallet: string;
  username: string;
  email: string;
}

interface LoginFormProps {
  onLogin: (session: Session) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSendCode() {
    if (!email || !email.includes('@')) {
      setError('ENTER A VALID EMAIL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/community/auth/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError('FAILED TO SEND CODE');
        setLoading(false);
        return;
      }
      setStep('code');
    } catch {
      setError('NETWORK ERROR');
    }
    setLoading(false);
  }

  async function handleLogin() {
    if (!code) {
      setError('ENTER THE CODE');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/community/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        setError('INVALID CODE');
        setLoading(false);
        return;
      }
      const data = await res.json();
      const apiKey = data.token || data.apiKey || data.access_token;

      const profileRes = await fetch('/api/community/auth/profile', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      const profile = await profileRes.json();

      const session: Session = {
        token: apiKey,
        wallet: profile.artistAddress || profile.wallet || profile.address || '',
        username: profile.profile?.username || profile.username || email.split('@')[0],
        email,
      };

      await fetch('/api/community/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: session.wallet, username: session.username }),
      });

      onLogin(session);
    } catch {
      setError('LOGIN FAILED');
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (step === 'email') handleSendCode();
      else handleLogin();
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 'min(400px, 90vw)',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    padding: '14px 16px',
    fontSize: '13px',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    outline: 'none',
    letterSpacing: '0.05em',
  };

  const btnStyle: React.CSSProperties = {
    background: '#fff',
    color: '#000',
    border: 'none',
    padding: '14px 32px',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.15em',
    opacity: loading ? 0.5 : 1,
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '60px 20px',
      textAlign: 'center',
    }}>
      <h2 style={{
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: '#fff',
        marginBottom: '8px',
      }}>
        {step === 'email' ? 'JOIN THE COMMUNITY' : 'ENTER VERIFICATION CODE'}
      </h2>

      <p style={{
        fontSize: '11px',
        color: '#fff',
        letterSpacing: '0.05em',
        maxWidth: 'min(400px, 90vw)',
        lineHeight: '1.6',
        textTransform: 'uppercase',
      }}>
        {step === 'email'
          ? 'SIGN IN WITH YOUR INPROCESS ACCOUNT OR CREATE ONE'
          : `CODE SENT TO ${email}`}
      </p>

      {step === 'email' ? (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="EMAIL"
          style={inputStyle}
        />
      ) : (
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="6-DIGIT CODE"
          maxLength={6}
          style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.3em' }}
        />
      )}

      {error && (
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#FF0420', letterSpacing: '0.1em' }}>
          {error}
        </div>
      )}

      <button
        onClick={step === 'email' ? handleSendCode : handleLogin}
        disabled={loading}
        style={btnStyle}
      >
        {loading ? '...' : step === 'email' ? 'SEND CODE' : 'LOGIN'}
      </button>

      {step === 'code' && (
        <button
          onClick={() => { setStep('email'); setCode(''); setError(''); }}
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          USE DIFFERENT EMAIL
        </button>
      )}
    </div>
  );
}
