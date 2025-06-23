# Authentication System Audit & Cleanup Plan

## Current State Analysis

### 🟢 KEEP - Modern Auth System (New Implementation)
**Core files to maintain:**
- `/hooks/useAuth.tsx` - Main auth hook with context provider
- `/lib/auth.ts` - Auth service and utilities
- `/types/user.ts` - TypeScript types for new schema
- `/types/supabase/supabase.ts` - Generated Supabase types
- `/utils/supabase/client.ts` - Client-side Supabase client
- `/utils/supabase/server.ts` - Server-side Supabase client
- `/app/api/profile/route.ts` - Profile API using new system
- `/app/api/onboarding/route.ts` - Onboarding API using new system
- `/app/api/lead-magnets/route.ts` - Lead magnets API using new system
- `/app/api/glow-check/route.ts` - Glow check API using new system

**Auth pages using new system:**
- `/app/auth/login/page.tsx`
- `/app/auth/signup/page.tsx` 
- `/app/auth/reset-password/page.tsx`
- `/app/admin/login/page.tsx`

**Supporting files:**
- `/middleware.ts` - Route protection using new auth
- `/supabase/migrations/20250623_complete_user_system.sql` - Database migration

### 🟡 CONFLICTING - Legacy System Files (To Remove/Update)

**Files using deprecated `createClientComponentClient`:**
- `/app/dashboard/page.tsx` - **NEEDS REFACTOR**
- `/app/admin/users/page.tsx` - **NEEDS REFACTOR**
- `/app/(marketing)/vip/apply/page.tsx` - **NEEDS REFACTOR**
- `/app/tools/photo-vault/page.tsx` - **NEEDS REFACTOR**
- `/app/learn/starter-kit/page.tsx` - **NEEDS REFACTOR**
- `/app/components/admin/AdminLayout.tsx` - **NEEDS REFACTOR**
- `/components/admin/AdminNavigation.tsx` - **NEEDS REFACTOR**
- `/components/admin/AdminAuthGuard.tsx` - **NEEDS REFACTOR**

**API routes using old auth helpers:**
- `/app/api/user-profiles/route.ts` - **REMOVE** (conflicts with `/app/api/profile/route.ts`)

**Legacy profile hook:**
- `/hooks/useProfile.ts` - **NEEDS UPDATE** (uses wrong API endpoint)

### 🔴 REMOVE - Legacy/Backup Files
**Client backup directory (entire directory):**
- `/client_backup/` - Contains old implementation, safe to remove

**Legacy Supabase files:**
- `supabase-policies.sql`
- `supabase-schema.sql`
- `supabase_schema_creation.sql`
- `supabase_schema_export.sql`
- Various other duplicate schema files

**Old verification/setup scripts:**
- `verify_supabase_auth_flow.js`
- `setup-supabase-database.js`
- `validate_supabase_migration.js`
- Various other legacy scripts

## Key Issues Found

### 1. API Route Conflicts
- `/app/api/user-profiles/route.ts` conflicts with `/app/api/profile/route.ts`
- Old route uses `createServerComponentClient`, new one uses proper server client
- Dashboard and other components calling wrong endpoints

### 2. Auth Pattern Inconsistency
- Some files use `createClientComponentClient` (deprecated)
- Some files use `useAuth` hook (correct)
- Dashboard mixes both patterns

### 3. Database Schema Mismatch
- Old files reference `profiles` table
- New system uses `user_profiles` table
- Field names don't match between systems

### 4. Profile Hook Mismatch
- `useProfile.ts` calls `/api/user-profiles` (old)
- Should call `/api/profile` (new)
- Used by dashboard and other components

## Cleanup Action Plan

### Phase 1: Remove Legacy Files
1. Delete `/client_backup/` directory entirely
2. Remove duplicate API route `/app/api/user-profiles/route.ts`
3. Remove legacy Supabase schema files
4. Remove old verification scripts

### Phase 2: Update Profile System
1. Fix `/hooks/useProfile.ts` to use correct API endpoint (`/api/profile`)
2. Update profile hook to match new UserProfile type
3. Ensure compatibility with `useAuth` system

### Phase 3: Refactor Components
1. Update dashboard to use `useAuth` hook instead of `createClientComponentClient`
2. Update admin components to use new auth system
3. Update all marketing pages to use new auth system
4. Update tools pages to use new auth system

### Phase 4: Final Validation
1. Test all auth flows
2. Verify profile loading works correctly
3. Test admin access
4. Validate all protected routes

## Migration Benefits
- Single, consistent auth implementation
- Type-safe throughout the application
- Proper error handling and loading states
- Modern React patterns with hooks
- Server-side and client-side auth utilities
- Comprehensive user profile management
