import { NextRequest, NextResponse } from "next/server";
import { getData, setData } from "@/lib/blob-store";

export const dynamic = "force-dynamic";

export interface ShopItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  ctaLabel: string;
  ctaUrl: string;
  featured: boolean;
}

const KEY = "shop.json";

export async function GET() {
  const items = await getData<ShopItem>(KEY);
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items = await getData<ShopItem>(KEY);

  if (body._action === "delete") {
    const filtered = items.filter((i) => i.id !== body.id);
    await setData(KEY, filtered);
    return NextResponse.json({ ok: true });
  }

  if (body.id) {
    const idx = items.findIndex((i) => i.id === body.id);
    if (idx >= 0) items[idx] = body;
    else items.push(body);
  } else {
    body.id = Date.now().toString();
    items.push(body);
  }

  await setData(KEY, items);
  return NextResponse.json(body);
}
