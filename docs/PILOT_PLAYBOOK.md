# Pilot Practice Onboarding Playbook

> Step-by-step guide for onboarding pilot dental practices to Jerome's Dental Front-Office Agent.

---

## Overview

This playbook ensures consistent, successful onboarding of pilot practices. Each pilot is critical for validating the product and gathering feedback for iteration.

**Target Timeline:** 2-3 weeks from initial contact to daily usage

---

## 1. Pilot Selection Criteria

### Ideal Pilot Practice Profile

| Criteria | Ideal | Acceptable | Avoid |
|----------|-------|------------|-------|
| **Practice Size** | 2-5 providers | Solo or 6-10 | 10+ (too complex for pilot) |
| **PMS** | Dentrix, Eaglesoft | Open Dental | Custom/proprietary |
| **Tech Savviness** | Moderate | High | Very low |
| **Champion** | Office manager engaged | Dentist interested | No internal advocate |
| **Location** | Within support range | Remote but responsive | International |

### Red Flags

- Practice has no dedicated computer for agent installation
- IT policy prohibits third-party software
- Multiple legacy systems that don't integrate
- Practice is in the middle of a PMS migration

---

## 2. Pre-Onboarding Phase (Week -1)

### 2.1 Discovery Call (30 min)

**Objectives:**
- Understand practice workflow and pain points
- Confirm technical requirements
- Identify internal champion

**Questions to Ask:**
```
1. Walk me through your typical morning huddle today.
2. What takes the most time in morning prep?
3. What information do you wish you had before seeing patients?
4. Who will be the main point of contact for this pilot?
5. What PMS version are you running?
6. Do you have a dedicated server or is everything on workstations?
```

**Deliverables:**
- Practice profile document
- Technical requirements checklist
- Champion contact information

### 2.2 Technical Assessment

**Collect:**
- [ ] PMS name and version (e.g., Dentrix G7.3)
- [ ] Windows version on target machine
- [ ] Network configuration (internet access from agent machine)
- [ ] Any firewall/security software restrictions
- [ ] Database access method (ODBC available? API credentials?)

**Verify:**
- [ ] Machine meets minimum specs (Windows 10+, 4GB RAM, 10GB disk)
- [ ] Internet connectivity stable
- [ ] Practice can provide database read credentials or API access

### 2.3 Legal & Compliance

**Send for Signature:**
- [ ] Business Associate Agreement (BAA)
- [ ] Pilot Program Agreement (terms, data usage, feedback expectations)
- [ ] Data Access Authorization (permission to connect to PMS)

**Confirm:**
- [ ] Practice has HIPAA policies in place
- [ ] Staff will be informed about the pilot

---

## 3. Installation Phase (Day 0)

### 3.1 Pre-Installation Checklist

```bash
# Before connecting to practice
□ Agent installer tested on similar environment
□ Practice-specific config file prepared
□ API key generated for this practice
□ Cloud tenant created and configured
□ Support channel established (Slack, email)
```

### 3.2 Installation Steps

**Remote Installation (Preferred):**

1. **Connect via screen share** (Zoom, Teams, or AnyDesk)
2. **Download agent installer** from secure link
3. **Run installer** as Administrator
4. **Configure connection:**
   ```
   Practice ID: [provided UUID]
   API Key: [provided key]
   PMS Type: dentrix | eaglesoft | csv
   ODBC DSN: [if applicable]
   ```
5. **Test extraction:**
   ```bash
   # Run manual extraction
   jerome-agent extract --test
   ```
6. **Verify in cloud:**
   - Log into admin dashboard
   - Confirm practice appears
   - Check data received matches expected format

**On-Site Installation (If Required):**

- Allocate 2-4 hours on-site
- Bring backup laptop with agent installer
- Test network connectivity first
- Have IT contact available

### 3.3 Post-Installation Verification

| Check | Expected Result |
|-------|-----------------|
| Agent service running | `Running` in Windows Services |
| Initial sync completed | Data visible in cloud dashboard |
| PHI sanitization | No real names in cloud logs |
| Scheduled task | 6 AM trigger configured |
| Error logging | Logs writing to expected location |

---

## 4. Training Phase (Day 1-2)

### 4.1 Training Session Agenda (90 min)

| Time | Topic | Participants |
|------|-------|--------------|
| 0:00-0:10 | Welcome & overview | All staff |
| 0:10-0:30 | Dashboard walkthrough | All staff |
| 0:30-0:50 | Role-specific views | Split by role |
| 0:50-1:10 | Chat Q&A demo | All staff |
| 1:10-1:20 | Risk flags & acknowledgment | All staff |
| 1:20-1:30 | Q&A and next steps | All staff |

### 4.2 Role-Specific Training Points

**Dentist (Dr. David):**
- Clinical summary card location
- How to view patient-specific risks
- Revenue opportunities and talking points
- Chat questions: "What procedures today?" "Any blood thinner patients?"

**Hygienist (Haley):**
- Hygiene-focused summary
- X-ray due dates and perio flags
- Anxiety/special needs indicators
- Chat questions: "Who needs X-rays?" "Any anxious patients?"

**Front Desk (Rachel):**
- Task inbox and prioritization
- Financial flags and balances
- Schedule gaps and opportunities
- Chat questions: "Who has a balance?" "Any cancellations today?"

**Manager (Michael):**
- Production vs. goal metrics
- All-staff task overview
- Audit log access
- Risk rule configuration

### 4.3 Training Materials

Provide to practice:
- [ ] Quick Start Guide (1-page PDF)
- [ ] Chat Question Examples (by role)
- [ ] Risk Flag Reference Card
- [ ] Support Contact Information

