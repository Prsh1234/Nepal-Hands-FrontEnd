export type PendingCampaign = {
    id: string;
    title: string;
    org: string;
    submittedDate: string;
    category: string;
    goalAmount: number;
    status: "pending";
  };
  
  export type FlaggedItem = {
    id: string;
    type: "Campaign" | "User";
    title: string;
    reason: string;
    reportedBy: number;
    date: string;
  };
  
  export type RecentUser = {
    id: string;
    name: string;
    email: string;
    joined: string;
    role: "Creator" | "Donor" | "Volunteer";
    campaigns: number;
    status: "active" | "suspended";
  };
  
  export type RecentTransaction = {
    id: string;
    donor: string;
    campaign: string;
    amount: number;
    date: string;
    status: "completed" | "refunded";
  };
  
  export const platformStats = {
    totalUsers: 1247,
    activeCampaigns: 18,
    totalDonations: 4850000,
    volunteerApplications: 342,
    pendingApprovals: 7,
    flaggedItems: 3,
    monthlyGrowth: 12.5,
    conversionRate: 8.3,
  };
  
  export const pendingCampaigns: PendingCampaign[] = [
    { id: "c1", title: "Medical Aid for Humla", org: "Health Nepal", submittedDate: "2026-04-14", category: "Health", goalAmount: 750000, status: "pending" },
    { id: "c2", title: "Library for Jumla Schools", org: "Read Nepal", submittedDate: "2026-04-13", category: "Education", goalAmount: 300000, status: "pending" },
    { id: "c3", title: "Solar Panels for Mustang", org: "Green Energy Nepal", submittedDate: "2026-04-12", category: "Environment", goalAmount: 500000, status: "pending" },
  ];
  
  export const flaggedItems: FlaggedItem[] = [
    { id: "f1", type: "Campaign", title: "Suspicious Fundraiser XYZ", reason: "Unverified organization", reportedBy: 5, date: "2026-04-13" },
    { id: "f2", type: "User", title: "user_spam_123", reason: "Spam activity detected", reportedBy: 8, date: "2026-04-12" },
    { id: "f3", type: "Campaign", title: "Duplicate Campaign Report", reason: "Duplicate of existing campaign", reportedBy: 3, date: "2026-04-11" },
  ];
  
  export const recentUsers: RecentUser[] = [
    { id: "u1", name: "Anita Shrestha", email: "anita@example.com", joined: "2026-04-15", role: "Creator", campaigns: 2, status: "active" },
    { id: "u2", name: "Bikash Tamang", email: "bikash@example.com", joined: "2026-04-14", role: "Donor", campaigns: 0, status: "active" },
    { id: "u3", name: "Chandra Rai", email: "chandra@example.com", joined: "2026-04-13", role: "Volunteer", campaigns: 0, status: "active" },
    { id: "u4", name: "Deepa Gurung", email: "deepa@example.com", joined: "2026-04-12", role: "Creator", campaigns: 1, status: "suspended" },
    { id: "u5", name: "Eshan Maharjan", email: "eshan@example.com", joined: "2026-04-11", role: "Donor", campaigns: 0, status: "active" },
  ];
  
  export const recentTransactions: RecentTransaction[] = [
    { id: "t1", donor: "Ram K.", campaign: "Clean Water for Dolakha", amount: 15000, date: "2026-04-15 14:32", status: "completed" },
    { id: "t2", donor: "Anonymous", campaign: "School Rebuilding", amount: 25000, date: "2026-04-15 12:10", status: "completed" },
    { id: "t3", donor: "Sita P.", campaign: "Women's Skill Training", amount: 5000, date: "2026-04-15 09:45", status: "completed" },
    { id: "t4", donor: "Hari B.", campaign: "Clean Water for Dolakha", amount: 50000, date: "2026-04-14 18:20", status: "completed" },
    { id: "t5", donor: "Maya L.", campaign: "School Rebuilding", amount: 10000, date: "2026-04-14 15:00", status: "refunded" },
  ];
  
  export type VolunteerRequest = {
    id: string;
    title: string;
    org_legal_name: string;
    category: string;
    location: string;
    description: string;
    skills: string[];
    spots: number;
    age_min: number;
    commitment_type: string;
    additional_requirements: string | null;
    activities: string;
    impact: string;
    benefits: string;
    start_date: string;
    end_date: string;
    daily_hours: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string | null;
    org_type: string;
    reg_number: string;
    reg_authority: string;
    reg_date: string | null;
    pan_number: string;
    website: string | null;
    authorized_signatory: string;
    signatory_role: string;
    document_urls: Record<string, string>;
    status: string;
    rejection_reason: string | null;
    created_at: string;
    user_id: string;
  };
  
  export type KycRecord = {
    id: string;
    user_id: string;
    full_name: string;
    date_of_birth: string;
    gender: string;
    citizenship_number: string;
    citizenship_issued_district: string;
    citizenship_issued_date: string;
    pan_number: string | null;
    phone_number: string;
    email: string;
    province: string;
    district: string;
    municipality: string;
    ward_number: string;
    tole: string | null;
    permanent_address: string;
    temporary_address: string | null;
    occupation: string;
    source_of_funds: string;
    citizenship_front_url: string;
    citizenship_back_url: string;
    selfie_url: string;
    pan_document_url: string | null;
    status: string;
    rejection_reason: string | null;
    created_at: string;
  };
  
  export const statusBadgeConfig: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    pending: { variant: "outline", label: "Pending" },
    active: { variant: "default", label: "Active" },
    approved: { variant: "default", label: "Approved" },
    rejected: { variant: "destructive", label: "Rejected" },
    suspended: { variant: "destructive", label: "Suspended" },
    completed: { variant: "secondary", label: "Completed" },
    refunded: { variant: "destructive", label: "Refunded" },
  };