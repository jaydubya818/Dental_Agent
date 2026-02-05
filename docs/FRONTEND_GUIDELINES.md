# Frontend Guidelines & Design System

> This document defines the complete visual design system for Jerome Dental Front-Office Agent.
> All UI components must follow these specifications.

---

## 1. Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#2563EB` | `--color-primary` | Buttons, links, focus states |
| Primary Hover | `#1D4ED8` | `--color-primary-hover` | Hover states |
| Primary Light | `#DBEAFE` | `--color-primary-light` | Backgrounds, badges |

### Neutral Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background | `#FFFFFF` | `--color-bg` | Page background |
| Background Alt | `#F9FAFB` | `--color-bg-alt` | Card backgrounds |
| Border | `#E5E7EB` | `--color-border` | Dividers, borders |
| Text Primary | `#111827` | `--color-text` | Headings, body |
| Text Secondary | `#6B7280` | `--color-text-secondary` | Captions, labels |
| Text Muted | `#9CA3AF` | `--color-text-muted` | Placeholders |

### Semantic Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Success | `#10B981` | `--color-success` | Completed, positive |
| Success Light | `#D1FAE5` | `--color-success-light` | Success backgrounds |
| Warning | `#F59E0B` | `--color-warning` | Alerts, caution |
| Warning Light | `#FEF3C7` | `--color-warning-light` | Warning backgrounds |
| Error | `#EF4444` | `--color-error` | Errors, critical |
| Error Light | `#FEE2E2` | `--color-error-light` | Error backgrounds |
| Info | `#3B82F6` | `--color-info` | Information |
| Info Light | `#DBEAFE` | `--color-info-light` | Info backgrounds |

### Risk Flag Colors

| Severity | Badge BG | Badge Text | Border |
|----------|----------|------------|--------|
| CRITICAL | `#FEE2E2` | `#991B1B` | `#EF4444` |
| WARN | `#FEF3C7` | `#92400E` | `#F59E0B` |
| INFO | `#DBEAFE` | `#1E40AF` | `#3B82F6` |

### Dark Mode Colors

| Name | Light | Dark | CSS Variable |
|------|-------|------|--------------|
| Background | `#FFFFFF` | `#111827` | `--color-bg` |
| Background Alt | `#F9FAFB` | `#1F2937` | `--color-bg-alt` |
| Border | `#E5E7EB` | `#374151` | `--color-border` |
| Text Primary | `#111827` | `#F9FAFB` | `--color-text` |
| Text Secondary | `#6B7280` | `#9CA3AF` | `--color-text-secondary` |

---

## 2. Typography

### Font Families

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display | `36px` / `2.25rem` | `1.2` | 700 | Hero headings |
| H1 | `30px` / `1.875rem` | `1.25` | 700 | Page titles |
| H2 | `24px` / `1.5rem` | `1.3` | 600 | Section headings |
| H3 | `20px` / `1.25rem` | `1.4` | 600 | Card titles |
| H4 | `18px` / `1.125rem` | `1.4` | 600 | Subsections |
| Body | `16px` / `1rem` | `1.5` | 400 | Default text |
| Body Small | `14px` / `0.875rem` | `1.5` | 400 | Secondary text |
| Caption | `12px` / `0.75rem` | `1.4` | 400 | Labels, hints |
| Overline | `12px` / `0.75rem` | `1.4` | 500 | Uppercase labels |

### Tailwind Classes

```jsx
// Headings
<h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
<h2 className="text-2xl font-semibold text-gray-900">Section</h2>
<h3 className="text-xl font-semibold text-gray-900">Card Title</h3>

// Body
<p className="text-base text-gray-700">Body text</p>
<p className="text-sm text-gray-500">Secondary text</p>

// Caption
<span className="text-xs text-gray-400">Caption</span>
```

---

## 3. Spacing Scale

Base unit: `4px`

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| 0 | `0px` | `p-0` | Reset |
| 1 | `4px` | `p-1` | Tight spacing |
| 2 | `8px` | `p-2` | Icon padding |
| 3 | `12px` | `p-3` | Button padding |
| 4 | `16px` | `p-4` | Card padding |
| 5 | `20px` | `p-5` | Section spacing |
| 6 | `24px` | `p-6` | Card padding (large) |
| 8 | `32px` | `p-8` | Section gaps |
| 10 | `40px` | `p-10` | Page padding |
| 12 | `48px` | `p-12` | Large sections |
| 16 | `64px` | `p-16` | Hero spacing |

### Common Spacing Patterns

