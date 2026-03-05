import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed | pending
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const tx_ref = searchParams.get('tx_ref')
      || searchParams.get('trx_ref')
      || localStorage.getItem('pending_tx_ref');
    const chapaStatus = searchParams.get('status');

    localStorage.removeItem('pending_tx_ref');
    localStorage.removeItem('pending_vehicle_id');

    if (!tx_ref) {
      setStatus('failed');
      setMessage('No transaction reference found. Please go back and try again.');
      return;
    }

    // If Chapa already confirmed success in the redirect URL, show success immediately
    // then quietly verify in background to fetch the amount
    if (chapaStatus === 'success') {
      setStatus('success');
      setMessage('Payment completed successfully!');
      verifyInBackground(tx_ref);
    } else {
      verifyPayment(tx_ref);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const verifyInBackground = async (tx_ref) => {
    try {
      const response = await paymentService.verifyPayment(tx_ref);
      const data = response.data;
      if (data.vehicle?.fee) {
        setAmount(`ETB ${data.vehicle.fee.toFixed(2)}`);
      }
    } catch (error) {
      // Silent — already showing success based on Chapa redirect status
    }
  };

  const verifyPayment = async (tx_ref) => {
    try {
      setStatus('verifying');
      const response = await paymentService.verifyPayment(tx_ref);
      const data = response.data;

      if (data.status === 'paid' || data.status === 'success') {
        setStatus('success');
        setMessage('Payment completed successfully!');
        setAmount(data.vehicle?.fee ? `ETB ${data.vehicle.fee.toFixed(2)}` : '');
      } else {
        setStatus('pending');
        setMessage('Payment is still being processed. Please check the dashboard.');
      }
    } catch (error) {
      setStatus('failed');
      setMessage(error.response?.data?.message || 'Payment verification failed. Please check the dashboard.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">🅿️</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Easy Park</h1>
        </div>

        {/* Status Icon & Message */}
        {status === 'verifying' && (
          <div className="py-6">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
            <p className="text-gray-500">Please wait while we confirm your payment.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful! ✅</h2>
            {amount && (
              <div className="text-3xl font-bold text-gray-900 mb-3">{amount}</div>
            )}
            <p className="text-gray-600 mb-2">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-green-800 text-sm font-medium">✅ Payment received by Chapa</p>
              <p className="text-green-800 text-sm font-medium">✅ Parking fee cleared</p>
              <p className="text-green-800 text-sm font-medium">✅ Dashboard updated</p>
            </div>
            <button
              onClick={() => navigate('/admin/completed-vehicles')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              View Completed Vehicles
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full mt-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'pending' && (
          <div className="py-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <ClockIcon className="h-12 w-12 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">Payment Pending</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/admin/completed-vehicles')}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              Check Payment Status
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div className="py-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <XCircleIcon className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/admin/completed-vehicles')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
              Try Again
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
