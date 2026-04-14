import { NextRequest, NextResponse } from "next/server";
import { getData, setData } from "@/lib/blob-store";
import { put, del } from "@vercel/blob";

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
}

const KEY = "images.json";

export async function GET() {
  const images = await getData<ImageItem>(KEY);
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const alt = (formData.get("alt") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const blob = await put(`gallery/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    const images = await getData<ImageItem>(KEY);
    const item: ImageItem = {
      id: Date.now().toString(),
      url: blob.url,
      alt,
    };
    images.push(item);
    await setData(KEY, images);

    return NextResponse.json(item);
  }

  const body = await req.json();

  if (body._action === "delete") {
    const images = await getData<ImageItem>(KEY);
    const toDelete = images.find((i) => i.id === body.id);
    if (toDelete && toDelete.url.includes("vercel-storage")) {
      try { await del(toDelete.url); } catch { /* ignore */ }
    }
    const filtered = images.filter((i) => i.id !== body.id);
    await setData(KEY, filtered);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
