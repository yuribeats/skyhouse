import { list, put } from "@vercel/blob";

export async function getData<T>(key: string): Promise<T[]> {
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length === 0) return [];
    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b
    );
    const bust = new Date(latest.uploadedAt).getTime();
    const res = await fetch(`${latest.url}?t=${bust}`, { cache: "no-store" });
    return await res.json();
  } catch {
    return [];
  }
}

export async function setData<T>(key: string, data: T[]) {
  await put(key, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
}
