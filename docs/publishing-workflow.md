# Blog Publishing Workflow

**Version**: 1.0
**Last Updated**: November 16, 2025
**Status**: Phase 5 - CSV Publishing Workflow Automation

---

## Overview

This document outlines the complete workflow for publishing new Medium blog posts to the Piper Morgan website. The workflow ensures all posts have proper metadata, images, and categorization before deployment.

### Publishing Flow Summary

```
Medium Publish → RSS Automation → CSV Metadata → Validation → Deploy
     ↓               ↓                ↓              ↓           ↓
  (Manual)      (Automatic)     (Interactive)   (Automated)  (Automatic)
```

---

## Prerequisites

- Node.js installed (v18+)
- Repository cloned locally
- Write access to GitHub repository
- Medium article published on "building-piper-morgan" publication

---

## Publishing Workflow

### Option A: Automated Flow (Recommended)

**Best for**: Regular publishing cadence, hands-off automation

#### Steps:

1. **Publish to Medium**
   - Publish your article to the "building-piper-morgan" Medium publication
   - Note the hashId from the URL (12-character hex: `f38cde251d9d`)

2. **Wait for RSS Automation** (or trigger manually)
   - **Automatic**: Daily at 11:30 AM Pacific (7:30 PM UTC)
   - **Manual trigger**:
     ```bash
     gh workflow run "Update Medium Blog Posts"
     # OR
     node scripts/fetch-blog-posts.js
     ```

3. **Run Interactive Metadata Preparation**
   ```bash
   node scripts/prepare-new-post.js
   ```

   This script will:
   - Detect new posts in `medium-posts.json` not yet in CSV
   - Guide you through adding metadata interactively:
     - **Slug**: Auto-generated from title (confirm or customize)
     - **Image**: Select from available robot-*.webp files
     - **Category**: Choose "building" (narrative) or "insight" (standalone)
     - **Episode**: Assign to one of 12 episodes
     - **Work Date**: When content was created (defaults to pub date)
     - **Chat Date**: Optional - when draft created
     - **Notes**: Optional internal notes
   - Append new entries to CSV
   - Validate format

4. **Validate Metadata**
   ```bash
   node scripts/validate-csv.js
   ```

   Checks for:
   - Required fields present
   - Valid formats (dates, slugs, categories)
   - No duplicates
   - Image files exist
   - Episode slugs match definitions

5. **Sync CSV to JSON**
   ```bash
   node scripts/sync-csv-to-json.js
   ```

   Updates `src/data/medium-posts.json` with CSV metadata

6. **Test Locally**
   ```bash
   npm run dev
   ```

   Verify:
   - Post appears in blog listing
   - Correct category filter
   - Episode assignment shows
   - Featured image displays
   - Slug URL works (`/blog/your-slug`)

7. **Commit and Deploy**
   ```bash
   git add data/blog-metadata.csv src/data/medium-posts.json
   git commit -m "Add new blog post: [Title]"
   git push origin main
   ```

   GitHub Actions will automatically:
   - Run validation
   - Build site
   - Deploy to GitHub Pages

---

### Option B: Manual CSV Editing (Advanced)

**Best for**: Bulk updates, troubleshooting, experienced users

#### Steps:

1. **Edit CSV Directly**

   Open `data/blog-metadata.csv` in your editor

   **CSV Format** (11 fields):
   ```csv
   slug,hashId,title,chatDate,imageSlug,workDate,pubDate,category,cluster,featured,notes
   ```

2. **Add New Row**

   Template:
   ```csv
   your-slug,f38cde251d9d,"Article Title",2025-11-16,robot-trainer.webp,2025-11-15,2025-11-16T10:00:00,building,reflection-evolution,false,
   ```

   **Field Guide**:
   - `slug`: URL-friendly identifier (lowercase, hyphens only)
   - `hashId`: 12-char hex ID from Medium URL
   - `title`: Full article title (quote if contains commas)
   - `chatDate`: Optional - when draft created (YYYY-MM-DD)
   - `imageSlug`: Filename in `/public/assets/blog-images/` (e.g., robot-trainer.webp)
   - `workDate`: When work happened (YYYY-MM-DD or ISO 8601)
   - `pubDate`: When published on Medium (ISO 8601)
   - `category`: Either "building" or "insight"
   - `cluster`: Episode slug (see `src/lib/episodes.ts` for valid values)
   - `featured`: "true" or "false" (only ONE post should be true)
   - `notes`: Optional internal notes

