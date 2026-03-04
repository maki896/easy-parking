import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  XIcon,
  CreditCardIcon,
  QrCodeIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CameraIcon
} from 'lucide-react';
import { paymentService } from '../services/paymentService';
import QRScanner from './QRScanner';

const PaymentModal = ({ vehicle, isOpen, onClose, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const initializePayment = async () => {
    try {
      setLoading(true);
      const response = await paymentService.initializePayment(vehicle._id);
      
      if (response.data) {
        setPaymentData(response.data.payment);
        setShowQR(true);
        toast.success('Payment initialized successfully');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to initialize payment';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentData?.tx_ref) return;
    
    try {
      setVerifying(true);
      const response = await paymentService.verifyPayment(paymentData.tx_ref);
      
      if (response.data.status === 'paid') {
        toast.success('Payment verified successfully!');
        onPaymentSuccess();
        onClose();
      } else {
        toast.info('Payment not completed yet');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify payment';
      toast.error(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const copyPaymentLink = () => {
    if (paymentData?.checkout_url) {
      navigator.clipboard.writeText(paymentData.checkout_url);
      toast.success('Payment link copied to clipboard');
    }
  };

  const openPaymentLink = () => {
    if (paymentData?.checkout_url) {
      // Save tx_ref to localStorage so PaymentReturn page can retrieve it
      localStorage.setItem('pending_tx_ref', paymentData.tx_ref);
      localStorage.setItem('pending_vehicle_id', vehicle._id);
      window.open(paymentData.checkout_url, '_blank');
    }
  };

  const handleQRScanSuccess = (qrData) => {
    // Process QR code data (could be payment confirmation, transaction ID, etc.)
    console.log('QR Data scanned:', qrData);
    toast.info('QR code scanned! Verifying payment...');
    
    // Try to verify payment after QR scan
    setTimeout(() => {
      verifyPayment();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Payment for {vehicle.plateNumber}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-semibold">{vehicle.plateNumber} ({vehicle.vehicleType})</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Parking Fee</p>
                <p className="font-semibold text-lg">ETB {vehicle.fee.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{vehicle.durationInMinutes} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rate</p>
                <p className="font-semibold">ETB {vehicle.ratePerMinute}/min</p>
              </div>
            </div>
          </div>

          {!paymentData ? (
            /* Initialize Payment */
            <div className="text-center py-8">
              <CreditCardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initialize Payment</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to generate a payment QR code and link
              </p>
              <button
                onClick={initializePayment}
                disabled={loading}
                className="btn btn-primary px-8 py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="loading-spinner h-5 w-5 mr-2"></div>
                    Initializing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Initialize Payment
                  </div>
                )}
              </button>
            </div>
          ) : (
            /* Payment Active */
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <QrCodeIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Ready</h3>
                <p className="text-gray-600">
                  Transaction Reference: <span className="font-mono font-semibold">{paymentData.tx_ref}</span>
                </p>
              </div>

              {/* QR Code Section */}
              {showQR && paymentData.qr_code && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="text-center">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Scan QR Code to Pay</h4>
                    <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
                      <img 
                        src={paymentData.qr_code} 
                        alt="Payment QR Code"
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Scan with Chapa mobile app or any QR code reader
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={openPaymentLink}
                    className="btn btn-primary flex-1 flex items-center justify-center"
                  >
                    <ExternalLinkIcon className="h-4 w-4 mr-2" />
                    Open Payment Link
                  </button>
                  <button
                    onClick={copyPaymentLink}
                    className="btn btn-outline flex-1 flex items-center justify-center"
                  >
                    Copy Link
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setIsQRScannerOpen(true)}
                    className="btn btn-secondary flex items-center"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Scan Payment QR
                  </button>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={verifyPayment}
                    disabled={verifying}
                    className="btn btn-outline flex items-center"
                  >
                    {verifying ? (
                      <div className="flex items-center">
                        <div className="loading-spinner h-4 w-4 mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <RefreshCwIcon className="h-4 w-4 mr-2" />
                        Verify Payment
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How to Pay:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Scan the QR code with your mobile banking app</li>
                  <li>Or click "Open Payment Link" to pay in browser</li>
                  <li>Complete the payment using your preferred method</li>
                  <li>Click "Verify Payment" after completing the transaction</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
        title="Scan Payment Confirmation QR"
      />
    </div>
  );
};

export default PaymentModal;
