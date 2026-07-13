/* ==========================================================================
   Mitti Fresh - Payment Gateway & Operations REST API Backend
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import JSON database engine
const db = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;// Serve static frontend files from the root directory
app.use(express.static(__dirname));

// Route to serve the main homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Clean URLs routes for static pages
app.get('/collections/staples', (req, res) => {
  res.sendFile(path.join(__dirname, 'shop.html'));
});
app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'checkout.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});
app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});
app.get('/shipping', (req, res) => {
  res.sendFile(path.join(__dirname, 'shipping.html'));
});
app.get('/refund', (req, res) => {
  res.sendFile(path.join(__dirname, 'refund.html'));
});
app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'product.html'));
});
app.get('/app-v2.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'app-v2.js'));
});
app.get('/config-v2.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'config-v2.js'));
});
app.get('/user-account-v2.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'user-account-v2.js'));
});
app.get('/ai-assistant.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'ai-assistant.js'));
});
app.get('/order-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'order-success.html'));
});
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Enable CORS and body parsers
app.use(cors());

// Anti-caching middleware for API routes to guarantee instant sync updates
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Setup Uploads Directory for Screenshots & Assets
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded screenshots statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer Storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'asset-' + uniqueSuffix + path.extname(file.originalname));
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
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Initialize Razorpay SDK using credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Helper: Logging Audit Action
const logAction = (user, action, details) => {
  db.insert('logs', {
    user: user || "System",
    action,
    details,
    ip: "127.0.0.1"
  });
};

/* ==========================================================================
   REST API ROUTES
   ========================================================================== */

// 0. CONFIG ROUTE (Expose Key ID only, never Key Secret)
app.get('/api/config', (req, res) => {
  return res.json({
    razorpay_key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
  });
});

