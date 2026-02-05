# Global Claude Code Configuration

> **Copy this file to `~/.claude/CLAUDE.md` to set your personal preferences across all projects**

---

## My Coding Style

### General Principles
- **Clarity over cleverness** - Code should be easy to understand
- **Functional programming preferred** - Immutable data, pure functions where possible
- **Descriptive names** - No abbreviations unless universally known (e.g., `id`, `url`)
- **DRY but not premature** - Extract after 3rd repetition, not 2nd
- **Comments explain why, not what** - Code should be self-documenting

### Naming Conventions
```typescript
// Variables & Functions: camelCase
const userId = "123"
function getUserProfile() { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3
const API_BASE_URL = "https://api.example.com"

// Types & Interfaces: PascalCase
type UserProfile = { }
interface ApiResponse { }

// Files: kebab-case
// user-profile.ts
// api-client.ts

// Components: PascalCase
// UserProfile.tsx
// ApiClient.tsx
```

### Code Organization
- **Imports order:**
  1. External libraries (React, etc.)
  2. Internal modules (components, utils)
  3. Types
  4. Styles

- **Function length:** Aim for <20 lines, max 50 lines
- **File length:** Aim for <200 lines, max 400 lines
- **Function parameters:** Max 3-4 parameters, use object for more

---

## Technology Preferences

### Frontend
- **Framework:** React (with hooks, no class components)
- **Meta-framework:** Next.js (App Router preferred)
- **Styling:** Tailwind CSS (no styled-components or CSS-in-JS)
- **State management:** React Context or Zustand (no Redux unless large app)
- **Forms:** React Hook Form + Zod validation
- **UI Components:** shadcn/ui + Radix UI

### Backend
- **Runtime:** Node.js (prefer latest LTS)
- **Framework:** Next.js API routes or Fastify (no Express unless legacy)
- **Validation:** Zod
- **Authentication:** NextAuth / Auth.js
- **API style:** REST (GraphQL only if requested)

### Database
- **DBMS:** PostgreSQL (default choice)
- **ORM:** Prisma (no raw SQL unless performance critical)
- **Migrations:** Always use migrations, never prisma db push in production

### Testing
- **Unit tests:** Jest or Vitest
- **E2E tests:** Playwright
- **Coverage target:** 70%+ for business logic, 100% for critical paths

### DevOps
- **Deployment:** Vercel (for Next.js) or Docker
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry for errors
- **Logging:** Structured JSON logs

---

## Common Patterns

### Error Handling
```typescript
// API routes
try {
  // ... logic
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error("Error context:", error)
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 400 })
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}

// Client components
try {
  // ... logic
} catch (error) {
  console.error("Operation failed:", error)
  toast.error("Something went wrong. Please try again.")
}
```

### Async Operations
```typescript
// ✅ Use async/await
const data = await fetchData()

// ❌ Don't use .then()
fetchData().then(data => { })

// ✅ Handle errors
try {
  const data = await fetchData()
} catch (error) {
  handleError(error)
}
```

### React Components
```typescript
// ✅ Server Component (default)
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}

// ✅ Client Component (when needed)
"use client"
export function ClientComponent({ data }: Props) {
  const [state, setState] = useState()
  return <div>...</div>
}

// ✅ Component with TypeScript
interface Props {
  title: string
  count: number
}

export function Component({ title, count }: Props) {
  return <div>{title}: {count}</div>
}
```

---

## What I Like

### Good Practices
- ✅ TypeScript strict mode always
- ✅ ESLint + Prettier configured
- ✅ Git commit messages following Conventional Commits
- ✅ Small, focused functions
- ✅ Early returns / guard clauses
- ✅ Exhaustive type checking
- ✅ Dependency injection over global state
- ✅ Environment variables for configuration
- ✅ README with setup instructions

### Code Examples I Like
```typescript
// ✅ Guard clauses
function processUser(user: User | null) {
  if (!user) return null
  if (!user.isActive) return null
  if (!user.email) return null

  // Main logic here
  return processActiveUser(user)
}

// ✅ Declarative over imperative
const activeUsers = users.filter(u => u.isActive)
const userNames = activeUsers.map(u => u.name)

// ✅ Object destructuring
const { name, email, role } = user

// ✅ Optional chaining
const city = user?.address?.city ?? "Unknown"
```

---

## What I Dislike

### Anti-Patterns to Avoid
- ❌ `any` type in TypeScript (use `unknown` if truly needed)
- ❌ Class components in React
- ❌ Inline styles (use Tailwind classes)
- ❌ Magic numbers/strings (use named constants)
- ❌ Deep nesting (>3 levels)
- ❌ Commented-out code (delete it, git remembers)
- ❌ console.log in production code
- ❌ Abbreviations (usr, mgr, btn → user, manager, button)
- ❌ Mutation of input parameters
- ❌ Side effects in loops

