# 🤖 AI Assistant Hints - Division Zero

> Secret decoder ring for future AI assistants working on this project.
> Read this FIRST before making any changes!

---

## ⚡ QUICK REFERENCE

### Key Files & Their Purposes

| File | Purpose | DO NOT |
|------|---------|--------|
| `data/projects.json` | Live project data | Delete without backup |
| `js/pods/project-card-v2.js` | Main project card | Use v3 (deprecated) |
| `js/pods/carousel.js` | Netflix-style carousel | Break the z-index |
| `schemas/` | Source of truth for data structure | Ignore when editing data |

---

## 🗺️ SCHEMA → DATA → CARD MAPPING

### Project Flow

```
schemas/project/project-schema.json   ← SOURCE OF TRUTH
              ↓
data/projects.json                    ← ACTUAL DATA
              ↓
js/pods/project-card-v2.js            ← RENDERS CARD
              ↓
js/pods/carousel.js                   ← PUTS IN CAROUSEL
```

### When Schema Changes:

1. Update `project-schema.json`
2. Update `data/projects.json` to match
3. Update `project-card-v2.js` to use new fields
4. Update `submit-project-form.js` to collect new fields
5. Update `submit.html` if form UI needs changes

---

## 📋 FIELD MAPPINGS

### Current Card Fields → Schema Fields

| Card Expects | Schema Has | Notes |
|--------------|------------|-------|
| `name` | `name` | ✅ Same |
| `description` | `description` | ✅ Same |
| `logo` | `logo` | ✅ Same |
| `vercelUrl` | `originalUrl` | 🔄 RENAME in card |
| `views` | `analytics.totalViews` | 🔄 NESTED in schema |
| `tags` | `tags` | ✅ Same |
| `tools` | `tools` | ✅ Same |
| `category` | `category` | ✅ Same |
| `github` | `githubRepo` | 🔄 RENAME in card |
| `discord` | `discordThread` | 🔄 RENAME in card |
| `builder` | `builder.name` | 🔄 NESTED in schema |
| `builderUrl` | `builder.profileUrl` | 🔄 NESTED in schema |
| `promoted` | `promoted` | ✅ Same |
| `isNew` | (calculate from dates) | 🆕 Calculate |
| N/A | `pricingModel` | 🆕 free/partial/paid |

---

## 🚀 SERVER COMMANDS

```powershell
# Kill server
.\kill-server.bat

# Launch with portable Node.js
$env:PATH = "c:\Users\Student\Desktop\node-portable\node-v20.18.1-win-x64;" + $env:PATH; npx serve -l 3000
```

---

## ⚠️ GOTCHAS & WARNINGS

### 1. Carousel Z-Index
The carousel nav zones MUST have `z-index: 1100` or higher.
Cards on hover go to `z-index: 1000`.
If nav zones aren't clickable, this is why!

### 2. Project Card Versions
- v1: Original with expandable dropdown (DEPRECATED)
- v2: Inline tools & stack, main version (USE THIS)
- v3: Tool-card styling experiment (DEPRECATED)

### 3. JSON Comments
Schema files use `"// SECTION": ""` pattern for comments.
This causes "duplicate key" lint warnings - IGNORE THEM.

### 4. Portable Node.js Location
`c:\Users\Student\Desktop\node-portable\node-v20.18.1-win-x64\`

### 5. The "No 7" Rule
In tool ratings, NEVER use 7 for difficulty or capability.
It's a Division Zero pun. Check `curated-tools.json`.

### 6. File Editing Process
**ORDER OF OPERATIONS when editing files:**
1. Try `replace_file_content` tool first (direct edit)
2. If fails with "target not found", try PowerShell regex replace
3. If fails with "file in use", run `.\kill-server.bat` then retry

**Common errors:**
- `"target content not found"` = Line endings mismatch (use PowerShell)
- `"file is being used"` = Server or editor has file open

---

## 📁 FOLDER STRUCTURE

```
divisionzero/
├── data/                    ← LIVE DATA
│   ├── projects.json        ← Main projects
│   ├── dictionary.json      ← Terms
│   ├── icons.json           ← Tool icons
│   └── tools.json           ← Tools page data
│
├── schemas/                 ← SOURCE OF TRUTH
│   ├── _todo.json           ← What's done/pending
│   ├── _notes.md            ← User notes
│   ├── _flows.md            ← System flow diagrams
│   ├── _ai-hints.md         ← THIS FILE
│   ├── project/             ← Project schemas
│   ├── term/                ← Dictionary schemas
│   ├── ideas/               ← Idea submission schemas
│   ├── tools/               ← Tool catalog schemas
│   └── bots/                ← Discord bot specs
│
├── js/pods/                 ← UI COMPONENTS
│   ├── project-card-v2.js   ← USE THIS ONE
│   ├── term-card.js
│   ├── tool-card.js
│   ├── carousel.js
│   ├── submit-project-form.js
│   └── submit-idea-form.js
│
└── css/                     ← STYLES
    ├── pods/                ← Component styles
    └── pages/               ← Page-specific styles
```

---

## 🔧 COMMON TASKS

### Add a new field to project cards:

1. Add to `schemas/project/project-schema.json` Section 1
2. Add default value in `project-card-v2.js` destructuring (line ~28)
3. Use the field in HTML template (line ~176)
4. Add to `submit.html` form
5. Update `submit-project-form.js` to collect it
6. Update sample data in `data/projects.json`

### Change carousel behavior:

1. CSS: `css/components/carousel.css`
2. JS: `js/pods/carousel.js`
3. Netflix-style nav zones are `.carousel-nav-zone`

### Update idea submission flow:

1. Validation flow: `schemas/ideas/validation-idea-schema.json`
2. Paid flow: `schemas/ideas/paid-idea-schema.json`
3. See `_flows.md` for visual diagrams

---

## 📝 USER PREFERENCES

Based on conversation history:

- Prefers MINIMAL over complex
- Loves Netflix-style UI patterns
- No 7 in ratings (Division Zero pun)
- Antigravity > Cursor for IDE ranking
- Supabase for DB, Google Sheets for ideas only
- Discord for moderation, considering bot-free approach
- Dark glassmorphism aesthetic
- SVG logos preferred (current PNGs are 2.14MB)

---

*Last updated: 2024-12-12*
