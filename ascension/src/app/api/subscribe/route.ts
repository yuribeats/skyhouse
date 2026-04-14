import { NextRequest, NextResponse } from "next/server";
import { getData, setData } from "@/lib/blob-store";

const KEY = "subscribers.json";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const subscribers = await getData<string>(KEY);
  const normalized = email.toLowerCase().trim();

  if (subscribers.includes(normalized)) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  subscribers.push(normalized);
  await setData(KEY, subscribers);

  return NextResponse.json({ message: "Subscribed" });
}

export async function GET() {
  const subscribers = await getData<string>(KEY);
  return NextResponse.json({ subscribers, count: subscribers.length });
}
