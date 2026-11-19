import fs from 'node:fs';
import {loadEnv} from 'vite';
import {BASE_URL} from '../site/lib/site.mjs';
const origin=new URL(BASE_URL).origin;
const makers=JSON.parse(fs.readFileSync('src/data/makers.json','utf8'));
const e=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const offers={
 'wire-monkey':['https://wiremonkey.com/discount/C1Z5YP7FNQ03?rfsn=6816936.edb8683','Activate Henry’s storewide 10% discount'],
 'brod-and-taylor':['https://brodandtaylor.com?dt_id=330823','Shop with Henry’s Brød & Taylor link'],
 'sour-house':['https://sourhouse.co?ref=BAKINGGREATBREAD','Use HBK26 for 10% off eligible Sourhouse items. The bundles below show Sourhouse’s holiday prices.'],
 'holland-bowl':['https://hollandbowlmill.com/?wpam_id=10','Use Henry for 15% off your first order. One use per customer.'],
 'nutrimill':['https://nutrimill.com/Academy26','Shop with Henry’s NutriMill link. ACADEMY26 takes $20 off the Classic.'],
 'grand-teton':['https://www.ancientgrains.com/?a_aid=henryhunter','Use crustandcrumb for 10% off your first order.'],
 'modkitchn':['https://modkitchn.com/BAKINGGREATBREAD','Activate 10% off with BAKINGGREATBREAD']
};
const ORG={"@type":"Organization","@id":"https://bakinggreatbread.com/#organization",name:"Baking Great Bread at Home",url:"https://bakinggreatbread.com"};
const PERSON={"@type":"Person","@id":"https://bakinggreatbread.com/#henry-hunter",name:"Henry Hunter",worksFor:{"@id":ORG["@id"]}};
const num=l=>{const v=parseFloat(String(l).replace(/[^0-9.]/g,''));return Number.isFinite(v)?v:null;};
const band=v=>v==null?'':v<30?'under-30':v<=100?'30-100':'100-plus';
const hasVariants=p=>p.priceDetails&&p.priceDetails.trim()!==String(p.priceLabel).replace(/^From\s+/,'').trim();
const fmtDate=d=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const faqs={'brod-and-taylor':[
 ['What is the best Brød & Taylor gift for a beginner sourdough baker?','Start with the High Capacity Baking Scale, the Sourdough Starter Jar, or the Boule Banneton Set. The scale moves a new baker from cups to grams, the jar makes starter rise easy to read, and the bannetons give round loaves clean shape and easy release. All three come in under $30.'],
 ['Boule vs. Batard banneton: which should I gift?','A boule basket makes a round loaf and suits most everyday doughs. A batard basket makes an oval loaf that slices evenly for sandwiches and handles bigger doughs, around 900 g to 1.1 kg in the large size. If you don’t know their habits, the boule set is the safer first gift.'],
 ['Why is the Folding Proofer worth the splurge?','Dough rises on temperature, and a cold kitchen makes timing a guess. The Folding Proofer holds the exact degree you set, so rise times stay predictable all winter. It folds flat for drawer storage and also works as a slow cooker.']]};
