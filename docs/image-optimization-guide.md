# Image Optimization Guide for Piper Morgan Website

## Current Configuration

The website uses Next.js static export with image optimization disabled (`unoptimized: true`) for GitHub Pages compatibility.

## Diagram & Graphic Guidelines

### For New How-It-Works Graphics

When replacing the current SVG diagrams with AI-generated images:

#### 1. File Format & Location
```
public/images/diagrams/
├── verification-flow.webp (primary)
├── verification-flow.png (fallback)  
├── multi-agent-pattern.webp
├── multi-agent-pattern.png
└── ...
```

#### 2. Optimization Standards
- **Primary Format**: WebP (smaller file size, modern browser support)
- **Fallback Format**: PNG (universal compatibility)
- **Dimensions**: Generate at 2x size for retina displays (e.g., 600x400 display = 1200x800 source)
- **Compression**: Use 85-90% quality for WebP, optimize PNGs with tools like ImageOptim

#### 3. Implementation Pattern
```tsx
// Since Next.js Image is disabled, use standard img with manual optimization
function DiagramImage({ src, alt, width, height }: DiagramProps) {
  return (
    <picture>
      <source srcSet={`/images/diagrams/${src}.webp`} type="image/webp" />
      <img 
        src={`/images/diagrams/${src}.png`}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        loading="lazy"
      />
    </picture>
  );
}
```

#### 4. Accessibility Requirements
- **Alt Text**: Descriptive alternative text for screen readers
- **Loading**: Use `loading="lazy"` for below-fold images
- **Dimensions**: Always specify width/height to prevent layout shift

#### 5. Performance Targets
- **File Size**: <100KB per image (aim for 50-75KB)
- **Load Time**: Images should not impact <1.5s page load target
- **LCP**: Ensure above-fold diagrams load quickly

## SVG vs Raster Decision Matrix

| Use SVG When | Use Raster When |
|-------------|----------------|
| Simple geometric shapes | Complex AI-generated artwork |
| Small file size | Photo-realistic content |  
| Perfect scalability needed | Limited colors/gradients |
| Inline styling required | Animation not needed |

## Current Approach: Inline SVG Components

The existing `MethodologyDiagram.tsx` uses inline SVG, which is optimal for:
- ✅ Zero external HTTP requests
- ✅ Perfect scalability
- ✅ CSS styling integration
- ✅ Small bundle impact

**Recommendation**: Consider keeping this approach unless the new graphics require photorealistic quality that SVG cannot achieve.

## Static Export Considerations

Due to GitHub Pages static export requirements:
- Next.js Image optimization is disabled
- Manual optimization workflow required
- Use standard `<img>` tags with `<picture>` for format fallbacks
- No server-side image processing available

## Testing Checklist

Before deploying new graphics:
- [ ] Test on mobile devices (320px width)
- [ ] Verify fallback PNG loads when WebP unsupported
- [ ] Check Core Web Vitals impact (LCP, CLS)
- [ ] Validate alt text with screen reader
- [ ] Confirm file sizes under target limits
- [ ] Test in various browsers (Safari, Firefox, Chrome)
- [ ] Verify images work in GitHub Pages environment

## Tool Recommendations

### Image Generation & Editing
- **AI Generation**: Test various AI generators for consistent style
- **Manual Editing**: Figma, Sketch, or Photoshop for refinements

### Optimization Tools
- **GUI Tools**: ImageOptim (Mac), Squoosh.app (Web)
- **CLI Tools**: `imagemin`, `sharp-cli`, or custom Node.js scripts
- **WebP Conversion**: `cwebp` command-line tool

### Performance Testing
- **Core Metrics**: Lighthouse (built into Chrome DevTools)
- **Detailed Analysis**: WebPageTest, GTmetrix
- **Local Testing**: `npm run build` then serve static files

## Implementation Best Practices

### Code Examples

**Basic Image Component:**
```tsx
interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  lazy?: boolean;
}

export function OptimizedImage({ src, alt, width, height, lazy = true }: ImageProps) {
  return (
    <picture>
      <source srcSet={`/images/${src}.webp`} type="image/webp" />
      <img
        src={`/images/${src}.png`}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
      />
    </picture>
  );
}
```

**Hero Image (Critical):**
```tsx
export function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <picture>
      <source 
        media="(min-width: 768px)" 
        srcSet={`/images/${src}-desktop.webp`} 
        type="image/webp" 
      />
      <source 
        media="(min-width: 768px)" 
        srcSet={`/images/${src}-desktop.png`} 
      />
      <source srcSet={`/images/${src}-mobile.webp`} type="image/webp" />
      <img
        src={`/images/${src}-mobile.png`}
        alt={alt}
        width={800}
        height={600}
        className="w-full h-auto"
        loading="eager"
        fetchpriority="high"
      />
    </picture>
  );
}
```

## File Size Budgets

### Current Performance Budget
- **Total Page Size**: <1MB
- **Image Budget**: <300KB per page
- **Individual Images**: <100KB each
- **Hero Images**: <150KB (can be larger due to importance)

### Optimization Workflow
1. **Generate/Create**: Source images at 2x display size
2. **Optimize**: Compress to target file size
3. **Convert**: Generate WebP versions
4. **Implement**: Use `<picture>` element pattern
5. **Test**: Verify performance impact
6. **Deploy**: Monitor Core Web Vitals

---

**Last Updated**: September 2025  
**For Technical Questions**: Refer to `CLAUDE.md` troubleshooting section  
**Performance Baseline**: See `/devel/performance-baseline-2025-09-02.md`

*This guide ensures image optimizations maintain the site's excellent Lighthouse scores while providing visual enhancement opportunities.*