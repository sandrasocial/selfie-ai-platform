#!/bin/bash

# SSELFIE Auth System Test Script
# Run this after applying the database fix

echo "🔧 SSELFIE Authentication System Test"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-flight checklist:${NC}"
echo "1. ✅ Run the SQL fix in Supabase Dashboard"
echo "2. ✅ Disable email confirmations in Auth settings"
echo "3. ✅ Clear browser cache/cookies"
echo ""

echo -e "${YELLOW}🧪 Testing URLs:${NC}"
echo "• Auth Diagnostic: http://localhost:3000/diagnostic/auth"
echo "• Live Signup: http://localhost:3000/auth/signup"
echo "• Live Login: http://localhost:3000/auth/login"
echo ""

echo -e "${BLUE}🔍 What to expect:${NC}"
echo "✅ Signup should work without email confirmation"
echo "✅ Login should work immediately after signup"
echo "✅ Profile should load in dashboard"
echo "✅ No 'Database error saving new user' messages"
echo "✅ No 'User already registered' for new emails"
echo ""

echo -e "${RED}🚨 If you still see errors:${NC}"
echo "1. Check browser console (F12 → Console tab)"
echo "2. Verify SQL was run successfully in Supabase"
echo "3. Confirm email confirmations are disabled"
echo "4. Try incognito/private browser window"
echo ""

echo -e "${GREEN}🎯 Quick Test Steps:${NC}"
echo "1. Go to: http://localhost:3000/diagnostic/auth"
echo "2. Click 'Run Full Diagnostic'"
echo "3. Check for any errors in the logs"
echo "4. If diagnostic passes, test real signup/login pages"
echo ""

echo -e "${BLUE}💻 Browser Console Commands:${NC}"
echo "// Test auth directly in browser console:"
echo "await window.simpleAuth.testSignUp('test@example.com', 'password123')"
echo "await window.simpleAuth.testSignIn('test@example.com', 'password123')"
echo ""

read -p "Press Enter to open diagnostic page in browser..."

# Try to open the diagnostic page
if command -v open &> /dev/null; then
    open "http://localhost:3000/diagnostic/auth"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000/diagnostic/auth"
else
    echo "Please manually open: http://localhost:3000/diagnostic/auth"
fi

echo -e "${GREEN}🚀 Test completed! Check the diagnostic results.${NC}"
