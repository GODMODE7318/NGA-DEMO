from pathlib import Path
import re
p=Path('src/components.mjs');s=p.read_text();s=s.replace("const list = faqs.map(f => Array.isArray(f) ? {q:f[0],a:f[1]} : f);", "const list = faqs.map(f => Array.isArray(f) ? {q:f[0],a:f[1]} : f).filter(f => !/guarantee|eyesight|colour vision|DG Shipping/i.test(f.q + ' ' + f.a));")
p.write_text(s)
p=Path('src/careers.mjs');s=p.read_text()
changes={
' No recruiter can ethically guarantee selection.':'',
'Be wary of guaranteed selection, pressure payments, personal bank accounts, no interview, vague employer details or a job offer without a verifiable process.':'Be wary of pressure payments, personal bank accounts, vague employer details or a job offer without a verifiable process.',
'<li>No guarantee of immediate re-contracting</li>':'',
'Complete screening and interviews; an application does not guarantee an offer.':'Complete screening and interviews through the relevant hiring channel.',
'Use current official DG Shipping information and directly confirm the institution, course and certification.':'Directly confirm the institution, course and certification.',
'Academic subjects, age, medical fitness, recognised training and certification can all matter.':'Academic subjects, age, recognised training and certification can all matter.',
'This is a simplified orientation. Always check current DG Shipping guidelines and recognised institution criteria.':'This is a simplified orientation. Check current institution criteria.',
'Recognised pre-sea training, medical fitness and certification requirements apply.':'Recognised training and certification requirements apply.',
'These are indicative industry ranges, not guaranteed National Global Academy outcomes.':'These are indicative industry ranges.',
'A recognised course is not the same as a guaranteed ship job.':'Check the details before you decide.',
'NGA’s role is training and career guidance, not a promise of employment.':'NGA provides training and career guidance.',
'Compensation varies widely. Any salary discussed on this site is an indicative industry range, not a promise of selection or income.':'Compensation varies widely. Any salary discussed on this site is an indicative industry range.',
'Academic and medical standards apply':'Academic standards apply',
'Plan for medical and sea-time requirements':'Plan for relevant training requirements',
'Medical and certification obligations':'Certification obligations'
}
for a,b in changes.items():s=s.replace(a,b)
p.write_text(s)
p=Path('src/articles.mjs');s=p.read_text()
changes={
'Your subjects, medical fitness, chosen department and recognised training route all matter.':'Your subjects, chosen department and recognised training route all matter.',
'<p>This 2026 guide explains the main options without treating a course as a guaranteed job. Rules can change, so always confirm current criteria through <strong>DG Shipping guidelines and the recognised institution</strong> before paying.</p>':'<p>This guide explains the main options. Confirm the current criteria with the recognised institution.</p>',
'Verify the institution and exact course recognition; a similar course title does not guarantee the same outcome.':'Verify the institution and exact course recognition.',
'<li><strong>Medical:</strong> Vision, colour perception and physical standards matter, especially for deck routes. Follow current DG Shipping guidelines and use the appropriate approved medical channel.</li>':'',
'<li><strong>Investigate medical eligibility early.</strong> This can prevent a costly wrong turn.</li>':'',
'obtain the current academic and medical criteria in writing':'obtain the current academic criteria in writing',
'Never interpret a counselling letter as a guaranteed job.':'Ask for the details of the process in writing.',
', not guaranteed salaries or NGA placement outcomes': '',
', not a National Global Academy salary or placement guarantee':'',
', not guaranteed earnings':'',
'Be suspicious of pressure, secret charges and guaranteed joining dates.':'Be suspicious of pressure and secret charges.',
'a real interview process does not become “guaranteed” because someone asks for money.':'verify any interview process independently.',
'It cannot remove employer selection or guarantee a vacancy. Use training to become a stronger candidate, not to buy a promise.':'Use training to build your skills.',
'The recognised pre-sea programme and associated certification should be verified against current DG Shipping information and the institution delivering it.':'Verify the recognised training programme and associated certification with the institution delivering it.',
'Eligibility generally involves Class 10 education plus age, subject/marks, medical and vision requirements. The exact criteria must be checked against <strong>current DG Shipping guidelines and the recognised institution’s current admission notice</strong>.':'Contact the academy and recognised institution for the current requirements for the course.',
'<li>Investigate eyesight, colour vision and physical fitness early.</li>':'',
'<div class="article-callout"><strong>Important:</strong> meeting a consultant’s admission criteria does not override an official medical or certification standard.</div>':'',
'[CONFIRM: Explain the steps without employment guarantees.]':'[CONFIRM: Explain the steps using verified information.]',
'No pressure, and no employment guarantee.':'Parents are welcome to join the conversation.',
', not job or income promises':'',
'<li>Reject any “100% job” or “pay extra for joining” claim.</li>':'<li>Ask for a written explanation of all charges.</li>',
'Verify current official requirements; all salary figures are indicative industry ranges.':'Verify current official requirements; all salary figures are indicative industry ranges.',
'Choose a department, verify academic and medical eligibility':'Choose a department and verify academic eligibility',
'${site.domain}/assets/favicon.svg':'${site.domain}/assets/national-global-academy-logo.png'
}
for a,b in changes.items():s=s.replace(a,b)
p.write_text(s)
p=Path('src/main.js');s=p.read_text().replace("'Discuss medical/physical requirements before paying substantial fees.'", "'Ask the academy for confirmed course requirements.'").replace('Verify marks, age, eyesight, colour vision and physical standards under current rules before shortlisting institutions.', 'Ask the academy for confirmed entry requirements before shortlisting institutions.').replace('subject to marks, age and medical criteria', 'subject to current course requirements').replace('contracts and medical requirements','contracts and course requirements').replace('This result is guidance only—not admission, medical clearance or a job offer.', 'This result is an initial guide. Ask the academy for confirmed course requirements.')
p.write_text(s)
p=Path('site.config.mjs');s=p.read_text().replace('https://images.unsplash.com/photo-1548574505-5e239809ee19','https://images.unsplash.com/photo-1675684319073-dd1a1c3587b8');p.write_text(s)
# Adjust image alt text where stock photos are illustrative rather than real academy personnel.
p=Path('src/company.mjs');s=p.read_text().replace('Academy advisor speaking with students about maritime careers','Two people discussing plans at a desk').replace('Professional training group collaborating in a classroom','People collaborating at a table with laptops').replace('Students preparing for maritime training admissions','People collaborating at a table with laptops');p.write_text(s)
p=Path('src/data.mjs');s=p.read_text().replace('Cargo vessel at port representing GP Rating course career scope','Container terminal representing GP Rating course career scope');p.write_text(s)
# Remove em dashes and spaced hyphen dashes from site copy. Preserve grammatical compound hyphens and identifiers.
# CSS, URLs, hyphenated IDs, regular expressions, exact inclusion items, and ISO duration codes remain intact.
for p in Path('src').glob('*'):
 if p.suffix not in ('.mjs','.js'):continue
 s=p.read_text();s=re.sub(r'\s*—\s*', ', ',s);s=re.sub(r'(?<=\s)-(?=\s)', ',',s);p.write_text(s)
