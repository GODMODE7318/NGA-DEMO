from pathlib import Path
p=Path('src/subcourses-data.mjs');s=p.read_text().replace('/courses/diploma-in-cruise-hospitality-management/','/courses/diploma-in-cruise-and-hospitality-management-dchm/').replace('E-Learning Exam plus Exit Exam','E-Learning Exam + Exit Exam');p.write_text(s)
p=Path('src/nga-pages.mjs');s=p.read_text()
s=s.replace("const img=(src,alt,extra='')=>", "const img=(src,alt,extra='')=>")
# Replace unconfirmed course-card claims with the six existing course records.
a=s.index('const industry=[');b=s.index('\n];',a)+3
industry='''const industry=[
 {name:'Cruise Industry',id:'cruise',path:'/courses/cruise-line-hospitality/',trending:true,photo:images.cruise,alt:'Cruise ship sailing at sea',video:'cruise.mp4'},
 {name:'Merchant Navy',id:'merchant-navy',path:'/courses/merchant-navy/',photo:images.deck,alt:'Container ship at sea',video:'merchant.mp4'},
 {name:'Aviation',id:'aviation',path:'/courses/aviation/',trending:true,photo:'https://images.unsplash.com/photo-1641447093043-241f064568fb?auto=format&fit=crop&w=1200&q=80',alt:'Aeroplane cabin',video:'aviation.mp4'},
 {name:'Hospitality',id:'hospitality',path:'/courses/hospitality/',photo:'https://images.unsplash.com/photo-1660557989695-14fac79c086d?auto=format&fit=crop&w=1200&q=80',alt:'Hotel reception desk',video:'hospitality.mp4'}
];'''
s=s[:a]+industry+s[b:]
a=s.index('function industryCards()');b=s.index('\nfunction employerStrip()',a)
s=s[:a]+'''function video(src,poster){return `<video class="nga-video" autoplay muted loop playsinline preload="none" poster="${esc(poster)}" aria-hidden="true" data-stock-video><source src="/assets/videos/${esc(src)}" type="video/mp4"></video>`}
function industryCards(){return `<div class="industry-grid">${industry.map(g=>`<article class="industry-card"><a href="${g.path}" class="industry-photo" aria-label="Explore ${esc(g.name)} courses">${video(g.video,g.photo)}</a><div class="industry-content">${g.trending?'<span class="trending-badge">Most Trending</span>':''}<h3>${esc(g.name)}</h3><p>Explore ${g.id==='cruise'?'the courses':'the course'} in ${esc(g.name)}.</p><a class="text-link" href="${g.path}">View Courses ${icon('arrow')}</a></div></article>`).join('')}</div>`}''' +s[b:]
s=s.replace('CRUISE, MERCHANT NAVY, AVIATION, HOSPITALITY</span><h1>', 'Global Career Training Institute</span><h1>')
s=s.replace("${image({src:images.hero,alt:'Cruise ship at sea',width:1800,height:1100,eager:true})}","${video('cruise.mp4',images.hero)}")
# Replace inferred office hours, address and map with confirmed contact methods only.
a=s.index('const contactFaq=[');b=s.index('\nfunction form()',a)
s=s[:a]+'''const contactFaq=[['Can the counselling call include my parents?','Yes, parents are welcome on every counselling call and at every step.'],['What should I bring to counselling?','Your latest qualification details and your questions can help guide the conversation.']];''' +s[b:]
a=s.index('const mapQuery=');b=s.index('\nexport function about()',a)
s=s[:a]+'''export function contact(){let content=`<section class="editorial-hero"><div class="container"><h1>Contact National Global Academy</h1><p>Choose the easiest way to connect.</p></div></section><section class="section" id="enquiry"><div class="container nga-two contact-two"><div><h2>Choose the easiest way to connect.</h2><h3>Call</h3><p><a href="${phoneUrl()}">${esc(site.phoneDisplay)}</a></p><h3>WhatsApp</h3><p><a href="https://wa.me/${esc(site.whatsapp)}">Start an admission chat</a>, include your qualification and career interest.</p><h3>Email</h3><p><a href="mailto:${esc(site.email)}">${esc(site.emailDisplay||site.email)}</a></p></div><div class="form-card"><h2>Book Free Counselling</h2><p>We will discuss your course options, batch timing and the questions your family should ask next.</p>${form()}</div></div></section>${faqBlock(contactFaq,'Contact questions.','')}`;return commonLayout('Contact | National Global Academy','Call or chat with National Global Academy in Noida.','/contact/',content)}''' +s[b:]
# Return the user-requested decision, parent and scam content without unverified claims.
needle="</div></div></section>${faqBlock(homeFaq,'Your questions, answered.','')} ${callback()}`"
insert='''</div></div></section><section class="section section-muted"><div class="container nga-two"><div><span class="eyebrow">Plan with care</span><h2>Aim high. Plan with both feet on the ground.</h2><p>Discuss the work, routines and questions that matter to you before choosing a pathway.</p></div><div class="nga-white"><h3>The parts ads often leave out</h3><ul><li>You may be away from home for months.</li><li>Shared cabins and shift work are common.</li><li>Ask for a written explanation of the next steps.</li></ul></div></div></section><section class="section parent-section"><div class="container parent-panel"><div class="parent-symbol">${icon('shield')}</div><div><span class="eyebrow">For parents</span><h2>You deserve more than a brochure and a promise.</h2><p>Parents are welcome to ask questions and take part in counselling.</p><a class="text-link" href="/admissions/#documents">See the document checklist ${icon('arrow')}</a></div></div></section><section class="section"><div class="container safety-panel"><div><span class="eyebrow">Avoid the scam traps</span><h2>Check the details before you decide.</h2></div><div><p>Verify the institution and course through current official sources. Ask who receives each payment and obtain receipts. Be cautious of unexplained cash requests, agents who refuse employer verification, or anyone promising a joining date without a documented process.</p></div></div></section>${faqBlock(homeFaq,'Your questions, answered.','')} ${callback()}`'''
assert needle in s;s=s.replace(needle,insert,1)
# User requested identical form on all these sections.
s=s.replace('${cards}</div></section>`;return commonLayout', '${cards}</div></section>${callback()}`;return commonLayout')
s=s.replace('${button(\'Talk to an Advisor\',\'/contact/\',\'navy\')}</div></article>`)}));', '${button(\'Talk to an Advisor\',\'/contact/\',\'navy\')}</div></article>${callback()}`)}));')
# Course poster/video by industry, with factual poster fallbacks.
s=s.replace("function photo(c){return c.poster || c.image}","function photo(c){return c.poster || c.image}\nfunction courseVideo(c){return c.parent==='Hospitality'?'food.mp4':(industry.find(g=>g.name===c.parent)?.video || 'cruise.mp4')}")
s=s.replace('${img(photo(c),c.imageAlt)}</a><div><h3>${esc(c.name)}</h3>', '${video(courseVideo(c),photo(c))}</a><div>${c.trending?\'<span class="trending-badge">Most Trending</span>\':\'\'}<h3>${esc(c.name)}</h3>')
# Updated guide pages retain existing and corrected URLs.
p.write_text(s)
