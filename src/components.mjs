import { site, images, whatsappUrl, phoneUrl, emailUrl } from '../site.config.mjs';
import { courses, articles } from './data.mjs';

export const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export const abs = path => `${site.domain}${path}`;

export function icon(name, cls = '') {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l1.9-5a8.4 8.4 0 1 1 16.1-4.5z"/><path d="M8.2 7.8c.5 3.4 2.6 5.5 6 6l1.3-1.5 2 .9c-.3 1.5-1.2 2.2-2.8 2.1-4.3-.4-7.5-3.5-8-7.8-.1-1.5.6-2.5 2-2.8l1 2-1.5 1.1z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    anchor: '<circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3M8 18l4 4 4-4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2"/>',
    alert: '<path d="M10.3 3.7 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>'
  };
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}

export function image({src, alt, slot, width = 1200, height = 800, eager = false, className = ''}) {
  const join = src.includes('?') ? '&' : '?';
  const webp = `${src}${join}fm=webp`;
  return `<!-- IMAGE SLOT: ${esc(slot || alt)} Replace stock URL in site.config.mjs with licensed/owned photography. -->
  <picture class="picture ${className}">
    <source srcset="${webp}" type="image/webp">
    <img src="${src}${join}fm=jpg" alt="${esc(alt)}" width="${width}" height="${height}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" ${eager ? 'fetchpriority="high"' : ''}>
  </picture>`;
}

export function button(label, href, style = 'primary', extra = '') {
  return `<a class="btn btn-${style}" href="${href}" ${extra}>${esc(label)}${icon('arrow')}</a>`;
}

export function sectionHead(eyebrow, title, copy = '', align = '') {
  return `<div class="section-head ${align} reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ''}</div>`;
}

export function breadcrumbs(items) {
  return `<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li>${items.map((x,i) => `<li>${i === items.length - 1 ? `<span aria-current="page">${esc(x.name)}</span>` : `<a href="${x.path}">${esc(x.name)}</a>`}</li>`).join('')}</ol></nav>`;
}

export function breadcrumbSchema(items) {
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'Home',path:'/'},...items].map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:abs(x.path)}))};
}

export function faqBlock(faqs, title = 'Questions families ask us', copy = 'Clear answers before you make a decision.') {
  const list = faqs.map(f => Array.isArray(f) ? {q:f[0],a:f[1]} : f);
  return `<section class="section faq-section"><div class="container narrow">${sectionHead('Straight answers', title, copy)}<div class="faq-list reveal">${list.map((f,i)=>`<details class="faq-item" ${i===0?'open':''}><summary><span>${esc(f.q)}</span>${icon('chevron')}</summary><div class="faq-answer"><p>${esc(f.a)}</p></div></details>`).join('')}</div></div></section>`;
}

export function faqSchema(faqs) {
  const list = faqs.map(f => Array.isArray(f) ? {q:f[0],a:f[1]} : f);
  return {'@context':'https://schema.org','@type':'FAQPage',mainEntity:list.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))};
}

