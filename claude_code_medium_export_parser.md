# Claude Code: Medium Export Parser & Archive Builder

Complete gameplan for processing Medium export and building full blog archive.

## VERIFY FIRST (mandatory):
```bash
# Confirm export location and structure
ls -la ~/Development/piper-morgan-website/src/app/blog/export/medium-export-*/posts/ | head -20

# Check spreadsheet location
find ~/Development/piper-morgan-website -name "*.csv" | grep -i medium

# Verify current blog data
cat ~/Development/piper-morgan-website/src/data/medium-posts.json | head -50

# Check image storage location
ls -la ~/Development/piper-morgan-website/public/assets/
```

## OBJECTIVE:
Parse Medium export to build complete archive of 120+ Building Piper Morgan blog posts with self-hosted images.

## CURRENT STATE:
- Medium export: `src/app/blog/export/medium-export-[hash]/posts/`
- 200+ HTML files (all Medium posts, not just Building Piper Morgan)
- CSV spreadsheet identifies which posts belong to Building Piper Morgan publication
- Images currently hosted on Medium CDN
- Current RSS integration shows only 10 most recent posts
- Pagination infrastructure ready and waiting for full archive

## IMPLEMENTATION PLAN:

### Phase 1: Identify Building Piper Morgan Posts

**Input**: CSV spreadsheet with Medium URLs
**CSV Format**:
```csv
Date,Medium URL,Date of chat: Title,Theme,Medium status,cartoon,Notes
Thu Sep 25,https://medium.com/building-piper-morgan/the-quiet-satisfaction...-433429cb8a5a,...
```

**Task 1.1: Parse CSV**
- Read CSV file
- Extract Medium URL column
- Extract post ID from URL (the hash at the end after final dash)
  - Example: `...inchworm-433429cb8a5a` → ID is `433429cb8a5a`

**Task 1.2: Match to Export Files**
- List all files in `posts/` folder
- For each CSV post ID, find matching HTML file
  - Filename pattern: `YYYY-MM-DD_Title-Slug-{POST_ID}.html`
  - Match on POST_ID at end of filename
- Create list of Building Piper Morgan files to process

**Expected outcome**: Array of ~120 HTML file paths to parse

### Phase 2: Parse HTML Files

**For each Building Piper Morgan HTML file:**

**Task 2.1: Extract Metadata**
Parse HTML to extract:
- **Title**: From `<h1>` or `<title>` tag
- **Publication Date**: From filename (YYYY-MM-DD prefix)
- **URL**: Reconstruct from CSV data or parse from HTML
- **Author**: "christian crumlish" (or parse from HTML if available)
- **Content**: Extract main article content
- **Excerpt**: First 200-300 characters of content
- **Categories/Tags**: Look for "Building in Public" or parse from HTML

**Task 2.2: Extract Featured Image**
- Look for `<img>` with `data-is-featured="true"`
- Extract:
  - `src`: Medium CDN URL
  - `alt`: Alt text for accessibility
  - `data-image-id`: Unique image identifier
  - `data-width` and `data-height`: Dimensions

**Expected outcome**: Structured data object for each post

### Phase 3: Download and Self-Host Images

**Task 3.1: Create Image Storage**
```bash
mkdir -p public/assets/blog-images
```

**Task 3.2: Download Featured Images**
For each post with featured image:
- Fetch image from Medium CDN URL
- Save with meaningful filename: `{POST_ID}-featured.{ext}`
  - Example: `433429cb8a5a-featured.png`
- Store in `/public/assets/blog-images/`
- Handle errors gracefully (some images may be missing)

**Task 3.3: Update Image References**
- Replace Medium CDN URL with local path
- New path: `/assets/blog-images/{POST_ID}-featured.{ext}`
- Preserve alt text and dimensions

**Expected outcome**: 
- All images downloaded to local storage
- Image references updated to local paths
- Fallback handling for missing images

### Phase 4: Build Archive JSON

**Task 4.1: Transform to Archive Format**
Convert parsed data to match current `medium-posts.json` structure:

```json
{
  "title": "The Quiet Satisfaction of the Successful Inchworm",
  "link": "https://medium.com/building-piper-morgan/...",
  "pubDate": "2025-10-02T...",
  "author": "christian crumlish",
  "content": "Full article content or excerpt...",
  "contentSnippet": "Plain text excerpt...",
  "guid": "https://medium.com/p/433429cb8a5a",
  "categories": ["Building in Public"],
  "thumbnail": "/assets/blog-images/433429cb8a5a-featured.png",
  "isoDate": "2025-10-02T00:00:00.000Z"
}
```

