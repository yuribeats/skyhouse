import https from 'https';

export const config = { maxDuration: 60 };

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
  try {
    const apiKey = req.query.key || 'fake';
    const base = {
      contract: { address: '0x0000000000000000000000000000000000000001' },
      account: '0x0000000000000000000000000000000000000001',
    };
    const baseToken = {
      tokenMetadataURI: 'ar://test123',
      createReferral: '0x0000000000000000000000000000000000000000',
      mintToCreatorCount: 2,
    };

    const tests = [
      { name: 'correct_format_saleEnd_9999999999', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '9999999999' } },
      { name: 'saleEnd_0', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '0' } },
      { name: 'saleEnd_empty', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '' } },
      { name: 'saleEnd_max_safe', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '9007199254740991' } },
      { name: 'saleEnd_uint64_max', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '18446744073709551615' } },
      { name: 'type_allowlist', salesConfig: { type: 'allowlist', pricePerToken: '0', saleStart: '0', saleEnd: '9999999999' } },
    ];

    const results = [];
    for (const t of tests) {
      const payload = { ...base, token: { ...baseToken, salesConfig: t.salesConfig } };
      const bodyStr = JSON.stringify(payload);
      const r = await postJSON('https://api.inprocess.world/api/moment/create', { 'x-api-key': apiKey }, bodyStr);
      results.push({ name: t.name, status: r.status, response: r.body });
    }

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
