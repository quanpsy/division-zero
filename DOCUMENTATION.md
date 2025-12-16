# Division Zero - Complete System Documentation

**Last Updated:** December 16, 2024  
**Version:** 1.0.0  
**Live URL:** https://divisionzero.dev

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Directory Structure](#directory-structure)
4. [Frontend](#frontend)
5. [Backend Services](#backend-services)
6. [Discord Bot](#discord-bot)
7. [Cloudflare Workers](#cloudflare-workers)
8. [Supabase Database](#supabase-database)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)
11. [Environment Variables](#environment-variables)

---

## System Overview

Division Zero is a showcase platform for vibecoding projects. The system consists of:

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Vanilla JS + CSS | Static site hosted on Vercel |
| **Database** | Supabase (PostgreSQL) | Stores projects, views, analytics |
| **Discord Bot** | Node.js + Discord.js | Handles project approvals via reactions |
| **Sync Worker** | Cloudflare Workers | Syncs DB to KV for fast reads |
| **Proxy Worker** | Cloudflare Workers | View counting + URL redirects |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                   https://divisionzero.dev                  │
│                        (Vercel)                             │
└───────────────────────────┬─────────────────────────────────┘
                            │ Fetches /projects
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SYNC WORKER (KV API)                     │
│            divisionzero-sync.rndmprsn77.workers.dev         │
│                                                             │
│  GET /projects → Returns cached JSON from KV                │
│  GET /sync     → Triggers full Supabase sync                │
│  CRON: Every 6h → Rotates view slots + trending calc        │
└───────────────────────────┬─────────────────────────────────┘
                            │ Syncs every 1 hour
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                             │
│               sdylzvdnvyhcvgmxhxza.supabase.co              │
│                                                             │
│  projects table: All project data                           │
│  RPC functions: increment_project_view(), rotate_slots()    │
└───────────────────────────▲─────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
        ▼                                       ▼
┌───────────────────────┐           ┌───────────────────────┐
│     DISCORD BOT       │           │    PROXY WORKER       │
│   (Local Node.js)     │           │  *.divisionzero.dev   │
│                       │           │                       │
│ - Watch webhooks      │           │ - Redirects to URL    │
│ - Add approval btns   │           │ - Counts views        │
│ - Insert to Supabase  │           │ - 404 page            │
│ - Create threads      │           │                       │
└───────────────────────┘           └───────────────────────┘
```

---

## Directory Structure

```
divisionzero/
├── assets/                 # Images, logos, fonts
├── bot/                    # Discord bot (Node.js)
│   ├── index.js           # Main bot code
│   ├── .env               # Bot environment variables
│   └── package.json       # Bot dependencies
├── css/                    # Stylesheets
│   ├── base/              # Variables, reset
│   ├── components/        # Buttons, cards, forms
│   └── pods/              # Project cards, carousels
├── data/                   # Static JSON data
│   ├── dictionary.json    # Vocabulary terms
│   └── tools.json         # Tool definitions
├── dist/                   # Production build (deployed)
├── js/                     # JavaScript source
│   ├── app.js             # Main entry
│   ├── config.js          # Site configuration
│   ├── components/        # Footer, navbar
│   ├── pods/              # Project cards, forms
│   └── utils/             # Helpers
├── schemas/                # Database schemas
│   └── supabase/          # SQL files to run
├── worker/                 # Cloudflare Sync Worker
│   ├── index.js           # Worker code
│   └── wrangler.toml      # Worker config
├── vercel.json            # Vercel caching config
├── package.json           # Frontend dependencies
└── esbuild.config.js      # Build script
```

---

## Frontend

### Tech Stack
- **HTML5** - Pages
- **CSS3** - Styling (no frameworks)
- **Vanilla JavaScript** - Logic
- **ESBuild** - Bundling

### Build Commands
```bash
npm run build    # Production build → dist/
npm run dev      # Development (if configured)
```

### Key Files

| File | Purpose |
|------|---------|
| `js/config.js` | All site settings (URLs, colors, nav) |
| `js/app.js` | Main initialization |
| `js/discord-webhooks.js` | Form submission to Discord |
| `js/pods/project-card-v2.js` | Project card component |
| `js/pods/submit-project-form.js` | Project form handling |
| `js/pods/submit-idea-form.js` | Idea form handling |

### Caching (vercel.json)

| Resource | Cache Duration |
|----------|----------------|
| `/assets/*` | 1 year (immutable) |
| `*.css`, `*.js` | 1 year (immutable) |
| `/index.html`, `/tools.html`, `/dictionary.html` | 15 days |
| Other `*.html` | 5 minutes |
| `/data/*` | 1 hour |
| `/sw.js` | No cache (must-revalidate) |

---

## Backend Services

### Webhook Flow

```
User submits form (website)
       ↓
Discord Webhook receives embed
       ↓
Bot adds approval buttons
       ↓
Mod clicks Approve ✅
       ↓
Bot inserts to Supabase
       ↓
Bot creates discussion thread
       ↓
Worker syncs to KV (next hour)
       ↓
Project appears on website
```

### Discord Webhooks

| Webhook | Purpose |
|---------|---------|
| `PROJECT_APPROVAL` | New project submissions |
| `IDEA_VALIDATION` | Validation ideas (free) |
| `PAID_IDEA` | Client/paid ideas |
| `REPORT` | Bug reports |

---

## Discord Bot

### Location
```
divisionzero/bot/
```

### Running the Bot
```bash
cd bot
npm install
node index.js
```

### Commands

| Command | Description |
|---------|-------------|
| `!help` | Show all commands |
| `!pending` | List pending projects |
| `!fetch <slug>` | Get project details |
| `!sync` | Trigger Cloudflare sync |
| `!stats` | Bot statistics |

### Button Actions

| Button | Action |
|--------|--------|
| ✅ Approve | Insert to DB + create thread |
| ❌ Reject | Mark rejected with reason |
| 🏆 DZ | Toggle Division Zero badge |
| ⭐ Editor | Toggle Editor's Pick |
| 💰 Promote | Toggle promoted status |

### Environment Variables (bot/.env)

```env
# Discord
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=bot_client_id
DISCORD_GUILD_ID=server_id
OWNER_DISCORD_ID=owner_user_id

# Channels
CHANNEL_PROJECT_APPROVAL=channel_id
CHANNEL_IDEA_APPROVAL=channel_id
CHANNEL_IDEAS_FORUM=forum_channel_id

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=service_role_key

# Worker
WORKER_URL=https://divisionzero-sync.xxx.workers.dev
WORKER_SYNC_SECRET=secret_key
```

---

## Cloudflare Workers

### 1. Sync Worker (divisionzero-sync)

**Purpose:** Syncs Supabase → KV for fast reads

**Endpoints:**
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` or `/projects` | GET | None | Returns all projects JSON |
| `/sync` | GET | Secret key | Triggers manual sync |

**Cron Schedule:** Every 6 hours

**KV Key:** `projects:current`

**Location:** `worker/index.js`

### 2. Proxy Worker

**Purpose:** View counting + redirects

**How it works:**
1. User visits `slug.divisionzero.dev`
2. Worker looks up project by slug
3. Increments view count in Supabase
4. Redirects to actual project URL

**Deploy via:** Cloudflare Dashboard (separate from sync worker)

---

## Supabase Database

### Tables

| Table | Purpose |
|-------|---------|
| `projects` | All project data |

### Key Columns (projects)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Project name |
| `slug` | TEXT | URL-safe identifier |
| `original_url` | TEXT | Proxy URL for frontend |
| `proxy_url` | TEXT | Actual project URL |
| `status` | TEXT | pending/approved/rejected |
| `views` | INT | Total view count |
| `views_total` | INT | All-time views |
| `views_6h_slot1-4` | INT | Rolling view slots |
| `is_division_zero` | BOOL | Featured badge |
| `featured` | BOOL | Editor's pick |
| `is_promoted` | BOOL | Promoted carousel |
| `secret_key` | TEXT | Owner verification key |

### RPC Functions

| Function | Purpose |
|----------|---------|
| `increment_project_view(uuid)` | +1 view count |
| `rotate_view_slots()` | Rotate 6h slots (cron) |

### Run SQL Files

Execute in order in Supabase SQL Editor:
1. `schemas/supabase/projects-table.sql`
2. `schemas/supabase/add-new-columns.sql`
3. `schemas/supabase/ranking-columns.sql`
4. `schemas/supabase/view-tracking-functions.sql`

---

## Deployment Guide

### Frontend (Vercel)

1. Push to GitHub
2. Vercel auto-deploys from `main` branch
3. Build command: `npm run build`
4. Output directory: `dist`

### Discord Bot

1. Run on local machine or VPS
2. Keep it running 24/7 (use pm2 or systemd)
3. Never run multiple instances!

```bash
# Install pm2 globally
npm install -g pm2

# Start bot with pm2
pm2 start bot/index.js --name "division-zero-bot"

# Make it persist across reboots
pm2 save
pm2 startup
```

### Cloudflare Workers

**Sync Worker:**
1. Cloudflare Dashboard → Workers
2. Create worker: `divisionzero-sync`
3. Copy `worker/index.js` content
4. Add environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
5. Bind KV namespace: `PROJECTS_KV`
6. Set cron trigger: `0 */6 * * *`

**Proxy Worker:**
1. Create separate worker for subdomains
2. Add wildcard route: `*.divisionzero.dev/*`

---

## Troubleshooting

### Bot Not Responding

1. Check if node process is running
2. Check `.env` variables are set
3. Verify bot is in correct server
4. Check channel permissions

### Views Not Incrementing

1. Verify RPC function exists: `increment_project_view`
2. Check Proxy Worker is deployed
3. Check Supabase anon key permissions

### Projects Not Appearing

1. Run `!sync` in Discord
2. Check Supabase has approved projects
3. Verify Worker KV binding

### Multiple Bot Responses

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start only ONE instance
node bot/index.js
```

### Form Showing "Demo Mode"

- `submitIdeaToDiscord` function not found
- Check JS bundling includes `discord-webhooks.js`

---

## Environment Variables

### Frontend (.env)
```env
# Not used (webhooks are in JS config)
```

### Bot (bot/.env)
```env
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
OWNER_DISCORD_ID=
CHANNEL_PROJECT_APPROVAL=
CHANNEL_IDEA_APPROVAL=
CHANNEL_IDEAS_FORUM=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
WORKER_URL=
WORKER_SYNC_SECRET=
```

### Cloudflare Worker
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SYNC_SECRET=your_secret
```

---

## Quick Reference

### Start Development
```bash
cd divisionzero
npm run build
npx serve dist -p 3000
# Open http://localhost:3000
```

### Start Bot
```bash
cd divisionzero/bot
node index.js
```

### Push to Production
```bash
git add -A
git commit -m "your message"
git push origin main
# Vercel auto-deploys
```

### Manual KV Sync
```
Discord: !sync
URL: https://divisionzero-sync.xxx.workers.dev/sync?key=SECRET
```

---

## Final System Health Check ✅

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend** | ✅ | Aggressive caching, minified assets |
| **Vercel** | ✅ | Auto-deploy from GitHub |
| **Supabase** | ✅ | RLS enabled, functions ready |
| **Discord Bot** | ✅ | Error handling, startup scan |
| **Sync Worker** | ✅ | CORS, deduplication, error handling |
| **Proxy Worker** | ✅ | View counting, 404 page |
| **Webhooks** | ✅ | Routing by purpose |

---

**Built with ❤️ by the Division Zero team**
