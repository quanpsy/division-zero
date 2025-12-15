-- ============================================
-- DIVISION ZERO - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    -- Primary Key
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- ========================================
    -- SECTION 1: USER SUBMITTED (via form)
    -- ========================================
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    logo TEXT,
    original_url TEXT,
    github_repo TEXT,
    category TEXT DEFAULT 'other',
    pricing_model TEXT DEFAULT 'free' CHECK (pricing_model IN ('free', 'partial', 'paid')),
    
    -- Builder Info
    builder_name TEXT,
    builder_discord TEXT,
    builder_email TEXT,
    builder_profile_url TEXT,
    
    -- Arrays
    tools TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- ========================================
    -- SECTION 2: MODERATOR ADDED (via Discord)
    -- ========================================
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    is_division_zero BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    promoted BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    moderator_notes TEXT,
    rejection_reason TEXT,
    
    -- Moderation tracking
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    last_moderated_by TEXT,
    last_moderated_at TIMESTAMPTZ,
    
    -- ========================================
    -- SECTION 3: BOT/WORKER GENERATED
    -- ========================================
    slug TEXT UNIQUE,
    proxy_url TEXT,
    discord_thread TEXT,
    discord_message_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- ========================================
    -- SECTION 4: ANALYTICS (future)
    -- ========================================
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    trending_score INTEGER DEFAULT 0,
    slot TEXT DEFAULT 'none'
);

-- ============================================
-- 2. AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 3. AUTO-GENERATE SLUG TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug = LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug = TRIM(BOTH '-' FROM NEW.slug);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_generate_slug ON projects;
CREATE TRIGGER projects_generate_slug
    BEFORE INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION generate_slug();

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved projects
DROP POLICY IF EXISTS "Public can view approved projects" ON projects;
CREATE POLICY "Public can view approved projects" ON projects
    FOR SELECT
    USING (status = 'approved');

-- Anyone can insert (submit) projects
DROP POLICY IF EXISTS "Anyone can submit projects" ON projects;
CREATE POLICY "Anyone can submit projects" ON projects
    FOR INSERT
    WITH CHECK (true);

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_dz ON projects(is_division_zero);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- ============================================
-- 6. VIEW FOR PUBLIC API
-- ============================================
CREATE OR REPLACE VIEW public_projects AS
SELECT 
    id, name, tagline, description, logo, 
    original_url, github_repo, slug, proxy_url,
    builder_name, builder_discord, builder_profile_url,
    category, tools, tags, pricing_model,
    featured, promoted, verified, is_division_zero,
    discord_thread,
    created_at, approved_at,
    views, clicks, saves, trending_score, slot
FROM projects
WHERE status = 'approved'
ORDER BY 
    promoted DESC,
    featured DESC,
    is_division_zero DESC,
    approved_at DESC;

-- ============================================
-- DONE! Your projects table is ready.
-- ============================================
