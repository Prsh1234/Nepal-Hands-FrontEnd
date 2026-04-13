export interface CampaignUpdate {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "update" | "photo" | "financial";
}

export interface Expense {
  category: string;
  amount: number;
  percentage: number;
}

export interface Campaign {
  id: string;
  title: string;
  org: string;
  raised: number;
  goal: number;
  progress: number;
  daysLeft: number;
  donors: number;
  verified: boolean;
  category: string;
  description: string;
  longDescription: string;
  location: string;
  startDate: string;
  updates: CampaignUpdate[];
  expenses: Expense[];
  recentDonors: { name: string; amount: number; date: string }[];
}

export const campaigns: Campaign[] = [
  {
    id: "clean-water-dolakha",
    title: "Clean Water for Dolakha",
    org: "Nepal Water Foundation",
    raised: 450000,
    goal: 600000,
    progress: 75,
    daysLeft: 12,
    donors: 234,
    verified: true,
    category: "Water & Sanitation",
    description: "Providing clean drinking water to 5 remote villages in Dolakha district through sustainable filtration systems.",
    longDescription: `The Dolakha district in eastern Nepal faces severe water scarcity. Over 15,000 residents rely on contaminated water sources, leading to widespread waterborne diseases, especially among children under 5.

Our project will install 12 community water filtration units across 5 villages, providing clean and safe drinking water to approximately 3,000 households. Each unit uses a combination of bio-sand filtration and UV purification, ensuring 99.9% pathogen removal.

**Key objectives:**
- Install 12 community water filtration systems
- Train 60 local technicians for maintenance
- Conduct hygiene awareness workshops in all 5 villages
- Establish a community water management committee
- Reduce waterborne diseases by 80% within the first year

The project is designed to be self-sustaining. Local committees will manage the systems, and a small monthly contribution from households will fund ongoing maintenance.`,
    location: "Dolakha, Bagmati Province",
    startDate: "2026-02-15",
    updates: [
      { date: "2026-04-10", title: "Site surveys completed", description: "Our team completed geological and water quality surveys in all 5 target villages. Water contamination levels confirmed — urgent action needed.", type: "milestone" },
      { date: "2026-04-02", title: "First filtration unit ordered", description: "We've placed the order for the first 4 bio-sand filtration units. Expected delivery in 2 weeks.", type: "update" },
      { date: "2026-03-20", title: "Community meetings held", description: "Met with village leaders and community members. Overwhelming support and 60 volunteers signed up for technician training.", type: "update" },
      { date: "2026-03-05", title: "Q1 Financial Report", description: "Published our quarterly financial report. 92% of funds directed to project activities, 8% administrative costs.", type: "financial" },
      { date: "2026-02-20", title: "Project officially launched", description: "Nepal Water Foundation officially launched the Clean Water for Dolakha campaign with support from local government.", type: "milestone" },
    ],
    expenses: [
      { category: "Filtration Equipment", amount: 250000, percentage: 42 },
      { category: "Installation & Labor", amount: 120000, percentage: 20 },
      { category: "Technician Training", amount: 80000, percentage: 13 },
      { category: "Community Workshops", amount: 60000, percentage: 10 },
      { category: "Transportation", amount: 50000, percentage: 8 },
      { category: "Administrative", amount: 40000, percentage: 7 },
    ],
    recentDonors: [
      { name: "Sita R.", amount: 5000, date: "2 hours ago" },
      { name: "Anonymous", amount: 10000, date: "5 hours ago" },
      { name: "Ram B.", amount: 2000, date: "1 day ago" },
      { name: "Priya S.", amount: 15000, date: "1 day ago" },
      { name: "Bikash T.", amount: 3000, date: "2 days ago" },
    ],
  },
  {
    id: "school-rebuilding-sindhupalchok",
    title: "School Rebuilding in Sindhupalchok",
    org: "Education First Nepal",
    raised: 820000,
    goal: 1000000,
    progress: 82,
    daysLeft: 8,
    donors: 412,
    verified: true,
    category: "Education",
    description: "Rebuilding earthquake-damaged schools to provide safe learning environments for over 500 children.",
    longDescription: `Sindhupalchok was one of the hardest-hit districts during the 2015 earthquake. Many schools were destroyed and temporary structures have been used for over a decade.

This campaign aims to rebuild 3 primary schools using earthquake-resistant construction methods, providing safe and modern learning spaces for over 500 children.

**Project scope:**
- Rebuild 3 primary schools with earthquake-resistant design
- Furnish classrooms with modern learning materials
- Build separate sanitation facilities for boys and girls
- Create a computer lab in each school
- Establish a school library with 2,000+ books

Construction follows Nepal's updated building codes with reinforced concrete frames and proper foundation engineering.`,
    location: "Sindhupalchok, Bagmati Province",
    startDate: "2026-01-10",
    updates: [
      { date: "2026-04-08", title: "Second school foundation complete", description: "Foundation work for the second school in Barhabise is now complete. Walls going up next week!", type: "milestone" },
      { date: "2026-03-25", title: "First school walls complete", description: "The first school in Melamchi now has all walls constructed. Roofing work begins next week.", type: "milestone" },
      { date: "2026-03-10", title: "Materials delivered", description: "All construction materials for the first two schools have been delivered to site.", type: "update" },
    ],
    expenses: [
      { category: "Construction Materials", amount: 400000, percentage: 40 },
      { category: "Labor & Engineering", amount: 250000, percentage: 25 },
      { category: "Furniture & Equipment", amount: 150000, percentage: 15 },
      { category: "Books & Supplies", amount: 100000, percentage: 10 },
      { category: "Transportation", amount: 60000, percentage: 6 },
      { category: "Administrative", amount: 40000, percentage: 4 },
    ],
    recentDonors: [
      { name: "Hari K.", amount: 25000, date: "1 hour ago" },
      { name: "Anonymous", amount: 5000, date: "3 hours ago" },
      { name: "Sunita M.", amount: 10000, date: "8 hours ago" },
    ],
  },
  {
    id: "womens-skill-training",
    title: "Women's Skill Training Center",
    org: "Shakti Samuha",
    raised: 210000,
    goal: 500000,
    progress: 42,
    daysLeft: 25,
    donors: 98,
    verified: true,
    category: "Empowerment",
    description: "Establishing a vocational training center to empower 200+ women with marketable skills and micro-enterprise support.",
    longDescription: `Many women in rural Nepal lack access to economic opportunities. This project establishes a comprehensive vocational training center in Chitwan that will equip women with practical skills for self-employment and economic independence.

**Training programs include:**
- Tailoring and garment production
- Food processing and preservation
- Digital literacy and basic computing
- Financial literacy and savings management
- Micro-enterprise development and marketing

Each participant will receive 3 months of intensive training, followed by 6 months of mentorship and access to micro-loans to start their own businesses.`,
    location: "Chitwan, Bagmati Province",
    startDate: "2026-03-01",
    updates: [
      { date: "2026-04-05", title: "Training center lease signed", description: "Secured a spacious venue in Bharatpur for the training center. Renovations starting next week.", type: "milestone" },
      { date: "2026-03-15", title: "Curriculum finalized", description: "Our team of experts has finalized the training curriculum covering all 5 skill areas.", type: "update" },
    ],
    expenses: [
      { category: "Venue & Renovation", amount: 150000, percentage: 30 },
      { category: "Equipment & Materials", amount: 120000, percentage: 24 },
      { category: "Instructor Fees", amount: 100000, percentage: 20 },
      { category: "Micro-loan Fund", amount: 80000, percentage: 16 },
      { category: "Administrative", amount: 50000, percentage: 10 },
    ],
    recentDonors: [
      { name: "Maya D.", amount: 8000, date: "4 hours ago" },
      { name: "Anonymous", amount: 3000, date: "1 day ago" },
    ],
  },
];

export const getCampaignById = (id: string) => campaigns.find((c) => c.id === id);
