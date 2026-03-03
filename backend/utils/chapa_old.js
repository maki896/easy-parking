const axios = require('axios');

class ChapaPayment {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.baseUrl = 'https://api.chapa.co/v1';
    this.webhookSecret = process.env.CHAPA_WEBHOOK_SECRET;
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
          description: 'Parking fee payment'
        }
      };

      console.log('Chapa payment request:', payload);

      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, payload, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Chapa payment response:', response.data);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Chapa payment initialization error:', error.response?.data || error.message);
      
      // Return more detailed error information
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data || {};
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails
      };
    }
  }

  // Verify a transaction
  async verifyTransaction(tx_ref) {
    try {
      console.log('Verifying transaction:', tx_ref);

      const response = await axios.get(`${this.baseUrl}/transaction/verify/${tx_ref}`, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('Chapa verification response:', response.data);

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Chapa transaction verification error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message;
      const errorDetails = error.response?.data || {};
      
      return {
        success: false,
        error: errorMessage,
        details: errorDetails
      };
    }
  }

  // Generate transaction reference
  generateTxRef() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `EPK-${timestamp}-${random}`; // EPK = Easy Park
  }

  // Validate webhook signature
  validateWebhookSignature(payload, signature) {
    // For now, simple validation - can be enhanced based on Chapa's requirements
    if (!signature || !this.webhookSecret) {
      return false;
    }
    
    // Basic signature validation
    return signature === this.webhookSecret;
  }

  // Format amount for Chapa (ensure 2 decimal places)
  formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
  }

  // Get public key for frontend
  getPublicKey() {
    return this.secretKey; // In test mode, secret and public keys are the same
  }
}

module.exports = new ChapaPayment();
