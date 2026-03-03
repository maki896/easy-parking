import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  CheckCircleIcon,
  CarIcon,
  DollarSignIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  EyeIcon,
  CreditCardIcon,
  DownloadIcon
} from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { paymentService } from '../services/paymentService';
import PaymentModal from '../components/PaymentModal';
import moment from 'moment';

const CompletedVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [processingPayment, setProcessingPayment] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchCompletedVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, filterType, filterPayment]);

  const fetchCompletedVehicles = async () => {
    try {
      const response = await vehicleService.getCompletedVehicles();
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch completed vehicles:', error);
      toast.error('Failed to load completed vehicles');
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

    // Filter by payment status
    if (filterPayment !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.paymentStatus === filterPayment);
    }

    // Sort by exit time (most recent first)
    filtered.sort((a, b) => new Date(b.exitTime) - new Date(a.exitTime));

    setFilteredVehicles(filtered);
  };

  const handleInitializePayment = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    fetchCompletedVehicles();
    setSelectedVehicle(null);
    setIsPaymentModalOpen(false);
  };

  const handleClosePaymentModal = () => {
    setSelectedVehicle(null);
    setIsPaymentModalOpen(false);
  };

  const exportToCSV = () => {
    const csvData = filteredVehicles.map(vehicle => [
      vehicle.plateNumber,
      vehicle.vehicleType,
      vehicle.color || '',
      moment(vehicle.entryTime).format('YYYY-MM-DD HH:mm:ss'),
      moment(vehicle.exitTime).format('YYYY-MM-DD HH:mm:ss'),
      vehicle.durationInMinutes,
      vehicle.ratePerMinute,
      vehicle.fee,
      vehicle.status,
      vehicle.paymentStatus,
      vehicle.paymentReference || ''
    ]);

    const headers = ['Plate Number', 'Vehicle Type', 'Color', 'Entry Time', 'Exit Time', 'Duration (min)', 'Rate/min', 'Fee', 'Status', 'Payment Status', 'Payment Reference'];
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `completed_vehicles_${moment().format('YYYY-MM-DD')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('CSV exported successfully');
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

  const totalRevenue = filteredVehicles
    .filter(v => v.paymentStatus === 'paid')
    .reduce((sum, v) => sum + v.fee, 0);

  const unpaidCount = filteredVehicles.filter(v => v.paymentStatus === 'pending').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Completed Vehicles</h1>
            <p className="text-gray-600 mt-2">Vehicles that have exited the parking facility</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportToCSV}
              className="btn btn-outline flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={fetchCompletedVehicles}
              className="btn btn-outline flex items-center space-x-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Completed</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.paymentStatus === 'paid').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSignIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unpaid</p>
              <p className="text-2xl font-bold text-yellow-600">{unpaidCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">ETB {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">💰</span>
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
            <div className="md:w-48">
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="input"
              >
                <option value="all">All Payment Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Completed Vehicles ({filteredVehicles.length})
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
                <th className="table-header-cell">Exit Time</th>
                <th className="table-header-cell">Duration</th>
                <th className="table-header-cell">Fee</th>
                <th className="table-header-cell">Payment</th>
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
                      {moment(vehicle.entryTime).format('MM/DD HH:mm')}
                    </td>
                    <td className="table-cell">
                      {moment(vehicle.exitTime).format('MM/DD HH:mm')}
                    </td>
                    <td className="table-cell">
                      {vehicle.durationInMinutes} min
                    </td>
                    <td className="table-cell font-semibold">
                      ETB {vehicle.fee.toFixed(2)}
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${
                        vehicle.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {vehicle.paymentStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        {vehicle.paymentStatus === 'pending' && (
                          <button
                            onClick={() => handleInitializePayment(vehicle)}
                            disabled={processingPayment === vehicle._id}
                            className="btn btn-primary btn-sm"
                            title="Initialize payment"
                          >
                            {processingPayment === vehicle._id ? (
                              <div className="loading-spinner h-4 w-4"></div>
                            ) : (
                              <CreditCardIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
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
                  <td colSpan="9" className="table-cell text-center text-gray-500 py-8">
                    {searchTerm || filterType !== 'all' || filterPayment !== 'all'
                      ? 'No vehicles match your search criteria'
                      : 'No completed vehicles found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        vehicle={selectedVehicle}
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default CompletedVehicles;
