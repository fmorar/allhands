/**
 * Icebreaker activity store. Tracks the activity state machine and uploaded
 * submissions. Persists in Upstash Redis when env vars are present; falls
 * back to in-memory for local dev.
 *
 * Activity flow:
 *   idle        → presenter hasn't started yet
 *   revealing   → image is on screen, participants memorise it (30s)
 *   uploading   → image hidden, participants upload their AI recreation
 */

import { Redis } from "@upstash/redis";

export type IcebreakerStatus =
  | "idle"
  | "revealing"
  | "uploading"
  | "comparing";

export type IcebreakerSubmission = {
  id: string;
  url: string;
  name?: string;
  ts: number;
};

export type IcebreakerState = {
  status: IcebreakerStatus;
  revealStartedAt: number | null;
  revealDurationMs: number;
  submissions: IcebreakerSubmission[];
  version: number;
  backend: "redis" | "memory";
};

const STATE_KEY = "allhands:icebreaker:state";
const VERSION_KEY = "allhands:icebreaker:version";
const SUBS_KEY = "allhands:icebreaker:submissions";

const DEFAULT_DURATION_MS = 30_000;

// Vercel Marketplace injects KV_REST_API_* for Upstash; the SDK's own
// naming is UPSTASH_REDIS_REST_*. Accept either.
const REDIS_URL =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
    : null;

// ─── in-memory fallback ──────────────────────────────────────────────────
type MemShape = {
  status: IcebreakerStatus;
  revealStartedAt: number | null;
  submissions: IcebreakerSubmission[];
  version: number;
};
const g = globalThis as unknown as { __icebreaker?: MemShape };
if (!g.__icebreaker) {
  g.__icebreaker = {
    status: "idle",
    revealStartedAt: null,
    submissions: [],
    version: 0,
  };
}
const mem = g.__icebreaker!;

// ─── public API ──────────────────────────────────────────────────────────

export async function getIcebreaker(): Promise<IcebreakerState> {
  let status: IcebreakerStatus;
  let revealStartedAt: number | null;
  let submissions: IcebreakerSubmission[];
  let version: number;

  if (redis) {
    const [raw, ver, subs] = await Promise.all([
      redis.get<{ status: IcebreakerStatus; revealStartedAt: number | null }>(
        STATE_KEY
      ),
      redis.get<number>(VERSION_KEY),
      // SDK auto-deserialises JSON values, so list entries come back as
      // objects (not strings). Tolerate either shape just in case.
      redis.lrange<IcebreakerSubmission | string>(SUBS_KEY, 0, -1),
    ]);
    status = raw?.status ?? "idle";
    revealStartedAt = raw?.revealStartedAt ?? null;
    version = ver ?? 0;
    submissions = (subs ?? [])
      .map((entry) =>
        typeof entry === "string"
          ? safeParse<IcebreakerSubmission>(entry)
          : (entry as IcebreakerSubmission)
      )
      .filter((x): x is IcebreakerSubmission => !!x);
  } else {
    status = mem.status;
    revealStartedAt = mem.revealStartedAt;
    submissions = [...mem.submissions];
    version = mem.version;
  }

  // Auto-advance from revealing → uploading once 30s elapsed.
  if (
    status === "revealing" &&
    revealStartedAt &&
    Date.now() - revealStartedAt >= DEFAULT_DURATION_MS
  ) {
    status = "uploading";
    if (redis) {
      await Promise.all([
        redis.set(STATE_KEY, { status, revealStartedAt }),
        redis.incr(VERSION_KEY),
      ]);
      version = (await redis.get<number>(VERSION_KEY)) ?? version + 1;
    } else {
      mem.status = "uploading";
      mem.version += 1;
      version = mem.version;
    }
  }

  return {
    status,
    revealStartedAt,
    revealDurationMs: DEFAULT_DURATION_MS,
    submissions,
    version,
    backend: redis ? "redis" : "memory",
  };
}

export async function startReveal(): Promise<IcebreakerState> {
  const now = Date.now();
  if (redis) {
    await Promise.all([
      redis.set(STATE_KEY, { status: "revealing", revealStartedAt: now }),
      redis.del(SUBS_KEY),
      redis.incr(VERSION_KEY),
    ]);
  } else {
    mem.status = "revealing";
    mem.revealStartedAt = now;
    mem.submissions = [];
    mem.version += 1;
  }
  return getIcebreaker();
}

export async function startCompare(): Promise<IcebreakerState> {
  if (redis) {
    // Preserve revealStartedAt so the original timestamp remains for analytics.
    const current = await redis.get<{
      status: IcebreakerStatus;
      revealStartedAt: number | null;
    }>(STATE_KEY);
    await Promise.all([
      redis.set(STATE_KEY, {
        status: "comparing",
        revealStartedAt: current?.revealStartedAt ?? null,
      }),
      redis.incr(VERSION_KEY),
    ]);
  } else {
    mem.status = "comparing";
    mem.version += 1;
  }
  return getIcebreaker();
}

export async function addSubmission(
  submission: IcebreakerSubmission
): Promise<IcebreakerState> {
  if (redis) {
    await Promise.all([
      redis.rpush(SUBS_KEY, JSON.stringify(submission)),
      redis.incr(VERSION_KEY),
    ]);
  } else {
    mem.submissions.push(submission);
    mem.version += 1;
  }
  return getIcebreaker();
}

export async function resetIcebreaker(): Promise<IcebreakerState> {
  if (redis) {
    await Promise.all([
      redis.set(STATE_KEY, { status: "idle", revealStartedAt: null }),
      redis.del(SUBS_KEY),
      redis.incr(VERSION_KEY),
    ]);
  } else {
    mem.status = "idle";
    mem.revealStartedAt = null;
    mem.submissions = [];
    mem.version += 1;
  }
  return getIcebreaker();
}

function safeParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}
