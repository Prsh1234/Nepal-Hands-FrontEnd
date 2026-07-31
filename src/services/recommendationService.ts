import api from "@/lib/api";


export const getRecommendations = async (params) => {
    const { data } = await api.get(`/organizer/dashboard/recommendations`,{
        params,
        paramsSerializer: {
            indexes: null
        }
    });
    return data;
  };