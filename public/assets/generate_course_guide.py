"""Generate the dependency-free, text-based NGA course planning PDF."""
from pathlib import Path
from textwrap import wrap

OUT = Path(__file__).with_name('national-global-academy-course-guide.pdf')
NAVY = '0.031 0.149 0.220'
GOLD = '0.831 0.694 0.427'
INK = '0.078 0.169 0.216'
SLATE = '0.325 0.392 0.427'

pages = [
    ('NATIONAL GLOBAL ACADEMY\nCOURSE PLANNING GUIDE', [
        'Explore your career interests with the NGA team.',
        'Cruise Industry | Merchant Navy | Aviation | Hospitality',
        '',
        'Choose an industry and compare the available courses.',
        'Ask for current course requirements and the full course details.',
        'Discuss your plans with a parent or guardian.',
        '',
        'New batches start every month. Seats are limited.',
        'Phone and WhatsApp: +91 8858334842',
        'Email: support@nationalglobalacademy.com',
        'nationalglobalacademy.com'
    ]),
    ('01 | QUESTIONS TO ASK', [
        'Which course interests me most? _______________________________',
        'What is included in the course? _______________________________',
        'What is the confirmed duration? _______________________________',
        'What is the confirmed minimum eligibility? ____________________',
        'Which documents should I bring? _______________________________',
        'When does the next batch start? _______________________________',
        '',
        'Speak to the NGA team to discuss your course choices.',
        'Phone and WhatsApp: +91 8858334842',
        'Email: support@nationalglobalacademy.com'
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
