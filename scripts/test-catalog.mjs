// Build-time test: fails when any record carrying an affiliate link is missing
// rel="nofollow sponsored noopener" and target="_blank" in public/catalog.json.
// Run: node scripts/test-catalog.mjs   (also runs automatically on `npm run build`)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { isAffiliateUrl, REL_AFFILIATE, TARGET_AFFILIATE } from "./catalog-lib.mjs";

// Floor on how many affiliate records the detection rule must find. The count
// was 70 as of 2026-08-21. This floor is deliberately slack (60): set at the
// exact count it would false-alarm the first time a product legitimately
// retires. Raise it if the catalog grows a lot.
const MIN_AFFILIATE_RECORDS = 60;

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
      assert.equal(r.target, TARGET_AFFILIATE, `expected target="${TARGET_AFFILIATE}"`);
    } catch (e) {
      failures.push(`${label}: ${e.message} (got rel=${JSON.stringify(r.rel)}, target=${JSON.stringify(r.target)})`);
    }
  }
}

if (affiliateCount < MIN_AFFILIATE_RECORDS) {
  console.error(
    `catalog rel test FAILED: found ${affiliateCount} affiliate records, expected at least ${MIN_AFFILIATE_RECORDS}. ` +
      `The catalog may have changed, but more likely the affiliate detection rule in scripts/catalog-lib.mjs broke. ` +
      `Check AFFILIATE_PARAMS, AFFILIATE_REF_VALUES, KNOWN_AFFILIATE_PREFIXES and AFFILIATE_DISCOUNT_HOSTS before trusting this run.`
  );
  process.exit(1);
}

if (failures.length) {
  console.error(`catalog rel test FAILED (${failures.length} of ${affiliateCount} affiliate records):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `catalog rel test passed: ${affiliateCount} affiliate records carry rel="${REL_AFFILIATE}" and target="${TARGET_AFFILIATE}"`
);
