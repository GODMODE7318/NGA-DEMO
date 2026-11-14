/* NGA — progressive enhancement, accessible interactions and configurable form delivery */
(() => {
  'use strict';
  const config = window.NGA_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Mobile navigation: keyboard closable and scroll locked.
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const closeMenu = () => {
    if (!nav || !menuButton) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('menu-open', open);
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Current navigation context.
  const path = window.location.pathname.replace(/index\.html$/, '');
  document.querySelectorAll('.primary-nav a').forEach(a => {
    if (new URL(a.href, window.location.origin).pathname === path) a.setAttribute('aria-current', 'page');
  });

  // Reveal only when supported; all content remains visible without JavaScript.
  const reveals = document.querySelectorAll('.reveal');
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  // Lightweight hero parallax, disabled for mobile and reduced-motion users.
  const parallax = document.querySelector('[data-parallax]');
  if (parallax && !reducedMotion && window.innerWidth > 900) {
    let ticking = false;
    const update = () => {
      const y = Math.min(window.scrollY, 800);
      parallax.style.transform = `translate3d(0, ${y * 0.13}px, 0) scale(1.06)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  }

  const digits = value => value.replace(/\D/g, '');
  const normaliseIndianMobile = value => {
    let number = digits(value);
    if (number.length === 12 && number.startsWith('91')) number = number.slice(2);
    if (number.length === 11 && number.startsWith('0')) number = number.slice(1);
    return number;
  };
  const validMobile = value => /^[6-9]\d{9}$/.test(normaliseIndianMobile(value));
  const setFieldError = (input, message) => {
    const field = input.closest('.field');
    field?.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    const error = field?.querySelector('.field-error');
    if (error) error.textContent = message;
  };

  const validateEnquiry = form => {
    let valid = true;
    const name = form.elements.name;
    const phone = form.elements.phone;
    const email = form.elements.email;
    const interest = form.elements.interest;
    const qualification = form.querySelector('input[name="qualification"]:checked');
    if (name.value.trim().length < 2) { setFieldError(name, 'Please enter the student’s name.'); valid = false; } else setFieldError(name, '');
    if (!validMobile(phone.value)) { setFieldError(phone, 'Enter a valid 10-digit Indian mobile number.'); valid = false; } else setFieldError(phone, '');
    if (email.value && !email.validity.valid) { setFieldError(email, 'Enter a valid email address or leave this blank.'); valid = false; } else setFieldError(email, '');
    if (!interest.value) { setFieldError(interest, 'Choose a pathway, or select Not Sure.'); valid = false; } else setFieldError(interest, '');
    const qualificationError = form.querySelector('.qualification-error');
    if (!qualification) { qualificationError.textContent = 'Select your last qualification.'; valid = false; } else qualificationError.textContent = '';
    if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  };

  document.querySelectorAll('[data-enquiry-form]').forEach(form => {
    form.querySelectorAll('input,select,textarea').forEach(input => {
      input.addEventListener('input', () => {
        if (input.name !== 'qualification') setFieldError(input, '');
        form.querySelector('.qualification-error').textContent = '';
      });
    });
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!validateEnquiry(form)) return;
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.form-status');
      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());
      payload.phone = `+91${normaliseIndianMobile(payload.phone)}`;
      payload.submittedAt = new Date().toISOString();
      payload.page = window.location.href;
      button.disabled = true;
      button.textContent = 'Sending Your Enquiry…';
      status.className = 'form-status';
      status.textContent = 'Please wait while we prepare your enquiry.';
      try {
        sessionStorage.setItem('nga_enquiry', JSON.stringify(payload));
        if (config.formEndpoint) {
          const response = await fetch(config.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error(`Enquiry endpoint returned ${response.status}`);
          window.location.assign('/thank-you/?status=received');
        } else {
          // Static-safe fallback: never claim server receipt when no endpoint is configured.
          window.location.assign('/thank-you/?status=whatsapp');
        }
      } catch (error) {
        console.error('NGA enquiry delivery:', error);
        button.disabled = false;
        button.textContent = 'Request Free Counselling';
        status.className = 'form-status error';
        status.textContent = 'We could not send this online. Please use the WhatsApp button or call admissions; your entered details remain on this page.';
      }
    });
  });

  // Personalised thank-you state with a prefilled WhatsApp fallback.
  if (document.body.contains(document.querySelector('[data-thank-you-title]'))) {
    const params = new URLSearchParams(window.location.search);
    const received = params.get('status') === 'received';
    const title = document.querySelector('[data-thank-you-title]');
    const message = document.querySelector('[data-thank-you-message]');
    const whatsapp = document.querySelector('[data-thank-you-whatsapp]');
    let enquiry = null;
    try { enquiry = JSON.parse(sessionStorage.getItem('nga_enquiry') || 'null'); } catch (_) { /* no stored data */ }
    if (received) {
      title.textContent = 'Thank you—your enquiry is on its way.';
      message.textContent = 'Our admissions team can now review your details. For an immediate conversation, continue on WhatsApp.';
      whatsapp.firstChild.textContent = 'Continue on WhatsApp';
    } else {
      title.textContent = 'One last step: send your enquiry on WhatsApp.';
      message.textContent = 'The website’s form inbox is not connected yet, so nothing has been claimed as received. Tap below to send your prepared enquiry directly to admissions.';
    }
    if (enquiry) {
      const text = `Hello National Global Academy, I would like free counselling.\n\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nQualification: ${enquiry.qualification}\nInterested in: ${enquiry.interest}\nMessage: ${enquiry.message || 'Please share eligibility, fees and batch details.'}`;
      whatsapp.href = `https://wa.me/${config.whatsapp || ''}?text=${encodeURIComponent(text)}`;
    }
  }

  // Three-question indicative eligibility checker.
  document.querySelectorAll('[data-eligibility-checker]').forEach(checker => {
    const form = checker.querySelector('form');
    const result = checker.querySelector('.checker-result');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const education = data.get('education');
      const age = data.get('age');
      const interest = data.get('interest');
      const error = form.querySelector('.checker-error');
      if (!education || !age || !interest) {
        error.textContent = 'Please answer all three questions to see your starting point.';
        return;
      }
      error.textContent = '';
      let heading = '';
      let summary = '';
      let links = '';
      let checks = ['Confirm age and academic criteria for the exact course.', 'Discuss medical/physical requirements before paying substantial fees.', 'Ask for the complete fee sheet and refund terms in writing.'];
      if (age === 'under16') {
        heading = 'Build your foundation first';
        summary = 'You have time to compare both pathways. Focus on English, mathematics where relevant, fitness and informed career research. Admission ages vary, so do not pay for a course until eligibility is verified.';
        links = `<a class="btn btn-navy" href="/courses/">Compare Career Pathways</a>`;
      } else if (interest === 'cruise') {
        heading = 'Start by exploring cruise hospitality';
        summary = 'Your interest aligns with guest service and hospitality. Explore food & beverage, housekeeping and guest services, then assess your English, role readiness and employer-specific age criteria.';
        links = `<a class="btn btn-navy" href="/courses/cruise-line-hospitality/">Check Cruise Course Details</a>`;
        checks[0] = 'Ask which entry departments match your education and experience.';
      } else if (interest === 'merchant') {
        if (education === '10th') {
          heading = 'GP Rating is a route to investigate';
          summary = 'Your Class 10 starting point may align with a rating pathway. Verify marks, age, eyesight, colour vision and physical standards under current rules before shortlisting institutions.';
          links = `<a class="btn btn-navy" href="/courses/gp-rating/">Check GP Rating Eligibility</a>`;
        } else if (education === '12th PCM') {
          heading = 'Compare officer and rating pathways';
          summary = 'Class 12 with PCM can open deck and engineering route discussions, subject to marks, age and medical criteria. Compare DNS, BSc Nautical Science and marine engineering as well as GP Rating.';
          links = `<a class="btn btn-navy" href="/courses/merchant-navy/">Find My Merchant Navy Route</a>`;
        } else {
          heading = 'Get a route-specific academic review';
          summary = 'Your stream may not fit core deck/engine officer entry requirements, but other routes could be available. Verify rating or alternative criteria rather than assuming eligibility.';
          links = `<a class="btn btn-navy" href="/courses/merchant-navy/">Review Merchant Navy Options</a>`;
        }
      } else {
        heading = 'Compare work style before comparing salary';
        summary = education === '12th PCM'
          ? 'Your PCM background makes a technical route worth exploring, while hospitality remains an option if you prefer guest service. Compare daily duties, contracts and medical requirements.'
          : 'Start with the kind of work you would enjoy: people-facing cruise hospitality or hands-on commercial ship operations. Then verify the academic route available to you.';
        links = `<a class="btn btn-navy" href="/courses/">Compare Both Pathways</a>`;
      }
      if (age === '25+') summary += ' Because you selected 25+, employer and course age limits need particular attention before you plan around any route.';
      result.innerHTML = `<span class="eyebrow">Your indicative result</span><h3>${heading}</h3><p>${summary}</p><ul>${checks.map(item => `<li>${item}</li>`).join('')}</ul>${links}<a class="btn btn-outline" href="/admissions/#enquiry">Get a Personal Counselling Call</a><p class="small-note">This result is guidance only—not admission, medical clearance or a job offer.</p>`;
      result.hidden = false;
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  });

  // Course brochure modal: visible CTA + one scroll-depth or exit-intent trigger per session.
  const brochureModal = document.querySelector('[data-brochure-modal]');
  if (brochureModal) {
    let opened = false;
    const openBrochure = (automatic = false) => {
      if (brochureModal.open || document.querySelector('dialog[open]') || (automatic && opened)) return;
      if (automatic && sessionStorage.getItem('nga_brochure_prompted')) return;
      opened = true;
      if (automatic) sessionStorage.setItem('nga_brochure_prompted', '1');
      brochureModal.showModal();
    };
    document.querySelectorAll('[data-open-brochure]').forEach(btn => btn.addEventListener('click', () => openBrochure(false)));
    brochureModal.querySelector('[data-close-brochure]')?.addEventListener('click', () => brochureModal.close());
    brochureModal.addEventListener('click', e => { if (e.target === brochureModal) brochureModal.close(); });
    let depthTimer = false;
    window.addEventListener('scroll', () => {
      if (depthTimer) return;
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > 0.58) {
        depthTimer = true;
        window.setTimeout(() => openBrochure(true), 1200);
      }
    }, { passive: true });
    document.addEventListener('mouseout', e => {
      if (!e.relatedTarget && e.clientY <= 0 && window.innerWidth > 900) openBrochure(true);
    });

    const form = brochureModal.querySelector('[data-brochure-form]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.elements.name;
      const phone = form.elements.phone;
      let valid = true;
      if (name.value.trim().length < 2) { setFieldError(name, 'Please enter your name.'); valid = false; } else setFieldError(name, '');
      if (!validMobile(phone.value)) { setFieldError(phone, 'Enter a valid 10-digit Indian mobile number.'); valid = false; } else setFieldError(phone, '');
      if (!valid) return;
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.form-status');
      const payload = { name: name.value.trim(), phone: `+91${normaliseIndianMobile(phone.value)}`, course: form.elements.course.value, leadType: 'Course planning guide', submittedAt: new Date().toISOString() };
      button.disabled = true;
      status.textContent = 'Preparing your guide…';
      try {
        // BACKEND HOOK: set brochureEndpoint in site.config.mjs to a CRM/form endpoint.
        // Replace this JSON POST with the provider's required fields/authentication as needed.
        if (config.brochureEndpoint || config.formEndpoint) {
          const response = await fetch(config.brochureEndpoint || config.formEndpoint, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error(`Brochure endpoint returned ${response.status}`);
        }
        form.hidden = true;
        brochureModal.querySelector('.brochure-success').hidden = false;
        sessionStorage.removeItem('nga_enquiry');
      } catch (error) {
        console.error('NGA brochure lead:', error);
        status.className = 'form-status error';
        status.textContent = 'The lead form could not connect. Please use “Get Course Fees on WhatsApp” on the course page.';
        button.disabled = false;
      }
    });
  }
})();
