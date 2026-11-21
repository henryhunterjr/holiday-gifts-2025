import { existsSync, cpSync, readdirSync, statSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "site/out";
const DIST = "dist";
const COPY = ["gifts", "_next"];
const EXPECTED_ROUTES = 17; // /gifts plus 15 band/category/audience facets plus the under-50 price cap

function fail(msg) {
  console.error(`merge-site: ${msg}`);
  process.exit(1);
}

if (!existsSync(OUT)) fail(`${OUT} not found. Did the Next build run?`);
if (!existsSync(DIST)) fail(`${DIST} not found. Did the Vite build run?`);

// /gifts must contain index.html plus one directory per facet.
const giftsDir = join(OUT, "gifts");
if (!existsSync(join(giftsDir, "index.html"))) fail("site/out/gifts/index.html missing");
const facetDirs = readdirSync(giftsDir).filter((n) =>
  statSync(join(giftsDir, n)).isDirectory()
);
const routeCount = facetDirs.length + 1;
if (routeCount !== EXPECTED_ROUTES) {
  fail(`expected ${EXPECTED_ROUTES} routes, found ${routeCount}: ${facetDirs.join(", ")}`);
}

// Nothing we copy may overwrite a file the Vite build already produced.
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const collisions = [];
for (const top of COPY) {
  const src = join(OUT, top);
  if (!existsSync(src)) fail(`${src} missing`);
  for (const f of walk(src)) {
    const rel = relative(OUT, f);
    if (existsSync(join(DIST, rel))) collisions.push(rel);
  }
}
if (collisions.length) {
  fail(`would overwrite existing dist files:\n  ${collisions.join("\n  ")}`);
}

for (const top of COPY) {
  cpSync(join(OUT, top), join(DIST, top), { recursive: true });
}

// Ship actual HTML entries for the printed-book URL and the Baker's Toolbox.
// Vercel's trailingSlash and merged Next static output must not depend on the
// SPA fallback rewrite. Both paths also live on bakinggreatbread.com through a
// same-path reverse-proxy rewrite, so every root-relative file the page loads
// must point back at this origin or it breaks there.
// Each page also carries a plain-HTML copy of its content inside #root. React
// replaces it on load; crawlers and AI readers that don't run JavaScript get the
// chapters and tools as real text.
const ORIGIN = "https://gifts.bakinggreatbread.com";
const companionHero = "https://bakinggreatbread.blog/wp-content/uploads/2026/11/sourdough-for-the-rest-of-us-companion-hero.png";
const companionUrl = "https://bakinggreatbread.com/sourdough-for-the-rest-of-us/";
const toolsUrl = "https://bakinggreatbread.com/sourdough-for-the-rest-of-us/tools/";
const aboutHenry = "https://skoo.ly/about-henry";
const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const chapterSrc = readFileSync("src/data/bookCompanionChapters.ts", "utf8");
const chapters = [...chapterSrc.matchAll(/\{key:"(\d+)",name:"([^"]+)",page:(\d+),desc:"([^"]+)"/g)]
  .map(([, key, name, page, desc]) => ({ key, name, page, desc }));
if (chapters.length !== 24) fail(`expected 24 book chapters, parsed ${chapters.length}`);
const tools = JSON.parse(readFileSync("src/data/bakersToolbox.json", "utf8"));
const liveTool = (t) => t.status !== "retired" && t.url;

const person = { "@type": "Person", "@id": `${aboutHenry}#person`, name: "Henry Hunter", url: aboutHenry };

function companionPage({ title, description, url, body, schema }) {
  const shell = readFileSync(join(DIST, "index.html"), "utf8");
  return shell
    .replaceAll('src="/assets/', `src="${ORIGIN}/assets/`)
    .replaceAll('href="/assets/', `href="${ORIGIN}/assets/`)
    .replaceAll('src="/guide-tools.js"', `src="${ORIGIN}/guide-tools.js"`)
    .replaceAll('href="/favicon.png"', `href="${ORIGIN}/favicon.png"`)
    .replace(/<title>[^<]*<[/]title>/i, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${esc(description)}">\n    <link rel="canonical" href="${url}">\n    <script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`)
    .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(title)}">`)
    .replace(/<meta property="og:description"[^>]*>/i, `<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${companionHero}">`)
    .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${url}">`)
    .replace(/<meta name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${companionHero}">`)
    .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(title)}">`)
    .replace(/<meta name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${esc(description)}">`)
    .replace(/<meta name="author"[^>]*>/i, '<meta name="author" content="Henry Hunter">')
    .replace('<div id="root"></div>', `<div id="root"><main style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:Karla,system-ui,sans-serif;color:#33251b;background:#faf4e9">${body}</main></div>`);
}

const toolItem = (t) => `<li><a href="${esc(t.url)}">${esc(t.name)}</a>: ${esc(t.what)}${t.chapters?.length ? ` (${t.chapters.includes("all") ? "every chapter" : "Chapter " + t.chapters.join(", ")})` : ""}</li>`;

const companionTitle = "Sourdough for the Rest of Us: Book Companion, All 24 Chapters | Henry Hunter";
const companionDescription = "The official companion to Henry Hunter's Sourdough for the Rest of Us, 2nd Edition: videos, Bread Authority lessons, glossary terms and tools for all 24 chapters.";
const companionDir = join(DIST, "sourdough-for-the-rest-of-us");
mkdirSync(companionDir, { recursive: true });
writeFileSync(join(companionDir, "index.html"), companionPage({
  title: companionTitle,
  description: companionDescription,
  url: companionUrl,
  schema: { "@context": "https://schema.org", "@graph": [person,
    { "@type": "Book", "@id": `${companionUrl}#book`, name: "Sourdough for the Rest of Us", bookEdition: "Second Edition, revised and expanded", author: { "@id": `${aboutHenry}#person` }, inLanguage: "en", image: companionHero },
    { "@type": "WebPage", "@id": companionUrl, url: companionUrl, name: "Sourdough for the Rest of Us: Official Book Companion", about: { "@id": `${companionUrl}#book` }, author: { "@id": `${aboutHenry}#person` } }] },
  body: `<p>Henry Hunter · The official digital companion</p><h1>Sourdough for the Rest of Us</h1><p>Perfection Not Required. The book is in your hands. Here you can watch the techniques, understand the language, and find the tools behind every chapter.</p>`
    + `<nav><a href="${companionUrl}?view=lessons">Chapters</a> · <a href="https://bakinggreatbread.com/bread-authority">Techniques &amp; Videos</a> · <a href="${companionUrl}?view=glossary">Bread Glossary</a> · <a href="${companionUrl}?view=equipment">Equipment</a> · <a href="${toolsUrl}">Baker's Toolbox</a> · <a href="${aboutHenry}">About Henry</a></nav>`
    + `<h2>All 24 chapters</h2><ol>${chapters.map(c => `<li><a href="${companionUrl}?view=lessons&amp;chapter=${c.key}">Chapter ${c.key}: ${esc(c.name)}</a> (print page ${c.page}). ${esc(c.desc)}</li>`).join("")}</ol>`
    + `<h2>Henry's Baker's Toolbox</h2><ul>${tools.toolbox.filter(liveTool).map(toolItem).join("")}</ul>`
    + `<p>Created by <a href="${aboutHenry}">Henry Hunter</a>, founder of Baking Great Bread at Home and Crust &amp; Crumb Academy.</p>`,
}));

const toolsTitle = "Henry's Baker's Toolbox: Sourdough Calculators, Planners and Guides | Henry Hunter";
const toolsDescription = "The baking tools Henry Hunter built for home bakers: a sourdough and yeast recipe converter, fermentation planner, starter and levain calculator, salt converter, bread glossary and more, matched to the chapters of Sourdough for the Rest of Us.";
const toolsDir = join(companionDir, "tools");
mkdirSync(toolsDir, { recursive: true });
const live = tools.toolbox.filter(liveTool);
writeFileSync(join(toolsDir, "index.html"), companionPage({
  title: toolsTitle,
  description: toolsDescription,
  url: toolsUrl,
  schema: { "@context": "https://schema.org", "@graph": [person,
    { "@type": "CollectionPage", "@id": toolsUrl, url: toolsUrl, name: "Henry's Baker's Toolbox", description: toolsDescription, author: { "@id": `${aboutHenry}#person` },
      isPartOf: { "@type": "WebPage", "@id": companionUrl, url: companionUrl },
      mainEntity: { "@type": "ItemList", itemListElement: live.map((t, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "WebApplication", name: t.name, url: t.url, description: t.what, applicationCategory: "Food & Drink", operatingSystem: "Web browser", creator: { "@id": `${aboutHenry}#person` } } })) } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Sourdough for the Rest of Us companion", item: companionUrl }, { "@type": "ListItem", position: 2, name: "Baker's Toolbox", item: toolsUrl }] }] },
  body: `<p><a href="${companionUrl}">Book companion</a> / Baker's Toolbox</p><h1>Henry's Baker's Toolbox</h1><p>Tools I built to help you bake better bread.</p>`
    + `<h2>Tools that go with the book</h2><ul>${live.map(toolItem).join("")}</ul>`
    + `<h2>Henry's Workshop</h2><ul>${tools.workshop.filter(liveTool).map(toolItem).join("")}</ul>`
    + `<h2>From the archive</h2><ul>${tools.workshop.filter(t => t.status === "retired").map(t => `<li>${esc(t.name)} (retired${t.retired ? " " + esc(t.retired) : ""}): ${esc(t.what)}</li>`).join("")}</ul>`
    + `<p>Created by <a href="${aboutHenry}">Henry Hunter</a>.</p>`,
}));

console.log(
  `merge-site: wrote /sourdough-for-the-rest-of-us/ and /sourdough-for-the-rest-of-us/tools/`
);

console.log(
  `merge-site: copied ${COPY.join(", ")} into dist/; ` +
    `${routeCount} routes; dist/index.html untouched (SPA preserved)`
);
