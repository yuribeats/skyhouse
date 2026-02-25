export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, contentType, filename, apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    const buffer = Buffer.from(data, 'base64');

    const boundary = '----FormBoundary' + Date.now();
    const parts = [];
    parts.push(`--${boundary}\r\n`);
    parts.push(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`);
    parts.push(`Content-Type: ${contentType}\r\n\r\n`);
    const header = Buffer.from(parts.join(''));
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([header, buffer, footer]);

    const response = await fetch(
      'https://api.inprocess.world/api/arweave',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const uri = await response.text();
    const cleaned = uri.replace(/^"|"$/g, '');
    return res.status(200).json({ uri: cleaned });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
