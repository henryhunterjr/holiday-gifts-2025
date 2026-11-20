import { useWishlist } from '@/hooks/useWishlist';
import { holidayBakingGuide } from '@/data/holidayBakingGuide';
import { DISABLED_PRODUCT_SLUGS } from '@/lib/guideConfig';
import ceramics from '@/data/emileHenry.json';
import makers from '@/data/makers.json';
import productsData from '@/data/products.json';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

export default function SavedGifts(){
 const {slugs:mine,remove}=useWishlist();
 const shared=typeof window!=='undefined'?(new URLSearchParams(window.location.search).get('gifts')||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,100):[];
 const slugs=shared.length?shared:mine;
 const [copied,setCopied]=useState('');
 const copyLink=async()=>{const u=new URL('/saved-gifts/',window.location.origin);u.searchParams.set('gifts',mine.join(','));try{await navigator.clipboard.writeText(u.toString());setCopied('Link copied. Text or email it to family.');}catch{setCopied('Copy this link: '+u.toString());}};
 const collectionItems=makers.flatMap(m=>m.items.filter(p=>p.availability !== "Coming soon").map(p=>({...p,brand:m.brand,id:`${m.id}:${p.slug}`,maker:m.id})));
 const legacyItems=[...productsData.products,...ceramics].filter(p=>!DISABLED_PRODUCT_SLUGS.has(p.slug)).map(p=>({...p,id:p.slug,maker:'',priceLabel:'priceLabel' in p && p.priceLabel ? p.priceLabel : typeof p.price==='number'?`$${p.price.toFixed(2)}`:String(p.price),priceChecked:p.priceChecked || 'See main guide'}));
 const freeGuide = {...holidayBakingGuide, id:holidayBakingGuide.slug, maker:'', priceChecked:''};
 const items=[freeGuide,...collectionItems,...legacyItems].filter(p=>slugs.includes(p.id));
 const legacyCount=0;
 return <main className="min-h-screen bg-flour text-evergreen-deep px-5 py-8"><Helmet><title>Your saved gifts | Holiday Shopping Guide</title><meta name="robots" content="noindex, nofollow" /></Helmet><div className="max-w-5xl mx-auto"><nav className="flex justify-between gap-4"><a href="/">← Keep shopping</a><span className="flex flex-wrap gap-4">{!shared.length&&mine.length>0&&<button type="button" className="underline" onClick={copyLink}>Copy shareable wish list link</button>}<button onClick={()=>window.print()}>Print gift list</button></span></nav><p role="status" aria-live="polite" className="mt-3 text-sm">{copied}</p><h1 className="font-display text-4xl mt-10">{shared.length?'A holiday wish list shared with you':'Your holiday gift list'}</h1><p className="my-5 max-w-2xl">All your makers, one list. Saved on this browser. Each store handles its own checkout, shipping and returns. Store links open a new tab.</p>{!items.length&&<p className="my-10">Open a maker’s catalog and choose “Save gift” to start your list.</p>}{legacyCount>0&&<p className="my-5">You also have {legacyCount} gifts saved from the main guide. <a className="underline" href="/#saved">View all saved gifts</a>.</p>}<div className="grid gap-6 sm:grid-cols-2">{items.map(p=><article data-product={p.id} data-brand={p.brand} key={p.id} className="bg-white border-t-4 border-honey p-5 rounded-lg">{p.img&&<img src={p.img} alt={p.name} className="w-full h-48 object-contain" />}<p className="text-sm mt-4">{p.brand}</p><h2 className="font-display text-2xl">{p.name}</h2><p className="font-bold text-xl my-3">{p.priceLabel}</p>{p.id !== freeGuide.id && <p className="text-xs mb-4">USD · Price checked {p.priceChecked}. Final price and stock at checkout.</p>}<div className="flex flex-wrap gap-5 items-center"><a className="underline" href={p.maker?`/makers/${p.maker}/#${p.slug}`:p.id===freeGuide.id?"/#free-holiday-guide":p.id.startsWith("emile-henry-")?"/#emile-henry":"/#browse"}>See details</a><a className="bg-evergreen text-white px-4 py-3 rounded-lg" href={p.url} target="_blank" rel={p.id===freeGuide.id?"noopener noreferrer":"sponsored noopener noreferrer"}>{p.id===freeGuide.id?freeGuide.actionLabel:"Shop at "+p.brand} ↗</a>{!shared.length&&<button className="underline" onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}>Remove</button>}</div></article>)}</div></div></main>;
}
