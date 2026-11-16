(()=>{
 const toggle=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('[data-nav]');
 if(toggle&&nav)toggle.addEventListener('click',()=>{let open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open)});
 // Respect reduced-motion preferences and avoid playing videos off screen.
 const videos=[...document.querySelectorAll('[data-stock-video]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const setVideo=(v,on)=>{if(on&&!reduced.matches)v.play().catch(()=>{});else v.pause()};
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>setVideo(e.target,e.isIntersecting)),{threshold:.15});videos.forEach(v=>observer.observe(v))}else videos.forEach(v=>setVideo(v,true));
 reduced.addEventListener?.('change',()=>videos.forEach(v=>{if(reduced.matches)v.pause();else if(v.getBoundingClientRect().top<innerHeight&&v.getBoundingClientRect().bottom>0)v.play().catch(()=>{})}));
 const marquee=document.querySelector('[data-logo-marquee]');
 if(marquee&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const items=[...marquee.querySelectorAll('.employer-logo-item')];marquee.classList.add('is-animated');let active=false,id=0,last=0;const draw=now=>{if(!active)return;if(now-last>25){const e=marquee.getBoundingClientRect();for(const item of items){let b=item.getBoundingClientRect(),inside=Math.min(b.left-e.left,e.right-b.right);item.style.opacity=String(Math.max(0,Math.min(1,(inside-4)/18)))}last=now}id=requestAnimationFrame(draw)};const run=visible=>{if(visible&&!active){active=true;id=requestAnimationFrame(draw)}else if(!visible&&active){active=false;cancelAnimationFrame(id)}};if('IntersectionObserver'in window)new IntersectionObserver(e=>run(e[0].isIntersecting)).observe(marquee);else run(true)}
 // Verified faculty data can be swapped without changing the page template.
 const team=document.querySelector('#nga-team');
 if(team)fetch('/assets/team.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
  if(!Array.isArray(data?.profiles)||!data.profiles.length)return;
  team.replaceChildren(...data.profiles.map(profile=>{
   const card=document.createElement('article');card.className='nga-white';
   if(profile.photo && /^\/assets\/[a-zA-Z0-9_./-]+$/.test(profile.photo)){const img=document.createElement('img');img.src=profile.photo;img.alt=profile.name?String(profile.name):String(profile.role||'Team member');img.loading='lazy';card.append(img)}
   if(profile.name){let h=document.createElement('h3');h.textContent=String(profile.name);card.append(h)}
   const role=document.createElement(profile.name?'h4':'h3');role.textContent=String(profile.role||'');card.append(role);
   if(profile.credentials){const c=document.createElement('p');c.textContent=String(profile.credentials);card.append(c)}
   const p=document.createElement('p');p.textContent=String(profile.description||'');card.append(p);return card;
  }));
 }).catch(()=>{});
 for(const form of document.querySelectorAll('[data-enquiry-form]'))form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;let data=Object.fromEntries(new FormData(form));data.source=location.pathname;fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}).catch(()=>{});let labels=[['name','Name'],['age','Age'],['location','Location'],['qualification','Highest Qualification'],['experience','Experience'],['stcw','STCW'],['mobile','Mobile no.'],['email','Email'],['interest','Interested in'],['help','What would you like help with?']];let message=['Hello National Global Academy, I would like free counselling.',...labels.map(([k,l])=>`${l}: ${k==='mobile'?'+91 ':''}${data[k]||''}`)].join('\n');let wa='https://wa.me/'+encodeURIComponent(form.dataset.whatsapp)+'?text='+encodeURIComponent(message);window.open(wa,'_blank','noopener');form.querySelector('.form-status').textContent='Your WhatsApp enquiry is ready. Please send the message to NGA.'});
})();
