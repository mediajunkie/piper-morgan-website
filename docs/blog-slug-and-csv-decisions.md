# Blog Platform: Slug and CSV Format Decisions

**Date**: October 11, 2025
**Status**: Decisions Finalized ✅

---

## 🖼️ Image Naming Standards

### **Format**: `robot-[WORD].webp`

**Examples**:
- `robot-trainer.webp`
- `robot-limb.webp`
- `robot-ethics.webp`
- `robot-methodology.webp`

**Rules**:
1. All images use `robot-` prefix (not `robo-`)
2. Single descriptive word after hyphen
3. All lowercase
4. `.webp` format (already standard)

**Legacy Images**:
- Past images may not follow this format
- Can be aligned later if needed (not urgent)
- User will follow format going forward for all new posts

---

## 🔗 URL Slug Generation Rules

### **Source**: Article title up to the colon

**Example Title**: "Systemic Kindness: Building Methodology That Feels Supportive"
**Generated Slug**: `systemic-kindness-building-methodology`

### **Rules**:

1. **Stop at colon**: Only use text before `:` character
   - "Title: Subtitle" → use only "Title"

2. **Word limit**: Maximum 5-7 words (recommended: 6 words)
   - Provides good context without excessive length
   - Keeps URLs readable and shareable
   - Most titles before colon are 3-6 words

3. **Character handling**:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters (keep only alphanumeric + hyphens)
   - Remove leading/trailing hyphens
   - Collapse multiple hyphens to single hyphen

4. **Collision handling**:
   - If slug already exists, add next word from title
   - Example progression:
     - Attempt 1: `the-day-that-changed`
     - Collision → Attempt 2: `the-day-that-changed-everything`
     - Collision → Attempt 3: `the-day-that-changed-everything-forever`
   - If title exhausted, append `-2`, `-3`, etc.

### **Examples**:

| Original Title | Text Before Colon | Generated Slug (6-word max) |
|----------------|-------------------|----------------------------|
| "Systemic Kindness: Building Methodology That Feels Supportive" | "Systemic Kindness" | `systemic-kindness` |
| "Building Piper Morgan: Methodology That Feels Supportive" | "Building Piper Morgan" | `building-piper-morgan` |
| "The Weekend Sprint Chronicles: How We Built Image Pipeline" | "The Weekend Sprint Chronicles" | `weekend-sprint-chronicles` |
| "AI-Augmented Product Management: A Systematic Approach to Excellence" | "AI-Augmented Product Management" | `ai-augmented-product-management` |
| "Weekend Sprint #3: Building the Content Self-Hosting System" | "Weekend Sprint #3" | `weekend-sprint-3` |

### **Implementation Logic** (Pseudo-code):

```javascript
function generateSlug(title, existingSlugs, maxWords = 6) {
  // Extract text before colon
  const textBeforeColon = title.split(':')[0].trim();

  // Split into words
  const words = textBeforeColon
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .split(/\s+/)
    .filter(word => word.length > 0);

  // Try with increasing word counts
  for (let wordCount = Math.min(words.length, maxWords); wordCount <= words.length; wordCount++) {
    const slug = words.slice(0, wordCount).join('-');

    if (!existingSlugs.includes(slug)) {
      return slug;
    }
  }

  // If all words exhausted, append number
  const baseSlug = words.slice(0, maxWords).join('-');
  let counter = 2;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }

  return `${baseSlug}-${counter}`;
}
```

---

## 📊 CSV Configuration

### **Location**: `/data/blog-metadata.csv`

**Rationale**:
- Consistent with existing data location (`/data/medium-posts.json`)
- Clear, descriptive filename
- Easy to find and edit
- Git-tracked for version history

### **Git Strategy**: Checked into repository

**Rationale**:
- Version history for all metadata changes
- Rollback capability
- Clear audit trail
- Enables review of changes
- Simplifies deployment (no external dependencies)

**Trade-offs**:
- ✅ Pro: Full version control
- ✅ Pro: Easy rollback
- ✅ Pro: Transparent change history
- ⚠️ Con: Potential merge conflicts (mitigated by clear column structure)

### **Future Enhancement**: Web UI for management (nice-to-have)

**Potential Architecture**:
- Simple admin interface (e.g., `/admin/blog-manager`)
- Password-protected or GitHub OAuth
- Edit CSV visually
- Preview changes before commit
- Auto-generate slugs
- Validate data integrity
- Could be static site-compatible admin (JSON-based CRUD)

**Priority**: Low (CSV editing in IDE/text editor works well for now)

---

## 📝 CSV Schema

### **File**: `/data/blog-metadata.csv`

### **Columns** (in order):

1. **slug** (string, required, unique)
   - Human-readable URL identifier
   - Generated from title using rules above
   - Example: `systemic-kindness-building-methodology`

2. **hashId** (string, required, unique)
   - Original Medium post ID (12-char hex)
   - For backward compatibility and matching
   - Example: `f38cde251d9d`

3. **title** (string, required)
   - Full article title
   - Example: `Systemic Kindness: Building Methodology That Feels Supportive`

