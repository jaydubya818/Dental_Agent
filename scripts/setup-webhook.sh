#!/bin/bash
# Setup Stripe Webhook Endpoint
# Run with: STRIPE_SECRET_KEY=sk_test_... ./scripts/setup-webhook.sh

set -e

STRIPE_KEY="${STRIPE_SECRET_KEY}"
WEBHOOK_URL="https://seller-fi.vercel.app/api/webhooks/stripe"

if [ -z "$STRIPE_KEY" ]; then
  echo "❌ Error: STRIPE_SECRET_KEY environment variable is required"
  echo "Usage: STRIPE_SECRET_KEY=sk_test_... ./scripts/setup-webhook.sh"
  exit 1
fi

echo "🔧 Creating Stripe webhook endpoint..."
echo "URL: $WEBHOOK_URL"
echo ""

# Create webhook endpoint
RESPONSE=$(curl -s -X POST https://api.stripe.com/v1/webhook_endpoints \
  -u "$STRIPE_KEY:" \
  -d "url=$WEBHOOK_URL" \
  -d "enabled_events[]=checkout.session.completed" \
  -d "enabled_events[]=customer.subscription.created" \
  -d "enabled_events[]=customer.subscription.updated" \
  -d "enabled_events[]=customer.subscription.deleted" \
  -d "enabled_events[]=invoice.payment_succeeded" \
  -d "enabled_events[]=invoice.payment_failed")

# Extract webhook ID and secret
WEBHOOK_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
WEBHOOK_SECRET=$(echo "$RESPONSE" | grep -o '"secret":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$WEBHOOK_ID" ]; then
  echo "❌ Failed to create webhook"
  echo "Response: $RESPONSE"
  exit 1
fi

echo "✅ Webhook created successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Webhook ID: $WEBHOOK_ID"
echo "Webhook Secret: $WEBHOOK_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Add this to your .env file:"
echo "STRIPE_WEBHOOK_SECRET=\"$WEBHOOK_SECRET\""
echo ""
echo "📝 Add to Vercel (production):"
echo "vercel env add STRIPE_WEBHOOK_SECRET"
echo "# Then paste: $WEBHOOK_SECRET"
echo ""
echo "🎉 Done! Your webhook is ready to receive events."
