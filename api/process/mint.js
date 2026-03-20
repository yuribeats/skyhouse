export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { momentUri, collectionAddress, account, recipientCount, apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    const payload = {
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
    };
    const bodyStr = JSON.stringify(payload);

    const response = await fetch(
      'https://api.inprocess.world/api/moment/create',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: bodyStr,
      }
    );

    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({
        error: text,
        debug: { sentBytes: bodyStr.length, status: response.status },
      });
    }

    try {
      const result = JSON.parse(text);
      return res.status(200).json(result);
    } catch {
      return res.status(200).json({ raw: text });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
