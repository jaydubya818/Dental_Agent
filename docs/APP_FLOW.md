# Application Flow & User Navigation

> This document defines every page, user flow, navigation path, and decision point in the Jerome Dental Front-Office Agent.

---

## 1. Screen Inventory

| Screen | Route | Access | Description |
|--------|-------|--------|-------------|
| Login | `/login` | Public | Email/password authentication |
| Register | `/register` | Public | New user registration (invite-only) |
| Forgot Password | `/forgot-password` | Public | Password reset request |
| Reset Password | `/reset-password?token=` | Public | Password reset with token |
| Dashboard (Dentist) | `/dashboard` | Provider | Clinical morning huddle view |
| Dashboard (Hygienist) | `/dashboard` | Hygienist | Hygiene-focused morning huddle |
| Dashboard (Admin) | `/dashboard` | Admin | Front desk task list and alerts |
| Dashboard (Manager) | `/dashboard` | Manager | Metrics and oversight view |
| Schedule View | `/schedule` | Authenticated | Daily schedule timeline |
| Patient Detail | `/patients/[id]` | Authenticated | Individual patient context |
| Chat Interface | `/chat` | Authenticated | Q&A about today's schedule |
| Risk Flags | `/risks` | Authenticated | All active risk flags |
| Opportunities | `/opportunities` | Provider, Manager | Revenue opportunities list |
| Settings | `/settings` | Authenticated | User preferences |
| Admin Settings | `/settings/admin` | Manager | Practice-wide configuration |
| Audit Logs | `/audit` | Manager | Immutable access logs |

---

## 2. Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HEADER                                     │
│  [Logo]  [Dashboard]  [Schedule]  [Chat]  [Settings]  [User Menu]   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼───────┐               ┌───────▼───────┐
        │   SIDEBAR     │               │  MAIN CONTENT │
        │               │               │               │
        │ • Quick Stats │               │ Role-specific │
        │ • Risk Alerts │               │ dashboard     │
        │ • Shortcuts   │               │ content       │
        └───────────────┘               └───────────────┘
```

### Primary Navigation

| Item | Route | Icon | Visibility |
|------|-------|------|------------|
| Dashboard | `/dashboard` | Home | All authenticated |
| Schedule | `/schedule` | Calendar | All authenticated |
| Chat | `/chat` | MessageCircle | All authenticated |
| Risks | `/risks` | AlertTriangle | All authenticated |
| Opportunities | `/opportunities` | DollarSign | Provider, Manager |
| Audit | `/audit` | FileText | Manager only |
| Settings | `/settings` | Settings | All authenticated |

---

## 3. User Flows

### 3.1 Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌──────────────┐     ┌───────────┐
│  Start  │────▶│  Login  │────▶│ Validate JWT │────▶│ Dashboard │
└─────────┘     └─────────┘     └──────────────┘     └───────────┘
                     │                  │
                     │                  │ Invalid
                     │                  ▼
                     │          ┌──────────────┐
                     │          │ Refresh Token│
                     │          └──────────────┘
                     │                  │
                     ▼                  │ Expired
              ┌─────────────┐           ▼
              │ Forgot Pass │    ┌─────────┐
              └─────────────┘    │  Login  │
                                 └─────────┘
```

**Steps:**
1. User navigates to `/login`
2. Enter email and password
3. **Success**: Receive JWT access token (15min) + refresh token (7 days)
4. **Success**: Redirect to `/dashboard` with role-appropriate view
5. **Failure**: Show inline error "Invalid email or password"
6. **MFA Required** (Manager role): Show TOTP input screen

### 3.2 Morning Huddle Review Flow

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  Dashboard  │────▶│ View Summary    │────▶│ Review Risk Flag │
└─────────────┘     └─────────────────┘     └──────────────────┘
                                                     │
                           ┌─────────────────────────┴─────────┐
                           │                                   │
                           ▼                                   ▼
                    ┌─────────────┐                     ┌─────────────┐
                    │ Acknowledge │                     │ View Patient│
                    │    Flag     │                     │   Detail    │
                    └─────────────┘                     └─────────────┘
```

**Steps (Dr. David - Dentist):**
1. Arrive at dashboard at 7:30 AM
2. View "Clinical Summary" card with today's patient count
3. See CRITICAL risk flags highlighted in red
4. Click risk flag → View patient details
5. Click "Acknowledge" → Flag marked as reviewed
6. View "Revenue Opportunities" section
7. Click opportunity → See treatment details and talking points

### 3.3 Schedule Review Flow

```
┌──────────┐     ┌────────────────┐     ┌─────────────────┐
│ Schedule │────▶│ Timeline View  │────▶│ Click Timeslot  │
└──────────┘     └────────────────┘     └─────────────────┘
                                                 │
                         ┌───────────────────────┤
                         ▼                       ▼
                  ┌─────────────┐        ┌─────────────────┐
                  │ Quick Info  │        │  Patient Modal  │
                  │   Popover   │        │   Full Detail   │
                  └─────────────┘        └─────────────────┘
