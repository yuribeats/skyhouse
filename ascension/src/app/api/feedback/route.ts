import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/blob-store';

export const dynamic = "force-dynamic";

interface FeedbackEntry {
  id: string;
  timestamp: number;
  [key: string]: unknown;
}

export async function GET() {
  const feedback = await getData<FeedbackEntry>('feedback-responses.json');
  return NextResponse.json({ feedback });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry: FeedbackEntry = {
    ...body,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  const feedback = await getData<FeedbackEntry>('feedback-responses.json');
  feedback.unshift(entry);
  await setData('feedback-responses.json', feedback);

  return NextResponse.json({ ok: true });
}