---

## 5. First Week Support (Days 2-7)

### 5.1 Daily Monitoring

**Morning Check (7 AM):**
- [ ] Verify agent ran successfully
- [ ] Check today's huddle generated
- [ ] Review for any obvious errors

**Evening Review (6 PM):**
- [ ] Check dashboard usage (who logged in?)
- [ ] Review any error logs
- [ ] Note chat queries asked

### 5.2 Scheduled Check-ins

**Day 2 Call (15 min):**
```
- Did the morning huddle load correctly?
- Any questions from the team?
- Any data looking incorrect?
```

**Day 5 Call (30 min):**
```
- How is the team adapting?
- What's working well?
- What needs improvement?
- Any features missing?
- Specific issues to address?
```

### 5.3 Common Issues & Resolutions

| Issue | Likely Cause | Resolution |
|-------|--------------|------------|
| Huddle not generated | Agent didn't run | Check Windows Task Scheduler |
| Wrong patient count | Data sync timing | Adjust extraction time |
| Missing risk flags | Rule not triggered | Check rule thresholds |
| Chat not responding | API timeout | Check network latency |
| Staff not using | Adoption friction | Schedule additional training |

---

## 6. Ongoing Pilot Management (Weeks 2-8)

### 6.1 Weekly Check-in Agenda (20 min)

```
1. Usage metrics review (5 min)
2. Feedback collection (10 min)
3. Issue resolution / feature requests (5 min)
```

### 6.2 Metrics to Track

| Metric | How to Measure | Target |
|--------|----------------|--------|
| Daily active users | Cloud dashboard analytics | > 80% of staff |
| Huddle view rate | Page views on huddle | > 90% of work days |
| Chat queries | Chat log count | > 3 per day |
| Task completion | Task status changes | > 90% completed |
| Risk acknowledgments | Flag status changes | > 95% acknowledged |
| Time saved (qualitative) | Weekly check-in question | > 30 min/day |

### 6.3 Feedback Collection

**Ask Weekly:**
1. "What's the most useful thing the system showed you this week?"
2. "What's one thing that frustrated you?"
3. "What would make this more useful for your role?"

**Document in:**
- Shared feedback spreadsheet
- Product backlog for priority items
- Bug tracker for issues

---

## 7. Pilot Completion & Case Study

### 7.1 Exit Interview (45 min)

**Questions:**
```
1. Overall, how has this affected your daily workflow?
2. Would you continue using this if it became paid?
3. What would you pay for this?
4. What's the #1 thing we should improve?
5. Can we quote you in a case study?
6. Would you refer another practice?
```

### 7.2 Case Study Data Points

**Collect with permission:**
- Before/after time spent on morning prep
- Number of risks caught that would have been missed
- Revenue opportunities surfaced (and converted)
- Staff satisfaction quotes
- Practice-approved photo/logo

**Example Case Study Format:**
```
"[Practice Name] reduced morning prep by 45 minutes daily"

Before: Staff spent 1 hour+ gathering patient info manually
After: AI-generated huddle ready at 6 AM

Key Results:
- 45 min/day saved
- 12 high-balance patients flagged (collected $3,400)
- 3 unscheduled crowns discussed (2 scheduled = $2,200)

"It's like having an extra team member who never forgets anything."
— [Name], Office Manager
```

---

## 8. Troubleshooting Guide

### Agent Not Running

```bash
# Check service status
sc query JeromeAgent

# Check scheduled task
schtasks /query /tn "Jerome Daily Extract"

# Check logs
type C:\JeromeAgent\logs\agent.log | tail -50

# Restart service
sc stop JeromeAgent && sc start JeromeAgent
```

### Data Not Syncing

1. Verify network connectivity from agent machine
2. Check API key is correct in config
3. Verify ODBC connection to PMS database
4. Test manual extraction: `jerome-agent extract --test`

### Huddle Not Generating

1. Check cloud API health endpoint
2. Verify data ingestion completed
3. Check LLM service status
4. Review error logs in admin dashboard

### Performance Issues

1. Check database query performance
2. Verify agent machine has sufficient resources
3. Review LLM response times
4. Consider network latency to cloud

---

## Appendix: Templates

### A. Discovery Call Notes Template

```
Practice: ____________________
Date: ____________________
Champion: ____________________

Current Morning Huddle:
_________________________________

Biggest Pain Points:
1. _________________________________
2. _________________________________
3. _________________________________

PMS: ____________________  Version: ________
Technical Contact: ____________________

Next Steps:
□ ____________________
□ ____________________
```

### B. Installation Checklist

```
Practice: ____________________
Installation Date: ____________________

Pre-Install:
□ BAA signed
□ Pilot agreement signed
□ Config file prepared
□ API key generated

Installation:
□ Agent installed
□ PMS connection configured
□ Test extraction successful
□ Cloud receiving data
□ PHI verified sanitized

Post-Install:
□ Scheduled task configured
□ User accounts created
□ Training scheduled
```

### C. Weekly Check-in Template

```
Practice: ____________________
Week #: ____
Date: ____________________

Metrics:
- Daily active users: ____/%
- Huddle views: ____/%
- Chat queries: ____/day
- Tasks completed: ____

Feedback:
What's working: ____________________
What's not: ____________________
Feature requests: ____________________

Issues:
____________________

Action Items:
□ ____________________
□ ____________________
```

---

## Cross-References

- **Implementation plan**: See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- **Technical requirements**: See [TECH_STACK.md](./TECH_STACK.md)
- **Deployment checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Testing strategy**: See [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