```

**Steps:**
1. Navigate to `/schedule`
2. View timeline with provider columns
3. Hover on appointment → See quick info popover
4. Click appointment → Open patient detail modal
5. View risk flags, notes, treatment history
6. Close modal → Return to schedule

### 3.4 Chat Q&A Flow

```
┌────────┐     ┌────────────────┐     ┌─────────────────┐
│  Chat  │────▶│ Type Question  │────▶│  AI Processing  │
└────────┘     └────────────────┘     └─────────────────┘
                                               │
                                               ▼
                                       ┌─────────────────┐
                                       │ Display Answer  │
                                       │ + Sources       │
                                       └─────────────────┘
```

**Example Questions:**
- "Who has outstanding balances over $500 today?"
- "Which patients need X-rays?"
- "What procedures are scheduled for Dr. Smith?"

**Steps:**
1. Navigate to `/chat`
2. Type natural language question
3. Press Enter or click Send
4. Show loading state (typing indicator)
5. Display AI response with structured answer
6. Show source citations (patient IDs referenced)
7. Option to ask follow-up question

---

## 4. Decision Points

### 4.1 Role Detection (Post-Login)

```
                        ┌───────────────┐
                        │  Login Success│
                        └───────┬───────┘
                                │
                        ┌───────▼───────┐
                        │  Check Role   │
                        └───────┬───────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│   Provider    │       │   Hygienist   │       │   Admin       │
│   Dashboard   │       │   Dashboard   │       │   Dashboard   │
└───────────────┘       └───────────────┘       └───────────────┘
                                                        │
                                                ┌───────┴───────┐
                                                │               │
                                                ▼               ▼
                                        ┌───────────┐   ┌───────────┐
                                        │  Manager  │   │ Front Desk│
                                        │  View     │   │   View    │
                                        └───────────┘   └───────────┘
```

### 4.2 Data Loading States

| State | UI Behavior |
|-------|-------------|
| Loading | Skeleton placeholders for cards/lists |
| Success | Render data with animations |
| Empty | "No schedule data for today" message |
| Error | Error banner with retry button |
| Stale | Show cached data + "Refreshing..." indicator |

### 4.3 Risk Flag Severity Routing

| Severity | Badge Color | Sound | Position |
|----------|-------------|-------|----------|
| CRITICAL | Red | Optional beep | Top of list, sticky |
| WARN | Amber | None | Standard position |
| INFO | Blue | None | Bottom section |

---

## 5. Error Paths

### 5.1 Authentication Errors

| Error | Message | Action |
|-------|---------|--------|
| Invalid credentials | "Invalid email or password" | Show inline, clear password |
| Account locked | "Account locked. Contact administrator." | Show inline, hide form |
| Session expired | "Your session has expired" | Redirect to login with return URL |
| MFA failed | "Invalid verification code" | Allow retry (3 attempts) |

### 5.2 API Errors

| Error | HTTP Code | UI Response |
|-------|-----------|-------------|
| Unauthorized | 401 | Redirect to login |
| Forbidden | 403 | "You don't have permission to view this" |
| Not Found | 404 | "Resource not found" page |
| Server Error | 500 | "Something went wrong. Please try again." |
| Timeout | - | "Request timed out. Check connection." |

### 5.3 Data Errors

| Scenario | UI Response |
|----------|-------------|
| No huddle generated yet | "Morning huddle is being prepared..." |
| No schedule uploaded | "No schedule data received today. Check local agent." |
| Partial data | Show available data + "Some data may be incomplete" |

---

## 6. Success Paths

### 6.1 Happy Path: Morning Huddle

1. User logs in at 7:30 AM
2. Dashboard loads with today's date
3. Morning huddle summary displays (generated at 6:15 AM)
4. User reviews 3 CRITICAL flags
5. User acknowledges each flag
6. User reviews 2 revenue opportunities
7. User navigates to schedule for full day view
8. User asks chat "Who needs follow-up calls?"
9. Session ends with logout

### 6.2 Happy Path: Admin Task List

1. Rachel (Admin) logs in at 7:45 AM
2. Dashboard shows prioritized task list:
   - Confirm 3 appointments
   - Collect payment from 2 patients
   - Fill 1 schedule gap
3. Rachel clicks task → Opens quick action modal
4. Completes task → Marked as done
5. Task list updates in real-time

---

## 7. Mobile Responsive Behavior

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, bottom nav, collapsed cards |
| Tablet | 640-1024px | Two columns, side navigation |
| Desktop | > 1024px | Full layout with sidebar |

### Mobile-Specific Flows

- **Bottom Navigation**: Dashboard, Schedule, Chat, More
- **Swipe Gestures**: Swipe cards to acknowledge
- **Pull to Refresh**: Reload huddle data
- **Haptic Feedback**: On risk flag interaction

---

## 8. Deep Links

| Pattern | Destination |
|---------|-------------|
| `/dashboard?date=2026-02-04` | Dashboard for specific date |
| `/patients/abc123` | Patient detail page |
| `/chat?q=urgent` | Chat with pre-filled query |
| `/risks?severity=critical` | Filtered risk list |
| `/schedule?provider=dr-david` | Provider-filtered schedule |

---

## Cross-References

- **Authentication logic**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#authentication)
- **API endpoints**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#api-endpoints)
- **Component styling**: See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
- **Feature requirements**: See [PRD.md](../../docs/context/JEROME_DENTAL_PRD.md)
