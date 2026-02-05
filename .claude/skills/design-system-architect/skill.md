---
name: design-system-architect
description: Build and maintain comprehensive design systems with tokens, components, documentation, and governance. Specializes in scalable design systems for React, Vue, and Angular applications with Storybook integration.
author: SellerFin Team
license: MIT
---

# Design System Architect

Create, maintain, and scale design systems that ensure consistency, efficiency, and quality across digital products. This skill focuses on building comprehensive design systems with proper governance, documentation, and developer experience.

## Core Responsibilities

### 1. System Foundation
- Define design principles and values
- Create design token architecture
- Establish naming conventions
- Set up version control strategy
- Plan migration pathways

### 2. Component Architecture
- Design atomic component hierarchy
- Create flexible and composable components
- Implement design token integration
- Ensure accessibility compliance
- Document usage guidelines

### 3. Documentation & Tooling
- Comprehensive style guides
- Interactive component documentation
- Usage examples and guidelines
- Developer documentation
- Design asset management

### 4. Governance & Maintenance
- Design system team coordination
- Contribution guidelines
- Review and approval processes
- Version management
- Breaking change communication

## Design System Structure

### Foundation Layer
```
foundation/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   ├── shadows.json
│   └── motion.json
├── themes/
│   ├── light.json
│   ├── dark.json
│   └── high-contrast.json
└── assets/
    ├── icons/
    ├── illustrations/
    └── logos/
```

### Component Layer
```
components/
├── primitives/
│   ├── button/
│   ├── input/
│   ├── select/
│   └── checkbox/
├── patterns/
│   ├── navigation/
│   ├── cards/
│   ├── forms/
│   └── tables/
└── layouts/
    ├── grid/
    ├── stack/
    └── container/
```

### Documentation Layer
```
docs/
├── principles/
├── guidelines/
├── components/
├── patterns/
└── resources/
```

## Design Tokens

### Color System
```json
{
  "color": {
    "brand": {
      "primary": {
        "50": "#f0f9ff",
        "100": "#e0f2fe",
        "500": "#0ea5e9",
        "900": "#0c4a6e"
      }
    },
    "semantic": {
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444",
      "info": "#3b82f6"
    }
  }
}
```

### Typography Scale
```json
{
  "typography": {
    "fontFamily": {
      "sans": ["Inter", "system-ui", "sans-serif"],
      "mono": ["JetBrains Mono", "monospace"]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  }
}
```

### Spacing Scale
```json
{
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem",
    "24": "6rem"
  }
}
```

## Component Standards

### Component Structure
Each component should include:
1. **Props Interface** - Clear TypeScript definitions
2. **Variants** - Different visual styles
3. **States** - Interactive states (hover, focus, disabled)
4. **Accessibility** - ARIA attributes and keyboard navigation
5. **Documentation** - Usage examples and guidelines

### Button Component Example
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button'
}) => {
  // Implementation with design tokens
}
```

### Component Documentation Template
```markdown
# Component Name

Brief description of the component and its purpose.

## Usage

```jsx
<Button variant="primary" size="md">
  Click me
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | Visual style variant |
| size | string | 'md' | Size variation |
| disabled | boolean | false | Disabled state |

## Accessibility

- Keyboard navigation support
- Screen reader compatible
- Focus management
- ARIA attributes

## Design Guidelines

- When to use this component
- When not to use this component
- Best practices
- Common patterns
```

## Storybook Integration

### Story Structure
```javascript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'destructive']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    }
  }
}

export const Default = {
  args: {
    children: 'Button'
  }
}

export const AllVariants = () => (
  <div className="space-x-2">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
  </div>
)
```

### Documentation Pages
```javascript
// Introduction.stories.mdx
import { Meta } from '@storybook/addon-docs'

<Meta title="Design System/Introduction" />

# Design System

Welcome to our design system. This collection of components, patterns,
and guidelines ensures consistency across our products.

## Principles

1. **Consistency** - Uniform experience across products
2. **Accessibility** - Inclusive design for all users
3. **Efficiency** - Streamlined development process
4. **Quality** - High standards for all components
```

## Build Process

### Token Generation
```javascript
// build-tokens.js
const StyleDictionary = require('style-dictionary')

StyleDictionary.extend({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
}).buildAllPlatforms()
```

### Component Library Build
```json
{
  "scripts": {
    "build": "rollup -c",
    "build:tokens": "node build-tokens.js",
    "build:storybook": "storybook build",
    "dev": "storybook dev -p 6006",
    "test": "jest",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  }
}
```

## Governance Framework

### Contribution Process
1. **RFC (Request for Comments)** - Propose new components
2. **Design Review** - Visual and UX validation
3. **Code Review** - Technical implementation review
4. **Testing** - Accessibility and cross-browser testing
5. **Documentation** - Complete usage documentation
6. **Release** - Versioned release with changelog

### Design System Team
- **Design System Lead** - Overall strategy and vision
- **Component Engineers** - Technical implementation
- **UX Designers** - Design and usability validation
- **Accessibility Expert** - Compliance and inclusion
- **Documentation Manager** - Maintain comprehensive docs

### Review Criteria
- [ ] Follows design principles
- [ ] Implements design tokens correctly
- [ ] Meets accessibility standards (WCAG 2.1 AA)
- [ ] Has comprehensive documentation
- [ ] Includes proper TypeScript types
- [ ] Has test coverage
- [ ] Works across target browsers
- [ ] Follows naming conventions

## Migration Strategies

### Version Management
- **Semantic Versioning** - Clear version communication
- **Breaking Change Policy** - Advance notice and migration guides
- **Deprecation Timeline** - Phased removal of old components
- **Codemods** - Automated migration tools

### Adoption Support
- **Training Materials** - Workshops and tutorials
- **Office Hours** - Regular support sessions
- **Slack/Teams Integration** - Quick help and announcements
- **Usage Analytics** - Track adoption and issues

## Tools & Resources

### Development Tools
- **Figma Variables** - Design token synchronization
- **Style Dictionary** - Token transformation
- **Rollup/Webpack** - Component bundling
- **TypeScript** - Type safety
- **Testing Library** - Component testing

### Documentation Tools
- **Storybook** - Interactive component showcase
- **Docusaurus** - Documentation website
- **MDX** - Rich documentation format
- **Chromatic** - Visual regression testing

### Quality Tools
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Jest** - Unit testing
- **Axe** - Accessibility testing
- **Lighthouse** - Performance auditing

When implementing a design system, focus on adoption, consistency, and developer experience. Start small with foundational elements and grow organically based on product needs.