3. **Validate, Sync, Test, Deploy** (same as Option A, steps 4-7)

---

## Field Reference

### Slug

**Format**: `lowercase-words-with-hyphens`
**Rules**:
- Auto-generated from title (text before colon)
- Maximum 6 words preferred
- Only lowercase letters, numbers, hyphens
- Must be unique across all posts
- No leading/trailing hyphens

**Examples**:
- `"Systemic Kindness: Building..."` → `systemic-kindness`
- `"The Weekend Sprint Chronicles: How We..."` → `weekend-sprint-chronicles`

### HashId

**Format**: 12 lowercase hex characters
**Source**: Medium post URL
**Example**: `https://medium.com/...post-title-f38cde251d9d` → `f38cde251d9d`

### ImageSlug

**Format**: `robot-[descriptor].webp`
**Location**: `/public/assets/blog-images/`
**Examples**: `robot-trainer.webp`, `robot-ethics.webp`, `robot-relay.webp`

**Available Images**:
```bash
# List available images
ls public/assets/blog-images/robot-*.webp
```

### Category

**Values**: `building` OR `insight`

**building** (Narrative):
- Building-in-public story posts
- Chronological development journey
- Personal experiences and discoveries
- ~81% of posts

**insight** (Standalone):
- Lessons learned
- Frameworks and methodologies
- Standalone advice/patterns
- ~19% of posts

### Cluster (Episode)

**Values**: Must match episode slug from `src/lib/episodes.ts`

**12 Episodes**:
1. `genesis-architecture` - Initial prototype (Jun 27 - Jul 6)
2. `foundation-building` - Core infrastructure (Jul 7 - Jul 21)
3. `complexity-reckoning` - Technical debt (Jul 22 - Jul 28)
4. `production-transformation` - Prototype → Production (Jul 29 - Aug 8)
5. `methodology-refinement` - Systematic development (Aug 9 - Aug 16)
6. `infrastructure-sprint` - Major victories (Aug 17 - Aug 23)
7. `enhanced-capabilities` - Enhanced prompting (Aug 24 - Aug 31)
8. `orchestration-verification` - AI self-verification (Sep 1 - Sep 8)
9. `meta-development` - Self-building architecture (Sep 9 - Sep 15)
10. `strategic-pause` - Explicit pause (Sep 16 - Sep 22)
11. `discipline-completion` - Finishing discipline (Sep 23 - Oct 3)
12. `reflection-evolution` - Post-completion (Oct 4 - Oct 12)

**Assignment Guide**:
- Check post's `workDate`
- Match to episode date range
- Use episode slug in `cluster` field

### Dates

**Formats**:
- `YYYY-MM-DD` (preferred for workDate/chatDate)
- `YYYY-MM-DDTHH:MM:SS` (ISO 8601, used for pubDate)

**Examples**:
- `workDate`: `2025-11-15`
- `pubDate`: `2025-11-16T10:30:00`
- `chatDate`: `2025-11-14`

**Date Types**:
- `workDate`: When content was actually created (canonical for ordering)
- `pubDate`: When published on Medium
- `chatDate`: When article draft was created (optional, often extracted from title prefix)

### Featured

**Values**: `true` OR `false`
**Rule**: Only ONE post should have `featured=true` at a time
**Usage**: Marks post for homepage featured article section

---

## Validation

### Automated Validation

The validation script (`scripts/validate-csv.js`) checks:

✅ **Required Fields**:
- All posts have: slug, hashId, title, imageSlug, workDate, pubDate, category, cluster

