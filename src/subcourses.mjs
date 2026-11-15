import { subcourses, courseGroups } from './subcourses-data.mjs';
import { site, whatsappUrl } from '../site.config.mjs';
import { esc, image, icon, layout, breadcrumbs, breadcrumbSchema } from './components.mjs';

const enquiryUrl = course => `/admissions/?course=${encodeURIComponent(course.name)}#enquiry`;
const courseWhatsApp = course => whatsappUrl(`Hello National Global Academy, I would like to enquire about ${course.name}.`);
const poster = (course, eager = false) => image({src:course.image,alt:course.imageAlt,slot:course.imageSlot,width:1200,height:800,eager});
const heading = (course, tag) => `<div class="subcourse-heading"><${tag}>${esc(course.name)}</${tag}>${course.duration ? `<span class="duration-badge">${esc(course.duration)}</span>` : ''}</div>`;
const list = (items) => `<ul class="subcourse-list">${items.map(item=>`<li>${icon('check')}<span>${esc(item)}</span></li>`).join('')}</ul>`;
const actions = course => `<div class="subcourse-actions"><a class="btn btn-navy" href="${enquiryUrl(course)}">Enquire Now</a><a class="btn btn-whatsapp" href="${courseWhatsApp(course)}" target="_blank" rel="noopener">WhatsApp ${icon('whatsapp')}</a></div>`;

export function subcourseCard(course) {
  return `<article class="subcourse-card reveal" data-subcourse="${esc(course.name)}"><a href="${course.path}" class="subcourse-poster" tabindex="-1" aria-hidden="true">${poster(course)}</a><div class="subcourse-card-body">${heading(course,'h3')}<p class="subcourse-description">${esc(course.description)}</p><h4>What is included</h4>${list(course.inclusions.slice(0,3))}${actions(course)}<a class="text-link subcourse-view" href="${course.path}">View Course ${icon('arrow')}<span class="sr-only">: ${esc(course.name)}</span></a></div></article>`;
}

export function groupedSubcourses(onlyParent = null) {
  return courseGroups.filter(group=>!onlyParent || group.name === onlyParent).map(group=>`<section class="subcourse-group" id="group-${group.name.toLowerCase().replace(/\s+/g,'-')}"><div class="subcourse-group-heading"><h2>${esc(group.name)}</h2>${group.trending ? '<span class="trending-badge">Most Trending</span>' : ''}</div><div class="subcourse-grid">${subcourses.filter(c=>c.parent===group.name).map(subcourseCard).join('')}</div></section>`).join('');
}

export function subcoursePage(course) {
  const group = courseGroups.find(g=>g.name===course.parent);
  let related = subcourses.filter(c=>c.parent===course.parent && c.path!==course.path);
  if (!related.length) related = courseGroups.filter(g=>g.name!==course.parent).map(g=>({name:g.name,path:`/courses/#group-${g.name.toLowerCase().replace(/\s+/g,'-')}`}));
  const crumbs = [{name:'Courses',path:'/courses/'},{name:group.name,path:group.parentPath},{name:course.name,path:course.path}];
  const content = `${breadcrumbs(crumbs)}<section class="subcourse-detail section"><div class="container subcourse-detail-wrap"><div class="subcourse-detail-poster">${poster(course,true)}</div><div class="subcourse-detail-content">${heading(course,'h1')}<p class="subcourse-description">${esc(course.description)}</p><h2>What is included</h2>${list(course.inclusions)}${actions(course)}</div></div></section><section class="section related-section"><div class="container"><h2 class="small-section-title">Related Courses</h2><div class="related-links">${related.map(c=>`<a href="${c.path}">${esc(c.name)} ${icon('arrow')}</a>`).join('')}</div></div></section>`;
  const schema = {'@context':'https://schema.org','@type':'Course',name:course.name,description:course.inclusions.join('\n'),url:`${site.domain}${course.path}`,provider:{'@type':'EducationalOrganization',name:site.name,url:site.domain}};
  if (course.duration) schema.hasCourseInstance = {'@type':'CourseInstance',courseWorkload:course.isoDuration};
  return layout({title:course.name,description:`${course.name}${course.duration ? ` — ${course.duration}` : ''}. ${course.parent}.`,path:course.path,content,image:course.image,schemas:[schema,breadcrumbSchema(crumbs)]});
}
