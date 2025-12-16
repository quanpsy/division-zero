# 🚀 Division Zero - Production Verification Checklist

> **Purpose:** Complete this checklist to ensure the website is production-ready.  
> **Last Updated:** 2025-12-16  
> Mark items with `[x]` when verified, `[!]` for issues found.

---

## 📋 SECTION 1: DOMAIN & HOSTING

### 1.1 Domain Configuration
- [ ] `divisionzero.dev` resolves correctly
- [ ] SSL certificate is active (HTTPS works)
- [ ] `www.divisionzero.dev` redirects to main domain (or vice versa)
- [ ] No mixed content warnings in browser

### 1.2 Vercel Deployment
- [ ] Vercel project is connected to GitHub repo
- [ ] Auto-deploy on push is working
- [ ] Build completes without errors
- [ ] All pages load without 404 errors

### 1.3 Cloudflare DNS
- [ ] Nameservers configured correctly (rosa.ns, tate.ns)
- [ ] Root domain A record points to Vercel
- [ ] Wildcard `*` record exists for slug proxy worker
- [ ] No conflicting DNS records

---

## 📱 SECTION 2: FRONTEND PAGES

### 2.1 Home Page (index.html)
- [ ] Page loads without errors
- [ ] Hero section displays correctly
- [ ] Logo/branding displays (check both SVG logos)
- [ ] Navigation works (all links functional)
- [ ] Footer displays correctly
- [ ] "Featured Projects" carousel loads (if any)
- [ ] Stats section displays
- [ ] Mobile responsive (test on phone)
- [ ] No console errors

### 2.2 Projects Page (projects.html)
- [ ] Page loads without errors
- [ ] Projects load from Cloudflare Worker API
- [ ] All carousels display:
  - [ ] Promoted
  - [ ] Trending
  - [ ] Editor's Pick
  - [ ] Division Zero
  - [ ] All-Time Best
  - [ ] Category carousels (Productivity, Games, etc.)
- [ ] Project cards display correctly:
  - [ ] Logo image loads
  - [ ] Name, description visible
  - [ ] Tools and tags show
  - [ ] Views count displays
  - [ ] Builder name shows
  - [ ] Pricing badge (FREE/FREEMIUM/PAID)
- [ ] **Bookmark button** works (turns pink, saves to localStorage)
- [ ] **Share button** works (copies proxy URL to clipboard)
- [ ] **Saved carousel** appears at bottom after bookmarking
- [ ] **Visit link** uses proxy URL (slug.divisionzero.dev)
- [ ] **Discord link** opens correct thread
- [ ] **GitHub link** opens repo (if available)
- [ ] Long-press reporting works (1.5s hold → report sent)
- [ ] Mobile responsive
- [ ] Console shows: `📌 Saved project IDs:` debug log

### 2.3 Tools Page (tools.html)
- [ ] Page loads without errors
- [ ] Tool categories display:
  - [ ] AI Chatbots
  - [ ] Code Editors
  - [ ] Design Tools
  - [ ] Deployment
  - [ ] Databases
  - [ ] Authentication
- [ ] Tool cards show:
  - [ ] Icon loads (external CDN)
  - [ ] Name and description
  - [ ] Difficulty rating
  - [ ] Capability rating
  - [ ] Free tier indicator
  - [ ] Website link works
- [ ] Mobile responsive

### 2.4 Dictionary Page (dictionary.html)
- [ ] Page loads without errors
- [ ] Terms load from JSON
- [ ] Alphabet navigation works
- [ ] Search functionality works
- [ ] Term cards display correctly
- [ ] Mobile responsive

### 2.5 Submit Page (submit.html)
- [ ] Page loads without errors
- [ ] **Project Submission Form:**
  - [ ] All fields present (name, URL, category, etc.)
  - [ ] Form validation works
  - [ ] Submit sends to Discord webhook
  - [ ] Success message shows secret key
  - [ ] Secret key is 12 characters
- [ ] **Idea Submission Form:**
  - [ ] Free idea form works
  - [ ] Paid lead form works
  - [ ] Sends to correct webhook
