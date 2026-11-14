import { mkdir, rm, writeFile, copyFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './site.config.mjs';
import { courses, articles } from './src/data.mjs';
import { homePage } from './src/home.mjs';
import { coursesHubPage, coursePage } from './src/courses.mjs';
import { cruiseCareersPage, merchantCareersPage } from './src/careers.mjs';
import { aboutPage, admissionsPage, blogPage, contactPage, thankYouPage, privacyPage, termsPage } from './src/company.mjs';
import { articlePage, articleTemplatePage } from './src/articles.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets'), { recursive: true });

const pages = [
  {path:'/',html:homePage},
  {path:'/courses/',html:coursesHubPage},
  ...courses.map(course=>({path:course.path,html:()=>coursePage(course),noindex:course.noindex})),
  {path:'/cruise-line-careers/',html:cruiseCareersPage},
  {path:'/merchant-navy-careers/',html:merchantCareersPage},
  {path:'/about/',html:aboutPage},
  {path:'/admissions/',html:admissionsPage},
  {path:'/blog/',html:blogPage},
  ...articles.map(article=>({path:article.path,html:()=>articlePage(article)})),
  {path:'/blog/article-template/',html:articleTemplatePage,noindex:true},
  {path:'/contact/',html:contactPage},
  {path:'/privacy-policy/',html:privacyPage},
  {path:'/terms/',html:termsPage},
  {path:'/thank-you/',html:thankYouPage,noindex:true}
];

const failures = [];
for (const page of pages) {
  const html = page.html();
  const file = page.path === '/' ? join(out, 'index.html') : join(out, page.path.slice(1), 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] || '';
  const description = html.match(/<meta name="description" content="(.*?)">/)?.[1] || '';
  const h1s = (html.match(/<h1(?:\s|>)/g) || []).length;
  if (title.length > 60) failures.push(`${page.path}: title is ${title.length} characters`);
  if (description.length > 155) failures.push(`${page.path}: description is ${description.length} characters`);
  if (h1s !== 1) failures.push(`${page.path}: contains ${h1s} H1 elements`);
  console.log(`built ${page.path.padEnd(58)} title ${String(title.length).padStart(2)}/60 • description ${String(description.length).padStart(3)}/155`);
}

const publicClientConfig = {
  formEndpoint: site.formEndpoint,
  brochureEndpoint: site.brochureEndpoint,
  whatsapp: site.whatsapp
};
await writeFile(join(out,'assets/site-config.js'),`window.NGA_CONFIG=${JSON.stringify(publicClientConfig).replace(/</g,'\\u003c')};\n`);
await copyFile(join(root,'src/styles.css'),join(out,'assets/styles.css'));
await copyFile(join(root,'src/main.js'),join(out,'assets/main.js'));
await copyFile(join(root,'public/assets/favicon.svg'),join(out,'assets/favicon.svg'));
// Base64 source keeps the project fully text-deployable; Vercel regenerates the PDF at build time.
const brochureBase64 = await readFile(join(root,'public/assets/national-global-academy-course-guide.base64'),'utf8');
await writeFile(join(out,'assets/national-global-academy-course-guide.pdf'),Buffer.from(brochureBase64,'base64'));
await copyFile(join(root,'public/assets/site.webmanifest'),join(out,'assets/site.webmanifest'));
await copyFile(join(root,'public/_headers'),join(out,'_headers'));

const now = '2026-11-10';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p=>!p.noindex).map(p=>`  <url><loc>${site.domain}${p.path}</loc><lastmod>${now}</lastmod><changefreq>${p.path.startsWith('/blog/')?'monthly':'weekly'}</changefreq><priority>${p.path==='/'?'1.0':p.path.includes('/courses/')?'0.9':'0.8'}</priority></url>`).join('\n')}\n</urlset>\n`;
await writeFile(join(out,'sitemap.xml'),sitemap);
await writeFile(join(out,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);
await writeFile(join(out,'404.html'),`<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page Not Found | National Global Academy</title><link rel="stylesheet" href="/assets/styles.css"></head><body><main class="thank-you"><div class="container thank-you-inner"><span class="eyebrow">404 • Page not found</span><h1>This page has sailed.</h1><p class="lead">The address may have changed. Return to the academy website or explore the career guides.</p><div class="thank-you-actions"><a class="btn btn-navy" href="/">Return to Homepage</a><a class="btn btn-outline" href="/courses/">Explore Courses</a></div></div></main></body></html>`);

if (failures.length) {
  console.error('\nSEO checks failed:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`\n✓ Built ${pages.length} pages (${pages.filter(p=>!p.noindex).length} indexed, ${pages.filter(p=>p.noindex).length} noindex templates/utilities).`);
  console.log('✓ All titles, descriptions and single-H1 checks passed.');
}
