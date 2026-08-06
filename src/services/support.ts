import axios from "axios";

export const generateSupportSignature = async (data: any) => {
    return axios.post(
        "http://localhost:8080/api/support/payment/generate-signature",
        data
    );
};


export const handleEsewaSupportPayment = async (
    amount: number,
    supporter: {
        name: string;
        email: string;
        message: string;
        anonymous: boolean;
    }
) => {
    try {

        const product_code = "EPAYTEST";

        const response = await generateSupportSignature({
            supporterName: supporter.name,
            supporterEmail: supporter.email,
            message: supporter.message,
            anonymous: supporter.anonymous,
            total_amount: amount,
            product_code,
        });

        const {
            signature,
            signed_field_names,
            transaction_uuid,
        } = response.data;

        const params = {
            amount,
            total_amount: amount,
            transaction_uuid,
            product_code,
            signature,
            success_url:
            "http://localhost:8080/api/support/esewa/platform/success",
            failure_url: "http://localhost:8080/api/support/esewa/platform/failure",
            tax_amount: 0,
            product_service_charge: 0,
            product_delivery_charge: 0,
            signed_field_names,
        };

        const form = document.createElement("form");
        form.method = "POST";
        form.action =
            "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(params).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        form.remove();

    } catch (error) {
        console.error(error);
        throw error;
    }
};