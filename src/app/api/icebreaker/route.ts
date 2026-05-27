import { NextResponse } from "next/server";
import { getIcebreaker, resetIcebreaker } from "@/lib/icebreakerStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = await getIcebreaker();
  return NextResponse.json(state, {
    headers: { "cache-control": "no-store" },
  });
}

// POST /api/icebreaker with body { action: "reset" } resets the activity.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "reset") {
    return NextResponse.json(await resetIcebreaker());
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
