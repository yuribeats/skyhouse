export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { collectionAddress, tokenId, recipients, account, apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    const payload = {
      moment: {
        tokenId: String(tokenId),
        collectionAddress,
      },
      recipients: recipients.map(addr => ({
        recipientAddress: addr,
        tokenId: String(tokenId),
      })),
      account,
    };
    console.log('AIRDROP REQUEST:', JSON.stringify(payload));

    const response = await fetch(
      'https://api.inprocess.world/api/moment/airdrop',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moment: {
            tokenId: String(tokenId),
            collectionAddress,
          },
          recipients: recipients.map(addr => ({
            recipientAddress: addr,
            tokenId: String(tokenId),
          })),
          account,
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
