export const mockCreator = {
    name: "Sita Devi Thapa",
    avatar: "ST",
    joinedDate: "March 2025",
    verified: true,
    org: "Himalayan Hope Foundation",
  };
  
  
  
  export type OrgVolunteerOp = {
    id: string;
    title: string;
    category: string;
    status: "active" | "closed" | "pending";
    filledSpots: number;
    capacity: number;
    location: string;
    startDate: string;
    createdDate: string;
  };

  

  
 
  
  
  export const mockPayouts = [
    { id: "p1", campaign: "School Rebuilding in Sindhupalchok", amount: 500000, status: "paid" as const, date: "2026-04-05", method: "NPR Bank Transfer" },
    { id: "p2", campaign: "Clean Water for Dolakha", amount: 200000, status: "processing" as const, date: "2026-05-08", method: "NPR Bank Transfer" },
    { id: "p3", campaign: "Heritage Restoration in Patan", amount: 350000, status: "paid" as const, date: "2026-03-20", method: "NPR Bank Transfer" },
  ];
  