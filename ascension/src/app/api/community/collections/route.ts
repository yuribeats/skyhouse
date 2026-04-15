import { NextRequest, NextResponse } from 'next/server';

const walletCache = new Map<string, string>();

export async function GET(req: NextRequest) {
  const username = (req.nextUrl.searchParams.get('username') || '').toLowerCase();
  const wallet = (req.nextUrl.searchParams.get('wallet') || '').toLowerCase();

  if (!username && !wallet) {
    return NextResponse.json({ error: 'Username or wallet required' }, { status: 400 });
  }

  try {
    let artistWallet = wallet || walletCache.get(username) || '';

    if (!artistWallet && username) {
      const first = await fetch('https://api.inprocess.world/api/collections?page=1&limit=100');
      const firstData = await first.json();
      const totalPages = firstData.pagination?.total_pages || 1;

      const allCols = [...(firstData.collections || [])];

      if (totalPages > 1) {
        const fetches = [];
        for (let p = 2; p <= totalPages; p++) {
          fetches.push(
            fetch(`https://api.inprocess.world/api/collections?page=${p}&limit=100`)
              .then((r) => r.json())
          );
        }
        const results = await Promise.all(fetches);
        for (const r of results) {
          allCols.push(...(r.collections || []));
        }
      }

      let partialMatch = '';
      for (const c of allCols) {
        const u = (c.creator?.username || '').toLowerCase();
        const addr = c.creator?.address;
        if (u && addr) {
          walletCache.set(u, addr);
        }
        if (u === username) {
          artistWallet = addr;
        } else if (!partialMatch && (u.startsWith(username) || username.startsWith(u))) {
          partialMatch = addr;
        }
      }
      if (!artistWallet && partialMatch) {
        artistWallet = partialMatch;
      }
    }

    if (!artistWallet) {
      return NextResponse.json({ collections: [] });
    }

    const res = await fetch(
      `https://api.inprocess.world/api/collections?artist=${artistWallet}`
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }

    const data = await res.json();
    data.wallet = artistWallet;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
