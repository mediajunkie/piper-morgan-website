# Contributing to Piper Morgan Website

## Overview

This guide covers how to contribute content updates, bug fixes, and improvements to the Piper Morgan website. The site uses Next.js 15 with static export and automated deployment to GitHub Pages.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- GitHub account

### Development Setup
```bash
# Clone repository
git clone https://github.com/mediajunkie/piper-morgan-website.git
cd piper-morgan-website

# Install dependencies
npm ci

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## Content Update Process

### 1. Blog Content (Medium RSS)
**Automated**: Blog content updates automatically via scheduled GitHub Actions.

**Manual Update (if needed):**
```bash
# Fetch latest Medium posts
npm run fetch-posts

# Or run script directly
node scripts/fetch-blog-posts.js
```

**Process**: 
- Daily automated fetch at 7:30 PM UTC
- Content cached in `src/data/medium-posts.json`
- Triggers automatic site rebuild if new posts found

### 2. Page Content Updates

**Static Content**: Edit React components directly in `src/app/`

**Common Files:**
- `src/app/page.tsx` - Homepage
- `src/app/how-it-works/page.tsx` - Methodology page
- `src/app/what-weve-learned/page.tsx` - Journey insights
- `src/app/get-involved/page.tsx` - Engagement page

**Process:**
1. Edit content in development
2. Test locally with `npm run dev`
3. Commit and push changes
4. Automatic deployment via GitHub Actions

### 3. Navigation Changes

**Location**: `src/components/Navigation.tsx`

**Adding New Pages:**
```tsx
const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'What We\'ve Learned', href: '/what-weve-learned' },
  { label: 'Get Involved', href: '/get-involved' },
  // Add new items here
];
```

**Important**: Follow the [Navigation Strategy](/docs/navigation-strategy.md) for evolution planning.

## Development Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/content-update-description

# Make changes and test
npm run dev

# Run quality checks
npm run type-check
npm run lint

# Build test
npm run build
```

### Code Quality
**Required checks before committing:**
```bash
npm run type-check    # TypeScript validation
npm run lint         # ESLint validation
npm run build        # Production build test
```

### Component Development

**Follow Atomic Design principles:**
- `src/components/atoms/` - Basic elements (buttons, inputs)
- `src/components/molecules/` - Simple combinations (cards, forms)
- `src/components/organisms/` - Complex sections (navigation, heroes)

**Component Template:**
```tsx
interface ComponentProps {
  /** Description of prop */
  title: string;
  /** Optional prop with default */
  variant?: 'primary' | 'secondary';
}

export function Component({ title, variant = 'primary' }: ComponentProps) {
  return (
    <div className="component-wrapper">
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}

export default Component;
```

## Content Guidelines

### Writing Style
- **Building-in-Public Voice**: Transparent, honest, systematic
- **Technical Accuracy**: Verify methodology descriptions
- **Accessibility**: Use semantic HTML and descriptive alt text
- **SEO Optimization**: Include relevant keywords naturally

### Image Standards
- **Format**: WebP with PNG fallback (see [Image Optimization Guide](/docs/image-optimization-guide.md))
- **Size**: <100KB per image, <150KB for hero images
- **Dimensions**: Specify width/height to prevent layout shift
- **Alt Text**: Descriptive for screen readers

### Typography
- **Headings**: Use semantic hierarchy (h1 → h2 → h3)
- **Body Text**: 16px base, 1.6 line height
- **Code**: Use `<code>` tags for inline code, code blocks for examples

## Deployment

### Automatic Deployment
**Triggers:**
- Push to `main` branch
- Scheduled content updates (daily)
- Manual GitHub Actions trigger

### Manual Deployment (Emergency)
```bash
# If GitHub Actions fails
./deploy.sh
```

### Monitoring
```bash
# Check workflow status
gh run list --limit 5

# View specific run
gh run view <run-id>

# Manual trigger
gh workflow run "Deploy Piper Morgan Website to GitHub Pages"
```

## Error Handling

### Build Failures
**Common Issues:**
1. **TypeScript errors**: Run `npm run type-check`
2. **Linting issues**: Run `npm run lint:fix`
3. **Import errors**: Check component export paths
4. **Medium RSS failures**: Usually temporary, check fallback content

**Solutions:**
```bash
# Debug build locally
npm run build

# Check specific error logs
npm run type-check
npm run lint
```

### Content Issues
**Missing Medium Posts:**
- Check `src/data/medium-posts.json` for cached content
- Verify RSS feed: https://medium.com/feed/building-piper-morgan
- Fallback content available in BlogErrorBoundary component

**Deployment Failures:**
- Automatic GitHub issues created with troubleshooting steps
- Check GitHub Actions logs for specific errors
- Use manual deployment script as backup

## Testing

### Local Testing
```bash
# Development server
npm run dev

# Production build test
npm run build
npm run start
```

### Pre-Commit Checklist
- [ ] Content displays correctly on mobile and desktop
- [ ] All links work and external links open in new tabs
- [ ] Images load with proper alt text
- [ ] TypeScript compilation succeeds
- [ ] Linting passes without errors
- [ ] Build completes successfully
- [ ] Core Web Vitals remain strong (Lighthouse)

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Focus indicators visible
- [ ] Semantic HTML structure

## Documentation Updates

### When to Update Docs
- **New Features**: Update relevant documentation
- **Architecture Changes**: Update `CLAUDE.md` and `/docs/`
- **Process Changes**: Update this contributing guide
- **Navigation Changes**: Update navigation strategy doc

### Documentation Files
- `CLAUDE.md` - Technical guidance for AI development
- `/docs/navigation-strategy.md` - Site architecture and evolution
- `/docs/image-optimization-guide.md` - Image standards and workflows
- `/docs/contributing.md` - This file

## Support

### Getting Help
1. **Technical Issues**: Check `CLAUDE.md` troubleshooting section
2. **Content Questions**: Review existing page structure and patterns
3. **Build Problems**: GitHub Actions logs provide detailed error info
4. **Process Questions**: This contributing guide

### Reporting Issues
**GitHub Issues for:**
- Content bugs or inaccuracies
- Build or deployment failures
- Feature requests
- Documentation improvements

**Include:**
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant

---

**Last Updated**: September 2025  
**Questions**: Create GitHub issue or check existing documentation  
**Site Architecture**: See [Navigation Strategy](/docs/navigation-strategy.md)  

*This project values systematic excellence, transparent development, and community contribution. Thank you for helping improve the Piper Morgan website!*