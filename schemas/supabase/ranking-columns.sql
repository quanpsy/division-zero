-- ============================================
-- DIVISION ZERO - RANKING COLUMNS
-- ============================================
-- Run this in Supabase SQL Editor
-- Adds columns needed for carousel ranking
-- ============================================

-- Trending rank (1-10 for top 10, NULL for others)
-- Updated every 6 hours by cron
ALTER TABLE projects ADD COLUMN IF NOT EXISTS trending_rank INTEGER;

-- Editor's Pick / Featured rank (order in carousel)
-- Set manually by mods via Discord
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_rank INTEGER;

-- Rename logic: featured column = editors_pick
-- We'll use the existing 'featured' boolean column as editors_pick
-- Just add featured_rank for ordering

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_projects_trending_rank ON projects(trending_rank) WHERE trending_rank IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_projects_featured_rank ON projects(featured_rank) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_views_total ON projects(views_total DESC);

-- ============================================
-- VIEW: Trending projects (top 10)
-- ============================================
CREATE OR REPLACE VIEW trending_projects AS
SELECT *
FROM projects
WHERE status = 'approved' AND trending_rank IS NOT NULL
ORDER BY trending_rank ASC
LIMIT 10;

-- ============================================
-- VIEW: Editor's Pick projects
-- ============================================
CREATE OR REPLACE VIEW editors_pick_projects AS
SELECT *
FROM projects
WHERE status = 'approved' AND featured = true
ORDER BY featured_rank ASC NULLS LAST, approved_at DESC
LIMIT 8;

-- ============================================
-- VIEW: All-time best (by views)
-- ============================================
CREATE OR REPLACE VIEW alltime_best_projects AS
SELECT *
FROM projects
WHERE status = 'approved'
ORDER BY views_total DESC
LIMIT 10;

-- ============================================
-- VIEW: Division Zero projects
-- ============================================
CREATE OR REPLACE VIEW division_zero_projects AS
SELECT *
FROM projects
WHERE status = 'approved' AND is_division_zero = true
ORDER BY approved_at DESC
LIMIT 4;

-- ============================================
-- VIEW: Promoted projects
-- ============================================
CREATE OR REPLACE VIEW promoted_projects AS
SELECT *
FROM projects
WHERE status = 'approved' AND is_promoted = true
ORDER BY promoted_order ASC
LIMIT 4;

-- ============================================
-- DONE! Ranking columns added.
-- ============================================