- [ ] Mobile responsive

---

## 🌐 SECTION 3: CLOUDFLARE SYNC WORKER

### 3.1 Worker Deployment
- [ ] Worker deployed at: `divisionzero-sync.rndmprsn77.workers.dev`
- [ ] Secrets configured:
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY
  - [ ] SYNC_SECRET

### 3.2 Worker Endpoints
- [ ] `/projects` returns JSON with all carousel data
- [ ] `/status` returns sync status and counts
- [ ] `/sync?key=SECRET` triggers manual sync
- [ ] `/previous` returns backup data

### 3.3 Cron Job
- [ ] Cron trigger configured: `0 * * * *` (every hour)
- [ ] Cron is running (check worker logs)
- [ ] KV namespace `PROJECTS_KV` is bound
- [ ] Data updates in KV after cron runs

### 3.4 Data Output
- [ ] JSON includes all required fields:
  - [ ] `promoted` array
  - [ ] `trending` array
  - [ ] `editorsPick` array
  - [ ] `divisionZero` array
  - [ ] `allTime` array
  - [ ] `categories` object with all 5 categories
  - [ ] `lastUpdated` timestamp
  - [ ] `totalProjects` count
- [ ] Each project has:
  - [ ] `id`, `name`, `description`
  - [ ] `slug`, `proxyUrl`
  - [ ] `originalUrl`
  - [ ] `logo`
  - [ ] `tools`, `tags`
  - [ ] `category`
  - [ ] `views`, `clicks`, `saves`
  - [ ] `builder` object
  - [ ] `discordThread`

---

## 🤖 SECTION 4: DISCORD BOT

### 4.1 Bot Status
- [ ] Bot is running (Railway or local)
- [ ] Bot is online in Discord server
- [ ] Bot has correct permissions

### 4.2 Environment Variables (bot/.env)
- [ ] DISCORD_TOKEN set
- [ ] DISCORD_CLIENT_ID set
- [ ] DISCORD_GUILD_ID set
- [ ] CHANNEL_PROJECT_APPROVAL set
- [ ] CHANNEL_PROJECT_SHOWCASE set
- [ ] CHANNEL_IDEA_APPROVAL set
- [ ] CHANNEL_IDEAS_FORUM set
- [ ] CHANNEL_PAID_IDEAS set
- [ ] CHANNEL_BOT_COMMANDS set
- [ ] CHANNEL_MOD_LOGS set
- [ ] CHANNEL_REPORT set
- [ ] SUPABASE_URL set
- [ ] SUPABASE_SERVICE_KEY set
- [ ] WORKER_URL set
- [ ] WORKER_SYNC_SECRET set

### 4.3 Project Approval Flow
- [ ] Website submission → appears in #project-approval
- [ ] Bot adds approval buttons (Approve, Reject, Verify, Featured, DZ)
- [ ] Clicking Verify enables Approve button
- [ ] Approve creates project in Supabase with:
  - [ ] Unique slug with random suffix
  - [ ] `proxy_url` generated
  - [ ] `secret_key` saved
  - [ ] `status: approved`
- [ ] Creates thread in #project-showcase with proxy URL link
- [ ] Reject removes from pending

### 4.4 Report Handling
- [ ] Reports appear in #reports channel
- [ ] Bot adds Hold/Dismiss buttons
- [ ] Actions logged correctly

### 4.5 Bot Commands
- [ ] `!help` shows command list
- [ ] `!sync` triggers worker sync
- [ ] `!fetch <secret_key>` retrieves project info
- [ ] Commands work in #bot-commands channel

---

## 🗄️ SECTION 5: SUPABASE DATABASE

### 5.1 Projects Table
- [ ] Table `projects` exists
- [ ] Required columns present:
  - [ ] id (UUID)
  - [ ] name, description, tagline
  - [ ] category
  - [ ] original_url, proxy_url, slug
  - [ ] logo
  - [ ] tools (array), tags (array)
  - [ ] pricing_model
  - [ ] status (pending/approved/rejected)
  - [ ] builder_name, builder_discord, builder_email
  - [ ] featured, featured_rank
  - [ ] is_promoted, promoted_order
  - [ ] is_division_zero
  - [ ] trending_rank, trending_score
  - [ ] views, views_total, clicks, saves
  - [ ] views_6h_slot1-4, views_3day
  - [ ] secret_key
  - [ ] discord_thread, discord_message_id
  - [ ] approved_at, approved_by
  - [ ] created_at, updated_at

