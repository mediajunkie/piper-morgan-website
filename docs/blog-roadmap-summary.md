# Blog Platform Roadmap - Quick Reference

**Last Updated**: October 11, 2025
**Status**: Phase 3 Complete & Deployed ✅

---

## 📊 Current Status

- **Content**: 155/155 posts (100%)
- **Images**: 155/155 posts (100%)
- **Deployed**: ✅ Live on production
- **URL Structure**: Hash-based (`/blog/f38cde251d9d`) → Target: Slug-based (`/blog/systemic-kindness`)

---

## 🎯 Next Steps (Priority Order)

### **Immediate Priority**
**Phase 4: Human-Legible Slugs** (3-4 hours)
- Replace hash URLs with readable slugs
- Foundation for CSV workflow
- No dependencies, can start now

### **High Priority - This Week**
**Phase 5: CSV-Driven Publishing** (4-5 hours)
- CSV as source of truth
- Automated image matching
- Publishing workflow

**Phase 6: Work Date Chronology** (2-3 hours)
- Add work date vs pub date
- Enable true chronological ordering
- Foundation for narrative clustering

### **Medium Priority - Next 2 Weeks**
**Phase 7: Category System** (3-4 hours) - Narrative vs Insight classification
**Phase 8: Narrative Clustering** (5-6 hours) - Group posts into story chapters
**Phase 9: Enhanced Navigation** (5-6 hours) - Timeline, search, multiple views
**Phase 10: Featured Article** (2-3 hours) - Homepage spotlight

### **Flexible Timing**
**Phase 11: Design Polish** (4-6 hours) - Visual refinement, can be iterative

### **Lower Priority**
**Phase 12-15**: Content features, testing, performance, analytics (12-18 hours)

---

## 🔑 Key Architecture Decisions

### **CSV as Source of Truth**
- **Location**: `/data/blog-metadata.csv` (TBD)
- **Flow**: CSV → JSON → Website
- **Columns**: slug, imageSlug, title, workDate, pubDate, category, cluster, featured, notes

### **Work Date vs Pub Date**
- Two separate timestamps maintained
- Work date = when content was actually created
- Pub date = when published on Medium
- Enables true chronological narrative ordering

### **Categories: Narrative vs Insight**
- Binary classification (not tags)
- Narrative = building-in-public story
- Insight = standalone lessons/frameworks

### **Narrative Clustering**
- Group narrative posts into named "chapters"
- Examples: "Weekend Sprint #1", "Ethics Framework", "Image Pipeline"
- Enables timeline navigation and story arc

---

## ❓ Open Questions

### **Phase 4 (Slugs)**
1. Robo* image naming convention?
   - Current: robot-trainer, robot-limb, etc.
   - Standardize format?

2. Slug generation rules?
   - Use full title or text before colon?
   - Max length?
   - Handling duplicates?

### **Phase 5 (CSV)**
1. CSV location?
   - `/data/blog-metadata.csv`?
   - Root level?

2. Check into git or external?
   - Pro: Version history
   - Con: Merge conflicts

### **Phase 10 (Featured)**
1. Selection method?
   - A: Always most recent
   - B: Manual selection (CSV flag)
   - C: Hybrid (manual override, fallback recent)

---

## ⏱️ Time Estimates

**Core Features** (Phases 4-11): 29-37 hours
**Enhancements** (Phases 12-15): 12-18 hours
**Grand Total**: 41-55 hours

---

## 🗺️ Phase Dependencies

```
Phase 4 (Slugs) ───┐
                   ↓
Phase 5 (CSV) ─────┼──→ Phase 7 (Categories) ────┐
                   │                              ↓
                   └──→ Phase 6 (Work Dates) ──→ Phase 8 (Clustering) ──→ Phase 9 (Navigation)
                   │                                                            ↓
                   └──→ Phase 10 (Featured)                                     ↓
                                                                           Phase 11 (Design)
                                                                                 ↓
                                                                           Phase 13 (Testing)
```

**Parallel Options**:
- Phases 7 & 10 can run in parallel after Phase 5
- Phase 11 (Design) can be iterative throughout Phases 4-10
- Phases 12-15 are independent and can be done anytime

---

## 📝 Implementation Notes

### **Phase 4: Slugs**
- Generate from article title (up to colon)
- Update medium-posts.json structure
- Modify routing from `/blog/[postId]` to `/blog/[slug]`
- Add redirects from old hash URLs

### **Phase 5: CSV Workflow**
- Create CSV-to-JSON sync script
- Enhance RSS script to check CSV for pre-planned posts
- Image matching: check expected path, log if missing
- Update GitHub Actions to run CSV sync first

### **Phase 6: Work Dates**
- Add `workDate` column to CSV (YYYY-MM-DD or YYYY-MM-DD HH:MM)
- Populate for all 155 posts
- Create `sortByWorkDate()` utility
- Display both dates with clear labels

### **Phase 7: Categories**
- Classify all 155 posts as Narrative or Insight
- Build filter tabs on `/blog` page
- Category badges on post cards

### **Phase 8: Clustering**
- Define major work periods (review all posts)
- Name each cluster/chapter
- Build cluster navigation and timeline view
- Apply to narrative posts only

### **Phase 9: Navigation**
- Add "Journey" to main nav
- Build chronological index/timeline view
- Implement search (client-side, Fuse.js)
- Multiple view modes (grid, list, timeline, calendar)

### **Phase 10: Featured**
- Add `featured` boolean to CSV
- Update homepage with featured section
- Validate only one featured post

### **Phase 11: Design Polish**
- Refine typography and spacing
- Improve card design and hover states
- Accessibility audit (WCAG 2.1 AA)
- Dark mode refinement
- Mobile optimization

---

## 🚀 Quick Start: Phase 4

When ready to begin Phase 4:

1. **Read**: `docs/blog-platform-roadmap.md` - Full Phase 4 details
2. **Decide**: Answer open questions about slug format
3. **Script**: Update RSS script slug generation
4. **JSON**: Add slug fields to medium-posts.json
5. **Routes**: Change [postId] to [slug]
6. **Test**: Verify all 155 posts accessible
7. **Deploy**: Push to production

---

**Full Roadmap**: See `docs/blog-platform-roadmap.md` for detailed task breakdowns
