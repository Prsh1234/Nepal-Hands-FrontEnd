import api from "@/lib/api";

export interface VolunteerApplicationRequest {
    phone: string;
    motivation: string;
  }

export const getUserAuthority = async () => {
    const { data } = await api.get(`/user/authority`);
    return data;
}

export const getUserData = async () => {
    const { data } = await api.get(`/user`);
    return data;
  };
  export const getOrganizerData = async () => {
    const { data } = await api.get(`/organizer/dashboard`);
    return data;
  };
  export const getUserProfile = async (id: string | number) => {
    const { data } = await api.get(`/user/${id}`);
    return data;
  };
  export const getStatusData = async (id: string | number) => {
    const { data } = await api.get(`/volunteer/applicationStatus/${id}`);
    return data;
  };

  export const updateUserProfile = async (data: any) => {
  
    const response = await api.put(
      `/user`,
      data
    );
  
    return response.data;
  };


  export const applyForVolunteer = async (
    id: number,
    data: VolunteerApplicationRequest
  ) => {
    const { data: response } = await api.post(
      `/volunteer/apply/${id}`,
      data
    );
  
    return response;
  };

  export const updateProfilePicture = async (
    formData: FormData
) => {
    const token = localStorage.getItem("token");

    const response = await api.put(
        `/user/profile-picture`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};



export const getMyDonations = async () => {
    const { data } = await api.get("/volunteer/dashboard/donations");
    return data;
};

export const getMyApplications = async () => {
    const { data } = await api.get("/volunteer/dashboard/applications");
    return data;
};
export const getMyVolunteering = async () => {
  const { data } = await api.get("/volunteer/dashboard/volunteering");
  return data;
};


export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await api.put("/user/change-password", data);
  return response.data;
};