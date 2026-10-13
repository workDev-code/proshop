#!/usr/bin/env node
/**
 * Convenience wrapper around POST /api/seed.
 *
 *   node scripts/seed.js            # idempotent
 *   node scripts/seed.js --fresh    # wipe + reinsert
 *
 * Reads BACKEND_URL (default http://localhost:5000) and
 * SEED_KEY (default proshop-seed-2026) from the environment.
 * Falls back to requiring the backend to be running locally.
 */

import process from 'node:process';

const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
const seedKey = process.env.SEED_KEY || 'proshop-seed-2026';
const fresh = process.argv.includes('--fresh');

const url = `${baseUrl}/api/seed${fresh ? '?fresh=true' : ''}`;

console.log(`→ POST ${url}`);

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'X-Seed-Key': seedKey },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`✗ Seed failed: HTTP ${res.status}`);
    console.error(body);
    process.exit(1);
  }
  console.log('✓ Seed complete');
  console.log(JSON.stringify(body, null, 2));
} catch (err) {
  console.error('✗ Could not reach the backend.');
  console.error(`  Is it running at ${baseUrl}?`);
  console.error(`  Set BACKEND_URL=https://your-api.com to seed a deployed instance.`);
  process.exit(1);
}
