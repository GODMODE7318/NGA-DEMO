# Implementation & Self-Check Report

Date: 10 November 2026

## Pages built (19 generated pages + custom 404)

1. `/` — complete homepage
2. `/courses/` — course comparison hub
3. `/courses/cruise-line-hospitality/`
4. `/courses/merchant-navy/`
5. `/courses/gp-rating/`
6. `/courses/course-template/` — reusable internal template, noindex
7. `/cruise-line-careers/`
8. `/merchant-navy-careers/`
9. `/about/`
10. `/admissions/`
11. `/blog/`
12. `/blog/merchant-navy-after-12th-guide-2026/`
13. `/blog/cruise-ship-jobs-indians-salary-roles/`
14. `/blog/gp-rating-course-fees-eligibility-career-scope/`
15. `/blog/article-template/` — reusable internal template, noindex
16. `/contact/`
17. `/privacy-policy/`
18. `/terms/`
19. `/thank-you/` — noindex, endpoint-aware success/WhatsApp states
20. `/404.html` — custom fallback

All three requested SEO articles are fully written. Both templates are actual built pages, not empty stubs.

## Schema implemented

JSON-LD is emitted per relevant page and validated for syntax:

- `WebSite` — all pages
- `EducationalOrganization` — Home, Contact and About provider context
- `LocalBusiness` — Home and Contact
- `Course` + `CourseInstance` + `Offer` — all course pages
- `FAQPage` — every visible FAQ component
- `BreadcrumbList` — inner pages
- `Blog` — guide index
- `BlogPosting` — all articles and the noindex article template
- `Organization` — article publisher/author context

Also included: unique titles/descriptions, one H1 per page, canonical URLs, Open Graph, Twitter cards, XML sitemap, robots.txt, semantic landmarks, descriptive clean URLs and extensive internal links.

## Conversion system implemented

- Reusable six-field enquiry form (including hidden source)
- Indian mobile validation and inline errors
- Configurable JSON POST endpoint
- Honest WhatsApp fallback when no backend exists
- Thank You page with prepared WhatsApp deep link and email/contact fallback
- Home + Admissions three-question personalised eligibility checker
- Course brochure modal with name + WhatsApp fields, endpoint hook and real downloadable 5-page planning PDF
- Visible brochure CTA, scroll-depth trigger and desktop exit-intent trigger
- Sticky desktop Apply Now/phone, floating WhatsApp, mobile Call/WhatsApp/Enquire bar
- Specific action CTA language throughout

## Client must supply / verify every `[CONFIRM: …]` item

### Contact and business identity

- Official phone and display number
- Official WhatsApp number
- Admissions email
- Full postal address, landmark and office/visiting hours
- Google Maps embed and public directions link
- Google Business Profile URL
- Social URLs
- Registered legal entity, governing state/courts and response times

### Fees, policies and programme facts

- Current tuition, registration, taxes and instalment rules
- External recognised-course/certification charges and payable parties
- Hostel, food, uniform, kit, medical, examination, travel and document charges
- Refund/deferral/withdrawal terms, including medical-ineligibility scenario
- Exact course duration, weekly hours, delivery format and facilities
- Curriculum names/hours and practical components
- Exact NGA role versus any external certifying institution
- Current January Batch / July Batch dates, deadlines, seats and reporting instructions
- Policy for applicants awaiting Class 10/12 results

### Trust content

- Years of experience and students guided, with evidence
- Real student/parent testimonials, names, course/batch and publication consent
- Actual founding story, year, milestones and founder details
- Faculty names, roles, biographies, credentials and consented photographs
- Real campus/classroom imagery
- Verified academic support and parent-support practices

### Measurement and compliance

- GA4 ID and Search Console verification token
- Actual CRM/form processors, retention periods and cross-border data handling
- Cookie/consent requirements for the final analytics setup
- Legal review of Privacy Policy and Terms
- Documentary review of every approval/affiliation statement before any such statement is added

## Intentionally simplified / not activated

- No live backend credentials were available, so forms use a configurable endpoint and transparent WhatsApp fallback. Static-host form delivery is not claimed as successful without an endpoint.
- Contact placeholders do not dial a fake number. They route users to Contact until real details are added.
- Maps show a designed placeholder rather than embedding an unverified location.
- Faculty and testimonials are visibly sample structures, not represented as real people/reviews.
- Stock Unsplash imagery is representative and marked in HTML/config; original academy photography still needs to replace it.
- No numeric course price is inserted into schema until fees are confirmed.
- Analytics and Search Console remain inactive until IDs are supplied.
- Legal pages are comprehensive starter templates, not a substitute for legal review.
- Lighthouse was not claimed as a measured score; production score depends on final hosting, images and analytics. The implementation has no runtime dependencies, uses responsive lazy media and reduced-motion support to target strong Core Web Vitals.

## Automated checks

`npm run build` checks every generated page for title length, description length and exactly one H1.

`npm run check` checks:

- all internal links resolve;
- JSON-LD parses;
- image alt text and width/height are present;
- no duplicate HTML IDs occur on a page.

Final launch still requires manual mobile-device, form-delivery, content, legal and client-fact review.
