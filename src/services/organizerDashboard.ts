import api from "@/lib/api";


export const getRecentDonations = async (
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/recentDonations"
  );

  return data;
};
export const getOrganizerDashboardStats = async () => {
  const res = await api.get("/organizer/dashboard/stats");
  return res.data;
};

export const getOrganizerCampaigns = async (
  page,
  size,
  direction = "desc"
) => {
  const res = await api.get("/organizer/dashboard/campaigns",
  
  {
    params: {
      page,
      size,
      direction,
    },
  }
  );
  return res.data;
};



export const getOrganizerVolunteers = async () => {
  const res = await api.get("/organizer/dashboard/volunteers");
  return res.data;
};


export const getOrganizerCampaignUpdates = async (
  page = 0,
  size = 10,
  direction = "desc",
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/updates",
    {
      params: {
        page,
        size,
        direction,
        campaignId:
          campaignId && campaignId !== "all"
            ? campaignId
            : undefined,
      },
    }
  );

  return data;
};
export const getOrganizerCampaignSelect = async () => {
  const res = await api.get("/organizer/dashboard/campaigns/select");
  return res.data;
};

export const createCampaignUpdate = async (data: {
  id: string;
  title: string;
  body: string;
}) => {
  const res = await api.post("/organizer/dashboard/campaign/updates", data);
  return res.data;
};



export const getOrganizerVolunteerUpdates = async (
  page = 0,
  size = 10,
  direction = "desc",
  opportunityId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/volunteer/updates",
    {
      params: {
        page,
        size,
        direction,
        opportunityId:
          opportunityId && opportunityId !== "all"
            ? opportunityId
            : undefined,
      },
    }
  );

  return data;
};
export const getOrganizerVolunteerSelect = async () => {
  const res = await api.get("/organizer/dashboard/volunteers/select");
  return res.data;
};

export const createVolunteerUpdate = async (data: {
  id: string;
  title: string;
  body: string;
}) => {
  const res = await api.post("/organizer/dashboard/volunteer/updates", data);
  return res.data;
};

export const getVolunteerApplications = async (
  page = 0,
  size = 10,
  opportunityId?: string,
  status?: string
) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("size", size.toString());

  if (opportunityId) {
    params.append("opportunityId", opportunityId);
  }

  if (status && status !== "all") {
    params.append("status", status);
  }

  const { data } = await api.get(
    `/organizer/dashboard/volunteer/application-requests?${params}`
  );

  return data;
};

export const approveVolunteerApplication = async (id: number) => {
  const { data } = await api.patch(
    `/organizer/dashboard/application/${id}/approve`
  );
  return data;
};

export const rejectVolunteerApplication = async (id: number) => {
  const { data } = await api.patch(
    `/organizer/dashboard/application/${id}/reject`
  );
  return data;
};

export interface CampaignExpensesRequest {
  campaignId: string;
  vendor: string;
  amount: string;
  category: string;
  fileName: string;
  date: string;
  file?: File | null;
}
export interface CampaignExpenses {
  id: string;
  campaignId: string;
  campaignTitle: string;
  vendor: string;
  amount: number;
  category: string;
  fileName: string;
  date: string;
  file?: File | null;
  contentType?: string;
}
export const addCampaignExpenses = async (data: CampaignExpensesRequest) => {
  const formData = new FormData();

  formData.append("campaignId", String(data.campaignId));
  formData.append("vendor", data.vendor);
  formData.append("amount", String(data.amount));
  formData.append("category", data.category);
  formData.append("fileName", data.fileName);
  formData.append("date", data.date);

  if (data.file) {
    formData.append("file", data.file);
  }

  const { data: response } = await api.post(
    "/organizer/dashboard/campaign/transparency/expenses",
    formData
  );

  return response;
};

export const getCampaignDashboardExpenses = async (
  page = 0,
  size = 10,
  direction = "desc",
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/transparency/expenses",
    {
      params: {
        page,
        size,
        direction,
        campaignId:
          campaignId && campaignId !== "all"
            ? campaignId
            : undefined,
      },
    }
  );

  return data;
};




export interface CampaignImpactRequest {
  campaignId: string;
  type: string;
  fileName: string;
  file?: File | null;
}
export interface CampaignImpact {
  id: string;
  campaignId: string;
  campaignTitle: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  file?: File | null;
  contentType?: string;
}


export const addCampaignImpact = async (data: CampaignImpactRequest) => {
  const formData = new FormData();

  formData.append("campaignId", String(data.campaignId));
  formData.append("type", data.type);
  formData.append("fileName", data.fileName);
  if (data.file) {
    formData.append("file", data.file);
  }

  const { data: response } = await api.post(
    "/organizer/dashboard/campaign/transparency/impact",
    formData
  );

  return response;
};

export const getCampaignDashboardImapacts = async (
  page = 0,
  size = 10,
  direction = "desc",
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/transparency/impact",
    {
      params: {
        page,
        size,
        direction,
        campaignId:
          campaignId && campaignId !== "all"
            ? campaignId
            : undefined,
      },
    }
  );

  return data;
};


export interface DonorList {
  id: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  donorId: string;
  amount: number;
  donatedAt: string;
  anonymous: boolean;
}


export const getCampaignDonorList = async (
  page = 0,
  size = 10,
  direction = "desc",
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/donationList",
    {
      params: {
        page,
        size,
        direction,
        campaignId:
          campaignId && campaignId !== "all"
            ? campaignId
            : undefined,
      },
    }
  );

  return data;
};
export const getDonationDashboard = async (
  campaignId?: string
) => {
  const { data } = await api.get(
    "/organizer/dashboard/campaign/donationDashboard",
    {
      params: {
        campaignId:
          campaignId && campaignId !== "all"
            ? campaignId
            : undefined,
      },
    }
  );

  return data;
};
export const exportDonationsCsv = async (
  campaignId?: string
) => {
  const token = localStorage.getItem("token");

  const response = await api.get(
    `/organizer/dashboard/campaign/donations/export`,
    {
      params:
        campaignId && campaignId !== "all"
          ? { campaignId }
          : {},
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    }
  );

  return response.data;
};