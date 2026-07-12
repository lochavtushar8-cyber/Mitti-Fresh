/* ==========================================================================
   Mitti Fresh - JSON Database Engine (db.js)
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper: Get file path for a table
const getTablePath = (table) => path.join(DB_DIR, `${table}.json`);

// Helper: Read a table
const readTable = (table) => {
  const filePath = getTablePath(table);
  try {
    if (!fs.existsSync(filePath)) {
      // Seed default tables if empty
      if (table === 'products') return seedDefaultProducts();
      if (table === 'categories') return seedDefaultCategories();
      if (table === 'users') return seedDefaultUsers();
      if (table === 'settings') return seedDefaultSettings();
      if (table === 'coupons') return seedDefaultCoupons();
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`[DB Error] Reading table ${table} failed:`, err);
    return [];
  }
};

// Helper: Write a table
const writeTable = (table, data) => {
  const filePath = getTablePath(table);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`[DB Error] Writing table ${table} failed:`, err);
    return false;
  }
};

// Database APIs
const db = {
  find: (table, query = {}) => {
    const data = readTable(table);
    return data.filter(row => {
      for (let key in query) {
        if (row[key] !== query[key]) return false;
      }
      return true;
    });
  },

  findOne: (table, query = {}) => {
    const data = readTable(table);
    return data.find(row => {
      for (let key in query) {
        if (row[key] !== query[key]) return false;
      }
      return true;
    });
  },

  insert: (table, row) => {
    const data = readTable(table);
    // Add unique ID if not present
    if (!row.id) {
      row.id = table.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);
    }
    row.createdAt = new Date().toISOString();
    row.updatedAt = new Date().toISOString();
    data.unshift(row); // Keep newest at the top
    writeTable(table, data);
    return row;
  },

  update: (table, query, updates) => {
    const data = readTable(table);
    let updatedCount = 0;
    const updatedRows = [];

    const newData = data.map(row => {
      let matches = true;
      for (let key in query) {
        if (row[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        const updatedRow = { ...row, ...updates, updatedAt: new Date().toISOString() };
        updatedCount++;
        updatedRows.push(updatedRow);
        return updatedRow;
      }
      return row;
    });

    if (updatedCount > 0) {
      writeTable(table, newData);
    }
    return updatedRows;
  },

  delete: (table, query) => {
    const data = readTable(table);
    let deletedCount = 0;

    const newData = data.filter(row => {
      let matches = true;
      for (let key in query) {
        if (row[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        deletedCount++;
        return false;
      }
      return true;
    });

    if (deletedCount > 0) {
      writeTable(table, newData);
    }
    return deletedCount;
  },

  getAll: (table) => readTable(table),
  saveAll: (table, data) => writeTable(table, data)
};

// Seeders
function seedDefaultProducts() {
  const defaultProducts = [
    {
      id: "PROD-WHEAT-001",
      name: "MP Wheat Atta (Stone Ground)",
      slug: "mp-wheat-atta",
      category: "Wheat Atta",
      brand: "Mitti Fresh",
      shortDescription: "Premium stone-ground flour milled from selected Madhya Pradesh wheat grains.",
      fullDescription: "Our wheat flour is milled using traditional stone grinding (atta chakki) at cold temperatures, preserving the wheat bran, vitamins, and natural high dietary fibers necessary for digestability.",
      image: "assets/wheat_atta.jpg",
      gallery: ["assets/wheat_atta.jpg"],
      video: "",
      weight: "5kg",
      stock: 120,
      SKU: "MF-MPW-5KG",
      barcode: "8901234567890",
      MRP: 380,
      sellingPrice: 350,
      offerPrice: 350,
      discount: 8,
      GST: 0,
      HSNCode: "1101",
      tags: ["Wheat", "Atta", "Fiber", "Stone Ground"],
      nutrition: "Energy: 364 kcal, Protein: 12g, Carbohydrates: 73g, Fat: 2g, Fiber: 11g",
      ingredients: "100% Madhya Pradesh Wheat Grains",
      shelfLife: "60 Days",
      storageInstructions: "Store in a dry, cool container, away from direct sunlight.",
      featured: true,
      bestSeller: true,
      newArrival: false,
      recommended: true,
      seoTitle: "Buy Premium MP Wheat Atta Online | Mitti Fresh",
      metaDescription: "Purchase stone ground MP Wheat flour freshly milled daily. Free delivery in Dwarka."
    },
    {
      id: "PROD-MULTI-002",
      name: "Multigrain Atta (Diabetes & Health Special)",
      slug: "multigrain-atta",
      category: "Multigrain Atta",
      brand: "Mitti Fresh",
      shortDescription: "Healthy multigrain blend formulated with low glycemic index grains.",
      fullDescription: "A specialized blend of 9 high-quality grains including wheat, oats, ragi, barley, chana, soybean, and maize. Highly recommended for diabetes management, muscle health, and fiber digestion.",
      image: "assets/multigrain_atta.jpg",
      gallery: ["assets/multigrain_atta.jpg"],
      video: "",
      weight: "5kg",
      stock: 85,
      SKU: "MF-MUL-5KG",
      barcode: "8901234567891",
      MRP: 450,
      sellingPrice: 420,
      offerPrice: 420,
      discount: 7,
      GST: 0,
      HSNCode: "1102",
      tags: ["Multigrain", "Diabetes", "Dietary", "Stone Ground"],
      nutrition: "Energy: 350 kcal, Protein: 14.5g, Carbohydrates: 65g, Fat: 3.5g, Fiber: 13g",
      ingredients: "Wheat, Barley, Ragi, Oats, Chana, Soyabean, Maize, Bajra, Jowar",
      shelfLife: "45 Days",
      storageInstructions: "Store in an airtight container in a dry location.",
      featured: true,
      bestSeller: true,
      newArrival: false,
      recommended: true,
      seoTitle: "Diabetic Special Multigrain Atta | Mitti Fresh",
      metaDescription: "Control blood sugar levels naturally with our stone-ground multigrain flour."
    },
    {
      id: "PROD-MUSTARD-003",
      name: "Cold Pressed Mustard Oil",
      slug: "mustard-oil",
      category: "Cold Pressed Oil",
      brand: "Mitti Fresh",
      shortDescription: "100% pure cold-pressed yellow mustard oil extracted via wood pressed mills.",
      fullDescription: "Extracted at low temperatures using traditional wood press (Kani) methods. Retains the natural pungency, high levels of monounsaturated fatty acids, vitamins, and antioxidants.",
      image: "assets/mustard_oil.jpg",
      gallery: ["assets/mustard_oil.jpg"],
      video: "",
      weight: "1L",
      stock: 150,
      SKU: "MF-MST-1L",
      barcode: "8901234567892",
      MRP: 220,
      sellingPrice: 195,
      offerPrice: 195,
      discount: 11,
      GST: 5,
      HSNCode: "1514",
      tags: ["Mustard Oil", "Cold Pressed", "Wood Pressed", "Cooking"],
      nutrition: "Energy: 898 kcal, Saturated Fat: 11g, MUFA: 60g, PUFA: 29g",
      ingredients: "100% Yellow Mustard Seeds",
      shelfLife: "12 Months",
      storageInstructions: "Store in a cool dark bottle to maintain flavor pungency.",
      featured: true,
      bestSeller: true,
      newArrival: false,
      recommended: true,
      seoTitle: "Pure Cold Pressed Mustard Oil | Mitti Fresh",
      metaDescription: "Buy wood pressed yellow mustard oil. Unrefined, chemical-free extraction."
    },
    {
      id: "PROD-GROUND-004",
      name: "Cold Pressed Groundnut Oil",
      slug: "groundnut-oil",
      category: "Cold Pressed Oil",
      brand: "Mitti Fresh",
      shortDescription: "Premium cold-pressed peanut oil ideal for deep frying and sautéing.",
      fullDescription: "Naturally extracted groundnut oil from premium peanuts. Low oxidation rates, high smoke point, and completely cholesterol free. Preserves natural vitamins E and healthy fats.",
      image: "assets/groundnut_oil.jpg",
      gallery: ["assets/groundnut_oil.jpg"],
      video: "",
      weight: "1L",
      stock: 95,
      SKU: "MF-GND-1L",
      barcode: "8901234567893",
      MRP: 280,
      sellingPrice: 240,
      offerPrice: 240,
      discount: 14,
      GST: 5,
      HSNCode: "1508",
      tags: ["Groundnut Oil", "Peanut", "Cold Pressed", "Frying"],
      nutrition: "Energy: 899 kcal, Saturated Fat: 16g, MUFA: 46g, PUFA: 32g, Vitamin E: 15mg",
      ingredients: "100% Dried Groundnut Kernels",
      shelfLife: "9 Months",
      storageInstructions: "Store in dry place away from flame heat.",
      featured: true,
      bestSeller: true,
      newArrival: true,
      recommended: true,
      seoTitle: "Chemical-Free Wood Pressed Groundnut Oil | Mitti Fresh",
      metaDescription: "Purchase organic peanut oil extracted cold. Naturally cholesterol free."
    }
  ];
  writeTable('products', defaultProducts);
  return defaultProducts;
}

function seedDefaultCategories() {
  const defaultCategories = [
    { id: "CAT-001", name: "Wheat Atta", slug: "wheat-atta", featured: true },
    { id: "CAT-002", name: "Multigrain Atta", slug: "multigrain-atta", featured: true },
    { id: "CAT-003", name: "Cold Pressed Oil", slug: "cold-pressed-oil", featured: true },
    { id: "CAT-004", name: "Gram Flour & Others", slug: "gram-flour-others", featured: false }
  ];
  writeTable('categories', defaultCategories);
  return defaultCategories;
}

function seedDefaultUsers() {
  const defaultUsers = [
    {
      id: "USER-ADMIN-001",
      email: "admin@mittifresh.com",
      password: "admin",
      name: "Tushar Singh Lochav",
      role: "Super Admin",
      status: "Active"
    },
    {
      id: "USER-MGR-002",
      email: "manager@mittifresh.com",
      password: "managerpassword",
      name: "Rohan Vashisth",
      role: "Manager",
      status: "Active"
    }
  ];
  writeTable('users', defaultUsers);
  return defaultUsers;
}

function seedDefaultSettings() {
  const defaultSettings = {
    businessName: "Mitti Fresh",
    logo: "assets/logo.jpg",
    GSTIN: "07AAAAA1111A1Z1",
    PAN: "ABCDE1234F",
    bankDetails: {
      accountName: "Mitti Fresh Retailers",
      bankName: "State Bank of India",
      accountNumber: "98765432101",
      ifscCode: "SBIN0011562",
      branch: "Dwarka Sector 28 Delhi"
    },
    upiId: "lochavtushar8-1@oksbi",
    supportPhone: "8595077263",
    supportEmail: "support@mittifresh.com",
    shippingRules: {
      flatRate: 50,
      freeShippingThreshold: 500,
      codConvenienceFee: 50
    },
    serviceablePincodes: ["110075", "110078", "110059", "110045", "110046"]
  };
  writeTable('settings', [defaultSettings]);
  return [defaultSettings];
}

function seedDefaultCoupons() {
  const defaultCoupons = [
    { id: "CPN-001", code: "WELCOME10", type: "Percentage", discountVal: 10, minOrder: 0, maxDiscount: 100, usageLimit: 1000, expiry: "2026-12-31" },
    { id: "CPN-002", code: "SAVE100", type: "Flat", discountVal: 100, minOrder: 500, maxDiscount: 100, usageLimit: 500, expiry: "2026-08-31" },
    { id: "CPN-003", code: "FREEDELIVERY", type: "Free Shipping", discountVal: 0, minOrder: 300, maxDiscount: 50, usageLimit: 500, expiry: "2026-10-31" }
  ];
  writeTable('coupons', defaultCoupons);
  return defaultCoupons;
}

module.exports = db;
