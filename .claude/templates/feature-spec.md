# Feature Specification: [Feature Name]

**Status:** Draft / In Review / Approved / In Progress / Complete
**Priority:** P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)
**Owner:** [Your Name]
**Estimated Effort:** [Small / Medium / Large] ([X days/weeks])
**Target Release:** [Version / Date]

---

## 📄 Overview

### Problem Statement
[What user problem are we solving? Why is this important?]

**User Story:**
> As a [user type],
> I want to [action],
> So that [benefit].

**Success Metrics:**
- [Metric 1]: [Target]
- [Metric 2]: [Target]
- [Metric 3]: [Target]

---

## 🎯 Goals & Non-Goals

### Goals
- ✅ [Goal 1]
- ✅ [Goal 2]
- ✅ [Goal 3]

### Non-Goals (Explicitly out of scope)
- ❌ [Non-goal 1]
- ❌ [Non-goal 2]

---

## 👥 Target Users

**Primary Users:**
- [User persona 1] - [Use case]
- [User persona 2] - [Use case]

**Secondary Users:**
- [User persona 3] - [Use case]

---

## 📋 Requirements

### Functional Requirements

#### Must Have (P0)
- [ ] FR-1: [Requirement description]
- [ ] FR-2: [Requirement description]
- [ ] FR-3: [Requirement description]

#### Should Have (P1)
- [ ] FR-4: [Requirement description]
- [ ] FR-5: [Requirement description]

#### Nice to Have (P2)
- [ ] FR-6: [Requirement description]
- [ ] FR-7: [Requirement description]

### Non-Functional Requirements
- **Performance:** [e.g., Page load < 2s, API response < 500ms]
- **Scalability:** [e.g., Support 10,000 concurrent users]
- **Availability:** [e.g., 99.9% uptime]
- **Security:** [e.g., All data encrypted, RBAC enforced]
- **Accessibility:** [e.g., WCAG 2.1 AA compliant]
- **Mobile:** [e.g., Responsive, works on iOS/Android]

---

## 🎨 User Experience

### User Flow
```
1. User lands on [page]
   ↓
2. User sees [UI element]
   ↓
3. User clicks/interacts with [element]
   ↓
4. System performs [action]
   ↓
5. User sees [result]
```

### Wireframes / Mockups
[Link to Figma/design tool]
[Or embed simple ASCII mockups]

```
┌─────────────────────────────────┐
│  Header                    [?]  │
├─────────────────────────────────┤
│                                 │
│  [Main Content Area]            │
│                                 │
│  ┌──────────┐  ┌──────────┐   │
│  │  Card 1  │  │  Card 2  │   │
│  └──────────┘  └──────────┘   │
│                                 │
│  [Button]                       │
└─────────────────────────────────┘
```

### Edge Cases & Error States
- **Edge Case 1:** [Scenario] → [Expected behavior]
- **Edge Case 2:** [Scenario] → [Expected behavior]
- **Error 1:** [What went wrong] → [Error message shown]
- **Error 2:** [What went wrong] → [Error message shown]

---

## 🏗️ Technical Design

### Architecture Overview
[High-level description of how this will work]

### Components

#### Frontend Components (New/Modified)
- `ComponentName1` - [Purpose]
  - Props: [list]
  - State: [list]
  - Location: `components/`

- `ComponentName2` - [Purpose]

#### Backend Components
- **API Endpoints**
  ```
  POST /api/feature
    Request: { field1, field2 }
    Response: { id, status }
    Auth: Required
    Rate limit: 100/hour

  GET /api/feature/:id
    Response: { data }
    Auth: Required
  ```

- **Server Actions**
  - `createFeature()` - [Purpose]
  - `updateFeature()` - [Purpose]

### Database Changes

```prisma
model NewModel {
  id        String   @id @default(cuid())
  field1    String
  field2    Int
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// Modify existing model
model ExistingModel {
  // Add new field
  newField  String?  // nullable during migration
}
```

**Migration Strategy:**
1. [Step 1 - add nullable column]
2. [Step 2 - backfill data]
3. [Step 3 - make required if needed]

### External Dependencies
- **New dependencies:**
  - `package-name` - [Purpose] - [Why this one?]

- **API integrations:**
  - [Service name] - [What we use it for]

### Security Considerations
- ✅ [Security measure 1]
- ✅ [Security measure 2]
- ⚠️  [Potential risk and mitigation]

### Performance Considerations
- [Optimization 1]
- [Caching strategy]
- [Database indexes needed]

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Test [component/function 1]
- [ ] Test [component/function 2]
- [ ] Test error handling
- [ ] Test edge cases

### E2E Tests
- [ ] Test happy path: [scenario]
- [ ] Test error path: [scenario]
- [ ] Test authentication
- [ ] Test permissions

### Manual Testing Checklist
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile iOS Safari
- [ ] Mobile Android Chrome
- [ ] Keyboard navigation
- [ ] Screen reader

---

## 📅 Implementation Plan

### Phase 1: Foundation (Week 1)
- [ ] Database schema changes
- [ ] Create migrations
- [ ] Set up API endpoints
- [ ] Basic CRUD operations

### Phase 2: Core Functionality (Week 2)
- [ ] Implement business logic
- [ ] Add validation
- [ ] Error handling
- [ ] Unit tests

### Phase 3: UI/UX (Week 3)
- [ ] Create components
- [ ] Integrate with backend
- [ ] Responsive design
- [ ] E2E tests

### Phase 4: Polish & Launch (Week 4)
- [ ] Performance optimization
- [ ] Security review
- [ ] Accessibility audit
- [ ] Documentation
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production

---

## 🚧 Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [How we'll handle it] |
| [Risk 2] | High/Med/Low | High/Med/Low | [How we'll handle it] |

---

## 📊 Success Criteria

**Launch Criteria (Must have before release):**
- [ ] All P0 requirements implemented
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Accessibility audit passed
- [ ] Documentation complete

**Success Metrics (Measure after launch):**
- [Metric 1]: Baseline → Target (X% increase)
- [Metric 2]: Baseline → Target
- [Metric 3]: Baseline → Target

**Evaluation Period:** [X weeks after launch]

---

## 🔗 References

- Design doc: [link]
- Related PRs: [#123, #456]
- Related issues: [#789]
- Slack discussion: [link]
- Research: [link]

---

## 📝 Open Questions

- [ ] Question 1: [What we need to decide]
  - Decision by: [Date]
  - Stakeholders: [Who needs to weigh in]

- [ ] Question 2: [What we need to decide]

---

## 📋 Changelog

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | [Name] | Initial draft |
| YYYY-MM-DD | [Name] | Added technical design |
| YYYY-MM-DD | [Name] | Approved |

---

**Approval:**
- [ ] Engineering Lead
- [ ] Product Manager
- [ ] Design
- [ ] Security (if needed)