### Code Examples to Avoid
```typescript
// ❌ Don't use any
function process(data: any) { }

// ✅ Use proper types
function process(data: UserData) { }

// ❌ Don't mutate parameters
function addItem(list: Item[]) {
  list.push(newItem)
}

// ✅ Return new array
function addItem(list: Item[]) {
  return [...list, newItem]
}

// ❌ Don't nest deeply
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      // ...
    }
  }
}

// ✅ Use guard clauses
if (!user) return
if (!user.isActive) return
if (!user.hasPermission) return
// ...
```

---

## Git & Workflow

### Commit Messages
Follow Conventional Commits:
```
feat(scope): add user authentication
fix(api): correct validation error handling
docs: update README with setup instructions
refactor(components): simplify button component
test(auth): add login flow E2E tests
chore(deps): update dependencies
```

### Branch Naming
```
feature/user-authentication
fix/login-validation-bug
refactor/api-error-handling
docs/update-readme
```

### PR Guidelines
- Clear title and description
- Link to related issue
- Include screenshots for UI changes
- List breaking changes
- Add testing instructions

---

## Terminal Aliases

```bash
# Claude
alias c='claude'
alias cc='claude --clear'

# Git
alias g='git'
alias gs='git status'
alias gd='git diff'
alias gl='git log --oneline'
alias gc='git commit'
alias gp='git push'
alias gpl='git pull'
alias gb='git branch'
alias gco='git checkout'
alias gcb='git checkout -b'

# npm/pnpm
alias nr='npm run'
alias ni='npm install'
alias nrd='npm run dev'
alias nrb='npm run build'
alias nrt='npm run test'

# Shortcuts
alias dev='npm run dev'
alias build='npm run build'
alias test='npm run test'
```

---

## Project Templates

### Typical Project Structure I Use
```
project-name/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── (main)/            # Main app routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   └── features/          # Feature-specific components
├── lib/                   # Utilities
│   ├── db.ts              # Database client
│   ├── auth.ts            # Auth configuration
│   └── utils.ts           # Helper functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
├── prisma/                # Database schema
├── public/                # Static assets
├── tests/                 # Test files
├── .env.example           # Environment variables template
├── CLAUDE.md              # Project instructions for Claude
└── README.md              # Project documentation
```

---

## Communication Style

### How I Prefer Claude to Respond
- **Be concise** - Get to the point quickly
- **Show code, not just descriptions** - I learn by seeing examples
- **Explain trade-offs** - When there are multiple approaches
- **Ask clarifying questions** - When requirements are unclear
- **Suggest improvements** - But don't insist on them
- **Admit uncertainty** - Say "I'm not sure" rather than guessing

### Response Format I Like
```
[Brief explanation of what you're doing]

[Code example]

[Why this approach / Trade-offs if relevant]

[Next steps or questions]
```

---

## Learning Style

### When I Ask Questions
- **Show examples** over long explanations
- **Link to docs** when referencing APIs/libraries
- **Provide working code** not pseudocode
- **Explain the "why"** not just the "how"

### When Teaching Me New Concepts
1. Start with the problem it solves
2. Show a simple example
3. Explain how it works
4. Show common patterns
5. Point out gotchas
6. Suggest next steps

---

## Project-Specific Overrides

**Note:** Project-level CLAUDE.md files override these global settings.

Example:
- Global says: "Use PostgreSQL"
- Project says: "This legacy project uses MongoDB"
- Result: Claude uses MongoDB for that specific project

---

## Environment Notes

### My Development Machine
- **OS:** [macOS / Linux / Windows]
- **Shell:** [zsh / bash / fish]
- **Editor:** [VS Code / Cursor / Neovim]
- **Node version:** [LTS / Latest]
- **Package manager:** [npm / pnpm / yarn]

### Common Environment Variables I Use
```bash
DATABASE_URL=
API_KEY=
AUTH_SECRET=
NEXT_PUBLIC_APP_URL=
```

---

## Frequently Needed Information

### My Accounts / Services
- GitHub: [username]
- npm: [username]
- Docker Hub: [username]
- Vercel: [organization]

### Common Ports I Use
- 3000 - Main Next.js app
- 3001 - Secondary Next.js app
- 5432 - PostgreSQL
- 6379 - Redis
- 8080 - Alternative HTTP server

---

## Special Instructions

### When Starting a New Project
1. Check if there's a project template
2. Set up CLAUDE.md in the project root
3. Configure linter and formatter
4. Set up git with proper .gitignore
5. Create README with setup instructions

### Before Committing Code
1. Run linter
2. Run type check
3. Run tests
4. Remove console.logs
5. Check for sensitive data
6. Write meaningful commit message

### When I Say "Ship It"
That means:
1. Run all checks (lint, types, tests)
2. Commit changes with proper message
3. Push to current branch
4. Create PR if on feature branch
5. Provide PR URL

---

**Last Updated:** 2026-01-18
**Version:** 1.0
