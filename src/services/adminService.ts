// src/services/adminService.ts
import api from "@/lib/api";


export const getVolunteerOpportunities = async (params?: {
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/admin/volunteer-opportunities", { params });
    return data;
  };
  
  // Public — no auth needed, fetches a single ACTIVE opportunity by id

  // export const deleteVolunteerOpportunity = async (
  //   id: string | number,
  // ) => {
  //   const { data } = await api.delete(
  //     `/admin/volunteer-opportunities/delete/${id}`,
  //     null,
      
  //   );
  //   return data;
  // };

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


  export const getKycs = async (params?: {
    status: string;
    page?: number;
    size?: number;
  }) => {
    const { data } = await api.get("/admin/kyc", { params });
    return data;
  };

  export const updateKycStatus = async (
    id: string | number,
    status: "APPROVED" | "REJECTED",
    reason?: string
  ) => {
    const { data } = await api.patch(
      `/admin/kyc/${id}/status`,
      null,
      {
        params: {
          status,
          reason,
        },
      }
    );
    return data;
  };