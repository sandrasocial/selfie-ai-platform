#!/bin/bash

# Database Table Verification Script
# This script checks which tables are created vs what the app needs

echo "🔍 SUPABASE TABLE AUDIT REPORT"
echo "======================================"

echo "📋 TABLES REFERENCED IN APPLICATION CODE:"
echo "Core Authentication & Users:"
echo "  - profiles (dashboard, learn pages)"
echo "  - user_profiles (admin, tools, APIs)"
echo "  - leads (signup, freebie)"
echo ""

echo "📊 Admin & Agent System:"
echo "  - admin_tasks"
echo "  - agent_activity_log" 
echo "  - agent_conversations"
echo "  - agent_messages"
echo "  - agent_handoffs"
echo "  - agent_settings"
echo ""

echo "🎯 Course & Content:"
echo "  - course_progress"
echo "  - course_notes"
echo "  - content_vault"
echo "  - starter_kit_progress"
echo ""

echo "🛠️ Tools & Features:"
echo "  - photo_vault"
echo "  - vip_applications"
echo "  - purchases"
echo ""

echo "⚠️ CRITICAL ISSUES FOUND:"
echo ""
echo "1. TABLE NAME INCONSISTENCY:"
echo "   - Some code uses 'profiles' table"
echo "   - Other code uses 'user_profiles' table"
echo "   - Need to standardize this!"
echo ""

echo "2. MISSING CORE TABLES:"
echo "   - leads table (for signups)"
echo "   - May be missing tier/subscription data"
echo ""

echo "3. AUTHENTICATION FLOW:"
echo "   - User signs up → auth.users created"  
echo "   - Trigger should create profiles/user_profiles record"
echo "   - Apps expects tier field for access control"
echo ""

echo "🔧 RECOMMENDED ACTIONS:"
echo "1. Create leads table for signups"
echo "2. Standardize profiles vs user_profiles"
echo "3. Ensure tier field exists and works"
echo "4. Add missing tables from schema_export.sql"
echo ""

echo "📝 Run this audit to fix issues:"
echo "node create-tables-directly.js"