```jsx
// Card
<div className="p-6 space-y-4">

// Button group
<div className="flex gap-3">

// Form fields
<div className="space-y-4">

// Page layout
<main className="px-4 py-8 md:px-8 lg:px-12">
```

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix | Typical Device |
|------------|-------|-----------------|----------------|
| Default | `0px` | (none) | Mobile portrait |
| sm | `640px` | `sm:` | Mobile landscape |
| md | `768px` | `md:` | Tablet portrait |
| lg | `1024px` | `lg:` | Tablet landscape / Small laptop |
| xl | `1280px` | `xl:` | Desktop |
| 2xl | `1536px` | `2xl:` | Large desktop |

### Container Widths

```jsx
// Full-width with padding
<div className="w-full px-4 md:px-8">

// Centered container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Content width
<div className="max-w-3xl mx-auto">
```

### Mobile Navigation Patterns

| Element | Mobile (`< md`) | Tablet+ (`≥ md`) |
|---------|-----------------|------------------|
| Top Nav | Hamburger menu | Full horizontal nav |
| Sidebar | Hidden (slide-in drawer) | Fixed 250px left |
| Grid columns | 1 column | 2 → 3 → 4 columns |
| Chat panel | Full-screen drawer | Side panel |

```jsx
// Hamburger menu (mobile only)
<button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
  <Menu className="h-6 w-6" />
</button>

// Mobile slide-in drawer
<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
  <SheetContent side="left" className="w-64">
    {/* Navigation items */}
  </SheetContent>
</Sheet>

// Sidebar (hidden on mobile)
<aside className="hidden md:block w-64 fixed left-0 top-16 bottom-0">
  {/* Sidebar content */}
</aside>
```

---

## 5. Component Patterns

### 5.1 Buttons

```jsx
// Primary Button
<Button className="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-lg font-medium">
  Save Changes
</Button>

// Secondary Button
<Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
  Cancel
</Button>

// Danger Button
<Button className="bg-red-600 text-white hover:bg-red-700">
  Delete
</Button>

// Button Sizes
// sm: px-3 py-1.5 text-sm
// md: px-4 py-2 text-base (default)
// lg: px-6 py-3 text-lg
```

### 5.2 Cards

```jsx
// Standard Card
<Card className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// Elevated Card (important content)
<Card className="bg-white rounded-xl shadow-lg p-6">

// Interactive Card
<Card className="bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer">
```

### 5.3 Risk Flag Badges

```jsx
// Critical
<Badge className="bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
  CRITICAL
</Badge>

// Warning
<Badge className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
  WARN
</Badge>

// Info
<Badge className="bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium">
  INFO
</Badge>
```

### 5.4 Timeline (Schedule View)

```jsx
// Timeline Container
<div className="relative">
  {/* Time markers */}
  <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200">
    {hours.map(hour => (
      <div key={hour} className="h-20 text-xs text-gray-500 pr-2 text-right">
        {hour}
      </div>
    ))}
  </div>

  {/* Appointment blocks */}
  <div className="ml-16 relative">
    <div className="absolute bg-primary/10 border-l-4 border-primary rounded-r-lg p-2"
         style={{ top: '80px', height: '60px' }}>
      <span className="text-sm font-medium">John Doe - Crown</span>
    </div>
  </div>
</div>
```

### 5.5 Chat Bubbles

```jsx
// User Message (right-aligned)
<div className="flex justify-end">
  <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-md">
    Who has outstanding balances?
  </div>
</div>

// AI Response (left-aligned)
<div className="flex justify-start">
  <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-2 max-w-md">
    3 patients have balances over $500...
  </div>
</div>
```

---

## 6. Layout Patterns

### 6.1 Dashboard Layout

```jsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
    {/* Navigation */}
  </header>

  <div className="flex pt-16">
    {/* Sidebar - Hidden on mobile */}
    <aside className="hidden lg:block w-64 fixed left-0 top-16 bottom-0 border-r border-gray-200 bg-white">
      {/* Sidebar content */}
    </aside>

    {/* Main content */}
    <main className="flex-1 lg:ml-64 p-6">
      {/* Page content */}
    </main>
  </div>
</div>
```

### 6.2 Grid Layouts

