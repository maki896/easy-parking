import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  ParkingSquareIcon,
  RefreshCwIcon,
  SettingsIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  SaveIcon
} from 'lucide-react';
import { capacityService } from '../services/capacityService';

const ParkingCapacity = () => {
  const [capacity, setCapacity] = useState({
    totalCapacity: 100,
    currentOccupied: 0,
    availableSlots: 100,
    occupancyPercentage: 0,
    isFull: false
  });
  const [stats, setStats] = useState(null);
  const [newCapacity, setNewCapacity] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    fetchCapacityData();
  }, []);

  const fetchCapacityData = async () => {
    try {
      setLoading(true);
      const [capacityResponse, statsResponse] = await Promise.all([
        capacityService.getCurrentCapacity(),
        capacityService.getCapacityStats()
      ]);
      
      setCapacity(capacityResponse.data);
      setStats(statsResponse.data);
      setNewCapacity(capacityResponse.data.totalCapacity.toString());
    } catch (error) {
      console.error('Fetch capacity error:', error);
      toast.error('Failed to load capacity data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    
    const totalCapacity = parseInt(newCapacity);
    
    if (isNaN(totalCapacity) || totalCapacity < 1) {
      toast.error('Please enter a valid capacity (minimum 1)');
      return;
    }

    if (totalCapacity < capacity.currentOccupied) {
      toast.error(`Cannot reduce capacity below ${capacity.currentOccupied} (current occupied vehicles)`);
      return;
    }

    try {
      setUpdating(true);
      await capacityService.updateTotalCapacity(totalCapacity);
      toast.success('Parking capacity updated successfully');
      fetchCapacityData();
    } catch (error) {
      console.error('Update capacity error:', error);
      toast.error(error.response?.data?.message || 'Failed to update capacity');
    } finally {
      setUpdating(false);
    }
  };

  const handleSynchronize = async () => {
    try {
      const response = await capacityService.synchronizeCapacity();
      const data = response.data;
      
      if (data.difference === 0) {
        toast.info('Capacity is already synchronized');
      } else {
        toast.success(`Synchronized: ${data.oldOccupied} → ${data.newOccupied}`);
      }
      
      fetchCapacityData();
    } catch (error) {
      console.error('Synchronize error:', error);
      toast.error('Failed to synchronize capacity');
    }
  };

  const handleResetOccupied = async () => {
    try {
      await capacityService.resetOccupied();
      toast.success('Occupied count reset to 0');
      setShowResetModal(false);
      fetchCapacityData();
    } catch (error) {
      console.error('Reset error:', error);
      toast.error('Failed to reset occupied count');
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOccupancyBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-100';
    if (percentage >= 75) return 'bg-orange-100';
    if (percentage >= 50) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 90) return 'Critical - Nearly Full';
    if (percentage >= 75) return 'High Occupancy';
    if (percentage >= 50) return 'Moderate Occupancy';
    return 'Low Occupancy';
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
        <h1 className="text-3xl font-bold text-gray-900">Parking Capacity Management</h1>
        <p className="text-gray-600 mt-2">Configure and monitor your parking lot capacity</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Capacity */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{capacity.totalCapacity}</p>
              <p className="text-xs text-gray-500 mt-1">Parking slots</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <ParkingSquareIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Occupied */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Currently Occupied</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{capacity.currentOccupied}</p>
              <p className="text-xs text-gray-500 mt-1">Active vehicles</p>
            </div>
            <div className={`p-3 rounded-lg ${getOccupancyBgColor(capacity.occupancyPercentage)}`}>
              <TrendingUpIcon className={`h-6 w-6 ${getOccupancyColor(capacity.occupancyPercentage)}`} />
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{capacity.availableSlots}</p>
              <p className="text-xs text-gray-500 mt-1">Ready to use</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className={`text-3xl font-bold mt-1 ${getOccupancyColor(capacity.occupancyPercentage)}`}>
                {capacity.occupancyPercentage}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{getStatusText(capacity.occupancyPercentage)}</p>
            </div>
            <div className={`p-3 rounded-lg ${getOccupancyBgColor(capacity.occupancyPercentage)}`}>
              {capacity.occupancyPercentage >= 90 ? (
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <SettingsIcon className={`h-6 w-6 ${getOccupancyColor(capacity.occupancyPercentage)}`} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="card mb-8">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Capacity Overview</h3>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-600">Occupied: {capacity.currentOccupied}</span>
              <span className="text-gray-600">Available: {capacity.availableSlots}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className={`h-8 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-medium ${
                  capacity.occupancyPercentage >= 90 ? 'bg-red-600' :
                  capacity.occupancyPercentage >= 75 ? 'bg-orange-600' :
                  capacity.occupancyPercentage >= 50 ? 'bg-yellow-600' :
                  'bg-green-600'
                }`}
                style={{ width: `${capacity.occupancyPercentage}%` }}
              >
                {capacity.occupancyPercentage > 10 && `${capacity.occupancyPercentage}%`}
              </div>
            </div>
          </div>
          
          {capacity.isFull && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">Parking lot is full! No more vehicles can enter.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Update Capacity Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Update Total Capacity</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateCapacity}>
              <div className="mb-4">
                <label htmlFor="totalCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Parking Slots
                </label>
                <input
                  type="number"
                  id="totalCapacity"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="input"
                  min="1"
                  required
                  placeholder="Enter total capacity"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current: {capacity.totalCapacity} slots | Minimum: {capacity.currentOccupied} (currently occupied)
                </p>
              </div>
              
              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary w-full"
              >
                {updating ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner h-5 w-5 mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <SaveIcon className="h-5 w-5 mr-2" />
                    Update Capacity
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Management Actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Management Actions</h3>
          </div>
          <div className="card-body space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Synchronize Capacity</h4>
              <p className="text-sm text-gray-600 mb-3">
                Recalculate occupied count by counting active vehicles in the database.
              </p>
              <button
                onClick={handleSynchronize}
                className="btn btn-outline w-full"
              >
                <RefreshCwIcon className="h-5 w-5 mr-2" />
                Synchronize Now
              </button>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-red-600 mb-2">Emergency Reset</h4>
              <p className="text-sm text-gray-600 mb-3">
                Reset occupied count to 0. Use only in emergencies. Consider synchronizing instead.
              </p>
              <button
                onClick={() => setShowResetModal(true)}
                className="btn bg-red-600 hover:bg-red-700 text-white w-full"
              >
                <AlertTriangleIcon className="h-5 w-5 mr-2" />
                Reset Occupied Count
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Type Breakdown */}
      {stats && stats.vehicleTypeBreakdown && stats.vehicleTypeBreakdown.length > 0 && (
        <div className="card mt-8">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Current Vehicles by Type</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.vehicleTypeBreakdown.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      type._id === 'Car' ? 'bg-blue-500' :
                      type._id === 'Motorcycle' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{type._id}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{type.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Reset</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset the occupied count to 0? This action should only be used in emergencies.
              Consider using the "Synchronize" option instead to match actual vehicle count.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleResetOccupied}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Reset to 0
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingCapacity;
