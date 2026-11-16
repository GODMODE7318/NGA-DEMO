# National Global Academy website

This is the existing NGA Node static site generator and shared theme, updated in place. It is **not** a Next.js project. It builds on Vercel as a static site and can be previewed locally using Node 18 or newer.

```sh
npm run build
npm start
npm run check
```

The public source templates are in `src/nga-pages.mjs`, shared header and footer in `src/components.mjs`, course records in `src/subcourses-data.mjs`, styles in `src/styles.css`, and browser interactions in `src/main.js`. The build output is generated in `dist/`. The three existing articles are retained with revised NGA copy and clean `/guides/` URLs to remove prohibited words from public URLs. Old articles and legacy templates are not built.

## Important admin and storage limitations

`/admin/` is not linked from the public site. **The static Vercel deployment has no writable admin API and the login screen is disabled there. Do not use it to collect or manage private information until a secure backend and database are connected.** On Vercel the counselling form opens WhatsApp; it does not save a copy in an admin database. Nothing is sent until the visitor sends the WhatsApp message.

A **local development demonstration only** is implemented in `server.mjs`. NGA must supply its own credentials through environment variables, never commit them. No account is created by this package. With both variables set, the local server enables staff login and a private, file-backed JSON store. For example, set `NGA_ADMIN_EMAIL`, `NGA_ADMIN_PASSWORD`, and optionally `NGA_DATA_FILE` using your own secure shell or process manager, then run `npm start`. The default file is `$HOME/nga-private-data/content.json`, outside the public site directory. Never place it in `public/`, `dist/`, a repository, or a ZIP. Run on a trusted local machine with test data only. The example implementation is not a production security system, does not encrypt its data, is not suitable for real personal data, does not support multiple server instances, and has not undergone a security audit. Sessions are process-local and expire after four hours. Login has basic rate limiting and same-origin checks, but additional production controls are needed.

The local admin can view enquiry fields, update status and notes, search, filter, export CSV, and edit courses, batch seat count, contact settings and selected page data. Changes save to the private file and cause a local static rebuild. The courses and selected page data editors accept JSON; the courses editor initially displays the complete current records. Set `hidden: true` to hide a course, `order` to change the order, and use a unique `/courses/your-slug/` path and full course record to add a course. `poster` is an existing public asset path. When adding a course, supply only verified information. Back up data before editing.

This local panel does **not** implement all requested features: secure live authentication, durable Vercel data, uploads, an individual media manager, managed testimonials and blog editors, configurable course video, full WYSIWYG page editing, and every settings field are not complete. The page-data editor supports `hero`, `why`, `homeFaq`, `industry`, and `logos` JSON fields; it is not a complete page CMS. Batch start date and total can be stored, but only the seats-left value changes the announcement. The form does not provide a guaranteed delivery mechanism. Production launch requires: **Supabase PostgreSQL** (private enquiry/content tables and transactions), staff-only Supabase Auth with MFA and roles, server-side authorization and validation in Vercel functions, private object storage for approved media, audit logs, encrypted transport and backups, bot protection and retention controls, plus integration of all CMS features and explicit consent and privacy review. Store provider credentials and the session secret as Vercel environment variables. NGA must create the staff accounts and configure those services. Never use public sign-up. No database password or administrator login is included.

## Assets and approvals

The supplied white logo and supplied training image are used. The separately requested transparent logo was not present in the workspace. The industry cards use the existing relevant photographs because four approved autoplay video files were not supplied. Course images are unbranded stock photos; ensure appropriate usage rights. Eighteen employer logos are included in the requested order; the Viking asset is a transparent PNG rather than SVG. Source references are in `public/assets/logos/SOURCES.txt` and `NEW_SOURCES.txt`. Verify rights and any implied relationships before publication.

Faculty content can be edited at `public/assets/team.json`. Entries can later include verified `name`, `role`, `description`, `credentials`, and an optional `photo` under `/assets/`. On a deployed static site, changing that file requires publishing it to the hosting environment; a database-backed media service would allow changes without deployment.

Confirm the drafted calling and visiting hours, the actual aviation and hospitality card course names, the exact address unit, any course certificates, the additional cruise and Merchant Navy card courses, the 12 available seats, all placement and interview wording, and staff login before going live. The public version displays the course names provided for the cards, but does not invent details or new detail pages for unconfirmed courses.
