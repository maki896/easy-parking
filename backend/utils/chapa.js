const axios = require('axios');
const crypto = require('crypto');

class ChapaPayment {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.baseUrl = 'https://api.chapa.co/v1';
    this.webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
  }

  // Generate unique transaction reference
  generateTxRef() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `EP${timestamp}${random}`.toUpperCase();
  }

  // Format amount for Chapa (in cents)
  formatAmount(amount) {
    return Math.round(amount * 100);
  }

  // Initialize a payment transaction
  async initializePayment(paymentData) {
    try {
      const {
        amount,
        email,
        firstName,
        lastName,
        tx_ref,
        callback_url,
        return_url,
        customization
      } = paymentData;

      const payload = {
        amount: amount.toString(),
        currency: 'ETB',
        email: email || 'customer@easyparking.com',
        first_name: firstName || 'Easy Park',
        last_name: lastName || 'Customer',
        tx_ref: tx_ref,
        callback_url: callback_url || `${process.env.FRONTEND_URL}/payment/callback`,
        return_url: return_url || `${process.env.FRONTEND_URL}/payment/return`,
        customization: customization || {
          title: 'Easy Park Payment',
          description: 'Parking fee payment',
          logo: 'https://your-logo-url.com/logo.png'
        },
        meta: {
          vehicle_id: paymentData.vehicleId,
          parking_fee: paymentData.originalAmount,
          parking_duration: paymentData.duration
        }
      };

      console.log('🔵 Chapa Payment Request:', payload);

      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, payload, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('🟢 Chapa Payment Response:', response.data);

      if (response.data.status === 'success') {
        return {
          success: true,
          data: response.data.data,
          checkout_url: response.data.data.checkout_url,
          tx_ref: response.data.data.tx_ref
        };
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }

    } catch (error) {
      console.error('🔴 Chapa Payment Error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Payment initialization failed');
      }
      
      throw new Error('Payment service unavailable. Please try again.');
    }
  }

  // Verify payment status
  async verifyPayment(tx_ref) {
    try {
      console.log('🔵 Verifying payment for tx_ref:', tx_ref);

      const response = await axios.get(`${this.baseUrl}/transaction/verify/${tx_ref}`, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Accept': 'application/json'
        },
        timeout: 30000
      });

      console.log('🟢 Chapa Verification Response:', response.data);

      if (response.data.status === 'success') {
        const transaction = response.data.data;
        
        return {
          success: true,
          status: transaction.status,
          amount: transaction.amount,
          currency: transaction.currency,
          tx_ref: transaction.tx_ref,
          payment_method: transaction.payment_method,
          created_at: transaction.created_at,
          verified_at: new Date().toISOString(),
          chapa_data: transaction
        };
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }

    } catch (error) {
      console.error('🔴 Chapa Verification Error:', error.response?.data || error.message);
      
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Payment verification failed');
      }
      
      throw new Error('Payment verification service unavailable');
    }
  }

  // Generate QR code for payment
  generateQRCode(checkout_url) {
    return checkout_url;
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret) {
      console.warn('⚠️ Webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return signature === expectedSignature;
  }

  // Process webhook data
  processWebhook(webhookData) {
    try {
      const { event, data } = webhookData;
      
      console.log('🔵 Processing webhook:', { event, data });

      switch (event) {
        case 'transaction.successful':
          return {
            status: 'completed',
            tx_ref: data.tx_ref,
            amount: data.amount,
            payment_method: data.payment_method,
            verified_at: new Date().toISOString()
          };

        case 'transaction.failed':
          return {
            status: 'failed',
            tx_ref: data.tx_ref,
            error: data.error || 'Transaction failed',
            verified_at: new Date().toISOString()
          };

        case 'transaction.pending':
          return {
            status: 'pending',
            tx_ref: data.tx_ref,
            verified_at: new Date().toISOString()
          };

        default:
          console.log('ℹ️ Unhandled webhook event:', event);
          return null;
      }
    } catch (error) {
      console.error('🔴 Webhook processing error:', error);
      return null;
    }
  }
}

module.exports = new ChapaPayment();
