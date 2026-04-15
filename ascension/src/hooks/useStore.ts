'use client';

import { create } from 'zustand';
import type { UnifiedToken, FilterState } from '@/lib/types';
import type { ChainKey } from '@/lib/constants';
import { FORREST_ADDR } from '@/lib/constants';

interface FeedStore {
  tokens: UnifiedToken[];
  filters: FilterState;
  selectedToken: UnifiedToken | null;
  isLoading: boolean;
  loadProgress: number;
  error: string | null;

  evmAddresses: string[];
  walletLoaded: boolean;
  activeChains: ChainKey[];

  playlistOpen: boolean;
  playlistTokens: UnifiedToken[];
  playlistIndex: number;

  setTokens: (tokens: UnifiedToken[]) => void;
  appendTokens: (tokens: UnifiedToken[]) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  setSelectedToken: (token: UnifiedToken | null) => void;
  setLoading: (loading: boolean) => void;
  setLoadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  loadWallets: (addresses: string[]) => void;
  setActiveChains: (chains: ChainKey[]) => void;
  toggleChain: (chain: ChainKey) => void;
  getFilteredTokens: () => UnifiedToken[];
  openPlaylist: () => void;
  closePlaylist: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setPlaylistIndex: (index: number) => void;
}

export const useStore = create<FeedStore>((set, get) => ({
  tokens: [],
  filters: {
    standards: ['ERC1155'],
    mediaTypes: [],
    layout: 'grid',
    useNewest: true,
    sortDirection: 'desc',
    searchQuery: '',
    density: 0.4,
    newestCount: typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100,
    thumbnailSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 0.21 : 0.1,
    gridCols: typeof window !== 'undefined' && window.innerWidth < 768 ? 5 : 0,
    showOwned: true,
    showCreated: false,
    selectedWallets: [],
  },
  selectedToken: null,
  isLoading: false,
  loadProgress: 0,
  error: null,

  evmAddresses: [FORREST_ADDR],
  walletLoaded: true,
  activeChains: ['base'],

  playlistOpen: false,
  playlistTokens: [],
  playlistIndex: 0,

  setTokens: (tokens) => set({ tokens }),
  appendTokens: (tokens) => set((s) => ({ tokens: [...s.tokens, ...tokens] })),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setSelectedToken: (token) => set({ selectedToken: token }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadProgress: (progress) => set({ loadProgress: progress }),
  setError: (error) => set({ error }),

  loadWallets: (addresses) =>
    set({ evmAddresses: addresses, walletLoaded: true, tokens: [], error: null, selectedToken: null, loadProgress: 0 }),

  setActiveChains: (chains) =>
    set({ activeChains: chains, tokens: [], loadProgress: 0, selectedToken: null }),

  toggleChain: (chain) => {
    const current = get().activeChains;
    const has = current.includes(chain);
    const next = has ? current.filter((c) => c !== chain) : [...current, chain];
    if (next.length === 0) return;
    set({ activeChains: next, tokens: [], loadProgress: 0, selectedToken: null });
  },

  openPlaylist: () => {
    const filtered = get().getFilteredTokens();
    const media = filtered.filter((t) => t.media.mediaType === 'video' || t.media.mediaType === 'audio');
    if (media.length > 0) set({ playlistOpen: true, playlistTokens: media, playlistIndex: 0 });
  },
  closePlaylist: () => set({ playlistOpen: false }),
  nextTrack: () => set((s) => ({ playlistIndex: (s.playlistIndex + 1) % s.playlistTokens.length })),
  prevTrack: () => set((s) => ({ playlistIndex: (s.playlistIndex - 1 + s.playlistTokens.length) % s.playlistTokens.length })),
  setPlaylistIndex: (index) => set({ playlistIndex: index }),

  getFilteredTokens: () => {
    const { tokens, filters } = get();
    let filtered = tokens;

    if (filters.showOwned && !filters.showCreated) {
      filtered = filtered.filter((t) => t.isOwned);
    } else if (filters.showCreated && !filters.showOwned) {
      filtered = filtered.filter((t) => t.createdByWallet);
    }

    filtered = filtered.filter((t) => t.media.thumbnail || t.media.image);
    filtered = filtered.filter((t) => filters.standards.includes(t.standard));

    if (filters.mediaTypes.length > 0) {
      filtered = filtered.filter((t) => filters.mediaTypes.includes(t.media.mediaType));
    }

    if (filters.selectedCreator) {
      filtered = filtered.filter((t) => t.creator === filters.selectedCreator);
    }

    if (filters.selectedCollection) {
      filtered = filtered.filter((t) => t.collectionName === filters.selectedCollection);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.collectionName && t.collectionName.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    const seen = new Set<string>();
    filtered = filtered.filter((t) => {
      const url = t.media.originalUrl || '';
      if (!url) return true;
      const cidMatch = url.match(/(?:ipfs:\/\/|\/ipfs\/)([a-zA-Z0-9]+)/);
      const normalized = cidMatch ? cidMatch[1] : url;
      const key = `${t.contractAddress}::${normalized}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return filtered;
  },
}));
