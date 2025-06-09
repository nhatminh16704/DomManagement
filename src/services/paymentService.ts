import { PaymentRequest } from "@/types/payment";
import { ApiResponse } from "@/types/api";

export const payment = async(paymentrequest: PaymentRequest, typePayment: string): Promise<string> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/vnpay/${typePayment}`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(paymentrequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || await response.text();
      throw new Error(errorMessage);
    }

    const apiResponse: ApiResponse<string> = await response.json();
    return apiResponse.data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}