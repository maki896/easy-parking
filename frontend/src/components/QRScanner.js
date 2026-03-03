import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { toast } from 'react-toastify';
import { 
  XIcon,
  CameraIcon,
  UploadIcon,
  CheckCircleIcon
} from 'lucide-react';

const QRScanner = ({ isOpen, onClose, onScanSuccess, title = "Scan QR Code" }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);

  const handleScan = (result) => {
    if (result) {
      try {
        // The QR scanner might return different formats
        const qrData = typeof result === 'string' ? result : result[0]?.rawValue || result;
        
        if (qrData) {
          toast.success('QR Code scanned successfully!');
          onScanSuccess(qrData);
          onClose();
        }
      } catch (err) {
        console.error('QR scan error:', err);
        setError('Failed to process QR code');
      }
    }
  };

  const handleError = (error) => {
    console.error('QR Scanner error:', error);
    setError('Camera access denied or not available');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // For now, we'll just show a message
          // In a real implementation, you'd use a QR code detection library
          toast.info('QR code from image upload not yet implemented');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <CameraIcon className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsScanning(true);
                }}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              {isScanning ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">
                      Position the QR code within the frame to scan
                    </p>
                  </div>
                  
                  {/* QR Scanner */}
                  <div className="relative">
                    <Scanner
                      onScan={handleScan}
                      onError={handleError}
                      constraints={{
                        facingMode: 'environment'
                      }}
                      containerStyle={{
                        width: '100%',
                        height: '300px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    />
                  </div>

                  {/* Toggle Camera/File Upload */}
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setIsScanning(!isScanning)}
                      className="btn btn-outline flex items-center"
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <label className="btn btn-outline cursor-pointer">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Choose QR Code Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => setIsScanning(true)}
                    className="btn btn-outline"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Use Camera
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="border-t p-4">
          <div className="text-sm text-gray-600">
            <p className="font-semibold mb-2">Instructions:</p>
            <ul className="space-y-1 text-xs">
              <li>• Allow camera access when prompted</li>
              <li>• Hold the QR code steady and well-lit</li>
              <li>• Ensure the entire QR code is visible</li>
              <li>• Or upload an image containing a QR code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
