// Waits until the database in DATABASE_URL_UNPOOLED accepts connections, and
// explains why when it doesn't. Used by CI before `prisma migrate deploy`:
// Prisma only reports P1001 "Can't reach database server", while pg gives the
// real cause (DNS, IPv6, timeout, TLS, auth, Neon errors). Never prints secrets.
//
//   node scripts/wait-for-db.mjs            (reads DATABASE_URL_UNPOOLED)
import { lookup } from "node:dns/promises";
import pg from "pg";

const ATTEMPTS = 5;
const CONNECT_TIMEOUT_MS = 30_000;

const raw = process.env.DATABASE_URL_UNPOOLED?.trim();
if (!raw) {
  console.error("DATABASE_URL_UNPOOLED is not set.");
  process.exit(1);
}

let url;
try {
  url = new URL(raw);
} catch {
  console.error(
    "DATABASE_URL_UNPOOLED is not a valid URL. Paste only the postgresql://… connection string (no quotes, no `psql`).",
  );
  process.exit(1);
}

console.log(`Host: ${url.hostname}:${url.port || 5432} · database: ${url.pathname.slice(1)}`);
console.log(`Parameters: ${[...url.searchParams.keys()].join(", ") || "(none)"}`);
try {
  const addresses = await lookup(url.hostname, { all: true });
  console.log(`DNS: ${addresses.map((a) => `IPv${a.family} ${a.address}`).join(", ")}`);
} catch (error) {
  console.error(`DNS lookup failed: ${error.code}. Is the Neon branch/endpoint deleted?`);
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const started = Date.now();
  const client = new pg.Client({
    connectionString: raw,
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  });
  try {
    await client.connect();
    await client.query("select 1");
    console.log(`Database reachable in ${Date.now() - started} ms (attempt ${attempt}).`);
    await client.end();
    process.exit(0);
  } catch (error) {
    const details = [error.code, error.message].filter(Boolean).join(" ");
    console.error(
      `Attempt ${attempt}/${ATTEMPTS} failed after ${Date.now() - started} ms: ${details}`,
    );
    await client.end().catch(() => {});
    // Wrong credentials won't fix themselves: stop retrying.
    if (error.code === "28P01" || error.code === "28000" || error.code === "3D000") {
      console.error("The credentials or database name in the secret are wrong for this branch.");
      process.exit(1);
    }
    if (attempt < ATTEMPTS) await sleep(attempt * 5_000);
  }
}
process.exit(1);
