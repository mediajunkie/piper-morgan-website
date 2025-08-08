# Component Library Documentation

This documentation covers the reusable UI components built for the pipermorgan.ai website following atomic design principles.

## Design System

### Colors
- **Primary Teal**: `#2DD4BF` - Main brand color for primary actions
- **Primary Orange**: `#FB923C` - Secondary brand color for accents
- **Text Dark**: `#1F2937` - Primary text color
- **Text Light**: `#6B7280` - Secondary text color
- **Background**: `#FFFFFF` - Page background
- **Surface**: `#F9FAFB` - Card/component backgrounds

### Typography
- **Font Family**: Inter (with system font fallbacks)
- **Scale**: 14px to 60px with fluid responsive scaling
- **Line Height**: 1.6 for body text, 1.25 for headings

### Spacing
- **Component Gap**: 1.5rem (24px)
- **Section Gap**: 4rem (64px)
- **Content Padding**: 2rem (32px)

## Atomic Design Structure

```
components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple combinations of atoms
├── organisms/       # Complex UI components
└── index.ts        # Central exports
```

---

## Atoms

### CTAButton

**Purpose**: Primary call-to-action button component with multiple variants and states.

**Import**: `import { CTAButton } from '@/components'`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Button text content |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state with spinner |
| `href` | `string` | - | Link destination (renders as Link or anchor) |
| `external` | `boolean` | `false` | External link (opens in new tab) |
| `onClick` | `() => void` | - | Click handler for button element |

#### Examples

```tsx
// Primary button
<CTAButton variant="primary" size="lg">
  Get Started
</CTAButton>

// Outline button with link
<CTAButton variant="outline" href="/about">
  Learn More
</CTAButton>

// Loading state
<CTAButton loading onClick={handleSubmit}>
  Submitting...
</CTAButton>

// External link
<CTAButton external href="https://github.com/example">
  View on GitHub
</CTAButton>
```

#### Accessibility Features
- Keyboard navigation support
- Focus indicators
- ARIA labels
- Loading state announcements
- External link indicators

---

## Molecules

### Hero

**Purpose**: Hero section component with headline, subheadline, and CTAs.

**Import**: `import { Hero } from '@/components'`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headline` | `string` | - | Main headline text |
| `highlightText` | `string` | - | Accent-colored text block |
| `subheadline` | `string` | - | Description text |
| `primaryCTA` | `{text: string, href: string, external?: boolean}` | - | Primary action button |
| `secondaryCTA` | `{text: string, href: string, external?: boolean}` | - | Secondary action button |
| `background` | `'default' \| 'gradient' \| 'surface'` | `'default'` | Background variant |
| `align` | `'left' \| 'center'` | `'center'` | Text alignment |

#### Examples

```tsx
// Basic hero
<Hero
  headline="Welcome to Our Platform"
  subheadline="Build amazing products with our tools"
  primaryCTA={{
    text: "Get Started",
    href: "/signup"
  }}
/>

// Hero with highlight text
<Hero
  headline="AI Product Management"
  highlightText="That Shows Its Work"
  subheadline="Watch methodology evolve through building-in-public"
  primaryCTA={{
    text: "How It Works",
    href: "/how-it-works"
  }}
  secondaryCTA={{
    text: "Get Updates",
    href: "/newsletter"
  }}
  background="gradient"
/>
```

---

## Organisms

### NewsletterSignup

**Purpose**: Complete newsletter signup form with benefits, validation, and success states.

**Import**: `import { NewsletterSignup } from '@/components'`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Stay Updated"` | Section title |
| `description` | `string` | - | Description text |
| `benefits` | `string[]` | - | List of signup benefits |
| `placeholder` | `string` | `"Enter your email address"` | Input placeholder |
| `submitText` | `string` | `"Subscribe"` | Submit button text |
| `successMessage` | `string` | - | Success confirmation text |
| `privacyNotice` | `string` | `"No spam, unsubscribe at any time."` | Privacy notice |
| `compact` | `boolean` | `false` | Compact layout |
| `background` | `'default' \| 'surface' \| 'dark'` | `'surface'` | Background variant |
| `onSignup` | `(email: string) => void` | - | Success callback |

#### Examples

```tsx
// Basic newsletter signup
<NewsletterSignup
  title="Join Our Newsletter"
  description="Get weekly insights and updates"
  benefits={[
    "Product updates and releases",
    "Behind-the-scenes content",
    "Early access to features"
  ]}
/>

// Dark background variant
<NewsletterSignup
  title="Stay Connected"
  background="dark"
  compact
  onSignup={(email) => {
    // Handle successful signup
    console.log('New subscriber:', email);
  }}
/>
```

#### Features
- Email validation
- Loading states
- Success/error handling
- Responsive design
- Form accessibility
- GDPR-friendly privacy notice

---

## Usage Guidelines

### Accessibility Standards

All components follow WCAG 2.1 AA guidelines:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Clear visual focus states
- **Color Contrast**: Meets minimum contrast ratios
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Responsive Design**: Works across all device sizes

### Performance Considerations

- **No Runtime CSS-in-JS**: Uses Tailwind utility classes for optimal performance
- **Tree Shaking**: Components are individually exportable
- **Lazy Loading**: Images and heavy components are optimized
- **Bundle Size**: Minimal JavaScript footprint

### Best Practices

1. **Consistent Spacing**: Use design tokens for consistent spacing
2. **Semantic HTML**: Use appropriate HTML elements
3. **TypeScript**: All components are fully typed
4. **Error Boundaries**: Wrap complex components in error boundaries
5. **Testing**: Each component should have unit tests

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

## Contributing

When creating new components:

1. Follow atomic design principles
2. Include full TypeScript definitions
3. Add accessibility features
4. Document props and usage examples
5. Test across breakpoints
6. Verify keyboard navigation
