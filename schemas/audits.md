# Audits & Change Log

This document tracks important design decisions and changes made during development.

---

## 2025-12-15 - Pre-Launch Updates

### Projects Page Categories

**Decision:** Keep the `promoted` section even though it will usually be empty.

**Reason:** 
- Carousels with 0 items don't render, so no visual impact
- Allows for manual promotion of projects later
- Provides flexibility for featuring sponsor projects or special content

**Implementation Notes:**
- Add `isPromoted` boolean field to project schema
- Add `promotedOrder` integer field for sorting (1 = first, 2 = second, etc.)
- Projects with `isPromoted: true` appear in the ⭐ Promoted carousel
- Sort by `promotedOrder` ascending

### New Category Layout

```
⭐ Promoted (optional, usually empty)
🔥 Trending (10)
✨ New This Week (10)
🔷 Division Zero Picks (8)
💼 Productivity (6)
🎮 Games (6)
🤖 AI Agents (6)
👑 All-Time Best (6)
```

### Schema Changes Needed

```json
// Add to individual project objects:
{
    "isPromoted": false,        // boolean
    "promotedOrder": null,      // integer or null
    "isDivisionZero": false,    // boolean - for DZ picks
    "isAllTime": false          // boolean - for all-time best
}
```

---

## Home Page Updates

### Hero Section
- Title: "Vibecoding Is Art" (changed from "Vibecoding Made Simple")
- Subtitle: "This is what happens when curiosity meets AI..."

### Logo Scroll
- Limited to 900px width, centered
- Triple duplication for seamless loop
- Colored logos with opacity 0.6, full color on hover
- Next.js, Vercel, GitHub use white versions

### Vocabulary Scroll
- Triple duplication for seamless loop
- Animation to -33.33% instead of -50%
- Added will-change and backface-visibility for smoothness

---

## SVG Optimization
- Replaced PNG logos with SVG (99% size reduction)
- Logos now ~14KB total instead of ~2.2MB

---

*Last updated: 2025-12-15*
