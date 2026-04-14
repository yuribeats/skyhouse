import { NextRequest, NextResponse } from "next/server";

const FORREST_ADDR = "0x081bc58a9538b1313e93f6bbc6119ac6434fbe05";
const ARWEAVE_GW = "https://arweave.net";

function resolveUri(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ar://")) return `${ARWEAVE_GW}/${uri.slice(5)}`;
  if (uri.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${uri.slice(7)}`;
  return uri;
}

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";

  const res = await fetch(
    `https://api.inprocess.world/api/timeline?artist=${FORREST_ADDR}&limit=${limit}&page=${page}`
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const data = await res.json();
  const moments = (data.moments || []).map(
    (m: {
      token_id: string;
      address: string;
      created_at: string;
      metadata?: {
        name?: string;
        description?: string;
        image?: string;
        content?: { uri?: string; mime?: string };
      };
    }) => ({
      tokenId: m.token_id,
      collection: m.address,
      createdAt: m.created_at,
      name: m.metadata?.name || "",
      description: m.metadata?.description || "",
      image: resolveUri(m.metadata?.image || ""),
      contentUri: resolveUri(m.metadata?.content?.uri || ""),
      contentMime: m.metadata?.content?.mime || "",
      inprocessUrl: `https://www.inprocess.world/${m.address}/${m.token_id}`,
    })
  );

  return NextResponse.json({
    moments,
    pagination: data.pagination,
  });
}
