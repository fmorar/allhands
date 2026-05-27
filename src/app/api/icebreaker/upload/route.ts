import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { addSubmission, getIcebreaker } from "@/lib/icebreakerStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(req: Request) {
  const state = await getIcebreaker();
  if (state.status !== "uploading") {
    return NextResponse.json(
      { error: "uploads not open yet" },
      { status: 409 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const name = (form.get("name") as string | null)?.slice(0, 60) ?? "";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `file too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 400 }
    );
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: `unsupported type: ${file.type}` },
      { status: 400 }
    );
  }

  const id = randomUUID();
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${Date.now()}-${id}.${ext}`;

  // For local dev + single-instance Vercel, /public/uploads works. For
  // multi-instance Vercel deploys, swap to Vercel Blob (@vercel/blob) and
  // upload there instead — the URL field stays the same shape.
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const url = `/uploads/${filename}`;
  const next = await addSubmission({ id, url, name, ts: Date.now() });
  return NextResponse.json(next);
}
