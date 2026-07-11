/* ==========================================================================
   Mitti Fresh - Payment Gateway & UPI Verification Server
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Setup Uploads Directory for Screenshots
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded screenshots as static assets
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer Storage for screenshot uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'upi-screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, etc.) are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Configure local JSON file-based database for persistence
const ORDERS_FILE = path.join(__dirname, 'orders.json');

const readOrdersFromFile = () => {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error("[Database Error] Reading orders.json failed:", err);
    return [];
  }
};

const writeOrdersToFile = (orders) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error("[Database Error] Writing orders.json failed:", err);
  }
};

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
      amount: Math.round(amount),
      currency: currency || "INR",
      receipt: receipt || `receipt_${Math.floor(100000 + Math.random() * 900000)}`
    };

    console.log(`[Razorpay Server] Creating Order for receipt: ${options.receipt}, amount: ${options.amount} paisa`);
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error("[Razorpay Server Error] Order creation failed:", error);
    return res.status(500).json({ error: error.message || "Failed to initialize order." });
  }
});

// Endpoint: Verify Razorpay Signature Authenticity
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mitti_order_id, amount, customer, address, items } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required signature verification fields." });
    }

    const payload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(payload.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      console.log(`[Razorpay Server] Signature Verified for Order: ${razorpay_order_id}, Payment: ${razorpay_payment_id}`);
      
      // Save order record to server database
      if (mitti_order_id) {
        const orders = readOrdersFromFile();
        const exists = orders.some(o => o.orderId === mitti_order_id);
        if (!exists) {
          const newOrder = {
            orderId: mitti_order_id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            paymentStatus: "Paid",
            orderStatus: "Preparing Order",
            amount: parseFloat(amount),
            date: new Date().toLocaleString(),
            customer: customer || {},
            address: address || {},
            items: items || [],
            paymentMethod: "Razorpay"
          };
          orders.unshift(newOrder);
          writeOrdersToFile(orders);
        }
      }

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

// Endpoint: Submit Direct UPI Payment details (with multipart/form-data upload)
app.post('/api/submit-upi-payment', (req, res) => {
  upload.single('screenshot')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("[Multer Upload Error]:", err);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      console.error("[Upload Error]:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        orderId,
        amount,
        customerName,
        customerPhone,
        customerEmail,
        houseNo,
        street,
        landmark,
        pinCode,
        upiTransactionId,
        upiNotes,
        items
      } = req.body;

      // Validate required inputs
      if (!orderId || !amount || !customerName || !customerPhone || !customerEmail || !houseNo || !street || !pinCode || !upiTransactionId) {
        return res.status(400).json({ error: "Missing required shipping or payment verification fields." });
      }

      // Check UPI transaction reference length (Must be 12 digits)
      if (upiTransactionId.length !== 12 || isNaN(upiTransactionId)) {
        return res.status(400).json({ error: "UPI Transaction ID must be a valid 12-digit number." });
      }

      let parsedItems = [];
      try {
        parsedItems = JSON.parse(items || '[]');
      } catch (e) {
        parsedItems = [];
      }

      // Format the relative image asset path if uploaded
      const screenshotPath = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : "";

      const orders = readOrdersFromFile();
      
      const newOrder = {
        orderId,
        paymentMethod: "UPI",
        upiTransactionId,
        upiScreenshot: screenshotPath,
        upiNotes: upiNotes || "",
        paymentStatus: "Pending Verification",
        orderStatus: "Payment Verification Pending",
        amount: parseFloat(amount),
        date: new Date().toLocaleString(),
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail
        },
        address: {
          house: houseNo,
          street: street,
          landmark: landmark || "",
          pin: pinCode,
          city: "New Delhi",
          state: "Delhi"
        },
        items: parsedItems
      };

      orders.unshift(newOrder);
      writeOrdersToFile(orders);

      console.log(`[UPI Backend] Order ${orderId} created successfully with Transaction ID: ${upiTransactionId}`);
      return res.status(200).json({ status: "success", orderId, message: "UPI Payment details saved successfully." });

    } catch (serverError) {
      console.error("[UPI Payment Submit Error]:", serverError);
      return res.status(500).json({ error: "Failed to save payment details on server." });
    }
  });
});

// Endpoint: Fetch All Orders
app.get('/api/orders', (req, res) => {
  try {
    const orders = readOrdersFromFile();
    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read orders database." });
  }
});

// Endpoint: Fetch Specific Order
app.get('/api/orders/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = readOrdersFromFile();
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }
    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch order details." });
  }
});

// Endpoint: Update Order/Payment status manually (Admin console)
app.post('/api/update-order-status', (req, res) => {
  try {
    const { orderId, orderStatus, paymentStatus } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID parameter is required." });
    }

    const orders = readOrdersFromFile();
    const orderIdx = orders.findIndex(o => o.orderId === orderId);

    if (orderIdx === -1) {
      return res.status(404).json({ error: "Order not found." });
    }

    if (orderStatus) orders[orderIdx].orderStatus = orderStatus;
    if (paymentStatus) orders[orderIdx].paymentStatus = paymentStatus;

    writeOrdersToFile(orders);
    console.log(`[Admin Update] Order ${orderId} status updated: orderStatus=${orderStatus}, paymentStatus=${paymentStatus}`);
    
    return res.status(200).json({ status: "success", message: "Order status updated successfully.", order: orders[orderIdx] });
  } catch (err) {
    console.error("[Admin Update Error]:", err);
    return res.status(500).json({ error: "Failed to update order status." });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Mitti Fresh Payment & UPI Verification Server Running`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