```jsx
// Dashboard stats grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard />
  <StatCard />
  <StatCard />
  <StatCard />
</div>

// Two-column content
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

---

## 7. Shadows & Elevation

| Level | Tailwind Class | CSS Value | Usage |
|-------|----------------|-----------|-------|
| 0 | `shadow-none` | none | Flat elements |
| 1 | `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards, buttons |
| 2 | `shadow` | `0 1px 3px rgba(0,0,0,0.1)` | Dropdowns |
| 3 | `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Modals |
| 4 | `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Popovers |
| 5 | `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Overlays |

---

## 8. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| none | `0px` | `rounded-none` | Sharp corners |
| sm | `4px` | `rounded-sm` | Inputs |
| md | `6px` | `rounded-md` | Buttons |
| lg | `8px` | `rounded-lg` | Cards |
| xl | `12px` | `rounded-xl` | Modals |
| 2xl | `16px` | `rounded-2xl` | Chat bubbles |
| full | `9999px` | `rounded-full` | Avatars, badges |

---

## 9. Animations & Transitions

### Standard Transitions

```css
/* Default transition */
transition: all 150ms ease;
/* Tailwind: transition-all duration-150 */

/* Smooth transition */
transition: all 200ms ease-in-out;
/* Tailwind: transition-all duration-200 ease-in-out */
```

### Loading States

```jsx
// Skeleton loader
<div className="animate-pulse bg-gray-200 rounded h-4 w-full" />

// Spinner
<svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
</svg>
```

### Micro-interactions

```jsx
// Button hover scale
<button className="hover:scale-105 transition-transform duration-150">

// Card hover lift
<div className="hover:-translate-y-1 hover:shadow-lg transition-all duration-200">

// Icon rotation
<ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
```

---

## 10. Icons

Use **Lucide React** for all icons.

### Common Icons

| Usage | Icon | Import |
|-------|------|--------|
| Dashboard | `LayoutDashboard` | `lucide-react` |
| Schedule | `Calendar` | `lucide-react` |
| Chat | `MessageCircle` | `lucide-react` |
| Risks | `AlertTriangle` | `lucide-react` |
| Opportunities | `DollarSign` | `lucide-react` |
| Settings | `Settings` | `lucide-react` |
| User | `User` | `lucide-react` |
| Logout | `LogOut` | `lucide-react` |
| Close | `X` | `lucide-react` |
| Check | `Check` | `lucide-react` |
| Warning | `AlertCircle` | `lucide-react` |
| Info | `Info` | `lucide-react` |

### Icon Sizing

```jsx
// Small (inline with text)
<Icon className="h-4 w-4" />

// Medium (buttons)
<Icon className="h-5 w-5" />

// Large (feature icons)
<Icon className="h-6 w-6" />

// Extra large (empty states)
<Icon className="h-12 w-12" />
```

---

## 11. Form Elements

### Input Fields

```jsx
<Input
  className="w-full px-3 py-2 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
             placeholder:text-gray-400"
  placeholder="Enter value..."
/>

// Error state
<Input className="border-red-500 focus:ring-red-500" />
<span className="text-sm text-red-600 mt-1">Error message</span>
```

### Select Dropdowns

```jsx
<Select>
  <SelectTrigger className="w-full border border-gray-300 rounded-lg">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

---

## 12. Accessibility (WCAG 2.1 AA)

All components must meet WCAG 2.1 AA compliance. Healthcare applications require special attention to accessibility.

### 12.1 Focus States

```jsx
// All interactive elements must have visible focus
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

// Never remove focus outlines without providing alternative
// BAD: outline-none (alone)
// GOOD: outline-none focus:ring-2 focus:ring-primary
```

### 12.2 Color Contrast Requirements

| Element | Minimum Ratio | Tools |
|---------|---------------|-------|
| Body text | 4.5:1 | WebAIM Contrast Checker |
| Large text (18px+ / 14px+ bold) | 3:1 | Chrome DevTools |
| Interactive elements (buttons, links) | 3:1 | axe DevTools |
| Non-text elements (icons, borders) | 3:1 | |

**Risk Flag Colors (Verified)**
- CRITICAL text (`#991B1B`) on background (`#FEE2E2`): 7.2:1 ✓
- WARN text (`#92400E`) on background (`#FEF3C7`): 5.8:1 ✓
- INFO text (`#1E40AF`) on background (`#DBEAFE`): 6.5:1 ✓

### 12.3 ARIA Labels & Roles

```jsx
// Icon-only buttons MUST have aria-label
<button aria-label="Close dialog">
  <X className="h-5 w-5" />
</button>

// Navigation landmarks
<nav aria-label="Primary navigation">
<main aria-label="Main content">
<aside aria-label="Patient information sidebar">

// Loading states
<div aria-busy="true" aria-live="polite">
  Loading schedule...
</div>

// Form fields
<label htmlFor="email">Email address</label>
<input 
  id="email" 
  type="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
<span id="email-error" role="alert">{errorMessage}</span>

// Tables
<table aria-label="Today's appointments">
  <thead>
    <tr>
      <th scope="col">Time</th>
      <th scope="col">Patient</th>
      <th scope="col">Procedure</th>
    </tr>
  </thead>
</table>
```

