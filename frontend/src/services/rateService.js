import api from './authService';

export const rateService = {
  // Get all rates
  getRates: async () => {
    return await api.get('/rates');
  },

  // Get rate for specific vehicle type
  getRate: async (vehicleType) => {
    return await api.get(`/rates/${vehicleType}`);
  },

  // Update rate for specific vehicle type
  updateRate: async (vehicleType, ratePerMinute) => {
    return await api.put(`/rates/${vehicleType}`, { ratePerMinute });
  },

  // Initialize default rates
  initializeRates: async () => {
    return await api.post('/rates/initialize');
  },

  // Check if rates are initialized
  checkRatesInitialized: async () => {
    return await api.get('/rates/check/initialized');
  },

  // Update multiple rates at once
  updateBulkRates: async (rates) => {
    return await api.post('/rates/bulk', { rates });
  },

  // Get all rates as a map for easy access
  getRatesMap: async () => {
    const response = await rateService.getRates();
    const ratesMap = {};
    response.data.rates.forEach(rate => {
      ratesMap[rate.vehicleType] = rate.ratePerMinute;
    });
    return ratesMap;
  },
};

export default rateService;
