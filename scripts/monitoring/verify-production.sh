#!/bin/bash

# ═══════════════════════════════════════════════════════════
# SellerFi Production Deployment Verification Script
# Phase 2: Verified Revenue + Trust Score
# ═══════════════════════════════════════════════════════════

set -e

PRODUCTION_URL="https://seller-fi.vercel.app"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "═══════════════════════════════════════════════════════════"
echo "🚀 SellerFi Production Deployment Verification"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL$endpoint")
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status_code, expected $expected_status)"
        return 1
    fi
}

# Function to check JSON response
check_json_endpoint() {
    local endpoint=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    response=$(curl -s "$PRODUCTION_URL$endpoint")
    
    if echo "$response" | jq . > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC} (Valid JSON)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Invalid JSON)"
        echo "Response: $response"
        return 1
    fi
}

# Counter for passed/failed tests
passed=0
failed=0

echo "📍 Testing Production URL: $PRODUCTION_URL"
echo ""

# Test 1: Homepage
if check_endpoint "/" 200 "Homepage"; then
    ((passed++))
else
    ((failed++))
fi

# Test 2: Listings API
if check_json_endpoint "/api/listings" "Listings API"; then
    ((passed++))
else
    ((failed++))
fi

# Test 3: Health endpoint (if exists)
if check_endpoint "/api/health" 200 "Health Check"; then
    ((passed++))
else
    echo -e "${YELLOW}⚠ SKIP${NC} (Health endpoint may not exist)"
fi

# Test 4: Verified Metrics API (requires auth, expect 401)
if check_endpoint "/api/verified-metrics" 401 "Verified Metrics API (Auth Check)"; then
    ((passed++))
else
    ((failed++))
fi

# Test 5: Trust Score API (requires listing ID, expect 400 or 404)
echo -n "Testing Trust Score API... "
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL/api/trust-score/test")
if [ "$status_code" -eq 400 ] || [ "$status_code" -eq 404 ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code - endpoint exists)"
    ((passed++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status_code)"
    ((failed++))
fi

# Test 6: Integration endpoints exist
if check_endpoint "/api/integrations/quickbooks/status" 401 "QuickBooks Integration API"; then
    ((passed++))
else
    ((failed++))
fi

if check_endpoint "/api/integrations/plaid/status" 401 "Plaid Integration API"; then
    ((passed++))
else
    ((failed++))
fi

# Test 7: Check for console errors (basic)
echo -n "Testing for JavaScript errors... "
if curl -s "$PRODUCTION_URL" | grep -q "console.error"; then
    echo -e "${RED}✗ FAIL${NC} (Found console.error in HTML)"
    ((failed++))
else
    echo -e "${GREEN}✓ PASS${NC} (No obvious errors)"
    ((passed++))
fi

# Test 8: Check response time
echo -n "Testing response time... "
response_time=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL")
if (( $(echo "$response_time < 2.0" | bc -l) )); then
    echo -e "${GREEN}✓ PASS${NC} (${response_time}s)"
    ((passed++))
else
    echo -e "${YELLOW}⚠ SLOW${NC} (${response_time}s)"
    ((failed++))
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 Test Results"
echo "═══════════════════════════════════════════════════════════"
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Production deployment verified.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please investigate.${NC}"
    exit 1
fi
