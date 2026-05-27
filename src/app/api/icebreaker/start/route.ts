import { NextResponse } from "next/server";
import { startReveal } from "@/lib/icebreakerStore";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await startReveal();
  return NextResponse.json(state);
}
