from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs
import subprocess,json,re
R=Path('/home/user/national-global-academy'); D=R/'dist'; data=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {subcourses} from './src/subcourses-data.mjs';console.log(JSON.stringify(subcourses));"],cwd=R,text=True))
names=['Cruise Career Fast Track Program','Cruise Career Professional Program','Diploma in Cruise and Hospitality Management (DCHM)','GP Rating','Diploma In Aviation','Diploma in hotel management'];durations=['30 days','2 Months','12 Months','6 Months','12 Months','12 Months']
expected=[['Interview training','100% Placement Support','E-learning','International cruise interview preparation','Detailed job profile guidance'],['E-Learning Exam + Exit Exam','Professional Resume by Industry Experts','30 Days Personalized Interview Preparation','100% Job Support Opportunity','Detailed Job Profile Guidance','Choose Your Preferred Department: Food and Beverage Service, Housekeeping, or Kitchen Operations (Culinary)'],['Restaurant Service, Bar Service, Housekeeping Certification Course','Professional Interview Preparation','Detailed Job Profile Guidance','6 Month Industrial Training (With Stipend)','100% Job Placement Support (Domestic and International)','Principles of Hospitality','Guest Relations and Complaint Mgmt.','Food and Beverage Service','Hotel and Restaurant Operations','Professional Etiquette and Dining'],['100% Sponsorship','100% Placement Support (Domestic and International)','Global Career Opportunities','Industry Level Experience Training'],['Civil Aviation and Structure','Airport Terminal Operations','Baggage and Cargo Management','Safety and Security Procedures','Global Aviation Regulations','Cabin Crew Mock-up Training','Grooming and Etiquette Workshops','On site Airport Visit','Role playing Exercises'],['Professional Grooming and Styling','Confidence and Public Speaking','Body Language and Posture','Advanced Communication Skills','Resume Building Workshops','Mock Interview Sessions','Industry Interaction Programs','Placement Assistance','Career Counseling']]
assert [x['name'] for x in data]==names and [x['duration'] for x in data]==durations
read=lambda path:BeautifulSoup((D/path).read_text(),'html.parser')
home=read('index.html'); hub=read('courses/index.html'); allcourses=read('courses/all/index.html')
assert len(hub.select('.industry-card'))==4 and not hub.select('.subcourse-card')
assert [(x.h2.text.strip(),len(x.select('.subcourse-card'))) for x in allcourses.select('.subcourse-group')]==[('12 Months Courses',3),('6 Months Courses',1),('2 Months Courses',1),('30 Days Courses',1)]
assert len(home.select('.subcourse-card'))==6
assert len(home.select('.employer-logos img'))==11 and not home.select('.marquee-track')
assert (R/'public/assets/national-global-academy-logo.png').read_bytes()==Path('/home/user/uploads/national-global-academy-live-logo-cropped-white.png').read_bytes()
for page in D.rglob('*.html'):
 soup=BeautifulSoup(page.read_text(),'html.parser'); assert soup.select_one('link[rel=icon]') is None or soup.select_one('link[rel=icon]')['href']=='/assets/national-global-academy-logo.png'
 for sc in soup.select('script,style'):sc.decompose()
 visible=soup.get_text(' ',strip=True); assert '—' not in visible and not re.search(r'\s-\s',visible),str(page)
 assert not re.search(r'DG Shipping|medical fitness|eyesight|colour vision',visible,re.I),str(page)
 assert not re.search(r'guarantee.{0,35}(job|recruit|employ|earn|salary|vacan|income)|(job|recruit|employ|earn|salary|vacan|income).{0,35}guarantee',visible,re.I),str(page)
 assert 'November Batch' not in visible
for c,inc in zip(data,expected):
 soup=read(c['path'].strip('/')+'/index.html'); detail=soup.select_one('.subcourse-detail-content'); assert detail.h1.get_text(strip=True)==c['name'];assert detail.select_one('.duration-badge').get_text(strip=True)==c['duration']
 assert [e.get_text(' ',strip=True) for e in detail.select('.subcourse-list li')]==inc
 assert detail.select_one('.course-minimum').get_text(' ',strip=True)=='Minimum eligibility [CONFIRM: Minimum eligibility]'
 assert parse_qs(urlparse(detail.select_one('.btn-navy')['href']).query)['course']==[c['name']]
 assert parse_qs(urlparse(detail.select_one('.btn-whatsapp')['href']).query)['text'][0].endswith(c['name']+'.')
 assert soup.select_one('.subcourse-detail-poster img')['src'].startswith('/assets/posters/')
 schema=[x for x in json.loads(soup.select_one('script[type="application/ld+json"]').string) if x.get('@type')=='Course'];assert len(schema)==1 and schema[0]['description'].split('\n')==inc and schema[0]['hasCourseInstance']['courseWorkload']==c['isoDuration']
 print('PASS:',c['name'],c['duration'],len(inc),'exact inclusions')
for parent,path in [('Cruise Industry','courses/cruise-line-hospitality/index.html'),('Merchant Navy','courses/merchant-navy/index.html'),('Aviation','courses/aviation/index.html'),('Hospitality','courses/hospitality/index.html')]:
 soup=read(path);cards=soup.select('.subcourse-card'); assert [c['data-subcourse'] for c in cards]==[c['name'] for c in data if c['parent']==parent]
for card in home.select('.subcourse-card')+allcourses.select('.subcourse-card'):
 n=card['data-subcourse'];i=names.index(n);assert [x.get_text(' ',strip=True) for x in card.select('.subcourse-list li')]==expected[i][:3];assert card.select_one('.subcourse-view')['href']==data[i]['path']
for select in read('admissions/index.html').select('[data-enquiry-form] select[name=interest]'):
 assert [x.get_text(strip=True) for x in select.select('option')]==['Choose a pathway']+names+['Not Sure Yet']
assert len(home.select('.planning-section table'))==0
assert [h.get_text(strip=True) for h in read('about/index.html').select('.role-only h3')]==['Academic and Maritime Guidance','Student and Parent Counselling','Hospitality and Interview Preparation']
print('PASS: hub, industry filters, duration groups, 6 detail pages, minimum eligibility, posters, dropdown, home, salary table, logos and copy scan.')
