import api from './authService';

export const reportService = {
  // Get comprehensive report summary
  getReportSummary: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/reports/summary${queryParams ? `?${queryParams}` : ''}`);
  },

  // Export vehicles data as CSV
  exportCSV: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/reports/export/csv${queryParams ? `?${queryParams}` : ''}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `easyparking_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  // Get detailed analytics with charts data
  getAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await api.get(`/reports/analytics${queryParams ? `?${queryParams}` : ''}`);
  },

  // Get daily revenue data
  getDailyRevenue: async (startDate, endDate) => {
    return await reportService.getReportSummary({ startDate, endDate });
  },

  // Get weekly revenue data
  getWeeklyRevenue: async () => {
    return await reportService.getReportSummary({ period: 'week' });
  },

  // Get monthly revenue data
  getMonthlyRevenue: async () => {
    return await reportService.getReportSummary({ period: 'month' });
  },

  // Get yearly revenue data
  getYearlyRevenue: async () => {
    return await reportService.getReportSummary({ period: 'year' });
  },

  // Get today's revenue data
  getTodayRevenue: async () => {
    return await reportService.getReportSummary({ period: 'today' });
  },
};

export default reportService;
