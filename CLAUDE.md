# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Build & Deploy
npm run fetch-posts      # Fetch latest Medium blog posts
npm run build            # Build for production (includes prebuild step)
npm run start            # Start production server
./deploy.sh              # Manual deployment to GitHub Pages

# Blog Content
npm run prebuild         # Runs automatically before build - fetches Medium posts
node scripts/fetch-blog-posts.js  # Manually fetch blog posts
```

## Architecture Overview

This is a **Next.js 15** static website using **App Router** with static site generation for GitHub Pages deployment. The site follows **Domain-Driven Design** principles with TypeScript throughout.

### Key Technologies
- **Next.js 15** with App Router and static export (`output: 'export'`)
- **TypeScript** with strict type checking
- **Tailwind CSS 4** for styling
- **Atomic Design** component architecture (atoms → molecules → organisms)
- **Domain-Driven Design** with proper type modeling in `src/types/domain.ts`

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Navigation/Footer
│   ├── page.tsx           # Homepage
│   ├── about/page.tsx     # About page
│   ├── blog/              # Blog with Medium integration
│   ├── how-it-works/      # Methodology page
│   └── newsletter/        # Newsletter signup
├── components/            # Atomic Design component library
│   ├── atoms/             # Basic building blocks (CTAButton)
│   ├── molecules/         # Simple combinations (Hero, BlogPostCard)
│   ├── organisms/         # Complex components (NewsletterSignup)
│   ├── Navigation.tsx     # Site navigation
│   ├── Footer.tsx         # Site footer
│   └── index.ts           # Central component exports
├── lib/                   # Utility functions
│   ├── domain-utils.ts    # SEO metadata generation
│   └── fetch-medium-posts.ts  # Medium RSS integration
├── types/                 # TypeScript domain models
│   └── domain.ts          # Complete domain type definitions
└── data/
    └── medium-posts.json  # Cached Medium blog posts
```

## Domain Architecture

The codebase follows Domain-Driven Design with comprehensive type modeling:

- **Domain Types**: All business logic types in `src/types/domain.ts`
- **SEO Management**: Centralized SEO metadata generation in `src/lib/domain-utils.ts`
- **Content Integration**: Medium RSS feed integration with fallback content
- **Component System**: Atomic design with full TypeScript props interfaces

### Key Domain Concepts
- `WebsiteContent`: Main aggregator for all site content
- `BlogPost`: Medium RSS feed integration with local caching
- `SEOMetadata`: Structured SEO data management
- `Integration`: Configuration for external services (ConvertKit, Medium, Analytics)

## Blog Content System

The blog integrates with Medium's RSS feed for the "building-piper-morgan" publication:

1. **Build-time Fetch**: `scripts/fetch-blog-posts.js` runs automatically before build
2. **Local Caching**: Posts cached in `src/data/medium-posts.json`
3. **Fallback Content**: Hardcoded fallback articles if RSS fetch fails
4. **Content Processing**: Extracts excerpts, reading time, tags from RSS data

## Component Development

Components follow **Atomic Design** with full TypeScript definitions:

### Adding New Components
1. Choose appropriate atomic level (atoms/molecules/organisms)
2. Create component with full TypeScript props interface
3. Add to `src/components/index.ts` exports
4. Follow existing patterns for accessibility and styling

### Component Guidelines
- Use Tailwind utility classes (no CSS-in-JS)
- Include proper TypeScript props interfaces
- Follow accessibility standards (WCAG 2.1 AA)
- Export both component and props type from index.ts

## Static Site Configuration

**Important**: This site uses static export for GitHub Pages:

- `next.config.ts` configured with `output: 'export'`
- Image optimization disabled (`images: { unoptimized: true }`)
- Trailing slashes enabled for better URL consistency
- Build-time linting/type-checking skipped (handled separately)

## Deployment Process

### **Automatic Deployment**
Three automated deployment triggers:

