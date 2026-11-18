(() => {
  const KEY = 'bgb.wishlist.v1';
  let memory = [];
  const read = () => { try { const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.filter(x=>typeof x==='string'):[]; } catch {return memory;} };
  const sync = () => {
    const list=read();
    document.querySelectorAll('[data-save]').forEach(b=>{const saved=list.includes(b.dataset.save);b.setAttribute('aria-pressed',String(saved));b.textContent=saved?'Saved ✓':'Save gift';});
    document.querySelectorAll('[data-saved-count]').forEach(n=>n.textContent=String(list.length));
  };
  const config=fetch('/guide-config.json').then(r=>r.json()).catch(()=>({}));
  let session,source='direct',campaign='',medium='';
  try {
    session=sessionStorage.getItem('bgb.visit')||crypto.randomUUID();sessionStorage.setItem('bgb.visit',session);
    const q=new URLSearchParams(location.search);
    let ref='';try{ref=new URL(document.referrer).hostname;}catch{}
    const prior=JSON.parse(sessionStorage.getItem('bgb.attribution')||'null');
    const first=prior||{source:q.get('utm_source')||(ref&&ref!==location.hostname?ref:'direct'),campaign:q.get('utm_campaign')||'',medium:q.get('utm_medium')||''};
    sessionStorage.setItem('bgb.attribution',JSON.stringify(first));({source,campaign,medium}=first);
  } catch { session=crypto.randomUUID(); }
  let sent=0;
  async function track(event,product='',brand=''){
    if(location.pathname.startsWith('/admin')||navigator.doNotTrack==='1'||navigator.globalPrivacyControl||sent++>250)return;
    const c=await config;if(!c.enabled||!c.url||!c.key)return;
    const payload={event,product:product.slice(0,160),brand:brand.slice(0,100),path:location.pathname.slice(0,200),session,source:String(source).slice(0,100),campaign:String(campaign).slice(0,100),medium:String(medium).slice(0,80),device:innerWidth<768?'mobile':'desktop',environment:location.hostname.endsWith('.vercel.app')||location.hostname==='localhost'?'preview':'production'};
    fetch(c.url+'/rest/v1/rpc/record_guide_event',{method:'POST',headers:{apikey:c.key,'Content-Type':'application/json'},body:JSON.stringify({payload}),keepalive:true}).catch(()=>{});
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-save]');
    if(button){const list=read(),id=button.dataset.save,added=!list.includes(id);memory=added?[...list,id]:list.filter(x=>x!==id);let persisted=true;try{localStorage.setItem(KEY,JSON.stringify(memory));}catch{persisted=false;}window.dispatchEvent(new Event('bgb-wishlist-change'));sync();const status=document.getElementById('save-status');if(status)status.textContent=persisted?(added?'Added to your saved gifts.':'Removed from saved gifts.'):'Saved for this page only. Browser storage is unavailable.';track(added?'gift_save':'gift_remove',id,button.closest('[data-brand]')?.dataset.brand||'');}
    const link=event.target.closest('a[href]');if(!link)return;
    const url=new URL(link.href,location.href),card=link.closest('[data-product]');
    if(url.origin!==location.origin)track(link.dataset.event||'outbound_click',card?.dataset.product||'',link.dataset.brand||card?.dataset.brand||url.hostname);
    else if(url.pathname.startsWith('/makers/'))track('collection_click',url.pathname);
  });
  window.addEventListener('bgb-wishlist-change',sync);window.addEventListener('storage',sync);
  window.addEventListener('guide-event',e=>track(e.detail.event,e.detail.product,e.detail.brand));
  sync();track('page_view');
  const observed=new WeakSet();
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){track('product_view',entry.target.dataset.product,entry.target.dataset.brand||'');observer.unobserve(entry.target);}}),{threshold:.5});
  const discover=()=>document.querySelectorAll('[data-product]').forEach(node=>{if(!observed.has(node)){observed.add(node);observer.observe(node);}});
  discover();new MutationObserver(discover).observe(document.body,{childList:true,subtree:true});
})();