✅ **Format Validation**:
- Slugs: lowercase, hyphens only, no leading/trailing hyphens
- HashIds: exactly 12 hex characters
- Dates: YYYY-MM-DD or ISO 8601 format
- Categories: only "building" or "insight"
- Clusters: match valid episode slugs

✅ **Uniqueness**:
- No duplicate slugs
- No duplicate hashIds

✅ **File Existence**:
- Image files exist in `/public/assets/blog-images/`

✅ **Logic Checks**:
- Only one post has `featured=true`

### Running Validation

```bash
# Full validation
node scripts/validate-csv.js

# Exit code 0 = all passed
# Exit code 1 = errors found (blocks deployment)
```

**Output**:
- Lists all errors (missing fields, invalid formats, duplicates)
- Lists warnings (missing images, date format suggestions)
- Shows stats (total, valid, errors, warnings)

---

## Troubleshooting

### Common Issues

#### 1. New Post Not Appearing on Site

**Problem**: Published to Medium but not showing on website

**Solutions**:
- **Check RSS automation**: Wait for daily run (11:30 AM Pacific) or trigger manually
- **Verify in JSON**: Check if post in `src/data/medium-posts.json`
- **Check CSV**: Ensure post in `data/blog-metadata.csv`
- **Run sync**: `node scripts/sync-csv-to-json.js`

#### 2. Validation Fails with Missing Metadata

**Problem**: `validate-csv.js` reports missing fields

**Solutions**:
- Run `node scripts/prepare-new-post.js` to add missing metadata interactively
- Or manually edit `data/blog-metadata.csv` to fill in missing fields
- Check which fields are missing in validation output

#### 3. Duplicate Slug Error

**Problem**: Validation fails with "Duplicate slug"

**Solutions**:
- Check CSV for duplicate entries (same slug used twice)
- Generate unique slug (add more words from title or append `-2`)
- Use `prepare-new-post.js` which prevents collisions

#### 4. Image Not Found Warning

**Problem**: Validation warns "Image file not found"

**Solutions**:
- Check if image exists: `ls public/assets/blog-images/robot-*.webp`
- Verify imageSlug spelling in CSV
- Add missing image to `/public/assets/blog-images/`
- Use different available image

#### 5. Invalid Date Format

**Problem**: Validation fails with "Invalid date format"

**Solutions**:
- Use YYYY-MM-DD format for workDate/chatDate
- Use ISO 8601 format (YYYY-MM-DDTHH:MM:SS) for pubDate
- Check for typos in date values
- Ensure dates are valid (not Feb 30, etc.)

#### 6. Invalid Episode Slug

**Problem**: Validation fails with "Invalid cluster"

**Solutions**:
- Check valid episodes in `src/lib/episodes.ts`
- Use exact episode slug (case-sensitive)
- Match episode by work date range
- Leave empty if unsure (can add later)

---

## Emergency Procedures

### Quick Fix for Deployment Blocker

If validation fails and you need to deploy urgently:

1. **Identify the error**:
   ```bash
   node scripts/validate-csv.js
   ```

2. **Quick fix options**:

   **Option A: Remove problematic entry**
   - Comment out or delete the problematic row in CSV
   - Re-run validation

   **Option B: Fill minimum required fields**
   - Set `imageSlug` to any existing robot-*.webp
   - Set `category` to "building"
   - Set `cluster` to most recent episode
   - Set `workDate` to `pubDate`

3. **Deploy immediately**:
   ```bash
   node scripts/sync-csv-to-json.js
   git add -A
   git commit -m "Fix blog metadata"
   git push
   ```

4. **Fix properly later**:
   - Use `prepare-new-post.js` to add correct metadata
   - Update CSV with proper category, episode, dates
   - Commit refined metadata

### Rollback Bad Metadata

If deployed with incorrect metadata:

1. **Find correct values** in backup or previous commit
2. **Edit CSV** with correct values
3. **Sync and deploy**:
   ```bash
   node scripts/sync-csv-to-json.js
   git add -A
   git commit -m "Fix incorrect blog metadata"
   git push
   ```

---

## Best Practices

