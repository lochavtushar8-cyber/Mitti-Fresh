-- 1. Drop Old RLS Policies
DROP POLICY IF EXISTS "Allow review inserts" ON public.reviews;
DROP POLICY IF EXISTS "Allow anyone read reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow customer self updates" ON public.customers;
DROP POLICY IF EXISTS "Allow customer self reads" ON public.customers;
DROP POLICY IF EXISTS "Allow customer inserts" ON public.customers;
DROP POLICY IF EXISTS "Allow order updates" ON public.orders;
DROP POLICY IF EXISTS "Allow order reads" ON public.orders;
DROP POLICY IF EXISTS "Allow order inserts" ON public.orders;
DROP POLICY IF EXISTS "Allow all access on notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow all access on logs" ON public.logs;
DROP POLICY IF EXISTS "Allow anyone read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Allow anyone read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admin all access on users" ON public.users;

-- 2. Revoke Broad Public Runtime Privileges on Restricted/Admin Tables
REVOKE ALL PRIVILEGES ON public.coupons FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.logs FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.notifications FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.settings FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.users FROM anon, authenticated;

-- 3. Revoke/Grant Client-Level Privileges for Core Tables
REVOKE ALL PRIVILEGES ON public.customers FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.orders FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON public.reviews FROM anon, authenticated;

-- Grant to authenticated only (anon gets zero privileges on these)
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.reviews TO authenticated;

-- 4. Create New Customer Row-Level Security Policies (with UUID casting)
CREATE POLICY "Allow authenticated users to read self profile" ON public.customers
  FOR SELECT TO authenticated
  USING (id = auth.uid()::text);

CREATE POLICY "Allow authenticated users to update self profile" ON public.customers
  FOR UPDATE TO authenticated
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Allow authenticated users to insert self profile" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid()::text);

-- 5. Create New Orders Row-Level Security Policies
CREATE POLICY "Allow authenticated users to read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING ((customer->>'email') = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow authenticated users to insert own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK ((customer->>'email') = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 6. Create New Reviews Row-Level Security Policies
CREATE POLICY "Allow authenticated users to read reviews" ON public.reviews
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert own reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK ("customerId" = auth.uid()::text);

CREATE POLICY "Allow authenticated users to update own reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING ("customerId" = auth.uid()::text)
  WITH CHECK ("customerId" = auth.uid()::text);
