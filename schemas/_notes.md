# Division Zero - Notes

## 2024-12-11

### Logo Optimization (Future)
Our entire files is like 2.5 MB around and in that only logos are 2.14 MB. At some point we will make the logos that are SVG so those will be around very less as our logos are black and white. We should be ready to replace the present logos with the future optimized SVG logos.

---

### Bot Capacity & Supabase Direct Editing
So can this bot at its max potential survive like 100s of submissions and edits or daily or weekly updates I want to send? Yes! But if I want to make major changes I can just open the Supabase account and do that right - like all the edits, adding tags or anything that has to do with changing any data. I totally forgot that I can open Supabase! So if I need to remove or update the promoted status or anything like that I will just go to Supabase and edit the files directly. There will also be a cron job button so that I can directly push it to update instantly.

---

## 2024-12-12

### Future Subdomain Projects Queue

**Build Order:**
1. âœ… **divisionzero.dev** - Main hub (Vanilla JS, no framework)
2. ðŸ”² **db.divisionzero.dev** - Online projects database
3. ðŸ”² **dictionary.divisionzero.dev** - Full vocabulary/terms
4. ðŸ”² **sell.divisionzero.dev** - Prompt marketplace

---

### sell.divisionzero.dev - Marketplace Idea

**Concept:** PromptBase-style marketplace for AI prompts + freelance prompt creators

**Stack:** Next.js + Prisma (simpler than main site, needs rapid iteration)

**Payment:**
- Razorpay â†’ Indian users (INR)
- Stripe â†’ International users (USD)

**Differentiators:**
- India-first (removes payment friction for Indian creators)
- Not just prompts - freelance prompt creators as services
- Ties into Division Zero community

**MVP Features:**
- User auth (Google/email)
- Prompt upload + categories
- Razorpay/Stripe checkout
- Basic seller dashboard

---

## 2024-12-13

### Performance Optimization (TODO - Do at the end)

**Current Issues:**
- Each page loads 12-18 CSS files + 7-8 JS files = ~25-30 requests per page
- Tools page loads 21 external CDN icons = 21 extra requests
- Full site exploration = ~50 requests, ~350 KB

**Optimizations to implement later:**
1. Bundle all CSS into one file ? `styles.bundle.css`
2. Bundle all JS into one file ? `app.bundle.js`
3. Download tool icons locally instead of CDN
4. Add vercel.json with caching headers
5. Expected result: ~5 requests per page instead of 30

---

### Bot is REQUIRED (Not Optional!)

The Discord bot is MUST-HAVE for:
- !approve / !reject commands
- Auto-posting to #project-showcase
- DM notifications for paid leads
- Thread creation for ideas

Will be hosted on Railway.

---

### Deployment Status

| Component | Status | URL/Notes |
|-----------|--------|-----------|
| Website | ? Deployed | Vercel ? divisionzero.dev |
| Supabase | ?? Setting up | Account: divisionzero |
| Discord Bot | ?? Pending | Railway hosting |
| Cloudflare Worker | ?? Pending | For proxy URLs |

---

### Bot Setup Progress (Paused)

**Completed:**
- ? Bot folder created (`/bot`)
- ? package.json with dependencies
- ? index.js with full bot code
- ? .env.example template

**Paused at:**
- Need to set up Discord server as Community first
- Then create bot in Discord Developer Portal
- Then get channel IDs and configure .env

**Resume with:**
1. Get Bot Token from Discord Developer Portal
2. Get channel IDs for: project-approval, project-showcase, idea-approval
3. Create bot/.env with all credentials
4. Install dependencies: `cd bot && npm install`
5. Test locally: `npm run dev`
6. Deploy to Railway

---

### ?? EDGE REQUEST CRISIS - OPTIMIZATION PLAN

**Problem:** 3,000 edge requests in 5 min exploration (2 devices)
**Goal:** Reduce to 10-20 requests per page load

---

#### ?? CURRENT STATE (BEFORE OPTIMIZATION)

| Resource | Count | Size |
|----------|-------|------|
| CSS files | 26 | 140 KB |
| JS files | 20 | 121 KB |
| JSON data | 4 | 37 KB |
| External CDN icons | 52 | ~50 KB |
| **Per page load** | **~50 requests** | ~300 KB |

**Full site exploration:** ~250-500 requests
**With refreshes/2 devices:** 3,000+ requests ?

---

#### ?? OPTIMIZED STATE (AFTER BUNDLING)

| Resource | Count | Size |
|----------|-------|------|
| CSS (bundled) | 1 | 140 KB ? ~50 KB (minified) |
| JS (bundled) | 1 | 121 KB ? ~40 KB (minified) |
| JSON data | 4 | 37 KB |
| Icons (local SVGs) | 0 external | ~50 KB total |
| **Per page load** | **~8-10 requests** | ~150 KB |

---

#### ?? VERCEL FREE TIER MATH

| Limit | Current | Optimized |
|-------|---------|-----------|
| Edge Requests | 1M/month | 1M/month |
| Requests per visit | ~50 | ~10 |
| **Visits before limit** | **20,000** | **100,000** |
| Bandwidth | 100 GB | 100 GB |
| KB per visit | ~300 KB | ~150 KB |
| **Visits before limit** | **333,000** | **666,000** |

**5x improvement in edge requests!**

---

#### ??? OPTIMIZATION TASKS

**Phase 1: Bundle CSS/JS (80% reduction)**
- [ ] Install build tool (Vite or esbuild)
- [ ] Create `styles.bundle.css` (all CSS combined + minified)
- [ ] Create `app.bundle.js` (all JS combined + minified)
- [ ] Update HTML to load single bundle files
- [ ] Result: 26 CSS ? 1, 20 JS ? 1

**Phase 2: Localize Icons (52 ? 0 external)**
- [ ] Download all 52 CDN icons to `images/icons/`
- [ ] Update tools.json to use local paths
- [ ] Icons become part of single deployment, no CDN calls
- [ ] Result: 52 ? 0 external requests

**Phase 3: Caching Headers (repeat visits = 0 requests)**
- [ ] Add vercel.json with cache headers
- [ ] CSS/JS: cache 1 year (immutable)
- [ ] JSON: cache 1 hour
- [ ] HTML: no cache (always fresh)
- [ ] Result: Return visitors load almost nothing

**Phase 4: Optimize Images (future)**
- [ ] Convert logos to SVG (2MB ? 200KB)
- [ ] Use WebP format for raster images
- [ ] Lazy load below-fold images

---

#### ?? FINAL OPTIMIZED FILE STRUCTURE

```
divisionzero/
+-- index.html
+-- projects.html
+-- tools.html
+-- dictionary.html
+-- submit.html
+-- dist/
¦   +-- styles.bundle.css    ? All 26 CSS files
¦   +-- app.bundle.js        ? All 20 JS files
+-- images/
¦   +-- icons/               ? All 52 icons locally
+-- data/
¦   +-- projects.json
¦   +-- tools.json
¦   +-- dictionary.json
+-- vercel.json              ? Caching headers
```

---

#### ? WHEN TO DO THIS

- **Now:** Focus on features and functionality
- **Before public launch:** Run the optimization
- **Time needed:** ~2-3 hours for full optimization

---
