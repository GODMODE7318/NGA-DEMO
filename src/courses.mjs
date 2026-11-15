import { images } from '../site.config.mjs';
import { subcourses, courseGroups } from './subcourses-data.mjs';
import { groupedSubcourses, subcourseCard } from './subcourses.mjs';
import { layout, image, button, sectionHead, icon, breadcrumbs, breadcrumbSchema, faqBlock, faqSchema, ctaBand, esc } from './components.mjs';
import { generalFaqs } from './data.mjs';

const groupId = name => name.toLowerCase().replace(/\s+/g,'-');
const groupImages = { 'Cruise Industry': images.cruise, 'Merchant Navy': images.deck, 'Aviation': 'https://images.unsplash.com/photo-1641447093043-241f064568fb?auto=format&fit=crop&w=1200&q=80', 'Hospitality':'https://images.unsplash.com/photo-1660557989695-14fac79c086d?auto=format&fit=crop&w=1200&q=80' };
const groupAlts = { 'Cruise Industry':'Cruise ship at sea', 'Merchant Navy':'Commercial cargo ship at sea', 'Aviation':'Passenger aircraft cabin', 'Hospitality':'Hotel reception desk' };
export function industryCards() { return `<div class="industry-grid">${courseGroups.map(g=>`<article class="industry-card reveal"><a href="${g.parentPath}" class="industry-photo">${image({src:groupImages[g.name],alt:groupAlts[g.name],slot:`${g.name} industry card. Replace with approved NGA photograph.`,width:900,height:650})}</a><div class="industry-content">${g.trending?'<span class="trending-badge">Most Trending</span>':''}<h3><a href="${g.parentPath}">${esc(g.name)}</a></h3><p>Explore ${subcourses.filter(c=>c.parent===g.name).length === 1 ? 'the course' : 'the courses'} in ${esc(g.name)}.</p><a class="text-link" href="${g.parentPath}">View Courses ${icon('arrow')}</a></div></article>`).join('')}</div>`; }

export function coursesHubPage() {
  const crumbs=[{name:'Courses',path:'/courses/'}];
  const content=`<section class="page-hero compact-hero"><div class="page-hero-media">${image({src:images.ocean,alt:'Open sea at sunset',slot:'Courses hub hero',width:1800,height:700,eager:true})}</div><div class="hero-shade"></div><div class="container page-hero-content"><span class="eyebrow light">Explore your options</span><h1>Choose the industry that matches your ambition.</h1><p>Explore Cruise Industry, Merchant Navy, Aviation and Hospitality courses.</p>${button('Explore All Courses','/courses/all/','gold')}</div></section>${breadcrumbs(crumbs)}
  <section class="section"><div class="container">${sectionHead('Choose your direction','Four industries. Your next step.','Choose an industry to see its courses.')}${industryCards()}</div></section>
  <section class="section section-muted"><div class="container">${sectionHead('Quick comparison','See the difference at a glance.','Use this as an orientation, not a final eligibility decision.')}<div class="responsive-table"><table class="comparison-table"><thead><tr><th>Course</th><th>Industry</th><th>Minimum eligibility</th></tr></thead><tbody>${subcourses.map(c=>`<tr><td data-label="Course"><a href="${c.path}">${esc(c.name)}</a></td><td data-label="Industry">${esc(c.parent)}</td><td data-label="Minimum eligibility">[CONFIRM: Minimum eligibility]</td></tr>`).join('')}</tbody></table></div></div></section>
  ${faqBlock(generalFaqs.slice(0,4),'Questions about courses.','Ask the NGA team for the information you need.')}${ctaBand('Compare your options with an advisor.','Tell us your interests and we will help you explore the available courses.')}`;
  return layout({title:'Cruise, Navy, Aviation and Hospitality Courses | NGA',description:'Explore courses in Cruise Industry, Merchant Navy, Aviation and Hospitality with National Global Academy.',path:'/courses/',content,schemas:[breadcrumbSchema(crumbs),faqSchema(generalFaqs.slice(0,4))]});
}

export function allCoursesPage() {
 const crumbs=[{name:'Courses',path:'/courses/'},{name:'Explore All Courses',path:'/courses/all/'}];
 const groups=[['12 Months Courses','12 Months'],['6 Months Courses','6 Months'],['2 Months Courses','2 Months'],['30 Days Courses','30 days']];
 const content=`<section class="editorial-hero"><div class="container"><span class="eyebrow light">Explore all courses</span><h1>Find a course that fits your plans.</h1><p>Explore our courses by duration, from longest to shortest.</p></div></section>${breadcrumbs(crumbs)}<section class="section"><div class="container">${groups.map(([heading,duration])=>`<section class="subcourse-group"><div class="subcourse-group-heading"><h2>${heading}</h2></div><div class="subcourse-grid">${subcourses.filter(c=>c.duration===duration).map(subcourseCard).join('')}</div></section>`).join('')}</div></section>`;
 return layout({title:'Explore All Courses by Duration | NGA',description:'Explore courses in Cruise Industry, Merchant Navy, Aviation and Hospitality, grouped by course duration.',path:'/courses/all/',content,schemas:[breadcrumbSchema(crumbs)]});
}

export function coursePage(course) {
 const map={'cruise-line-hospitality':'Cruise Industry','merchant-navy':'Merchant Navy','aviation':'Aviation','hospitality':'Hospitality'};
 const name=map[course.slug];
 if(!name) return layout({title:'Course Template | NGA',description:'Course template for National Global Academy.',path:course.path,content:'<section class="editorial-hero"><div class="container"><h1>Course template</h1><p>[CONFIRM: Course information]</p></div></section>',noindex:true});
 const group=courseGroups.find(g=>g.name===name), crumbs=[{name:'Courses',path:'/courses/'},{name,path:group.parentPath}];
 const content=`<section class="page-hero compact-hero"><div class="page-hero-media">${image({src:groupImages[name],alt:groupAlts[name],slot:`${name} industry hero`,width:1800,height:800,eager:true})}</div><div class="hero-shade"></div><div class="container page-hero-content">${group.trending?'<span class="eyebrow light">Most Trending</span>':''}<h1>${esc(name)}</h1><p>Explore ${esc(name)} courses at National Global Academy.</p></div></section>${breadcrumbs(crumbs)}<section class="section"><div class="container">${groupedSubcourses(name)}</div></section>${ctaBand(`Explore ${name} with the NGA team.`, 'Speak with our team about the courses that interest you.')}`;
 return layout({title:`${name} Courses | National Global Academy`,description:`Explore ${name} courses at National Global Academy.`,path:group.parentPath,content,schemas:[breadcrumbSchema(crumbs)]});
}
