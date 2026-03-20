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

    const tests = [
      { name: 'no_salesConfig', payload: {
        contract: { address: '0x0000000000000000000000000000000000000001' },
        token: { tokenMetadataURI: 'ar://test123', createReferral: '0x0000000000000000000000000000000000000000', mintToCreatorCount: 2 },
        account: '0x0000000000000000000000000000000000000001',
      }},
      { name: 'numbers_not_strings', payload: {
        contract: { address: '0x0000000000000000000000000000000000000001' },
        token: { tokenMetadataURI: 'ar://test123', createReferral: '0x0000000000000000000000000000000000000000', salesConfig: { type: 'fixedPrice', pricePerToken: 0, saleStart: 0, saleEnd: 9999999999 }, mintToCreatorCount: 2 },
        account: '0x0000000000000000000000000000000000000001',
      }},
      { name: 'all_strings', payload: {
        contract: { address: '0x0000000000000000000000000000000000000001' },
        token: { tokenMetadataURI: 'ar://test123', createReferral: '0x0000000000000000000000000000000000000000', salesConfig: { type: 'fixedPrice', pricePerToken: '0', saleStart: '0', saleEnd: '9999999999' }, mintToCreatorCount: '2' },
        account: '0x0000000000000000000000000000000000000001',
      }},
      { name: 'no_salesConfig_no_referral', payload: {
        contract: { address: '0x0000000000000000000000000000000000000001' },
        token: { tokenMetadataURI: 'ar://test123', mintToCreatorCount: 2 },
        account: '0x0000000000000000000000000000000000000001',
      }},
    ];

    const results = [];
    for (const t of tests) {
      const bodyStr = JSON.stringify(t.payload);
      const r = await postJSON('https://api.inprocess.world/api/moment/create', { 'x-api-key': apiKey }, bodyStr);
      results.push({ name: t.name, status: r.status, response: r.body });
    }

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
