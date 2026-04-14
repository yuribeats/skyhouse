import { list, put } from "@vercel/blob";

export async function getData<T>(key: string): Promise<T[]> {
  try {
    const { blobs } = await list({ prefix: key });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url);
    return await res.json();
  } catch {
    return [];
  }
}

export async function setData<T>(key: string, data: T[]) {
  await put(key, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
  });
}
