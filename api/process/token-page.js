const RPC = 'https://base-mainnet.public.blastapi.io';

export default async function handler(req, res) {
  const { address, id } = req.query;
  if (!address || !id) {
    return res.redirect('/process');
  }

  let title = 'TOKEN ' + id;
  let description = '';
  let imageUrl = '';

  try {
    const tokenIdHex = parseInt(id).toString(16).padStart(64, '0');
    const rpcRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'eth_call',
        params: [{ to: address, data: '0x0e89341c' + tokenIdHex }, 'latest'],
      }),
    });
    const rpcData = await rpcRes.json();
    const hex = rpcData.result;
    if (hex && hex.length > 2) {
      const h = hex.slice(2);
      const len = parseInt(h.slice(64, 128), 16);
      const uriHex = h.slice(128, 128 + len * 2);
      const uri = Buffer.from(uriHex, 'hex').toString();
      const arHash = uri.replace('ar://', '');
      const metaRes = await fetch('https://ar-io.net/' + arHash);
      const meta = await metaRes.json();
      title = meta.name || title;
      description = meta.description || '';
      if (meta.image) {
        imageUrl = meta.image.replace('ar://', 'https://ar-io.net/');
      }
    }
  } catch (e) {}

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)} - ASCENSION PORTAL</title>
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(imageUrl)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(imageUrl)}">
<script>
  if (!/bot|crawl|spider|preview|slack|discord|telegram|facebook|twitter|whatsapp/i.test(navigator.userAgent)) {
    window.__TOKEN_DATA = ${JSON.stringify({ address, id, title, description, imageUrl })};
  }
</script>
<style>
* { margin:0; padding:0; box-sizing:border-box; font-family:'Courier New',monospace; font-weight:700; text-transform:uppercase; }
body { background:#0000AA; color:#fff; min-height:100vh; padding:40px 20px; }
.c { max-width:600px; margin:0 auto; }
img { width:100%; display:block; border:2px solid #5555FF; }
h1 { font-size:20px; margin:20px 0 8px; }
.id { font-size:12px; margin-bottom:20px; }
.desc { font-size:13px; line-height:1.6; margin-bottom:20px; white-space:pre-wrap; }
a { color:#fff; border:2px solid #fff; padding:14px 32px; font-size:14px; font-family:'Courier New',monospace; font-weight:900; text-transform:uppercase; letter-spacing:2px; text-decoration:none; display:inline-block; margin-top:20px; }
</style>
</head>
<body>
<div class="c">
${imageUrl ? '<img src="' + esc(imageUrl) + '">' : ''}
<h1>${esc(title)}</h1>
<div class="id">TOKEN ${esc(id)}</div>
<div class="desc">${esc(description)}</div>
<a href="/process">ASCENSION PORTAL</a>
</div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, s-maxage=300');
  return res.send(html);
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