for(const m of makers){
 const url=`${origin}/makers/${m.id}/`;
 const checked=m.items.map(p=>p.priceChecked).filter(Boolean).sort().pop();
 const brand=e(m.brand);
 const cards=m.items.map((p,i)=>{const v=num(p.priceLabel);return `<article id="${e(p.slug)}" data-product="${m.id}:${p.slug}" data-brand="${brand}" data-band="${band(v)}">
 ${p.img?`<img class="product-photo" src="${p.img}" alt="${e(p.name)}" width="800" height="800" ${i<2?'fetchpriority="high"':'loading="lazy"'}>`:'<div class="photo-pending">Product photo coming soon</div>'}
 ${p.badge?`<p class="badge">${e(p.badge)}</p>`:''}<h2>${e(p.name)}</h2><p class="price">${e(p.priceLabel)}</p>
 ${p.availability==='Coming soon'?'<p class="stock-note">Coming soon, according to the latest product update.</p>':''}
 <p class="description">${e(p.desc)}</p>${p.bestFor?`<p class="best-for"><strong>Best for:</strong> ${e(p.bestFor)}</p>`:''}${hasVariants(p)?`<details><summary>Bundles &amp; sizing options</summary><p>${e(p.priceDetails)}</p></details>`:''}
 <div class="card-actions"><a class="shop" data-event="partner_click" href="${e(p.url)}" target="_blank" rel="sponsored noopener noreferrer">${p.availability==='Coming soon'?'Check availability':`Shop at ${brand}`} ↗</a><button type="button" class="save" data-save="${m.id}:${p.slug}" aria-pressed="false" aria-label="Save ${e(p.name)}">♡ Save</button></div></article>`;}).join('');
 const counts={all:m.items.length};for(const p of m.items){const b=band(num(p.priceLabel));counts[b]=(counts[b]||0)+1;}
 const pills=[['all',`All (${counts.all})`],['under-30','Under $30'],['30-100','$30–$100'],['100-plus','$100+']].map(([k,l],i)=>`<button type="button" data-filter="${k}" aria-pressed="${i===0}">${l}</button>`).join('');
 const faq=m.faq?m.faq.map(f=>[f.q,f.a]):(faqs[m.id]||[]);
 const h1=`${m.brand} — ${m.title}`;
 const ld={"@context":"https://schema.org","@graph":[ORG,PERSON,
  {"@type":"CollectionPage","@id":url,url,name:h1,isPartOf:{"@type":"WebSite",url:origin+'/'},publisher:{"@id":ORG["@id"]},author:{"@id":PERSON["@id"]},mainEntity:{"@id":url+'#products'}},
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Holiday Shopping Guide",item:origin+'/'},{"@type":"ListItem",position:2,name:m.brand,item:url}]},
  {"@type":"ItemList","@id":url+'#products',numberOfItems:m.items.length,itemListElement:m.items.map((p,i)=>({"@type":"ListItem",position:i+1,item:{"@type":"Product",name:p.name,description:p.desc,...(p.img?{image:origin+p.img}:{}),brand:{"@type":"Brand",name:m.brand},url:`${url}#${p.slug}`,...(num(p.priceLabel)!=null?{offers:{"@type":"Offer",price:num(p.priceLabel).toFixed(2),priceCurrency:"USD",url:p.url}}:{})}}))},
  ...(faq.length?[{"@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))}]:[])]};
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(h1)} | Henry’s Gift Guide</title><meta name="description" content="Compare ${m.items.length} ${brand} gifts, prices and sizes. Save your favorites in Henry Hunter’s holiday shopping guide."><link rel="canonical" href="${url}"><meta property="og:url" content="${url}"><meta property="og:title" content="${e(h1)}"><link rel="stylesheet" href="/maker-catalog.css"><script src="/guide-tools.js" defer></script><script type="application/ld+json">${JSON.stringify(ld).replaceAll('<','\\u003c')}</script></head><body>
 <nav class="catalog-nav"><a href="/">← Holiday Shopping Guide</a><a href="/saved-gifts/" class="saved-link">Saved gifts <span data-saved-count>0</span></a></nav>
 <main><header class="catalog-header">${m.logo?`<img class="maker-logo" src="${m.logo}" alt="${brand} logo" width="210" height="100">`:`<p class="maker-wordmark">${brand}</p>`}<h1>${e(h1)}</h1>${m.curatorNote?`<p class="curator">${e(m.curatorNote)}</p>`:'<p>Find their gift. Keep your favorites together.</p>'}</header>
 <div class="offer"><a data-event="offer_click" data-brand="${brand}" href="${e(offers[m.id][0])}" target="_blank" rel="sponsored noopener noreferrer">${e(offers[m.id][1])} ↗</a></div>
 <p class="disclosure">Affiliate note: Links on this guide support Baking Great Bread at Home at no extra cost to you. Store links open in a new tab.</p>
 <p class="shopping-note">All prices in USD · Prices verified ${fmtDate(checked)} · Final price, tax, shipping, and stock are confirmed by the store.</p>
 <div class="filters" role="group" aria-label="Filter by budget">${pills}</div>
 <section class="grid" aria-label="Products">${cards}</section><p id="save-status" role="status" aria-live="polite"></p>
 ${faq.length?`<section class="faq" aria-labelledby="faq-h"><h2 id="faq-h">Questions bakers ask</h2>${faq.map(([q,a])=>`<h3>${e(q)}</h3><p>${e(a)}</p>`).join('')}</section>`:''}
 <aside class="cross-promo"><a href="https://recipepantry.app/holiday-bake" target="_blank" rel="noopener noreferrer"><img src="/brand-logos/recipe-pantry.webp" alt="Recipe Pantry Holiday Collection" width="300" height="230" loading="lazy"></a><div><h2>Baking for the holidays?</h2><p>Recipe Pantry’s Holiday Collection has the breads and treats to put these tools to work.</p><a href="https://recipepantry.app/holiday-bake" target="_blank" rel="noopener noreferrer">Explore the collection ↗</a></div></aside>
 <footer><nav class="links" aria-label="Other makers">${makers.filter(x=>x.id!==m.id).map(x=>`<a href="/makers/${x.id}/">${e(x.brand)}</a>`).join('')}</nav><nav class="links trust" aria-label="About this guide"><a href="https://bakinggreatbread.com" target="_blank" rel="noopener noreferrer">About</a><a href="/privacy-policy/">Privacy Policy</a><a href="/contact/">Contact</a></nav></footer></main></body></html>`;
 fs.mkdirSync(`public/makers/${m.id}`,{recursive:true});fs.writeFileSync(`public/makers/${m.id}/index.html`,html.split('\n').map(line=>line.trimEnd()).join('\n'));
}
// Publishable configuration only, never service-role credentials.
const env={...loadEnv('production',process.cwd(),'VITE_'),...process.env};
fs.writeFileSync('public/guide-config.json',JSON.stringify({enabled:env.VITE_GUIDE_ANALYTICS_ENABLED==='true',url:env.VITE_SUPABASE_URL||'',key:env.VITE_SUPABASE_PUBLISHABLE_KEY||''}));
