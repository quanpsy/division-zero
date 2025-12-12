# Division Zero - Bot Types & Functions

> A complete list of all bot tasks needed for the platform.  
> Read this first before building anything!

---

## 🎯 Overview

You don't need multiple bots - you need **ONE bot** that handles multiple jobs.  
Think of it like one assistant with many responsibilities.

---

## 📋 All Bot Jobs (by category)

### 1. 📝 Form Submission Handlers

| Job | Trigger | What the bot does |
|-----|---------|-------------------|
| **Validation Idea** | Webhook from form | Post to approval channel → Wait for mod → Create thread → Save to Sheet |
| **Paid Idea** | Webhook from form | Save to Sheet → DM owner notification |
| **Project Submission** | Webhook from form | Post to approval channel → Wait for mod → Create showcase → Save to Sheet |

---

### 2. ✅ Moderation Commands

Commands that mods can type in Discord:

| Command | What it does |
|---------|--------------|
| `!approve <id>` | Approve a submission (idea/project) |
| `!reject <id> <reason>` | Reject with reason |
| `!feature <id>` | Toggle featured status (projects) |
| `!dz <id>` | Toggle "Division Zero" status (special projects) |
| `!notes <id> <text>` | Add internal moderator notes |
| `!assign <id> @user` | Assign to a team member (paid ideas) |

---

### 3. 💬 Thread Management

| Job | What the bot does |
|-----|-------------------|
| **Create Thread** | After approval, create a discussion thread |
| **Add User** | If submitter has Discord ID, add them to thread |
| **Cross-post** | Share notification in other channels/groups |
| **Archive** | Auto-archive old threads after X days |

---

### 4. 📊 Google Sheets Integration

| Job | What the bot does |
|-----|-------------------|
| **Save Submission** | Write new row when form submitted |
| **Update Status** | Update status column when mod approves/rejects |
| **Add Thread Link** | Add Discord thread URL to the row |
| **Read Data** | Fetch project/idea data when needed |

---

### 5. 🔔 Notifications

| Job | Who gets notified | When |
|-----|-------------------|------|
| **New Submission Alert** | Approval group (20 mods) | New idea/project submitted |
| **Owner DM** | You | New paid idea submitted |
| **User Feedback** | Submitter (if Discord ID) | Their submission approved/rejected |
| **Weekly Digest** | Community | Top projects/ideas of the week |

---

### 6. 🎲 Community & Fun (optional, future)

| Job | Description |
|-----|-------------|
| **Welcome Message** | Greet new members |
| **Role Assignment** | Auto-assign roles based on activity |
| **Leaderboard** | Track top contributors |
| **Polls** | Create and manage polls |

---

## 🔧 Technical: How Bots Work (simple explanation)

```
Website Form → Webhook URL → Your Bot Server → Discord API
                    ↓
              Google Sheets API
```

1. **Webhook**: A URL that receives data when form submitted
2. **Bot Server**: A small program running 24/7 that processes data
3. **Discord API**: How your bot talks to Discord (create messages, threads, etc.)
4. **Google Sheets API**: How your bot reads/writes spreadsheet data

---

## 📦 What You Need to Build

| Component | Purpose | Difficulty |
|-----------|---------|------------|
| **Discord Bot** | One bot handling all jobs above | Medium |
| **Webhook Endpoints** | URLs for forms to hit (2: validation, paid) | Easy |
| **Google Sheets Setup** | Sheets with correct columns | Easy |
| **Bot Hosting** | Where bot runs 24/7 (Railway, Render, etc.) | Easy |

---

## 🚀 Recommended Build Order

1. **Phase 1: Core**
   - [ ] Create Discord bot application
   - [ ] Set up Google Sheet with columns
   - [ ] Basic webhook → save to sheet

2. **Phase 2: Moderation**
   - [ ] !approve / !reject commands
   - [ ] Thread creation
   - [ ] Update sheet on approve

3. **Phase 3: Notifications**
   - [ ] DM owner for paid ideas
   - [ ] Add user to thread

4. **Phase 4: Polish**
   - [ ] Error handling
   - [ ] Logging
   - [ ] Weekly digest (optional)

---

## ❓ Questions to Decide

Before building, you need to decide:

1. **Where will the bot run?** (Railway, Render, your server, etc.)
2. **What's the approval channel name?** (#idea-approval?)
3. **What groups should validation ideas be shared to?**
4. **Do you want email notifications too, or just Discord?**
5. **Auto-archive threads after how many days?**

---

*Last updated: 2024-12-11*
