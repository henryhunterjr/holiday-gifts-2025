import { useWishlist } from '@/hooks/useWishlist';
import makers from '@/data/makers.json';
import productsData from '@/data/products.json';
import { Helmet } from 'react-helmet-async';

export default function SavedGifts(){
 const {slugs,remove}=useWishlist();
 const collectionItems=makers.flatMap(m=>m.items.map(p=>({...p,brand:m.brand,id:`${m.id}:${p.slug}`,maker:m.id})));
 const legacyItems=productsData.products.map(p=>({...p,id:p.slug,maker:'',priceLabel:typeof p.price==='number'?`$${p.price.toFixed(2)}`:String(p.price),priceChecked:'See main guide'}));
 const items=[...collectionItems,...legacyItems].filter(p=>slugs.includes(p.id));
 const legacyCount=0;
 return <main className="min-h-screen bg-flour text-evergreen-deep px-5 py-8"><Helmet><title>Your saved gifts | Holiday Shopping Guide</title><meta name="robots" content="noindex" /></Helmet><div className="max-w-5xl mx-auto"><nav className="flex justify-between gap-4"><a href="/">← Keep shopping</a><button onClick={()=>window.print()}>Print gift list</button></nav><h1 className="font-display text-4xl mt-10">Your holiday gift list</h1><p className="my-5 max-w-2xl">All your makers, one list. Saved on this browser. Each store handles its own checkout, shipping and returns. Store links open a new tab.</p>{!items.length&&<p className="my-10">Open a maker’s catalog and choose “Save gift” to start your list.</p>}{legacyCount>0&&<p className="my-5">You also have {legacyCount} gifts saved from the main guide. <a className="underline" href="/#saved">View all saved gifts</a>.</p>}<div className="grid gap-6 sm:grid-cols-2">{items.map(p=><article data-product={p.id} data-brand={p.brand} key={p.id} className="bg-white border-t-4 border-honey p-5 rounded-lg">{p.img&&<img src={p.img} alt={p.name} className="w-full h-48 object-contain" />}<p className="text-sm mt-4">{p.brand}</p><h2 className="font-display text-2xl">{p.name}</h2><p className="font-bold text-xl my-3">{p.priceLabel}</p><p className="text-xs mb-4">USD · Price checked {p.priceChecked}. Final price and stock at checkout.</p><div className="flex flex-wrap gap-5 items-center"><a className="underline" href={p.maker?`/makers/${p.maker}/#${p.slug}`:`/#browse`}>See details</a><a className="bg-evergreen text-white px-4 py-3 rounded-lg" href={p.url} target="_blank" rel="sponsored noopener noreferrer">Shop at {p.brand} ↗</a><button className="underline" onClick={()=>remove(p.id)} aria-label={`Remove ${p.name}`}>Remove</button></div></article>)}</div></div></main>;
}
