import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  CarIcon,
  ClockIcon,
  CheckCircleIcon,
  DollarSignIcon,
  TrendingUpIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  EyeIcon
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { reportService } from '../services/reportService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    completedVehicles: 0,
    paidVehicles: 0,
    unpaidVehicles: 0,
    totalRevenue: 0,
    paymentRate: 0
  });
  const [vehicleTypeStats, setVehicleTypeStats] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicle statistics
      const vehicleStatsResponse = await vehicleService.getVehicleStats();
      const vehicleStats = vehicleStatsResponse.data.summary;
      
      // Fetch today's report summary
      const reportResponse = await reportService.getReportSummary({ period: 'today' });
      const reportData = reportResponse.data;

      setStats({
        totalVehicles: vehicleStats.totalVehicles,
        activeVehicles: vehicleStats.activeVehicles,
        completedVehicles: vehicleStats.completedVehicles,
        paidVehicles: vehicleStats.paidVehicles,
        unpaidVehicles: vehicleStats.unpaidVehicles,
        totalRevenue: reportData.summary.totalRevenue,
        paymentRate: reportData.summary.paymentRate
      });

      setVehicleTypeStats(vehicleStats.vehicleTypeStats || []);

      // Fetch recent vehicles (last 5)
      const recentVehiclesResponse = await vehicleService.getVehicles({ limit: 5 });
      setRecentActivity(recentVehiclesResponse.data.vehicles || []);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' && value >= 1000 
              ? `${(value / 1000).toFixed(1)}K` 
              : value}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}% from yesterday
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="loading-spinner h-12 w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your parking today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles}
          icon={CarIcon}
          color="blue"
        />
        <StatCard
          title="Active Now"
          value={stats.activeVehicles}
          icon={ClockIcon}
          color="yellow"
        />
        <StatCard
          title="Total Revenue"
          value={`ETB ${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSignIcon}
          color="green"
        />
        <StatCard
          title="Payment Rate"
          value={`${stats.paymentRate}%`}
          icon={TrendingUpIcon}
          color="purple"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Completed Today"
          value={stats.completedVehicles}
          icon={CheckCircleIcon}
          color="green"
        />
        <StatCard
          title="Paid Vehicles"
          value={stats.paidVehicles}
          icon={DollarSignIcon}
          color="success"
        />
        <StatCard
          title="Unpaid Vehicles"
          value={stats.unpaidVehicles}
          icon={UsersIcon}
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Type Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Vehicle Type Breakdown</h3>
          </div>
          <div className="card-body">
            {vehicleTypeStats.length > 0 ? (
              <div className="space-y-4">
                {vehicleTypeStats.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        type._id === 'Car' ? 'bg-blue-500' :
                        type._id === 'Motorcycle' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{type._id}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{type.count}</div>
                      <div className="text-xs text-gray-500">Avg: ETB {type.avgFee?.toFixed(2) || '0.00'}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No vehicle data available</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Link
              to="/admin/active-vehicles"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="card-body">
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((vehicle) => (
                  <div key={vehicle._id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        vehicle.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vehicle.plateNumber}</p>
                        <p className="text-xs text-gray-500">{vehicle.vehicleType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`badge ${
                        vehicle.paymentStatus === 'paid' ? 'badge-success' :
                        vehicle.paymentStatus === 'pending' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {vehicle.paymentStatus}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(vehicle.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/add-vehicle"
            className="flex items-center justify-center space-x-2 btn btn-primary p-4"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Vehicle</span>
          </Link>
          <Link
            to="/admin/active-vehicles"
            className="flex items-center justify-center space-x-2 btn btn-outline p-4"
          >
            <EyeIcon className="h-5 w-5" />
            <span>View Active Vehicles</span>
          </Link>
          <Link
            to="/admin/reports"
            className="flex items-center justify-center space-x-2 btn btn-outline p-4"
          >
            <TrendingUpIcon className="h-5 w-5" />
            <span>View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
