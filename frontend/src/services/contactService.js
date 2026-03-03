import api from './authService';

export const contactService = {
  // Submit contact form (public)
  submitContact: async (contactData) => {
    return await api.post('/contact', contactData);
  },

  // Get all contact messages (admin only)
  getContacts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/contact${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get contact message by ID (admin only)
  getContactById: async (id) => {
    return await api.get(`/contact/${id}`);
  },

  // Update contact message status (admin only)
  updateContactStatus: async (id, status) => {
    return await api.put(`/contact/${id}/status`, { status });
  },

  // Delete contact message (admin only)
  deleteContact: async (id) => {
    return await api.delete(`/contact/${id}`);
  },

  // Get contact statistics summary (admin only)
  getContactStats: async () => {
    return await api.get('/contact/stats/summary');
  },
};

export default contactService;
