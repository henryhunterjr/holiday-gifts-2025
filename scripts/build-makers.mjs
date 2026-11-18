import fs from 'node:fs';
import {BASE_URL} from '../site/lib/site.mjs';
const origin=new URL(BASE_URL).origin;
const makers=JSON.parse(fs.readFileSync('src/data/makers.json','utf8'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const offers={
 'wire-monkey':'<a href="https://wiremonkey.com/discount/C1Z5YP7FNQ03?rfsn=6816936.edb8683" target="_blank" rel="sponsored noopener noreferrer">Shop Wire Monkey with Henry’s storewide 10% discount ↗</a>',
 'brod-and-taylor':'<a href="https://brodandtaylor.com?dt_id=330823" target="_blank" rel="sponsored noopener noreferrer">Shop Brød & Taylor ↗</a>',
 'sour-house':'Use HBK26 for 10% off eligible items. Check holiday offer terms at the store.',
 'holland-bowl':'Use Henry for 15% off your first order. One use per customer.'
};
for(const m of makers){
 const url=`${origin}/makers/${m.id}/`;
 const cards=m.items.map(p=>`<article><a href="${escape(p.url)}" target="_blank" rel="sponsored noopener noreferrer"><img src="${p.img}" alt="${escape(p.name)}" width="800" height="800" loading="lazy"><h2>${escape(p.name)}</h2></a><p>${escape(p.desc)}</p><a href="${escape(p.url)}" target="_blank" rel="sponsored noopener noreferrer">Check price & availability ↗</a></article>`).join('');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(m.title)} by ${escape(m.brand)} | Henry’s Gift Guide</title><meta name="description" content="Compare ${m.items.length} ${escape(m.brand)} gifts for bread bakers in Henry Hunter’s holiday shopping guide."><link rel="canonical" href="${url}"><style>body{margin:0;background:#f7f4ec;color:#163e35;font:17px/1.5 system-ui}main,nav{max-width:1180px;margin:auto;padding:24px}header{padding:45px 0}h1{font:clamp(42px,7vw,82px)/1.05 Georgia;letter-spacing:-.04em;margin:15px 0}h2{font:26px/1.15 Georgia}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:3px solid #9f472e;outline-offset:5px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:36px 24px}article{display:flex;flex-direction:column}article>a:last-child{margin-top:auto}img{width:100%;height:auto;aspect-ratio:1;object-fit:contain;background:#e9e3d8;mix-blend-mode:multiply}footer{border-top:1px solid #b1ab9b;margin-top:60px;padding:24px 0;font-size:14px}.offer{padding:20px;background:#e7ddc9}.links{display:flex;gap:20px;flex-wrap:wrap}</style></head><body><nav><a href="/">← Holiday Shopping Guide</a></nav><main><header><p>${escape(m.brand)}</p><h1>${escape(m.title)}</h1><p>Compare the collection and choose what fits the way you bake.</p><p class="offer">${offers[m.id]}</p></header><section class="grid" aria-label="Products">${cards}</section><footer><p>Some links support Baking Great Bread at Home through affiliate commissions. Current prices and availability are shown at the maker’s store.</p><nav class="links" aria-label="Other makers">${makers.filter(x=>x.id!==m.id).map(x=>`<a href="/makers/${x.id}/">${escape(x.brand)}</a>`).join('')}</nav></footer></main></body></html>`;
 fs.mkdirSync(`public/makers/${m.id}`,{recursive:true});fs.writeFileSync(`public/makers/${m.id}/index.html`,html);
}
