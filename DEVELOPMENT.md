# SSELFIE Platform Development Guide

## Quick Setup Commands

### Initial Setup (First Time Only)
```bash
# Install all dependencies
npm install

# Configure Git commit template
git config commit.template .gitmessage

# Start development server
npm run dev
```

### Daily Development Commands
```bash
# Clean development start
npm run dev:clean

# Run all checks (lint, type, format)
npm run check:all

# Format code
npm run format

# Build for production
npm run build

# Test current setup
npm run dev
# Then visit: http://localhost:3000/test
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:clean` - Clean start (clears cache)
- `npm run build` - Build for production
- `npm run start` - Start production server

### Code Quality
- `npm run check:all` - Run all quality checks
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix auto-fixable lint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted
- `npm run type-check` - TypeScript type checking

## Project Structure

```
/
├── .vscode/                 # VS Code configuration
│   ├── settings.json        # Editor settings
│   ├── extensions.json      # Recommended extensions
│   └── snippets/            # Code snippets
├── agents/                  # AI agent instructions
│   ├── dev-ai-agent.md      # Development agent
│   ├── ux-designer-agent.md # UX/UI agent
│   ├── voice-ai-agent.md    # Voice AI agent
│   ├── automation-ai-agent.md # Automation agent
│   ├── qa-ai-agent.md       # QA testing agent
│   └── current-tasks.md     # Current sprint tasks
├── docs/                    # Documentation
│   ├── SSELFIE-Master-Vision.md
│   ├── AGENT-INSTRUCTIONS-UPDATE-GLOBAL-COMPONENTS.md
│   └── VS-Code-Setup-Guide.md
├── components/              # React components
│   └── global/              # Global component library
├── app/                     # Next.js app directory
│   ├── dashboard/           # Dashboard pages
│   └── test/                # Component test page
├── lib/                     # Utilities and helpers
│   └── sample-data.ts       # Development sample data
└── public/                  # Static assets
```

## Component Library Usage

### Import Components
```tsx
import { 
  Navigation, 
  Button, 
  Input, 
  EditorialCard,
  StatsWidget,
  Diamond 
} from '@/components/global'
```

### Sample Data
```tsx
import { 
  sampleUsers, 
  sampleVisionBoard, 
  sampleContentPosts, 
  sampleUserStats 
} from '@/lib/sample-data'
```

## VS Code Snippets

Type these prefixes in VS Code for instant code templates:

- `sselfie-page` - New page template
- `sselfie-component` - New component template
- `sselfie-api` - API route template
- `sselfie-hook` - Custom hook template
- `sselfie-dashboard-card` - Dashboard card
- `sselfie-toast` - Toast notification

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in your actual environment variables
3. Never commit `.env.local` to git

## Git Workflow

Commits automatically use the template in `.gitmessage`:
```bash
git commit
# Opens editor with commit template
```

## Recommended VS Code Extensions

The following extensions will be automatically suggested:
- Tailwind CSS IntelliSense
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Development Workflow

1. **Start Development**
   ```bash
   npm run dev:clean
   ```

2. **Make Changes**
   - Use VS Code snippets for faster development
   - Follow the luxury design system in `tailwind.config.ts`
   - Use components from `/components/global/`

3. **Test Your Changes**
   - Visit `/test` page to verify components work
   - Run `npm run check:all` before committing

4. **Commit Changes**
   ```bash
   git add .
   git commit
   # Use the commit template
   ```

## Troubleshooting

### If you see React/TypeScript errors:
```bash
npm install react react-dom @types/react @types/react-dom
npm install next typescript @types/node
```

### If Tailwind classes don't work:
```bash
npm install tailwindcss postcss autoprefixer
npm install @tailwindcss/typography @tailwindcss/forms
```

### If components don't import:
Check that the component is exported in `/components/global/index.tsx`

## Agent Development

Each agent has specific instructions in `/agents/`:
- Use `current-tasks.md` to track sprint progress
- Follow agent-specific guidelines for consistent code style
- Reference the master vision document for platform direction

## Ready for Development! 🚀

Your SSELFIE luxury platform is fully configured and ready for feature development. The component library, agent instructions, and development workflow are all in place.

**Next Steps:**
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development
3. Visit `http://localhost:3000/test` to verify setup
4. Begin implementing features using the agent instructions