export function enquiryForm(source = 'Website', compact = false) {
  return `<form class="enquiry-form ${compact?'compact':''}" data-enquiry-form novalidate>
    <input type="hidden" name="source" value="${esc(source)}">
    <div class="form-grid">
      <div class="field"><label for="name-${esc(source).replace(/\W/g,'')}">Student’s name <span aria-hidden="true">*</span></label><input id="name-${esc(source).replace(/\W/g,'')}" name="name" type="text" autocomplete="name" required minlength="2" placeholder="Your full name"><small class="field-error"></small></div>
      <div class="field"><label for="phone-${esc(source).replace(/\W/g,'')}">Phone / WhatsApp <span aria-hidden="true">*</span></label><div class="phone-field"><span>+91</span><input id="phone-${esc(source).replace(/\W/g,'')}" name="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required maxlength="14" placeholder="10-digit mobile number" aria-describedby="phone-help"><small class="field-error"></small></div><small id="phone-help" class="field-help">We’ll use this only to discuss your enquiry.</small></div>
      <div class="field"><label for="email-${esc(source).replace(/\W/g,'')}">Email <span class="optional">(optional)</span></label><input id="email-${esc(source).replace(/\W/g,'')}" name="email" type="email" autocomplete="email" placeholder="you@example.com"><small class="field-error"></small></div>
      <div class="field"><label for="interest-${esc(source).replace(/\W/g,'')}">Interested in <span aria-hidden="true">*</span></label><select id="interest-${esc(source).replace(/\W/g,'')}" name="interest" required><option value="">Choose a pathway</option><option>Cruise Line</option><option>Merchant Navy</option><option>Not Sure</option></select><small class="field-error"></small></div>
      <div class="field full"><span class="field-label">Last qualification <span aria-hidden="true">*</span></span><div class="radio-row"><label><input type="radio" name="qualification" value="10th" required><span>10th</span></label><label><input type="radio" name="qualification" value="12th"><span>12th</span></label><label><input type="radio" name="qualification" value="Graduate"><span>Graduate</span></label></div><small class="field-error qualification-error"></small></div>
      <div class="field full"><label for="message-${esc(source).replace(/\W/g,'')}">What would you like help with? <span class="optional">(optional)</span></label><textarea id="message-${esc(source).replace(/\W/g,'')}" name="message" rows="3" placeholder="Course, fees, eligibility, hostel…"></textarea></div>
    </div>
    <button class="btn btn-gold btn-block" type="submit">Request Free Counselling${icon('arrow')}</button>
    <p class="form-consent">By continuing, you agree to be contacted about admissions. No spam, and no job promises. See our <a href="/privacy-policy/">Privacy Policy</a>.</p>
    <div class="form-status" role="status" aria-live="polite"></div>
  </form>`;
}

export function ctaBand(title = 'Your next step should be a clear conversation.', copy = 'Tell us your qualification and career interest. We’ll help you compare suitable pathways, eligibility and the full cost to plan for.') {
  return `<section class="section cta-section" id="enquiry"><div class="container cta-panel reveal"><div class="cta-copy"><span class="eyebrow light">Free admission counselling</span><h2>${title}</h2><p>${copy}</p><div class="cta-assurances"><span>${icon('check')} No obligation to enrol</span><span>${icon('check')} Parents welcome</span><span>${icon('check')} Honest pathway guidance</span></div><a class="text-link light" href="${whatsappUrl('Hello NGA, I would like to book free admission counselling.')}" target="_blank" rel="noopener">Prefer WhatsApp? Start a chat ${icon('arrow')}</a></div><div class="form-card"><h3>Get a personalised callback</h3>${enquiryForm('CTA band', true)}</div></div></section>`;
}

export function eligibilityChecker(prefix = 'home') {
  return `<div class="checker reveal" data-eligibility-checker id="${prefix}-eligibility">
    <div class="checker-intro"><span class="step-chip">3 quick questions</span><h3>Which sea-career pathway fits you?</h3><p>Get a useful starting point based on your education, age and interests. This is guidance, not final medical or admission approval.</p></div>
    <form class="checker-form">
      <fieldset><legend><span>1</span> What is your latest qualification?</legend><div class="choice-grid"><label><input type="radio" name="education" value="10th" required><span>Class 10</span></label><label><input type="radio" name="education" value="12th PCM"><span>12th with PCM</span></label><label><input type="radio" name="education" value="12th Other"><span>12th other stream</span></label><label><input type="radio" name="education" value="Graduate"><span>Graduate</span></label></div></fieldset>
      <fieldset><legend><span>2</span> What is your age?</legend><div class="choice-grid"><label><input type="radio" name="age" value="under16" required><span>Under 16</span></label><label><input type="radio" name="age" value="16-17"><span>16–17</span></label><label><input type="radio" name="age" value="18-24"><span>18–24</span></label><label><input type="radio" name="age" value="25+"><span>25+</span></label></div></fieldset>
      <fieldset><legend><span>3</span> Which work environment interests you more?</legend><div class="choice-grid two"><label><input type="radio" name="interest" value="cruise" required><span>Guest service, food & hospitality</span></label><label><input type="radio" name="interest" value="merchant"><span>Ships, machinery & navigation</span></label><label><input type="radio" name="interest" value="unsure"><span>I need help comparing both</span></label></div></fieldset>
      <button type="submit" class="btn btn-navy">Check My Starting Point${icon('compass')}</button><p class="checker-error" role="alert"></p>
    </form>
    <div class="checker-result" hidden tabindex="-1" aria-live="polite"></div>
  </div>`;
}

