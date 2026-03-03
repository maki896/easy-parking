import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ClockIcon,
  CarIcon,
  DollarSignIcon,
  LogOutIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  EyeIcon
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { paymentService } from '../services/paymentService';
import moment from 'moment';

const ActiveVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [processingPayment, setProcessingPayment] = useState(null);

  useEffect(() => {
    fetchActiveVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filterType]);

  const fetchActiveVehicles = async () => {
    try {
      const response = await vehicleService.getActiveVehicles();
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch active vehicles:', error);
      toast.error('Failed to load active vehicles');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = [...vehicles];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.color && vehicle.color.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by vehicle type
    if (filterType !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === filterType);
    }

    setFilteredVehicles(filtered);
  };

  const handleExitVehicle = async (vehicleId) => {
    try {
      const response = await vehicleService.exitVehicle(vehicleId);
      if (response.data) {
        toast.success('Vehicle marked as exited successfully');
        fetchActiveVehicles();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to exit vehicle';
      toast.error(errorMessage);
    }
  };

  const handleInitializePayment = async (vehicleId) => {
    try {
      setProcessingPayment(vehicleId);
      const response = await paymentService.initializePayment(vehicleId);
      
      if (response.data) {
        toast.success('Payment initialized successfully');
        // You could show a modal with QR code here
        fetchActiveVehicles();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
      toast.error(errorMessage);
    } finally {
      setProcessingPayment(null);
    }
  };

  const calculateDuration = (entryTime) => {
    const now = moment();
    const entry = moment(entryTime);
    const duration = moment.duration(now.diff(entry));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const calculateEstimatedFee = (vehicle) => {
    const now = moment();
    const entry = moment(vehicle.entryTime);
    const durationMinutes = Math.ceil(now.diff(entry) / (1000 * 60));
    return (durationMinutes * vehicle.ratePerMinute).toFixed(2);
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Active Vehicles</h1>
            <p className="text-gray-600 mt-2">Currently parked vehicles in the facility</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchActiveVehicles}
              className="btn btn-outline flex items-center space-x-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <Link
              to="/admin/add-vehicle"
              className="btn btn-primary flex items-center space-x-2"
            >
              <CarIcon className="h-4 w-4" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Active</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cars</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.vehicleType === 'Car').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🚗</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Motorcycles</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.vehicleType === 'Motorcycle').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🏍️</span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trucks</p>
              <p className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.vehicleType === 'Truck').length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🚛</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by plate number, type, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
              >
                <option value="all">All Types</option>
                <option value="Car">Cars</option>
                <option value="Motorcycle">Motorcycles</option>
                <option value="Truck">Trucks</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Vehicles ({filteredVehicles.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Plate Number</th>
                <th className="table-header-cell">Type</th>
                <th className="table-header-cell">Color</th>
                <th className="table-header-cell">Entry Time</th>
                <th className="table-header-cell">Duration</th>
                <th className="table-header-cell">Rate</th>
                <th className="table-header-cell">Est. Fee</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="table-row">
                    <td className="table-cell font-medium">{vehicle.plateNumber}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center">
                        {vehicle.vehicleType === 'Car' && '🚗'}
                        {vehicle.vehicleType === 'Motorcycle' && '🏍️'}
                        {vehicle.vehicleType === 'Truck' && '🚛'}
                        <span className="ml-2">{vehicle.vehicleType}</span>
                      </span>
                    </td>
                    <td className="table-cell">{vehicle.color || '-'}</td>
                    <td className="table-cell">
                      {moment(vehicle.entryTime).format('HH:mm')}
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center text-blue-600">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {calculateDuration(vehicle.entryTime)}
                      </span>
                    </td>
                    <td className="table-cell">{vehicle.ratePerMinute} ETB/min</td>
                    <td className="table-cell font-semibold">
                      ETB {calculateEstimatedFee(vehicle)}
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleExitVehicle(vehicle._id)}
                          className="btn btn-danger btn-sm"
                          title="Mark as exited"
                        >
                          <LogOutIcon className="h-4 w-4" />
                        </button>
                        <Link
                          to={`/admin/vehicle/${vehicle._id}`}
                          className="btn btn-outline btn-sm"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="table-cell text-center text-gray-500 py-8">
                    {searchTerm || filterType !== 'all' 
                      ? 'No vehicles match your search criteria' 
                      : 'No active vehicles in the facility'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveVehicles;
