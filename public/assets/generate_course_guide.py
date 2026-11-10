"""Generate the dependency-free, text-based NGA course planning PDF."""
from pathlib import Path
from textwrap import wrap

OUT = Path(__file__).with_name('national-global-academy-course-guide.pdf')
NAVY = '0.031 0.149 0.220'
GOLD = '0.831 0.694 0.427'
INK = '0.078 0.169 0.216'
SLATE = '0.325 0.392 0.427'

pages = [
    ('YOUR SEA-CAREER\nPLANNING GUIDE', [
        'Cruise Line | Merchant Navy | GP Rating',
        'A practical workbook for Indian students and parents - 2026 edition',
        '',
        'Use this guide before you choose a course or pay a fee:',
        '- Compare daily work, not only salary claims.',
        '- Verify academic and medical eligibility early.',
        '- Ask for complete costs and refund terms in writing.',
        '- Remember: training and guidance do not guarantee employment.',
        '',
        'National Global Academy',
        'Training and career guidance after Class 10 and Class 12',
        'January Batch / July Batch',
        '[CONFIRM: Phone | Email | Academy address]'
    ]),
    ('01 | COMPARE THE WORK', [
        'CRUISE LINE HOSPITALITY',
        'Work: Guest service, food and beverage, housekeeping, culinary support.',
        'Good fit: Communication, service mindset, grooming, cultural adaptability.',
        'Reality: Long shifts, shared accommodation and months away from home.',
        '',
        'MERCHANT NAVY',
        'Work: Commercial vessel deck, engine, rating and operational roles.',
        'Good fit: Technical interest, routines, teamwork and safety discipline.',
        'Reality: Medical/certification rules, contract gaps and watch duties.',
        '',
        'GP RATING',
        'Work: Entry deck and engine rating support after recognised training.',
        'Good fit: Hands-on tasks, maintenance, seamanship and practical learning.',
        'Reality: Certification supports eligibility but does not ensure selection.',
        '',
        'FAMILY DISCUSSION',
        'Which daily tasks interest the student? ___________________________',
        'Which parts of onboard life need more discussion? ________________',
        'What is our backup plan if selection takes time? ___________________'
    ]),
    ('02 | ELIGIBILITY & DOCUMENTS', [
        'CHECK BEFORE PAYING',
        '[ ] Class 10 / Class 12 subjects and marks verified for the exact route.',
        '[ ] Age confirmed against the current course and employer criteria.',
        '[ ] Eyesight, colour vision and physical standards investigated early.',
        '[ ] Marine medical requirements checked as per current DG Shipping',
        '    guidelines and through the appropriate approved channel.',
        '[ ] Institution, course and certification independently verified.',
        '',
        'DOCUMENT FOLDER',
        '[ ] Class 10 marksheet and certificate',
        '[ ] Class 12 marksheet and certificate, if applicable',
        '[ ] Government photo ID and address proof',
        '[ ] Passport, if available; passport-size photographs',
        '[ ] Age/birth proof and relevant medical records',
        '[ ] Course-specific originals and copies requested in writing',
        '',
        'Never share OTPs, passwords or originals through an unverified chat.'
    ]),
    ('03 | COMPLETE FEE WORKSHEET', [
        'Ask each provider to fill this in and provide a dated receipt.',
        '',
        'Tuition / preparation: __________________  Tax extra? ____________',
        'Registration / admission: _______________  Refundable? ___________',
        'Recognised external course: _____________  Payable to: ___________',
        'Hostel and meals: ______________________  Months: ______________',
        'Uniform / books / kit: __________________  Included? _____________',
        'Medical / documents: ___________________  Provider: _____________',
        'Examination / certification: ____________  Included? _____________',
        'Travel / visa / joining: _________________  Payable to: ___________',
        '',
        'TOTAL PLANNED BUDGET: _________________________________________',
        '',
        'REFUND QUESTIONS',
        'What happens if we withdraw? ___________________________________',
        'What happens if medical eligibility is not met? __________________',
        'Which charges are non-refundable, and why? _______________________',
        '',
        '[CONFIRM: Request current NGA fees and inclusions directly.]'
    ]),
    ('04 | SAFE APPLICATION CHECKLIST', [
        'A LEGITIMATE PROCESS',
        '1. Choose a department and prepare a factual CV.',
        '2. Verify the institution, vacancy and hiring channel independently.',
        '3. Complete interviews and selection without a guaranteed-job promise.',
        '4. Review salary, deductions, contract length and joining expenses.',
        '5. Keep receipts, offer documents and family emergency contacts.',
        '',
        'WARNING SIGNS',
        '- "Pay today and your ship job is confirmed."',
        '- Payment to an unexplained personal bank account.',
        '- No written fee sheet, refund terms or verifiable interview.',
        '- Pressure to hide information from parents or submit false records.',
        '- Approval, affiliation or placement claims with no proof.',
        '',
        'NEXT STEP: BOOK FREE COUNSELLING',
        'Bring your marksheets and this checklist. Parents are welcome.',
        '[CONFIRM: Insert official NGA phone and WhatsApp number.]',
        'nationalglobalacademy.com',
        '',
        'Salary figures on the website are indicative industry ranges only.',
        'National Global Academy provides training and career guidance.'
    ])
]

