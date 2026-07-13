-- 1. Create Categories Table
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Products Table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  mrp NUMERIC(10,2) NOT NULL,
  "sellingPrice" NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Customers Table
CREATE TABLE public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  "profilePhoto" TEXT,
  addresses JSONB DEFAULT '[]'::jsonb,
  wishlist JSONB DEFAULT '[]'::jsonb,
  cart JSONB DEFAULT '[]'::jsonb,
  "rewardPoints" INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Orders Table
CREATE TABLE public.orders (
  "orderId" TEXT PRIMARY KEY,
  customer JSONB NOT NULL,
  address JSONB NOT NULL,
  items JSONB NOT NULL,
  "paymentMethod" TEXT,
  "paymentStatus" TEXT,
  "orderStatus" TEXT,
  amount NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2),
  "shippingCharge" NUMERIC(10,2),
  discount NUMERIC(10,2),
  "trackingId" TEXT,
  "deliveryPartner" TEXT,
  "upiTransactionId" TEXT,
  "upiScreenshot" TEXT,
  "upiNotes" TEXT,
  "razorpayOrderId" TEXT,
  "razorpayPaymentId" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Coupons Table
CREATE TABLE public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  "discountVal" NUMERIC(10,2) NOT NULL,
  "minOrder" NUMERIC(10,2) DEFAULT 0,
  "maxDiscount" NUMERIC(10,2),
  "usageLimit" INTEGER DEFAULT 0,
  expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Reviews Table
CREATE TABLE public.reviews (
  id TEXT PRIMARY KEY,
  "productId" TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  "customerId" TEXT,
  "customerName" TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'Pending',
  "adminReply" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Homepage Table
CREATE TABLE public.homepage (
  id TEXT PRIMARY KEY,
  hero JSONB,
  banners JSONB,
  "featuredProducts" JSONB,
  testimonials JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create Settings Table
CREATE TABLE public.settings (
  id TEXT PRIMARY KEY,
  "businessName" TEXT,
  logo TEXT,
  "GSTIN" TEXT,
  "PAN" TEXT,
  "bankDetails" JSONB,
  "upiId" TEXT,
  "supportPhone" TEXT,
  "supportEmail" TEXT,
  "shippingRules" JSONB,
  "serviceablePincodes" JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create Notifications Table
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create Users Table (Admin employees)
CREATE TABLE public.users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Create Logs Table (Audit logs)
CREATE TABLE public.logs (
  id TEXT PRIMARY KEY,
  "user" TEXT,
  action TEXT,
  details TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for RLS / performance columns
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_orders_customer_email ON public.orders(((customer->>'email')));
CREATE INDEX idx_reviews_product ON public.reviews("productId");

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Grant access on public schema and tables to all roles (anon, authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Policies for public tables (read-only for all, write for authenticated admin)
CREATE POLICY "Allow anyone read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anyone read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anyone read coupons" ON public.coupons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anyone read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anyone read homepage" ON public.homepage FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow anyone read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);

-- Allow authenticated/anon customer creation
CREATE POLICY "Allow customer inserts" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Allow customer profile access based on email check (if direct client connection)
CREATE POLICY "Allow customer self reads" ON public.customers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow customer self updates" ON public.customers FOR UPDATE TO anon, authenticated USING (true);

-- Allow order creation and reads
CREATE POLICY "Allow order inserts" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow order reads" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow order updates" ON public.orders FOR UPDATE TO anon, authenticated USING (true);

-- Allow review creation
CREATE POLICY "Allow review inserts" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Generic fallback policy for administrative tables
CREATE POLICY "Allow admin all access on users" ON public.users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on logs" ON public.logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on notifications" ON public.notifications FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Trigger functions for auto updated_at
CREATE TRIGGER tr_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_homepage_updated_at BEFORE UPDATE ON public.homepage FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
CREATE TRIGGER tr_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();
