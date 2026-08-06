export type CampaignRequest = {
    id: number;
    title: string;
    category: string;
    location: string;
    description: string;
    longDescription?: string;
    projectScope: string[];
    goal: number;
    organizer: string;
    startDate: string;
    endDate: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;

    images: string[];
    coverImage: string;
    postedById: number;
    postedByName: string;
  
    status: string;
    createdAt: string;
  
    verification: {
      orgLegalName: string;
      orgType: string;
  
      regNumber: string;
      regAuthority: string;
      regDate: string | null;
  
      panNumber: string;
      website: string | null;
  
      bankName: string;
      bankAccountHolderName: string;
      bankAccountNumber: string;
  
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




