/**
 * SellerFi Knowledge Base Seeding Script
 *
 * Creates comprehensive articles about business acquisitions, seller financing,
 * SBA loans, and deal structuring to test the enhanced search functionality.
 *
 * Run with: npx ts-node scripts/seed-knowledge-base.ts
 */

import { PrismaClient, KBArticleStatus, KBAudience } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================================================
// KNOWLEDGE BASE ARTICLES DATA
// ============================================================================

const KNOWLEDGE_BASE_ARTICLES = [
  {
    title: "Understanding Seller Financing in Business Acquisitions",
    slug: "seller-financing-basics",
    category: "seller-financing",
    subcategory: "fundamentals",
    audience: "BUYER" as KBAudience,
    intentTags: ["definition", "basics", "fundamentals", "how-to"],
    summary: [
      "Seller financing is when the business owner acts as the bank, allowing buyers to make payments over time instead of paying the full purchase price upfront.",
      "This arrangement can benefit both parties: buyers get easier access to capital, and sellers often receive a higher purchase price and steady income stream.",
      "Seller financing typically involves 10-30% of the purchase price, with terms ranging from 3-7 years."
    ],
    keyTakeaways: [
      "Seller financing bridges the gap when traditional financing falls short",
      "Terms are negotiable and should reflect the business's cash flow capacity",
      "Both parties should involve legal and financial advisors in structuring the deal",
      "Consider using assets as collateral to protect the seller's interests"
    ],
    body: `Seller financing, also known as owner financing or seller carryback, is a powerful tool in business acquisitions that can make deals possible when traditional financing isn't sufficient or available.

## How Seller Financing Works

In a seller financing arrangement, the business owner essentially acts as a bank, allowing the buyer to pay for the business over time rather than providing the full purchase price at closing. This creates a promissory note that outlines payment terms, interest rates, and consequences for default.

## Key Components of Seller Financing

**Principal Amount**: Typically 10-30% of the total purchase price, though it can be higher in special circumstances.

**Interest Rate**: Usually ranges from 6-12%, depending on current market rates and the perceived risk of the business.

**Term Length**: Most seller financing arrangements span 3-7 years, balancing the seller's need for timely payment with the buyer's cash flow constraints.

**Payment Structure**: Can be structured as monthly payments, quarterly payments, or even annual balloon payments depending on the business's cash flow patterns.

## Benefits for Buyers

- **Reduced Capital Requirements**: Lower upfront cash needed for acquisition
- **Faster Closing**: Less due diligence required from traditional lenders
- **Seller Confidence**: Demonstrates seller's faith in the business's future performance
- **Negotiating Power**: Can be used to justify a lower purchase price

## Benefits for Sellers

- **Higher Purchase Price**: Buyers often willing to pay premium for financing assistance
- **Tax Advantages**: Installment sale treatment can spread tax liability over multiple years
- **Steady Income Stream**: Regular payments provide ongoing income
- **Deal Facilitation**: Helps close deals that might otherwise fall through

## Structuring Considerations

**Security and Collateral**: Sellers should consider taking security interests in business assets to protect their investment.

**Personal Guarantees**: Buyers may need to provide personal guarantees, especially for smaller deals.

**Performance Covenants**: Include terms that require the business to maintain certain financial metrics.

**Default Provisions**: Clear consequences for missed payments, including acceleration clauses.

## Common Risks and Mitigation

**For Sellers**:
- Risk of buyer default
- Ongoing involvement in business success
- Delayed payment of full purchase price

**Mitigation Strategies**:
- Thorough buyer vetting
- Appropriate collateral and guarantees
- Conservative payment terms based on historical cash flow

**For Buyers**:
- Personal liability for debt
- Ongoing relationship with former owner
- Potential business performance pressure

**Risk Management**:
- Realistic cash flow projections
- Professional legal and accounting advice
- Clear communication expectations with seller`,
    glossaryTerms: ["seller financing", "promissory note", "owner financing", "installment sale", "security interest"],
    status: "PUBLISHED" as KBArticleStatus,
  },
  {
    title: "SBA 7(a) Loans for Business Acquisitions: Complete Guide",
    slug: "sba-7a-loan-guide",
    category: "financing",
    subcategory: "sba-loans",
    audience: "BUYER" as KBAudience,
    intentTags: ["how-to", "guide", "process", "requirements"],
    summary: [
      "SBA 7(a) loans are the most popular government-backed financing option for business acquisitions, offering up to $5 million in funding.",
      "These loans typically require 10% down payment and offer favorable terms with longer repayment periods and competitive interest rates.",
      "The SBA guarantees 75-85% of the loan, reducing risk for lenders and making approval more likely for qualified borrowers."
    ],
    keyTakeaways: [
      "SBA 7(a) loans can finance up to 90% of business acquisition costs",
      "Borrowers must meet SBA size standards and use business for active management",
      "Process typically takes 45-90 days from application to funding",
      "Interest rates are typically prime + 2.75% to 4.75% depending on loan size"
    ],
    body: `The SBA 7(a) loan program is the Small Business Administration's most versatile and widely used lending program, particularly effective for business acquisitions.

## Program Overview

The SBA 7(a) program provides loan guarantees to approved lenders, reducing their risk and encouraging them to lend to small businesses that might not otherwise qualify for conventional financing.

**Maximum Loan Amount**: $5 million
**SBA Guarantee**: 75% for loans over $150,000, 85% for loans $150,000 and under
**Typical Down Payment**: 10% of purchase price (can be lower in some cases)
**Use of Funds**: Business acquisition, working capital, equipment, real estate

## Eligibility Requirements

### Business Size Standards
- Most retail and service businesses: $8 million average annual receipts
- Manufacturing: 500-1,500 employees depending on industry
- Wholesale: 100 employees or $41.5 million annual receipts
- Construction: $41.5 million annual receipts

### Personal Requirements
- **Credit Score**: Minimum 680 (some lenders require 700+)
- **Experience**: Relevant industry or management experience preferred
- **Investment**: Must invest 10% of project cost minimum
- **Primary Occupation**: Must manage business full-time

### Business Requirements
- For-profit business
- Located in the United States
- Owner must have invested own equity
- Not engaged in speculation or investment in rental real estate

## Application Process

### Step 1: Prepare Financial Documentation
- Personal financial statements for all owners with 20%+ ownership
- Business tax returns for 3 years
- Personal tax returns for 3 years
- Profit & loss statements and balance sheets
- Cash flow projections for 2 years
- Purchase agreement or letter of intent

### Step 2: Business Valuation and Due Diligence
- Professional business valuation
- Environmental site assessment (if applicable)
- Legal review of contracts and leases
- Financial audit or review
- Market analysis

### Step 3: Lender Selection and Application
- Choose SBA-approved lender
- Submit complete application package
- Respond to lender requests for additional information
- Complete SBA forms 1919 and 912

### Step 4: SBA Review and Approval
- Lender submits to SBA (if not delegated)
- SBA reviews and approves/declines
- Loan documents prepared
- Closing scheduled

## Interest Rates and Terms

### Interest Rates (as of 2024)
- **Loans $50,000 and under**: Prime + 4.25%
- **Loans $50,001-$250,000**: Prime + 4.00%
- **Loans $250,001-$5,000,000**: Prime + 2.75%

### Repayment Terms
- **Business acquisition**: Up to 10 years
- **Real estate**: Up to 25 years
- **Equipment**: Up to useful life of equipment
- **Working capital**: Up to 10 years

## Fees

### SBA Guarantee Fees
- Loans $150,000 and under: 0%
- Loans $150,001-$700,000: 3.00%
- Loans $700,001-$1,000,000: 3.50%
- Loans over $1,000,000: 3.75%

### Lender Fees
- Origination fees vary by lender
- Typical range: 1-3% of loan amount
- Some lenders charge processing or underwriting fees

## Tips for Success

### Strengthen Your Application
- Maintain excellent personal credit
- Gain relevant industry experience
- Prepare comprehensive business plan
- Document management systems and processes
- Show strong cash flow projections

### Choose the Right Lender
- Look for SBA Preferred Lenders (faster processing)
- Consider local community banks familiar with your market
- Compare terms and fees across multiple lenders
- Ask about their acquisition lending experience`,
    glossaryTerms: ["SBA 7(a) loan", "loan guarantee", "small business administration", "delegated lender", "PLP lender"],
    status: "PUBLISHED" as KBArticleStatus,
  },
  {
    title: "Calculating DSCR for Business Acquisitions",
    slug: "dscr-calculation-guide",
    category: "calculations",
    subcategory: "financial-metrics",
    audience: "ALL" as KBAudience,
    intentTags: ["calculation", "formula", "how-to", "example"],
    summary: [
      "Debt Service Coverage Ratio (DSCR) measures a business's ability to pay its debt obligations from its operating income.",
      "Most lenders require a minimum DSCR of 1.15-1.25, meaning the business generates 15-25% more cash than needed for debt payments.",
      "DSCR is calculated as Net Operating Income divided by Total Debt Service (principal + interest payments)."
    ],
    keyTakeaways: [
      "DSCR = Net Operating Income divided by Total Debt Service",
      "Minimum acceptable DSCR for most lenders is 1.15-1.25",
      "Higher DSCR indicates stronger ability to service debt",
      "Consider using adjusted cash flow that includes owner salary and discretionary expenses"
    ],
    body: `Debt Service Coverage Ratio (DSCR) is one of the most important financial metrics lenders use to evaluate business acquisition loans. Understanding how to calculate and improve DSCR can make the difference between loan approval and rejection.

## Understanding DSCR

DSCR measures a company's ability to use its operating income to pay all debt obligations, including interest and principal payments on both existing debt and proposed new financing.

### The Basic Formula

**DSCR = Net Operating Income divided by Total Debt Service**

Where:
- **Net Operating Income** = Earnings before interest, taxes, depreciation, and amortization (EBITDA) or Seller's Discretionary Earnings (SDE)
- **Total Debt Service** = Annual principal and interest payments on all debt

## Different DSCR Calculation Methods

### Method 1: Traditional EBITDA DSCR

EBITDA DSCR = EBITDA divided by Total Debt Service

Example:
- EBITDA: $180,000
- Annual Debt Service: $144,000
- DSCR = $180,000 divided by $144,000 = 1.25

### Method 2: Cash Flow DSCR

Cash Flow DSCR = (Net Income + Depreciation + Interest) divided by Total Debt Service

Example:
- Net Income: $85,000
- Depreciation: $25,000
- Interest Expense: $15,000
- Total: $125,000
- Annual Debt Service: $100,000
- DSCR = $125,000 divided by $100,000 = 1.25

### Method 3: SDE DSCR (Most Common for Small Business)

SDE DSCR = SDE divided by Total Debt Service

Where SDE = Net Income + Owner Salary + Interest + Taxes + Depreciation + Discretionary Expenses

Example:
- Net Income: $75,000
- Owner Salary: $60,000
- Interest: $8,000
- Taxes: $12,000
- Depreciation: $15,000
- Personal Expenses: $10,000
- SDE Total: $180,000
- Annual Debt Service: $144,000
- DSCR = $180,000 divided by $144,000 = 1.25

## DSCR Requirements by Lender Type

### SBA Lenders
- **Minimum**: 1.15
- **Preferred**: 1.25 or higher
- Some lenders require 1.35+ for acquisitions

### Conventional Banks
- **Minimum**: 1.20-1.25
- **Preferred**: 1.35-1.50
- Higher requirements for unsecured loans

### Alternative Lenders
- **Minimum**: 1.10-1.25
- Often accept lower DSCR with higher interest rates
- May focus more on collateral than cash flow

## Improving DSCR

### Increase Cash Flow
- Reduce unnecessary expenses
- Improve operational efficiency
- Increase pricing where possible
- Add revenue streams

### Adjust Loan Terms
- Extend loan term to reduce monthly payments
- Negotiate better interest rates
- Consider interest-only periods
- Use seller financing to reduce bank debt

## Common DSCR Mistakes

### Calculation Errors
- Including non-recurring income
- Failing to add back owner benefits
- Not including all debt obligations
- Using cash basis vs. accrual accounting inconsistently

### Presentation Issues
- Not documenting add-backs clearly
- Failing to explain unusual expenses
- Not providing supporting documentation
- Using overly optimistic projections`,
    glossaryTerms: ["DSCR", "debt service coverage ratio", "net operating income", "SDE", "EBITDA", "debt service"],
    status: "PUBLISHED" as KBArticleStatus,
  },
  {
    title: "SDE vs EBITDA: Understanding the Difference in Business Valuation",
    slug: "sde-vs-ebitda-explained",
    category: "valuation",
    subcategory: "financial-metrics",
    audience: "ALL" as KBAudience,
    intentTags: ["definition", "comparison", "explanation", "fundamentals"],
    summary: [
      "SDE (Seller's Discretionary Earnings) and EBITDA serve different purposes in business valuation, with SDE better for smaller businesses and EBITDA for larger companies.",
      "SDE includes owner salary and benefits, while EBITDA assumes professional management is in place.",
      "Most businesses under $5M in revenue use SDE multiples, while larger businesses typically use EBITDA multiples."
    ],
    keyTakeaways: [
      "SDE = Net Income + Owner Salary + Interest + Taxes + Depreciation + Discretionary Expenses",
      "EBITDA = Revenue - Operating Expenses (excluding Interest, Taxes, Depreciation, Amortization)",
      "SDE multiples typically range from 1.5x to 4x for small businesses",
      "EBITDA multiples typically range from 3x to 8x+ for larger businesses"
    ],
    body: `Understanding the difference between Seller's Discretionary Earnings (SDE) and Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA) is crucial for anyone involved in business acquisitions, as these metrics form the foundation of most business valuations.

## What is SDE (Seller's Discretionary Earnings)?

SDE represents the total financial benefit that a single owner-operator receives from owning and operating a business. It includes not just the business's net income, but also the owner's salary, benefits, and discretionary expenses.

### SDE Calculation Formula:

SDE = Net Income + Owner's Salary and Benefits + Interest Expense + Taxes + Depreciation and Amortization + Discretionary/Personal Expenses + One-time Expenses

### Example SDE Calculation:

- Net Income: $125,000
- Owner Salary: $80,000
- Owner Health Insurance: $12,000
- Interest Expense: $8,000
- Income Taxes: $25,000
- Depreciation: $15,000
- Personal Auto Expense: $6,000
- Owner's Wife on Payroll: $20,000
- One-time Legal Fees: $5,000
- **Total SDE: $296,000**

## What is EBITDA?

EBITDA represents a company's operating performance by showing earnings before the impact of financing decisions (interest), government policies (taxes), and accounting decisions (depreciation and amortization).

### EBITDA Calculation Formula:

EBITDA = Revenue - Operating Expenses (Excluding Interest, Taxes, Depreciation, Amortization)

Or alternatively:

EBITDA = Net Income + Interest Expense + Taxes + Depreciation + Amortization

### Example EBITDA Calculation:

- Revenue: $2,500,000
- Cost of Goods Sold: ($1,000,000)
- Gross Profit: $1,500,000

Operating Expenses:
- Salaries & Benefits: ($450,000)
- Rent: ($120,000)
- Marketing: ($80,000)
- Other Operating Expenses: ($250,000)
- Total Operating Expenses: ($900,000)
- **EBITDA: $600,000**

## Key Differences Between SDE and EBITDA

### 1. Business Size and Structure

**SDE is used for:**
- Smaller businesses (typically under $5M revenue)
- Owner-operated businesses
- Single or few location operations
- Businesses where owner is actively involved in daily operations

**EBITDA is used for:**
- Larger businesses (typically over $5M revenue)
- Management-operated businesses
- Multi-location operations
- Businesses with professional management teams

### 2. Valuation Multiples

**SDE Multiples:**
- Typically range from 1.5x to 4x SDE
- Lower multiples reflect higher owner dependence
- Service businesses often at lower end (2-3x)
- Asset-heavy businesses may command higher multiples

**EBITDA Multiples:**
- Typically range from 3x to 8x+ EBITDA
- Higher multiples for larger, more stable businesses
- Technology and scalable businesses command premium multiples
- Market conditions significantly impact multiples

## When to Use Each Metric

### Use SDE When:
- Business revenue under $5 million annually
- Owner works full-time in business
- Limited management infrastructure
- Buyer plans to operate business personally
- Seller is heavily involved in daily operations

### Use EBITDA When:
- Business revenue over $5 million annually
- Professional management team in place
- Multiple locations or complex operations
- Buyer is an investor (not operator)
- Business can operate independently of owner

## Valuation Examples

### Small Business (SDE Method):

Restaurant Business:
- Annual Revenue: $1.2M
- SDE: $180,000
- Industry Multiple: 2.5x
- **Estimated Value: $180,000 x 2.5 = $450,000**

### Larger Business (EBITDA Method):

Manufacturing Company:
- Annual Revenue: $8M
- EBITDA: $1.2M
- Industry Multiple: 4.5x
- **Estimated Value: $1.2M x 4.5 = $5.4M**`,
    glossaryTerms: ["SDE", "EBITDA", "seller's discretionary earnings", "valuation multiple", "net income", "cash flow"],
    status: "PUBLISHED" as KBArticleStatus,
  },
  {
    title: "Red Flags in Business Acquisition Due Diligence",
    slug: "business-acquisition-red-flags",
    category: "due-diligence",
    subcategory: "risk-assessment",
    audience: "BUYER" as KBAudience,
    intentTags: ["warning", "risk", "checklist", "due-diligence"],
    summary: [
      "Red flags in business acquisitions can save buyers from costly mistakes and help identify potential deal-breakers early in the process.",
      "Financial red flags include declining revenue trends, poor cash flow management, and inconsistent accounting practices.",
      "Operational red flags encompass customer concentration, key person dependency, and regulatory compliance issues."
    ],
    keyTakeaways: [
      "Look for declining financial trends over multiple years",
      "Be wary of businesses with high customer concentration (>30% from one customer)",
      "Verify all licenses, permits, and regulatory compliance",
      "Watch for sudden changes in accounting methods or unusual transactions"
    ],
    body: `Due diligence is your opportunity to uncover potential problems before committing to a business acquisition. Recognizing red flags early can save you from expensive mistakes and help you negotiate better terms or walk away from problematic deals.

## Financial Red Flags

### Declining Revenue Trends
**Warning Signs:**
- Revenue declining for 2+ consecutive years
- Seasonal patterns becoming more pronounced
- Major customer losses not explained
- Market share erosion

**What to Investigate:**
- Industry trends and competitive pressures
- Customer retention rates and satisfaction
- Marketing effectiveness and lead generation
- Product/service obsolescence risks

### Cash Flow Problems
**Warning Signs:**
- Negative operating cash flow
- Increasing accounts receivable aging
- Delayed vendor payments
- Frequent bank overdrafts

**Red Flag Example:**

Business shows $200K net income but:
- AR over 90 days: $150K (was $50K last year)
- Vendor payments delayed 60+ days
- Owner has been funding operations from personal assets

### Accounting Irregularities
**Warning Signs:**
- Frequent changes in accounting methods
- Unexplained journal entries
- Missing documentation for large transactions
- Different numbers on tax returns vs. financial statements

## Operational Red Flags

### Customer Concentration Risk
**Danger Threshold:**
- Single customer >30% of revenue
- Top 3 customers >50% of revenue
- Any customer relationship at risk

**Risk Assessment:**

Example: $2M Revenue Business
- Customer A: $800K (40%) - Contract expires next year
- Customer B: $400K (20%) - Price pressure increasing
- Customer C: $300K (15%) - New competitor bidding
- **Risk: 75% of revenue at risk within 24 months**

### Key Person Dependency
**Warning Signs:**
- Owner handles all major customer relationships
- Critical processes known only by owner
- No documented procedures or systems
- Staff unwilling to stay after sale

### Regulatory and Legal Issues
**Red Flags:**
- Expired licenses or permits
- Pending litigation or claims
- Regulatory violations or warnings
- Intellectual property disputes

## Market and Competitive Red Flags

### Industry Decline
**Warning Indicators:**
- Shrinking total addressable market
- New technology disruption
- Regulatory changes affecting industry
- Major competitors exiting market

### Competitive Disadvantages
**Red Flags:**
- Outdated technology or equipment
- Higher cost structure than competitors
- Limited market differentiation
- Dependence on declining channels

## Seller Behavior Red Flags

### Urgency Without Explanation
**Concerning Behaviors:**
- Pressure to close quickly
- Reluctance to allow thorough due diligence
- Unwillingness to provide documentation
- Defensive responses to questions

### Information Inconsistencies
**Red Flags:**
- Stories change between meetings
- Financial information doesn't match tax returns
- Conflicting explanations for business performance
- Reluctance to introduce key customers or suppliers

## How to Respond to Red Flags

### Minor Red Flags
**Response Strategies:**
- Request additional documentation
- Negotiate price adjustments
- Include warranty provisions in purchase agreement
- Require escrow funds for potential issues

### Moderate Red Flags
**Actions to Take:**
- Hire specialist consultants
- Extend due diligence period
- Renegotiate terms significantly
- Consider walking away

### Major Red Flags
**Deal Breakers:**
- Fraudulent financial reporting
- Undisclosed major liabilities
- Fundamental business model flaws
- Illegal or unethical practices

## Conclusion

Red flags are not necessarily deal killers, but they should trigger deeper investigation and potentially affect your offer terms, purchase price, or decision to proceed. The key is thorough, systematic due diligence that uncovers issues before they become expensive surprises.

Remember: It's better to pass on a deal with too many red flags than to acquire problems that could threaten your investment and future success.`,
    glossaryTerms: ["due diligence", "red flags", "customer concentration", "key person risk", "contingent liability"],
    status: "PUBLISHED" as KBArticleStatus,
  }
]

