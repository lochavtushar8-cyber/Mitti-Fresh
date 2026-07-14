-- 1. Drop Old RLS Policies
DROP POLICY IF EXISTS "Allow authenticated users to read self profile" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update self profile" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert self profile" ON public.customers;

DROP POLICY IF EXISTS "Allow authenticated users to read own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to insert own orders" ON public.orders;

DROP POLICY IF EXISTS "Allow authenticated users to insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated users to update own reviews" ON public.reviews;

-- 2. Create Optimized RLS Policies with Direct UUID comparisons using cast
CREATE POLICY "Allow authenticated users to read self profile" ON public.customers
  FOR SELECT TO authenticated
  USING (id::uuid = (SELECT auth.uid()));

CREATE POLICY "Allow authenticated users to update self profile" ON public.customers
  FOR UPDATE TO authenticated
  USING (id::uuid = (SELECT auth.uid()))
  WITH CHECK (id::uuid = (SELECT auth.uid()));

CREATE POLICY "Allow authenticated users to insert self profile" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (id::uuid = (SELECT auth.uid()));

-- 3. Create Optimized RLS Policies for Orders Table using JWT direct claim lookup (bypasses users table query & id parser issue)
CREATE POLICY "Allow authenticated users to read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING ((customer->>'email') = (SELECT auth.jwt() ->> 'email'));

CREATE POLICY "Allow authenticated users to insert own orders" ON public.orders
  FOR INSERT TO authenticated
  WITH CHECK ((customer->>'email') = (SELECT auth.jwt() ->> 'email'));

-- 4. Create Optimized RLS Policies for Reviews Table using Direct UUID comparisons
CREATE POLICY "Allow authenticated users to insert own reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK ("customerId"::uuid = (SELECT auth.uid()));

CREATE POLICY "Allow authenticated users to update own reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING ("customerId"::uuid = (SELECT auth.uid()))
  WITH CHECK ("customerId"::uuid = (SELECT auth.uid()));
