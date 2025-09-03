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

Consider keeping this approach unless the new graphics require photorealistic quality that SVG cannot achieve.

## Testing Checklist

Before deploying new graphics:
- [ ] Test on mobile devices (320px width)
- [ ] Verify fallback PNG loads when WebP unsupported
- [ ] Check Core Web Vitals impact (LCP, CLS)
- [ ] Validate alt text with screen reader
- [ ] Confirm file sizes under target limits

## Tool Recommendations

- **Image Generation**: Test various AI generators for consistent style
- **Optimization**: ImageOptim, Squoosh.app, or CLI tools like `imagemin`
- **Format Conversion**: `cwebp` for WebP generation
- **Performance Testing**: Lighthouse, WebPageTest