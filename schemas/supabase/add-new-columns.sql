-- ============================================
-- ALTER TABLE: Add new columns to projects
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Secret Key for project ownership
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS secret_key TEXT UNIQUE;

-- Promotion fields
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS promoted_order INTEGER;

-- Public ID (6-char lowercase alphanumeric for public reference)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS public_id TEXT UNIQUE;

-- Hold status fields (status can be: pending, approved, rejected, on_hold)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS hold_reason TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS hold_message TEXT;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS held_at TIMESTAMP;

-- View tracking columns (8 total)
-- Last 24 hours in 6-hour slots (for trend calculation)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_total INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_6h_slot1 INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_6h_slot2 INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_6h_slot3 INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_6h_slot4 INTEGER DEFAULT 0;

-- Rolling period views
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_3day INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_weekly INTEGER DEFAULT 0;

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS views_monthly INTEGER DEFAULT 0;

-- Create index on secret_key for fast lookups
CREATE INDEX IF NOT EXISTS idx_projects_secret_key ON projects(secret_key);

-- Create index on promoted for filtering
CREATE INDEX IF NOT EXISTS idx_projects_promoted ON projects(is_promoted, promoted_order);

-- ============================================
-- Summary of new columns:
-- ============================================
-- secret_key       TEXT UNIQUE    - 12-char key for ownership
-- is_promoted      BOOLEAN        - Whether in promoted carousel
-- promoted_order   INTEGER        - Order in promoted carousel
-- views_total      INTEGER        - All-time view count
-- views_6h_slot1   INTEGER        - Views 0-6 hours ago
-- views_6h_slot2   INTEGER        - Views 6-12 hours ago
-- views_6h_slot3   INTEGER        - Views 12-18 hours ago
-- views_6h_slot4   INTEGER        - Views 18-24 hours ago
-- views_3day       INTEGER        - Views in last 3 days
-- views_weekly     INTEGER        - Views in last 7 days
-- views_monthly    INTEGER        - Views in last 30 days
