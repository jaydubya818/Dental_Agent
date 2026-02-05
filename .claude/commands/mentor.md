# /sellerfi:mentor

---
title: "Financial Mentoring"
description: "Provides detailed explanations and guidance for complex financial logic, marketplace operations, and seller financing concepts"
category: "learning-guidance"
priority: "medium"
keywords: ["mentor", "guidance", "explanation", "learning", "financial"]
allowed_tools: ["Read", "WebFetch", "Grep"]
permissions: ["knowledge-base", "market-research", "code-analysis"]
---

**Usage**: `/sellerfi:mentor [topic] [--level=beginner|intermediate|expert]`

## What it does

1. **Financial Concept Explanation**: Breaks down complex seller financing concepts
2. **Code Logic Walkthrough**: Explains intricate financial calculation implementations
3. **Marketplace Guidance**: Provides insights on marketplace operations and best practices
4. **Regulatory Context**: Explains compliance requirements and financial regulations
5. **Best Practices**: Shares industry-standard approaches for financial applications
6. **Troubleshooting Support**: Helps diagnose and resolve complex issues

## Knowledge Domains

### 🏦 **Seller Financing Expertise**
- **Term Structures**: Interest rates, amortization schedules, balloon payments
- **Risk Assessment**: DSCR calculations, creditworthiness evaluation
- **Valuation Methods**: EBITDA multiples, revenue multiples, DCF analysis
- **Deal Structuring**: Down payments, earnouts, contingencies

### 💻 **Technical Implementation**
- **Financial Calculations**: Precise mathematical implementations
- **Database Design**: Financial data modeling and relationships
- **API Architecture**: Secure financial API design patterns
- **Performance Optimization**: High-volume financial transaction handling

### 📊 **Marketplace Operations**
- **User Journey Design**: Buyer and seller experience optimization
- **Dealroom Management**: Negotiation workflow and document management
- **Payment Processing**: Stripe integration and financial transaction security
- **Compliance Systems**: KYC, AML, and regulatory reporting

### ⚖️ **Regulatory & Compliance**
- **Financial Regulations**: SOX, GDPR, CCPA compliance requirements
- **Security Standards**: PCI DSS, data protection, audit trails
- **Documentation**: Regulatory reporting and audit preparation
- **Risk Management**: Fraud prevention and monitoring

## Parameters

- `topic` (optional): Specific area for guidance (calculation|compliance|architecture|marketplace)
- `--level`: Explanation depth (beginner|intermediate|expert)
- `--practical`: Include code examples and implementation details
- `--regulatory`: Focus on compliance and regulatory aspects

## Examples

```bash
# General seller financing guidance
/sellerfi:mentor seller-financing --level=intermediate

# Technical implementation help
/sellerfi:mentor "DSCR calculation implementation" --practical

# Compliance guidance
/sellerfi:mentor "KYC requirements" --regulatory

# Expert-level marketplace design
/sellerfi:mentor marketplace-architecture --level=expert
```

## Mentoring Topics

### 🎯 **Popular Topics**

#### **1. Seller Financing Fundamentals**
```
📚 What is seller financing?
- Definition and benefits for both parties
- Common structures and terms
- Risk mitigation strategies
- Market standards and benchmarks

💡 Key Concepts:
- Down payment percentages (typically 10-30%)
- Interest rates (market rate + 1-3% premium)
- Term lengths (3-7 years common)
- Personal guarantees and collateral
```

#### **2. DSCR (Debt Service Coverage Ratio)**
```
📐 Mathematical Foundation:
DSCR = Net Operating Income / Total Debt Service

🔍 Implementation Details:
- Cash flow calculation methodologies
- Seasonal business adjustments
- Risk threshold interpretation (>1.25 = good)
- Integration with loan approval workflows

💻 Code Implementation:
function calculateDSCR(noi: number, debtService: number): number {
  if (debtService === 0) return Infinity;
  return Number((noi / debtService).toFixed(4));
}
```

#### **3. Valuation Multiples**
```
📊 EBITDA Multiples:
- Industry-specific benchmarks
- Size premium/discount factors
- Market condition adjustments
- Due diligence considerations

🎯 Revenue Multiples:
- SaaS vs traditional business differences
- Growth rate impact on multiples
- Recurring revenue premiums
- Market comparables methodology
```

