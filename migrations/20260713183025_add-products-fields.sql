ALTER TABLE public.products
  ADD COLUMN slug TEXT,
  ADD COLUMN brand TEXT,
  ADD COLUMN "shortDescription" TEXT,
  ADD COLUMN "fullDescription" TEXT,
  ADD COLUMN image TEXT,
  ADD COLUMN gallery JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN video TEXT,
  ADD COLUMN weight TEXT;
