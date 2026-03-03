import api from './authService';

export const vehicleService = {
  // Add new vehicle
  addVehicle: async (vehicleData) => {
    return await api.post('/vehicles', vehicleData);
  },

  // Get all vehicles with optional filtering
  getVehicles: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/vehicles${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    return await api.get(`/vehicles/${id}`);
  },

  // Mark vehicle as exited
  exitVehicle: async (id) => {
    return await api.put(`/vehicles/${id}/exit`);
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    return await api.delete(`/vehicles/${id}`);
  },

  // Get vehicle statistics summary
  getVehicleStats: async () => {
    return await api.get('/vehicles/stats/summary');
  },

  // Get active vehicles
  getActiveVehicles: async (params = {}) => {
    return await vehicleService.getVehicles({ ...params, status: 'active' });
  },

  // Get completed vehicles
  getCompletedVehicles: async (params = {}) => {
    return await vehicleService.getVehicles({ ...params, status: 'completed' });
  },

  // Get paid vehicles
  getPaidVehicles: async (params = {}) => {
    return await vehicleService.getVehicles({ ...params, paymentStatus: 'paid' });
  },

  // Get unpaid vehicles
  getUnpaidVehicles: async (params = {}) => {
    return await vehicleService.getVehicles({ ...params, paymentStatus: 'pending' });
  },
};

export default vehicleService;
