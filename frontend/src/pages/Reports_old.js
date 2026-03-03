import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUpIcon,
  DollarSignIcon,
  CarIcon,
  DownloadIcon,
  CalendarIcon,
  BarChart3Icon,
  PieChartIcon
} from 'lucide-react';
import { reportService } from '../services/reportService';
import moment from 'moment';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchReportData();
    fetchAnalyticsData();
  }, [period, startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const params = period !== 'custom' ? { period } : { startDate, endDate };
      const response = await reportService.getReportSummary(params);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const params = { period };
      const response = await reportService.getAnalytics(params);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = period !== 'custom' ? { period } : { startDate, endDate };
      await reportService.exportCSV(params);
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading || !reportData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner h-12 w-12"></div>
        </div>
      </div>
    );
  }

  const { summary, vehicleTypeStats, dailyRevenue, paymentStats } = reportData;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into your parking operations</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportCSV}
              className="btn btn-outline flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex space-x-2">
              {['today', 'week', 'month', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    period === p
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4" />
              <span>
                {moment(reportData.period.start).format('MMM DD, YYYY')} - {moment(reportData.period.end).format('MMM DD, YYYY')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSignIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalVehicles}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">{summary.paymentRate}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Fee</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.avgFee)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3Icon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3Icon className="h-5 w-5 mr-2" />
              Revenue Trend
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => moment(value).format('MM/DD')}
                />
                <YAxis tickFormatter={(value) => `ETB ${value}`} />
                <Tooltip 
                  labelFormatter={(value) => moment(value).format('MMM DD, YYYY')}
                  formatter={(value) => [`ETB ${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Vehicle Type Distribution
            </h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {vehicleTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Type Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Type Statistics</h3>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Vehicle Type</th>
                    <th className="table-header-cell">Count</th>
                    <th className="table-header-cell">Revenue</th>
                    <th className="table-header-cell">Avg Fee</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {vehicleTypeStats.map((type, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell font-medium">
                        <span className="inline-flex items-center">
                          {type._id === 'Car' && '🚗'}
                          {type._id === 'Motorcycle' && '🏍️'}
                          {type._id === 'Truck' && '🚛'}
                          <span className="ml-2">{type._id}</span>
                        </span>
                      </td>
                      <td className="table-cell">{type.count}</td>
                      <td className="table-cell font-semibold">
                        {formatCurrency(type.revenue)}
                      </td>
                      <td className="table-cell">
                        {formatCurrency(type.avgFee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Payment Status</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {paymentStats.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status._id === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium text-gray-900 capitalize">{status._id}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{status.count}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(status.totalAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