// ============================================================================
// SEEDING FUNCTIONS
// ============================================================================

async function clearKnowledgeBase() {
  console.log('🧹 Clearing existing knowledge base...')

  await prisma.kBEmbedding.deleteMany({})
  await prisma.kBConversation.deleteMany({})
  await prisma.kBArticle.deleteMany({})

  console.log('✅ Knowledge base cleared')
}

async function seedKnowledgeBase() {
  console.log('📚 Seeding knowledge base articles...')

  for (const articleData of KNOWLEDGE_BASE_ARTICLES) {
    console.log(`📝 Creating article: ${articleData.title}`)

    const article = await prisma.kBArticle.create({
      data: {
        title: articleData.title,
        slug: articleData.slug,
        category: articleData.category,
        subcategory: articleData.subcategory,
        audience: articleData.audience,
        intentTags: articleData.intentTags,
        summary: articleData.summary,
        keyTakeaways: articleData.keyTakeaways,
        body: articleData.body,
        glossaryTerms: articleData.glossaryTerms,
        safeAnswerRules: [], // Empty array as default
        status: articleData.status,
        version: "1.0",
        lastUpdated: new Date()
      }
    })

    console.log(`✅ Created article: ${article.title} (ID: ${article.id})`)
  }

  console.log('✅ Knowledge base seeding completed')
}

async function generateSampleSearches() {
  console.log('🔍 Generating sample searches for testing...')

  const sampleQueries = [
    "How do I structure seller financing?",
    "What are SBA 7(a) loan requirements?",
    "Calculate DSCR for business loan",
    "Difference between SDE and EBITDA",
    "Red flags in due diligence",
    "Business acquisition financing options",
    "Seller carryback terms",
    "Small business loan qualification",
    "Business valuation methods"
  ]

  // These could be used to test search functionality
  console.log('📋 Sample search queries for testing:')
  sampleQueries.forEach((query, index) => {
    console.log(`${index + 1}. "${query}"`)
  })

  console.log('✅ Sample searches ready for testing')
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    console.log('🚀 Starting SellerFi Knowledge Base seeding...')

    await clearKnowledgeBase()
    await seedKnowledgeBase()
    await generateSampleSearches()

    console.log('🎉 SellerFi Knowledge Base seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${KNOWLEDGE_BASE_ARTICLES.length} articles created`)
    console.log('   - Enhanced search functionality ready for testing')
    console.log('   - Sample queries provided for validation')

  } catch (error) {
    console.error('❌ Error seeding knowledge base:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { main as seedKnowledgeBase }