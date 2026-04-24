import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { name, uri, account, apiKey } = await req.json();
  if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 400 });
  if (!name || !uri || !account) {
    return NextResponse.json({ error: "name, uri, account required" }, { status: 400 });
  }

  const res = await fetch("https://api.inprocess.world/api/collections", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account, name, uri }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text, upstreamStatus: res.status }, { status: res.status });
  }
  try {
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ ok: true });
  }
}
