import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getData<T>(key: string): Promise<T[]> {
  const data = await redis.get<T[]>(key);
  return Array.isArray(data) ? data : [];
}

export async function setData<T>(key: string, data: T[]) {
  await redis.set(key, data);
}
