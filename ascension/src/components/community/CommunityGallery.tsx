'use client';

import { useState, useEffect, useCallback } from 'react';

interface Member {
  wallet: string;
  username: string;
  joinedAt: string;
}

interface Moment {
  tokenId: string;
  collection: string;
  createdAt: string;
  name: string;
  description: string;
  image: string;
  contentUri: string;
  contentMime: string;
  inprocessUrl: string;
}

function MomentCard({ moment, onSelect }: { moment: Moment; onSelect: (m: Moment) => void }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div onClick={() => onSelect(moment)} style={{
      position: 'relative',
      aspectRatio: '1',
      background: '#111',
      border: '1px solid rgba(255,255,255,0.06)',
      overflow: 'hidden',
    }}>
      {moment.image && !imgFailed ? (
        <img
          src={moment.image}
          alt={moment.name}
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
          {moment.name || 'UNTITLED'}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        padding: '16px 6px 4px',
      }}>
        <div style={{
          fontSize: '8px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {moment.name || 'UNTITLED'}
        </div>
      </div>
    </div>
  );
}

function MomentDetail({ moment, onClose }: { moment: Moment; onClose: () => void }) {
  const isVideo = moment.contentMime.startsWith('video/');
  const isAudio = moment.contentMime.startsWith('audio/');

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: window.innerWidth < 768 ? '100%' : '420px',
      background: 'rgba(10, 10, 15, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      overflowY: 'auto',
      zIndex: 100, padding: '24px',
      fontFamily: 'inherit', color: '#fff',
    }}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', padding: '8px 14px', fontFamily: 'inherit',
        fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', zIndex: 10,
      }}>CLOSE</button>

      <div style={{ marginTop: '48px', marginBottom: '20px' }}>
        {isVideo ? (
          <video src={moment.contentUri} controls autoPlay style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        ) : isAudio ? (
          <div>
            {moment.image && <img src={moment.image} alt={moment.name} style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />}
            <audio src={moment.contentUri} controls autoPlay style={{ width: '100%', marginTop: '8px' }} />
          </div>
        ) : (
          <img src={moment.contentUri || moment.image} alt={moment.name} style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
        )}
      </div>

      <h2 style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 16px', letterSpacing: '0.05em' }}>
        {moment.name || 'UNTITLED'}
      </h2>

      {moment.description && (
        <p style={{ fontSize: '12px', color: '#999', lineHeight: '1.6', marginTop: '16px' }}>
          {moment.description}
        </p>
      )}

      <div style={{ marginTop: '24px' }}>
        <a href={moment.inprocessUrl} target="_blank" rel="noopener noreferrer" style={{
          border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 14px',
          fontSize: '11px', fontWeight: 'bold', fontFamily: 'inherit',
          textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '0.05em',
        }}>VIEW ON INPROCESS</a>
      </div>
    </div>
  );
}

const PAGE_SIZE = 100;

export default function CommunityGallery() {
  const [members, setMembers] = useState<Member[]>([]);
  const [momentsByWallet, setMomentsByWallet] = useState<Record<string, Moment[]>>({});
  const [pageByWallet, setPageByWallet] = useState<Record<string, number>>({});
  const [totalByWallet, setTotalByWallet] = useState<Record<string, number>>({});
  const [loadingMore, setLoadingMore] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
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

    async function loadMoments() {
      setLoading(true);

      await Promise.allSettled(
        members.map(async (m) => {
          const res = await fetch(`/api/community/timeline?wallet=${m.wallet}&limit=${PAGE_SIZE}&page=1`);
          const data = await res.json();
          if (!cancelled && data.moments) {
            setMomentsByWallet((prev) => ({ ...prev, [m.wallet]: data.moments }));
            setPageByWallet((prev) => ({ ...prev, [m.wallet]: 1 }));
            const totalPages = data.pagination?.total_pages || 1;
            setTotalByWallet((prev) => ({ ...prev, [m.wallet]: totalPages }));
          }
        })
      );

      if (!cancelled) setLoading(false);
    }

    loadMoments();
    return () => { cancelled = true; };
  }, [members]);

  async function loadMore(wallet: string) {
    const currentPage = pageByWallet[wallet] || 1;
    const nextPage = currentPage + 1;
    setLoadingMore((prev) => ({ ...prev, [wallet]: true }));

    const res = await fetch(`/api/community/timeline?wallet=${wallet}&limit=${PAGE_SIZE}&page=${nextPage}`);
    const data = await res.json();
    if (data.moments) {
      setMomentsByWallet((prev) => ({
        ...prev,
        [wallet]: [...(prev[wallet] || []), ...data.moments],
      }));
      setPageByWallet((prev) => ({ ...prev, [wallet]: nextPage }));
    }
    setLoadingMore((prev) => ({ ...prev, [wallet]: false }));
  }

  const getMemberName = useCallback((wallet: string) => {
    const m = members.find((m) => m.wallet.toLowerCase() === wallet.toLowerCase());
    return m?.username || `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  }, [members]);

  return (
    <div style={{ padding: '40px 0' }}>
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
        const moments = momentsByWallet[m.wallet] || [];
        if (moments.length === 0 && loading) return null;
        if (moments.length === 0) return null;
        return (
          <div key={m.wallet} style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '0 20px', marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: '#00a080',
              }}>
                {getMemberName(m.wallet)}
              </span>
              <span style={{ fontSize: '9px', color: '#333' }}>|</span>
              <span style={{ fontSize: '9px', color: '#fff', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                {moments.length} MOMENTS
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '2px',
            }}>
              {moments.map((mo) => (
                <MomentCard key={`${mo.collection}-${mo.tokenId}`} moment={mo} onSelect={setSelectedMoment} />
              ))}
            </div>
            {(pageByWallet[m.wallet] || 1) < (totalByWallet[m.wallet] || 1) && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <button
                  onClick={() => loadMore(m.wallet)}
                  disabled={loadingMore[m.wallet]}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    padding: '10px 32px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'inherit',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: loadingMore[m.wallet] ? 0.5 : 1,
                  }}
                >
                  {loadingMore[m.wallet] ? 'LOADING...' : 'LOAD MORE'}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {selectedMoment && (
        <MomentDetail moment={selectedMoment} onClose={() => setSelectedMoment(null)} />
      )}
    </div>
  );
}
