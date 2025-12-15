# Future Implementations

This document tracks features to implement in future iterations.

---

## 🔐 Project Ownership ID System

**Priority:** HIGH  
**Complexity:** MEDIUM  
**Status:** Not started

### Overview

Generate a unique secret key when a project is submitted. This key acts as proof of ownership and allows builders to:
- Claim their project
- Request changes to their project
- Prove they built something

### User Flow

```
1. User fills project form
2. On submit:
   - Generate unique secret key: `dz-proj-a1b2c3d4e5f6g7h8`
   - Attach to project data
   - Show modal with key + copy button
3. Modal says: "Save this key! You'll need it to prove ownership"
4. User copies key and keeps it safe
5. Later: User DMs mod team with key to claim ownership
```

### Implementation Changes Required

#### Frontend
- [ ] `discord-webhooks.js` - Generate secret key before submission
- [ ] `submit-project-form.js` - Add success modal with key display
- [ ] Add modal CSS with copy button
- [ ] Show "⚠️ SAVE THIS KEY" warning

#### Backend
- [ ] Update Supabase schema - Add `secret_key` column
- [ ] Bot stores secret key with project data
- [ ] Bot command: `!verify <key>` to check ownership

#### Database
```sql
ALTER TABLE projects ADD COLUMN secret_key TEXT UNIQUE;
CREATE INDEX idx_projects_secret_key ON projects(secret_key);
```

### Key Generation Format

```javascript
// Example key format
function generateProjectKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'dz-proj-';
    for (let i = 0; i < 16; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}
// Output: dz-proj-a1b2c3d4e5f6g7h8
```

### Security Notes

- ⚠️ Secret key should NEVER be shown in Discord
- ⚠️ Only send to submitter via the success modal
- ⚠️ Store hashed version in database? (optional extra security)
- ⚠️ Key should be long enough to prevent guessing (16+ chars)

---

## 🎨 Bot Embed Styling Improvements

**Priority:** LOW  
**Status:** Partially done

- [ ] Match project-card-v2 styling more closely
- [ ] Add more visual separators
- [ ] Consider using image banners

---

## 🔢 Unique Visitor Tracking (Anti-Spam)

**Priority:** HIGH  
**Status:** Not started

### Concept
- Track unique visitors per **5 minute window** (not daily)
- Prevents spam while keeping view counts reasonable
- Uses IP + User Agent fingerprint

### Implementation
```javascript
// In Cloudflare Worker
async function trackUniqueVisit(projectId, request) {
    const ip = request.headers.get('CF-Connecting-IP');
    const ua = request.headers.get('User-Agent') || '';
    const fingerprint = hashString(ip + ua);
    
    // 5-minute window key
    const window = Math.floor(Date.now() / (5 * 60 * 1000));
    const visitKey = `${projectId}:${window}:${fingerprint}`;
    
    // Check if exists in Supabase visits table
    // If not, increment view and add record
}
```

### Database: `project_visits` table
```sql
CREATE TABLE project_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    fingerprint TEXT,
    window_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, fingerprint, window_id)
);
```

---

## 📊 Ranking Algorithm

**Priority:** HIGH  
**Status:** Not started

### Inputs
| Factor | Weight | Notes |
|--------|--------|-------|
| Views (7 days) | High | Recent engagement |
| Views (total) | Low | Historical baseline |
| View frequency | Medium | Consistent traffic > spike |
| Age (decay) | Negative | New projects boosted |
| Saves | High | User intent signal |
| Featured (mod) | Boost | Manual moderator pick |
| Division Zero | Small boost | Internal projects |

### Algorithm Concept
```javascript
function calculateScore(project) {
    const now = Date.now();
    const ageInDays = (now - new Date(project.approved_at)) / (1000 * 60 * 60 * 24);
    
    // === DECAY FUNCTION ===
    // New projects get boost, decays over 14 days
    const newBoost = Math.max(0, 100 - (ageInDays * 7)); // -7 per day
    
    // === TIME-WEIGHTED VIEWS ===
    const recentViews = project.views_7d * 2;    // Recent = 2x weight
    const olderViews = project.views_total * 0.1; // Historical = 0.1x
    
    // === ENGAGEMENT SIGNALS ===
    const saveBoost = project.saves * 5;         // Saves = strong signal
    const frequencyScore = project.daily_avg_views * 3; // Consistent traffic
    
    // === MANUAL BOOSTS ===
    const featuredBoost = project.featured ? 50 : 0;
    const dzBoost = project.is_division_zero ? 20 : 0;
    
    // === FINAL SCORE ===
    const score = 
        newBoost +
        recentViews +
        olderViews +
        saveBoost +
        frequencyScore +
        featuredBoost +
        dzBoost;
    
    return Math.round(score);
}
```

