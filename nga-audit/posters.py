from PIL import Image, ImageDraw, ImageFont, ImageOps
import pathlib,requests,io,json
root=pathlib.Path('/home/user/national-global-academy');courses=json.load(open('/home/user/nga-audit/subcourses.json'))
logo=Image.open(root/'public/assets/national-global-academy-logo.png').convert('RGB')
serif='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf';sans='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
taglines=['Interview training and job profile guidance','Interview preparation and department choice','Hospitality, service and industrial training','Sponsorship and industry level experience','Aviation operations and cabin crew preparation','Professional skills and career preparation']
for c,tag in zip(courses,taglines):
 r=requests.get(c['image'],timeout=30);r.raise_for_status(); pic=Image.open(io.BytesIO(r.content)).convert('RGB'); pic=ImageOps.fit(pic,(1200,650),method=Image.Resampling.LANCZOS,centering=(.5,.5))
 canvas=Image.new('RGB',(1200,1200),'#082638');canvas.paste(pic,(0,0));
 shade=Image.new('RGBA',(1200,650));px=shade.load()
 for y in range(650):
  alpha=int(20+125*(y/650)**2)
  for x in range(1200):px[x,y]=(5,22,34,alpha)
 canvas=canvas.convert('RGBA');canvas.alpha_composite(shade,(0,0));d=ImageDraw.Draw(canvas);d.rectangle((0,650,1200,1200),fill='#082638');d.rectangle((60,640,1140,648),fill='#d5b574')
 # Exact NGA logo, unchanged, against its white background.
 brand=ImageOps.contain(logo,(380,106),Image.Resampling.LANCZOS);canvas.paste(brand,(60,26)); d=ImageDraw.Draw(canvas)
 d.text((62,680),c['parent'].upper(),font=ImageFont.truetype(bold,23),fill='#e2c58b')
 font=ImageFont.truetype(serif,49); words=c['name'].split(' '); lines=[];line=''
 for word in words:
  t=(line+' '+word).strip()
  if d.textlength(t,font=font)>1040 and line: lines.append(line);line=word
  else:line=t
 lines.append(line);y=735
 for line in lines:d.text((60,y),line,font=font,fill='white');y+=70
 d.rounded_rectangle((60,y+13,260,y+65),radius=5,fill='#d5b574');d.text((76,y+22),c['duration'],font=ImageFont.truetype(bold,22),fill='#082638')
 d.text((60,y+98),tag,font=ImageFont.truetype(sans,25),fill='#e9edf0')
 # Simple, original geometric accent, not a copy of any competitor layout.
 d.line((60,1150,1140,1150),fill='#a98b55',width=2)
 file=c['path'].strip('/').split('/')[-1]+'.jpg';canvas.convert('RGB').save(root/'public/assets/posters'/file,quality=88,optimize=True)
 print(file)
