-- Add category column to reviews table
ALTER TABLE "reviews" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'SERVICE';