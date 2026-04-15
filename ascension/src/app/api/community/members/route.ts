import { NextRequest, NextResponse } from 'next/server';
import { getData, setData } from '@/lib/blob-store';

interface CommunityMember {
  wallet: string;
  username: string;
  joinedAt: string;
}

export async function GET() {
  const members = await getData<CommunityMember>('community-members.json');
  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const { wallet, username } = await req.json();
  if (!wallet) return NextResponse.json({ error: 'Wallet required' }, { status: 400 });

  const members = await getData<CommunityMember>('community-members.json');
  const exists = members.some(
    (m) => m.wallet.toLowerCase() === wallet.toLowerCase()
  );

  if (!exists) {
    members.push({
      wallet: wallet.toLowerCase(),
      username: username || '',
      joinedAt: new Date().toISOString(),
    });
    await setData('community-members.json', members);
  }

  return NextResponse.json({ ok: true });
}
