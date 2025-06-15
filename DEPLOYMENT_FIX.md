# SELFIE AI™ - Complete Deployment Package

## 🎯 Current Status
✅ Live Supabase connection established: https://zlslzllzejdhyfczcumv.supabase.co
✅ Service role key authenticated and functional
✅ Make.com webhook integration complete
✅ Form submission with fallback system ready
❌ Database table needs creation (5-minute setup)

## 🔧 Required: Create Database Table

**Step 1:** Go to your Supabase dashboard → SQL Editor
**Step 2:** Run this exact SQL command:

```sql
-- Create leads table for SELFIE GUIDE funnel
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'selfie_guide',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "service_role_policy" ON public.leads
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow form submissions from anonymous users
CREATE POLICY "anon_insert_policy" ON public.leads
  AS PERMISSIVE FOR INSERT
  TO anon
  WITH CHECK (true);
```

## 🚀 Deployment Components Ready

### 1. Form Integration
- **Primary:** Make.com webhook at `https://hook.eu2.make.com/cuswnmn5rvse3u7mtc4b60pdus3ku7oe`
- **Fallback:** Direct PDFMonkey integration if webhook fails
- **Error handling:** User always reaches thank-you page

### 2. Make.com Automation
- **Webhook trigger** receives form data
- **PDF generation** using template `1D0EE38C-3FAF-4A16-B5C8-6222AA82A629`
- **Database save** to Supabase leads table
- **Email delivery** via Resend from hello@selfieai.co

### 3. Environment Variables Required
```
SUPABASE_URL=https://zlslzllzejdhyfczcumv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_PDFMONKEY_API_KEY=your_pdfmonkey_key
```

### 4. Files Ready for Deployment
- `client/src/pages/freebie/SelfieGuide.tsx` - Form with webhook integration
- `make-scenario-blueprint.json` - Complete Make.com configuration
- `make-setup-guide.md` - Detailed automation setup
- `test-make-webhook.js` - Webhook testing script

## ✅ Post-Database Verification

After creating the table, run:
```bash
node verify_supabase_auth_flow.js
```

Expected output:
```
✅ Leads table accessible
✅ Lead insertion successful
✅ Lead retrieval successful
✅ Test cleanup successful
🎉 Supabase verification complete - all systems operational!
```

## 🎪 Go Live Steps

1. **Create database table** (SQL above)
2. **Import Make.com scenario** (use blueprint file)
3. **Add API keys** to Make.com environment
4. **Deploy to Vercel** (all files Git-tracked)
5. **Test form submission** end-to-end

The complete automation funnel is ready for deployment once the database table is created.