export function brochureBlock(courseName) {
  return `<aside class="brochure-card reveal" data-brochure-block>
    <span class="brochure-icon">${icon('download')}</span><div><span class="eyebrow">Free 2026 planning guide</span><h3>Take the course details home</h3><p>Get the pathway checklist, document planner and fee questions to ask—useful for a family discussion.</p></div>
    <button class="btn btn-outline" type="button" data-open-brochure>Get Course Fees & Guide on WhatsApp${icon('arrow')}</button>
  </aside>
  <dialog class="brochure-modal" data-brochure-modal aria-labelledby="brochure-title">
    <button class="modal-close icon-btn" type="button" data-close-brochure aria-label="Close brochure form">${icon('close')}</button>
    <span class="eyebrow">Free downloadable guide</span><h2 id="brochure-title">Plan ${esc(courseName)} with clarity</h2><p>Share your details to open the guide. Our team may follow up with current fee information on WhatsApp.</p>
    <form data-brochure-form novalidate><input type="hidden" name="course" value="${esc(courseName)}"><div class="field"><label for="brochure-name">Name</label><input id="brochure-name" name="name" required minlength="2" autocomplete="name" placeholder="Student or parent name"><small class="field-error"></small></div><div class="field"><label for="brochure-phone">WhatsApp number</label><div class="phone-field"><span>+91</span><input id="brochure-phone" name="phone" required inputmode="numeric" autocomplete="tel-national" maxlength="14" placeholder="10-digit mobile number"></div><small class="field-error"></small></div><button class="btn btn-gold btn-block" type="submit">Get the Free Course Guide${icon('download')}</button><p class="form-consent">By continuing, you consent to a course-related WhatsApp follow-up.</p><div class="form-status" role="status"></div></form>
    <div class="brochure-success" hidden><span class="success-mark">${icon('check')}</span><h3>Your guide is ready</h3><p>Save it now. If our enquiry endpoint is not yet connected, use WhatsApp to request current fees directly.</p><a class="btn btn-navy btn-block" href="/assets/national-global-academy-course-guide.pdf" download>Download Course Planning Guide${icon('download')}</a><a class="btn btn-whatsapp btn-block" href="${whatsappUrl(`Hello NGA, please share current fees for ${courseName}.`)}" target="_blank" rel="noopener">Get Course Fees on WhatsApp${icon('whatsapp')}</a></div>
  </dialog>`;
}

export function testimonialBlock() {
  const samples = [
    ['“The counselling helped our family compare the route and understand medical checks before discussing fees.”', '[CONFIRM: Verified student name]', '[CONFIRM: Course + batch]'],
    ['“I understood what shipboard life demands, not just the travel and salary side. The interview practice was useful.”', '[CONFIRM: Verified student name]', '[CONFIRM: Course + batch]'],
    ['“We received a clear document checklist and could ask our questions as parents before taking a decision.”', '[CONFIRM: Verified parent name]', '[CONFIRM: Student pathway]']
  ];
  return `<section class="section section-muted"><div class="container">${sectionHead('Student & parent voices','Trust should be earned with specifics.','The cards below demonstrate the layout only. Replace every sample with a consented, verifiable testimonial before publishing.')}<div class="confirm-banner">${icon('alert')} SAMPLE TESTIMONIAL CONTENT — [CONFIRM: Replace text, names, courses and outcomes with verified reviews.]</div><div class="card-grid three">${samples.map((s,i)=>`<figure class="testimonial-card reveal"><div class="quote-mark">“</div><blockquote>${s[0]} <strong>[SAMPLE]</strong></blockquote><figcaption><span class="avatar-placeholder">${i+1}</span><span><strong>${s[1]}</strong><small>${s[2]}</small></span></figcaption></figure>`).join('')}</div></div></section>`;
}

