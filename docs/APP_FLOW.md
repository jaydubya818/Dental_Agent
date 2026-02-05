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

## 8. Error Handling Flows

### 8.1 Error State Principles

1. **Never leave user stranded** - Always provide a recovery path
2. **Be specific** - "Network error" not "Something went wrong"
3. **Actionable messages** - Tell user what to do next
4. **Preserve context** - Don't lose form data on error
5. **Log for debugging** - Include request_id for support tickets

### 8.2 Authentication Errors

| Error Code | User Message | Recovery Action |
|------------|--------------|-----------------|
| `AUTH_001` | "Invalid email or password" | Show inline error, clear password field |
| `AUTH_002` | "Your session has expired" | Redirect to login, preserve intended destination |
| `AUTH_003` | "Session revoked for security" | Clear all tokens, redirect to login |
| `AUTH_004` | "Verification code required" | Show MFA input form |
| `AUTH_005` | "Invalid verification code" | Allow retry (3 attempts max) |
| `AUTH_006` | "Account locked. Contact admin." | Show contact info, disable form |

```jsx
// Session expired handling
if (error.code === 'AUTH_002') {
  toast.error("Your session has expired. Please log in again.");
  router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
}
```

### 8.3 Data Loading Errors

| Scenario | Error Display | Recovery |
|----------|---------------|----------|
| Dashboard fails to load | Full-page error with retry button | "Retry" button, manual refresh |
| Single component fails | Inline error, rest of page works | Component-level retry |
| Partial data missing | Show available data + indicator | "Some data unavailable" banner |
| Network offline | Toast notification | Auto-retry when online |

```jsx
// Component-level error boundary
<ErrorBoundary
  fallback={
    <Card className="p-6 text-center">
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
      <p className="text-gray-700">Failed to load risk flags</p>
      <Button onClick={refetch} className="mt-4">
        Try Again
      </Button>
    </Card>
  }
>
  <RiskFlagsPanel />
</ErrorBoundary>
```

### 8.4 Form Submission Errors

| Error Type | Display Location | Behavior |
|------------|------------------|----------|
| Validation error | Inline under field | Highlight field, show message |
| Multiple validation errors | List at top + inline | Scroll to first error |
| Server validation error | Inline under affected field | Map `errors[]` to fields |
| Network error | Toast + preserve form | "Failed to save. Try again." |
| Rate limit exceeded | Toast with countdown | "Too many requests. Wait 60s." |

```jsx
// Form error handling
const onSubmit = async (data) => {
  try {
    await api.updateSettings(data);
    toast.success("Settings saved");
  } catch (error) {
    if (error.status === 400 && error.errors) {
      // Server validation errors - map to form fields
      error.errors.forEach(({ field, message }) => {
        setError(field, { message });
      });
    } else if (error.status === 429) {
      toast.error(`Too many requests. Try again in ${error.retryAfter}s`);
    } else {
      toast.error("Failed to save settings. Please try again.");
    }
  }
};
```

### 8.5 AI/Chat Errors

| Scenario | User Message | Recovery |
|----------|--------------|----------|
| LLM timeout | "Response is taking longer than usual..." | Auto-retry, show spinner |
| LLM service down | "AI assistant temporarily unavailable" | Disable chat input, show ETA if known |
| Context too long | "Question too complex. Try simpler query." | Clear history option |
| Rate limited | "AI limit reached. Upgrade or wait." | Show upgrade CTA or countdown |

```jsx
// Chat error handling
{chatError && (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
    <div className="flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
      <div>
        <p className="text-amber-800 font-medium">
          {chatError.message}
        </p>
        {chatError.canRetry && (
          <Button 
            variant="link" 
            onClick={retryLastMessage}
            className="text-amber-700 p-0 h-auto"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  </div>
)}
```

### 8.6 Schedule Ingestion Errors

| Error | Display | Recovery |
|-------|---------|----------|
| Local agent offline | Banner on dashboard | "Local agent disconnected. Check installation." |
| Invalid data format | Admin notification | Show raw data preview, allow manual correction |
| Partial parse failure | Proceed with warning | "3 appointments skipped due to errors" |
| No schedule data | Empty state | "No appointments found for today" |

```jsx
// Schedule status indicator
<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100">
  <span className={cn(
    "h-2 w-2 rounded-full",
    status === 'connected' ? 'bg-green-500' : 'bg-red-500'
  )} />
  <span className="text-sm text-gray-600">
    {status === 'connected' 
      ? 'Local agent connected' 
      : 'Agent disconnected'}
  </span>
</div>
```

### 8.7 Offline Handling

```jsx
// Global offline indicator
const { isOnline } = useOnlineStatus();

{!isOnline && (
  <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-white text-center py-2 z-50">
    <span>You're offline. Some features may be unavailable.</span>
  </div>
)}

// Optimistic updates with rollback
const updateSetting = async (key, value) => {
  const previousValue = settings[key];
  
  // Optimistic update
  setSettings(prev => ({ ...prev, [key]: value }));
  
  try {
    await api.updateSetting(key, value);
  } catch (error) {
    // Rollback on failure
    setSettings(prev => ({ ...prev, [key]: previousValue }));
    toast.error("Failed to save. Change reverted.");
  }
};
```

### 8.8 Error Logging for Support

```jsx
// Include request_id in error displays for support
{error && (
  <Alert variant="destructive">
    <AlertTitle>Something went wrong</AlertTitle>
    <AlertDescription>
      {error.message}
      <br />
      <span className="text-xs text-gray-500 mt-2 block">
        Reference: {error.requestId}
      </span>
    </AlertDescription>
  </Alert>
)}

// Log errors for debugging (never log PHI)
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: {
    component: 'RiskFlagsPanel',
    action: 'fetch'
  },
  extra: {
    requestId: error.requestId,
    // Never include PHI in error logs
  }
});
```

---

## Cross-References

- **Authentication logic**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#authentication)
- **API endpoints**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#api-endpoints)
- **Error response format**: See [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md#6-standard-api-error-response-format)
- **Component styling**: See [FRONTEND_GUIDELINES.md](./FRONTEND_GUIDELINES.md)
- **Feature requirements**: See [PRD.md](./PRD.md)
- **Testing strategy**: See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)