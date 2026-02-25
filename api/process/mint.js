export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { momentUri, collectionAddress, account, recipientCount, apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    const response = await fetch(
      'https://api.inprocess.world/api/moment/create',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract: { address: collectionAddress },
          token: {
            tokenMetadataURI: momentUri,
            createReferral: '0x0000000000000000000000000000000000000000',
            salesConfig: {
              type: 'fixedPrice',
              pricePerToken: '0',
              saleStart: '0',
              saleEnd: '18446744073709551615',
            },
            mintToCreatorCount: (recipientCount || 1) + 1,
          },
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
