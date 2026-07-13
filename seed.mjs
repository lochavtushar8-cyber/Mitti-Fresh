import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createAdminClient } from '@insforge/sdk';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

const INSFORGE_URL = process.env.INSFORGE_URL;
const INSFORGE_API_KEY = process.env.INSFORGE_API_KEY;

if (!INSFORGE_URL || !INSFORGE_API_KEY) {
  console.error("Error: INSFORGE_URL and INSFORGE_API_KEY must be set in .env");
  process.exit(1);
}

const admin = createAdminClient({
  baseUrl: INSFORGE_URL,
  apiKey: INSFORGE_API_KEY
});

// Secure Password Hashing Helper
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const dataDir = path.join(__dirname, 'data');

async function seedTable(jsonFile, tableName, mapFn = (row) => row) {
  const filePath = path.join(dataDir, jsonFile);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${jsonFile} not found, skipping.`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const mappedData = rawData.map(mapFn);

  console.log(`Seeding ${mappedData.length} records into ${tableName}...`);

  // Delete existing records to avoid conflicts
  const { error: deleteError } = await admin.database.from(tableName).delete().neq('id', 'placeholder_nonexistent_id');
  if (deleteError) {
    console.warn(`Warning: Could not clear table ${tableName}:`, deleteError);
  }

  // Insert in batches
  const batchSize = 50;
  for (let i = 0; i < mappedData.length; i += batchSize) {
    const batch = mappedData.slice(i, i + batchSize);
    const { error } = await admin.database.from(tableName).insert(batch);
    if (error) {
      console.error(`Error seeding ${tableName} at index ${i}:`, error);
      throw error;
    }
  }
  console.log(`✓ Seeded ${tableName} successfully.`);
}

async function main() {
  try {
    // 1. Categories
    await seedTable('categories.json', 'categories');

    // 2. Products
    await seedTable('products.json', 'products', (p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      brand: p.brand,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      image: p.image,
      gallery: p.gallery || [],
      video: p.video || "",
      weight: p.weight,
      stock: p.stock || 0,
      sku: p.SKU,
      mrp: p.MRP,
      sellingPrice: p.sellingPrice,
      status: p.status || 'active',
      featured: p.featured || false,
      created_at: p.createdAt || new Date().toISOString(),
      updated_at: p.updatedAt || new Date().toISOString()
    }));

    // 3. Customers (with securely hashed passwords)
    await seedTable('customers.json', 'customers', (c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      password: hashPassword(c.password), // SECURELY HASHED!
      profilePhoto: c.profilePhoto || null,
      addresses: c.addresses || [],
      wishlist: c.wishlist || [],
      cart: c.cart || [],
      rewardPoints: c.rewardPoints || 100,
      created_at: c.createdAt || new Date().toISOString(),
      updated_at: c.updatedAt || new Date().toISOString()
    }));

    // 4. Coupons
    await seedTable('coupons.json', 'coupons');

    // 5. Homepage
    await seedTable('homepage.json', 'homepage');

    // 6. Settings
    await seedTable('settings.json', 'settings', (s) => ({
      id: s.id || 'settings_default',
      businessName: s.businessName,
      logo: s.logo,
      GSTIN: s.GSTIN,
      PAN: s.PAN,
      bankDetails: s.bankDetails,
      upiId: s.upiId,
      supportPhone: s.supportPhone,
      supportEmail: s.supportEmail,
      shippingRules: s.shippingRules,
      serviceablePincodes: s.serviceablePincodes
    }));

    // 7. Users (Admin Employees - hash passwords too)
    await seedTable('users.json', 'users', (u) => ({
      id: u.id,
      email: u.email,
      password: hashPassword(u.password), // SECURELY HASHED!
      name: u.name,
      role: u.role,
      status: u.status || 'Active'
    }));

    // 8. Logs (Audit logs)
    await seedTable('logs.json', 'logs', (l) => ({
      id: l.id,
      user: l.user,
      action: l.action,
      details: l.details,
      ip: l.ip,
      created_at: l.createdAt || new Date().toISOString()
    }));

    console.log("All tables seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

main();