// 1. AUTHENTICATION ROUTE
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.findOne('users', { email, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  if (user.status === 'Blocked') {
    return res.status(403).json({ error: "This employee account is blocked." });
  }

  logAction(user.name, "User Login", `Logged in successfully as ${user.role}`);
  
  // Return simulated token and profile details
  return res.status(200).json({
    status: "success",
    token: `simulated-jwt-token-for-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// 2. PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  return res.json(db.getAll('products'));
});

app.post('/api/products', (req, res) => {
  const productData = req.body;
  if (!productData.name || !productData.sellingPrice) {
    return res.status(400).json({ error: "Product Name and Selling Price are required." });
  }
  
  // Generate SKU if missing
  if (!productData.SKU) {
    productData.SKU = 'MF-' + productData.name.substring(0,3).toUpperCase() + '-' + Math.floor(1000 + Math.random()*9000);
  }
  
  const newProduct = db.insert('products', productData);
  logAction(req.headers['x-user-name'] || "Admin", "Create Product", `Added product SKU: ${newProduct.SKU}`);
  sendStorefrontEvent('catalog-updated', `Added product SKU: ${newProduct.SKU}`);
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  return handleProductUpdate(req, res);
});
app.post('/api/products/:id/update', (req, res) => {
  return handleProductUpdate(req, res);
});

function handleProductUpdate(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.update('products', { id }, updates);
  if (updated.length === 0) {
    return res.status(404).json({ error: "Product not found." });
  }
  logAction(req.headers['x-user-name'] || "Admin", "Update Product", `Modified product ID: ${id}`);
  sendStorefrontEvent('catalog-updated', `Modified product ID: ${id}`);
  return res.json(updated[0]);
}

app.delete('/api/products/:id', (req, res) => {
  return handleProductDelete(req, res);
});
app.post('/api/products/:id/delete', (req, res) => {
  return handleProductDelete(req, res);
});

function handleProductDelete(req, res) {
  const { id } = req.params;
  const deletedCount = db.delete('products', { id });
  if (deletedCount === 0) {
    return res.status(404).json({ error: "Product not found." });
  }
  logAction(req.headers['x-user-name'] || "Admin", "Delete Product", `Removed product ID: ${id}`);
  sendStorefrontEvent('catalog-updated', `Removed product ID: ${id}`);
  return res.json({ status: "success", message: "Product deleted successfully." });
}

// Bulk Import Products (Overwrite / Append)
app.post('/api/products/bulk-import', (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Products parameter must be a JSON array." });
  }
  
  const currentProducts = db.getAll('products');
  products.forEach(p => {
    if (!p.id) p.id = "PROD-" + Math.floor(100000 + Math.random() * 900000);
    const idx = currentProducts.findIndex(cp => cp.id === p.id || (cp.SKU && cp.SKU === p.SKU));
    if (idx !== -1) {
      currentProducts[idx] = { ...currentProducts[idx], ...p, updatedAt: new Date().toISOString() };
    } else {
      p.createdAt = new Date().toISOString();
      p.updatedAt = new Date().toISOString();
      currentProducts.push(p);
    }
  });
  
  db.saveAll('products', currentProducts);
  logAction(req.headers['x-user-name'] || "Admin", "Bulk Import Products", `Imported ${products.length} products`);
  return res.json({ status: "success", count: products.length });
});


// 3. CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  return res.json(db.getAll('categories'));
});

app.post('/api/categories', (req, res) => {
  const category = req.body;
  if (!category.name) {
    return res.status(400).json({ error: "Category Name is required." });
  }
  const newCat = db.insert('categories', category);
  logAction(req.headers['x-user-name'] || "Admin", "Create Category", `Added category: ${newCat.name}`);
  return res.status(201).json(newCat);
});


// 4. ORDER ROUTES
app.get('/api/orders', (req, res) => {
  return res.json(db.getAll('orders'));
});

app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = db.findOne('orders', { orderId });
  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }
  return res.json(order);
});

// Create Razorpay Order
const createOrderController = (req, res) => {
  try {
    const { amount, currency, receipt, items } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid amount. Minimum amount is 100 paise." });
    }
    if (!currency) {
      return res.status(400).json({ error: "Currency is required." });
    }
    if (!receipt) {
      return res.status(400).json({ error: "Receipt is required." });
    }

    // Verify stock before creating Razorpay order
    if (items && Array.isArray(items)) {
      for (let item of items) {
        const prod = db.findOne('products', { name: item.name }) || db.findOne('products', { SKU: item.sku });
        if (!prod) {
          return res.status(400).json({ error: `Product "${item.name}" not found in catalog.` });
        }
        if (prod.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for ${item.name}.` });
        }
      }
    }

    const options = {
      amount: parseInt(amount), // in paise
      currency: currency || "INR",
      receipt: receipt
    };

    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay order creation error:", err);
        const statusCode = err.statusCode || 500;
        return res.status(statusCode).json({ error: err.description || "Razorpay API error" });
      }
      return res.status(200).json(order);
    });
  } catch (error) {
    console.error("Create order controller error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
app.post('/api/create-order', createOrderController);
app.post('/create-order', createOrderController);

// Unified Razorpay Checkout Verification route
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
      if (mitti_order_id) {
        const existing = db.findOne('orders', { orderId: mitti_order_id });
        if (!existing) {
          try {
            checkAndDeductStock(items || []);
          } catch (stockErr) {
            sendAdminNotification('stock-mismatch-warning', `Paid Order placed but stock was insufficient: ${mitti_order_id} (${stockErr.message})`);
          }

          db.insert('orders', {
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
          });
          sendAdminNotification('new-order', `New Razorpay Order Verified: ${mitti_order_id}`, { orderId: mitti_order_id, amount });
        }
      }
      return res.status(200).json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      return res.status(400).json({ status: 'failure', message: 'Signature verification failed.' });
    }
  } catch (error) {
    return res.status(500).json({ error: "Verification server error." });
  }
});

// 5. DIRECT UPI PAYMENT UPLOADER
app.post('/api/submit-upi-payment', (req, res) => {
  upload.single('screenshot')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
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

      if (!orderId || !amount || !customerName || !customerPhone || !customerEmail || !houseNo || !street || !pinCode || !upiTransactionId) {
        return res.status(400).json({ error: "Missing required shipping or payment verification fields." });
      }

      if (upiTransactionId.length !== 12 || isNaN(upiTransactionId)) {
        return res.status(400).json({ error: "UPI Transaction ID must be a valid 12-digit number." });
      }

      let parsedItems = [];
      try {
        parsedItems = JSON.parse(items || '[]');
      } catch (e) {
        parsedItems = [];
      }

      const screenshotPath = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : "";

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

      db.insert('orders', newOrder);

      // Deduct inventory and trigger alerts
      try {
        checkAndDeductStock(parsedItems || []);
      } catch (stockErr) {
        return res.status(400).json({ error: stockErr.message });
      }

      sendAdminNotification('new-order', `New UPI Payment Uploaded: ${orderId} (Pending Audit)`, { orderId, amount });

      return res.status(200).json({ status: "success", orderId, upiScreenshot: screenshotPath });

    } catch (serverError) {
      console.error(serverError);
      return res.status(500).json({ error: "Failed to save payment details on server." });
    }
  });
});

