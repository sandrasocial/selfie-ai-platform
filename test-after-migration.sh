#!/bin/bash

echo "🧪 TESTING AUTH AFTER SQL MIGRATION"
echo "=================================="
echo ""
echo "1. Make sure you've run the SQL migration in Supabase"
echo "2. Make sure email confirmations are disabled"
echo "3. Clear your browser cache/cookies"
echo ""
echo "Starting development server..."
echo ""

# Start the dev server
npm run dev &
DEV_PID=$!

# Wait a moment for server to start
sleep 5

echo ""
echo "🌐 Opening test pages..."
echo ""

# Open the diagnostic page first
open "http://localhost:3000/diagnostic/auth"

echo "📋 Test Checklist:"
echo "=================="
echo "□ 1. Test signup with a new email"
echo "□ 2. Check that no errors appear"
echo "□ 3. Test sign in with the same account"
echo "□ 4. Verify profile loads correctly"
echo "□ 5. Check browser console for any errors"
echo ""
echo "💡 If you see 'Database error saving new user', the SQL migration wasn't run correctly."
echo ""
echo "Press Ctrl+C to stop the dev server when done testing."

# Keep the script running
wait $DEV_PID
