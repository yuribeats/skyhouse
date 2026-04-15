'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/community/LoginForm';
import MintPortal from '@/components/community/MintPortal';
import CommunityGallery from '@/components/community/CommunityGallery';

interface Session {
  token: string;
  wallet: string;
  username: string;
  email: string;
}

const SESSION_KEY = 'ascension-community-session';
const SESSION_TTL = 55 * 60 * 1000;

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.ts > SESSION_TTL) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return data.session;
  } catch {
    return null;
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ session, ts: Date.now() }));
}

export default function Community() {
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<'mint' | 'gallery'>('gallery');

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function handleLogin(s: Session) {
    saveSession(s);
    setSession(s);
    setTab('mint');
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
    border: `1px solid ${active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
    color: '#fff',
    padding: '8px 20px',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: 'inherit',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 272px)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        padding: '24px 20px 0',
      }}>
        <button onClick={() => setTab('gallery')} style={tabStyle(tab === 'gallery')}>
          GALLERY
        </button>
        {session && (
          <button onClick={() => setTab('mint')} style={tabStyle(tab === 'mint')}>
            MINT
          </button>
        )}
        {!session && (
          <button onClick={() => setTab('mint')} style={tabStyle(tab === 'mint')}>
            JOIN
          </button>
        )}
      </div>

      {tab === 'mint' && !session && <LoginForm onLogin={handleLogin} />}
      {tab === 'mint' && session && <MintPortal session={session} onLogout={handleLogout} />}
      {tab === 'gallery' && <CommunityGallery />}
    </div>
  );
}