1. **Push to Main**: GitHub Actions deploys on every commit
2. **Scheduled Content Updates**: Daily at 7:30 PM UTC via GitHub Actions
3. **Manual Trigger**: Via GitHub Actions UI (`workflow_dispatch`)

### **Manual Deployment** 
Emergency fallback deployment:
```bash
./deploy.sh    # Manual deployment script
```

### **Deployment Architecture (Option D - Scheduled Rebuilds)**
The site uses a **two-workflow system** for automated content updates:

1. **`update-blog-posts.yml`**: 
   - Runs daily at `cron: '30 19 * * *'` (7:30 PM UTC)
   - Fetches latest Medium posts via RSS
   - Only commits if new posts detected
   - Triggers site rebuild via `repository_dispatch`

2. **`deploy.yml`**:
   - Triggered by push, manual trigger, or blog updates
   - Runs full build process (including RSS fetch)
   - Deploys to GitHub Pages using `peaceiris/actions-gh-pages@v4`

**Key Benefits**: 
- Fresh Medium content daily without manual intervention
- Static site performance with dynamic content freshness
- Error handling with automatic GitHub issue creation on failures

## SEO & Metadata

Centralized SEO management through `src/lib/domain-utils.ts`:

- `generateSEOMetadata()`: Creates complete SEO data objects
- `getDefaultWebsiteContent()`: Site-wide metadata defaults
- OpenGraph and Twitter Card support
- Canonical URL management

## Content Update Strategy

### **Medium Integration Details**

The `scripts/fetch-blog-posts.js` script:
- Fetches from `https://medium.com/feed/building-piper-morgan`
- Processes RSS content to extract clean excerpts
- Handles reading time extraction from content
- Falls back to hardcoded articles if RSS fails
- Caches results in `src/data/medium-posts.json`

### **Automated Content Updates**
- **Schedule**: Daily at 7:30 PM UTC via GitHub Actions
- **Process**: RSS fetch → change detection → commit → deploy
- **Error Handling**: Creates GitHub issues on failures with troubleshooting steps
- **Manual Trigger**: `gh workflow run "Update Medium Blog Posts"`

### **Blog Content Access**
- **Direct URL**: `/blog` (RSS content with error boundaries)
- **Navigation**: Not currently in main navigation (content strategy decision)
- **Integration Points**: Newsletter signup pages link to blog content
- **Error Boundaries**: Graceful fallback if RSS unavailable

## Troubleshooting

### **Common Build Issues**

**Build Failures:**
```bash
# Check local build
npm run build

# Fix TypeScript errors
npm run type-check

# Fix linting issues  
npm run lint:fix
```

**Content Update Failures:**
```bash
# Test RSS feed manually
node scripts/fetch-blog-posts.js

# Check RSS feed directly
curl https://medium.com/feed/building-piper-morgan

# Manual workflow trigger
gh workflow run "Update Medium Blog Posts"
```

**Deployment Issues:**
```bash
# View recent workflow runs
gh run list --limit 10

# Check specific run logs
gh run view <run-id> --log

# Emergency manual deployment
./deploy.sh
```

### **GitHub Actions Troubleshooting**

**Permission Errors (403):**
- Verify `contents: write` permission in workflow files
- Check repository Actions settings allow workflows

**Workflow Not Running:**
- Ensure repository is active (workflows pause on inactivity)
- Verify workflow file syntax: `gh workflow list`
- Check if scheduled workflows are enabled in repository settings

**Build or Deploy Failures:**
- Check workflow logs for specific errors
- Automated GitHub issues created with troubleshooting steps
- Review recent commits for breaking changes

## Type Safety

The codebase maintains strict TypeScript throughout:
- Domain models in `src/types/domain.ts`
- Component prop interfaces exported alongside components
- SEO metadata typing with proper OpenGraph/Twitter support
- Performance metrics modeling for future analytics integration