# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run type-check       # TypeScript type checking
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Tests
npm test                 # Jest (next/jest, with an @/ alias)

# Build & Deploy
npm run build            # Production build (runs the prebuild step first)
npm run start            # Start production server
npm run build:static     # Static export build (STATIC_EXPORT=true) -- emergency path only
./deploy.sh              # Emergency fallback: static export to the gh-pages branch (see Deployment Process)

# Blog Content
npm run fetch-posts      # Manual: fetch Medium RSS posts (not part of prebuild)
```

`npm run prebuild` runs automatically before `build` and does four things:
`copy-editorial-calendar.js`, `generate-publish-queue-data.js`,
`fetch-linkedin-stats.js`, `check-hero-image-refs.js`. It does NOT fetch Medium posts.

## Architecture Overview

This is a **Next.js 15** website using **App Router**, deployed to **Vercel** (pipermorgan.ai). Public pages are statically generated; API routes under `src/pages/api/` and the `/admin` UI need the server runtime. The site follows **Domain-Driven Design** principles with TypeScript throughout.

### Key Technologies
- **Next.js 15** with App Router, served by Vercel (static export only when `STATIC_EXPORT=true`)
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

## Design Principles

**Human-first, agent-aware.** Every tool, UI, or CLI built for this project is designed for its human primary user first — but architected so agents can also read and call it without needing the rendered surface. In practice:
- A UI's writes should land in an agent-readable store (git-tracked files, a queryable CSV/JSON), not a UI-only datastore.
- No interactive-only surfaces: if a step needs human input, give it a non-interactive equivalent too (a flag, a direct API call).
- Don't trap state — if a dashboard displays data, that data should already be readable directly, without the dashboard.

**Concrete example**: `/admin/calendar/compose` (the editorial admin UI) commits every save directly to `piper-morgan-product` via the GitHub API — the same git history other agents already read. There's no separate sync step, and no risk of the human's edits being invisible to the agents who pick up the work next. This is by design, not incidental.

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

Blog content lives in `src/data/` (`blog-content.json`, `medium-posts.json`; the fetch script updates both) and is read through `src/lib/blog-utils.ts` and related helpers. Medium RSS ingestion is a **manual** step, not an automated or build-time one:

1. `npm run fetch-posts` (`scripts/fetch-blog-posts.js`) fetches the RSS feed and writes `src/data/medium-posts.json`.
2. Review and commit the result. Pushing to `main` deploys it.

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

## Build Configuration

`next.config.ts` (read it before changing build behavior):

- `output: 'export'` is applied **only when `STATIC_EXPORT=true`** (the `build:static` script and `deploy.sh`). Normal dev and Vercel builds keep API routes available.
- `NEXT_PUBLIC_STATIC_EXPORT` is forwarded to the client so `/admin/*` can show a fallback notice instead of a dead login form on a static build.
- Image optimization disabled (`images: { unoptimized: true }`); trailing slashes enabled.
- Build-time ESLint and type-checking are skipped (`ignoreDuringBuilds`, `ignoreBuildErrors`), so run `npm run lint` and `npm run type-check` yourself before pushing.
- Security headers (CSP etc.) are set in `next.config.ts`.

### What needs the server (and so is absent from a static export)

- API routes in `src/pages/api/` (`admin/login|logout|me`, `compose`, `compose/upload`) and `src/middleware.ts`.
- The `/admin` UI, including the editorial compose screen at `/admin/calendar/compose`.

A test file placed under `src/pages/` becomes a Next route. Keep tests elsewhere.

External services: Buttondown/ConvertKit newsletter signup is a direct form submission, Google Analytics is client-side gtag.

## Deployment Process

### Production: Vercel, on every push to `main`

Pushing `main` triggers a Vercel **Production** deployment. Checked 2026-10-05: `gh api repos/mediajunkie/piper-morgan-website/deployments` shows `Production` deployments for each recent `main` commit, and `curl -sI https://pipermorgan.ai` returns `server: Vercel`.

There is no CI-driven deploy: the GitHub Actions workflows (`deploy.yml`, `update-blog-posts.yml`) were removed in July 2026 and `.github/workflows/` no longer exists. Pushing to `main` is therefore a production release. Run `npm test`, `npm run build`, `npm run lint` and `npm run type-check` first.

### Emergency fallback: `./deploy.sh`

Builds a static export (`npm run build:static`) and force-publishes it to the `gh-pages` branch, writing a `CNAME` of `pipermorgan.ai`. The `gh-pages` branch still exists, and a "Delete CNAME" commit landed on it on 2026-10-05, so the domain is currently not claimed by GitHub Pages. Running `deploy.sh` would re-add that CNAME, and a static export drops the API routes and the admin UI, so treat it as a last resort and check with PM first.

## ## SEO & Metadata

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

### **Content updates**
Nothing runs on a schedule. The former daily GitHub Actions job was removed with the workflows; refresh Medium content by running `npm run fetch-posts` and committing.

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
npm run fetch-posts

# Check RSS feed directly
curl https://medium.com/feed/building-piper-morgan
```

**Deployment Issues:**
```bash
# Recent production deployments for main
gh api "repos/mediajunkie/piper-morgan-website/deployments?per_page=5" --jq '.[] | [.environment,.created_at,.sha[0:7]] | @tsv'

# Check what is serving the live site
curl -sI https://pipermorgan.ai | grep -i server
```
Vercel build logs are in the Vercel project dashboard. `./deploy.sh` is the emergency fallback only (see Deployment Process).

## Type Safety

The codebase maintains strict TypeScript throughout:
- Domain models in `src/types/domain.ts`
- Component prop interfaces exported alongside components
- SEO metadata typing with proper OpenGraph/Twitter support
- Performance metrics modeling for future analytics integration