// 6. COD ORDER SUBMITTER
app.post('/api/submit-cod-order', (req, res) => {
  try {
    const { orderId, amount, customer, address, items } = req.body;
    
    if (!orderId || !amount || !customer || !address || !items) {
      return res.status(400).json({ error: "Missing required order submission fields." });
    }

    const newOrder = {
      orderId,
      paymentMethod: "COD",
      razorpayOrderId: "",
      razorpayPaymentId: "COD",
      paymentStatus: "Pending", // Cash collected at door
      orderStatus: "Pending",
      amount: parseFloat(amount),
      date: new Date().toLocaleString(),
      customer: customer || {},
      address: address || {},
      items: items || []
    };

    db.insert('orders', newOrder);

    // Deduct inventory and trigger alerts
    try {
      checkAndDeductStock(items || []);
    } catch (stockErr) {
      return res.status(400).json({ error: stockErr.message });
    }

    sendAdminNotification('new-order', `New COD Order Received: ${orderId}`, { orderId, amount });

    return res.status(200).json({ status: "success", orderId });
  } catch (error) {
    console.error("COD order submission error:", error);
    return res.status(500).json({ error: "Failed to submit COD order." });
  }
});

// Update Order / Payment Status (Admin console)
app.post('/api/update-order-status', (req, res) => {
  const { orderId, orderStatus, paymentStatus, trackingRef, shippingCarrier } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  const updates = {};
  if (orderStatus) updates.orderStatus = orderStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (trackingRef) updates.trackingRef = trackingRef;
  if (shippingCarrier) updates.shippingCarrier = shippingCarrier;

  const updated = db.update('orders', { orderId }, updates);
  if (updated.length === 0) {
    return res.status(404).json({ error: "Order not found." });
  }

  logAction(req.headers['x-user-name'] || "Admin", "Update Order", `Changed status for order ${orderId}`);
  return res.json({ status: "success", order: updated[0] });
});


// 6. COUPON ROUTES
app.get('/api/coupons', (req, res) => {
  return res.json(db.getAll('coupons'));
});

app.post('/api/coupons', (req, res) => {
  const coupon = req.body;
  if (!coupon.code || !coupon.discountVal) {
    return res.status(400).json({ error: "Coupon Code and Discount Value are required." });
  }
  const newCoupon = db.insert('coupons', coupon);
  logAction(req.headers['x-user-name'] || "Admin", "Create Coupon", `Added coupon: ${newCoupon.code}`);
  return res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:id', (req, res) => {
  return handleCouponDelete(req, res);
});
app.post('/api/coupons/:id/delete', (req, res) => {
  return handleCouponDelete(req, res);
});

function handleCouponDelete(req, res) {
  const { id } = req.params;
  db.delete('coupons', { id });
  return res.json({ status: "success", message: "Coupon deleted successfully." });
}


// 7. REVIEW ROUTES
app.get('/api/reviews', (req, res) => {
  return res.json(db.getAll('reviews'));
});

app.post('/api/reviews', (req, res) => {
  const review = req.body;
  if (!review.product_id || !review.rating || !review.comment) {
    return res.status(400).json({ error: "Missing required review parameters." });
  }
  // Default to Pending status for Admin moderation
  review.status = 'Pending';
  const newReview = db.insert('reviews', review);
  return res.status(201).json(newReview);
});

app.post('/api/reviews/:id/moderate', (req, res) => {
  const { id } = req.params;
  const { status, reply } = req.body;
  
  const updates = {};
  if (status) updates.status = status;
  if (reply) updates.reply = reply;

  const updated = db.update('reviews', { id }, updates);
  return res.json({ status: "success", review: updated[0] });
});


// 8. SETTINGS ROUTES
app.get('/api/settings', (req, res) => {
  const settingsList = db.getAll('settings');
  return res.json(settingsList[0] || {});
});

app.post('/api/settings', (req, res) => {
  const updates = req.body;
  const settingsList = db.getAll('settings');
  
  if (settingsList.length === 0) {
    db.insert('settings', updates);
  } else {
    db.update('settings', { businessName: settingsList[0].businessName }, updates);
  }

  logAction(req.headers['x-user-name'] || "Admin", "Update Settings", "Modified shop core configurations");
  sendStorefrontEvent('catalog-updated', 'Settings updated');
  return res.json({ status: "success", settings: db.getAll('settings')[0] });
});


// 9. AUDIT LOGS
app.get('/api/logs', (req, res) => {
  return res.json(db.getAll('logs'));
});


