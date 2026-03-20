export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

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
    const formData = new FormData();
    const blob = new Blob([buffer], { type: contentType });
    formData.append('file', blob, filename);

    const response = await fetch(
      'https://api.inprocess.world/api/arweave',
      {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
        },
        body: formData,
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
