import { NextResponse } from "next/server";
import { getMood, voteMood, resetMood } from "@/lib/moodStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getMood();
  return NextResponse.json(state, {
    headers: { "cache-control": "no-store" },
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id = typeof body?.id === "string" ? body.id : "";
  if (id === "__reset__") {
    await resetMood();
    return NextResponse.json(await getMood());
  }
  const ok = await voteMood(id);
  if (!ok) {
    return NextResponse.json({ error: "invalid mood id" }, { status: 400 });
  }
  return NextResponse.json(await getMood());
}
