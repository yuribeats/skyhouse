import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

const BLOB_KEY = "subscribers.json";

async function getSubscribers(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

async function saveSubscribers(emails: string[]) {
  await put(BLOB_KEY, JSON.stringify(emails), {
    access: "public",
    addRandomSuffix: false,
  });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const subscribers = await getSubscribers();
  const normalized = email.toLowerCase().trim();

  if (subscribers.includes(normalized)) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  subscribers.push(normalized);
  await saveSubscribers(subscribers);

  return NextResponse.json({ message: "Subscribed" });
}

export async function GET() {
  const subscribers = await getSubscribers();
  return NextResponse.json({ subscribers, count: subscribers.length });
}
