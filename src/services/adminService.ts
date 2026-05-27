// src/services/volunteerService.ts
import api from "@/lib/api";

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
    coverImage?: string;
    images: string[];
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
    status: "PENDING_REVIEW" | "ACTIVE" | "CLOSED" | "REJECTED";
    createdAt: string;
    updatedAt: string;

    verification?: {
      orgLegalName: string;
      orgType: string;
      orgAddress: string;
      regNumber: string;
      regAuthority: string;
      regDate?: string;
      panNumber: string;
      website?: string;
      officialEmail: string;
      officialPhone: string;
      authorizedSignatory: string;
      signatoryRole: string;
    }
  }



export const getVolunteerOpportunities = async (params?: {
    category?: string;
    location?: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/admin/volunteer-opportunities", { params });
    return data;
  };
  
  // Public — no auth needed, fetches a single ACTIVE opportunity by id

  

  export const updateVolunteerStatus = async (
    id: string | number,
    status: "ACTIVE" | "REJECTED"
  ) => {
    const { data } = await api.patch(
      `/admin/volunteer-opportunities/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return data;
  };


  export const getCampaigns = async (params?: {
    category?: string;
    location?: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/admin/campaign", { params });
    return data;
  };
  
  // Public — no auth needed, fetches a single ACTIVE opportunity by id

  

  export const updateCampaignStatus = async (
    id: string | number,
    status: "ACTIVE" | "REJECTED"
  ) => {
    const { data } = await api.patch(
      `/admin/campaign/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return data;
  };