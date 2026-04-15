'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UnifiedToken } from '@/lib/types';
import { CHAINS, type ChainKey } from '@/lib/constants';
import TokenDetail from '@/components/feed/TokenDetail';

interface Member {
  wallet: string;
  username: string;
  joinedAt: string;
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function TokenCard({ token, onSelect }: { token: UnifiedToken; onSelect: (t: UnifiedToken) => void }) {
  const chain = CHAINS[token.chain as ChainKey];
  const imageUrl = token.media.thumbnail || token.media.image;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div onClick={() => onSelect(token)} style={{
      position: 'relative',
      aspectRatio: '1',
      background: '#111',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      {imageUrl && !imgFailed ? (
        <img
          src={imageUrl}
          alt={token.name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', fontWeight: 'bold', color: '#333', textTransform: 'uppercase',
          padding: '8px', textAlign: 'center',
        }}>
          {token.name}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        padding: '16px 6px 4px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div style={{
          fontSize: '8px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%',
        }}>
          {token.name}
        </div>
        <div style={{ fontSize: '7px', fontWeight: 'bold', color: chain?.color || '#666', textTransform: 'uppercase' }}>
          {chain?.name || token.chain}
        </div>
      </div>
    </div>
  );
}

export default function CommunityGallery() {
  const [members, setMembers] = useState<Member[]>([]);
  const [tokensByWallet, setTokensByWallet] = useState<Record<string, UnifiedToken[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<UnifiedToken | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const FORREST: Member = {
      wallet: '0x081bc58a9538b1313e93f6bbc6119ac6434fbe05',
      username: 'forrest',
      joinedAt: '2026-01-01T00:00:00.000Z',
    };
    fetch('/api/community/members')
      .then((r) => r.json())
      .then((data: Member[]) => {
        const list = Array.isArray(data) ? data : [];
        const hasForrest = list.some((m) => m.wallet.toLowerCase() === FORREST.wallet);
        setMembers(hasForrest ? list : [FORREST, ...list]);
      });
  }, []);

  useEffect(() => {
    if (members.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadTokens() {
      setLoading(true);
      const results: Record<string, UnifiedToken[]> = {};

      await Promise.allSettled(
        members.map(async (m) => {
          const res = await fetch(`/api/nfts?wallet=${m.wallet}&chain=base&mode=newest&limit=50`);
          const data = await res.json();
          if (!cancelled && data.tokens) {
            results[m.wallet] = data.tokens;
            setTokensByWallet((prev) => ({ ...prev, [m.wallet]: data.tokens }));
          }
        })
      );

      if (!cancelled) setLoading(false);
    }

    loadTokens();
    return () => { cancelled = true; };
  }, [members]);

  const getMemberName = useCallback((wallet: string) => {
    const m = members.find((m) => m.wallet.toLowerCase() === wallet.toLowerCase());
    return m?.username || truncate(wallet);
  }, [members]);

  return (
    <div style={{ padding: '40px 0' }}>
      <h2 style={{
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        COMMUNITY TOKENS
      </h2>

      {loading && members.length > 0 && (
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          LOADING...
        </p>
      )}

      {members.length === 0 && !loading && (
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          NO COMMUNITY MEMBERS YET
        </p>
      )}

      {members.map((m) => {
        const tokens = tokensByWallet[m.wallet] || [];
        if (tokens.length === 0 && loading) return null;
        return (
          <div key={m.wallet} style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 20px',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#00a080',
              }}>
                {getMemberName(m.wallet)}
              </span>
              <span style={{ fontSize: '9px', color: '#333' }}>|</span>
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                {tokens.length} TOKENS
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '2px',
            }}>
              {tokens.map((t) => (
                <TokenCard key={t.id} token={t} onSelect={setSelectedToken} />
              ))}
            </div>
          </div>
        );
      })}

      {selectedToken && (
        <TokenDetail token={selectedToken} onClose={() => setSelectedToken(null)} />
      )}
    </div>
  );
}
