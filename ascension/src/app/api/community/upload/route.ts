import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { data, contentType, filename, apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ error: 'API key required' }, { status: 400 });

  const buffer = Buffer.from(data, 'base64');
  const formData = new FormData();
  const blob = new Blob([buffer], { type: contentType });
  formData.append('file', blob, filename);

  const res = await fetch('https://api.inprocess.world/api/arweave', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const uri = await res.text();
  const cleaned = uri.replace(/^"|"$/g, '');
  return NextResponse.json({ uri: cleaned });
}
