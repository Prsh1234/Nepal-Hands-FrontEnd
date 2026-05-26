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
  coverImage?: File | null;
  images: File[];
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  // Verification
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


  uploadedDocs: Record<string, File | null>;
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
    coverImage?: string;
    images: string[];
    contactName: string;
    contactEmail: string;
    contactPhone: string | null;
    status: "PENDING_REVIEW" | "ACTIVE" | "CLOSED" | "REJECTED";
    createdAt: string;
    updatedAt: string;

  }


export const createVolunteerOpportunity = async (data: VolunteerOpportunityRequest) => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("category", data.category);
  formData.append("location", data.location);
  formData.append("description", data.description);
  formData.append("longDescription", data.longDescription);
  formData.append("linkedCampaignId", data.linkedCampaignId || "");
  formData.append("requiredSkills", data.requiredSkills.join(","));
  formData.append("volunteerSpots", String(data.volunteerSpots));
  formData.append("minimumAge", String(data.minimumAge));
  formData.append("commitmentType", data.commitmentType);
  formData.append("requirements", data.requirements);
  formData.append("activities", data.activities);
  formData.append("whyItMatters", data.whyItMatters);
  formData.append("benefits", data.benefits);
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("dailyHours", String(data.dailyHours));
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


  // Verification
  formData.append("orgLegalName", data.orgLegalName);
  formData.append("orgType", data.orgType);
  formData.append("orgAddress", data.orgAddress);

  formData.append("regNumber", data.regNumber);
  formData.append("regAuthority", data.regAuthority);

  if (data.regDate) {
    formData.append("regDate", data.regDate);
  }

  formData.append("panNumber", data.panNumber);

  if (data.website) {
    formData.append("website", data.website);
  }

  formData.append("officialEmail", data.officialEmail);
  formData.append("officialPhone", data.officialPhone);

  formData.append(
    "authorizedSignatory",
    data.authorizedSignatory
  );

  formData.append(
    "signatoryRole",
    data.signatoryRole
  );

  Object.entries(data.uploadedDocs).forEach(
    ([docType, file]) => {
      if (file) {
        formData.append("documents", file);
        formData.append("documentTypes", docType);
      }
    }
  );

  const { data: response } = await api.post(
    "/organizer/volunteer-opportunities",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

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
