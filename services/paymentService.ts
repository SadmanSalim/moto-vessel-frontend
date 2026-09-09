import api from "@/lib/axios";
import { unwrap } from "@/lib/api";

export const paymentService = {
  initSslCommerz: async (orderNumber: string): Promise<{ gateway_url: string }> =>
    unwrap(await api.post("/payment/sslcommerz/init", { order_number: orderNumber })),
};
