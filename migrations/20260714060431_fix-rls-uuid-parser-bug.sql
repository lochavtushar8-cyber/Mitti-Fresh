-- 1. Drop Old RLS Policies
DROP POLICY IF EXISTS "Allow authenticated users to read self profile" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update self profile" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to insert self profile" ON public.customers;

DROP POLICY IF EXISTS "Allow authenticated users to insert own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated users to update own reviews" ON public.reviews;

-- 2. Create Optimized RLS Policies with subquery wrapped casts (prevents parser from mistaking ::uuid cast as a column named uuid)
CREATE POLICY "Allow authenticated users to read self profile" ON public.customers
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid())::text);

CREATE POLICY "Allow authenticated users to update self profile" ON public.customers
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid())::text)
  WITH CHECK (id = (SELECT auth.uid())::text);

CREATE POLICY "Allow authenticated users to insert self profile" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid())::text);

-- 3. Create Optimized RLS Policies for Reviews Table
CREATE POLICY "Allow authenticated users to insert own reviews" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK ("customerId" = (SELECT auth.uid())::text);

CREATE POLICY "Allow authenticated users to update own reviews" ON public.reviews
  FOR UPDATE TO authenticated
  USING ("customerId" = (SELECT auth.uid())::text)
  WITH CHECK ("customerId" = (SELECT auth.uid())::text);
