import api from "@/lib/api";

export interface KycRequest {
  full_name: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";

  citizenship_number: string;
  citizenship_issued_district: string;
  citizenship_issued_date: string;

  pan_number?: string | null;

  phone_number: string;
  email: string;

  province: string;
  district: string;
  municipality: string;
  ward_number: string;

  tole?: string | null;

  permanent_address: string;
  temporary_address?: string | null;

  occupation: string;
  source_of_funds: string;

  citizenship_front: File;
  citizenship_back: File;
  pan_document?: File | null;
}

export interface KycResponse {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const createKyc = async (data: KycRequest) => {
  const formData = new FormData();

  formData.append("fullName", data.full_name);
  formData.append("dateOfBirth", data.date_of_birth);
  formData.append("gender", data.gender);

  formData.append("citizenshipNumber", data.citizenship_number);
  formData.append(
    "citizenshipIssuedDistrict",
    data.citizenship_issued_district
  );
  formData.append(
    "citizenshipIssuedDate",
    data.citizenship_issued_date
  );

  formData.append("phoneNumber", data.phone_number);
  formData.append("email", data.email);

  formData.append("province", data.province);
  formData.append("district", data.district);
  formData.append("municipality", data.municipality);
  formData.append("wardNumber", data.ward_number);

  formData.append("permanentAddress", data.permanent_address);

  formData.append("occupation", data.occupation);
  formData.append("sourceOfFunds", data.source_of_funds);

  if (data.pan_number) {
    formData.append("panNumber", data.pan_number);
  }

  if (data.tole) {
    formData.append("tole", data.tole);
  }

  if (data.temporary_address) {
    formData.append("temporaryAddress", data.temporary_address);
  }

  formData.append("citizenshipFront", data.citizenship_front);
  formData.append("citizenshipBack", data.citizenship_back);

  if (data.pan_document) {
    formData.append("panDocument", data.pan_document);
  }

  const { data: response } = await api.post(
    "/kyc",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

export const getMyKyc = async () => {
  const { data } = await api.get("/kyc/me");
  return data;
};