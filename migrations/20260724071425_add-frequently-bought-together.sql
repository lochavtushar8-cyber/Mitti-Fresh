-- Add frequentlyBoughtTogether column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "frequentlyBoughtTogether" JSONB DEFAULT '[]'::jsonb;