def esc(text):
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

objects = []
def add(data):
    objects.append(data)
    return len(objects)

font_regular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
font_bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>')
font_serif = add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>')
page_ids = []
content_ids = []

for index, (title, lines) in enumerate(pages):
    stream = [f'{NAVY} rg 0 730 612 112 re f', f'{GOLD} rg 48 715 42 3 re f']
    title_lines = title.split('\n')
    y = 785
    for line in title_lines:
        stream.append(f'BT /F3 {24 if index == 0 else 19} Tf 1 1 1 rg 48 {y} Td ({esc(line)}) Tj ET')
        y -= 29
    y = 682
    for line in lines:
        if not line:
            y -= 12
            continue
        is_heading = line.isupper() and len(line) < 55
        is_first = index == 0 and line in (lines[0], lines[1])
        size = 12 if is_heading else (12 if is_first else 10)
        font = '/F2' if is_heading else '/F1'
        color = NAVY if is_heading else (INK if is_first else SLATE)
        wrapped = wrap(line, width=78, subsequent_indent='    ') or ['']
        for wrapped_line in wrapped:
            stream.append(f'BT {font} {size} Tf {color} rg 48 {y} Td ({esc(wrapped_line)}) Tj ET')
            y -= 17 if is_heading else 15
        if is_heading:
            y -= 6
    stream.append(f'BT /F1 8 Tf {SLATE} rg 48 30 Td (National Global Academy | Course Planning Guide | Page {index+1} of {len(pages)}) Tj ET')
    data = '\n'.join(stream).encode('latin-1')
    content_id = add(b'<< /Length ' + str(len(data)).encode() + b' >>\nstream\n' + data + b'\nendstream')
    content_ids.append(content_id)
    page_id = add(f'<< /Type /Page /Parent PAGES /MediaBox [0 0 612 842] /Resources << /Font << /F1 {font_regular} 0 R /F2 {font_bold} 0 R /F3 {font_serif} 0 R >> >> /Contents {content_id} 0 R >>')
    page_ids.append(page_id)

pages_id = add(f'<< /Type /Pages /Count {len(page_ids)} /Kids [{" ".join(f"{p} 0 R" for p in page_ids)}] >>')
for page_id in page_ids:
    objects[page_id-1] = objects[page_id-1].replace('PAGES', f'{pages_id} 0 R')
catalog_id = add(f'<< /Type /Catalog /Pages {pages_id} 0 R >>')
info_id = add('<< /Title (NGA Sea-Career Planning Guide 2026) /Author (National Global Academy) /Subject (Course comparison, eligibility and fee worksheet) >>')

pdf = bytearray(b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n')
offsets = [0]
for i, obj in enumerate(objects, 1):
    offsets.append(len(pdf))
    if isinstance(obj, str):
        obj = obj.encode('latin-1')
    pdf.extend(f'{i} 0 obj\n'.encode() + obj + b'\nendobj\n')
xref = len(pdf)
pdf.extend(f'xref\n0 {len(objects)+1}\n'.encode())
pdf.extend(b'0000000000 65535 f \n')
for offset in offsets[1:]:
    pdf.extend(f'{offset:010d} 00000 n \n'.encode())
pdf.extend(f'trailer\n<< /Size {len(objects)+1} /Root {catalog_id} 0 R /Info {info_id} 0 R >>\nstartxref\n{xref}\n%%EOF\n'.encode())
OUT.write_bytes(pdf)
print(f'Generated {OUT.name}: {len(pdf):,} bytes, {len(pages)} pages')