### 5.2 RPC Functions
- [ ] `increment_project_view(project_id UUID)` exists
- [ ] `increment_project_click(project_id UUID)` exists
- [ ] `increment_project_save(project_id UUID)` exists
- [ ] `rotate_view_slots()` exists

### 5.3 Row Level Security (RLS)
- [ ] RLS enabled on projects table
- [ ] Public can read approved projects
- [ ] Only service role can write

---

## 🔗 SECTION 6: SLUG PROXY WORKER

### 6.1 Worker Status
- [ ] Proxy worker deployed (separate from sync worker)
- [ ] Worker route configured: `*.divisionzero.dev/*`

### 6.2 Functionality
- [ ] Visit `slug.divisionzero.dev` → redirects to actual project URL
- [ ] View count incremented in Supabase
- [ ] Slug lookup works for existing projects
- [ ] 404 for non-existent slugs

---

## 📦 SECTION 7: PWA & CACHING

### 7.1 PWA Manifest
- [ ] `manifest.json` present in dist/
- [ ] Icons configured:
  - [ ] 192x192 PNG exists
  - [ ] 512x512 PNG exists
- [ ] "Add to Home Screen" prompt works on mobile

### 7.2 Service Worker
- [ ] `sw.js` present in dist/
- [ ] Service worker registers successfully
- [ ] Caches static assets
- [ ] Offline fallback works (basic functionality)

### 7.3 Vercel Caching Headers (vercel.json)
- [ ] Home, Tools, Dictionary: 15 days cache
- [ ] Projects, Submit: 5 minutes cache
- [ ] CSS/JS/Assets: 1 year cache
- [ ] Data JSON: 1 hour cache
- [ ] Service worker: no cache (always fresh)

---

## 🎨 SECTION 8: UI/UX VERIFICATION

### 8.1 Visual Consistency
- [ ] Brand colors consistent (#8b5cf6 purple)
- [ ] Fonts loading correctly
- [ ] Icons displaying
- [ ] Dark theme consistent

### 8.2 Responsive Design
- [ ] Desktop (1920px) - all layouts correct
- [ ] Tablet (768px) - navigation works
- [ ] Mobile (375px) - all content readable
- [ ] Touch interactions work on mobile

### 8.3 Accessibility
- [ ] All images have alt text
- [ ] Links have descriptive text
- [ ] Contrast ratios acceptable
- [ ] Keyboard navigation works

---

## 🔐 SECTION 9: SECURITY

### 9.1 Secrets & Keys
- [ ] No API keys in frontend code (check app.min.js)
- [ ] Webhook URLs are public-facing (OK for Discord)
- [ ] Service role key only in server-side code
- [ ] SYNC_SECRET not exposed in frontend

### 9.2 CORS
- [ ] Worker has appropriate CORS headers
- [ ] No CORS errors in console

### 9.3 Input Validation
- [ ] Form inputs are validated
- [ ] No XSS vulnerabilities (HTML escaped)

---

## 📊 SECTION 10: ANALYTICS & MONITORING

### 10.1 View Tracking
- [ ] Views increment when visiting via proxy URL
- [ ] Trending score calculates correctly

### 10.2 Error Monitoring
- [ ] No uncaught errors in console
- [ ] Worker logs show successful operations

---

## 🚨 ISSUES FOUND

Use this section to note any issues discovered during verification:

| # | Page/Feature | Issue Description | Priority | Status |
|---|--------------|-------------------|----------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## ✅ SIGN-OFF

- [ ] All critical items verified
- [ ] All high-priority issues resolved
- [ ] Website is production-ready

**Verified By:** _________________  
**Date:** _________________

---

*This checklist was generated based on the Division Zero codebase structure and features.*
