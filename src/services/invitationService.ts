import api from "@/lib/api";

export const sendInvitation = async (payload) => {
    const formData = new FormData();

    formData.append("volunteerId", payload.volunteerId);
    formData.append("opportunityId", payload.opportunityId);
    formData.append("message", payload.message);
   console.log(formData)
    const { data } = await api.post(
      "/organizer/dashboard/invitations",
      formData
    );
  
    return data;
  };


  export const getOrganizerInvitations = async () => {
    const { data } = await api.get("/organizer/dashboard/invitations");
    return data;
};

export const withdrawInvitation = async (id: number) => {
    await api.delete(`/organizer/dashboard/invitations/${id}`);
};








export const getVolunteerInvitations = async () => {
  const { data } = await api.get("/volunteer/invitations");
  return data;
};

export const respondInvitation = async (
  id: number | string,
  status: "ACCEPTED" | "DECLINED",
  responseNote?: string
) => {
  await api.put(`/volunteer/invitations/${id}`, {
      status,
      responseNote
  });
};