/* ==========================================================================
   Mitti Fresh - JSON Database Engine (db.js)
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
// Force re-seed if products table is outdated (less than 10 products)
const prodPath = path.join(DB_DIR, 'products.json');
if (fs.existsSync(prodPath)) {
  try {
    const existing = JSON.parse(fs.readFileSync(prodPath, 'utf8'));
    if (existing.length < 10) {
      fs.unlinkSync(prodPath);
    }
  } catch (e) {
    fs.unlinkSync(prodPath);
  }
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
      if (table === 'customers') return seedDefaultCustomers();
      if (table === 'homepage') return seedDefaultHomepage();
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
    "id": "PROD-MULTIGRAIN-ATTA-SPECIAL-1KG",
    "name": "Multigrain Atta (Goal-Based) (1 kg (Trial))",
    "slug": "multigrain-atta-special-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "fullDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTASPECIAL-1KG",
    "MRP": 85,
    "sellingPrice": 70,
    "status": "active"
  },
  {
    "id": "PROD-MULTIGRAIN-ATTA-SPECIAL-5KG",
    "name": "Multigrain Atta (Goal-Based) (5 kg (Family Pack))",
    "slug": "multigrain-atta-special-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "fullDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTASPECIAL-5KG",
    "MRP": 400,
    "sellingPrice": 350,
    "status": "active"
  },
  {
    "id": "PROD-MULTIGRAIN-ATTA-SPECIAL-10KG",
    "name": "Multigrain Atta (Goal-Based) (10 kg (Value Pack))",
    "slug": "multigrain-atta-special-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "fullDescription": "Formulated for overall nutrition and better digestion. A wholesome blend of grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTASPECIAL-10KG",
    "MRP": 790,
    "sellingPrice": 690,
    "status": "active"
  },
  {
    "id": "PROD-HIGH-PROTEIN-ATTA-1KG",
    "name": "High Protein Atta (1 kg (Trial))",
    "slug": "high-protein-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "fullDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-HIGHPROTEINATTA-1KG",
    "MRP": 95,
    "sellingPrice": 80,
    "status": "active"
  },
  {
    "id": "PROD-HIGH-PROTEIN-ATTA-5KG",
    "name": "High Protein Atta (5 kg (Family Pack))",
    "slug": "high-protein-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "fullDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-HIGHPROTEINATTA-5KG",
    "MRP": 460,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-HIGH-PROTEIN-ATTA-10KG",
    "name": "High Protein Atta (10 kg (Value Pack))",
    "slug": "high-protein-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "fullDescription": "Designed for fitness enthusiasts and active lifestyles. Supports muscle growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-HIGHPROTEINATTA-10KG",
    "MRP": 890,
    "sellingPrice": 780,
    "status": "active"
  },
  {
    "id": "PROD-WEIGHT-LOSS-ATTA-1KG",
    "name": "Weight Loss Atta (1 kg (Trial))",
    "slug": "weight-loss-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "fullDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-WEIGHTLOSSATTA-1KG",
    "MRP": 95,
    "sellingPrice": 80,
    "status": "active"
  },
  {
    "id": "PROD-WEIGHT-LOSS-ATTA-5KG",
    "name": "Weight Loss Atta (5 kg (Family Pack))",
    "slug": "weight-loss-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "fullDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-WEIGHTLOSSATTA-5KG",
    "MRP": 460,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-WEIGHT-LOSS-ATTA-10KG",
    "name": "Weight Loss Atta (10 kg (Value Pack))",
    "slug": "weight-loss-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "fullDescription": "High-fiber dietary formulation that keeps you full longer to support weight management.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-WEIGHTLOSSATTA-10KG",
    "MRP": 890,
    "sellingPrice": 780,
    "status": "active"
  },
  {
    "id": "PROD-SUGAR-BALANCE-ATTA-1KG",
    "name": "Sugar Balance Atta (1 kg (Trial))",
    "slug": "sugar-balance-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "fullDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-SUGARBALANCEATTA-1KG",
    "MRP": 95,
    "sellingPrice": 80,
    "status": "active"
  },
  {
    "id": "PROD-SUGAR-BALANCE-ATTA-5KG",
    "name": "Sugar Balance Atta (5 kg (Family Pack))",
    "slug": "sugar-balance-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "fullDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-SUGARBALANCEATTA-5KG",
    "MRP": 460,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-SUGAR-BALANCE-ATTA-10KG",
    "name": "Sugar Balance Atta (10 kg (Value Pack))",
    "slug": "sugar-balance-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "fullDescription": "Low glycemic index conscious blend. Formulated to help reduce daily sugar spikes.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-SUGARBALANCEATTA-10KG",
    "MRP": 890,
    "sellingPrice": 780,
    "status": "active"
  },
  {
    "id": "PROD-HEART-CARE-ATTA-1KG",
    "name": "Heart Care Atta (1 kg (Trial))",
    "slug": "heart-care-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "fullDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-HEARTCAREATTA-1KG",
    "MRP": 99,
    "sellingPrice": 85,
    "status": "active"
  },
  {
    "id": "PROD-HEART-CARE-ATTA-5KG",
    "name": "Heart Care Atta (5 kg (Family Pack))",
    "slug": "heart-care-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "fullDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-HEARTCAREATTA-5KG",
    "MRP": 490,
    "sellingPrice": 425,
    "status": "active"
  },
  {
    "id": "PROD-HEART-CARE-ATTA-10KG",
    "name": "Heart Care Atta (10 kg (Value Pack))",
    "slug": "heart-care-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "fullDescription": "Flaxseed fortified wheat blend rich in heart-healthy plant-based Omega-3 fatty acids.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-HEARTCAREATTA-10KG",
    "MRP": 950,
    "sellingPrice": 830,
    "status": "active"
  },
  {
    "id": "PROD-KIDS-GROWTH-ATTA-1KG",
    "name": "Kids Growth Atta (1 kg (Trial))",
    "slug": "kids-growth-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "fullDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-KIDSGROWTHATTA-1KG",
    "MRP": 95,
    "sellingPrice": 80,
    "status": "active"
  },
  {
    "id": "PROD-KIDS-GROWTH-ATTA-5KG",
    "name": "Kids Growth Atta (5 kg (Family Pack))",
    "slug": "kids-growth-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "fullDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-KIDSGROWTHATTA-5KG",
    "MRP": 460,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-KIDS-GROWTH-ATTA-10KG",
    "name": "Kids Growth Atta (10 kg (Value Pack))",
    "slug": "kids-growth-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "fullDescription": "Fortified with finger millets and legumes. High calcium and iron for active growth.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-KIDSGROWTHATTA-10KG",
    "MRP": 890,
    "sellingPrice": 780,
    "status": "active"
  },
  {
    "id": "PROD-GUT-HEALTH-ATTA-1KG",
    "name": "Gut Health Atta (1 kg (Trial))",
    "slug": "gut-health-atta-1kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "fullDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg (Trial)",
    "stock": 100,
    "SKU": "MF-GUTHEALTHATTA-1KG",
    "MRP": 99,
    "sellingPrice": 85,
    "status": "active"
  },
  {
    "id": "PROD-GUT-HEALTH-ATTA-5KG",
    "name": "Gut Health Atta (5 kg (Family Pack))",
    "slug": "gut-health-atta-5kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "fullDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg (Family Pack)",
    "stock": 100,
    "SKU": "MF-GUTHEALTHATTA-5KG",
    "MRP": 490,
    "sellingPrice": 425,
    "status": "active"
  },
  {
    "id": "PROD-GUT-HEALTH-ATTA-10KG",
    "name": "Gut Health Atta (10 kg (Value Pack))",
    "slug": "gut-health-atta-10kg",
    "category": "Multigrain Atta",
    "brand": "Mitti Fresh",
    "shortDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "fullDescription": "Digestive wellness formulation rich in natural prebiotics and high quality dietary fibers.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg (Value Pack)",
    "stock": 100,
    "SKU": "MF-GUTHEALTHATTA-10KG",
    "MRP": 950,
    "sellingPrice": 830,
    "status": "active"
  },
  {
    "id": "PROD-MP-SHARBHATI-ATTA-1KG",
    "name": "MP Sharbhati Atta (1 kg)",
    "slug": "mp-sharbhati-atta-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "fullDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-MPSHARBHATIATTA-1KG",
    "MRP": 65,
    "sellingPrice": 55,
    "status": "active"
  },
  {
    "id": "PROD-MP-SHARBHATI-ATTA-5KG",
    "name": "MP Sharbhati Atta (5 kg)",
    "slug": "mp-sharbhati-atta-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "fullDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-MPSHARBHATIATTA-5KG",
    "MRP": 320,
    "sellingPrice": 275,
    "status": "active"
  },
  {
    "id": "PROD-MP-SHARBHATI-ATTA-10KG",
    "name": "MP Sharbhati Atta (10 kg)",
    "slug": "mp-sharbhati-atta-10kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "fullDescription": "Premium stone-ground wheat flour sourced from Sharbhati wheat grains. Super soft rotis.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg",
    "stock": 100,
    "SKU": "MF-MPSHARBHATIATTA-10KG",
    "MRP": 620,
    "sellingPrice": 540,
    "status": "active"
  },
  {
    "id": "PROD-MP-ATTA-REGULAR-1KG",
    "name": "MP Atta (Regular) (1 kg)",
    "slug": "mp-atta-regular-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "fullDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-MPATTAREGULAR-1KG",
    "MRP": 55,
    "sellingPrice": 48,
    "status": "active"
  },
  {
    "id": "PROD-MP-ATTA-REGULAR-5KG",
    "name": "MP Atta (Regular) (5 kg)",
    "slug": "mp-atta-regular-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "fullDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-MPATTAREGULAR-5KG",
    "MRP": 270,
    "sellingPrice": 240,
    "status": "active"
  },
  {
    "id": "PROD-MP-ATTA-REGULAR-10KG",
    "name": "MP Atta (Regular) (10 kg)",
    "slug": "mp-atta-regular-10kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "fullDescription": "Freshly stone-milled whole wheat flour. Balanced nutrition for daily home meals.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg",
    "stock": 100,
    "SKU": "MF-MPATTAREGULAR-10KG",
    "MRP": 530,
    "sellingPrice": 470,
    "status": "active"
  },
  {
    "id": "PROD-MULTIGRAIN-ATTA-REGULAR-1KG",
    "name": "Multigrain Atta (Regular) (1 kg)",
    "slug": "multigrain-atta-regular-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "fullDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTAREGULAR-1KG",
    "MRP": 80,
    "sellingPrice": 70,
    "status": "active"
  },
  {
    "id": "PROD-MULTIGRAIN-ATTA-REGULAR-5KG",
    "name": "Multigrain Atta (Regular) (5 kg)",
    "slug": "multigrain-atta-regular-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "fullDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTAREGULAR-5KG",
    "MRP": 395,
    "sellingPrice": 350,
    "status": "active"
  },
  {
    "id": "PROD-MULTIGRAIN-ATTA-REGULAR-10KG",
    "name": "Multigrain Atta (Regular) (10 kg)",
    "slug": "multigrain-atta-regular-10kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "fullDescription": "Standard daily multigrain flour ground fresh from selected local grains.",
    "image": "assets/multigrain_atta.jpg",
    "gallery": [
      "assets/multigrain_atta.jpg"
    ],
    "video": "",
    "weight": "10 kg",
    "stock": 100,
    "SKU": "MF-MULTIGRAINATTAREGULAR-10KG",
    "MRP": 780,
    "sellingPrice": 690,
    "status": "active"
  },
  {
    "id": "PROD-BESAN-1KG",
    "name": "Besan (Gram Flour) (1 kg)",
    "slug": "besan-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "100% pure stone-milled Bengal gram flour. No yellow peas added. Authentic taste.",
    "fullDescription": "100% pure stone-milled Bengal gram flour. No yellow peas added. Authentic taste.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-BESAN-1KG",
    "MRP": 150,
    "sellingPrice": 130,
    "status": "active"
  },
  {
    "id": "PROD-BESAN-5KG",
    "name": "Besan (Gram Flour) (5 kg)",
    "slug": "besan-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "100% pure stone-milled Bengal gram flour. No yellow peas added. Authentic taste.",
    "fullDescription": "100% pure stone-milled Bengal gram flour. No yellow peas added. Authentic taste.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-BESAN-5KG",
    "MRP": 720,
    "sellingPrice": 650,
    "status": "active"
  },
  {
    "id": "PROD-CHANNA-ROASTED-1KG",
    "name": "Sattu (Roasted Gram Flour) (1 kg)",
    "slug": "channa-roasted-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Nutritious roasted chana sattu. High protein, cooling, and great for summer beverages.",
    "fullDescription": "Nutritious roasted chana sattu. High protein, cooling, and great for summer beverages.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-CHANNAROASTED-1KG",
    "MRP": 130,
    "sellingPrice": 110,
    "status": "active"
  },
  {
    "id": "PROD-CHANNA-ROASTED-5KG",
    "name": "Sattu (Roasted Gram Flour) (5 kg)",
    "slug": "channa-roasted-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Nutritious roasted chana sattu. High protein, cooling, and great for summer beverages.",
    "fullDescription": "Nutritious roasted chana sattu. High protein, cooling, and great for summer beverages.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-CHANNAROASTED-5KG",
    "MRP": 620,
    "sellingPrice": 550,
    "status": "active"
  },
  {
    "id": "PROD-BAJRA-FLOUR-1KG",
    "name": "Bajra (Pearl Millet) (1 kg)",
    "slug": "bajra-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly ground pearl millet flour. Highly warming, rich in iron, perfect for winters.",
    "fullDescription": "Freshly ground pearl millet flour. Highly warming, rich in iron, perfect for winters.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-BAJRAFLOUR-1KG",
    "MRP": 60,
    "sellingPrice": 50,
    "status": "active"
  },
  {
    "id": "PROD-BAJRA-FLOUR-5KG",
    "name": "Bajra (Pearl Millet) (5 kg)",
    "slug": "bajra-flour-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly ground pearl millet flour. Highly warming, rich in iron, perfect for winters.",
    "fullDescription": "Freshly ground pearl millet flour. Highly warming, rich in iron, perfect for winters.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-BAJRAFLOUR-5KG",
    "MRP": 290,
    "sellingPrice": 250,
    "status": "active"
  },
  {
    "id": "PROD-MAKKA-FLOUR-1KG",
    "name": "Makka (Maize / Corn) (1 kg)",
    "slug": "makka-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-ground yellow maize flour. Traditional rich texture for makki ki roti.",
    "fullDescription": "Stone-ground yellow maize flour. Traditional rich texture for makki ki roti.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-MAKKAFLOUR-1KG",
    "MRP": 70,
    "sellingPrice": 60,
    "status": "active"
  },
  {
    "id": "PROD-MAKKA-FLOUR-5KG",
    "name": "Makka (Maize / Corn) (5 kg)",
    "slug": "makka-flour-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-ground yellow maize flour. Traditional rich texture for makki ki roti.",
    "fullDescription": "Stone-ground yellow maize flour. Traditional rich texture for makki ki roti.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-MAKKAFLOUR-5KG",
    "MRP": 340,
    "sellingPrice": 300,
    "status": "active"
  },
  {
    "id": "PROD-SOYA-FLOUR-1KG",
    "name": "Soya (Soybean Flour) (1 kg)",
    "slug": "soya-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Finely milled soybean flour. Excellent source of plant protein to blend with regular atta.",
    "fullDescription": "Finely milled soybean flour. Excellent source of plant protein to blend with regular atta.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-SOYAFLOUR-1KG",
    "MRP": 140,
    "sellingPrice": 120,
    "status": "active"
  },
  {
    "id": "PROD-ALSI-FLOUR-1KG",
    "name": "Alsi (Flaxseed Flour) (1 kg)",
    "slug": "alsi-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "100% pure flaxseed powder. Ground fresh to keep natural oils and healthy fats intact.",
    "fullDescription": "100% pure flaxseed powder. Ground fresh to keep natural oils and healthy fats intact.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-ALSIFLOUR-1KG",
    "MRP": 320,
    "sellingPrice": 280,
    "status": "active"
  },
  {
    "id": "PROD-DALIYA-1KG",
    "name": "Daliya (Broken Wheat) (1 kg)",
    "slug": "daliya-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Coarsely ground whole wheat grains. Rich in dietary fiber, clean and nutritious.",
    "fullDescription": "Coarsely ground whole wheat grains. Rich in dietary fiber, clean and nutritious.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-DALIYA-1KG",
    "MRP": 80,
    "sellingPrice": 70,
    "status": "active"
  },
  {
    "id": "PROD-DALIYA-5KG",
    "name": "Daliya (Broken Wheat) (5 kg)",
    "slug": "daliya-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Coarsely ground whole wheat grains. Rich in dietary fiber, clean and nutritious.",
    "fullDescription": "Coarsely ground whole wheat grains. Rich in dietary fiber, clean and nutritious.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-DALIYA-5KG",
    "MRP": 390,
    "sellingPrice": 350,
    "status": "active"
  },
  {
    "id": "PROD-JOU-FLOUR-1KG",
    "name": "Jou (Barley) (1 kg)",
    "slug": "jou-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly milled barley flour. Supports healthy digestion and metabolic wellness.",
    "fullDescription": "Freshly milled barley flour. Supports healthy digestion and metabolic wellness.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-JOUFLOUR-1KG",
    "MRP": 70,
    "sellingPrice": 60,
    "status": "active"
  },
  {
    "id": "PROD-JOU-FLOUR-5KG",
    "name": "Jou (Barley) (5 kg)",
    "slug": "jou-flour-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Freshly milled barley flour. Supports healthy digestion and metabolic wellness.",
    "fullDescription": "Freshly milled barley flour. Supports healthy digestion and metabolic wellness.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-JOUFLOUR-5KG",
    "MRP": 340,
    "sellingPrice": 300,
    "status": "active"
  },
  {
    "id": "PROD-JOWAR-FLOUR-1KG",
    "name": "Jowar (Sorghum) (1 kg)",
    "slug": "jowar-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-ground sorghum flour. Naturally gluten-free, light, and easy to digest.",
    "fullDescription": "Stone-ground sorghum flour. Naturally gluten-free, light, and easy to digest.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-JOWARFLOUR-1KG",
    "MRP": 70,
    "sellingPrice": 60,
    "status": "active"
  },
  {
    "id": "PROD-JOWAR-FLOUR-5KG",
    "name": "Jowar (Sorghum) (5 kg)",
    "slug": "jowar-flour-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-ground sorghum flour. Naturally gluten-free, light, and easy to digest.",
    "fullDescription": "Stone-ground sorghum flour. Naturally gluten-free, light, and easy to digest.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-JOWARFLOUR-5KG",
    "MRP": 340,
    "sellingPrice": 300,
    "status": "active"
  },
  {
    "id": "PROD-RAGI-FLOUR-1KG",
    "name": "Raggi (Finger Millet) (1 kg)",
    "slug": "ragi-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-milled calcium-rich finger millet flour. Crucial staple for children and elderly.",
    "fullDescription": "Stone-milled calcium-rich finger millet flour. Crucial staple for children and elderly.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-RAGIFLOUR-1KG",
    "MRP": 100,
    "sellingPrice": 90,
    "status": "active"
  },
  {
    "id": "PROD-RAGI-FLOUR-5KG",
    "name": "Raggi (Finger Millet) (5 kg)",
    "slug": "ragi-flour-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Stone-milled calcium-rich finger millet flour. Crucial staple for children and elderly.",
    "fullDescription": "Stone-milled calcium-rich finger millet flour. Crucial staple for children and elderly.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-RAGIFLOUR-5KG",
    "MRP": 490,
    "sellingPrice": 450,
    "status": "active"
  },
  {
    "id": "PROD-OATS-FLOUR-1KG",
    "name": "Oats Flour (1 kg)",
    "slug": "oats-flour-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Whole oat groats milled into a nutritious flour. Excellent for healthy baking.",
    "fullDescription": "Whole oat groats milled into a nutritious flour. Excellent for healthy baking.",
    "image": "assets/wheat_atta.jpg",
    "gallery": [
      "assets/wheat_atta.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-OATSFLOUR-1KG",
    "MRP": 175,
    "sellingPrice": 150,
    "status": "active"
  },
  {
    "id": "PROD-BASMATI-RICE-1KG",
    "name": "Basmati Rice (Premium) (1 kg)",
    "slug": "basmati-rice-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Aromatic, long-grain basmati rice. Selected premium quality aged grains.",
    "fullDescription": "Aromatic, long-grain basmati rice. Selected premium quality aged grains.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-BASMATIRICE-1KG",
    "MRP": 155,
    "sellingPrice": 130,
    "status": "active"
  },
  {
    "id": "PROD-BASMATI-RICE-5KG",
    "name": "Basmati Rice (Premium) (5 kg)",
    "slug": "basmati-rice-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Aromatic, long-grain basmati rice. Selected premium quality aged grains.",
    "fullDescription": "Aromatic, long-grain basmati rice. Selected premium quality aged grains.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-BASMATIRICE-5KG",
    "MRP": 740,
    "sellingPrice": 650,
    "status": "active"
  },
  {
    "id": "PROD-MOONG-DAL-1KG",
    "name": "Moong Dal (Green Gram Dal) (1 kg)",
    "slug": "moong-dal-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium quality green gram dal. Untreated, unrefined, full of plant proteins.",
    "fullDescription": "Premium quality green gram dal. Untreated, unrefined, full of plant proteins.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-MOONGDAL-1KG",
    "MRP": 185,
    "sellingPrice": 160,
    "status": "active"
  },
  {
    "id": "PROD-YELLOW-MUSTARD-OIL-1L",
    "name": "Cold Pressed Yellow Mustard Oil (1 Liter)",
    "slug": "yellow-mustard-oil-1L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Extracted using traditional wooden kohlus from premium yellow seeds. Aromatic & light flavor.",
    "fullDescription": "Extracted using traditional wooden kohlus from premium yellow seeds. Aromatic & light flavor.",
    "image": "assets/mustard_oil.jpg",
    "gallery": [
      "assets/mustard_oil.jpg"
    ],
    "video": "",
    "weight": "1 Liter",
    "stock": 100,
    "SKU": "MF-YELLOWMUSTARDOIL-1L",
    "MRP": 420,
    "sellingPrice": 360,
    "status": "active"
  },
  {
    "id": "PROD-YELLOW-MUSTARD-OIL-5L",
    "name": "Cold Pressed Yellow Mustard Oil (5 Liters (Value Pack))",
    "slug": "yellow-mustard-oil-5L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Extracted using traditional wooden kohlus from premium yellow seeds. Aromatic & light flavor.",
    "fullDescription": "Extracted using traditional wooden kohlus from premium yellow seeds. Aromatic & light flavor.",
    "image": "assets/mustard_oil.jpg",
    "gallery": [
      "assets/mustard_oil.jpg"
    ],
    "video": "",
    "weight": "5 Liters (Value Pack)",
    "stock": 100,
    "SKU": "MF-YELLOWMUSTARDOIL-5L",
    "MRP": 2000,
    "sellingPrice": 1750,
    "status": "active"
  },
  {
    "id": "PROD-BLACK-MUSTARD-OIL-1L",
    "name": "Cold Pressed Black Mustard Oil (1 Liter)",
    "slug": "black-mustard-oil-1L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Traditionally kohlu-pressed black mustard seeds. Strong pungency, natural health benefits.",
    "fullDescription": "Traditionally kohlu-pressed black mustard seeds. Strong pungency, natural health benefits.",
    "image": "assets/mustard_oil.jpg",
    "gallery": [
      "assets/mustard_oil.jpg"
    ],
    "video": "",
    "weight": "1 Liter",
    "stock": 100,
    "SKU": "MF-BLACKMUSTARDOIL-1L",
    "MRP": 310,
    "sellingPrice": 260,
    "status": "active"
  },
  {
    "id": "PROD-BLACK-MUSTARD-OIL-5L",
    "name": "Cold Pressed Black Mustard Oil (5 Liters (Value Pack))",
    "slug": "black-mustard-oil-5L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Traditionally kohlu-pressed black mustard seeds. Strong pungency, natural health benefits.",
    "fullDescription": "Traditionally kohlu-pressed black mustard seeds. Strong pungency, natural health benefits.",
    "image": "assets/mustard_oil.jpg",
    "gallery": [
      "assets/mustard_oil.jpg"
    ],
    "video": "",
    "weight": "5 Liters (Value Pack)",
    "stock": 100,
    "SKU": "MF-BLACKMUSTARDOIL-5L",
    "MRP": 1500,
    "sellingPrice": 1250,
    "status": "active"
  },
  {
    "id": "PROD-GROUNDNUT-OIL-1L",
    "name": "Cold Pressed Groundnut Oil (1 Liter)",
    "slug": "groundnut-oil-1L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Chemical-free unrefined oil wood-pressed from select peanuts. High smoke point cooking.",
    "fullDescription": "Chemical-free unrefined oil wood-pressed from select peanuts. High smoke point cooking.",
    "image": "assets/groundnut_oil.jpg",
    "gallery": [
      "assets/groundnut_oil.jpg"
    ],
    "video": "",
    "weight": "1 Liter",
    "stock": 100,
    "SKU": "MF-GROUNDNUTOIL-1L",
    "MRP": 275,
    "sellingPrice": 230,
    "status": "active"
  },
  {
    "id": "PROD-GROUNDNUT-OIL-5L",
    "name": "Cold Pressed Groundnut Oil (5 Liters (Value Pack))",
    "slug": "groundnut-oil-5L",
    "category": "Cold Pressed Oil",
    "brand": "Mitti Fresh",
    "shortDescription": "Chemical-free unrefined oil wood-pressed from select peanuts. High smoke point cooking.",
    "fullDescription": "Chemical-free unrefined oil wood-pressed from select peanuts. High smoke point cooking.",
    "image": "assets/groundnut_oil.jpg",
    "gallery": [
      "assets/groundnut_oil.jpg"
    ],
    "video": "",
    "weight": "5 Liters (Value Pack)",
    "stock": 100,
    "SKU": "MF-GROUNDNUTOIL-5L",
    "MRP": 1300,
    "sellingPrice": 1120,
    "status": "active"
  },
  {
    "id": "PROD-YELLOW-MUSTARD-KHAL-1KG",
    "name": "Yellow Mustard Khal (1 kg)",
    "slug": "yellow-mustard-khal-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "fullDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-YELLOWMUSTARDKHAL-1KG",
    "MRP": 40,
    "sellingPrice": 40,
    "status": "active"
  },
  {
    "id": "PROD-YELLOW-MUSTARD-KHAL-10KG",
    "name": "Yellow Mustard Khal (10 kg)",
    "slug": "yellow-mustard-khal-10kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "fullDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "10 kg",
    "stock": 100,
    "SKU": "MF-YELLOWMUSTARDKHAL-10KG",
    "MRP": 400,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-YELLOW-MUSTARD-KHAL-50KG",
    "name": "Yellow Mustard Khal (50 kg (Bulk))",
    "slug": "yellow-mustard-khal-50kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "fullDescription": "Premium yellow mustard oil cake residue. Highly nutritious feed supplement for cattle.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "50 kg (Bulk)",
    "stock": 100,
    "SKU": "MF-YELLOWMUSTARDKHAL-50KG",
    "MRP": 1950,
    "sellingPrice": 1950,
    "status": "active"
  },
  {
    "id": "PROD-BLACK-MUSTARD-KHAL-1KG",
    "name": "Black Mustard Khal (1 kg)",
    "slug": "black-mustard-khal-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "fullDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-BLACKMUSTARDKHAL-1KG",
    "MRP": 40,
    "sellingPrice": 40,
    "status": "active"
  },
  {
    "id": "PROD-BLACK-MUSTARD-KHAL-10KG",
    "name": "Black Mustard Khal (10 kg)",
    "slug": "black-mustard-khal-10kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "fullDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "10 kg",
    "stock": 100,
    "SKU": "MF-BLACKMUSTARDKHAL-10KG",
    "MRP": 400,
    "sellingPrice": 400,
    "status": "active"
  },
  {
    "id": "PROD-BLACK-MUSTARD-KHAL-50KG",
    "name": "Black Mustard Khal (50 kg (Bulk))",
    "slug": "black-mustard-khal-50kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "fullDescription": "Traditional black mustard oil cake residue. High protein cattle feed value.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "50 kg (Bulk)",
    "stock": 100,
    "SKU": "MF-BLACKMUSTARDKHAL-50KG",
    "MRP": 1950,
    "sellingPrice": 1950,
    "status": "active"
  },
  {
    "id": "PROD-METHI-DANA-1KG",
    "name": "Methi Dana (Fenugreek Grains) (1 kg)",
    "slug": "methi-dana-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Premium selected fenugreek seeds, ideal for spice use or traditional wellness recipes.",
    "fullDescription": "Premium selected fenugreek seeds, ideal for spice use or traditional wellness recipes.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-METHIDANA-1KG",
    "MRP": 170,
    "sellingPrice": 150,
    "status": "active"
  },
  {
    "id": "PROD-GHAT-PEAS-1KG",
    "name": "Ghat (Dried Field Peas) (1 kg)",
    "slug": "ghat-peas-1kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Selected high-grade dried field peas. Nutritious source of dietary proteins.",
    "fullDescription": "Selected high-grade dried field peas. Nutritious source of dietary proteins.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "1 kg",
    "stock": 100,
    "SKU": "MF-GHATPEAS-1KG",
    "MRP": 105,
    "sellingPrice": 90,
    "status": "active"
  },
  {
    "id": "PROD-GHAT-PEAS-5KG",
    "name": "Ghat (Dried Field Peas) (5 kg)",
    "slug": "ghat-peas-5kg",
    "category": "Gram Flour & Grains",
    "brand": "Mitti Fresh",
    "shortDescription": "Selected high-grade dried field peas. Nutritious source of dietary proteins.",
    "fullDescription": "Selected high-grade dried field peas. Nutritious source of dietary proteins.",
    "image": "assets/hero_banner.jpg",
    "gallery": [
      "assets/hero_banner.jpg"
    ],
    "video": "",
    "weight": "5 kg",
    "stock": 100,
    "SKU": "MF-GHATPEAS-5KG",
    "MRP": 500,
    "sellingPrice": 450,
    "status": "active"
  }
];
  writeTable('products', defaultProducts);
  return defaultProducts;
}

function seedDefaultCategories() {
  const defaultCategories = [
    { id: "CAT-001", name: "Wheat Atta", slug: "atta-traditional", featured: true },
    { id: "CAT-002", name: "Multigrain Atta", slug: "atta-specialty", featured: true },
    { id: "CAT-003", name: "Cold Pressed Oil", slug: "oils", featured: true },
    { id: "CAT-004", name: "Gram Flour & Grains", slug: "atta-grains", featured: false },
    { id: "CAT-005", name: "Traditional Spices", slug: "spices", featured: false },
    { id: "CAT-006", name: "Fresh Dosa Batters", slug: "batters", featured: false }
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

function seedDefaultCustomers() {
  const defaultCustomers = [
    {
      id: "CUST-001",
      name: "Devansh Vashisth",
      email: "customer@mittifresh.com",
      password: "customer123",
      phone: "9958172635",
      rewardPoints: 150,
      addresses: [
        {
          house: "H-104",
          street: "Dwarka Sector 7",
          landmark: "Near Ramphal Chowk",
          pin: "110075",
          city: "New Delhi",
          state: "Delhi"
        }
      ],
      wishlist: [],
      cart: [],
      createdAt: new Date().toISOString()
    }
  ];
  writeTable('customers', defaultCustomers);
  return defaultCustomers;
}

function seedDefaultHomepage() {
  const defaultHomepage = {
    id: "HP-001",
    hero: {
      title: "Milling Pure Grains Right Before Your Eyes",
      subtitle: "Experience 100% natural, unadulterated stone-ground flours and cold-pressed oils prepared fresh on your order.",
      videoMp4: "assets/hero_video.mp4",
      videoWebm: "assets/hero_video.webm"
    },
    banners: [
      {
        id: "banner-1",
        title: "Cold Pressed Oils",
        subtitle: "Kohlu-pressed under low temperatures to preserve nutrition, antioxidants, and rich natural aroma.",
        image: "assets/mustard_oil.jpg",
        link: "/collections/staples"
      }
    ],
    testimonials: [
      {
        id: "test-1",
        name: "Devansh Vashisth",
        rating: 5,
        review: "The taste of rotis made from their stone-ground MP wheat atta is simply amazing. It stays soft for hours! Highly recommended.",
        date: "2 days ago"
      },
      {
        id: "test-2",
        name: "Shreya Gupta",
        rating: 5,
        review: "I have been using their cold pressed mustard oil for cooking. The pungency and purity is unmatched. Love the transperancy of grinding live.",
        date: "1 week ago"
      }
    ]
  };
  writeTable('homepage', [defaultHomepage]);
  return [defaultHomepage];
}

module.exports = db;
