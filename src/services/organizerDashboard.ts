import api from "@/lib/api";




export const getOrganizerCampaigns = async () => {
  const res = await api.get("/organizer/dashboard/campaigns");
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