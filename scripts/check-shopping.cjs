const {chromium}=require('playwright-core');
const fs=require('fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_BIN || undefined,headless:true});
 const out=process.env.QA_OUTPUT || 'qa/shopping';
 fs.mkdirSync(out,{recursive:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[];
 page.on('pageerror',e=>failures.push(e.message));
 const base=process.env.TEST_URL||'http://127.0.0.1:4175';
 await page.goto(base+'/makers/wire-monkey/');
 await page.locator('[data-save]').first().click();
 if(await page.locator('[data-save]').first().getAttribute('aria-pressed')!=='true')throw Error('save failed');
 await page.goto(base+'/makers/modkitchn/');await page.locator('[data-save]').first().click();
 await page.getByRole('link',{name:/Saved gifts/}).click();
 await page.waitForSelector('article');
 if(await page.locator('article').count()!==2)throw Error('cross-maker saved list failed');
 await page.reload();await page.waitForSelector('article');
 if(await page.locator('article').count()!==2)throw Error('saved list persistence failed');
 await page.getByRole('button',{name:/Remove/}).first().click();
 if(await page.locator('article').count()!==1)throw Error('remove failed');
 await page.goto(base+'/');await page.locator('.hero-holiday-logo img').waitFor();
 await page.screenshot({path:path.join(out,'guide-desktop.png')});
 if(await page.locator('.maker-doors>a').count()!==8)throw Error('missing makers');
 for(const width of [390,768,1024,1440]){
  await page.setViewportSize({width,height:844});
  await page.goto(base+'/#emile-henry');
  const collection=page.locator('#emile-henry');
  await collection.getByRole('heading',{name:'Baguette Baker',exact:true}).waitFor();
  const pieces=collection.locator('article');
  if(await pieces.count()!==9)throw Error('Missing ceramics at '+width);
  const columns=await collection.locator('.ceramic-grid').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
  if(columns!==(width<=720?1:2))throw Error('Incorrect ceramic layout at '+width);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Page overflows at '+width);
  for(const photo of await collection.locator('img').all()){
   await photo.scrollIntoViewIfNeeded();
   await photo.evaluate(img=>img.decode());
  }
  await collection.locator('h2').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(out,'ceramics-'+width+'.png')});
  console.log('Verified nine photos and '+columns+' collection columns at '+width+'px');
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/makers/wire-monkey/');
 await page.screenshot({path:path.join(out,'catalog-mobile.png')});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('catalog mobile overflow');
 if(!await page.locator('.maker-logo').evaluate(el=>el.complete&&el.naturalWidth>0))throw Error('logo not loaded');
 if(await page.locator('.price').count()!==7)throw Error('missing prices');
 await page.goto(base+'/admin/analytics/');await page.waitForURL(url=>url.pathname.replace(/\/$/, '') === '/admin/login');
 if(!await page.getByRole('heading',{name:'Admin sign in'}).isVisible())throw Error('admin gate missing');
 const makers=JSON.parse(fs.readFileSync('src/data/makers.json'));
 for(const m of makers){for(const p of m.items){if(p.img&&!fs.existsSync('public'+p.img))throw Error('missing '+p.img);if(!p.priceLabel)throw Error('missing price');}}
 if(failures.length)throw Error(failures.join('\n'));
 console.log('PASS: cross-maker save/remove/persistence, 8 maker entries, prices, logo loading, desktop/mobile overflow, admin sign-in gate, all image paths.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
