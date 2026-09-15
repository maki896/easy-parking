import api from './authService';

export const capacityService = {
  // Get current parking capacity (public - no auth required)
  getCurrentCapacity: async () => {
    return await api.get('/capacity/current');
  },

  // Get detailed capacity statistics (admin only)
  getCapacityStats: async () => {
    return await api.get('/capacity/stats');
  },

  // Update total parking capacity (admin only)
  updateTotalCapacity: async (totalCapacity) => {
    return await api.put('/capacity/total', { totalCapacity });
  },

  // Synchronize capacity with actual vehicle count (admin only)
  synchronizeCapacity: async () => {
    return await api.post('/capacity/synchronize');
  },

  // Reset occupied count (admin only, emergency use)
  resetOccupied: async () => {
    return await api.post('/capacity/reset-occupied', { confirm: 'RESET' });
  },
};

export default capacityService;
