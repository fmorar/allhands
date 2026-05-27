import { NextResponse } from "next/server";
import { startCompare } from "@/lib/icebreakerStore";

export const dynamic = "force-dynamic";

export async function POST() {
  const state = await startCompare();
  return NextResponse.json(state);
}
