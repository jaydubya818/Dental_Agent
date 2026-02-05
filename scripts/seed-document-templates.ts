/**
 * Seed document templates for NDA and LOI
 * Run with: npx ts-node scripts/seed-document-templates.ts
 */

import { PrismaClient, DocumentType } from "@prisma/client"

const prisma = new PrismaClient()

const NDA_TEMPLATE = `
NON-DISCLOSURE AGREEMENT (NDA)

This Non-Disclosure Agreement ("Agreement") is entered into as of {{EFFECTIVE_DATE}} between:

{{SELLER_NAME}} ("Disclosing Party")
{{SELLER_EMAIL}}

and

{{BUYER_NAME}} ("Receiving Party")
{{BUYER_EMAIL}}

regarding the potential acquisition of {{BUSINESS_NAME}} (Listing ID: {{LISTING_ID}}).

1. CONFIDENTIAL INFORMATION
The Receiving Party agrees to keep confidential all non-public information shared by the Disclosing Party regarding the business opportunity, including but not limited to:
• Business name and legal entity details
• Financial statements, revenue, and profit data
• Customer lists and contracts
• Operational procedures and trade secrets
• Any other proprietary business information

2. USE OF INFORMATION
The Receiving Party agrees to use the Confidential Information solely for the purpose of evaluating the potential acquisition of the business.

3. NON-DISCLOSURE
The Receiving Party agrees not to disclose any Confidential Information to any third party without prior written consent from the Disclosing Party.

4. TERM
This Agreement shall remain in effect for a period of two (2) years from the date of acceptance.

5. RETURN OF MATERIALS
Upon request by the Disclosing Party or termination of discussions, the Receiving Party agrees to return or destroy all materials containing Confidential Information.

6. LEGAL ACKNOWLEDGMENT
The Receiving Party acknowledges that breach of this Agreement may result in irreparable harm to the Disclosing Party and agrees that the Disclosing Party may seek injunctive relief in addition to any other legal remedies.

By accepting this Agreement, the Receiving Party acknowledges that they have read, understood, and agree to be bound by the terms and conditions set forth herein.

{{BUYER_NAME}}
{{BUYER_EMAIL}}
Date: {{EFFECTIVE_DATE}}
`.trim()

const LOI_TEMPLATE = `
LETTER OF INTENT (LOI)

{{EFFECTIVE_DATE}}

{{SELLER_NAME}}
{{SELLER_EMAIL}}

Re: Letter of Intent for Acquisition of {{BUSINESS_NAME}}

Dear {{SELLER_NAME}},

This Letter of Intent ("LOI") sets forth the preliminary understanding between {{BUYER_NAME}} ("Buyer") and you ("Seller") regarding the potential acquisition of {{BUSINESS_NAME}} (the "Business").

1. PURCHASE PRICE
The proposed purchase price for the Business is {{ASKING_PRICE}}, subject to due diligence and final agreement.

2. FINANCING STRUCTURE
The acquisition will be structured as follows:
• Down Payment: {{DOWN_PAYMENT}}
• Seller Financing: {{SELLER_CARRY_AMOUNT}} at {{SELLER_CARRY_RATE}} interest rate, amortized over {{SELLER_CARRY_YEARS}}
• Additional financing may be obtained through traditional bank or SBA loans

3. DUE DILIGENCE
Buyer shall have a period of 30-60 days to conduct due diligence on the Business, including but not limited to:
• Financial records and statements
• Customer contracts and relationships
• Operational procedures
• Legal and regulatory compliance
• Asset verification

4. CONDITIONS
This LOI is subject to:
• Satisfactory completion of due diligence
• Execution of a definitive purchase agreement
• Any required regulatory approvals
• Financing availability

5. EXCLUSIVITY
Seller agrees to negotiate exclusively with Buyer for a period of 60 days from the date of this LOI, subject to extension by mutual agreement.

6. NON-BINDING
This LOI is non-binding except for the exclusivity provision and confidentiality obligations. The parties intend to enter into a definitive purchase agreement upon completion of due diligence.

7. CONFIDENTIALITY
All information exchanged in connection with this potential transaction shall remain confidential in accordance with the previously executed Non-Disclosure Agreement.

We look forward to working with you to complete this transaction.

Sincerely,

{{BUYER_NAME}}
{{BUYER_EMAIL}}
Date: {{EFFECTIVE_DATE}}

---

This LOI is subject to the execution of a definitive purchase agreement. Neither party shall be bound until such agreement is executed.
`.trim()

async function seedTemplates() {
  console.log("🌱 Seeding document templates...")

  try {
    // Upsert NDA Template
    const ndaTemplate = await prisma.documentTemplate.upsert({
      where: {
        docType_isDefault: {
          docType: DocumentType.NDA_TEMPLATE,
          isDefault: true,
        },
      },
      update: {
        name: "Standard NDA Template",
        description: "Default non-disclosure agreement template for seller-financed deals",
        templateContent: NDA_TEMPLATE,
        variables: [
          "BUYER_NAME",
          "BUYER_EMAIL",
          "SELLER_NAME",
          "SELLER_EMAIL",
          "BUSINESS_NAME",
          "LISTING_ID",
          "EFFECTIVE_DATE",
        ],
        isActive: true,
        version: 1,
      },
      create: {
        name: "Standard NDA Template",
        description: "Default non-disclosure agreement template for seller-financed deals",
        docType: DocumentType.NDA_TEMPLATE,
        templateContent: NDA_TEMPLATE,
        variables: [
          "BUYER_NAME",
          "BUYER_EMAIL",
          "SELLER_NAME",
          "SELLER_EMAIL",
          "BUSINESS_NAME",
          "LISTING_ID",
          "EFFECTIVE_DATE",
        ],
        isDefault: true,
        isActive: true,
        version: 1,
      },
    })

    console.log("✅ Created/updated NDA template:", ndaTemplate.id)

    // Upsert LOI Template
    const loiTemplate = await prisma.documentTemplate.upsert({
      where: {
        docType_isDefault: {
          docType: DocumentType.LOI_TEMPLATE,
          isDefault: true,
        },
      },
      update: {
        name: "Standard LOI Template",
        description: "Default letter of intent template for seller-financed deals",
        templateContent: LOI_TEMPLATE,
        variables: [
          "BUYER_NAME",
          "BUYER_EMAIL",
          "SELLER_NAME",
          "SELLER_EMAIL",
          "BUSINESS_NAME",
          "LISTING_ID",
          "EFFECTIVE_DATE",
          "ASKING_PRICE",
          "DOWN_PAYMENT",
          "SELLER_CARRY_AMOUNT",
          "SELLER_CARRY_RATE",
          "SELLER_CARRY_YEARS",
        ],
        isActive: true,
        version: 1,
      },
      create: {
        name: "Standard LOI Template",
        description: "Default letter of intent template for seller-financed deals",
        docType: DocumentType.LOI_TEMPLATE,
        templateContent: LOI_TEMPLATE,
        variables: [
          "BUYER_NAME",
          "BUYER_EMAIL",
          "SELLER_NAME",
          "SELLER_EMAIL",
          "BUSINESS_NAME",
          "LISTING_ID",
          "EFFECTIVE_DATE",
          "ASKING_PRICE",
          "DOWN_PAYMENT",
          "SELLER_CARRY_AMOUNT",
          "SELLER_CARRY_RATE",
          "SELLER_CARRY_YEARS",
        ],
        isDefault: true,
        isActive: true,
        version: 1,
      },
    })

    console.log("✅ Created/updated LOI template:", loiTemplate.id)
    console.log("✨ Document templates seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding templates:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  seedTemplates()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedTemplates }

