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

// Load environment variables dynamically with absolute path to support Phusion Passenger
dotenv.config({ path: path.join(__dirname, '.env.production') });
dotenv.config({ path: path.join(__dirname, '.env') });

// Sanitize InsForge URL to prevent double slashes (e.g. //api/database/records/)
const INSFORGE_URL_CLEANED = (process.env.INSFORGE_URL || '').replace(/\/+$/, '');

function logStartupError(message) {
  const logPath = path.join(__dirname, 'server-error.txt');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`, 'utf8');
  console.error(message);
}

// Register global crash handlers to write logs to disk
process.on('uncaughtException', (err) => {
  logStartupError(`Uncaught Exception: ${err.message}\nStack: ${err.stack}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  logStartupError(`Unhandled Rejection: ${reason}`);
});

// Verify environment variables on startup
const requiredEnv = ['INSFORGE_URL', 'INSFORGE_ANON_KEY', 'INSFORGE_API_KEY', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  logStartupError(`WARNING: Missing required environment variables on startup: ${missingEnv.join(', ')}`);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize InsForge SDK client dynamically (since @insforge/sdk is ESM only)
let insforge;
let insforgePublic;

async function initInsForge() {
  try {
    const sdk = await import('@insforge/sdk');
    insforge = sdk.createAdminClient({
      baseUrl: INSFORGE_URL_CLEANED,
      apiKey: process.env.INSFORGE_API_KEY
    });
    insforgePublic = sdk.createClient({
      baseUrl: INSFORGE_URL_CLEANED,
      anonKey: process.env.INSFORGE_ANON_KEY
    });
    console.log("✓ Connected to InsForge BaaS database successfully.");
  } catch (err) {
    logStartupError(`Failed to initialize InsForge SDK client: ${err.message}\nStack: ${err.stack}`);
    process.exit(1);
  }
}

// Serve static frontend files from the root directory
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
app.get('/admin.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'admin.js'));
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

// Endpoint to upload product images to permanent InsForge Cloud Storage
app.post('/api/upload-image', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Image upload failed." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    try {
      if (insforge && insforge.storage) {
        const fileBuffer = fs.readFileSync(req.file.path);
        const blob = new Blob([fileBuffer], { type: req.file.mimetype || 'image/jpeg' });
        const fileName = `asset-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname)}`;
        
        const { data: storageData, error: storageErr } = await insforge.storage
          .from('product-images')
          .upload(fileName, blob);

        if (!storageErr && storageData && storageData.url) {
          try { fs.unlinkSync(req.file.path); } catch (e) {}
          return res.json({ status: "success", url: storageData.url, key: storageData.key });
        } else if (storageErr) {
          console.warn("InsForge storage upload notice:", storageErr);
        }
      }
    } catch (storageException) {
      console.warn("InsForge storage upload fallback to local static URL:", storageException.message);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    return res.json({ status: "success", url: imageUrl });
  });
});

// Initialize Razorpay SDK using credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
});

// Secure Password Hashing Helpers
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  const [salt, hash] = storedPassword.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Helper: Logging Audit Action
const logAction = async (user, action, details) => {
  try {
    const id = 'LOG-' + Math.floor(100000 + Math.random() * 900000);
    await insforge.database.from('logs').insert([{
      id,
      user: user || "System",
      action,
      details,
      ip: "127.0.0.1"
    }]);
  } catch (err) {
    console.error("[InsForge Error] Logging action failed:", err);
  }
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

// 1. AUTHENTICATION ROUTE (Admin/Employee Login)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { data: user, error } = await insforge.database
      .from('users')
      .select()
      .eq('email', email)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (user.status === 'Blocked') {
      return res.status(401).json({ error: "This employee account is blocked." });
    }

    await logAction(user.name, "User Login", `Logged in successfully as ${user.role}`);
    
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
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await insforge.database
      .from('products')
      .select()
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    // Map database properties to fit frontend expectations (SKU, MRP, etc.)
    const mapped = data.map(p => {
      const imgVal = p.image || 'assets/logo.jpg';
      const galleryVal = Array.isArray(p.gallery) && p.gallery.length > 0 ? p.gallery : [imgVal];
      let rankVal = p.bestseller_rank ?? p.bestSellerRank ?? p.rank;
      if ((rankVal === null || rankVal === undefined || rankVal === "") && p.video && typeof p.video === 'string' && p.video.startsWith('RANK:')) {
        const parsed = parseInt(p.video.replace('RANK:', ''));
        if (!isNaN(parsed) && parsed > 0) rankVal = parsed;
      }
      return {
        ...p,
        SKU: p.sku,
        MRP: p.mrp,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        image: imgVal,
        imageUrl: imgVal,
        mainImage: imgVal,
        thumbnail: imgVal,
        gallery: galleryVal,
        images: galleryVal,
        galleryImages: galleryVal,
        bestSellerRank: rankVal || null,
        bestseller_rank: rankVal || null,
        rank: rankVal || null
      };
    });
    return res.json(mapped);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const productData = req.body;
  if (!productData.name || !productData.sellingPrice) {
    return res.status(400).json({ error: "Product Name and Selling Price are required." });
  }
  
  const id = productData.id || 'PROD-' + Math.floor(100000 + Math.random() * 900000);
  const sku = productData.SKU || 'MF-' + productData.name.substring(0,3).toUpperCase() + '-' + Math.floor(1000 + Math.random()*9000);
  
  const insertRow = {
    id,
    name: productData.name,
    slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: productData.category,
    brand: productData.brand || 'Mitti Fresh',
    shortDescription: productData.shortDescription,
    fullDescription: productData.fullDescription,
    image: productData.image,
    gallery: productData.gallery || [],
    video: (productData.bestSellerRank || productData.bestseller_rank || productData.rank) ? `RANK:${productData.bestSellerRank || productData.bestseller_rank || productData.rank}` : (productData.video || ''),
    weight: productData.weight,
    stock: productData.stock || 0,
    sku,
    mrp: productData.MRP || productData.mrp || 0,
    sellingPrice: productData.sellingPrice,
    status: productData.status || 'active',
    featured: productData.featured || false,
    bestseller_rank: productData.bestSellerRank ?? productData.bestseller_rank ?? productData.rank ?? null
  };

  try {
    let { data, error } = await insforge.database
      .from('products')
      .insert([insertRow])
      .select();

    if (error && (error.message.includes('bestseller_rank') || error.message.includes('column') || error.code === 'PGRST204')) {
      console.warn("Retrying product insert without optional rank column:", error.message);
      delete insertRow.bestseller_rank;
      const retryResult = await insforge.database
        .from('products')
        .insert([insertRow])
        .select();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) return res.status(500).json({ error: error.message });

    const saved = data[0];
    const mapped = { ...saved, SKU: saved.sku, MRP: saved.mrp };
    
    await logAction(req.headers['x-user-name'] || "Admin", "Create Product", `Added product SKU: ${sku}`);
    sendStorefrontEvent('catalog-updated', `Added product SKU: ${sku}`);
    return res.status(201).json(mapped);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  return handleProductUpdate(req, res);
});
app.post('/api/products/:id/update', (req, res) => {
  return handleProductUpdate(req, res);
});

