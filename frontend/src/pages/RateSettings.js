import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  SettingsIcon,
  DollarSignIcon,
  SaveIcon,
  RefreshCwIcon,
  CarIcon,
  CheckCircleIcon,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';
import { rateService } from '../services/rateService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const RateSettings = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('rates'); // rates | profile | password
  const [rates, setRates] = useState({
    Car: 1,
    Motorcycle: 0.5,
    Truck: 1.5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchRates();
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

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

  const handleProfileChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      
      if (!profileData.username.trim()) {
        toast.error('Username is required');
        return;
      }

      const response = await authService.updateProfile(profileData);
      
      if (response.data) {
        toast.success('Profile updated successfully!');
        await refreshUser();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);

      // Validation
      if (!passwordData.currentPassword) {
        toast.error('Current password is required');
        return;
      }
      if (!passwordData.newPassword) {
        toast.error('New password is required');
        return;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      const response = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage rates, profile, and security settings</p>
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

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('rates')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <DollarSignIcon className="h-5 w-5 inline mr-2" />
            Rate Settings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <UserIcon className="h-5 w-5 inline mr-2" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <LockIcon className="h-5 w-5 inline mr-2" />
            Change Password
          </button>
        </nav>
      </div>

      {/* Rate Settings Tab */}
      {activeTab === 'rates' && (
        <>
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
                      step="0.5"
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
        </>
      )}

      {/* Edit Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <UserIcon className="h-6 w-6 mr-2" />
                Edit Profile
              </h2>
              <p className="text-sm text-gray-600 mt-1">Update your account information</p>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => handleProfileChange('username', e.target.value)}
                    className="input"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="input"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="btn btn-primary w-full"
                  >
                    {savingProfile ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-5 w-5 mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <SaveIcon className="h-5 w-5 mr-2" />
                        Save Profile
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <LockIcon className="h-6 w-6 mr-2" />
                Change Password
              </h2>
              <p className="text-sm text-gray-600 mt-1">Update your account password</p>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="input pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="input pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="input pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="btn btn-primary w-full"
                  >
                    {changingPassword ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-5 w-5 mr-2"></div>
                        Changing Password...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <LockIcon className="h-5 w-5 mr-2" />
                        Change Password
                      </div>
                    )}
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Security Tips:</strong>
                  </p>
                  <ul className="mt-2 text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Use a strong password with letters, numbers, and symbols</li>
                    <li>Don't reuse passwords from other accounts</li>
                    <li>Change your password regularly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateSettings;
