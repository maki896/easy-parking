import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CarIcon, PlusIcon } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { rateService } from '../services/rateService';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    vehicleType: 'Car',
    color: ''
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const ratesMap = await rateService.getRatesMap();
      setRates(ratesMap);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      toast.error('Failed to load current rates');
    } finally {
      setRatesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'plateNumber') {
      // Convert to uppercase and remove spaces
      setFormData({
        ...formData,
        [name]: value.toUpperCase().replace(/\s/g, '')
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await vehicleService.addVehicle(formData);
      
      if (response.data) {
        toast.success(`Vehicle ${formData.plateNumber} added successfully!`);
        setFormData({
          plateNumber: '',
          vehicleType: 'Car',
          color: ''
        });
        
        // Navigate to active vehicles after a short delay
        setTimeout(() => {
          navigate('/admin/active-vehicles');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add vehicle';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    { value: 'Car', label: '🚗 Car', rate: rates.Car || 1 },
    { value: 'Motorcycle', label: '🏍️ Motorcycle', rate: rates.Motorcycle || 0.5 },
    { value: 'Truck', label: '🚛 Truck', rate: rates.Truck || 1.5 }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Vehicle</h1>
        <p className="text-gray-600 mt-2">Register a new vehicle entering the parking facility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CarIcon className="h-5 w-5 mr-2" />
                Vehicle Information
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plate Number */}
                <div>
                  <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="plateNumber"
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="e.g., ABC1234"
                    pattern="[A-Z0-9]{3,10}"
                    title="Plate number must be 3-10 alphanumeric characters"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Enter the vehicle's license plate number (letters and numbers only)
                  </p>
                </div>

                {/* Vehicle Type */}
                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    {vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.rate} ETB/minute
                      </option>
                    ))}
                  </select>
                  {!ratesLoading && (
                    <p className="mt-1 text-sm text-gray-500">
                      Current rate: <span className="font-semibold">{rates[formData.vehicleType]} ETB</span> per minute
                    </p>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                    Color <span className="text-gray-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="input"
                    placeholder="e.g., Blue, Red, White"
                    maxLength="30"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Vehicle color for easy identification
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn btn-primary py-3"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-5 w-5 mr-2"></div>
                        Adding Vehicle...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Vehicle
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/active-vehicles')}
                    className="btn btn-outline px-6"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Rates Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Current Rates</h3>
            </div>
            <div className="card-body">
              {ratesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="loading-spinner h-6 w-6"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicleTypes.map((type) => (
                    <div key={type.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{type.label}</span>
                      <span className="font-semibold text-primary-600">
                        {type.rate} ETB/min
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to="/admin/rate-settings"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Manage Rates →
                </Link>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Instructions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">1.</span>
                  <p>Enter the vehicle's license plate number (alphanumeric only)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">2.</span>
                  <p>Select the vehicle type to apply the correct per-minute rate</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">3.</span>
                  <p>Optionally add the vehicle color for easier identification</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-primary-600 font-bold">4.</span>
                  <p>Click "Add Vehicle" to register the vehicle and start timing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Recent Additions</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-gray-500 text-center py-4">
                View recent vehicle additions in the Active Vehicles section
              </p>
              <Link
                to="/admin/active-vehicles"
                className="btn btn-outline w-full text-sm"
              >
                View Active Vehicles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
