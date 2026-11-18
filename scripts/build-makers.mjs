import fs from 'node:fs';
import {loadEnv} from 'vite';
import {BASE_URL} from '../site/lib/site.mjs';
const origin=new URL(BASE_URL).origin;
const makers=JSON.parse(fs.readFileSync('src/data/makers.json','utf8'));
const e=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const offers={
 'wire-monkey':['https://wiremonkey.com/discount/C1Z5YP7FNQ03?rfsn=6816936.edb8683','Activate Henry’s storewide 10% discount'],
 'brod-and-taylor':['https://brodandtaylor.com?dt_id=330823','Shop with Henry’s Brød & Taylor link'],
 'sour-house':['https://sourhouse.co?ref=BAKINGGREATBREAD','Use HBK26 for 10% off eligible items. Check holiday offer terms.'],
 'holland-bowl':['https://hollandbowlmill.com/baking/?wpam_id=10','Use Henry for 15% off your first order. One use per customer.'],
 'nutrimill':['https://nutrimill.com/Academy26','Shop with Henry’s NutriMill link. ACADEMY26 takes $20 off the Classic.'],
 'grand-teton':['https://www.ancientgrains.com/?a_aid=henryhunter','Use crustandcrumb for 10% off your first order.'],
 'modkitchn':['https://modkitchn.com/BAKINGGREATBREAD','Activate 10% off with BAKINGGREATBREAD']
};
for(const m of makers){
 const cards=m.items.map(p=>`<article id="${e(p.slug)}" data-product="${m.id}:${p.slug}" data-brand="${e(m.brand)}">
 ${p.img?`<img class="product-photo" src="${p.img}" alt="${e(p.name)}" width="800" height="800" loading="lazy">`:'<div class="photo-pending">Product photo coming soon</div>'}
 <h2>${e(p.name)}</h2><p class="price">${e(p.priceLabel)}</p><small>USD · Price checked ${e(p.priceChecked)}</small>
 ${p.availability==='Coming soon'?'<p class="stock-note">Coming soon, according to the latest product update.</p>':''}
 <p class="description">${e(p.desc)}</p><details><summary>Sizes & price details</summary><p>${e(p.priceDetails)}</p></details>
 <div class="card-actions"><button data-save="${m.id}:${p.slug}" aria-pressed="false">Save gift</button><a data-event="partner_click" href="${e(p.url)}" target="_blank" rel="sponsored noopener noreferrer">Shop at ${e(m.brand)} ↗</a></div></article>`).join('');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(m.title)} by ${e(m.brand)} | Henry’s Gift Guide</title><meta name="description" content="Compare ${m.items.length} ${e(m.brand)} gifts, prices and sizes. Save your favorites in Henry Hunter’s holiday shopping guide."><link rel="canonical" href="${origin}/makers/${m.id}/"><link rel="stylesheet" href="/maker-catalog.css"><script src="/guide-tools.js" defer></script></head><body>
 <nav class="catalog-nav"><a href="/">← Holiday Shopping Guide</a><a href="/saved-gifts/">Saved gifts <span data-saved-count>0</span></a></nav>
 <main><header class="catalog-header"><div>${m.logo?`<img class="maker-logo" src="${m.logo}" alt="${e(m.brand)} logo">`:`<p class="maker-wordmark">${e(m.brand)}</p>`}<h1>${e(m.title)}</h1><p>Find their gift. Keep your favorites together.</p></div><a class="holiday-mark" href="https://recipepantry.app/holiday-bake" target="_blank" rel="noopener noreferrer"><img src="/brand-logos/recipe-pantry.webp" alt="Explore the Recipe Pantry Holiday Collection" width="300" height="230"></a></header>
 <div class="offer"><a data-event="offer_click" data-brand="${e(m.brand)}" href="${e(offers[m.id][0])}" target="_blank" rel="sponsored noopener noreferrer">${e(offers[m.id][1])} ↗</a></div>
 <p class="shopping-note">Save gifts from any maker to one list. Store links open a new tab so your guide stays here. Prices are a dated snapshot; final price, tax, shipping and stock are confirmed by the store.</p>
 <section class="grid" aria-label="Products">${cards}</section><p id="save-status" role="status" aria-live="polite"></p>
 <footer><p>Some links support Baking Great Bread at Home through affiliate commissions. No extra cost to you.</p><nav class="links" aria-label="Other makers">${makers.filter(x=>x.id!==m.id).map(x=>`<a href="/makers/${x.id}/">${e(x.brand)}</a>`).join('')}<a href="/admin/login/">Admin sign in</a></nav></footer></main></body></html>`;
 fs.mkdirSync(`public/makers/${m.id}`,{recursive:true});fs.writeFileSync(`public/makers/${m.id}/index.html`,html.split('\n').map(line=>line.trimEnd()).join('\n'));
}
// Publishable configuration only, never service-role credentials.
const env={...loadEnv('production',process.cwd(),'VITE_'),...process.env};
fs.writeFileSync('public/guide-config.json',JSON.stringify({enabled:env.VITE_GUIDE_ANALYTICS_ENABLED==='true',url:env.VITE_SUPABASE_URL||'',key:env.VITE_SUPABASE_PUBLISHABLE_KEY||''}));
