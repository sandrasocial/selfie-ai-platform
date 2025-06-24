#!/bin/bash

# SELFIE AI™ - Push Authentication Fixes to Production
echo "🚀 Pushing authentication fixes to production..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "🔧 Fix authentication system

- Fix user profile creation trigger issues
- Improve error handling in signup/login flows  
- Add diagnostic tools for testing
- Update environment configuration
- Apply database schema fixes

Resolves: Database error saving new user & profile loading issues"

# Push to main branch (or your production branch)
git push origin main

echo "✅ Changes pushed to production!"
echo "🌐 Your deployment should update automatically"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for deployment"
echo "2. Test at: https://www.sselfie.ai/auth/signup"
echo "3. Try creating a new account"