function header() {
  return `<a class="skip-link" href="#main">Skip to main content</a>
  <div class="announcement"><div class="container"><span>${icon('calendar')} Admissions guidance open • January Batch / July Batch</span><a href="/admissions/">View admission steps ${icon('arrow')}</a></div></div>
  <header class="site-header" data-header><div class="container header-inner"><a class="brand" href="/" aria-label="National Global Academy home"><span class="brand-mark">${icon('anchor')}</span><span><strong>National Global</strong><small>Academy</small></span></a>
    <button class="menu-toggle icon-btn" type="button" aria-label="Open navigation" aria-controls="primary-nav" aria-expanded="false" data-menu-toggle>${icon('menu')}</button>
    <nav class="primary-nav" id="primary-nav" aria-label="Primary navigation" data-nav><ul><li><a href="/">Home</a></li><li><details class="nav-dropdown"><summary>Courses ${icon('chevron')}</summary><div class="dropdown-menu"><a href="/courses/"><strong>Explore all courses</strong><small>Compare the pathways</small></a>${courses.filter(c=>!c.noindex).map(c=>`<a href="${c.path}">${c.shortTitle}</a>`).join('')}</div></details></li><li><a href="/cruise-line-careers/">Cruise Careers</a></li><li><a href="/merchant-navy-careers/">Merchant Navy</a></li><li><a href="/about/">About</a></li><li><a href="/blog/">Guides</a></li><li><a href="/contact/">Contact</a></li></ul></nav>
    <div class="header-actions"><a class="header-phone" href="${phoneUrl()}">${icon('phone')}<span>${site.phoneDisplay}</span></a><a class="btn btn-gold btn-small" href="/admissions/#enquiry">Apply Now${icon('arrow')}</a></div>
  </div></header>`;
}

function footer() {
  const social = Object.entries(site.social).filter(([,url])=>url);
  return `<footer class="site-footer"><div class="container footer-grid"><div class="footer-brand"><a class="brand light" href="/"><span class="brand-mark">${icon('anchor')}</span><span><strong>National Global</strong><small>Academy</small></span></a><p>Training and career guidance for students who want to build a professional future in cruise hospitality or the Merchant Navy.</p><p class="footer-note">No guaranteed-job claims. Just informed preparation and transparent next steps.</p></div><div><h2>Career pathways</h2><ul><li><a href="/courses/cruise-line-hospitality/">Cruise Hospitality Training</a></li><li><a href="/courses/merchant-navy/">Merchant Navy Pathway</a></li><li><a href="/courses/gp-rating/">GP Rating Preparation</a></li><li><a href="/cruise-line-careers/">Cruise Line Careers</a></li><li><a href="/merchant-navy-careers/">Merchant Navy Careers</a></li></ul></div><div><h2>Academy</h2><ul><li><a href="/about/">About us</a></li><li><a href="/admissions/">Admissions</a></li><li><a href="/blog/">Career guides</a></li><li><a href="/contact/">Contact & directions</a></li><li><a href="/privacy-policy/">Privacy policy</a></li><li><a href="/terms/">Terms of use</a></li></ul></div><div class="footer-contact"><h2>Talk to admissions</h2><a href="${phoneUrl()}">${icon('phone')} ${site.phoneDisplay}</a><a href="${emailUrl()}">${icon('mail')} ${site.emailDisplay}</a><p>${icon('pin')} ${esc(site.address)}</p>${site.googleBusinessProfile?`<a href="${site.googleBusinessProfile}" target="_blank" rel="noopener">Google Business Profile ${icon('arrow')}</a>`:`<span class="confirm-text">[CONFIRM: Add Google Business Profile link]</span>`}${social.length?`<div class="social-links">${social.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener">${name}</a>`).join('')}</div>`:''}</div></div><div class="container footer-bottom"><p>© <span data-year>2026</span> National Global Academy. All rights reserved.</p><p>Eligibility and medical rules can change. Verify current requirements before applying.</p></div></footer>
  <a class="floating-whatsapp" href="${whatsappUrl()}" target="_blank" rel="noopener" aria-label="Chat with National Global Academy on WhatsApp">${icon('whatsapp')}<span>WhatsApp us</span></a>
  <nav class="mobile-action-bar" aria-label="Quick contact"><a href="${phoneUrl()}">${icon('phone')}<span>Call</span></a><a href="${whatsappUrl()}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a><a href="/admissions/#enquiry">${icon('file')}<span>Enquire</span></a></nav>`;
}

export function layout({title, description, path = '/', content, schemas = [], noindex = false, image: ogImage = images.hero, type = 'website', bodyClass = ''}) {
  const canonical = abs(path);
  const og = ogImage.startsWith('http') ? ogImage : abs(ogImage);
  const baseSchemas = [{
    '@context':'https://schema.org','@type':'WebSite','@id':abs('/#website'),url:site.domain,name:site.name,publisher:{'@id':abs('/#organization')}
  }];
  const ga = site.ga4Id ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.ga4Id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.ga4Id}');</script>` : '<!-- GOOGLE ANALYTICS 4: Add G-XXXXXXXXXX to ga4Id in site.config.mjs. -->';
  const gsc = site.searchConsoleVerification ? `<meta name="google-site-verification" content="${site.searchConsoleVerification}">` : '<!-- GOOGLE SEARCH CONSOLE: Add verification token in site.config.mjs. -->';
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}">${noindex?'<meta name="robots" content="noindex,follow">':''}<link rel="canonical" href="${canonical}"><meta name="theme-color" content="#071f30"><meta name="format-detection" content="telephone=no"><meta property="og:locale" content="en_IN"><meta property="og:type" content="${type}"><meta property="og:site_name" content="${site.name}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${og}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${og}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/assets/site.webmanifest"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/assets/styles.css"><script>document.documentElement.classList.add('js')</script>${gsc}${ga}<script type="application/ld+json">${JSON.stringify([...baseSchemas,...schemas])}</script><script defer src="/assets/site-config.js"></script><script defer src="/assets/main.js"></script></head><body class="${bodyClass}">${header()}<main id="main">${content}</main>${footer()}</body></html>`;
}