### When Publishing

✅ **DO**:
- Use `prepare-new-post.js` for all new posts (interactive, prevents errors)
- Run validation before committing
- Test locally before pushing
- Use descriptive commit messages
- Keep one task per commit (easier rollback)

❌ **DON'T**:
- Skip validation (catches errors early)
- Edit JSON directly (CSV is source of truth)
- Set multiple posts as `featured=true`
- Use uppercase or special characters in slugs
- Leave required fields empty

### Metadata Quality

- **Slugs**: Keep concise (3-6 words), descriptive
- **Images**: Match thematic content when possible
- **Categories**: "building" for narrative, "insight" for lessons
- **Episodes**: Match by work date, not pub date
- **Work Dates**: Be accurate (enables chronological ordering)

### Git Workflow

- **Commit CSV and JSON together** (keep in sync)
- **Pull before editing** CSV (avoid conflicts)
- **Use feature branches** for bulk updates
- **Squash commits** if experimenting with metadata

---

## Scripts Reference

### Production Scripts

**`fetch-blog-posts.js`**
Fetches latest posts from Medium RSS, downloads images, updates JSON.
```bash
node scripts/fetch-blog-posts.js
```
- Runs daily automatically (11:30 AM Pacific)
- Can be triggered manually
- Merges with existing archive

**`sync-csv-to-json.js`**
Syncs metadata from CSV to JSON (CSV is source of truth).
```bash
node scripts/sync-csv-to-json.js
```
- Run after editing CSV
- Updates `src/data/medium-posts.json`
- Backs up JSON before updating

**`validate-csv.js`**
Validates CSV metadata for completeness and correctness.
```bash
node scripts/validate-csv.js
```
- Exit 0 = valid
- Exit 1 = errors (blocks deployment)
- Use for pre-deployment checks

**`prepare-new-post.js`**
Interactive helper for adding new posts to CSV.
```bash
node scripts/prepare-new-post.js
# OR
node scripts/prepare-new-post.js --dry-run  # Preview only
```
- Detects new posts in JSON not in CSV
- Guides through metadata collection
- Auto-generates slugs
- Prevents duplicate slugs/hashIds

### Utility Scripts

**`parse-blog-content.js`**
Extracts full HTML content from Medium export.
```bash
node scripts/parse-blog-content.js
```

**`match-blog-images.js`**
Matches and copies images for posts.
```bash
node scripts/match-blog-images.js
node scripts/match-blog-images.js --copy  # Actually copy files
```

---

## Quick Reference

### Publishing Checklist

- [ ] Publish article to Medium (building-piper-morgan)
- [ ] Wait for RSS automation or trigger manually
- [ ] Run: `node scripts/prepare-new-post.js`
- [ ] Answer interactive prompts (slug, image, category, episode, dates)
- [ ] Run: `node scripts/validate-csv.js` (must pass)
- [ ] Run: `node scripts/sync-csv-to-json.js`
- [ ] Run: `npm run dev` (test locally)
- [ ] Commit: `git add data/ src/data/`
- [ ] Push: `git push origin main`
- [ ] Verify deployment on pipermorgan.ai

### Command Sequence

```bash
# 1. Fetch new posts (if not waiting for automation)
node scripts/fetch-blog-posts.js

# 2. Add metadata interactively
node scripts/prepare-new-post.js

# 3. Validate
node scripts/validate-csv.js

# 4. Sync to JSON
node scripts/sync-csv-to-json.js

# 5. Test locally
npm run dev

# 6. Deploy
git add data/blog-metadata.csv src/data/medium-posts.json
git commit -m "Add new blog post: [Title]"
git push origin main
```

---

## Getting Help

**Validation Errors**: Run `node scripts/validate-csv.js` for detailed error messages

**Script Issues**: Check script output for specific error messages

**GitHub Actions Failures**: Check workflow logs in GitHub Actions tab

**General Questions**: Review this documentation or check `CLAUDE.md`

---

**Version History**:
- 1.0 (2025-11-16): Initial workflow documentation for Phase 5
