# GitHub Pages 404 Error - Troubleshooting Guide

## Issue Description
**Date**: September 11, 2025  
**Symptom**: Site shows 404 error on pipermorgan.ai despite successful GitHub Actions deployment  
**Root Cause**: Next.js static export was disabled in configuration

## The Problem

The site displayed a 404 error even though:
- GitHub Actions showed successful deployment ✅
- The gh-pages branch existed ✅
- GitHub Pages was configured correctly ✅
- CNAME and DNS were properly set up ✅

Investigation revealed the gh-pages branch contained only:
- `.nojekyll` file
- `CNAME` file
- **No website content (missing index.html and other files)**

## Root Cause Analysis

The issue was in `next.config.ts`:
```typescript
// BROKEN - Server-side build (no static files)
const nextConfig: NextConfig = {
  // output: 'export', // ← This was commented out!
  images: {
    unoptimized: false,
    domains: ['localhost'],
  },
```

Without `output: 'export'`, Next.js builds for server deployment and doesn't generate the `./out` directory that GitHub Pages needs.

## The Fix

Enable static export in `next.config.ts`:
```typescript
// FIXED - Static export for GitHub Pages
const nextConfig: NextConfig = {
  output: 'export',  // ← Must be enabled for GitHub Pages
  images: {
    unoptimized: true,  // ← Required for static export
  },
```

## Why Did It Regress?

The regression likely occurred when someone attempted to add API routes or server-side features:

1. **Initial State**: Site worked with static export enabled
2. **Feature Addition Attempt**: Someone tried to add API routes (newsletter signup, email verification, etc.)
3. **Config Change**: They commented out `output: 'export'` to enable server features
4. **API Routes Removed**: The API routes were later deleted (incompatible with GitHub Pages)
5. **Config Not Reverted**: The static export setting remained disabled

Evidence in the codebase:
- Removed API routes: `/src/app/api/newsletter-signup`, `/verify-email`, `/unsubscribe`, etc.
- Comments in config: `"// Disabled to enable API routes and server features"`
- Build errors referencing missing modules: `@/lib/database`, `@/lib/email`

## Prevention Checklist

If you encounter a 404 on GitHub Pages:

1. **Check the gh-pages branch has content**:
   ```bash
   gh api repos/mediajunkie/piper-morgan-website/contents/ --field 'ref=gh-pages'
   # Should show index.html and other files, not just CNAME/.nojekyll
   ```

2. **Verify static export is enabled**:
   ```typescript
   // next.config.ts must have:
   output: 'export'
   ```

3. **Test local build generates out/ directory**:
   ```bash
   npm run build
   ls -la out/  # Should see index.html
   ```

4. **Check deployment logs for the "Exporting" step**:
   ```
   ✓ Exporting (3/3)  # This line confirms static export
   ```

## Key Takeaways

- **GitHub Pages requires static files** - It cannot run Node.js/server code
- **API routes are incompatible** with `output: 'export'`
- **Always verify** the `./out` directory exists after build
- **The deployment can "succeed"** even without generating files (it just deploys nothing)

## Related Files
- `/next.config.ts` - Main configuration file
- `/.github/workflows/deploy.yml` - Deployment workflow (expects `./out` directory)
- `/CLAUDE.md` - Documents that this is a static site with `output: 'export'`