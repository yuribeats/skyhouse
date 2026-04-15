'use client';

import { useMemo } from 'react';
import { useStore } from '@/hooks/useStore';

export default function HUD() {
  const tokens = useStore((s) => s.tokens);
  const isLoading = useStore((s) => s.isLoading);
  const getFilteredTokens = useStore((s) => s.getFilteredTokens);
  const filters = useStore((s) => s.filters);
  const filteredCount = useMemo(() => getFilteredTokens().length, [tokens, filters, getFilteredTokens]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      right: '10px',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
      gap: '6px',
      fontFamily: 'inherit',
      color: '#fff',
      pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 12px',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        <span>{isLoading ? 'LOADING...' : `${filteredCount} / ${tokens.length}`}</span>
      </div>
    </div>
  );
}
