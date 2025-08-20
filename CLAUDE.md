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

1. **Automatic**: GitHub Actions on push to main
2. **Manual**: Run `./deploy.sh` script
   - Builds site with `npm run build`
   - Copies to temp directory with CNAME file
   - Force pushes to `gh-pages` branch

## SEO & Metadata

Centralized SEO management through `src/lib/domain-utils.ts`:

- `generateSEOMetadata()`: Creates complete SEO data objects
- `getDefaultWebsiteContent()`: Site-wide metadata defaults
- OpenGraph and Twitter Card support
- Canonical URL management

## Medium Integration Details

The `scripts/fetch-blog-posts.js` script:
- Fetches from `https://medium.com/feed/building-piper-morgan`
- Processes RSS content to extract clean excerpts
- Handles reading time extraction from content
- Falls back to hardcoded articles if RSS fails
- Caches results in `src/data/medium-posts.json`

## Type Safety

The codebase maintains strict TypeScript throughout:
- Domain models in `src/types/domain.ts`
- Component prop interfaces exported alongside components
- SEO metadata typing with proper OpenGraph/Twitter support
- Performance metrics modeling for future analytics integration