// 10. DYNAMIC BUSINESS ANALYTICS
app.get('/api/analytics', (req, res) => {
  const orders = db.getAll('orders');
  const products = db.getAll('products');
  const categories = db.getAll('categories');

  // Compute metrics
  const todayDateStr = new Date().toLocaleDateString();
  
  const todayOrders = orders.filter(o => o.date && o.date.startsWith(todayDateStr.split('/')[0])); // simple date match
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified' ? o.amount : 0), 0);
  
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified' ? o.amount : 0), 0);
  
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Verification Pending').length;
  const processingCount = orders.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Grinding').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.orderStatus === 'Cancelled').length;
  
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  // Extract unique customers
  const customerMap = {};
  orders.forEach(o => {
    if (o.customer && o.customer.phone) {
      customerMap[o.customer.phone] = (customerMap[o.customer.phone] || 0) + 1;
    }
  });
  
  const totalCustomers = Object.keys(customerMap).length;
  const returningCustomers = Object.values(customerMap).filter(v => v > 1).length;

  return res.json({
    metrics: {
      todayOrders: todayOrders.length,
      todayRevenue,
      totalRevenue,
      pendingOrders: pendingOrdersCount,
      processingOrders: processingCount,
      deliveredOrders: deliveredCount,
      cancelledOrders: cancelledCount,
      totalCustomers,
      returningCustomers,
      totalProducts: products.length,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      totalCategories: categories.length
    },
    lowStockItems: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock })),
    outOfStockItems: outOfStockProducts.map(p => ({ id: p.id, name: p.name }))
  });
});

// SSE (Server-Sent Events) State for real-time notifications
let adminClients = [];
let storefrontClients = [];

const sendAdminNotification = (type, message, data = {}) => {
  const payload = JSON.stringify({ type, message, data, timestamp: new Date().toISOString() });
  adminClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
  db.insert('notifications', { type, message, data, read: false });
};

const sendStorefrontEvent = (type, message, data = {}) => {
  const payload = JSON.stringify({ type, message, data, timestamp: new Date().toISOString() });
  storefrontClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
};