export function courseCard(course) {
  return `<article class="course-card reveal"><a class="card-image" href="${course.path}">${image({src:course.image,alt:course.imageAlt,slot:course.imageSlot,width:800,height:520})}<span class="card-label">${course.eyebrow.split('•')[0]}</span></a><div class="course-card-body"><h3><a href="${course.path}">${course.shortTitle}</a></h3><p>${course.tagline}</p><ul class="mini-list"><li>${icon('check')} ${course.who[0]}</li><li>${icon('calendar')} ${course.duration}</li></ul><a class="text-link" href="${course.path}">Check Eligibility & Course Details ${icon('arrow')}</a></div></article>`;
}

export function articleCard(article) {
  return `<article class="article-card reveal"><a class="card-image" href="${article.path}">${image({src:article.image,alt:article.alt,slot:`Blog card — ${article.title}`,width:800,height:520})}</a><div class="article-card-body"><div class="post-meta"><span>${article.category}</span><span>${article.read}</span></div><h3><a href="${article.path}">${article.title}</a></h3><p>${article.excerpt}</p><a class="text-link" href="${article.path}">Read the Complete Guide ${icon('arrow')}</a></div></article>`;
}

export const organizationSchema = (includeLocal = false) => {
  const org = {'@context':'https://schema.org','@type':'EducationalOrganization','@id':abs('/#organization'),name:site.name,url:site.domain,description:site.description,areaServed:'IN',knowsAbout:['Cruise hospitality training','Merchant Navy career pathways','GP Rating preparation']};
  if (site.email) org.email = site.email;
  if (site.phone) org.telephone = site.phone;
  const local = {'@context':'https://schema.org','@type':'LocalBusiness','@id':abs('/#localbusiness'),name:site.name,url:site.domain,image:images.hero,priceRange:'[CONFIRM]',address:{'@type':'PostalAddress',streetAddress:site.address,addressCountry:'IN'}};
  if (site.phone) local.telephone = site.phone;
  if (site.googleBusinessProfile) local.sameAs = [site.googleBusinessProfile];
  return includeLocal ? [org,local] : [org];
};

export const courseSchema = course => ({
  '@context':'https://schema.org','@type':'Course',name:course.title,description:course.overview,url:abs(course.path),provider:{'@type':'EducationalOrganization',name:site.name,url:site.domain},inLanguage:'en-IN',isAccessibleForFree:false,offers:{'@type':'Offer',category:'Paid',priceCurrency:'INR',description:'[CONFIRM: Current fees must be supplied before adding a numeric price.]'},hasCourseInstance:{'@type':'CourseInstance',courseMode:course.mode,courseWorkload:course.duration}
});
