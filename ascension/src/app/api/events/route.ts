import { NextRequest, NextResponse } from "next/server";
import { getData, setData } from "@/lib/blob-store";

export interface EventItem {
  id: string;
  date: string;
  city: string;
  venue: string;
  country: string;
  status: "available" | "sold-out" | "announced";
  ticketUrl: string;
}

const KEY = "events.json";

export async function GET() {
  const events = await getData<EventItem>(KEY);
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const events = await getData<EventItem>(KEY);

  if (body._action === "delete") {
    const filtered = events.filter((e) => e.id !== body.id);
    await setData(KEY, filtered);
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    const idx = events.findIndex((e) => e.id === body.id);
    if (idx >= 0) events[idx] = body;
    else events.push(body);
  } else {
    body.id = Date.now().toString();
    events.push(body);
  }

  await setData(KEY, events);
  return NextResponse.json(body);
}
