# Side Chat: Edge Request Optimization

_A casual discussion about reducing edge requests while preserving project structure_

---

## Your Question

How to reduce edge requests from ~50 per page to 10-20, using bundlers like esbuild or Vite, without breaking the current file structure.

---

## What Counts as an Edge Request?

**1 edge request = 1 file fetched from Vercel's servers**

| File Type | Current Count | Each = 1 Request? |
|-----------|---------------|-------------------|
| HTML | 5 | ✅ Yes |
| CSS files | 26 | ✅ Yes, each one |
| JS files | 20 | ✅ Yes, each one |
| JSON files | 4 | ✅ Yes, each one |
| Images | varies | ✅ Yes, each one |
| External CDN | 52 icons | ❌ No (different server) |

**So yes, each JSON file = 1 edge request.**

---

## How Bundlers Work

### Before Bundling (Current)
```
User visits page
    → index.html (1 request)
    → 15 CSS files (15 requests)
    → 10 JS files (10 requests)
    → 3 JSON files (3 requests)
    = 29 edge requests per page
```

### After Bundling
```
User visits page
    → index.html (1 request)
    → styles.bundle.css (1 request) ← All CSS combined!
    → app.bundle.js (1 request) ← All JS combined!
    → data.bundle.json (1 request) ← Optional
    = 4 edge requests per page 🎉
```

---

## Do You Need to Change File Structure?

**NO!** Your source files stay exactly the same:

```
YOUR DEV ENVIRONMENT (unchanged):
├── css/
│   ├── base.css
│   ├── buttons.css
│   └── ... (26 files)
├── js/
│   ├── utils.js
│   ├── config.js
│   └── ... (20 files)

WHAT GETS DEPLOYED (bundled):
├── dist/
│   ├── styles.bundle.css    ← All 26 CSS combined
│   └── app.bundle.js        ← All 20 JS combined
├── index.html               ← Points to bundle files
```

---

## Bundler Options

### Option 1: esbuild (Fastest, Simplest)
```bash
# Install
npm install esbuild

# Bundle CSS
npx esbuild css/*.css --bundle --outfile=dist/styles.bundle.css --minify

# Bundle JS
npx esbuild js/main.js --bundle --outfile=dist/app.bundle.js --minify
```

**Pros:** Lightning fast, no config needed
**Cons:** Less features than Vite

### Option 2: Vite (More Features)
```bash
# Install
npm create vite@latest

# Requires restructuring to Vite's project format
```

**Pros:** Hot reload, modern tooling
**Cons:** Requires restructuring your project

### Option 3: Manual Script (Simple)
```bash
# Just concatenate files (works for CSS)
cat css/*.css > dist/styles.bundle.css
```

**Pros:** No dependencies
**Cons:** No minification, no JS bundling

---

## My Recommendation for You

Use **esbuild** because:
1. ✅ No restructuring needed
2. ✅ Super fast
3. ✅ Simple one-liner commands
4. ✅ Works with your current setup

### Build Script
```json
// Add to package.json
{
  "scripts": {
    "build": "npm run build:css && npm run build:js",
    "build:css": "esbuild css/*.css --bundle --outfile=dist/styles.bundle.css --minify",
    "build:js": "esbuild js/main.js --bundle --outfile=dist/app.bundle.js --minify"
  }
}
```

Then before deploying:
```bash
npm run build
```

---

## What About JSON Files?

**Options:**
1. **Inline in HTML** - Embed small JSON as `<script>` tags
2. **Combine into one** - Merge all JSON into `data.bundle.json`
3. **Keep separate** - If total is 3-4 files, it's fine

For your 4 JSON files (37 KB total), keeping them separate is probably fine.

---

## Expected Result

| Current | After Bundling |
|---------|----------------|
| 26 CSS files | 1 CSS bundle |
| 20 JS files | 1 JS bundle |
| 4 JSON files | 4 JSON (keep) |
| 52 external icons | 0 (download locally) |
| **~50 requests** | **~8 requests** |

---

## When to Implement

Before public launch:
1. [ ] Install esbuild
2. [ ] Create build script
3. [ ] Update HTML to point to bundles
4. [ ] Download icons locally
5. [ ] Add caching headers
6. [ ] Deploy bundled version

---

_Ready to go back to main topic? Just say so!_
