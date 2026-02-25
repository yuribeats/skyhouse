export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: 'Collection address required' });
  }

  try {
    // Get nextTokenId from contract
    const nextTokenRes = await fetch('https://mainnet.base.org', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_call',
        params: [{ to: address, data: '0x75794a3c' }, 'latest'],
      }),
    });
    const nextTokenData = await nextTokenRes.json();
    const nextTokenId = parseInt(nextTokenData.result, 16);

    if (nextTokenId <= 1) {
      return res.status(200).json({ tokens: [] });
    }

    // Fetch all token URIs in parallel
    const calls = [];
    for (let i = 1; i < nextTokenId; i++) {
      const tokenIdHex = i.toString(16).padStart(64, '0');
      calls.push(
        fetch('https://mainnet.base.org', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: i,
            method: 'eth_call',
            params: [{ to: address, data: '0x0e89341c' + tokenIdHex }, 'latest'],
          }),
        }).then(r => r.json())
      );
    }

    const results = await Promise.all(calls);
    const uris = results.map(r => {
      const hex = r.result;
      if (!hex || hex.length <= 2) return null;
      const h = hex.slice(2);
      const len = parseInt(h.slice(64, 128), 16);
      const uriHex = h.slice(128, 128 + len * 2);
      return Buffer.from(uriHex, 'hex').toString();
    });

    // Fetch metadata from Arweave in parallel
    const metaPromises = uris.map((uri, idx) => {
      if (!uri) return Promise.resolve(null);
      const arHash = uri.replace('ar://', '');
      return fetch(`https://ar-io.net/${arHash}`)
        .then(r => r.json())
        .then(meta => ({ tokenId: idx + 1, uri, ...meta }))
        .catch(() => ({ tokenId: idx + 1, uri, name: 'TOKEN ' + (idx + 1) }));
    });

    const tokens = (await Promise.all(metaPromises)).filter(Boolean);

    return res.status(200).json({ tokens });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
