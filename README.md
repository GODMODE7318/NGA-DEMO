# National Global Academy — Production Website

A complete, mobile-first, SEO-ready static website for National Global Academy. Built with semantic HTML, modern CSS and dependency-free JavaScript. A small Node generator provides reusable layouts, forms, cards, schema and page templates without adding a client framework.

## Run locally

Requirements: **Node.js 18 or newer**. No `npm install` is needed.

```bash
cd national-global-academy
npm run dev
```

Open `http://localhost:3000`. The dev command builds the site and serves `dist/` on `0.0.0.0:3000`.

```bash
npm run build   # Generate production files in dist/
npm run check   # Validate internal links, JSON-LD, IDs and image attributes
npm start       # Serve an already-built dist/
```

## Project structure

```text
national-global-academy/
├── site.config.mjs                 # BUSINESS DETAILS + IMAGE URLS (edit here)
├── build.mjs                       # Static generation, sitemap, robots, SEO checks
├── server.mjs                      # Dependency-free local/static server
├── package.json
├── src/
│   ├── components.mjs              # Header, footer, forms, quiz, schema, cards
│   ├── data.mjs                    # Courses, FAQs and article metadata
│   ├── home.mjs                    # Homepage
│   ├── courses.mjs                 # Course hub + reusable course page
│   ├── careers.mjs                 # Both career pages
│   ├── company.mjs                 # About, admissions, contact, legal, thank-you
│   ├── articles.mjs                # Full articles + reusable article template
│   ├── styles.css                  # Complete responsive design system
│   └── main.js                     # Forms, quiz, menu, reveal, brochure UI
├── public/
│   ├── _headers                    # Netlify security/cache headers
│   └── assets/                     # Favicon, manifest and planning-guide PDF
├── scripts/check.mjs               # Automated QA
└── dist/                           # Generated deployable website
```

## 1. Add verified business information

Edit **`site.config.mjs`** in one place:

- `phone` and `phoneDisplay`
- `whatsapp` (country code + number, digits only)
- `email` and `emailDisplay`
- `address`
- `mapsEmbedUrl`
- `googleBusinessProfile`
- social profile URLs
- `ga4Id` and `searchConsoleVerification`

Empty phone/email values deliberately send visitors to the contact page instead of dialling a fake number. An empty WhatsApp number opens WhatsApp's share flow rather than a fabricated recipient. Replace every visible `[CONFIRM: …]` marker before public launch.

After editing, run `npm run build && npm run check`.

## 2. Connect the enquiry forms

The same form component is used across the site. It validates names, email, required pathway/qualification and Indian mobile numbers (10 digits, beginning 6–9).

### Recommended: Formspree

1. Create a form in Formspree and copy its endpoint, such as `https://formspree.io/f/abcdwxyz`.
2. Set `formEndpoint` in `site.config.mjs`.
3. Rebuild, submit a real test enquiry and verify delivery plus spam filtering.
4. Point the production form to the academy's monitored admissions inbox.

A custom CRM endpoint also works if it accepts a JSON POST and returns a 2xx response. Payload fields:

```json
{
  "source": "Admissions page",
  "name": "Student name",
  "phone": "+919876543210",
  "email": "optional@example.com",
  "interest": "Merchant Navy",
  "qualification": "12th",
  "message": "Please share fees",
  "submittedAt": "ISO timestamp",
  "page": "submitted page URL"
}
```

`brochureEndpoint` can override the endpoint for guide leads. If empty, guide leads use `formEndpoint`.

### No-backend fallback

If `formEndpoint` is empty, the site **does not falsely claim delivery**. It prepares the enquiry and redirects to Thank You with a prefilled WhatsApp action. If an endpoint fails, the entered values remain in the form and an error offers alternative contact methods.

## 3. Replace stock images and placeholders

All image URLs live in `site.config.mjs`. Every output image has:

- an HTML `IMAGE SLOT` comment describing the intended replacement;
- descriptive alt text;
- explicit width/height;
- WebP source with JPEG fallback;
- lazy loading except hero/cover imagery.

