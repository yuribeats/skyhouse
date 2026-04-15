import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('authorization');
  if (!apiKey) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

  const res = await fetch('https://api.inprocess.world/api/oauth', {
    headers: { 'Authorization': apiKey },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
