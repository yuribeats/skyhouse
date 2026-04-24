'use client';

import { useMemo } from 'react';
import { useWalletData } from '@/hooks/useWalletData';
import { useStore } from '@/hooks/useStore';
import TokenGrid from '@/components/feed/TokenGrid';
import TokenDetail from '@/components/feed/TokenDetail';
import HUD from '@/components/feed/HUD';

export default function ForrestGallery() {
  useWalletData();

  const selectedToken = useStore((s) => s.selectedToken);
  const setSelectedToken = useStore((s) => s.setSelectedToken);
  const isLoading = useStore((s) => s.isLoading);
  const loadProgress = useStore((s) => s.loadProgress);
  const tokens = useStore((s) => s.tokens);
  const filters = useStore((s) => s.filters);
  const getFilteredTokens = useStore((s) => s.getFilteredTokens);

  const filteredTokens = useMemo(() => getFilteredTokens(), [tokens, filters, getFilteredTokens]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '60vh' }}>
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
            background: '#ff4b00',
            width: `${Math.max(loadProgress * 100, 5)}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      )}

      <HUD />

      {selectedToken && (
        <TokenDetail
          token={selectedToken}
          onClose={() => setSelectedToken(null)}
        />
      )}
    </div>
  );
}
