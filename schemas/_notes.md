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
1. ✅ **divisionzero.dev** - Main hub (Vanilla JS, no framework)
2. 🔲 **db.divisionzero.dev** - Online projects database
3. 🔲 **dictionary.divisionzero.dev** - Full vocabulary/terms
4. 🔲 **sell.divisionzero.dev** - Prompt marketplace

---

### sell.divisionzero.dev - Marketplace Idea

**Concept:** PromptBase-style marketplace for AI prompts + freelance prompt creators

**Stack:** Next.js + Prisma (simpler than main site, needs rapid iteration)

**Payment:**
- Razorpay → Indian users (INR)
- Stripe → International users (USD)

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
