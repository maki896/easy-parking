import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  SettingsIcon,
  DollarSignIcon,
  SaveIcon,
  RefreshCwIcon,
  CarIcon,
  CheckCircleIcon
} from 'lucide-react';
import { rateService } from '../services/rateService';

const RateSettings = () => {
  const [rates, setRates] = useState({
    Car: 1,
    Motorcycle: 0.5,
    Truck: 1.5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const response = await rateService.checkRatesInitialized();
      
      if (response.data.initialized) {
        setRates(response.data.rates);
        setIsInitialized(true);
      } else {
        setIsInitialized(false);
      }
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      toast.error('Failed to load current rates');
    } finally {
      setLoading(false);
    }
  };

  const handleRateChange = (vehicleType, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 9999) {
      setRates({
        ...rates,
        [vehicleType]: numValue
      });
    }
  };

  const handleSaveRates = async () => {
    try {
      setSaving(true);
      
      // Validate all rates
      for (const [vehicleType, rate] of Object.entries(rates)) {
        if (rate < 0 || rate > 9999) {
          toast.error(`Invalid rate for ${vehicleType}. Must be between 0 and 9999`);
          return;
        }
      }

      const response = await rateService.updateBulkRates([
        { vehicleType: 'Car', ratePerMinute: rates.Car },
        { vehicleType: 'Motorcycle', ratePerMinute: rates.Motorcycle },
        { vehicleType: 'Truck', ratePerMinute: rates.Truck }
      ]);

      if (response.data) {
        toast.success('Rates updated successfully!');
        setIsInitialized(true);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update rates';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInitializeRates = async () => {
    try {
      setInitializing(true);
      const response = await rateService.initializeRates();
      
      if (response.data) {
        setRates(response.data.rates);
        setIsInitialized(true);
        toast.success('Default rates initialized successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initialize rates';
      toast.error(errorMessage);
    } finally {
      setInitializing(false);
    }
  };

  const vehicleTypeConfig = [
    {
      type: 'Car',
      icon: '🚗',
      label: 'Car',
      description: 'Standard passenger vehicles',
      example: 'Sedans, SUVs, Hatchbacks'
    },
    {
      type: 'Motorcycle',
      icon: '🏍️',
      label: 'Motorcycle',
      description: 'Two-wheeled vehicles',
      example: 'Motorcycles, Scooters'
    },
    {
      type: 'Truck',
      icon: '🚛',
      label: 'Truck',
      description: 'Large commercial vehicles',
      example: 'Trucks, Vans, Buses'
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Rate Settings</h1>
            <p className="text-gray-600 mt-2">Configure per-minute pricing for different vehicle types</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchRates}
              className="btn btn-outline flex items-center space-x-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            {!isInitialized && (
              <button
                onClick={handleInitializeRates}
                disabled={initializing}
                className="btn btn-secondary flex items-center space-x-2"
              >
                {initializing ? (
                  <div className="loading-spinner h-4 w-4"></div>
                ) : (
                  <SettingsIcon className="h-4 w-4" />
                )}
                <span>Initialize Defaults</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {!isInitialized && (
        <div className="card mb-6 border-l-4 border-yellow-400 bg-yellow-50">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SettingsIcon className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>First-time setup:</strong> Rates haven't been configured yet. 
                  Click "Initialize Defaults" to set up standard pricing, or configure custom rates below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rate Configuration Cards */}
        {vehicleTypeConfig.map((config) => (
          <div key={config.type} className="card">
            <div className="card-header">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{config.label}</h3>
                  <p className="text-sm text-gray-500">{config.description}</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate per Minute (ETB)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ETB
                    </span>
                    <input
                      type="number"
                      value={rates[config.type]}
                      onChange={(e) => handleRateChange(config.type, e.target.value)}
                      className="input pl-12 text-lg font-semibold"
                      min="0"
                      max="9999"
                      step="0.01"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {config.example}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">30 min:</span>
                      <span className="font-medium">ETB {(rates[config.type] * 30).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">1 hour:</span>
                      <span className="font-medium">ETB {(rates[config.type] * 60).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">2 hours:</span>
                      <span className="font-medium">ETB {(rates[config.type] * 120).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSaveRates}
          disabled={saving}
          className="btn btn-primary px-8 py-3 text-lg font-semibold"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="loading-spinner h-5 w-5 mr-2"></div>
              Saving Rates...
            </div>
          ) : (
            <div className="flex items-center">
              <SaveIcon className="h-5 w-5 mr-2" />
              Save All Rates
            </div>
          )}
        </button>
      </div>

      {/* Information Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSignIcon className="h-5 w-5 mr-2" />
              How Pricing Works
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Rates are charged per minute of parking time</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Duration is calculated using ceiling function (rounded up to next minute)</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>Example: 25 minutes at 1 ETB/min = 25 ETB total fee</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p>New rates apply only to vehicles added after the update</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Best Practices
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p>Set competitive rates based on local market conditions</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p>Consider different rates for peak vs off-peak hours</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p>Review rates monthly and adjust based on demand</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p>Keep rates simple and easy for customers to understand</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateSettings;
