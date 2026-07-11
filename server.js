/* ==========================================================================
   Mitti Fresh - Payment Gateway Server
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS so your static frontend (e.g. GitHub Pages) can securely access these endpoints
app.use(cors());
app.use(express.json());

// Initialize Razorpay SDK using credentials stored securely in environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Endpoint: Generate Secure Razorpay Order ID
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount parameter is required." });
    }

    const options = {
      amount: Math.round(amount), // must be an integer represented in paisa (e.g. ₹100 = 10000 paisa)
      currency: currency || "INR",
      receipt: receipt || `receipt_${Math.floor(100000 + Math.random() * 900000)}`
    };

    console.log(`[Razorpay Server] Creating Order for receipt: ${options.receipt}, amount: ${options.amount} paisa`);
    const order = await razorpay.orders.create(options);
    
    // Return Razorpay Order instance object (including order_id) to the client
    return res.status(200).json(order);
  } catch (error) {
    console.error("[Razorpay Server Error] Order creation failed:", error);
    return res.status(500).json({ error: error.message || "Failed to initialize order." });
  }
});

// Endpoint: Verify Razorpay Signature Authenticity
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required signature verification fields." });
    }

    // Hash algorithm defined by Razorpay documentation: SHA256(order_id + '|' + payment_id, secret)
    const payload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(payload.toString())
      .digest('hex');

    const signatureAuthentic = expectedSignature === razorpay_signature;

    if (signatureAuthentic) {
      console.log(`[Razorpay Server] Signature Verified for Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`);
      return res.status(200).json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      console.warn(`[Razorpay Server] Signature Verification FAILED for Order: ${razorpay_order_id}`);
      return res.status(400).json({ status: 'failure', message: 'Signature verification failed.' });
    }
  } catch (error) {
    console.error("[Razorpay Server Error] Verification failed:", error);
    return res.status(500).json({ error: "Verification server error." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Mitti Fresh Payment Gateway Server Running`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(` Securely connected to Razorpay Key: ${process.env.RAZORPAY_KEY_ID || 'PENDING CONFIGURATION'}`);
  console.log(`=======================================================`);
});
