# GitHub Integration Setup Guide

## Overview
This guide covers the complete setup of GitHub integration for your admin dashboard, including environment variables, database tables, API endpoints, and testing.

## ✅ Completed Implementation

### 1. Package Installation
- ✅ Installed `@octokit/rest` package for GitHub API integration

### 2. Database Tables Created
- ✅ `admin_tasks` table for managing administrative tasks
- ✅ `agent_activity` table for logging agent activities
- ✅ Added performance indexes for better query performance

### 3. API Endpoints Created
- ✅ `/api/github/route.ts` - Main GitHub operations (create, update, delete files)
- ✅ `/api/github/test/route.ts` - GitHub integration testing
- ✅ `/api/admin/tasks/route.ts` - Admin task management
- ✅ `/api/admin/activity/route.ts` - Agent activity logging

### 4. Utility Library
- ✅ `lib/github.ts` - GitHub service class with helper methods

### 5. Admin Dashboard
- ✅ `app/(dashboard)/admin/page.tsx` - Admin dashboard with GitHub testing UI
- ✅ Added missing UI components (Badge, CardDescription)

## 🔧 Setup Required

### 1. Environment Variables
Add these to your `.env.local` file:

```bash
# GitHub Integration
GITHUB_TOKEN=[your_github_personal_access_token]
GITHUB_OWNER=sandrasocial
GITHUB_REPO=selfie-ai-platform

# Agent tokens (generate unique strings for each)
AGENT_DIANA_TOKEN=diana_agent_token_2024_unique_identifier
AGENT_VICTORIA_TOKEN=victoria_agent_token_2024_unique_identifier
AGENT_RACHEL_TOKEN=rachel_agent_token_2024_unique_identifier
AGENT_MAYA_TOKEN=maya_agent_token_2024_unique_identifier
AGENT_QUINN_TOKEN=quinn_agent_token_2024_unique_identifier
AGENT_AVA_TOKEN=ava_agent_token_2024_unique_identifier
```

### 2. GitHub Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with the following permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
3. Copy the token and add it to your `.env.local` file

### 3. Database Migration
Run the Supabase migration to create the admin tables:

```bash
# If using local Supabase
npx supabase db push

# Or manually run the SQL in your Supabase dashboard:
```

```sql
-- Admin tasks table
CREATE TABLE IF NOT EXISTS admin_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_agent TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  file_path TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Agent activity log
CREATE TABLE IF NOT EXISTS agent_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  task_id UUID REFERENCES admin_tasks(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_agent ON admin_tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_agent_activity_agent_name ON agent_activity(agent_name);
CREATE INDEX IF NOT EXISTS idx_agent_activity_task_id ON agent_activity(task_id);
```

## 🧪 Testing

### 1. Run the Test Script
```bash
node test-github-integration.js
```

This will test:
- Repository connection
- File listing
- File creation
- File deletion

### 2. Test via Admin Dashboard
1. Start your development server: `npm run dev`
2. Navigate to `/admin`
3. Use the "Test Connection" and "Test File Creation" buttons

### 3. Test API Endpoints
```bash
# Test GitHub connection
curl -X GET http://localhost:3000/api/github

# Test file creation
curl -X POST http://localhost:3000/api/github/test \
  -H "Content-Type: application/json" \
  -d '{"testType": "create_file"}'
```

## 📁 File Structure

```
app/
├── api/
│   ├── github/
│   │   ├── route.ts          # Main GitHub operations
│   │   └── test/
│   │       └── route.ts      # GitHub testing
│   └── admin/
│       ├── tasks/
│       │   └── route.ts      # Admin task management
│       └── activity/
│           └── route.ts      # Agent activity logging
├── (dashboard)/
│   └── admin/
│       └── page.tsx          # Admin dashboard UI
└── components/
    └── ui/
        ├── badge.tsx         # Badge component
        └── card.tsx          # Updated with CardDescription

lib/
└── github.ts                 # GitHub service utility

supabase/
└── migrations/
    └── admin_tables.sql      # Database migration

test-github-integration.js    # Standalone test script
```

## 🔄 Available Operations

### GitHub Operations
- **Create File**: Create new files in the repository
- **Update File**: Update existing files
- **Delete File**: Remove files from the repository
- **List Files**: Browse repository contents
- **Get File Content**: Retrieve file contents

### Admin Task Operations
- **Create Task**: Add new administrative tasks
- **Update Task**: Modify task status, assignment, etc.
- **List Tasks**: View all admin tasks
- **Task Activity**: Track task-related activities

### Agent Activity Logging
- **Log Activity**: Record agent actions
- **View Activity**: Browse activity history
- **Filter by Agent**: View specific agent activities
- **Filter by Task**: View task-specific activities

## 🚀 Usage Examples

### Creating a Task with GitHub File
```javascript
// Create admin task
const taskResponse = await fetch('/api/admin/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Update landing page',
    description: 'Update the hero section with new copy',
    assigned_agent: 'DIANA',
    priority: 'high',
    file_path: 'app/page.tsx'
  })
});

// Create GitHub file
const githubResponse = await fetch('/api/github', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'create_file',
    path: 'app/page.tsx',
    content: '// Updated landing page content',
    message: 'Update landing page hero section'
  })
});
```

### Logging Agent Activity
```javascript
await fetch('/api/admin/activity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agent_name: 'DIANA',
    task_id: 'task-uuid',
    action: 'file_updated',
    details: { file_path: 'app/page.tsx', changes: 'Updated hero copy' }
  })
});
```

## 🔒 Security Considerations

1. **GitHub Token**: Store securely in environment variables
2. **Agent Tokens**: Use unique, secure tokens for each agent
3. **Access Control**: Implement proper authentication for admin routes
4. **Rate Limiting**: Be mindful of GitHub API rate limits
5. **Error Handling**: All operations include comprehensive error handling

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check GitHub token permissions
2. **404 Not Found**: Verify repository name and owner
3. **403 Forbidden**: Ensure token has sufficient permissions
4. **Database Errors**: Run Supabase migrations
5. **Component Errors**: Check UI component imports

### Debug Steps

1. Check environment variables are loaded
2. Verify GitHub token is valid
3. Test repository access manually
4. Check browser console for errors
5. Review API response logs

## 📞 Support

If you encounter issues:
1. Check the test script output
2. Review API response logs
3. Verify environment variables
4. Test GitHub token manually
5. Check Supabase connection

---

**Status**: ✅ Implementation Complete
**Next Steps**: 
1. Add your GitHub token to `.env.local`
2. Run the database migration
3. Test the integration
4. Start using the admin dashboard 