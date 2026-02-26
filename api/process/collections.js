const walletCache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = (req.query.username || '').toLowerCase();
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    let adminWallet = walletCache.get(username);

    if (!adminWallet) {
      const first = await fetch('https://api.inprocess.world/api/collections?page=1&limit=100');
      const firstData = await first.json();
      const totalPages = firstData.pagination?.total_pages || 1;

      const allCols = [...(firstData.collections || [])];

      if (totalPages > 1) {
        const fetches = [];
        for (let p = 2; p <= totalPages; p++) {
          fetches.push(fetch(`https://api.inprocess.world/api/collections?page=${p}&limit=100`).then(r => r.json()));
        }
        const results = await Promise.all(fetches);
        for (const r of results) {
          allCols.push(...(r.collections || []));
        }
      }

      let partialMatch = null;
      for (const c of allCols) {
        const u = (c.default_admin?.username || '').toLowerCase();
        if (u && c.default_admin?.address) {
          walletCache.set(u, c.default_admin.address);
        }
        if (u === username) {
          adminWallet = c.default_admin.address;
        } else if (!partialMatch && (u.startsWith(username) || username.startsWith(u))) {
          partialMatch = c.default_admin.address;
        }
      }
      if (!adminWallet && partialMatch) {
        adminWallet = partialMatch;
      }
    }

    if (!adminWallet) {
      return res.status(200).json({ collections: [] });
    }

    const response = await fetch(
      `https://api.inprocess.world/api/collections?artist=${adminWallet}`
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    data.wallet = adminWallet;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
