import { NextRequest, NextResponse } from "next/server";
import { getData, setData } from "@/lib/blob-store";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  organization: string;
  eventType: string;
  message: string;
  date: string;
}

const KEY = "contacts.json";

export async function GET() {
  const contacts = await getData<ContactInquiry>(KEY);
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body._action === "delete") {
    const contacts = await getData<ContactInquiry>(KEY);
    const filtered = contacts.filter((c) => c.id !== body.id);
    await setData(KEY, filtered);
    return NextResponse.json({ ok: true });
  }

  const contacts = await getData<ContactInquiry>(KEY);
  const inquiry: ContactInquiry = {
    id: Date.now().toString(),
    name: body.name,
    email: body.email,
    organization: body.organization || "",
    eventType: body.eventType || "",
    message: body.message || "",
    date: new Date().toISOString(),
  };
  contacts.push(inquiry);
  await setData(KEY, contacts);

  return NextResponse.json({ ok: true });
}
