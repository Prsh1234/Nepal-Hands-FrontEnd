import api from "@/lib/api";

export interface VolunteerApplicationRequest {
    phone: string;
    motivation: string;
  }


export const getUserData = async () => {
    const { data } = await api.get(`/user`);
    return data;
  };
  export const getUserProfile = async (id: string | number) => {
    const { data } = await api.get(`/user/${id}`);
    return data;
  };
  export const getApplicationStatus = async (id: string | number) => {
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