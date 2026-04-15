'use client';

import { useState, useEffect } from 'react';
import LoginForm from '@/components/community/LoginForm';
import MintPortal from '@/components/community/MintPortal';
import CommunityGallery from '@/components/community/CommunityGallery';
import dynamic from 'next/dynamic';

const ForrestFeed = dynamic(() => import('@/components/community/ForrestGallery'), { ssr: false });

interface Session {
  token: string;
  wallet: string;
  username: string;
  email: string;
}

const SESSION_KEY = 'ascension-community-session';
const SESSION_TTL = 55 * 60 * 1000;

type View = 'community' | 'mint' | 'forrest';

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
  const [view, setView] = useState<View>('community');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function handleLogin(s: Session) {
    saveSession(s);
    setSession(s);
    setView('mint');
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setView('community');
  }

  const labels: Record<View, string> = {
    community: 'COMMUNITY GALLERY',
    mint: session ? 'MINT' : 'JOIN',
    forrest: "FORREST'S GALLERY",
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 272px)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 20px 0',
        position: 'relative',
      }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '10px 24px',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'inherit',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '220px',
              justifyContent: 'space-between',
            }}
          >
            <span>{labels[view]}</span>
            <span style={{ fontSize: '8px' }}>{menuOpen ? '\u25B2' : '\u25BC'}</span>
          </button>

          {menuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#111',
              border: '1px solid rgba(255,255,255,0.15)',
              zIndex: 20,
            }}>
              {(['community', 'forrest', 'mint'] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => { setView(v); setMenuOpen(false); }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    background: view === v ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'inherit',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    letterSpacing: '0.08em',
                  }}
                >
                  {labels[v]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {view === 'mint' && !session && <LoginForm onLogin={handleLogin} />}
      {view === 'mint' && session && <MintPortal session={session} onLogout={handleLogout} />}
      {view === 'community' && <CommunityGallery />}
      {view === 'forrest' && <ForrestFeed />}
    </div>
  );
}