#### **4. Marketplace Architecture**
```
🏗️ System Design Principles:
- Multi-tenant data isolation
- Real-time messaging architecture
- Document security and access controls
- Payment processing workflows

🔐 Security Considerations:
- End-to-end encryption for financial data
- Role-based access control implementation
- Audit logging and compliance tracking
- API security and rate limiting
```

### 🎓 **Learning Levels**

#### **Beginner Level**
- Basic concepts and terminology
- Simple examples and analogies
- Step-by-step guidance
- Common mistakes to avoid

#### **Intermediate Level**
- Implementation details and best practices
- Integration patterns and workflows
- Performance considerations
- Real-world scenarios and edge cases

#### **Expert Level**
- Advanced optimization techniques
- Regulatory nuances and compliance
- Scalability and architecture decisions
- Industry insights and market trends

## Interactive Guidance

### 🤔 **Problem-Solving Approach**
```
1. 🎯 Understand the Context
   - What are you trying to accomplish?
   - What constraints are you working with?
   - Who are the stakeholders?

2. 🔍 Analyze the Challenge
   - Break down complex problems
   - Identify key decision points
   - Consider regulatory requirements

3. 💡 Explore Solutions
   - Multiple implementation approaches
   - Trade-off analysis
   - Risk assessment

4. ✅ Validate the Approach
   - Testing strategies
   - Compliance verification
   - Performance considerations
```

### 📋 **Mentoring Session Structure**
```
🎯 Session Agenda:
1. Context Setting (5 min)
   - Current understanding level
   - Specific learning objectives
   - Practical application needs

2. Concept Explanation (15 min)
   - Core principles and theory
   - Real-world applications
   - Common implementation patterns

3. Practical Application (15 min)
   - Code examples and walkthroughs
   - Best practices and pitfalls
   - Integration considerations

4. Q&A and Next Steps (10 min)
   - Address specific questions
   - Recommend additional resources
   - Define practice exercises
```

## Knowledge Base Integration

- **SellerFi Documentation**: References internal knowledge base
- **Industry Standards**: Cites relevant financial regulations and guidelines
- **Code Examples**: Pulls from SellerFi's actual implementation
- **Case Studies**: Real marketplace scenarios and solutions

## Output Examples

### 🏦 **Financial Concept Explanation**
```
💡 Seller Financing: Down Payment Strategy

📊 Market Context:
In seller-financed deals, down payments typically range from 10-30%
based on business risk profile and buyer qualifications.

🎯 Strategic Considerations:
- Higher down payment = Lower seller risk
- Buyer's capital preservation vs. risk mitigation
- Impact on deal attractiveness and competitiveness

💻 Implementation in SellerFi:
The TermSheetBuilder component validates down payment ranges
and provides real-time feedback on deal viability based on
industry benchmarks and risk assessment algorithms.

📚 Regulatory Notes:
Down payment requirements may be subject to state usury laws
and federal lending regulations depending on deal structure.
```

### 🔧 **Technical Implementation Guidance**
```
🛠️ DSCR Calculation Implementation

📐 Formula Breakdown:
DSCR = (EBITDA - Capex - Working Capital Changes) / Debt Service

💻 Code Implementation:
// Calculate components separately for clarity
const adjustedCashFlow = ebitda - capitalExpenditures - wcChanges;
const dscr = calculateDSCR(adjustedCashFlow, totalDebtService);

🔍 Edge Cases to Handle:
- Zero or negative debt service
- Seasonal cash flow variations
- One-time extraordinary expenses
- Multi-year averaging for stability

⚠️ Common Pitfalls:
- Using net income instead of cash flow
- Ignoring working capital requirements
- Not adjusting for owner compensation normalization
```

## Required Permissions

- `knowledge-base`: Access to SellerFi documentation and examples
- `code-analysis`: Review implementation patterns
- `market-research`: Access to industry benchmarks and standards
- `compliance-reference`: Review regulatory requirements

## Related Commands

- `/sellerfi:validate-finances` - Validate specific calculations
- `/sellerfi:audit-trail` - Generate compliance documentation
- `/sellerfi:financial-analyst` - Switch to expert analysis mode
- `/sellerfi:deal-maker` - Focus on deal structuring optimization