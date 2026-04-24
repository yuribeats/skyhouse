import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/blob-store';

export const dynamic = "force-dynamic";

export async function GET() {
  const emails = await getData<string>('feedback-emails.json');
  return NextResponse.json({ emails });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

  const emails = await getData<string>('feedback-emails.json');
  emails.unshift(email.trim());
  await setData('feedback-emails.json', emails);

  return NextResponse.json({ ok: true });
}
