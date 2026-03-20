import https from 'https';

export const config = {
  maxDuration: 60,
};

function postJSON(url, headers, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => resolve({ status: response.statusCode, body: data }));
    });
    request.on('error', reject);
    request.write(body);
    request.end();
  });
}

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

    const response = await postJSON(
      'https://api.inprocess.world/api/moment/create',
      { 'x-api-key': apiKey },
      bodyStr
    );

    if (response.status < 200 || response.status >= 300) {
      return res.status(response.status).json({ error: response.body });
    }

    try {
      const result = JSON.parse(response.body);
      return res.status(200).json(result);
    } catch {
      return res.status(200).json({ raw: response.body });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
