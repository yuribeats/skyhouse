'use client';

import { useMemo } from 'react';
import { useWalletData } from '@/hooks/useWalletData';
import { useStore } from '@/hooks/useStore';
import TokenGrid from '@/components/feed/TokenGrid';
import TokenDetail from '@/components/feed/TokenDetail';
import FilterPanel from '@/components/feed/FilterPanel';
import HUD from '@/components/feed/HUD';
import dynamic from 'next/dynamic';

const PlaylistPlayer = dynamic(() => import('@/components/feed/PlaylistPlayer'), { ssr: false });

export default function Feed() {
  useWalletData();

  const selectedToken = useStore((s) => s.selectedToken);
  const setSelectedToken = useStore((s) => s.setSelectedToken);
  const playlistOpen = useStore((s) => s.playlistOpen);
  const isLoading = useStore((s) => s.isLoading);
  const loadProgress = useStore((s) => s.loadProgress);
  const error = useStore((s) => s.error);
  const tokens = useStore((s) => s.tokens);
  const filters = useStore((s) => s.filters);
  const getFilteredTokens = useStore((s) => s.getFilteredTokens);

  const filteredTokens = useMemo(() => getFilteredTokens(), [tokens, filters, getFilteredTokens]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 'calc(100vh - 272px)' }}>
      <TokenGrid tokens={filteredTokens} onSelect={setSelectedToken} />

      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          zIndex: 300,
          background: 'rgba(255,255,255,0.05)',
        }}>
          <div style={{
            height: '100%',
            background: '#00a080',
            width: `${Math.max(loadProgress * 100, 5)}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      <FilterPanel />
      <HUD />

      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}

      {playlistOpen && <PlaylistPlayer />}

      {error && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 200,
          fontWeight: 'bold',
          fontSize: '12px',
          textTransform: 'uppercase',
          color: '#FF0420',
          textAlign: 'center',
          maxWidth: '400px',
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