### Decay Visualization
```
Score Multiplier
  |
1.0|****
   |    ****
0.5|        ****
   |            ****
0.0|________________****____
   0    7    14    21    28  Days
```

---

## 📦 JSON Export Cron Job

**Priority:** HIGH  
**Status:** Not started

### Output Structure (Disjoint Sets)
```json
{
  "generatedAt": "2024-12-14T00:00:00Z",
  "totalProjects": 150,
  
  "trending": [
    // Top X globally by trending score
    // (excludes projects in other sets)
  ],
  
  "new": [
    // Top X newest (approved in last 7 days)
    // Sorted by approval date
  ],
  
  "byCategory": {
    "Productivity": [...],
    "Developer Tools": [...],
    "AI": [...],
    "Games": [...],
    // Top X per category by views
  },
  
  "divisionZero": [
    // All DZ projects, sorted by score
  ]
}
```

### Selection Logic (Disjoint Sets)
```
1. Select "new" first (approved <= 7 days)
2. Select "divisionZero" (is_division_zero = true) 
3. Select category top X from remaining
4. Select "trending" from remaining
5. Ensure no duplicates across sets
```

### Cron Job Flow
```
Every 6 hours (or manual trigger):

┌─────────────────────────────────────┐
│ Supabase Edge Function OR           │
│ Cloudflare Worker (Scheduled)       │
├─────────────────────────────────────┤
│ 1. Fetch all approved projects      │
│ 2. Calculate trending score for all │
│ 3. Build disjoint sets:             │
│    - new[]                          │
│    - divisionZero[]                 │
│    - byCategory{}                   │
│    - trending[] (remainder)         │
│ 4. Generate JSON (~100-150 items)   │
│ 5. Upload to Cloudflare R2          │
│    URL: cdn.divisionzero.dev/data/  │
│ 6. Log success                      │
└─────────────────────────────────────┘
```

### Manual Trigger
- Command: `!generate-json` in Discord
- Or API endpoint: `/api/trigger-export`
- For emergency removals/additions

---

## ☁️ Cloudflare Worker (Proxy + Unique Tracking)

**Priority:** MEDIUM  
**Status:** Not started

### Purpose
- Create proxy URLs: `projectname.divisionzero.dev`
- Track view counts
- Add click tracking

### Implementation
- [ ] Set up Cloudflare Worker
- [ ] Configure DNS for subdomain routing
- [ ] Worker reads slug from URL, looks up in Supabase
- [ ] Increments view count
- [ ] Redirects to original URL

---

## 📊 Analytics Dashboard

**Priority:** LOW  
**Status:** Not started

- [ ] View counts per project
- [ ] Click tracking
- [ ] Trending calculation
- [ ] Builder analytics page

---

## 🔄 Website Optimization (Bundle CSS/JS)

**Priority:** HIGH (before public launch)  
**Status:** Planned in _notes.md

See `schemas/_notes.md` for full optimization plan.

---

## 💳 Idea Submission Flow (Validation + Paid)

**Priority:** MEDIUM  
**Status:** Webhooks ready, bot needs updating

- [ ] Update bot to handle idea approval
- [ ] Connect idea form to webhooks
- [ ] Paid idea → Owner DM notification

---

## 🎠 Main Page Carousel Structure (FINALIZED)

**Priority:** HIGH  
**Status:** Design finalized

### Layout
```
┌────────────────────────────────────────────────┐
│ 🔥 Trending (Top 10)                     [→]   │
│ [card][card][card][card][card][card][card][card]│
├────────────────────────────────────────────────┤
│ ✨ New This Week (Top 10)                [→]   │
│ [card][card][card][card][card][card][card][card]│
├────────────────────────────────────────────────┤
│ 🔷 Division Zero Picks (8)               [→]   │
│ [card][card][card][card][card][card][card][card]│
├────────────────────────────────────────────────┤
│ 💼 Productivity (6)                      [→]   │
│ [card][card][card][card][card][card]           │
├────────────────────────────────────────────────┤
│ 🎮 Games (6)                             [→]   │
│ [card][card][card][card][card][card]           │
├────────────────────────────────────────────────┤
│ 🤖 AI Agents (6)                         [→]   │
│ [card][card][card][card][card][card]           │
├────────────────────────────────────────────────┤
│ 👑 All-Time Best (6)                     [→]   │
│ [card][card][card][card][card][card]           │
└────────────────────────────────────────────────┘
```

