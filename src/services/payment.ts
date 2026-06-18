
import api from "@/lib/api";


export const generateCampaignSignature = async (data) => {
  
  const response = api.post("/payment/campaign/generate-signature", data);
  return response;
}


export const handleEsewaCampaignPayment = async (
  totalPrice:number,
  campaignId:number,
  anonymous: boolean
  ) => {
  try {
    const total_amount = totalPrice;
    const product_code = "EPAYTEST";

    const data = {
      campaignId,
      total_amount,
      anonymous,
      product_code,
  };
    // generate signature
    const response = await generateCampaignSignature(data);
    const { signature, signed_field_names, transaction_uuid } = response.data;




    const success_url = `http://localhost:8080/api/esewa/campaign/success`;

    const params = {
      amount: total_amount,
      total_amount,
      transaction_uuid,
      product_code: product_code,
      signature,
      failure_url: `http://localhost:8080/api/esewa/campaign/failure`,
      success_url,
      tax_amount: 0,
      product_service_charge: 0,
      product_delivery_charge: 0,
      signed_field_names: signed_field_names,
    };



  
    // create form dynamically
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    form.target = "_blank"; // open in new tab

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    form.remove(); // cleanup
  } catch (error) {
    console.error("Error initiating eSewa payment", error);
    alert("Failed to initiate payment. Please try again.");
  }
};


