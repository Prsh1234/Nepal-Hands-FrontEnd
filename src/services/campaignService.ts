
import api from "@/lib/api";

export interface CampaignRequest {
  title: string;
  category: string;
  location: string;
  description: string;
  longDescription: string;
  projectScope: string;
  goal: number;
  duration: string;
  organizer: string;
  startDate: string;
  endDate: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  coverImage?: File | null;
  images: File[];
}
export interface CampaignResponse {
    id: number;
    title: string;
    category: string;
    location: string;
    description: string;
    longDescription: string;
    projectScope: string[];
    goal: number;
    duration: string;
    organizer: string;
    startDate: string;
    endDate: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
    coverImage?: string;
    images: string[];
    status: "PENDING_REVIEW" | "ACTIVE" | "CLOSED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
  }

  export const createCampaign = async (data: CampaignRequest) => {
    const formData = new FormData();
  
    formData.append("title", data.title);
    formData.append("category", data.category);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("longDescription", data.longDescription);
    formData.append("projectScope", data.projectScope);
    formData.append("goal", String(data.goal));
    formData.append("duration", data.duration);
    formData.append("organizer", data.organizer);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("contactName", data.contactName);
    formData.append("contactEmail", data.contactEmail);
  
    if (data.contactPhone) {
      formData.append("contactPhone", data.contactPhone);
    }
  
    if (data.coverImage) {
      formData.append("coverImage", data.coverImage);
    }
  
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  
    const { data: response } = await api.post(
      "/organizer/campaign",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  
    return response;
  };


export const getCampaigns = async (params?: {
    category?: string;
    location?: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/organizer/campaign", { params });
    return data;
  };
  
  // Public — no auth needed, fetches a single ACTIVE opportunity by id
  export const getCampaignById = async (id: string | number) => {
    const { data } = await api.get(`/organizer/campaign/${id}`);
    return data as CampaignResponse;
  };
  
  export const updateCampaign = async (id: number, data: CampaignRequest) => {
    const { data: response } = await api.put(`/organizer/camapaign/${id}`, data);
    return response;
  };
  
  export const deleteCampaign = async (id: number) => {
    await api.delete(`/organizer/campaign/${id}`);
  };