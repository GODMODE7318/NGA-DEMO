import {mkdir,rm,writeFile,copyFile,cp} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {subcourses} from './src/subcourses-data.mjs';
import {home,allCourses,course,contact,about,guidesIndex,guidePages} from './src/nga-pages.mjs';
import {hub,industryPages,cruiseCareer,merchantCareer,admissions,privacy,terms} from './src/nga-legacy.mjs';
const root=dirname(fileURLToPath(import.meta.url)),out=join(root,'dist');
await rm(out,{recursive:true,force:true});await mkdir(join(out,'assets'),{recursive:true});
const pages=[{path:'/',html:home},{path:'/courses/',html:hub},{path:'/courses/all/',html:allCourses},...industryPages,...subcourses.filter(c=>!c.hidden).map(c=>({path:c.path,html:()=>course(c)})),{path:'/cruise-line-careers/',html:cruiseCareer},{path:'/merchant-navy-careers/',html:merchantCareer},{path:'/admissions/',html:admissions},{path:'/privacy-policy/',html:privacy},{path:'/terms/',html:terms},{path:'/contact/',html:contact},{path:'/about/',html:about},{path:'/guides/',html:guidesIndex},...guidePages];
for(const page of pages){let f=page.path==='/'?join(out,'index.html'):join(out,page.path.slice(1),'index.html');await mkdir(dirname(f),{recursive:true});await writeFile(f,page.html());console.log('Built',page.path)}
await cp(join(root,'public/assets'),join(out,'assets'),{recursive:true});await copyFile(join(root,'src/styles.css'),join(out,'assets/styles.css'));await copyFile(join(root,'src/main.js'),join(out,'assets/main.js'));await copyFile(join(root,'src/admin.js'),join(out,'assets/admin.js'));
await writeFile(join(out,'robots.txt'),'User-agent: *\nDisallow: /admin/\nSitemap: https://nationalglobalacademy.com/sitemap.xml\n');
await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>https://nationalglobalacademy.com${p.path}</loc></url>`).join('')}</urlset>`);
await mkdir(join(out,'admin'),{recursive:true});await copyFile(join(root,'src/admin.html'),join(out,'admin/index.html'));
await writeFile(join(out,'404.html'),`<!doctype html><html><head><meta charset="utf-8"><title>Page not found</title><meta name="viewport" content="width=device-width"></head><body><h1>Page not found</h1><p><a href="/">Return home</a></p></body></html>`);
console.log(`Built ${pages.length} public routes and the admin setup screen.`);
