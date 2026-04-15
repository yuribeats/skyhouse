'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function CommunityContent() {
  const searchParams = useSearchParams();
  const viewParam = searchParams.get('view');
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function handleLogin(s: Session) {
    saveSession(s);
    setSession(s);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }

  const showMint = viewParam === 'mint';

  return (
    <>
      {showMint && !session && <LoginForm onLogin={handleLogin} />}
      {showMint && session && <MintPortal session={session} onLogout={handleLogout} />}
      {!showMint && <CommunityGallery />}
    </>
  );
}

export default function Community() {
  return (
    <div style={{ minHeight: 'calc(100vh - 272px)' }}>
      <Suspense>
        <CommunityContent />
      </Suspense>
    </div>
  );
}