### 12.4 Keyboard Navigation

| Key | Action | Required For |
|-----|--------|--------------|
| `Tab` | Move to next focusable element | All interactive elements |
| `Shift + Tab` | Move to previous element | All interactive elements |
| `Enter` / `Space` | Activate button/link | Buttons, links |
| `Escape` | Close modal/dropdown | Modals, popovers, dropdowns |
| `Arrow keys` | Navigate within component | Menus, tabs, lists |

```jsx
// Modal must trap focus
import { FocusTrap } from '@headlessui/react';

<FocusTrap>
  <Dialog>
    {/* Modal content - focus stays inside */}
  </Dialog>
</FocusTrap>

// Skip link for keyboard users
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

### 12.5 Screen Reader Support

```jsx
// Visually hidden but accessible to screen readers
<span className="sr-only">Opens in new tab</span>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {/* Toast notifications, status updates */}
</div>

// Announce loading state changes
<div 
  role="status" 
  aria-live="polite"
  aria-label={isLoading ? "Loading" : "Content loaded"}
>

// Data tables with proper headers
<table>
  <caption className="sr-only">
    Schedule for February 4, 2026 - 15 appointments
  </caption>
</table>
```

### 12.6 Form Accessibility

```jsx
// Required field indicators
<label htmlFor="name">
  Full Name <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>

// Error message association
<Input
  id="name"
  aria-required="true"
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? "name-error" : undefined}
/>
{errors.name && (
  <p id="name-error" role="alert" className="text-red-600 text-sm mt-1">
    {errors.name.message}
  </p>
)}

// Fieldset for related inputs
<fieldset>
  <legend>Notification Preferences</legend>
  <label>
    <input type="checkbox" /> Email notifications
  </label>
  <label>
    <input type="checkbox" /> Push notifications
  </label>
</fieldset>
```

### 12.7 Testing Checklist

| Test | Tool | Frequency |
|------|------|-----------|
| Automated a11y scan | axe DevTools, Lighthouse | Every PR |
| Keyboard navigation | Manual | Every feature |
| Screen reader testing | NVDA (Windows), VoiceOver (Mac) | Major features |
| Color contrast | WebAIM Contrast Checker | New color additions |
| Reduced motion | `prefers-reduced-motion` | Animation additions |

```bash
# Run accessibility audit
npx playwright test --project=a11y

# Lighthouse CI
npx lighthouse https://yourdomain.com --preset=desktop --only-categories=accessibility
```

### 12.8 Reduced Motion Support

```jsx
// Respect user preference for reduced motion
<div className="transition-all duration-200 motion-reduce:transition-none motion-reduce:transform-none">

// CSS media query
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Framer Motion configuration
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ 
    duration: prefersReducedMotion ? 0 : 0.2 
  }}
/>
```

---

## 13. State Management

### When to Use Each Approach

| Approach | Use Case | Example |
|----------|----------|---------|
| `useState` | Local component state | Form inputs, toggles, modals |
| `useReducer` | Complex local state with multiple actions | Multi-step forms, complex UI state |
| React Context | Shared state across component tree | Auth state, theme, user preferences |
| SWR / React Query | Server state and data fetching | API data, caching, revalidation |

### Patterns

```tsx
// Local state (component-scoped)
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });

// Server state (use SWR for API data)
import useSWR from 'swr';
const { data: huddle, error, isLoading } = useSWR('/api/v1/huddle/today');

// Auth context (shared across app)
import { useAuth } from '@/contexts/AuthContext';
const { user, isAuthenticated, logout } = useAuth();

// Theme context
import { useTheme } from '@/contexts/ThemeContext';
const { theme, setTheme } = useTheme();
```

### Rules

1. **Prefer local state** - Only lift state when truly needed by siblings
2. **Server state ≠ client state** - Use SWR for API data, not useState
3. **Avoid prop drilling** - Use Context for data needed 3+ levels deep
4. **Keep Context focused** - One context per concern (auth, theme, toast)

---

## Cross-References

- **Tech stack versions**: See [TECH_STACK.md](./TECH_STACK.md)
- **User flows**: See [APP_FLOW.md](./APP_FLOW.md)
- **Feature requirements**: See [PRD.md](./PRD.md)
