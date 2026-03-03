import api from './authService';

export const paymentService = {
  // Initialize payment for a vehicle
  initializePayment: async (vehicleId) => {
    return await api.post(`/payments/initialize/${vehicleId}`);
  },

  // Verify payment status
  verifyPayment: async (tx_ref) => {
    return await api.post(`/payments/verify/${tx_ref}`);
  },

  // Get payment status for a vehicle
  getPaymentInfo: async (vehicleId) => {
    return await api.get(`/payments/vehicle/${vehicleId}`);
  },

  // Get payment history
  getPaymentHistory: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/payments/history${queryParams ? `?${queryParams}` : ''}`);
  },

  // Handle payment webhook (for testing purposes)
  handleWebhook: async (webhookData) => {
    return await api.post('/payments/webhook', webhookData);
  },
};

export default paymentService;
