import { get, list, put } from "@vercel/blob";

export async function getData<T>(key: string): Promise<T[]> {
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length === 0) return [];
    const latest = blobs.reduce((a, b) =>
      new Date(a.uploadedAt) > new Date(b.uploadedAt) ? a : b
    );
    const res = await get(latest.url, { access: "private" });
    if (!res || res.statusCode !== 200) return [];
    return await new Response(res.stream).json();
  } catch {
    return [];
  }
}

export async function setData<T>(key: string, data: T[]) {
  await put(key, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
}
