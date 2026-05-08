// src/services/volunteerService.ts
import api from "@/lib/api";

export interface VolunteerOpportunityRequest {
  title: string;
  category: string;
  location: string;
  description: string;
  longDescription: string;
  linkedCampaignId: string | null;
  requiredSkills: string[];
  volunteerSpots: number;
  minimumAge: number;
  commitmentType: string;
  requirements: string;
  activities: string;
  whyItMatters: string;
  benefits: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
}
export interface VolunteerOpportunityResponse {
    id: number;
    title: string;
    category: string;
    location: string;
    description: string;
    longDescription: string;
    linkedCampaignId: string | null;
    requiredSkills: string[];
    volunteerSpots: number;
    minimumAge: number;
    commitmentType: string;
    requirements: string[];
    activities: string[];     // backend splits newlines into list
    whyItMatters: string;
    benefits: string[];       // backend splits newlines into list
    startDate: string;
    endDate: string;
    dailyHours: number;
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
    status: "PENDING_REVIEW" | "ACTIVE" | "CLOSED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
  }

export const createVolunteerOpportunity = async (data: VolunteerOpportunityRequest) => {
  const { data: response } = await api.post("/organizer/volunteer-opportunities", data);
  return response;
};


export const getVolunteerOpportunities = async (params?: {
    category?: string;
    location?: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/organizer/volunteer-opportunities", { params });
    return data;
  };
  
  // Public — no auth needed, fetches a single ACTIVE opportunity by id
  export const getVolunteerOpportunityById = async (id: string | number) => {
    const { data } = await api.get(`/organizer/volunteer-opportunities/${id}`);
    return data as VolunteerOpportunityResponse;
  };
  
  export const updateVolunteerOpportunity = async (id: number, data: VolunteerOpportunityRequest) => {
    const { data: response } = await api.put(`/organizer/volunteer-opportunities/${id}`, data);
    return response;
  };
  
  export const deleteVolunteerOpportunity = async (id: number) => {
    await api.delete(`/organizer/volunteer-opportunities/${id}`);
  };