### JSON Structure
```json
{
  "generatedAt": "2024-12-14T00:00:00Z",
  "trending": [...],        // 10 projects
  "new": [...],             // 10 projects
  "divisionZero": [...],    // 8 projects
  "productivity": [...],    // 6 projects
  "games": [...],           // 6 projects  
  "aiAgents": [...],        // 6 projects
  "allTime": [...]          // 6 projects
}
// Total: ~52 projects
```

---

## 📊 Rolling View Columns (No Table Bloat)

**Priority:** HIGH  
**Status:** Not started

### Concept
Instead of a separate visits table, store rolling snapshots in the projects table itself.

### Database Columns
```sql
ALTER TABLE projects ADD COLUMN
    views_total      INTEGER DEFAULT 0,  -- All time (never resets)
    views_6h_slot1   INTEGER DEFAULT 0,  -- Last 0-6 hours
    views_6h_slot2   INTEGER DEFAULT 0,  -- Last 6-12 hours
    views_6h_slot3   INTEGER DEFAULT 0,  -- Last 12-18 hours
    views_6h_slot4   INTEGER DEFAULT 0,  -- Last 18-24 hours
    views_daily      INTEGER DEFAULT 0,  -- Sum of 4 slots
    views_3day       INTEGER DEFAULT 0,  -- Rolling 3-day
    views_weekly     INTEGER DEFAULT 0,  -- Rolling 7-day
    views_monthly    INTEGER DEFAULT 0;  -- Rolling 30-day
```

### Cron Job Logic (Every 6 Hours)
```sql
-- Shift slots left, calculate aggregates
UPDATE projects SET
    views_6h_slot4 = views_6h_slot3,
    views_6h_slot3 = views_6h_slot2,
    views_6h_slot2 = views_6h_slot1,
    views_6h_slot1 = 0,  -- Reset current slot
    views_daily = views_6h_slot1 + views_6h_slot2 + views_6h_slot3 + views_6h_slot4;
-- Weekly and monthly updated less frequently
```

### Benefits
- ✅ No separate table growth
- ✅ Fixed storage (just columns)
- ✅ Calculate velocity (rate of change)
- ✅ Detect spikes vs consistent traffic

---

## 📚 Projects Library Page (db.divisionzero.dev)

**Priority:** MEDIUM  
**Status:** Not started

### Concept
Full projects library with LIVE database connection, hosted separately.

### Features
- Every category as expandable carousels
- "View More" expands to show ALL projects in category
- Live Supabase connection (reads only)
- Search with filters
- Every project gets visibility

### Hosting
- Separate Vercel deployment
- Subdomain: `db.divisionzero.dev`
- Uses Supabase realtime/API directly
- Acceptable to use more edge requests here

### Difference from Main Page
| Main Page | Library Page |
|-----------|--------------|
| Static JSON | Live database |
| Top 52 curated | ALL projects |
| 6 hrs stale | Real-time |
| Low edge requests | More reads OK |

---

## 📖 Vocabulary/Dictionary Project

**Priority:** LOW  
**Status:** Planning

### Concept
AI/tech vocabulary dictionary for the community.

### Structure
- 500+ terms
- ~400 KB total
- Split files for bandwidth/edge request balance

### File Strategy
```
/data/vocab/
├── index.json         (20 KB) - All terms with short defs
├── a-e.json           (80 KB) - Full definitions A-E
├── f-l.json           (80 KB) - Full definitions F-L
├── m-r.json           (80 KB) - Full definitions M-R
├── s-z.json           (80 KB) - Full definitions S-Z
```

### Internal Mapping
- Search index with synonyms
- Related terms linking
- Category tagging (AI, Web Dev, Cloud, etc.)

### Hosting
- Separate Vercel deployment
- Subdomain: `vocab.divisionzero.dev` or similar
- Static files only (no database needed)

---

## 🛒 Prompt Marketplace

**Priority:** LOW  
**Status:** Concept only

### Concept
Marketplace for AI prompts, using Discord as backend (like projects).

