# Accessible Color System Documentation

## Color Accessibility Standards

This project follows **WCAG 2.1 AA** accessibility guidelines, requiring a minimum contrast ratio of:
- **4.5:1** for normal text
- **3:1** for large text (18pt+ or 14pt+ bold)

## Primary Brand Colors

### Teal Color System
- **Background/Buttons**: `#2DD4BF` (primary-teal)
  - Used for: Backgrounds, buttons, decorative elements
  - Maintains brand recognition with original vibrant teal
  
- **Text Color**: `#0F766E` (primary-teal-text) 
  - **Contrast Ratio**: 5.47:1 on white backgrounds ✅
  - **WCAG AA Compliant**: Yes (exceeds 4.5:1 requirement)
  - Used for: All text that needs teal coloring

### Color Usage Guidelines

1. **Always use `text-primary-teal-text`** for text elements
2. **Use `primary-teal`** only for backgrounds and buttons
3. **Never use the original teal for text** - it fails accessibility standards

### Implementation

```css
/* Tailwind Classes */
.text-primary-teal-text  /* #0F766E - Accessible text color */
.bg-primary-teal         /* #2DD4BF - Brand background color */

/* CSS Custom Properties */
--primary-teal-text: #0F766E;
--primary-teal: #2DD4BF;
```

## Accessibility Testing Results

| Color Pair | Contrast Ratio | WCAG AA | WCAG AAA |
|------------|----------------|---------|----------|
| #0F766E on white | 5.47:1 | ✅ Pass | ❌ Fail |
| #2DD4BF on white | 1.86:1 | ❌ Fail | ❌ Fail |

## Component Updates

All components have been updated to use the accessible color variant:
- Navigation links
- Hero section highlights  
- Blog post cards
- CTA buttons (outline variant)
- Footer links
- Newsletter form

---

*Last updated: September 4, 2025*
*WCAG 2.1 AA Compliant*