// Stock Validation Helper
const checkAndDeductStock = (items) => {
  const toDeduct = [];
  for (let item of items) {
    // Look up product by name or SKU
    const prod = db.findOne('products', { name: item.name }) || db.findOne('products', { SKU: item.sku });
    if (!prod) {
      throw new Error(`Product "${item.name}" not found in catalog.`);
    }
    if (prod.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${prod.stock}, Requested: ${item.quantity}`);
    }
    toDeduct.push({ prod, quantity: item.quantity });
  }

  // Deduct stock for all items
  toDeduct.forEach(({ prod, quantity }) => {
    const newStock = Math.max(0, prod.stock - quantity);
    db.update('products', { id: prod.id }, { stock: newStock });
    
    // Notifications for stock changes
    if (newStock === 0) {
      sendAdminNotification('out-of-stock', `Product Out of Stock: ${prod.name}`, { id: prod.id, name: prod.name });
    } else if (newStock <= 10) {
      sendAdminNotification('low-stock', `Product Low Stock: ${prod.name} (${newStock} remaining)`, { id: prod.id, name: prod.name, stock: newStock });
    }
  });
};

// SSE Notification Channel Endpoint
app.get('/api/admin/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  adminClients.push(res);

  req.on('close', () => {
    adminClients = adminClients.filter(c => c !== res);
  });
});

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  storefrontClients.push(res);

  req.on('close', () => {
    storefrontClients = storefrontClients.filter(c => c !== res);
  });
});

// Notifications List API
app.get('/api/notifications', (req, res) => {
  return res.json(db.getAll('notifications'));
});

// Mark Notifications as Read
app.post('/api/notifications/read', (req, res) => {
  const notifications = db.getAll('notifications');
  notifications.forEach(n => { n.read = true; });
  db.saveAll('notifications', notifications);
  return res.json({ status: "success" });
});

// Dynamic Homepage configuration API
app.get('/api/homepage', (req, res) => {
  const hpList = db.getAll('homepage');
  if (hpList.length === 0) {
    return res.json({});
  }
  return res.json(hpList[0]);
});

// Admin Homepage Config Update
app.post('/api/homepage', (req, res) => {
  const updates = req.body;
  const hpList = db.getAll('homepage');
  if (hpList.length === 0) {
    db.insert('homepage', updates);
  } else {
    db.update('homepage', { id: hpList[0].id }, updates);
  }
  sendAdminNotification('homepage-update', 'Homepage content has been updated');
  return res.json({ status: "success", homepage: db.getAll('homepage')[0] });
});

// Helper: Authenticate customer email from Authorization Header token
const getCustomerFromToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  if (!token.startsWith('Token-')) return null;
  try {
    const base64Email = token.substring(6);
    const email = Buffer.from(base64Email, 'base64').toString('utf8');
    return db.findOne('customers', { email });
  } catch (e) {
    return null;
  }
};

// Customer Registration
app.post('/api/customers/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "Name, email, password and phone are required." });
    }
    const existing = db.findOne('customers', { email });
    if (existing) {
      return res.status(400).json({ error: "Customer with this email is already registered." });
    }

    const customer = {
      name,
      email,
      password,
      phone,
      rewardPoints: 100, // Gift 100 reward points on sign-up
      addresses: [],
      wishlist: [],
      cart: []
    };

    const saved = db.insert('customers', customer);
    const token = `Token-${Buffer.from(email).toString('base64')}`;
    
    sendAdminNotification('new-customer', `New Customer Registration: ${name}`, { name, email });
    
    return res.status(200).json({ status: "success", customer: saved, token });
  } catch (error) {
    console.error("Customer registration error:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
});

// Customer Login
app.post('/api/customers/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const customer = db.findOne('customers', { email });
    if (!customer || customer.password !== password) {
      return res.status(401).json({ error: "Invalid email or password credentials." });
    }
    const token = `Token-${Buffer.from(email).toString('base64')}`;
    return res.status(200).json({ status: "success", customer, token });
  } catch (error) {
    console.error("Customer login error:", error);
    return res.status(500).json({ error: "Login failed." });
  }
});

// Customer Profile details (including order history!)
app.get('/api/customers/profile', (req, res) => {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });
  
  const allOrders = db.getAll('orders');
  const customerOrders = allOrders.filter(o => o.customer && (o.customer.email === customer.email || o.customer.phone === customer.phone));
  
  return res.json({
    status: "success",
    customer,
    orders: customerOrders
  });
});

// Update Profile info
app.put('/api/customers/profile', (req, res) => {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });

  const { name, phone } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;

  const updated = db.update('customers', { email: customer.email }, updates);
  return res.json({ status: "success", customer: updated[0] });
});

// Add Address to list
app.post('/api/customers/address', (req, res) => {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });

  const { house, street, landmark, pin, city, state } = req.body;
  if (!house || !street || !pin) {
    return res.status(400).json({ error: "House, street and pin code are required." });
  }

  const addresses = customer.addresses || [];
  addresses.push({ house, street, landmark: landmark || "", pin, city: city || "New Delhi", state: state || "Delhi" });

  db.update('customers', { email: customer.email }, { addresses });
  return res.json({ status: "success", addresses });
});

// Delete Address
app.delete('/api/customers/address/:index', (req, res) => {
  return handleAddressDelete(req, res);
});
app.post('/api/customers/address/:index/delete', (req, res) => {
  return handleAddressDelete(req, res);
});

function handleAddressDelete(req, res) {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });

  const index = parseInt(req.params.index);
  const addresses = customer.addresses || [];
  if (isNaN(index) || index < 0 || index >= addresses.length) {
    return res.status(400).json({ error: "Invalid address selection index." });
  }

  addresses.splice(index, 1);
  db.update('customers', { email: customer.email }, { addresses });
  return res.json({ status: "success", addresses });
}

// Synchronize Cart list
app.post('/api/customers/cart', (req, res) => {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });

  const { cart } = req.body;
  db.update('customers', { email: customer.email }, { cart: cart || [] });
  return res.json({ status: "success" });
});

// Synchronize Wishlist
app.post('/api/customers/wishlist', (req, res) => {
  const customer = getCustomerFromToken(req);
  if (!customer) return res.status(401).json({ error: "Unauthorized session." });

  const { wishlist } = req.body;
  db.update('customers', { email: customer.email }, { wishlist: wishlist || [] });
  return res.json({ status: "success" });
});

// Fetch all registered customers list (Admin panel)
app.get('/api/customers', (req, res) => {
  return res.json(db.getAll('customers'));
});

// Start listening and pre-seed tables
app.listen(PORT, () => {
  const tables = ['settings', 'categories', 'products', 'users', 'coupons', 'customers', 'homepage', 'notifications', 'orders', 'logs'];
  tables.forEach(t => {
    try {
      db.getAll(t);
    } catch (e) {
      console.error(`Failed to pre-seed table: ${t}`, e);
    }
  });

  console.log(`=======================================================`);
  console.log(` Mitti Fresh Payment & Operations REST API Backend Running`);
  console.log(` API Endpoint: http://localhost:${PORT}`);
  console.log(`=======================================================`);
});
