/**
 * Mood store with two backends:
 *
 *   1. Upstash Redis — when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 *      are present (auto-injected by the Vercel Marketplace integration).
 *      Persistent + shared across all serverless instances.
 *
 *   2. In-memory Map fallback — for local dev when no Redis env vars exist.
 *      Survives between requests on the same Node process; lost on restart.
 *
 * The public API (getMood / voteMood / resetMood) is identical either way so
 * the API route + slide don't care which backend is active.
 */

import { Redis } from "@upstash/redis";

export const MOODS = [
  { id: "sad", emoji: "😢", label: "Triste" },
  { id: "meh", emoji: "😐", label: "Neutral" },
  { id: "ok", emoji: "🙂", label: "Bien" },
  { id: "great", emoji: "😄", label: "Genial" },
  { id: "love", emoji: "🤩", label: "Increíble" },
] as const;

export type MoodId = (typeof MOODS)[number]["id"];

const VALID_IDS = new Set<string>(MOODS.map((m) => m.id));

const HASH_KEY = "allhands:mood:counts";
const VERSION_KEY = "allhands:mood:version";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// ─────────────────────────── in-memory fallback ───────────────────────────
type StoreShape = { counts: Record<MoodId, number>; version: number };
const g = globalThis as unknown as { __moodStore?: StoreShape };
if (!g.__moodStore) {
  g.__moodStore = {
    counts: { sad: 0, meh: 0, ok: 0, great: 0, love: 0 },
    version: 0,
  };
}
const mem = g.__moodStore!;

// ─────────────────────────────── public API ───────────────────────────────

export async function getMood(): Promise<{
  counts: Record<MoodId, number>;
  total: number;
  version: number;
  backend: "redis" | "memory";
}> {
  if (redis) {
    const [raw, version] = await Promise.all([
      redis.hgetall<Record<string, string | number>>(HASH_KEY),
      redis.get<number>(VERSION_KEY),
    ]);
    const counts: Record<MoodId, number> = {
      sad: num(raw?.sad),
      meh: num(raw?.meh),
      ok: num(raw?.ok),
      great: num(raw?.great),
      love: num(raw?.love),
    };
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return { counts, total, version: version ?? 0, backend: "redis" };
  }

  const total = Object.values(mem.counts).reduce((a, b) => a + b, 0);
  return {
    counts: { ...mem.counts },
    total,
    version: mem.version,
    backend: "memory",
  };
}

export async function voteMood(id: string): Promise<boolean> {
  if (!VALID_IDS.has(id)) return false;
  if (redis) {
    await Promise.all([
      redis.hincrby(HASH_KEY, id, 1),
      redis.incr(VERSION_KEY),
    ]);
    return true;
  }
  mem.counts[id as MoodId] += 1;
  mem.version += 1;
  return true;
}

export async function resetMood(): Promise<void> {
  if (redis) {
    await redis.del(HASH_KEY);
    await redis.incr(VERSION_KEY);
    return;
  }
  for (const m of MOODS) mem.counts[m.id] = 0;
  mem.version += 1;
}

function num(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}