async function handleProductUpdate(req, res) {
  const { id } = req.params;
  const updates = req.body;

  const pgUpdates = {};
  if (updates.name !== undefined) pgUpdates.name = updates.name;
  if (updates.slug !== undefined) pgUpdates.slug = updates.slug;
  if (updates.category !== undefined) pgUpdates.category = updates.category;
  if (updates.brand !== undefined) pgUpdates.brand = updates.brand;
  if (updates.shortDescription !== undefined) pgUpdates.shortDescription = updates.shortDescription;
  if (updates.fullDescription !== undefined) pgUpdates.fullDescription = updates.fullDescription;
  if (updates.image !== undefined) pgUpdates.image = updates.image;
  if (updates.gallery !== undefined) pgUpdates.gallery = updates.gallery;
  if (updates.video !== undefined) pgUpdates.video = updates.video;
  if (updates.weight !== undefined) pgUpdates.weight = updates.weight;
  if (updates.stock !== undefined) pgUpdates.stock = updates.stock;
  if (updates.SKU !== undefined) pgUpdates.sku = updates.SKU;
  if (updates.sku !== undefined) pgUpdates.sku = updates.sku;
  if (updates.MRP !== undefined) pgUpdates.mrp = updates.MRP;
  if (updates.mrp !== undefined) pgUpdates.mrp = updates.mrp;
  if (updates.sellingPrice !== undefined) pgUpdates.sellingPrice = updates.sellingPrice;
  if (updates.status !== undefined) pgUpdates.status = updates.status;
  if (updates.featured !== undefined) pgUpdates.featured = updates.featured;
  if (updates.image !== undefined) pgUpdates.image = updates.image;
  if (updates.imageUrl !== undefined && pgUpdates.image === undefined) pgUpdates.image = updates.imageUrl;
  if (updates.mainImage !== undefined && pgUpdates.image === undefined) pgUpdates.image = updates.mainImage;
  if (updates.thumbnail !== undefined && pgUpdates.image === undefined) pgUpdates.image = updates.thumbnail;

  if (updates.gallery !== undefined) pgUpdates.gallery = updates.gallery;
  if (updates.images !== undefined && pgUpdates.gallery === undefined) pgUpdates.gallery = updates.images;
  const rankNum = updates.bestSellerRank ?? updates.bestseller_rank ?? updates.rank;
  if (rankNum !== undefined) {
    pgUpdates.bestseller_rank = rankNum;
    if (rankNum !== null && rankNum !== "" && !isNaN(rankNum) && Number(rankNum) > 0) {
      pgUpdates.video = `RANK:${Number(rankNum)}`;
    } else if (updates.video === undefined) {
      pgUpdates.video = "";
    }
  }

  try {
    let { data, error } = await insforge.database
      .from('products')
      .update(pgUpdates)
      .eq('id', id)
      .select();

    if (error && (error.message.includes('bestseller_rank') || error.message.includes('column') || error.code === 'PGRST204')) {
      delete pgUpdates.bestseller_rank;
      const retryResult = await insforge.database
        .from('products')
        .update(pgUpdates)
        .eq('id', id)
        .select();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const updated = data[0];
    const imgVal = updated.image || 'assets/logo.jpg';
    const galleryVal = Array.isArray(updated.gallery) && updated.gallery.length > 0 ? updated.gallery : [imgVal];
    let rankVal = updated.bestseller_rank ?? updated.bestSellerRank ?? updated.rank;
    if ((rankVal === null || rankVal === undefined || rankVal === "") && updated.video && typeof updated.video === 'string' && updated.video.startsWith('RANK:')) {
      const parsed = parseInt(updated.video.replace('RANK:', ''));
      if (!isNaN(parsed) && parsed > 0) rankVal = parsed;
    }
    if ((rankVal === null || rankVal === undefined || rankVal === "") && rankNum !== undefined) {
      rankVal = rankNum;
    }

    const mapped = { 
      ...updated, 
      SKU: updated.sku, 
      MRP: updated.mrp,
      image: imgVal,
      imageUrl: imgVal,
      mainImage: imgVal,
      thumbnail: imgVal,
      gallery: galleryVal,
      images: galleryVal,
      galleryImages: galleryVal,
      bestSellerRank: rankVal || null,
      bestseller_rank: rankVal || null,
      rank: rankVal || null
    };

    await logAction(req.headers['x-user-name'] || "Admin", "Update Product", `Modified product ID: ${id}`);
    sendStorefrontEvent('catalog-updated', `Modified product ID: ${id}`);
    return res.json(mapped);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

app.delete('/api/products/:id', (req, res) => {
  return handleProductDelete(req, res);
});
app.post('/api/products/:id/delete', (req, res) => {
  return handleProductDelete(req, res);
});

async function handleProductDelete(req, res) {
  const { id } = req.params;

  try {
    const { data, error } = await insforge.database
      .from('products')
      .delete()
      .eq('id', id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    await logAction(req.headers['x-user-name'] || "Admin", "Delete Product", `Removed product ID: ${id}`);
    sendStorefrontEvent('catalog-updated', `Removed product ID: ${id}`);
    return res.json({ status: "success", message: "Product deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Bulk Import Products (Overwrite / Append)
app.post('/api/products/bulk-import', async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "Products parameter must be a JSON array." });
  }
  
  try {
    for (let p of products) {
      const id = p.id || "PROD-" + Math.floor(100000 + Math.random() * 900000);
      const sku = p.SKU || p.sku || 'MF-' + p.name.substring(0,3).toUpperCase() + '-' + Math.floor(1000 + Math.random()*9000);
      const row = {
        id,
        name: p.name,
        slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: p.category,
        brand: p.brand || 'Mitti Fresh',
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        image: p.image,
        gallery: p.gallery || [],
        video: p.video || '',
        weight: p.weight,
        stock: p.stock || 0,
        sku,
        mrp: p.MRP || p.mrp || 0,
        sellingPrice: p.sellingPrice || 0,
        status: p.status || 'active',
        featured: p.featured || false
      };
      await insforge.database.from('products').upsert([row]);
    }
    
    await logAction(req.headers['x-user-name'] || "Admin", "Bulk Import Products", `Imported ${products.length} products`);
    return res.json({ status: "success", count: products.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. CATEGORY ROUTES
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('categories').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const category = req.body;
  if (!category.name) {
    return res.status(400).json({ error: "Category Name is required." });
  }

  const id = category.id || 'CAT-' + Math.floor(100000 + Math.random() * 900000);
  const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const row = {
    id,
    name: category.name,
    slug,
    featured: category.featured || false
  };

  try {
    const { data, error } = await insforge.database.from('categories').insert([row]).select();
    if (error) return res.status(500).json({ error: error.message });

    await logAction(req.headers['x-user-name'] || "Admin", "Create Category", `Added category: ${category.name}`);
    return res.status(201).json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  return handleCategoryDelete(req, res);
});
app.post('/api/categories/:id/delete', (req, res) => {
  return handleCategoryDelete(req, res);
});

async function handleCategoryDelete(req, res) {
  const { id } = req.params;
  try {
    const { data, error } = await insforge.database
      .from('categories')
      .delete()
      .eq('id', id)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: "Category not found." });
    }

    await logAction(req.headers['x-user-name'] || "Admin", "Delete Category", `Removed category ID: ${id}`);
    return res.json({ status: "success", message: "Category deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// 4. ORDER ROUTES
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await insforge.database
      .from('orders')
      .select()
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    const mapped = data.map(o => ({
      ...o,
      date: o.created_at ? new Date(o.created_at).toLocaleString() : ''
    }));
    return res.json(mapped);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const { data: order, error } = await insforge.database
      .from('orders')
      .select()
      .eq('orderId', orderId)
      .maybeSingle();

    if (error || !order) {
      return res.status(404).json({ error: "Order not found." });
    }

    return res.json({
      ...order,
      date: order.created_at ? new Date(order.created_at).toLocaleString() : ''
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Helper to soft-match storefront cart items to database products
const findProductFromCartItem = async (item) => {
  if (!item) return null;
  
  try {
    if (item.sku) {
      const { data } = await insforge.database
        .from('products')
        .select()
        .eq('sku', item.sku)
        .maybeSingle();
      if (data) return data;
    }
    
    // Try exact name match
    const { data: exact } = await insforge.database
      .from('products')
      .select()
      .eq('name', item.name)
      .maybeSingle();
    if (exact) return exact;

    // Try matching clean name and weight
    const { data: allProducts } = await insforge.database.from('products').select();
    if (!allProducts) return null;

    return allProducts.find(p => {
      const cleanDbName = p.name.replace(/\s*\([^)]*\)\s*$/, '').trim();
      if (cleanDbName === item.name) {
        // Check size / weight
        const dbSize = p.weight || "";
        if (dbSize === item.size) return true;
        // Fallback check slug
        const cleanSize = item.size.toLowerCase().replace(/[\s()]/g, '');
        if (p.slug && p.slug.endsWith(cleanSize)) return true;
      }
      return false;
    });
  } catch (err) {
    console.error("findProductFromCartItem error:", err);
    return null;
  }
};

// Create Razorpay Order
const createOrderController = async (req, res) => {
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
        const prod = await findProductFromCartItem(item);
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

// Unified Razorpay Checkout Verification controller
const verifyPaymentController = async (req, res) => {
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
        const { data: existing } = await insforge.database
          .from('orders')
          .select()
          .eq('orderId', mitti_order_id)
          .maybeSingle();

        if (!existing) {
          try {
            await checkAndDeductStock(items || []);
          } catch (stockErr) {
            await sendAdminNotification('stock-mismatch-warning', `Paid Order placed but stock was insufficient: ${mitti_order_id} (${stockErr.message})`);
          }

          const newOrder = {
            orderId: mitti_order_id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            paymentStatus: "Paid",
            orderStatus: "Preparing Order",
            amount: parseFloat(amount),
            customer: customer || {},
            address: address || {},
            items: items || [],
            paymentMethod: "Razorpay"
          };
          
          await insforge.database.from('orders').insert([newOrder]);
          await sendAdminNotification('new-order', `New Razorpay Order Verified: ${mitti_order_id}`, { orderId: mitti_order_id, amount });
        }
      }
      return res.status(200).json({ status: 'success', message: 'Payment verified successfully.' });
    } else {
      return res.status(400).json({ status: 'failure', message: 'Signature verification failed.' });
    }
  } catch (error) {
    return res.status(500).json({ error: "Verification server error." });
  }
};

app.post('/api/verify-payment', verifyPaymentController);
app.post('/verify-payment', verifyPaymentController);

// 5. DIRECT UPI PAYMENT UPLOADER
app.post('/api/submit-upi-payment', (req, res) => {
  upload.single('screenshot')(req, res, async (err) => {
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

      await insforge.database.from('orders').insert([newOrder]);

      // Deduct inventory and trigger alerts
      try {
        await checkAndDeductStock(parsedItems || []);
      } catch (stockErr) {
        return res.status(400).json({ error: stockErr.message });
      }

      await sendAdminNotification('new-order', `New UPI Payment Uploaded: ${orderId} (Pending Audit)`, { orderId, amount });

      return res.status(200).json({ status: "success", orderId, upiScreenshot: screenshotPath });

    } catch (serverError) {
      console.error(serverError);
      return res.status(500).json({ error: "Failed to save payment details on server." });
    }
  });
});

// 6. COD ORDER SUBMITTER
app.post('/api/submit-cod-order', async (req, res) => {
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
      customer: customer || {},
      address: address || {},
      items: items || []
    };

    await insforge.database.from('orders').insert([newOrder]);

    // Deduct inventory and trigger alerts
    try {
      await checkAndDeductStock(items || []);
    } catch (stockErr) {
      return res.status(400).json({ error: stockErr.message });
    }

    await sendAdminNotification('new-order', `New COD Order Received: ${orderId}`, { orderId, amount });

    return res.status(200).json({ status: "success", orderId });
  } catch (error) {
    console.error("COD order submission error:", error);
    return res.status(500).json({ error: "Failed to submit COD order." });
  }
});

// Update Order / Payment Status (Admin console)
app.post('/api/update-order-status', async (req, res) => {
  const { orderId, orderStatus, paymentStatus, trackingRef, shippingCarrier } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required." });
  }

  const updates = {};
  if (orderStatus) updates.orderStatus = orderStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (trackingRef) updates.trackingId = trackingRef;
  if (shippingCarrier) updates.deliveryPartner = shippingCarrier;

  try {
    const { data, error } = await insforge.database
      .from('orders')
      .update(updates)
      .eq('orderId', orderId)
      .select();

    if (error || !data || data.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    await logAction(req.headers['x-user-name'] || "Admin", "Update Order", `Changed status for order ${orderId}`);
    return res.json({ status: "success", order: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 6. COUPON ROUTES
app.get('/api/coupons', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('coupons').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  const coupon = req.body;
  if (!coupon.code || !coupon.discountVal) {
    return res.status(400).json({ error: "Coupon Code and Discount Value are required." });
  }
  
  const id = coupon.id || 'CPN-' + Math.floor(100000 + Math.random() * 900000);
  const row = {
    id,
    code: coupon.code,
    type: coupon.type,
    discountVal: coupon.discountVal,
    minOrder: coupon.minOrder || 0,
    maxDiscount: coupon.maxDiscount,
    usageLimit: coupon.usageLimit || 0,
    expiry: coupon.expiry
  };

  try {
    const { data, error } = await insforge.database.from('coupons').insert([row]).select();
    if (error) return res.status(500).json({ error: error.message });

    await logAction(req.headers['x-user-name'] || "Admin", "Create Coupon", `Added coupon: ${coupon.code}`);
    return res.status(201).json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/coupons/:id', (req, res) => {
  return handleCouponDelete(req, res);
});
app.post('/api/coupons/:id/delete', (req, res) => {
  return handleCouponDelete(req, res);
});

async function handleCouponDelete(req, res) {
  const { id } = req.params;
  try {
    await insforge.database.from('coupons').delete().eq('id', id);
    return res.json({ status: "success", message: "Coupon deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}


// 7. REVIEW ROUTES
app.get('/api/reviews', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('reviews').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  const review = req.body;
  if (!review.product_id || !review.rating || !review.comment) {
    return res.status(400).json({ error: "Missing required review parameters." });
  }
  
  const id = 'REV-' + Math.floor(100000 + Math.random() * 900000);
  const row = {
    id,
    productId: review.product_id,
    customerId: review.customer_id || null,
    customerName: review.customer_name || 'Anonymous',
    rating: review.rating,
    comment: review.comment,
    status: 'Pending',
    adminReply: null
  };

  try {
    const { data, error } = await insforge.database.from('reviews').insert([row]).select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews/:id/moderate', async (req, res) => {
  const { id } = req.params;
  const { status, reply } = req.body;
  
  const updates = {};
  if (status) updates.status = status;
  if (reply) updates.adminReply = reply;

  try {
    const { data, error } = await insforge.database
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success", review: data ? data[0] : null });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 8. SETTINGS ROUTES
app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('settings').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data[0] || {});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  const updates = req.body;
  
  try {
    const { data: settingsList, error: fetchErr } = await insforge.database.from('settings').select();
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });
    
    if (!settingsList || settingsList.length === 0) {
      updates.id = 'settings_default';
      const { error: insertErr } = await insforge.database.from('settings').insert([updates]);
      if (insertErr) return res.status(500).json({ error: insertErr.message });
    } else {
      const { error: updateErr } = await insforge.database.from('settings').update(updates).eq('id', settingsList[0].id);
      if (updateErr) return res.status(500).json({ error: updateErr.message });
    }

    await logAction(req.headers['x-user-name'] || "Admin", "Update Settings", "Modified shop core configurations");
    sendStorefrontEvent('catalog-updated', 'Settings updated');
    
    const { data: freshSettings } = await insforge.database.from('settings').select();
    return res.json({ status: "success", settings: freshSettings ? freshSettings[0] : {} });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



// 9. AUDIT LOGS
app.get('/api/logs', async (req, res) => {
  try {
    const { data, error } = await insforge.database
      .from('logs')
      .select()
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// 10. DYNAMIC BUSINESS ANALYTICS
app.get('/api/analytics', async (req, res) => {
  try {
    const { data: orders } = await insforge.database.from('orders').select();
    const { data: products } = await insforge.database.from('products').select();
    const { data: categories } = await insforge.database.from('categories').select();

    const ordersList = orders || [];
    const productsList = products || [];
    const categoriesList = categories || [];

    // Compute metrics
    const todayDateStr = new Date().toLocaleDateString();
    
    const todayOrders = ordersList.filter(o => o.created_at && new Date(o.created_at).toLocaleDateString() === todayDateStr);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified' ? parseFloat(o.amount) : 0), 0);
    const totalRevenue = ordersList.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' || o.paymentStatus === 'Verified' ? parseFloat(o.amount) : 0), 0);
    
    const pendingOrdersCount = ordersList.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Payment Verification Pending').length;
    const processingCount = ordersList.filter(o => o.orderStatus === 'Preparing' || o.orderStatus === 'Grinding' || o.orderStatus === 'Preparing Order').length;
    const deliveredCount = ordersList.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledCount = ordersList.filter(o => o.orderStatus === 'Cancelled').length;
    
    const lowStockProducts = productsList.filter(p => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = productsList.filter(p => p.stock === 0);

    // Extract unique customers
    const customerMap = {};
    ordersList.forEach(o => {
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
        totalProducts: productsList.length,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        totalCategories: categoriesList.length
      },
      lowStockItems: lowStockProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock })),
      outOfStockItems: outOfStockProducts.map(p => ({ id: p.id, name: p.name }))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// SSE (Server-Sent Events) State for real-time notifications
let adminClients = [];
let storefrontClients = [];

const sendAdminNotification = async (type, message, data = {}) => {
  const payload = JSON.stringify({ type, message, data, timestamp: new Date().toISOString() });
  adminClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
  
  try {
    const id = 'NOTIF-' + Math.floor(100000 + Math.random() * 900000);
    await insforge.database.from('notifications').insert([{
      id,
      type,
      message,
      data,
      read: false
    }]);
  } catch (err) {
    console.error("[InsForge Error] Creating notification failed:", err);
  }
};

const sendStorefrontEvent = (type, message, data = {}) => {
  const payload = JSON.stringify({ type, message, data, timestamp: new Date().toISOString() });
  storefrontClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
};

// Stock Validation Helper
const checkAndDeductStock = async (items) => {
  const toDeduct = [];
  for (let item of items) {
    const prod = await findProductFromCartItem(item);
    if (!prod) {
      throw new Error(`Product "${item.name}" not found in catalog.`);
    }
    if (prod.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${item.name}. Available: ${prod.stock}, Requested: ${item.quantity}`);
    }
    toDeduct.push({ prod, quantity: item.quantity });
  }

  // Deduct stock for all items
  for (let { prod, quantity } of toDeduct) {
    const newStock = Math.max(0, prod.stock - quantity);
    await insforge.database.from('products').update({ stock: newStock }).eq('id', prod.id);
    
    // Notifications for stock changes
    if (newStock === 0) {
      await sendAdminNotification('out-of-stock', `Product Out of Stock: ${prod.name}`, { id: prod.id, name: prod.name });
    } else if (newStock <= 10) {
      await sendAdminNotification('low-stock', `Product Low Stock: ${prod.name} (${newStock} remaining)`, { id: prod.id, name: prod.name, stock: newStock });
    }
  }
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
app.get('/api/notifications', async (req, res) => {
  try {
    const { data, error } = await insforge.database
      .from('notifications')
      .select()
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Mark Notifications as Read
app.post('/api/notifications/read', async (req, res) => {
  try {
    const { error } = await insforge.database
      .from('notifications')
      .update({ read: true })
      .neq('id', 'placeholder_nonexistent_id'); // target all notifications

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Dynamic Homepage configuration API
app.get('/api/homepage', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('homepage').select();
    if (error || !data || data.length === 0) {
      return res.json({});
    }
    return res.json(data[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Admin Homepage Config Update
app.post('/api/homepage', async (req, res) => {
  const updates = req.body;
  try {
    const { data: hpList } = await insforge.database.from('homepage').select();
    if (!hpList || hpList.length === 0) {
      updates.id = 'HP-001';
      await insforge.database.from('homepage').insert([updates]);
    } else {
      await insforge.database.from('homepage').update(updates).eq('id', hpList[0].id);
    }
    await sendAdminNotification('homepage-update', 'Homepage content has been updated');
    
    const { data: freshHp } = await insforge.database.from('homepage').select();
    return res.json({ status: "success", homepage: freshHp ? freshHp[0] : {} });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Helper: Authenticate customer email from Authorization Header token
const getCustomerFromToken = async (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  try {
    if (token.startsWith('Token-')) {
      const base64Email = token.substring(6);
      const email = Buffer.from(base64Email, 'base64').toString('utf8');
      
      const { data } = await insforge.database
        .from('customers')
        .select()
        .eq('email', email)
        .maybeSingle();

      return data;
    }

    const { createClient } = await import('@insforge/sdk');
    const userClient = createClient({
      baseUrl: INSFORGE_URL_CLEANED,
      anonKey: process.env.INSFORGE_ANON_KEY,
      accessToken: token,
      isServerMode: true
    });

    const { data, error } = await userClient.auth.getCurrentUser();
    if (error || !data || !data.user) return null;

    const { data: customerProfile } = await insforge.database
      .from('customers')
      .select()
      .eq('email', data.user.email)
      .maybeSingle();

    return customerProfile;
  } catch (e) {
    return null;
  }
};

// Customer Registration
app.post('/api/customers/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "Name, email, password and phone are required." });
    }
    
    // 1. Sign up user using InsForge Auth
    const { data: authData, error: authError } = await insforgePublic.auth.signUp({
      email,
      password,
      name
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2. Insert customer profile into customers table
    const id = authData.user.id; // use the UUID from InsForge Auth
    const customer = {
      id,
      name,
      email,
      password: 'INSFORGE_AUTH', // Managed by InsForge Auth
      phone,
      rewardPoints: 100, // Gift 100 reward points on sign-up
      addresses: [],
      wishlist: [],
      cart: []
    };

    const { data, error } = await insforge.database.from('customers').insert([customer]).select();
    if (error) return res.status(500).json({ error: error.message });

    await sendAdminNotification('new-customer', `New Customer Registration: ${name}`, { name, email });
    
    return res.status(200).json({ status: "success", customer: data[0], token: authData.accessToken });
  } catch (error) {
    console.error("Customer registration error:", error);
    return res.status(500).json({ error: "Registration failed." });
  }
});

// Customer Login
app.post('/api/customers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // 1. Sign in via InsForge Auth
    const { data: authData, error: authError } = await insforgePublic.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({ error: authError.message || "Invalid email or password credentials." });
    }

    // 2. Look up customer profile
    const { data: customer, error: dbError } = await insforge.database
      .from('customers')
      .select()
      .eq('email', email)
      .maybeSingle();

    if (dbError || !customer) {
      return res.status(404).json({ error: "Customer profile not found." });
    }

    return res.status(200).json({ status: "success", customer, token: authData.accessToken });
  } catch (error) {
    console.error("Customer login error:", error);
    return res.status(500).json({ error: "Login failed." });
  }
});

// Customer Profile details (including order history!)
app.get('/api/customers/profile', async (req, res) => {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });
    
    const { data: allOrders } = await insforge.database.from('orders').select();
    const ordersList = allOrders || [];
    const customerOrders = ordersList.filter(o => o.customer && (o.customer.email === customer.email || o.customer.phone === customer.phone));
    
    return res.json({
      status: "success",
      customer,
      orders: customerOrders.map(o => ({
        ...o,
        date: o.created_at ? new Date(o.created_at).toLocaleString() : ''
      }))
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update Profile info
app.put('/api/customers/profile', async (req, res) => {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });

    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const { data, error } = await insforge.database
      .from('customers')
      .update(updates)
      .eq('email', customer.email)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success", customer: data[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Add Address to list
app.post('/api/customers/address', async (req, res) => {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });

    const { house, street, landmark, pin, city, state } = req.body;
    if (!house || !street || !pin) {
      return res.status(400).json({ error: "House, street and pin code are required." });
    }

    const addresses = customer.addresses || [];
    addresses.push({ house, street, landmark: landmark || "", pin, city: city || "New Delhi", state: state || "Delhi" });

    const { data, error } = await insforge.database
      .from('customers')
      .update({ addresses })
      .eq('email', customer.email)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success", addresses: data[0].addresses });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete Address
app.delete('/api/customers/address/:index', (req, res) => {
  return handleAddressDelete(req, res);
});
app.post('/api/customers/address/:index/delete', (req, res) => {
  return handleAddressDelete(req, res);
});

async function handleAddressDelete(req, res) {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });

    const index = parseInt(req.params.index);
    const addresses = customer.addresses || [];
    if (isNaN(index) || index < 0 || index >= addresses.length) {
      return res.status(400).json({ error: "Invalid address selection index." });
    }

    addresses.splice(index, 1);
    const { data, error } = await insforge.database
      .from('customers')
      .update({ addresses })
      .eq('email', customer.email)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success", addresses: data[0].addresses });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// Synchronize Cart list
app.post('/api/customers/cart', async (req, res) => {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });

    const { cart } = req.body;
    const { error } = await insforge.database
      .from('customers')
      .update({ cart: cart || [] })
      .eq('email', customer.email);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Synchronize Wishlist
app.post('/api/customers/wishlist', async (req, res) => {
  try {
    const customer = await getCustomerFromToken(req);
    if (!customer) return res.status(401).json({ error: "Unauthorized session." });

    const { wishlist } = req.body;
    const { error } = await insforge.database
      .from('customers')
      .update({ wishlist: wishlist || [] })
      .eq('email', customer.email);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ status: "success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch all registered customers list (Admin panel)
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('customers').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Fetch all registered employees list (Admin panel)
app.get('/api/admin/employees', async (req, res) => {
  try {
    const { data, error } = await insforge.database.from('users').select();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Initialize database connection dynamically, then start listening
initInsForge().then(() => {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` Mitti Fresh Payment & Operations REST API Backend Running`);
    console.log(` Connected to InsForge cloud Postgres database.`);
    console.log(` API Endpoint: http://localhost:${PORT}`);
    console.log(`=======================================================`);
  });
});