Replace representative stock with owned NGA photography. Keep the same aspect ratios and compress images (ideally under 200 KB for cards and 350 KB for heroes). Update alt text to describe the real photo. Stock faculty portraits are visibly labelled placeholders and must not be mistaken for staff.

## 4. Edit courses and articles

- Course content, fees, curriculum and FAQs: `src/data.mjs`.
- Course layout: `coursePage()` in `src/courses.mjs`.
- Internal course template: `/courses/course-template/` (built, `noindex`, excluded from sitemap).
- Blog articles and reusable editorial layout: `src/articles.mjs`.
- Article cards/metadata: `src/data.mjs`.
- Internal article template: `/blog/article-template/` (built, `noindex`, excluded from sitemap).

To add a course, duplicate an object in `courses`, provide a unique slug and content, then rebuild. The registry generates its page automatically. To publish a new article, add its metadata, full body and FAQ content using the existing pattern.

## 5. Deploy exactly

### Netlify (recommended)

**Git deployment**

1. Push this project folder to a GitHub/GitLab repository.
2. In Netlify: **Add new site → Import an existing project**.
3. Select the repository. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `20` (set under environment variables as `NODE_VERSION=20` if needed)
4. Deploy. Test every CTA and a real form submission.
5. Under **Domain management**, add `nationalglobalacademy.com` and follow Netlify's DNS instructions. Enable HTTPS.
6. Netlify automatically uses `public/_headers` from the generated output.

**Manual deployment**

1. Run `npm run build && npm run check` locally.
2. Open Netlify Drop.
3. Drag the **`dist` folder itself** onto Netlify Drop.
4. Attach the custom domain and test forms.

### Vercel

1. Push to Git and choose **Add New → Project** in Vercel.
2. Select **Other** as the framework preset.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Install command: leave empty/default; there are no dependencies.
6. Deploy, then add `nationalglobalacademy.com` under **Settings → Domains** and configure DNS as shown.

### cPanel / Hostinger / shared hosting

1. Run `npm run build && npm run check` locally.
2. Open the domain's `public_html` directory.
3. Upload **the contents inside `dist/`**, not the source project. `index.html`, `sitemap.xml`, `robots.txt` and all page folders must sit directly under `public_html`.
4. Force HTTPS in the host and set the canonical host (with/without www) in the host panel.
5. Visit `/courses/gp-rating/`, `/admissions/`, `/sitemap.xml` and submit a test enquiry.

## 6. Google launch checklist

1. Add the GA4 measurement ID to `site.config.mjs`; rebuild and verify in GA4 Realtime.
2. Add the Search Console HTML verification token to `searchConsoleVerification`; rebuild.
3. Verify the domain property in Google Search Console.
4. Submit `https://nationalglobalacademy.com/sitemap.xml`.
5. Add the real Google Business Profile URL in the config.
6. Inspect Home, GP Rating and one blog article in URL Inspection; request indexing after DNS/HTTPS is live.
7. Test the production enquiry endpoint, WhatsApp number and phone link on a real mobile device.
8. Run Lighthouse against production hosting. Actual scores depend on hosting, stock-image response, analytics and final media weight; the codebase itself is intentionally dependency-free.

## Conversion and accessibility notes

- Sticky Apply Now, phone, floating WhatsApp and mobile Call/WhatsApp/Enquire bar are site-wide.
- Home and Admissions contain a useful three-question eligibility checker.
- Course pages include visible and behaviour-triggered brochure forms. Prompts appear once per browser session.
- Forms have labels, inline errors and live status; menus/dialogs support keyboard use.
- Reduced-motion preferences disable reveal/parallax motion.
- No job, salary, placement, approval or affiliation guarantee is made.

## Pre-launch requirement

This is a complete website implementation, but **business facts in `[CONFIRM: …]` markers are intentionally not invented**. Client sign-off is required for fees, contact details, faculty, statistics, testimonials, exact academy/certifying role, facilities, dates, policies and legal jurisdiction.
