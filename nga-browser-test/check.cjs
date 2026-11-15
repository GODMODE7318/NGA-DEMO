const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({headless:true,args:['--no-sandbox']});
 const paths=['/','/courses/','/courses/all/','/courses/cruise-line-hospitality/','/courses/merchant-navy/','/courses/aviation/','/courses/hospitality/','/courses/gp-rating/','/courses/diploma-in-cruise-hospitality-management/','/about/','/admissions/','/blog/merchant-navy-after-12th-guide-2026/'];
 for (const width of [320,375,768,1440]) {
  const page=await b.newPage({viewport:{width,height:850},reducedMotion:'reduce'});page.on('pageerror',err=>console.log('JS ERROR',width,err.message));
  for (const path of paths){
   await page.goto('http://127.0.0.1:3000'+path,{waitUntil:'domcontentloaded'});await page.waitForTimeout(250);
   const info=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,missing:[...document.querySelectorAll('img')].filter(i=>i.currentSrc.includes('/assets/')&&i.loading!=='lazy'&&i.complete&&!i.naturalWidth).map(i=>i.currentSrc),bad:[...document.querySelectorAll('h1,h2,h3,h4,p,.btn,.duration-badge')].filter(e=>e.getBoundingClientRect().right>innerWidth+1 && getComputedStyle(e).position!=='absolute').slice(0,5).map(e=>e.textContent.trim().slice(0,80))}));
   if(info.scrollWidth>info.clientWidth+1 || info.missing.length||info.bad.length)console.log('FAIL',width,path,JSON.stringify(info));else console.log('PASS',width,path);
  }
  if(width===375){await page.goto('http://127.0.0.1:3000/courses/all/');await page.screenshot({path:'/home/user/nga-audit/mobile-courses.png'});await page.goto('http://127.0.0.1:3000/');await page.screenshot({path:'/home/user/nga-audit/mobile-home.png'});}
  await page.close();
 }
 let p=await b.newPage();await p.goto('http://127.0.0.1:3000/courses/diploma-in-cruise-hospitality-management/');await p.locator('.subcourse-detail-content .btn-navy').click(); console.log('PRESELECT',await p.locator('select[name=interest]').first().inputValue());
 await p.locator('input[name=name]').first().fill('Test Student');await p.locator('input[name=phone]').first().fill('9876543210');await p.locator('input[name=qualification][value="12th"]').first().check({force:true});await p.locator('form[data-enquiry-form] button[type=submit]').first().click();await p.waitForURL('**/thank-you/**'); console.log('ENQUIRY_FLOW',p.url(),await p.locator('[data-thank-you-whatsapp]').getAttribute('href'));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
