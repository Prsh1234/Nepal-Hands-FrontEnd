export type VolunteerRequest = {
    id: number;
    title: string;
    category: string;
    location: string;
    description: string;
    longDescription?: string;
  
    requiredSkills: string[];
  
    requirements: string[];
  
    activities: string[];
    benefits: string[];
  
    whyItMatters: string;
  
    volunteerSpots: number;
    minimumAge: number;
    commitmentType: string;
  
    startDate: string;
    endDate: string;
    dailyHours: number;
  
    images: string[];
    coverImage: string;
  
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
  
    postedById: number;
    postedByName: string;
  
    status: string;
    createdAt: string;
  
    verification: {
      orgLegalName: string;
      orgType: string;
      orgAddress: string;
  
      regNumber: string;
      regAuthority: string;
      regDate: string | null;
  
      panNumber: string;
  
      website: string | null;
  
      officialEmail: string;
      officialPhone: string | null;
  
      authorizedSignatory: string;
      signatoryRole: string;
  
      documents: {
        id: number;
        documentType: string;
        fileName: string;
        file: string;
        contentType: string;
      }[];
    };
  };