const walletCache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = (req.query.username || '').toLowerCase();
  const apiKey = req.query.apiKey || '';
  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  const headers = apiKey ? { 'x-api-key': apiKey } : {};

  try {
    let adminWallet = walletCache.get(username);

    if (!adminWallet) {
      let page = 1;
      let totalPages = 1;

      while (!adminWallet && page <= totalPages) {
        const scan = await fetch(
          `https://api.inprocess.world/api/collections?page=${page}&limit=100`,
          { headers }
        );
        const scanData = await scan.json();
        const cols = scanData.collections || [];
        totalPages = scanData.pagination?.total_pages || 1;

        for (const c of cols) {
          const u = (c.default_admin?.username || '').toLowerCase();
          if (u && c.default_admin?.address) {
            walletCache.set(u, c.default_admin.address);
          }
          if (u === username) {
            adminWallet = c.default_admin.address;
          }
        }
        page++;
      }
    }

    if (!adminWallet) {
      return res.status(200).json({ collections: [] });
    }

    const response = await fetch(
      `https://api.inprocess.world/api/collections?artist=${adminWallet}`,
      { headers }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