### Flow Ideas
```
User submits prompt → Discord webhook
Moderator reviews → Approve/Reject
Approved → Added to marketplace JSON
Users can browse → Copy prompts
Future: Payment integration?
```

### Questions to Figure Out
- [ ] How to preview prompts without giving away full text?
- [ ] Pricing model? (Free first, paid later?)
- [ ] Categories for prompts
- [ ] Rating/voting system?
- [ ] Discord bot commands for prompt management

### No Design Yet
Focus on functionality first, design later.

---

## 🧮 The Ranking Algorithm (SQL Function)

**Priority:** HIGH  
**Status:** Not started

### Full PostgreSQL Function
```sql
CREATE OR REPLACE FUNCTION generate_curated_list()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    trending_list JSONB;
    new_list JSONB;
    dz_list JSONB;
    productivity_list JSONB;
    games_list JSONB;
    ai_list JSONB;
    alltime_list JSONB;
    used_ids UUID[];
BEGIN
    -- STEP 1: Calculate scores for ALL approved projects
    CREATE TEMP TABLE scored_projects AS
    SELECT 
        p.*,
        (
            -- Recent activity (high weight)
            COALESCE(p.views_6h_slot1, 0) * 5 +
            COALESCE(p.views_daily, 0) * 2 +
            COALESCE(p.views_weekly, 0) * 0.5 +
            
            -- Engagement signals
            COALESCE(p.saves, 0) * 10 +
            
            -- Manual boosts
            (CASE WHEN p.featured THEN 50 ELSE 0 END) +
            (CASE WHEN p.is_division_zero THEN 20 ELSE 0 END) +
            
            -- New project boost (decays over 14 days)
            GREATEST(0, 100 - EXTRACT(DAY FROM NOW() - p.approved_at) * 7)
        ) AS trending_score
    FROM projects p
    WHERE p.status = 'approved';

    -- STEP 2: Build disjoint sets
    
    -- 2a. New This Week (10)
    SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.approved_at DESC)
    INTO new_list
    FROM (
        SELECT * FROM scored_projects 
        WHERE approved_at > NOW() - INTERVAL '7 days'
        LIMIT 10
    ) s;
    used_ids := ARRAY(SELECT id FROM scored_projects WHERE approved_at > NOW() - INTERVAL '7 days' LIMIT 10);

    -- 2b. Division Zero (8)
    SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.trending_score DESC)
    INTO dz_list
    FROM (
        SELECT * FROM scored_projects 
        WHERE is_division_zero = true AND NOT (id = ANY(used_ids))
        LIMIT 8
    ) s;
    used_ids := used_ids || ARRAY(SELECT id FROM scored_projects WHERE is_division_zero = true AND NOT (id = ANY(used_ids)) LIMIT 8);

    -- 2c. Categories (6 each)
    SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.trending_score DESC)
    INTO productivity_list
    FROM (SELECT * FROM scored_projects WHERE category = 'Productivity' AND NOT (id = ANY(used_ids)) LIMIT 6) s;
    -- ... repeat for games, ai_agents ...

    -- 2d. Trending (10 from remainder)
    SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.trending_score DESC)
    INTO trending_list
    FROM (
        SELECT * FROM scored_projects 
        WHERE NOT (id = ANY(used_ids))
        ORDER BY trending_score DESC
        LIMIT 10
    ) s;

    -- 2e. All Time Best (6 by total views)
    SELECT jsonb_agg(to_jsonb(s.*) ORDER BY s.views_total DESC)
    INTO alltime_list
    FROM (SELECT * FROM scored_projects ORDER BY views_total DESC LIMIT 6) s;

    -- STEP 3: Build final JSON
    result := jsonb_build_object(
        'generatedAt', NOW(),
        'trending', COALESCE(trending_list, '[]'::jsonb),
        'new', COALESCE(new_list, '[]'::jsonb),
        'divisionZero', COALESCE(dz_list, '[]'::jsonb),
        'productivity', COALESCE(productivity_list, '[]'::jsonb),
        'games', COALESCE(games_list, '[]'::jsonb),
        'aiAgents', COALESCE(ai_list, '[]'::jsonb),
        'allTime', COALESCE(alltime_list, '[]'::jsonb)
    );

    DROP TABLE scored_projects;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### Usage
```sql
-- Generates full curated JSON in ~50ms!
SELECT generate_curated_list();
```

---

*Last updated: 2025-12-14T06:00*

