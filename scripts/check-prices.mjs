// Weekly price check: compares each maker product's listed price to the store's live price.
// Usage: node scripts/check-prices.mjs [--out report.md] [--stamp: mark matching prices verified today]. Exits 1 when any price changed.
import fs from 'node:fs';
const makers = JSON.parse(fs.readFileSync('src/data/makers.json', 'utf8'));
const low = (s) => { const n = String(s).match(/[0-9]+(?:\.[0-9]+)?/g); return n ? Math.min(...n.map(Number)) : null; };
const UA = { 'user-agent': 'Mozilla/5.0 (price-check; Baking Great Bread gift guide)' };
async function live(src) {
  try { // Shopify product JSON
    const r = await fetch(src.split('?')[0].replace(/\/$/, '') + '.json', { headers: UA });
    if (r.ok) {
      const c = ((await r.json()).product?.variants || []).map(v => Number(v.price)).filter(Number.isFinite);
      if (c.length) return Math.min(...c);
    }
  } catch {}
  try {
    const h = await (await fetch(src, { headers: UA })).text();
    const m = h.match(/product:price:amount"\s+content="([0-9.]+)"/) || h.match(/"(?:low)?[Pp]rice"\s*:\s*"([0-9]+\.[0-9]{2})"/);
    return m ? Number(m[1]) : null;
  } catch { return null; }
}
const changed = [], unread = [], today = new Date().toISOString().slice(0, 10);
for (const m of makers) for (const p of m.items) {
  if (!p.priceSource) continue;
  const listed = low(p.priceLabel), now = await live(p.priceSource);
  if (now == null) unread.push(`${m.brand}: ${p.name}`);
  else if (listed != null && Math.abs(now - listed) <= 0.01) { if (process.argv.includes('--stamp')) p.priceChecked = today; }
  if (now != null && listed != null && Math.abs(now - listed) > 0.01) changed.push(`${m.brand}: ${p.name}: listed $${listed.toFixed(2)}, store now $${now.toFixed(2)} (${p.priceSource})`);
}
if (process.argv.includes('--stamp')) fs.writeFileSync('src/data/makers.json', JSON.stringify(makers, null, 2) + '\n');
const date = new Date().toISOString().slice(0, 10);
const report = `# Price check ${date}\n\n## Changed (${changed.length})\n${changed.map(x => '- ' + x).join('\n') || 'None'}\n\n## Couldn't read, check by hand (${unread.length})\n${unread.map(x => '- ' + x).join('\n') || 'None'}\n`;
console.log(report);
const i = process.argv.indexOf('--out'); if (i > 0) fs.writeFileSync(process.argv[i + 1], report);
process.exit(changed.length ? 1 : 0);