**Task 4.2: Sort by Date**
- Sort all posts by publication date (newest first)
- Ensure chronological ordering for blog display

**Task 4.3: Merge with Existing Posts**
- Load current `medium-posts.json` (10 recent posts from RSS)
- Merge with parsed archive posts
- Deduplicate by `guid` or `link`
- Maintain newest-first sort order

**Task 4.4: Save Complete Archive**
```bash
# Save to data directory
~/Development/piper-morgan-website/src/data/medium-posts.json
```

**Expected outcome**: Complete archive with 120+ posts, newest first, all self-hosted images

### Phase 5: Update RSS Automation (Implement Prompt 2)

**Task 5.1: Enhance Daily RSS Fetch**
Modify GitHub Action or cron job to:
- Fetch latest Medium RSS feed (gets ~10 recent posts)
- Load existing `medium-posts.json` archive
- Merge new posts with archive (deduplicate by guid)
- Download any new featured images to local storage
- Sort by date (newest first)
- Save updated archive

**Task 5.2: Add Logging**
```javascript
console.log(`Fetched ${newPosts.length} posts from RSS`);
console.log(`Archive contains ${totalPosts.length} total posts`);
console.log(`Downloaded ${newImages.length} new images`);
```

**Expected outcome**: Archive grows automatically as new posts published

### Phase 6: Integration Testing

**Task 6.1: Verify Pagination**
- Start dev server
- Navigate to `/blog`
- Confirm 24 posts display on page 1
- Confirm pagination controls show all pages
- Test navigation between pages
- Verify post count indicator accurate

**Task 6.2: Verify Images**
- Check that featured images display correctly
- Verify images load from local `/assets/` directory
- Confirm alt text preserved
- Test image lazy loading

**Task 6.3: Verify Data Quality**
- Spot-check post titles, dates, excerpts
- Verify links to Medium work correctly
- Check that newest posts appear first
- Confirm no duplicates

## ERROR HANDLING:

**CSV Parsing Errors**:
- Log any malformed CSV rows
- Continue processing valid rows
- Report total processed vs total in file

**HTML Parsing Errors**:
- Log files that fail to parse
- Continue with remaining files
- Note which posts couldn't be processed

**Image Download Errors**:
- Log failed image downloads
- Continue processing post without image
- Set thumbnail to `null` or use placeholder

**Merge Conflicts**:
- Prefer RSS data for posts that exist in both sources
- Log any data discrepancies
- Never lose posts during merge

## DATA VALIDATION:

Before saving final archive, verify:
- All posts have required fields (title, link, pubDate)
- Dates are valid ISO 8601 format
- No duplicate GUIDs
- Posts are sorted newest-first
- Image paths are valid (file exists or null)
- Total count matches expectation (~120+ posts)

## SUCCESS CRITERIA:

- [ ] CSV successfully parsed with Building Piper Morgan post IDs extracted
- [ ] ~120 HTML files identified and parsed
- [ ] All featured images downloaded to `/public/assets/blog-images/`
- [ ] Image references updated to local paths
- [ ] Complete archive JSON created with all posts
- [ ] Archive merged with existing RSS data (no duplicates)
- [ ] Posts sorted newest-first
- [ ] RSS automation enhanced for ongoing updates
- [ ] Pagination displays all posts correctly
- [ ] Images load from local storage
- [ ] No errors or warnings in console
- [ ] Build completes successfully

## STRATEGIC CONTEXT:

This is the culmination of weeks of blog infrastructure work:
1. ✅ Navigation added ("Journey" link)
2. ✅ Visual presentation improved (hero images, metadata)
3. ✅ Pagination implemented (24 posts/page)
4. 🎯 **TODAY**: Complete archive with self-hosted images

Once complete, the site will have:
- Full historical archive (120+ posts)
- Beautiful self-hosted presentation
- Automated ongoing updates
- Professional publication-quality blog

## METHODOLOGY REMINDER:

1. Verify all file locations and formats
2. Show me sample parsed data before processing all files
3. Test image download with 2-3 posts first
4. Process in small batches, log progress
5. Validate data before final save
6. Test pagination with full dataset

Start by showing me:
- CSV file location and row count
- Sample HTML file parsed data
- First 3 featured image URLs

Let's build this systematically!