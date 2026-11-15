const { chromium } = require('playwright');
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 for(const width of [320,375,768,1440]) {
  const page=await browser.newPage({viewport:{width,height:850},reducedMotion:'no-preference'});
  let errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'domcontentloaded'});
  const frame=page.locator('[data-logo-marquee]');await frame.scrollIntoViewIfNeeded();await page.waitForTimeout(300);
  const check=async()=>await frame.evaluate(el=>{let edge=el.getBoundingClientRect();let all=[...el.querySelectorAll('.employer-logo-item')];return {width:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth, x:all[0].getBoundingClientRect().left, cropped:all.filter(i=>{let b=i.getBoundingClientRect();let opacity=Number(getComputedStyle(i).opacity);return opacity>0.001&&(b.left<edge.left-0.1||b.right>edge.right+0.1)}).length,visible:all.filter(i=>Number(getComputedStyle(i).opacity)>0.05).length,display:getComputedStyle(el.querySelector('.employer-logo-track')).display, state:getComputedStyle(el.querySelector('.employer-logo-track')).animationPlayState}});
  let a=await check();await page.waitForTimeout(900);let z=await check();
  if(z.width>z.viewport||z.cropped||Math.abs(a.x-z.x)<2||z.display!=='flex'||z.visible<1||errors.length)throw Error(JSON.stringify({width,a,z,errors}));
  await frame.hover();await page.waitForTimeout(120);let hover=await check();if(hover.state!=='paused')throw Error('hover did not pause '+width);
  await page.mouse.move(0,0);await page.waitForTimeout(150);
  console.log(`PASS ${width}px moving logos, no clipped visible logo, no overflow, hover pause`);
  if(width===1440){let pill=await page.locator('.floating-whatsapp').evaluate(e=>{let b=e.getBoundingClientRect(),i=e.querySelector('svg').getBoundingClientRect();return {width:b.width,height:b.height,icon:i.width,fill:getComputedStyle(e.querySelector('svg')).fill}});if(pill.width!==134||pill.height!==44||pill.icon!==24||pill.fill!=='rgb(255, 255, 255)')throw Error(JSON.stringify(pill));console.log('PASS WhatsApp pill unchanged at 134 by 44, white official 24px mark');}
  await page.close();
 }
 const p=await browser.newPage({viewport:{width:320,height:850},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:3000/');const mode=await p.locator('[data-logo-marquee]').evaluate(e=>({anim:e.classList.contains('is-animated'),width:document.documentElement.scrollWidth,view:document.documentElement.clientWidth}));if(mode.anim||mode.width>mode.view)throw Error(JSON.stringify(mode));console.log('PASS reduced motion accessible static fallback');await p.close();
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
