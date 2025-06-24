# VS Code Setup for SSELFIE Platform

## Overview
This guide helps you set up VS Code for optimal development of the SSELFIE luxury platform. Our development environment is configured for TypeScript, Next.js, and luxury design standards.

## Required Extensions

### Core Development
- **TypeScript**: `ms-vscode.vscode-typescript-next`
- **Tailwind CSS IntelliSense**: `bradlc.vscode-tailwindcss`
- **Prettier**: `esbenp.prettier-vscode`
- **ESLint**: `ms-vscode.eslint`

### Recommended
- **Auto Rename Tag**: `formulahendry.auto-rename-tag`
- **Bracket Pair Colorizer**: `coenraads.bracket-pair-colorizer`
- **GitLens**: `eamodio.gitlens`
- **Path Intellisense**: `christian-kohler.path-intellisense`

## VS Code Settings

The workspace includes optimized settings in `.vscode/settings.json`:

```json
{
  "workbench.colorTheme": "Default Dark+",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Custom Snippets

### React Component Snippet
```json
{
  "SSELFIE Component": {
    "prefix": "sselfie-component",
    "body": [
      "'use client'",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:// Props here}",
      "}",
      "",
      "export function ${1:ComponentName}({ ${3:props} }: ${1:ComponentName}Props) {",
      "  return (",
      "    <div className=\"${4:styling}\">",
      "      ${5:// Component content}",
      "    </div>",
      "  )",
      "}"
    ],
    "description": "Create a new SSELFIE component"
  }
}
```

### Global Component Import
```json
{
  "Global Components Import": {
    "prefix": "sselfie-import",
    "body": [
      "import { ",
      "  ${1:Navigation},",
      "  ${2:Footer},",
      "  ${3:Button},",
      "  ${4:EditorialCard}",
      "} from '@/components/global'"
    ],
    "description": "Import SSELFIE global components"
  }
}
```

## File Organization

### Naming Conventions
- Components: `PascalCase.tsx`
- Pages: `kebab-case/page.tsx`
- Utilities: `camelCase.ts`
- Styles: `kebab-case.css`

### Folder Structure
```
app/
├── (auth)/           # Route groups
├── dashboard/        # Protected routes
├── tools/           # Tool pages
└── globals.css      # Global styles

components/
├── global/          # Shared components
├── forms/           # Form components
└── ui/              # UI primitives

lib/
├── utils.ts         # Utility functions
├── supabase.ts      # Database client
└── stripe.ts        # Payment client
```

## Development Workflow

### 1. Component Development
```typescript
// Always import global components first
import { Button, EditorialCard } from '@/components/global'

// Use TypeScript interfaces
interface Props {
  title: string
  description?: string
}

// Mobile-first responsive design
export function FeatureCard({ title, description }: Props) {
  return (
    <EditorialCard
      title={title}
      description={description}
      hover={true}
    />
  )
}
```

### 2. Styling Guidelines
```css
/* Use Tailwind classes following luxury design system */
className="
  font-bodoni text-4xl text-luxury-black 
  tracking-tight leading-none
  mb-8 md:mb-12
"

/* NO rounded corners, gradients, or bright colors */
/* YES to sharp edges, high contrast, generous spacing */
```

### 3. Mobile-First Approach
```typescript
// Always start with mobile, then add larger breakpoints
<div className="
  px-6 py-8          // Mobile: small padding
  md:px-24 md:py-20  // Desktop: generous padding
  
  text-2xl           // Mobile: smaller text
  md:text-5xl        // Desktop: dramatic text
">
```

## Debugging

### Next.js Debugging
1. Use browser dev tools
2. Check Network tab for API calls
3. Use React DevTools extension
4. Check console for errors

### Common Issues
- **Hydration errors**: Check server/client rendering differences
- **CSS not loading**: Verify Tailwind configuration
- **Font loading**: Check font file paths in `globals.css`
- **Component errors**: Ensure global components are imported correctly

## Performance Monitoring

### VS Code Extensions
- **Bundle Analyzer**: Visualize bundle size
- **Lighthouse**: Performance auditing
- **Performance Monitor**: Real-time metrics

### Key Metrics to Watch
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms

## Luxury Design Checklist

Before committing:
- [ ] No rounded corners (`border-radius: 0`)
- [ ] Only approved colors (#171719, #F1F1F1, #B5B5B3)
- [ ] Generous white space
- [ ] Mobile-responsive
- [ ] Proper font hierarchy
- [ ] Smooth animations (300-800ms)
- [ ] High contrast ratios
- [ ] Clean, minimal design

## Git Workflow

### Branch Naming
- `feature/dashboard-redesign`
- `fix/mobile-navigation`
- `docs/setup-guide`

### Commit Messages
```
feat: add luxury button component
fix: resolve mobile navigation overflow
docs: update component documentation
style: improve editorial card spacing
```

## Troubleshooting

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf .next
npm run dev

# Check types without emitting
npm run type-check
```

### Tailwind Not Working
```bash
# Restart dev server
npm run dev

# Check tailwind.config.ts
# Verify globals.css imports
```

### Font Loading Issues
```bash
# Check font files in public/fonts/
# Verify @font-face declarations in globals.css
# Test font-display: swap is working
```

Remember: You're building a luxury platform. Every detail matters, from code organization to design implementation. The development experience should feel as premium as the end product.

---

*"Clean code is like clean design - sophisticated in its simplicity." - SSELFIE Development Philosophy*
