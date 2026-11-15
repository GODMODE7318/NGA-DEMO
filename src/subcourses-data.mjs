// Course facts below are supplied by the academy. Image slots are representative Unsplash
// stock photography, not NGA photos; replace each URL with licensed, approved photography.
export const subcourses = [
  {
    name: 'Cruise Career Fast Track Program', parent: 'Cruise Industry', duration: '30 days', isoDuration: 'P30D', path: '/courses/cruise-career-fast-track-program/',
    image: 'https://images.unsplash.com/photo-1675684319073-dd1a1c3587b8?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cruise ship sailing on the ocean', imageSlot: 'Fast Track poster: cruise ship at sea, replace with approved course photograph.',
    description: 'This 30-day program brings together interview training and international cruise interview preparation. It also includes e-learning and detailed job profile guidance.',
    inclusions: ['Interview training', '100% Placement Support', 'E-learning', 'International cruise interview preparation', 'Detailed job profile guidance']
  },
  {
    name: 'Cruise Career Professional Program', parent: 'Cruise Industry', duration: '2 Months', isoDuration: 'P2M', path: '/courses/cruise-career-professional-program/',
    image: 'https://images.unsplash.com/photo-1667604987970-4bbd6ed51d0d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dining table overlooking the water', imageSlot: 'Cruise Professional poster: waterside dining, replace with approved course photograph.',
    description: 'This 2-month program includes an e-learning exam and an exit exam. It also brings together resume preparation, personalized interview preparation and a choice of department.',
    inclusions: ['E-Learning Exam + Exit Exam', 'Professional Resume by Industry Experts', '30 Days Personalized Interview Preparation', '100% Job Support Opportunity', 'Detailed Job Profile Guidance', 'Choose Your Preferred Department: Food and Beverage Service, Housekeeping, or Kitchen Operations (Culinary)']
  },
  {
    name: 'Diploma in Cruise and Hospitality Management (DCHM)', parent: 'Cruise Industry', duration: '12 Months', isoDuration: 'P12M', path: '/courses/diploma-in-cruise-hospitality-management/',
    image: 'https://images.unsplash.com/photo-1667604963377-93dda0e11b1b?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Tables and chairs on a waterside deck', imageSlot: 'DCHM poster: waterside hospitality, replace with approved course photograph.',
    description: 'This 12-month diploma brings together hospitality principles, guest relations and food and beverage service. It includes professional interview preparation and six months of industrial training with a stipend.',
    inclusions: ['Restaurant Service, Bar Service, Housekeeping Certification Course', 'Professional Interview Preparation', 'Detailed Job Profile Guidance', '6 Month Industrial Training (With Stipend)', '100% Job Placement Support (Domestic and International)', 'Principles of Hospitality', 'Guest Relations and Complaint Mgmt.', 'Food and Beverage Service', 'Hotel and Restaurant Operations', 'Professional Etiquette and Dining']
  },
  {
    name: 'GP Rating', parent: 'Merchant Navy', duration: '6 Months', isoDuration: 'P6M', path: '/courses/gp-rating/',
    image: 'https://images.unsplash.com/photo-1605745341075-1b7460b99df8?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Cargo ship on the sea', imageSlot: 'GP Rating poster: merchant vessel, replace with approved course photograph.',
    description: 'This 6-month GP Rating course includes industry level experience training. Its listed inclusions also cover global career opportunities.',
    inclusions: ['100% Sponsorship', '100% Placement Support (Domestic and International)', 'Global Career Opportunities', 'Industry Level Experience Training']
  },
  {
    name: 'Diploma In Aviation', parent: 'Aviation', duration: '12 Months', isoDuration: 'P12M', path: '/courses/diploma-in-aviation/',
    image: 'https://images.unsplash.com/photo-1641447093043-241f064568fb?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Rows of empty seats inside an aircraft cabin', imageSlot: 'Aviation diploma poster: aircraft cabin, replace with approved course photograph.',
    description: 'This 12-month diploma covers civil aviation, airport terminal operations and aviation regulations. Its listed activities include cabin crew mock-up training and an on site airport visit.',
    inclusions: ['Civil Aviation and Structure', 'Airport Terminal Operations', 'Baggage and Cargo Management', 'Safety and Security Procedures', 'Global Aviation Regulations', 'Cabin Crew Mock-up Training', 'Grooming and Etiquette Workshops', 'On site Airport Visit', 'Role playing Exercises']
  },
  {
    name: 'Diploma in hotel management', parent: 'Hospitality', duration: '12 Months', isoDuration: 'P12M', path: '/courses/diploma-in-hotel-management/',
    image: 'https://images.unsplash.com/photo-1660557989695-14fac79c086d?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Reception desk in a hotel lobby', imageSlot: 'Hotel management diploma poster: hotel reception, replace with approved course photograph.',
    description: 'This 12-month diploma includes professional grooming, communication skills and public speaking. It also features resume building, mock interviews and industry interaction programs.',
    inclusions: ['Professional Grooming and Styling', 'Confidence and Public Speaking', 'Body Language and Posture', 'Advanced Communication Skills', 'Resume Building Workshops', 'Mock Interview Sessions', 'Industry Interaction Programs', 'Placement Assistance', 'Career Counseling']
  }
];

export const courseGroups = [
  {name:'Cruise Industry', trending:true, parentPath:'/courses/cruise-line-hospitality/'},
  {name:'Merchant Navy', parentPath:'/courses/merchant-navy/'},
  {name:'Aviation', trending:true, parentPath:'/courses/aviation/'},
  {name:'Hospitality', parentPath:'/courses/hospitality/'}
];
