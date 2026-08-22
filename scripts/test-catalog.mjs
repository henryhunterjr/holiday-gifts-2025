// Build-time test: fails when any record carrying an affiliate link is missing
// rel="nofollow sponsored noopener" in public/catalog.json.
// Run: node scripts/test-catalog.mjs   (also runs automatically on `npm run build`)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { isAffiliateUrl, REL_AFFILIATE } from "./catalog-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "public", "catalog.json"), "utf8"));

const ARRAYS = ["products", "krustic", "amazon", "books", "free_resources"];

const failures = [];
let affiliateCount = 0;

for (const key of ARRAYS) {
  const rows = catalog[key] || [];
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const label = `${key}[${i}] ${r.name || r.slug || "(no name)"}`;
    if (!isAffiliateUrl(r.url)) continue;
    affiliateCount++;
    try {
      assert.equal(r.rel, REL_AFFILIATE, `expected rel="${REL_AFFILIATE}"`);
    } catch (e) {
      failures.push(`${label}: ${e.message} (got ${JSON.stringify(r.rel)})`);
    }
  }
}

if (failures.length) {
  console.error(`catalog rel test FAILED (${failures.length} of ${affiliateCount} affiliate records):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(`catalog rel test passed: ${affiliateCount} affiliate records carry rel="${REL_AFFILIATE}"`);
