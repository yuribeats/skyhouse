import { Alchemy, Network, NftFilters } from 'alchemy-sdk';
import { CHAIN_KEYS, type ChainKey } from './constants';
import { resolveMedia } from './mediaUtils';
import type { UnifiedToken } from './types';

const CREATOR_FACTORIES = new Set([
  '0x3b612a5b49e025a6e4ba4ee4fb1ef46d13588059',
  '0x7f09d2be32e8e320fce3c824b45ca0cd870099a6',
  '0x2a3d7d1d5a75a23b74e95b1853f96a5f4c39aa51',
]);

async function retry<T>(fn: () => Promise<T>, attempts = 2, delay = 500): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('retry exhausted');
}

function getClient(chain: ChainKey): Alchemy {
  const networkMap: Record<ChainKey, Network> = {
    ethereum: Network.ETH_MAINNET,
    base: Network.BASE_MAINNET,
    optimism: Network.OPT_MAINNET,
    zora: Network.ZORA_MAINNET,
  };
  return new Alchemy({
    apiKey: process.env.ALCHEMY_API_KEY,
    network: networkMap[chain],
  });
}

export async function fetchNftsForChain(chain: ChainKey, wallet: string, limit: number = 0): Promise<UnifiedToken[]> {
  const client = getClient(chain);
  const tokens: UnifiedToken[] = [];
  let pageKey: string | undefined;

  do {
    let nfts: Array<Record<string, unknown>> = [];
    let nextPageKey: string | undefined;

    try {
      const response = await client.nft.getNftsForOwner(wallet, {
        excludeFilters: [NftFilters.SPAM],
        pageKey,
        pageSize: 100,
      });
      nfts = response.ownedNfts as unknown as Array<Record<string, unknown>>;
      nextPageKey = response.pageKey;
    } catch {
      try {
        const fallback = await client.nft.getNftsForOwner(wallet, {
          excludeFilters: [NftFilters.SPAM],
          pageKey,
          pageSize: 100,
          omitMetadata: true,
        });
        nextPageKey = fallback.pageKey;

        const enriched = await Promise.allSettled(
          fallback.ownedNfts.map((n) => retry(() => client.nft.getNftMetadata(n.contractAddress, n.tokenId)))
        );
        for (const result of enriched) {
          if (result.status === 'fulfilled') {
            nfts.push(result.value as unknown as Record<string, unknown>);
          }
        }
      } catch {
        break;
      }
    }

    for (let i = 0; i < nfts.length; i++) {
      const nft = nfts[i];
      const raw = nft.raw as Record<string, unknown> | undefined;
      const metadata = raw?.metadata as Record<string, unknown> | undefined;
      const contract = nft.contract as Record<string, unknown> | undefined;
      const image = nft.image as { cachedUrl?: string; thumbnailUrl?: string; originalUrl?: string } | undefined;
      const media = resolveMedia(metadata, image);

      const deployer = (contract?.contractDeployer as string) || undefined;
      const deployerLower = deployer?.toLowerCase();
      const isDeployerMatch = deployerLower && wallet.toLowerCase() === deployerLower;
      const mint = (nft as Record<string, unknown>).mint as { mintAddress?: string; timestamp?: string } | undefined;
      const isFactoryCreated = nft.tokenType !== 'ERC1155'
        && deployerLower && CREATOR_FACTORIES.has(deployerLower)
        && mint?.mintAddress && wallet.toLowerCase() === mint.mintAddress.toLowerCase();
      const isCreated = isDeployerMatch || isFactoryCreated;

      tokens.push({
        id: `${chain}-${contract?.address || ''}-${nft.tokenId || ''}`,
        chain,
        contractAddress: (contract?.address as string) || '',
        tokenId: nft.tokenId as string | undefined,
        standard: nft.tokenType === 'ERC1155' ? 'ERC1155' : 'ERC721',
        name: (nft.name as string) || (contract?.name as string) || `Token ${nft.tokenId || ''}`,
        description: (nft.description as string) || undefined,
        creator: deployer,
        collectionName: (contract?.name as string) || undefined,
        media,
        balance: nft.balance as string | undefined,
        attributes: metadata?.attributes as Array<{ trait_type: string; value: string }> | undefined,
        rawMetadata: metadata,
        lastUpdated: nft.timeLastUpdated as string | undefined,
        acquiredAt: ((nft as Record<string, unknown>).acquiredAt as { blockTimestamp?: string } | undefined)?.blockTimestamp || undefined,
        mintedAt: mint?.timestamp || undefined,
        ...(isCreated ? { createdByWallet: true, creationSource: isDeployerMatch ? 'owned_deployer_match' as const : 'minted' as const } : {}),
      });
    }

    if (limit > 0 && tokens.length >= limit) break;
    pageKey = nextPageKey;
  } while (pageKey);

  return limit > 0 ? tokens.slice(0, limit) : tokens;
}

export async function fetchNewestForChain(chain: ChainKey, wallet: string, limit: number = 100): Promise<UnifiedToken[]> {
  const tokens = await fetchNftsForChain(chain, wallet, limit);

  tokens.sort((a, b) => {
    const ta = a.acquiredAt ? new Date(a.acquiredAt).getTime() : a.mintedAt ? new Date(a.mintedAt).getTime() : 0;
    const tb = b.acquiredAt ? new Date(b.acquiredAt).getTime() : b.mintedAt ? new Date(b.mintedAt).getTime() : 0;
    return tb - ta;
  });

  return tokens.slice(0, limit);
}

export async function fetchAllNfts(wallet: string, chainFilter?: ChainKey, limit: number = 0): Promise<UnifiedToken[]> {
  const chains = chainFilter ? [chainFilter] : CHAIN_KEYS;
  const results = await Promise.allSettled(
    chains.map((c) => fetchNftsForChain(c, wallet, limit))
  );

  const tokens: UnifiedToken[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      tokens.push(...result.value);
    }
  }
  return tokens;
}

export async function fetchNewestNfts(wallet: string, limit: number = 100, chain: ChainKey = 'base'): Promise<UnifiedToken[]> {
  const results = await Promise.allSettled([fetchNewestForChain(chain, wallet, limit)]);

  const tokens: UnifiedToken[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      tokens.push(...result.value);
    }
  }

  tokens.sort((a, b) => {
    const ta = a.mintedAt ? new Date(a.mintedAt).getTime() : 0;
    const tb = b.mintedAt ? new Date(b.mintedAt).getTime() : 0;
    return tb - ta;
  });

  return tokens.slice(0, limit);
}
