const RPC = 'https://base-mainnet.public.blastapi.io';
const API = 'https://api.inprocess.world/api/collections';

let cache = { data: null, ts: 0 };
const TTL = 10 * 60 * 1000;

async function batchRpc(calls) {
  const chunks = [];
  for (let i = 0; i < calls.length; i += 80) chunks.push(calls.slice(i, i + 80));
  const results = [];
  for (const chunk of chunks) {
    const body = chunk.map((c, i) => ({ jsonrpc: '2.0', id: i, method: 'eth_call', params: [{ to: c.to, data: c.data }, 'latest'] }));
    const res = await fetch(RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    const sorted = Array.isArray(json) ? json.sort((a, b) => a.id - b.id) : [json];
    results.push(...sorted);
  }
  return results;
}

function decodeString(hex) {
  if (!hex || hex.length <= 2) return null;
  const h = hex.slice(2);
  const len = parseInt(h.slice(64, 128), 16);
  if (!len || len > 10000) return null;
  const uriHex = h.slice(128, 128 + len * 2);
  return Buffer.from(uriHex, 'hex').toString();
}

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < TTL) {
    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(200).json(cache.data);
  }

  try {
    // Fetch collections (limit to 10 pages = 1000 collections)
    const first = await fetch(API + '?page=1&limit=100');
    const firstData = await first.json();
    const totalPages = Math.min(firstData.pagination?.total_pages || 1, 10);
    const allCols = [...(firstData.collections || [])];

    if (totalPages > 1) {
      const fetches = [];
      for (let p = 2; p <= totalPages; p++) {
        fetches.push(fetch(API + '?page=' + p + '&limit=100').then(r => r.json()));
      }
      const results = await Promise.all(fetches);
      for (const r of results) allCols.push(...(r.collections || []));
    }

    // Filter to collections with addresses
    const contracts = allCols.filter(c => c.address).map(c => ({
      address: c.address,
      artist: c.default_admin?.username || 'UNKNOWN',
      name: c.name || ''
    }));

    // Batch: get nextTokenId for all contracts
    const tokenIdCalls = contracts.map(c => ({ to: c.address, data: '0x75794a3c' }));
    const tokenIdResults = await batchRpc(tokenIdCalls);

    // Build list of contracts that have tokens
    const withTokens = [];
    for (let i = 0; i < contracts.length; i++) {
      const nextId = parseInt(tokenIdResults[i]?.result, 16);
      if (nextId > 1) {
        withTokens.push({ ...contracts[i], nextTokenId: nextId });
      }
    }

    // Batch: get token URIs for all tokens across all contracts
    const uriCalls = [];
    const uriMeta = [];
    for (const c of withTokens) {
      const maxTokens = Math.min(c.nextTokenId, 50);
      for (let t = 1; t < maxTokens; t++) {
        const hex = t.toString(16).padStart(64, '0');
        uriCalls.push({ to: c.address, data: '0x0e89341c' + hex });
        uriMeta.push({ artist: c.artist, collection: c.name, address: c.address, tokenId: t });
      }
    }

    const uriResults = await batchRpc(uriCalls);

    // Decode URIs and fetch metadata from Arweave
    const tokens = [];
    const arFetches = [];

    for (let i = 0; i < uriResults.length; i++) {
      const uri = decodeString(uriResults[i]?.result);
      if (!uri) continue;
      const arHash = uri.replace('ar://', '');
      arFetches.push(
        fetch('https://ar-io.net/' + arHash)
          .then(r => r.json())
          .then(meta => ({
            name: meta.name || 'TOKEN ' + uriMeta[i].tokenId,
            artist: uriMeta[i].artist,
            collection: uriMeta[i].collection,
            address: uriMeta[i].address,
            tokenId: uriMeta[i].tokenId
          }))
          .catch(() => ({
            name: 'TOKEN ' + uriMeta[i].tokenId,
            artist: uriMeta[i].artist,
            collection: uriMeta[i].collection,
            address: uriMeta[i].address,
            tokenId: uriMeta[i].tokenId
          }))
      );
    }

    const resolved = await Promise.all(arFetches);
    tokens.push(...resolved);

    const result = { tokens, updated: Date.now() };
    cache = { data: result, ts: Date.now() };

    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
