export const mockCreator = {
    name: "Sita Devi Thapa",
    avatar: "ST",
    joinedDate: "March 2025",
    verified: true,
    org: "Himalayan Hope Foundation",
  };
  
  export type OrgCampaign = {
    id: string;
    title: string;
    category: string;
    status: "active" | "draft" | "completed" | "paused";
    raised: number;
    goal: number;
    donors: number;
    daysLeft: number;
    views: number;
    createdDate: string;
  };
  
  export const mockCampaigns: OrgCampaign[] = [
    { id: "clean-water-dolakha", title: "Clean Water for Dolakha", category: "Water & Sanitation", status: "active", raised: 450000, goal: 600000, donors: 142, daysLeft: 18, views: 2340, createdDate: "2026-02-15" },
    { id: "school-rebuilding-sindhupalchok", title: "School Rebuilding in Sindhupalchok", category: "Education", status: "active", raised: 820000, goal: 1000000, donors: 287, daysLeft: 5, views: 5120, createdDate: "2026-01-10" },
    { id: "womens-skill-training", title: "Women's Skill Training Center", category: "Women Empowerment", status: "draft", raised: 0, goal: 500000, donors: 0, daysLeft: 45, views: 0, createdDate: "2026-04-12" },
    { id: "heritage-restoration-patan", title: "Heritage Restoration in Patan", category: "Culture & Heritage", status: "completed", raised: 350000, goal: 350000, donors: 98, daysLeft: 0, views: 3890, createdDate: "2025-11-01" },
  ];
  
  export type OrgVolunteerOp = {
    id: string;
    title: string;
    category: string;
    status: "active" | "closed" | "pending";
    applicants: number;
    accepted: number;
    capacity: number;
    location: string;
    startDate: string;
    createdDate: string;
  };
  
  export const mockVolunteerOps: OrgVolunteerOp[] = [
    { id: "teach-dolakha-children", title: "Teach Children in Dolakha", category: "Teaching", status: "active", applicants: 24, accepted: 8, capacity: 10, location: "Dolakha, Bagmati", startDate: "2026-05-01", createdDate: "2026-03-20" },
    { id: "medical-camp-jumla", title: "Medical Camp in Jumla", category: "Healthcare", status: "active", applicants: 15, accepted: 5, capacity: 12, location: "Jumla, Karnali", startDate: "2026-06-15", createdDate: "2026-04-01" },
    { id: "trail-restoration-annapurna", title: "Trail Restoration – Annapurna", category: "Environment", status: "closed", applicants: 40, accepted: 20, capacity: 20, location: "Annapurna, Gandaki", startDate: "2026-04-01", createdDate: "2026-02-10" },
  ];
  
  export const mockDonors = [
    { id: "d1", name: "Ramesh Shrestha", campaign: "Clean Water for Dolakha", amount: 25000, date: "2026-05-10", anonymous: false },
    { id: "d2", name: "Anonymous", campaign: "School Rebuilding in Sindhupalchok", amount: 50000, date: "2026-05-09", anonymous: true },
    { id: "d3", name: "Bina Karki", campaign: "Clean Water for Dolakha", amount: 5000, date: "2026-05-08", anonymous: false },
    { id: "d4", name: "Prakash Gurung", campaign: "School Rebuilding in Sindhupalchok", amount: 100000, date: "2026-05-05", anonymous: false },
    { id: "d5", name: "Maya Tamang", campaign: "Heritage Restoration in Patan", amount: 12000, date: "2026-04-28", anonymous: false },
    { id: "d6", name: "Anonymous", campaign: "Clean Water for Dolakha", amount: 7500, date: "2026-04-25", anonymous: true },
  ];
  
  export const mockApplicants = [
    { id: "a1", name: "Sunil Bhattarai", opportunity: "Teach Children in Dolakha", appliedDate: "2026-04-22", status: "pending" as const, skills: ["Teaching", "Nepali"], experience: "2 yrs" },
    { id: "a2", name: "Priya Lama", opportunity: "Medical Camp in Jumla", appliedDate: "2026-04-20", status: "accepted" as const, skills: ["Nursing", "First Aid"], experience: "4 yrs" },
    { id: "a3", name: "Kiran Adhikari", opportunity: "Teach Children in Dolakha", appliedDate: "2026-04-18", status: "accepted" as const, skills: ["Math", "English"], experience: "1 yr" },
    { id: "a4", name: "Sabina Rai", opportunity: "Medical Camp in Jumla", appliedDate: "2026-04-15", status: "rejected" as const, skills: ["Logistics"], experience: "6 mo" },
    { id: "a5", name: "Dipesh Magar", opportunity: "Teach Children in Dolakha", appliedDate: "2026-04-12", status: "pending" as const, skills: ["Science"], experience: "3 yrs" },
  ];
  
  export const mockUpdates = [
    { id: "u1", campaign: "Clean Water for Dolakha", title: "Phase 1 pipeline installed", date: "2026-05-02", body: "We completed the first 2 km of pipeline serving 3 wards." },
    { id: "u2", campaign: "School Rebuilding in Sindhupalchok", title: "Foundation work begins", date: "2026-04-20", body: "Construction crew arrived on site and started excavation." },
    { id: "u3", campaign: "Heritage Restoration in Patan", title: "Restoration completed", date: "2026-03-15", body: "Final touches done. Thank you to all 98 donors." },
  ];
  
  export const mockPayouts = [
    { id: "p1", campaign: "School Rebuilding in Sindhupalchok", amount: 500000, status: "paid" as const, date: "2026-04-05", method: "NPR Bank Transfer" },
    { id: "p2", campaign: "Clean Water for Dolakha", amount: 200000, status: "processing" as const, date: "2026-05-08", method: "NPR Bank Transfer" },
    { id: "p3", campaign: "Heritage Restoration in Patan", amount: 350000, status: "paid" as const, date: "2026-03-20", method: "NPR Bank Transfer" },
  ];
  