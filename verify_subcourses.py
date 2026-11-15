import json, subprocess
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse,parse_qs
root=Path('/home/user/national-global-academy')
data=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {subcourses} from './src/subcourses-data.mjs'; console.log(JSON.stringify(subcourses));"],cwd=root,text=True))
expected=[
['Interview training','100% Placement Support','E-learning','International cruise interview preparation','Detailed job profile guidance'],
['E-Learning Exam + Exit Exam','Professional Resume by Industry Experts','30 Days Personalized Interview Preparation','100% Job Support Opportunity','Detailed Job Profile Guidance','Choose Your Preferred Department: Food & Beverage Service, Housekeeping, or Kitchen Operations (Culinary)'],
['Restaurant Service, Bar Service, Housekeeping Certification Course','Professional Interview Preparation','Detailed Job Profile Guidance','6 Month Industrial Training (With Stipend)','100% Job Placement Support (Domestic - International)','Principles of Hospitality','Guest Relations & Complaint Mgmt.','Food & Beverage Service','Hotel & Restaurant Operations','Professional Etiquette & Dining'],
['100% Sponsorship','100% Placement Support (Domestic - International)','Global Career Opportunities','Industry Level Experience Training'],
['Civil Aviation & Structure','Airport Terminal Operations','Baggage & Cargo Management','Safety & Security Procedures','Global Aviation Regulations','Cabin Crew Mock-up Training','Grooming & Etiquette Workshops','On site Airport Visit','Role playing Exercises'],
['Professional Grooming & Styling','Confidence & Public Speaking','Body Language & Posture','Advanced Communication Skills','Resume Building Workshops','Mock Interview Sessions','Industry Interaction Programs','Placement Assistance','Career Counseling']]
names=['Cruise Career Fast Track Program','Cruise Career Professional Program','Diploma in Cruise & Hospitality Management (DCHM)','GP Rating','Diploma In Aviation','Diploma in hotel management']
durations=['30 days','2 Months',None,'6 Months','12 Months','12 Months']
assert [c['name'] for c in data]==names
sitemap=(root/'dist/sitemap.xml').read_text()
for base in ['index.html','courses/index.html']:
 soup=BeautifulSoup((root/'dist'/base).read_text(),'html.parser')
 cards=soup.select('article.subcourse-card'); assert len(cards)==6,(base,len(cards))
 assert [c.get('data-subcourse') for c in cards]==names
 for i,(card,c) in enumerate(zip(cards,data)):
  assert [li.get_text(' ',strip=True) for li in card.select('.subcourse-list li')]==expected[i][:3]
  assert card.select_one('a.subcourse-view')['href']==c['path']
  assert (card.select_one('.duration-badge').get_text(strip=True) if card.select_one('.duration-badge') else None)==durations[i]
  assert parse_qs(urlparse(card.select_one('a.btn-navy')['href']).query)['course']==[names[i]]
  assert parse_qs(urlparse(card.select_one('a.btn-whatsapp')['href']).query)['text'][0].endswith(names[i]+'.')
  assert c['path'] in sitemap
soup=BeautifulSoup((root/'dist/admissions/index.html').read_text(),'html.parser')
for sel in soup.select('form[data-enquiry-form] select[name=interest]'):
 assert [o.get_text(strip=True) for o in sel.select('option')]==['Choose a pathway']+names+['Not Sure Yet']
for i,c in enumerate(data):
 soup=BeautifulSoup((root/'dist'/c['path'].strip('/')/'index.html').read_text(),'html.parser')
 detail=soup.select_one('.subcourse-detail-content'); assert detail.h1.get_text(strip=True)==names[i]
 assert [li.get_text(' ',strip=True) for li in detail.select('.subcourse-list li')]==expected[i]
 assert (detail.select_one('.duration-badge').get_text(strip=True) if detail.select_one('.duration-badge') else None)==durations[i]
 assert parse_qs(urlparse(detail.select_one('a.btn-navy')['href']).query)['course']==[names[i]]
 assert parse_qs(urlparse(detail.select_one('a.btn-whatsapp')['href']).query)['text'][0].endswith(names[i]+'.')
 schemas=json.loads(soup.select_one('script[type="application/ld+json"]').string); course=[s for s in schemas if s.get('@type')=='Course']; assert len(course)==1
 assert course[0]['description'].split('\n')==expected[i]
 assert ('hasCourseInstance' in course[0])==(durations[i] is not None)
 assert soup.select_one('.subcourse-detail-poster img')['alt']
 print('PASS',names[i],len(expected[i]),'exact inclusions, detail, links and schema')
print('PASS home & hub: 6 grouped cards, first 3 inclusions, names, links, durations; all enquiry options; sitemap')
