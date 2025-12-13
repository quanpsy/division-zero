# Division Zero - System Flows

> Complete flowcharts of how everything works.  
> Last updated: 2024-12-11

---

## 📑 Table of Contents

1. [Project Submission Flow](#1-project-submission-flow)
2. [Validation Idea Flow](#2-validation-idea-flow)
3. [Paid Idea Flow](#3-paid-idea-flow)
4. [Project Management (Bot-Assisted)](#4-project-management-bot-assisted)
5. [Phase 2: Bot-Free Architecture](#5-phase-2-bot-free-architecture)

---

## 1. Project Submission Flow

### Phase 1: With Bot

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PROJECT SUBMISSION FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   WEBSITE    │
    │  Submit Form │
    └──────┬───────┘
           │
           │ User fills: name, description, URL, logo, tools, tags
           ▼
    ┌──────────────┐
    │   WEBHOOK    │───────────────────────────────────┐
    │   Trigger    │                                   │
    └──────┬───────┘                                   │
           │                                           │
           ▼                                           ▼
    ┌──────────────┐                           ┌──────────────┐
    │  DISCORD BOT │                           │   SUPABASE   │
    │  Receives    │                           │  projects    │
    └──────┬───────┘                           │  (pending)   │
           │                                   └──────────────┘
           │
           ▼
    ┌──────────────────────────────┐
    │      #project-approval       │
    │   (Private Mod Channel)      │
    │                              │
    │  📦 New Project Submitted!   │
    │  Name: TaskFlow Pro          │
    │  By: @vibecoder1             │
    │  URL: taskflow.app           │
    │                              │
    │  React: ✅ Approve  ❌ Reject │
    └──────────────┬───────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │   ✅    │        │   ❌    │
    │ APPROVE │         │ REJECT  │
    └────┬────┘         └────┬────┘
         │                   │
         ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │   SUPABASE   │    │   SUPABASE   │
    │ status:      │    │ status:      │
    │ "approved"   │    │ "rejected"   │
    │              │    │              │
    │ + Generate:  │    │ + Reason     │
    │  - slug      │    └──────────────┘
    │  - proxyUrl  │
    │  - dates     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────┐
    │      #project-showcase       │
    │   (Public Channel)           │
    │                              │
    │  🎉 New Project Added!       │
    │  [Embed with details]        │
    └──────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │  CRON JOB    │
    │  (Every 6h)  │
    │              │
    │  Export JSON │
    │  to Website  │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │   WEBSITE    │
    │  Shows new   │
    │   project!   │
    └──────────────┘
```

---

## 2. Validation Idea Flow

### For Free Community Feedback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      VALIDATION IDEA SUBMISSION                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   WEBSITE    │
    │  "Validate   │
    │   My Idea"   │
    └──────┬───────┘
           │
           │ User fills: name, email, discord (optional), 
           │             title, description, doc link, category
           ▼
    ┌──────────────┐
    │   WEBHOOK    │──────────────────────────────────┐
    │  (Validation)│                                  │
    └──────┬───────┘                                  │
           │                                          │
           ▼                                          ▼
    ┌──────────────┐                          ┌──────────────┐
    │  DISCORD BOT │                          │ GOOGLE SHEET │
    │              │                          │ (All Ideas)  │
    └──────┬───────┘                          │ Row added    │
           │                                  └──────────────┘
           ▼
    ┌──────────────────────────────┐
    │     #idea-approval           │
    │  (20 Moderators Channel)     │
    │                              │
    │  💡 New Idea for Validation  │
    │  Title: AI Resume Builder    │
    │  By: rahul@email.com         │
    │  Doc: [Link]                 │
    │                              │
    │  React: ✅ Approve  ❌ Spam   │
    │                              │
    │  ⚠️ Reject only if:          │
    │    - Copied/Plagiarized      │
    │    - 18+ Content             │
    └──────────────┬───────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
    ┌─────────┐         ┌─────────┐
    │   ✅    │         │   ❌    │
    │ APPROVE │         │  SPAM   │
    └────┬────┘         └────┬────┘
         │                   │
         ▼                   ▼
    ┌──────────────┐    ┌──────────────┐
    │ CREATE THREAD│    │   Log as     │
    │ in #ideas    │    │   rejected   │
    └──────┬───────┘    └──────────────┘
           │
           ▼
    ┌──────────────────────────────┐
    │   THREAD: AI Resume Builder  │
    │                              │
    │  📋 Idea Details             │
    │  [Full description]          │
    │  [Doc Link]                  │
    │                              │
    │  Community discusses...      │
    │  @user1: "This is doable!"   │
    │  @user2: "Try using..."      │
    └──────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │  IF Discord  │
    │  ID provided │
    │              │
    │  Add user to │
    │  the thread  │
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │ GOOGLE SHEET │
    │  Update row: │
    │  - Thread ↗️  │
    │  - Status ✅ │
    └──────────────┘
```

---

## 3. Paid Idea Flow

### Client Wants to Pay for Build

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAID IDEA SUBMISSION                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   WEBSITE    │
    │  "Get it     │
    │   Built"     │
    └──────┬───────┘
           │
           │ Client fills: name, email, discord (optional), 
           │               title, description, doc link, 
           │               category, budget, timeline
           ▼
    ┌──────────────┐
    │   WEBHOOK    │
    │    (Paid)    │
    └──────┬───────┘
           │
           ├────────────────────────────────────────┐
           │                                        │
           ▼                                        ▼
    ┌──────────────┐                        ┌──────────────┐
    │  DISCORD BOT │                        │ GOOGLE SHEET │
    │              │                        │ (Paid Leads) │
    └──────┬───────┘                        │ Row added    │
           │                                └──────────────┘
           ▼
    ┌──────────────────────────────┐
    │      DM TO OWNER (You)       │
    │                              │
    │  💰 New Paid Lead!           │
    │                              │
    │  Client: Sarah Mitchell      │
    │  Email: sarah@startup.io     │
    │  Budget: $1000-5000          │
    │  Timeline: 1 month           │
    │                              │
    │  Idea: SaaS Dashboard        │
    │  Doc: [Link]                 │
    │                              │
    └──────────────────────────────┘
           │
           │  (REST IS MANUAL)
           ▼
    ┌──────────────┐
    │     YOU      │
    │              │
    │ 1. Email     │
    │    client    │
    │              │
    │ 2. Validate  │
    │    & Discuss │
    │              │
    │ 3. Negotiate │
    │    price     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────┐
    │  SHARE IN BUILDER GROUPS     │
    │  (Private Discord Channels)  │
    │                              │
    │  🔨 Paid Project Available   │
    │  Budget: $2500               │
    │  Details: [Link]             │
    │                              │
    │  React if interested!        │
    └──────────────────────────────┘
           │
           ▼
    ┌──────────────┐
    │   BUILDER    │
    │   CLAIMS     │
    │              │
    │ You assign   │
    │ in Sheet     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────────────┐
    │      PAYMENT FLOW            │
    │                              │
    │  Client pays ──► Platform    │
    │                     │        │
    │  Builder builds ◄───┘        │
    │         │                    │
    │         ▼                    │
    │  Client confirms ✅          │
    │         │                    │
    │         ▼                    │
    │  ┌─────────────────────┐     │
    │  │  Builder: 85%       │     │
    │  │  Platform: 15%      │     │
    │  └─────────────────────┘     │
    └──────────────────────────────┘
```

---

## 4. Project Management (Bot-Assisted)

### Quick Commands + Supabase Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROJECT MANAGEMENT WORKFLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────────────────────┐
                        │           TWO PATHS                  │
                        └──────────────────┬──────────────────┘
                                           │
                     ┌─────────────────────┴─────────────────────┐
                     │                                           │
                     ▼                                           ▼
    ┌────────────────────────────┐          ┌────────────────────────────┐
    │      QUICK ACTIONS         │          │      MAJOR EDITS           │
    │      (Discord Bot)         │          │      (Supabase Dashboard)  │
    └────────────────────────────┘          └────────────────────────────┘
                     │                                           │
                     │                                           │
    ┌────────────────┴────────────────┐     ┌────────────────────┴────────────────┐
    │                                 │     │                                      │
    │  !approve proj_123              │     │  📊 Table: projects                  │
    │  !reject proj_123 "spam"        │     │                                      │
    │  !feature proj_123              │     │  ┌──────┬───────────┬─────────┐     │
    │  !dz proj_123                   │     │  │ Name │ Featured  │ Status  │     │
    │                                 │     │  ├──────┼───────────┼─────────┤     │
    │  ↓                              │     │  │ App1 │ ☑ true    │ active  │     │
    │                                 │     │  │ App2 │ ☐ false   │ active  │     │
    │  Bot updates Supabase           │     │  └──────┴───────────┴─────────┘     │
    │                                 │     │                                      │
    │  Best for:                      │     │  Click to edit any field!           │
    │  - Quick approvals              │     │                                      │
    │  - Mobile/on-the-go             │     │  Best for:                          │
    │                                 │     │  - Bulk edits                        │
    └─────────────────────────────────┘     │  - Adding tags                       │
                                            │  - Changing descriptions             │
                                            │  - Viewing all data                  │
                                            └──────────────────────────────────────┘
                     │                                           │
                     │                                           │
                     └─────────────────────┬─────────────────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │      REBUILD           │
                              │                        │
                              │  Option 1: Cron Job    │
                              │  (Auto every 6 hours)  │
                              │                        │
                              │  Option 2: Manual      │
                              │  (Click button in      │
                              │   Supabase dashboard)  │
                              └────────────┬───────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │      WEBSITE           │
                              │                        │
                              │  Fetches fresh data    │
                              │  Shows updated         │
                              │  projects!             │
                              └────────────────────────┘
```

---

## 5. Phase 2: Bot-Free Architecture

### 🚫 NO DISCORD BOT VERSION

> Simpler, cheaper, more robust. Trade-off: slightly more manual work.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PHASE 2: BOT-FREE ARCHITECTURE                            │
└─────────────────────────────────────────────────────────────────────────────┘


                    ┌─────────────────────────────────────────┐
                    │              THE IDEA                    │
                    │                                          │
                    │  Instead of bot processing webhooks,     │
                    │  we use:                                 │
                    │                                          │
                    │  ✅ Supabase directly                    │
                    │  ✅ Google Apps Script                   │
                    │  ✅ Discord Webhooks (not a bot!)        │
                    │  ✅ Supabase Edge Functions              │
                    └─────────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════════════════╗
║                    PROJECT SUBMISSION (Bot-Free)                           ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────┐
    │   WEBSITE    │
    │  Submit Form │
    └──────┬───────┘
           │
           │ Direct API call (no webhook)
           ▼
    ┌──────────────────────────────┐
    │        SUPABASE              │
    │                              │
    │  INSERT INTO projects        │
    │  status = 'pending'          │
    │                              │
    │  ──────────────────────────  │
    │  DATABASE TRIGGER fires:     │
    │                              │
    │  → Edge Function            │
    │    "notify_discord"         │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │   SUPABASE EDGE FUNCTION     │
    │   "notify_discord"           │
    │                              │
    │   Sends Discord Webhook:     │
    │   POST to #project-approval  │
    │                              │
    │   📦 New Project!            │
    │   Name: XYZ                  │
    │   Link: supabase.com/row/123 │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │      DISCORD CHANNEL         │
    │   #project-approval          │
    │                              │
    │  (Webhook message appears)   │
    │                              │
    │  Click Supabase link ──────►│┼──────┐
    │                              │       │
    └──────────────────────────────┘       │
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │   SUPABASE DASHBOARD   │
                              │                        │
                              │  Change status:        │
                              │  pending → approved    │
                              │                        │
                              │  ──────────────────    │
                              │  TRIGGER fires:        │
                              │  → notify_showcase     │
                              │  → generate_slug       │
                              │  → update fields       │
                              └────────────────────────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │   DISCORD #showcase    │
                              │   (Webhook)            │
                              │                        │
                              │   🎉 New project!      │
                              └────────────────────────┘


╔═══════════════════════════════════════════════════════════════════════════╗
║                    IDEA SUBMISSION (Bot-Free)                              ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌──────────────┐
    │   WEBSITE    │
    │  Submit Form │
    └──────┬───────┘
           │
           │ Google Forms or direct to Sheets API
           ▼
    ┌──────────────────────────────┐
    │       GOOGLE SHEET           │
    │                              │
    │  New row added               │
    │                              │
    │  ──────────────────────────  │
    │  APPS SCRIPT TRIGGER:        │
    │  onFormSubmit()              │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │    GOOGLE APPS SCRIPT        │
    │                              │
    │   function onFormSubmit() {  │
    │     // Send Discord webhook  │
    │     // Include Sheet row #   │
    │   }                          │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │      DISCORD CHANNEL         │
    │   #idea-approval             │
    │                              │
    │  💡 New Idea!                │
    │  Title: XYZ                  │
    │  Sheet Row: 42               │
    │  Link: [Open Sheet]          │
    └──────────────────────────────┘
                   │
                   │  MANUAL: Open sheet, approve
                   ▼
    ┌──────────────────────────────┐
    │       GOOGLE SHEET           │
    │                              │
    │  Update Status = "approved"  │
    │                              │
    │  ──────────────────────────  │
    │  APPS SCRIPT watches for     │
    │  status change:              │
    │                              │
    │  → Post to #ideas channel    │
    │  → Create thread? (optional) │
    └──────────────────────────────┘


╔═══════════════════════════════════════════════════════════════════════════╗
║                    COMPARISON: BOT vs BOT-FREE                             ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌────────────────────────────────────────────────────────────────────┐
    │                                                                    │
    │   ASPECT              │  WITH BOT         │  BOT-FREE             │
    │   ────────────────────┼───────────────────┼─────────────────────  │
    │                       │                   │                       │
    │   Hosting Cost        │  $5-10/mo         │  $0 (free tier)       │
    │   (Railway/Render)    │  (bot server)     │  (Supabase + Apps)    │
    │                       │                   │                       │
    │   Complexity          │  Higher           │  Lower                │
    │                       │  (code to manage) │  (config + triggers)  │
    │                       │                   │                       │
    │   !approve command    │  ✅ Yes           │  ❌ No (use dashboard)│
    │                       │                   │                       │
    │   Realtime responses  │  ✅ Instant       │  ✅ Instant (triggers)│
    │                       │                   │                       │
    │   Auto thread creation│  ✅ Yes           │  ⚠️ Limited           │
    │                       │                   │                       │
    │   Uptime              │  Depends on host  │  99.9% (Google/Supa)  │
    │                       │                   │                       │
    │   Maintenance         │  You maintain bot │  Managed services     │
    │                       │                   │                       │
    │   Learning Curve      │  Discord.js, etc  │  SQL, Apps Script     │
    │                       │                   │                       │
    └────────────────────────────────────────────────────────────────────┘


╔═══════════════════════════════════════════════════════════════════════════╗
║                    RECOMMENDATION                                          ║
╚═══════════════════════════════════════════════════════════════════════════╝

    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                  │
    │   🎯 START WITH BOT-FREE (Phase 2)                              │
    │                                                                  │
    │   Why?                                                          │
    │   • $0 hosting cost                                             │
    │   • Less code to maintain                                       │
    │   • Supabase triggers are powerful                              │
    │   • Google Apps Script is free & reliable                       │
    │   • You can always ADD a bot later                              │
    │                                                                  │
    │   ─────────────────────────────────────────────────────────     │
    │                                                                  │
    │   The only thing you lose:                                      │
    │   • !approve command (just click in Supabase instead)           │
    │   • Auto thread creation (use Discord's built-in forums)        │
    │                                                                  │
    │   ─────────────────────────────────────────────────────────     │
    │                                                                  │
    │   ADD BOT LATER IF:                                             │
    │   • You need complex commands                                   │
    │   • You want auto-thread creation                               │
    │   • Volume grows to 1000s/day                                   │
    │                                                                  │
    └─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ Summary: All Flows at a Glance

```
                           ┌─────────────────────────────────┐
                           │          DIVISION ZERO          │
                           │         SYSTEM OVERVIEW         │
                           └─────────────────────────────────┘
                                          │
          ┌───────────────────────────────┼───────────────────────────────┐
          │                               │                               │
          ▼                               ▼                               ▼
   ┌──────────────┐              ┌──────────────┐              ┌──────────────┐
   │   PROJECTS   │              │    IDEAS     │              │    TOOLS     │
   │  (Supabase)  │              │   (Sheets)   │              │   (Static)   │
   └──────┬───────┘              └──────┬───────┘              └──────────────┘
          │                             │                            
          │                    ┌────────┴────────┐
          │                    │                 │
          ▼                    ▼                 ▼
    ┌───────────┐        ┌───────────┐    ┌───────────┐
    │  Submit   │        │ Validate  │    │   Paid    │
    │  Project  │        │   (Free)  │    │  (Client) │
    └─────┬─────┘        └─────┬─────┘    └─────┬─────┘
          │                    │                │
          ▼                    ▼                ▼
    ┌───────────┐        ┌───────────┐    ┌───────────┐
    │  Discord  │        │  Discord  │    │  DM You   │
    │  Approval │        │  Approval │    │   Only    │
    └─────┬─────┘        └─────┬─────┘    └───────────┘
          │                    │
          ▼                    ▼
    ┌───────────┐        ┌───────────┐
    │ Supabase  │        │  Thread   │
    │  Update   │        │ + Sheet   │
    └─────┬─────┘        └───────────┘
          │
          ▼
    ┌───────────┐
    │  Website  │
    │ (via JSON)│
    └───────────┘
```

---

*Last updated: 2024-12-11*
