const RPC = 'https://base-mainnet.public.blastapi.io';
const API = 'https://api.inprocess.world/api/collections';

let cache = { data: null, ts: 0 };
const TTL = 30 * 60 * 1000;

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.ts < TTL) {
    res.setHeader('Cache-Control', 'public, s-maxage=1800');
    return res.status(200).json(cache.data);
  }

  try {
    // Fetch collections (all pages in parallel)
    const first = await fetch(API + '?page=1&limit=100');
    const firstData = await first.json();
    const totalPages = Math.min(firstData.pagination?.total_pages || 1, 10);
    const allCols = [...(firstData.collections || [])];

    if (totalPages > 1) {
      const pages = [];
      for (let p = 2; p <= totalPages; p++) {
        pages.push(fetch(API + '?page=' + p + '&limit=100').then(r => r.json()));
      }
      for (const r of await Promise.all(pages)) allCols.push(...(r.collections || []));
    }

    // Filter to collections with on-chain addresses
    const contracts = allCols.filter(c => c.address).map(c => ({
      address: c.address,
      artist: c.default_admin?.username || 'UNKNOWN',
      name: c.name || ''
    }));

    // Batch RPC: get nextTokenId for all contracts at once
    const body = contracts.map((c, i) => ({
      jsonrpc: '2.0', id: i, method: 'eth_call',
      params: [{ to: c.address, data: '0x75794a3c' }, 'latest']
    }));

    // Send in chunks of 200
    const rpcResults = [];
    for (let i = 0; i < body.length; i += 200) {
      const chunk = body.slice(i, i + 200);
      const r = await fetch(RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(chunk) });
      const json = await r.json();
      rpcResults.push(...(Array.isArray(json) ? json : [json]));
    }
    rpcResults.sort((a, b) => a.id - b.id);

    // Build flat token list using collection name + token number
    const tokens = [];
    for (let i = 0; i < contracts.length; i++) {
      const nextId = parseInt(rpcResults[i]?.result, 16);
      if (nextId > 1) {
        const max = Math.min(nextId, 50);
        for (let t = 1; t < max; t++) {
          tokens.push({
            name: contracts[i].name ? contracts[i].name + ' #' + t : 'TOKEN #' + t,
            artist: contracts[i].artist,
            address: contracts[i].address,
            tokenId: t
          });
        }
      }
    }

    const result = { tokens, updated: Date.now() };
    cache = { data: result, ts: Date.now() };

    res.setHeader('Cache-Control', 'public, s-maxage=1800');
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