4. **imageSlug** (string, required)
   - Image filename (without path)
   - Format: `robot-[WORD].webp`
   - Example: `robot-trainer.webp`

5. **workDate** (ISO 8601 datetime, required)
   - When work was actually done
   - Format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SS`
   - Example: `2025-08-14T10:30:00` or `2025-08-14`

6. **pubDate** (ISO 8601 datetime, required)
   - When published on Medium
   - Format: `YYYY-MM-DDTHH:MM:SS`
   - Example: `2025-10-11T13:36:39`

7. **category** (enum, required)
   - Values: `Narrative` or `Insight`
   - Example: `Narrative`

8. **cluster** (string, optional)
   - Narrative chapter/period name
   - Applies to Narrative posts only
   - Example: `Weekend Sprint #1` or `Ethics Framework`

9. **featured** (boolean, required)
   - Is this the featured article?
   - Values: `true` or `false`
   - Only ONE post should have `true` at a time

10. **notes** (string, optional)
    - Internal notes/comments
    - Not displayed on site
    - Example: `Part of ethics series, links to robot-ethics article`

### **Example CSV Content**:

```csv
slug,hashId,title,imageSlug,workDate,pubDate,category,cluster,featured,notes
systemic-kindness,f38cde251d9d,"Systemic Kindness: Building Methodology That Feels Supportive",robot-trainer.webp,2025-08-14T10:30:00,2025-10-11T13:36:39,Narrative,Ethics Framework,true,Latest post - feature on homepage
building-piper-morgan,a143610ce7f9,"Building Piper Morgan: Methodology That Feels Supportive",robot-limb.webp,2025-08-12,2025-10-09T08:15:00,Narrative,Initial Sprint,false,First major post
weekend-sprint-chronicles,b859b2b9de2f,"Weekend Sprint Chronicles: Implementation Patterns",robot-methodology.webp,2025-09-01,2025-10-10T12:00:00,Insight,,false,Standalone insight post
```

### **Validation Rules**:

1. **slug**: Must be unique, lowercase, hyphens only
2. **hashId**: Must be unique, exactly 12 characters, hex only
3. **category**: Must be exactly "Narrative" or "Insight" (case-sensitive)
4. **featured**: Only ONE post can be `true` at a time
5. **imageSlug**: Must match format `robot-[word].webp`
6. **workDate/pubDate**: Must be valid ISO 8601 dates

---

## 🏠 Featured Article Selection

### **Method**: Hybrid (manual selection with fallback)

**Rules**:
1. **Primary**: Use post where `featured = true` in CSV
2. **Fallback**: If no post marked featured, use most recent by `pubDate`
3. **Validation**: Ensure only ONE post has `featured = true`

**Use Cases**:
- **Promoting series**: Manually feature a key article from a series
- **Highlighting insights**: Feature important standalone insights
- **Fresh content**: When no manual selection, always shows latest
- **Flair**: Adds visual interest and editorial control to homepage

**Implementation**:
```typescript
function getFeaturedPost(posts: BlogPost[]): BlogPost {
  // Try to find manually featured post
  const featured = posts.find(p => p.featured === true);
  if (featured) return featured;

  // Fallback to most recent by pub date
  return posts.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )[0];
}
```

---

## 🚀 Implementation Priority

### **Phase 4: Slugs** (Starting Next)
1. Implement slug generation algorithm
2. Generate slugs for all 155 existing posts
3. Update medium-posts.json with slug field
4. Update routing from [postId] to [slug]
5. Add redirects for old hash URLs
6. Test all 155 posts accessible

### **Phase 5: CSV Workflow** (After Phase 4)
1. Create CSV with all 155 posts
2. Populate metadata (slugs already generated)
3. Build CSV-to-JSON sync script
4. Integrate with RSS workflow
5. Update GitHub Actions

### **Remaining Metadata** (Phases 6-8)
- **Phase 6**: Populate workDate for all posts
- **Phase 7**: Classify all posts as Narrative/Insight
- **Phase 8**: Define clusters and populate cluster field

---

## 📋 Open Tasks for User

### **Before Phase 5 Starts**:
1. Review and classify all 155 posts as Narrative or Insight
2. Determine work dates for all posts (can be approximate)
3. Identify narrative clusters and name them
4. Choose one post to feature on homepage

### **Can Be Done Anytime**:
1. Align legacy images to `robot-[word].webp` format (optional)
2. Standardize existing robo* image names

---

## 💡 Recommendations

### **Slug Word Count**: 6 words maximum (recommended)
- Most titles before colon are 3-6 words
- Provides sufficient context
- Keeps URLs manageable
- Reduces collision risk

### **CSV Location**: `/data/blog-metadata.csv` ✅
- Consistent with existing data files
- Git-tracked for version control
- Easy to find and maintain

### **Featured Article**: Hybrid approach ✅
- Manual control when needed
- Automatic fallback ensures always populated
- Balances editorial control with convenience

---

**Next Step**: Begin Phase 4 implementation with these standards
