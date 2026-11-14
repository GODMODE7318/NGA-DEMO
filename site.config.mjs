/**
 * NATIONAL GLOBAL ACADEMY — SINGLE SOURCE OF TRUTH
 * Update business details here, then run `npm run build`.
 * Empty endpoint/contact values intentionally activate safe on-page fallbacks.
 */
export const site = {
  name: 'National Global Academy',
  shortName: 'NGA',
  domain: 'https://nationalglobalacademy.com',
  description: 'Training and career guidance for cruise line, aviation, merchant navy and hospitality pathways after Class 10 and Class 12.',

  // [CONFIRM: Replace empty values and display placeholders with verified details.]
  phone: '+918858334842', // Digits and + only, e.g. +919876543210
  phoneDisplay: '+91 8858334842',
  whatsapp: '918858334842', // Country code + number, digits only, e.g. 919876543210
  email: 'support@nationalglobalacademy.com', // e.g. admissions@nationalglobalacademy.com
  emailDisplay: 'support@nationalglobalacademy.com',
  address: '[CONFIRM: Full academy address, city, state and PIN code]',
  mapsEmbedUrl: '', // [CONFIRM: Google Maps embed URL, not a regular maps link.]
  googleBusinessProfile: '', // [CONFIRM: Public Google Business Profile URL.]

  // Set a Formspree/Basin/custom API endpoint. Leave empty for WhatsApp fallback.
  formEndpoint: '', // Example: https://formspree.io/f/your-id
  brochureEndpoint: '', // [OPTIONAL: Separate CRM endpoint for brochure leads.]

  // Google setup: values are injected only when supplied.
  ga4Id: '', // [CONFIRM: G-XXXXXXXXXX]
  searchConsoleVerification: '', // [CONFIRM: Verification content token.]

  social: {
    instagram: '', // [CONFIRM]
    facebook: '', // [CONFIRM]
    youtube: '', // [CONFIRM]
    linkedin: '' // [CONFIRM]
  },

  intakes: ['Monthly Batch'],
  defaultMessage: 'Hello National Global Academy, I would like free counselling about course eligibility, fees and admissions.',

  // NEW: Live seat counter configuration
  batchSeatsStart: 12, // Start count for November Batch — decreases every few hours
  batchSeatsMin: 3
};

export const images = {
  // IMAGE SLOTS: Representative Unsplash stock. Replace each URL with owned,
  // compressed WebP/JPEG photography before final brand launch where available.
  hero: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1800&q=82',
  cruise: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=1200&q=80',
  deck: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80',
  ocean: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=1600&q=80',
  cadet: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
  hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  training: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
  counselling: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  port: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80',
  officer: 'https://images.unsplash.com/photo-1580323956656-26bbb1206e34?auto=format&fit=crop&w=1200&q=80',
  faculty1: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=78',
  faculty2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=78',
  faculty3: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=78'
};

export const whatsappUrl = (message = site.defaultMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const phoneUrl = () => site.phone ? `tel:${site.phone}` : '/contact/#enquiry';
export const emailUrl = () => site.email ? `mailto:${site.email}` : '/contact/#enquiry';
