export interface VolunteerOpportunity {
  id: string;
  title: string;
  org: string;
  category: string;
  location: string;
  description: string;
  longDescription: string;
  linkedCampaignId?: string;
  skills: string[];
  spots: number;
  spotsFilled: number;
  ageMin: number;
  ageMax: number;
  commitment: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  verified: boolean;
  urgent: boolean;
  updates: { date: string; title: string; description: string }[];
  volunteers: { name: string; joinedDate: string; role: string }[];
  requirements: string[];
  benefits: string[];
}

export const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "teach-dolakha-children",
    title: "Teach English to Children in Dolakha",
    org: "Nepal Water Foundation",
    category: "Teaching",
    location: "Dolakha, Bagmati Province",
    description: "Help teach basic English and computer skills to children in 5 remote villages while our water project transforms their community.",
    longDescription: `As part of our Clean Water for Dolakha initiative, we're looking for passionate volunteers to teach English and basic computer skills to children aged 6-14 in the target villages.

While our engineering teams install water filtration systems, education volunteers will run daily classes in temporary community centers. This is a unique opportunity to make a lasting impact on children who have limited access to quality education.

**What you'll do:**
- Conduct daily English language classes for groups of 15-20 children
- Introduce basic computer literacy using donated laptops
- Organize creative learning activities and cultural exchange sessions
- Help develop simple teaching materials in Nepali and English
- Support after-school homework clubs

**Why this matters:**
English literacy opens doors to higher education and employment opportunities for these children. Combined with the clean water infrastructure, this holistic approach addresses both immediate health needs and long-term development.

The communities are warm and welcoming. Previous volunteers describe this as a life-changing experience — both for the children and themselves.`,
    linkedCampaignId: "clean-water-dolakha",
    skills: ["Teaching", "Translation", "IT & Digital"],
    spots: 8,
    spotsFilled: 5,
    ageMin: 18,
    ageMax: 55,
    commitment: "Short-term (1–2 weeks)",
    startDate: "2026-05-01",
    endDate: "2026-05-14",
    hoursPerDay: 5,
    contactName: "Anita Sharma",
    contactEmail: "anita@nepalwater.org",
    contactPhone: "+977-9841234567",
    verified: true,
    urgent: true,
    updates: [
      { date: "2026-04-10", title: "Teaching materials prepared", description: "We've prepared workbooks and activity sheets for all age groups. Laptops have been configured with educational software." },
      { date: "2026-04-02", title: "Community spaces arranged", description: "Village leaders have allocated community halls in 3 of the 5 villages for classroom use." },
      { date: "2026-03-20", title: "5 volunteers confirmed", description: "We now have 5 confirmed volunteers. Looking for 3 more to cover all villages." },
    ],
    volunteers: [
      { name: "Sarah K.", joinedDate: "2026-03-15", role: "Lead Teacher" },
      { name: "Rajesh P.", joinedDate: "2026-03-18", role: "IT Instructor" },
      { name: "Emily W.", joinedDate: "2026-03-25", role: "Teaching Assistant" },
      { name: "Bikram T.", joinedDate: "2026-04-01", role: "Translator" },
      { name: "Lisa M.", joinedDate: "2026-04-05", role: "Creative Activities" },
    ],
    requirements: [
      "Fluent in English (Nepali is a plus but not required)",
      "Experience working with children preferred",
      "Willingness to live in basic rural conditions",
      "Must bring own laptop if possible",
      "Valid passport and Nepal visa",
      "Travel insurance required",
    ],
    benefits: [
      "Free accommodation in community homestays",
      "Two meals per day provided",
      "Local transportation covered",
      "Certificate of volunteer service",
      "Cultural immersion experience",
      "Reference letter upon completion",
    ],
  },
  {
    id: "rebuild-school-construction",
    title: "School Construction Volunteers Needed",
    org: "Education First Nepal",
    category: "Construction",
    location: "Sindhupalchok, Bagmati Province",
    description: "Join our construction team to help rebuild earthquake-damaged schools using modern earthquake-resistant techniques.",
    longDescription: `Education First Nepal is seeking construction volunteers to assist in rebuilding 3 primary schools in Sindhupalchok district. This is hands-on work alongside experienced Nepali engineers and laborers.

**Project details:**
- Help with foundation work, wall construction, and roofing
- Assist in building separate sanitation facilities
- Support furniture assembly and classroom setup
- Participate in quality control checks
- Help paint and finish interior spaces

**What makes this special:**
You'll be directly contributing to safe learning spaces for over 500 children. The schools use earthquake-resistant designs with reinforced concrete frames, and you'll learn these construction techniques firsthand.

No prior construction experience is necessary — our team will train you. However, physical fitness is essential as the work involves manual labor at altitude.`,
    linkedCampaignId: "school-rebuilding-sindhupalchok",
    skills: ["Construction", "Engineering", "Project Management"],
    spots: 12,
    spotsFilled: 7,
    ageMin: 20,
    ageMax: 50,
    commitment: "Medium-term (1–3 months)",
    startDate: "2026-05-15",
    endDate: "2026-07-15",
    hoursPerDay: 7,
    contactName: "Deepak Gurung",
    contactEmail: "deepak@educationfirstnepal.org",
    contactPhone: "+977-9812345678",
    verified: true,
    urgent: false,
    updates: [
      { date: "2026-04-08", title: "Construction tools secured", description: "All necessary construction tools and safety equipment have been procured and delivered to the site." },
      { date: "2026-03-28", title: "7 volunteers confirmed", description: "We have 7 confirmed volunteers from 4 different countries. Still need 5 more!" },
    ],
    volunteers: [
      { name: "Tom H.", joinedDate: "2026-03-10", role: "Team Lead" },
      { name: "Karma S.", joinedDate: "2026-03-12", role: "Safety Officer" },
      { name: "Anna B.", joinedDate: "2026-03-20", role: "Construction" },
    ],
    requirements: [
      "Good physical fitness — work involves manual labor",
      "Comfortable working at altitude (1,500m+)",
      "Tetanus vaccination up to date",
      "Steel-toe boots required (or available on site for NPR 2,000)",
      "Valid passport and Nepal visa",
      "Travel and health insurance mandatory",
    ],
    benefits: [
      "Shared volunteer housing provided",
      "Three meals per day included",
      "Construction skills training certificate",
      "Weekend cultural excursions organized",
      "Professional reference letter",
      "Free local SIM card and data",
    ],
  },
  {
    id: "health-camp-chitwan",
    title: "Medical Health Camp in Chitwan",
    org: "Shakti Samuha",
    category: "Healthcare",
    location: "Chitwan, Bagmati Province",
    description: "Provide basic healthcare services and health education to underserved rural communities in Chitwan district.",
    longDescription: `Shakti Samuha is organizing a series of mobile health camps in rural Chitwan to provide free medical check-ups, basic treatments, and health education to communities with limited healthcare access.

**Camp activities:**
- Basic health screenings (blood pressure, blood sugar, BMI)
- Eye and dental check-ups
- Women's health consultations
- Child immunization support
- Health and hygiene awareness workshops
- Distribution of basic medicine kits

**Who we need:**
We need medical professionals (doctors, nurses, pharmacists) as well as non-medical volunteers for registration, logistics, and community outreach. Medical volunteers will work under the supervision of licensed Nepali physicians.

This is a standalone opportunity not linked to any specific campaign, but it aligns with our broader mission of women's empowerment through health and wellbeing.`,
    skills: ["Medical", "First Aid", "Social Work", "Counseling"],
    spots: 15,
    spotsFilled: 9,
    ageMin: 21,
    ageMax: 60,
    commitment: "One-time Event",
    startDate: "2026-06-01",
    endDate: "2026-06-07",
    hoursPerDay: 8,
    contactName: "Dr. Mina Thapa",
    contactEmail: "mina@shaktisamuha.org",
    contactPhone: "+977-9867654321",
    verified: true,
    urgent: true,
    updates: [
      { date: "2026-04-12", title: "Medical supplies ordered", description: "Basic medical supplies and medicine kits have been ordered. Expected delivery by mid-May." },
      { date: "2026-04-01", title: "Camp locations finalized", description: "We've identified 5 village locations for the health camps, each serving 200-400 residents." },
    ],
    volunteers: [
      { name: "Dr. Suresh R.", joinedDate: "2026-03-05", role: "Lead Physician" },
      { name: "Nurse Gita K.", joinedDate: "2026-03-10", role: "Head Nurse" },
      { name: "Prem B.", joinedDate: "2026-03-15", role: "Logistics Coordinator" },
    ],
    requirements: [
      "Medical professionals must provide proof of qualification",
      "Non-medical volunteers welcome for logistics roles",
      "Hepatitis B vaccination recommended",
      "Comfortable with rural conditions",
      "Valid passport and Nepal visa",
      "Personal medical kit recommended",
    ],
    benefits: [
      "Accommodation and meals provided",
      "Continuing medical education credits (for medical professionals)",
      "Certificate of service",
      "Transportation to camp sites",
      "Cultural exchange opportunities",
      "Networking with Nepal's healthcare community",
    ],
  },
];

export const getVolunteerById = (id: string) => volunteerOpportunities.find((v) => v.id === id);
