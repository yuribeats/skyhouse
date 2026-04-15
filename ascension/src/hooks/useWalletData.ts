'use client';

import { useEffect, useRef } from 'react';
import { useStore } from './useStore';
import type { UnifiedToken } from '@/lib/types';

export function useWalletData() {
  const evmAddresses = useStore((s) => s.evmAddresses);
  const walletLoaded = useStore((s) => s.walletLoaded);
  const activeChains = useStore((s) => s.activeChains);
  const useNewest = useStore((s) => s.filters.useNewest);
  const setTokens = useStore((s) => s.setTokens);
  const appendTokens = useStore((s) => s.appendTokens);
  const setLoading = useStore((s) => s.setLoading);
  const setLoadProgress = useStore((s) => s.setLoadProgress);
  const setError = useStore((s) => s.setError);

  const loadedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!walletLoaded || evmAddresses.length === 0) return;

    const chainsKey = [...activeChains].sort().join(',');
    const addressKey = [...evmAddresses].sort().join(',') + ':' + chainsKey;
    const currentKey = addressKey + (useNewest ? ':newest' : ':all');

    if (loadedKey.current === currentKey) return;

    let cancelled = false;

    async function fetchForWalletChain(wallet: string, chain: string) {
      const params: Record<string, string> = { wallet, chain };
      if (useNewest) {
        params.mode = 'newest';
        params.limit = '200';
      }
      const res = await fetch(`/api/nfts?${new URLSearchParams(params)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      return ((data.tokens || []) as UnifiedToken[]).map((t: UnifiedToken) => ({
        ...t,
        sourceWallet: wallet,
        isOwned: true,
      }));
    }

    async function load() {
      setLoading(true);
      setError(null);
      setLoadProgress(0);
      setTokens([]);
      loadedKey.current = null;

      const jobs = evmAddresses.flatMap((addr) =>
        activeChains.map((chain) => ({ addr, chain }))
      );
      const totalJobs = jobs.length;
      let completed = 0;
      const seen = new Set<string>();

      await Promise.allSettled(
        jobs.map(async ({ addr, chain }) => {
          try {
            const tokens = await fetchForWalletChain(addr, chain);
            if (cancelled) return;
            const fresh: UnifiedToken[] = [];
            for (const t of tokens) {
              if (!seen.has(t.id)) {
                seen.add(t.id);
                fresh.push(t);
              }
            }
            if (fresh.length > 0) appendTokens(fresh);
          } catch (err) {
            if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load tokens');
          } finally {
            completed++;
            if (!cancelled) setLoadProgress(completed / totalJobs);
          }
        })
      );

      if (!cancelled) {
        loadedKey.current = currentKey;
        setLoading(false);
        setLoadProgress(1);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [evmAddresses, walletLoaded, activeChains, useNewest, setTokens, appendTokens, setLoading, setLoadProgress, setError]);
}
